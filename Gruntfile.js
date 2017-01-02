'use strict';

module.exports = function (grunt) {
    grunt.initConfig({
        clean: ["SlideHub-darwin-x64", "SlideHub-win32-x64", "SlideHub.dmg"],
        shell: {
            build_mac: {
                command: './node_modules/.bin/electron-packager . SlideHub --platform=darwin --arch=x64 --version=0.35.1 --icon=SlideHub.icns --overwrite'
            },
            build: {
                command: './node_modules/.bin/electron-packager . SlideHub --platform=darwin,win32 --arch=x64 --version=0.35.1 --icon=SlideHub.icns --overwrite'
            },
            mac: {
                command: 'hdiutil create -ov -srcfolder ./SlideHub-darwin-x64 -fs HFS+ -format UDZO -imagekey zlib-level=9 -volname "SlideHub" SlideHub.dmg'
            }
        },
        'plato': {
            options: {
                jshint: grunt.file.readJSON('.jshintrc')
            },
            report: {
                files: {
                    'report': [
                        'Gruntfile.js',
                        'index.js',
                        'assets/js/*.js'
                    ]
                }
            }
        },
        'open': {
            file: {
                path: './report/index.html'
            }
        },
        'http-server': {
            'dev': {
                root: "./",
                port: 8282,
                host: "127.0.0.1",
                cache: 1,
                showDir : true,
                autoIndex: true,
                ext: "html",
                runInBackground: false,
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-csslint');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-shell');
    grunt.loadNpmTasks('grunt-plato');
    grunt.loadNpmTasks('grunt-open');
    grunt.loadNpmTasks('grunt-http-server');
    grunt.registerTask('default', ['watch']);
};
