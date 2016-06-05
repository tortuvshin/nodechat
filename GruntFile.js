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
          "public/main.css": "public/main.less" 
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
          'public/api/body.min.js': 'public/api/body.js',
          'public/api/button.min.js': 'public/api/button.js',
          'public/api/label.min.js': 'public/api/label.js',
          'public/api/linklabel.min.js': 'public/api/linklabel.js',
          'public/api/table.min.js': 'public/api/table.js',
          'public/api/textarea.min.js': 'public/api/textarea.js',
          'public/api/passwordfield.min.js': 'public/api/passwordfield.js',
          'public/api/textfield.min.js': 'public/api/textfield.js',
          'public/api/ul.min.js': 'public/api/ul.js'
        }
      }
    }
  });
  
  grunt.registerTask('default', ['less', 'uglify']);
};