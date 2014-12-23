module.exports = function (grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		less: {
			development: {
				options: {
					compress: true,
				},
				files: {
					"public/asterion.min.css": "styles/main.less"
				}
			}
		},

		ngAnnotate: {
			prod: {	
				files: {
					'scripts/annotated.js': [
						'scripts/angular/angular.min.js',
						'scripts/angular/angular-route.min.js',
						'scripts/angular/angular-cookies.min.js'					
					]
				}
			}
		},

		concat: {
			yossarian: {
				src: [
					'scripts/libs/jquery-1.11.2.js',
					'scripts/libs/moment-with-locales.js', 
					'scripts/libs/socket.io.js', 
					'scripts/annotated.js', 
				],
				dest: 'public/asterion.js',
			},
		},

		uglify: {
			yossarian: {
				src: 'public/asterion.js',
				dest: 'public/asterion.min.js'
			},
			options: {
				mangle: false
			}
		},

		watch: {
			front: {
				files: [
					'scripts/*.js', 
					'scripts/libs/*.js', 
					'scripts/angular/*.js'
				],
				tasks: ['ngAnnotate', 'concat'],
				options: {
					spawn: false,
				},
			},
			styles: {
				files: ['styles/*.less'],
				tasks: ['less'],
				options: {
					nospawn: true,
				},
			} 
		}
	});

	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-ng-annotate');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-watch');

	grunt.registerTask('default', ['less', 'ngAnnotate', 'concat', 'uglify', 'watch']);
};
