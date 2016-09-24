module.exports = function(grunt) {
  require('jit-grunt')(grunt);

  grunt.initConfig({
    less: {
      development: {
        options: {
          compress: true,
          yuicompress: true,
          optimization: 2
        },
        files: {
          "public/node.min.css": ["public/css/main.less", "public/css/api.less"] 
        }
      }
    },
    
    uglify: {
      options: {
        manage: false  
      },
      dist: {
        files: {
          'public/init.min.js': 'public/init.js',
          'public/login.min.js': 'public/login.js',
          'public/register.min.js': 'public/register.js',
          'public/chat.min.js': 'public/chat.js',
          'public/body.min.js': 'public/body.js',
          'public/button.min.js': 'public/button.js',
          'public/label.min.js': 'public/label.js',
          'public/linklabel.min.js': 'public/linklabel.js',
          'public/table.min.js': 'public/table.js',
          'public/textarea.min.js': 'public/textarea.js',
          'public/passwordfield.min.js': 'public/passwordfield.js',
          'public/textfield.min.js': 'public/textfield.js',
          'public/ul.min.js': 'public/ul.js'
        }
      }
    }
  });
  
  grunt.registerTask('default', ['less', 'uglify']);
};