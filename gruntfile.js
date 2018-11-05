'use strict';

module.exports = function config(grunt) {
  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    meta: {
      banner: '/* <%= pkg.name %> v<%= pkg.version %> | (c) <%= grunt.template.today("yyyy") %> */\n'
    },

    clean: {
      dist: 'dist/**'
    },

    usebanner: {
      all: {
        options: {
          banner: '<%= meta.banner %>',
          linebreak: false
        },
        files: {
          src: ['dist/*.js']
        }
      }
    },

    eslint: {
      target: ['lib/**/*.js']
    },

    mochaTest: {
      test: {
        src: ['test/unit/*.js', 'test/unit/maizal/*.js']
      },
      options: {
        timeout: 30000
      }
    },

    watch: {
      build: {
        files: ['lib/**/*.js'],
        tasks: ['build']
      },
      test: {
        files: ['lib/**/*.js', 'test/**/*.js'],
        tasks: ['test']
      }
    }

    //webpack: require('./webpack.config.js')
  });

  grunt.registerTask('test', 'Run the jasmine and mocha tests', ['mochaTest']);
  grunt.registerTask('build', 'Run webpack and bundle the source', ['clean', 'webpack']);
};
