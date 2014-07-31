#!/usr/bin/env node
"use strict";

var program = require('commander');
var path = require('path');
var fs = require('fs');
var beautify = require('js-beautify').js_beautify;
var readline = require('readline');
var mkdirp = require('mkdirp');

program
  .version('0.0.1')
  .option('-d, --directory <name>', 'give a directory')
  .option('-f, --force', 'force')
  .option('-r, --recursive', 'recursive')
  .option('-p, --replace', 'replace with the current files')
  .parse(process.argv);

if(!program.directory) {
  program.help();
}

var options = {
  "indent_size": 2,
  "indent_char": " ",
  "indent_level": 0,
  "indent_with_tabs": false,
  "preserve_newlines": true,
  "max_preserve_newlines": 2,
  "jslint_happy": true,
  "brace_style": "collapse",
  "keep_array_indentation": false,
  "keep_function_indentation": false,
  "space_before_conditional": true,
  "break_chained_methods": false,
  "eval_code": false,
  "unescape_strings": false,
  "wrap_line_length": 80
};

var cwd = process.cwd();
var base = path.join(cwd, program.directory);
var bbase = path.dirname(base);
var root_dir = base.substr(bbase.length+1);
var out_dir = '__beautified_' + root_dir;

var stack = [];
var count = 0;
walk(base);

function walk(dir) {
  var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  var dirs = fs.readdirSync(dir);
  for (var i = dirs.length - 1; i >= 0; i--) {
    var dir_path = path.join(dir, dirs[i]);
    var stats = fs.lstatSync(dir_path);
    if ( stats.isFile() && path.extname(dirs[i]) === '.js' ) {
      var file = fs.readFileSync(dir_path, 'utf8');
      var tail = dir.substr(base.length+1);
      var output_path = path.resolve(cwd, out_dir, tail, dirs[i]);
      mkdirp.sync(path.resolve(cwd, out_dir, tail));
      var output_content = beautify(file, options);
      fs.writeFileSync(output_path, output_content);
      count++;
    }
  }
  if (program.recursive) {
    x(0);
  } else {
    rl.close();
  }
  function x(index) {
    // console.log(index, dirs.length, dirs[index]);
    if ( index >= dirs.length ) {
      rl.close();
      if (stack.length > 0 ) {
        walk(stack.shift());
      } else {
        console.log(count, 'js files are created or updated');
      }
      return;
    }
    var dir_path = path.join(dir, dirs[index]);
    var stats = fs.lstatSync(dir_path);
    if (stats.isDirectory()) {
      if (!program.force) {
        // rl.resume();
        rl.question('Do you want to beautify "' + dir_path + '"? y/n: ', function(answer) {
          // rl.pause();
          if (answer === 'y') {
            stack.unshift(dir_path);
          }
          x(index+1);
        });
      } else {
        stack.unshift(dir_path);
        x(index+1);
      }
    } else {
      x(index+1);
    }
  }
}
