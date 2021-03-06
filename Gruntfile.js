module.exports = function (grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		less: {
			development: {
				options: { compress: true },
				files: {
					"public/asterion.css": "styles/main.less"
				}
			}
		},

		ngAnnotate: {
			prod: {	
				files: {
					'scripts/annotated.js': [
						'scripts/angular/angular.min.js',
						'scripts/angular/angular-route.min.js',
						'scripts/angular/angular-cookies.min.js',
						'scripts/angular/angular-sanitize.min.js',
						'scripts/config.js',
						'scripts/global.js',
						'scripts/drawer.js',
						'scripts/selection.js',
						'scripts/carts.js',
						'scripts/dash.js',
						'scripts/search.js',
						'scripts/detail.js',
						'scripts/advanced.js',
						'scripts/outside.js',
						'scripts/isbn.js',
						'scripts/tracing.js',
						'scripts/standing.js',
						'scripts/nts.js',
						'scripts/approval.js',
						'scripts/profile.js',
						'scripts/help.js',
					]
				}
			}
		},

		concat: {
			yossarian: {
				src: [
					'scripts/libs/jquery-1.11.1.js',
					'scripts/libs/socket.io.js', 
					'scripts/libs/moment-with-locales.js', 
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
			options: { mangle: false }
		},

		watch: {
			front: {
				files: [
					'scripts/*.js', 
					'scripts/libs/*.js', 
					'scripts/angular/*.js'
				],
				tasks: ['ngAnnotate', 'concat'],
				options: { spawn: false },
			},
			styles: {
				files: ['styles/*.less'],
				tasks: ['less'],
				options: { nospawn: true },
			} 
		},

		nodemon: {
			dev: {
				script: 'app.js',
				options: {
					ignore: ['node_modules/**', 'scripts/**', 'styles/**', 'views/**', 'public/**'],
				}
			}
		},

		concurrent: {
			start: {
				tasks: ['nodemon', 'watch'],
				options: { logConcurrentOutput: true }
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-ng-annotate');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-nodemon');
	grunt.loadNpmTasks('grunt-concurrent');

	grunt.registerTask('default', ['less', 'ngAnnotate', 'concat', 'uglify', 'concurrent:start']);
};
