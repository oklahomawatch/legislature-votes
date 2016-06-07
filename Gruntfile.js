module.exports = function(grunt) {
  'use strict';

  // Project configuration.
  grunt.initConfig({

    // Copy files to the static directory
    copy: {
      fonts: {
        src: [
          'node_modules/font-awesome/fonts/**'
        ],
        dest: 'dist/css/fonts/',
        flatten: true,
        expand: true
      }
    },

    // Transpile LESS
    less: {
      options: {
        sourceMap: true,
        paths: ['node_modules/bootstrap/less']
      },
      prod: {
        options: {
          compress: true,
          cleancss: true
        },
        files: {
          "dist/css/style.css": [
            "src/less/style.less"
          ]
        }
      }
    },

    // Run our JavaScript through JSHint
    jshint: {
      js: {
        src: ['src/js/**.js']
        }
    },

    uglify: {
      options: {
        sourceMap: true
      },
      prod: {
        files: {
          'dist/js/scripts.js': [
            'node_modules/jquery/dist/jquery.js',
            'node_modules/underscore/underscore-min.js',
            'node_modules/bootstrap/js/button.js',
            'node_modules/bootstrap/js/collapse.js',
            'node_modules/bootstrap/js/affix.js',
            'node_modules/bootstrap/js/tooltip.js',
            'node_modules/bootstrap/js/popover.js',
            'node_modules/bootstrap/js/tab.js',
            'node_modules/bootstrap/js/scrollspy.js',
            'node_modules/bootstrap/js/dropdown.js',
            'node_modules/bootstrap/js/transition.js',
            'src/js/main.js'
          ]
        }
      }
    },

    // Watch for changes in LESS and JavaScript files,
    // relint/retranspile when a file changes
    watch: {
      styles: {
        files: ['src/less/**/*.less'],
        tasks: ['less']
      },
      scripts: {
        files: ['src/js/**/*.js'],
        tasks: ['jshint', 'uglify']
      }
    }
  });

  // Load the task plugins
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-copy');

  grunt.registerTask('default', ['copy:fonts', 'uglify', 'jshint', 'less']);

};
