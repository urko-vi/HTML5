module.exports = function (grunt) {
    require("load-grunt-tasks")(grunt); // npm install --save-dev load-grunt-tasks

    grunt.initConfig({
        "babel": {
            options: {
                sourceMap: false,
                presets: ['es2015']
            },
            dist: {
                files: {
                    "out/main.js": "js/main.js"
                }
            }
        }
    });

    grunt.registerTask("default", ["babel"]);
};
