"use strict";

module.exports = function (grunt) {
	require("time-grunt")(grunt);
	require('load-grunt-tasks')(grunt);
	
	grunt.initConfig({
		pkg: grunt.file.readJSON("package.json"),
        babel: {
			options: {
			  	presets: ['@babel/preset-env']
			},
			dist: {
			  	files: [{
					expand: true,
					cwd: "src/js/",
					src: ['**/*.js'],
					dest: 'src/www/static/js/'
				}]
			}
		},
        uglify: {
			dist: {
                files: [{
					expand: true,
					cwd: "src/dist/",
					src: ['**/*.js'],
					dest: 'src/www/static/js/'
				}]
            }
		},
        watch: {
            files: [
				'<%= uglify.dist.files %>',
				'<%= babel.dist.files %>'
            ],
            tasks: [
                'uglify',
				'babel'
            ]
        },
        copy: {
			main: {
				files: [
					{
						expand: true, 
						cwd: "node_modules/bootstrap/dist/css/",
						src: "bootstrap.min.css", 
						dest: "src/www/static/assets/css/", 
						filter: "isFile"
					},{
						expand: true, 
						cwd: "node_modules/bootstrap/dist/css/",
						src: "bootstrap.min.css.map", 
						dest: "src/www/static/assets/css/", 
						filter: "isFile"
					},{
						expand: true, 
						cwd: "node_modules/bootstrap/dist/js/",
						src: "bootstrap.bundle.min.js", 
						dest: "src/www/static/assets/js/", 
						filter: "isFile"
					},{
						expand: true, 
						cwd: "node_modules/bootstrap/dist/js/",
						src: "bootstrap.bundle.min.js.map", 
						dest: "src/www/static/assets/js/", 
						filter: "isFile"
					},{
						expand: true, 
						cwd: "node_modules/backbone/",
						src: "backbone.js", 
						dest: "src/www/static/assets/js/", 
						filter: "isFile"
					},{
						expand: true, 
						cwd: "node_modules/underscore/",
						src: "underscore-umd.js", 
						dest: "src/www/static/assets/js/", 
						filter: "isFile"
					},{
						expand: true, 
						cwd: "node_modules/jquery/dist/",
						src: "jquery.js", 
						dest: "src/www/static/assets/js/", 
						filter: "isFile"
					},{
						expand: true, 
						cwd: "node_modules/underscore/",
						src: "underscore-umd.js.map", 
						dest: "src/www/static/assets/js/", 
						filter: "isFile"
					},
					{
						expand: true, 
						cwd: "node_modules/axios/dist/",
						src: "axios.min.js", 
						dest: "src/www/static/assets/js/", 
						filter: "isFile"
					},
					{
						expand: true, 
						cwd: "node_modules/axios/dist/",
						src: "axios.min.js.map", 
						dest: "src/www/static/assets/js/", 
						filter: "isFile"
					},
					{
						expand: true, 
						cwd: "node_modules/handlebars/dist/",
						src: "handlebars.min.js", 
						dest: "src/www/static/assets/js/", 
						filter: "isFile"
					}
				]
			}
		}
    });

    grunt.registerTask("default", [
		"babel",
		"copy"
	]);
};