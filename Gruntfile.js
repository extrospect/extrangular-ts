module.exports = function (grunt) {
    var globalConfig = {
        sortedFiles: []
    },
        DEBUG = grunt.option('debug');

    grunt.loadNpmTasks('grunt-shell');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-karma');

    grunt.initConfig({
        shell: {
            options: {
                stdout: true
            },
            npm_install: {
                command: 'npm install'
            }
        },
        /**
         * The Karma configurations.
         */
        karma: {
            options: {
                configFile: 'config/karma.conf.js'
            },
            unit: {
                options: {
                    files: globalConfig.sortedFiles
                },
                background: true
            },
            continuous: {
                singleRun: true
            }
        },

        watch: {
            options: {
                livereload: true
            },

            jssrc: {
                files: [
                    'app/ts/**.js'
                ],
                tasks: [ 'orderFiles', 'karma:unit:run' ]
            },

            jsunit: {
                files: [
                    'test/unit/*Spec.js'
                ],
                tasks: [ 'orderFiles', 'karma:unit:run' ],
                options: {
                    livereload: false
                }
            }
        },

        orderFiles: {
            files: {
                src: [
                    'app/ts/**.js',
                    'test/**/*.js'
                ]
            }
        }
    });

    //defaults
    grunt.registerTask('default', ['update']);

    grunt.registerTask('update', ['shell:npm_install']);

    grunt.registerTask( 'dev', ['karma:unit:start', 'watch'] );

    /**
     *
     */
    var TopologicalSorter = function(extractDependencies) {

        this.Node = function(name) {
            this.name = name;
            this.inEdges = [];
            this.outEdges = [];

            this.equals = function(n) {
                return n.name === this.name;
            }
        };

        this.CycleStack = function() {
            var stack = [];

            this.reset = function() {
                stack = [];
            };

            this.add = function(node) {
                var i = 0,
                    len = stack.length;

                for(; i < len; i++) {
                    if(node.equals(stack[i])) {
                        grunt.log.error('Cyclical dependency encountered! (' + node.name + ')');
                        return;
                    }
                }

                stack.push(node);
            }

            this.remove = function(node) {
                var i = 0,
                    len = stack.length;

                for(; i < len; i++) {
                    if(node.equals(stack[i])) {
                        stack.splice(i, 1);
                        i--;
                        len--;
                    }
                }
            }
        }

        var _extractDependencies = extractDependencies;

        var self = this;

        var allNodes = [];

        function getOrAddNode(name) {
            var i = 0,
                len = allNodes.length;

            for(; i < len; i++) {
                if(allNodes[i].name === name) {
                    return allNodes[i];
                }
            }
            return allNodes.push(new self.Node(name)),
                allNodes[allNodes.length-1];
        }

        this.importFiles = function(files) {
            if(files) {
                var path = require('path');
                files.forEach(function(filepath) {
                    content = grunt.file.read(filepath);
                    var dirname = path.dirname(filepath);
                    var resolved = path.resolve(filepath);
                    var node = getOrAddNode(resolved);

                    dependencies = _extractDependencies(filepath, content);
                    dependencies.forEach(function(dependency) {
                        resolvedDependency = path.resolve(dirname, dependency);
                        var childNode = getOrAddNode(resolvedDependency);

                        node.outEdges.push(childNode);
                        childNode.inEdges.push(node);
                    });
                });
                debugPrintAllNodes();
            } else {
                grunt.log.error('Paths array must contain at least one value.');
            }
        }

        function debugPrintAllNodes() {
            if(DEBUG) {
                var nI = 0;
                allNodes.forEach(function(node) {
                    grunt.log.writeln('allNodes[' + nI++ + ']: ' + node.name);
                    node.inEdges.forEach(function(inEdge) {
                        grunt.log.writeln('\tIn Edge: ' + inEdge.name);
                    });
                    node.outEdges.forEach(function(outEdge) {
                        grunt.log.writeln('\tOut Edge: ' + outEdge.name);
                    });
                });
            }
        }

        this.sortNodes = function() {
            var sortedNodes = [],
                noIncomingEdges = [],
                cycleStack = new this.CycleStack(),
                currentNode,
                childNode,
                i,
                len;

            allNodes.forEach(function(node) {
                if(node.inEdges.length === 0) {
                    noIncomingEdges.push(node);
                }
            });

            if(noIncomingEdges.length === 0) {
                grunt.log.error('Dependency graph does not have a root node!');
            }

            while(noIncomingEdges.length) {
                currentNode = noIncomingEdges.pop();
                sortedNodes.push(currentNode);

                cycleStack.add(currentNode);

                while(currentNode.outEdges.length) {
                    // Remove an outgoing edge to a child node
                    childNode = currentNode.outEdges.pop();

                    // Remove the incoming edge that childNode has from currentNode
                    for(i = 0, len = childNode.inEdges.length; i < len; i++) {
                        if(childNode.inEdges[i].name === currentNode.name) {
                            childNode.inEdges.splice(i, 1);
                            i--;
                            len--;
                            break;
                        }
                    }

                    // If the childNode has no incoming edges left then it goes onto noIncomingEdges
                    if(childNode.inEdges.length === 0) {
                        noIncomingEdges.push(childNode);
                    }
                }
            }

            // TODO: Proper cycle checking (by walking the graph?)
            poormansCycleCheck(childNode);

            return sortedNodes;
        };

        function poormansCycleCheck(bestGuessOfProblemNode) {
            var cycle = null;

            allNodes.forEach(function(node) {
                if(node.inEdges.length > 0){
                    cycle = node.name;
                    return false;;
                }
            });

            if(cycle){
                grunt.log.error('Cycle found around: \'' + bestGuessOfProblemNode.name + '\' - topological sort not possible.');
            }
        }
    };

    grunt.registerMultiTask('orderFiles', 'Orders files based on dependency tree.', function() {
        var defaultOptions = {
            getMatches: function (regex, string, index) {
                var matches = [], match;
                if(arguments.length < 3){
                    index = 1;
                }
                while (match = regex.exec(string)) {
                    matches.push(match[index]);
                }
                return matches;
            },
            extractDependencies: function (filepath, filecontent) {
                var required = this.getMatches(/\/\/\/ <reference path=\"(.*?)"(?!.*-ignore[\r\n])/g, filecontent);
                var filtered = required.filter(function(dependency) {
                    return dependency.indexOf('.d.ts', dependency.length - 5) === -1;
                });

                var extensionConverted = [];
                filtered.forEach(function(dep) {
                    extensionConverted.push(dep.replace(/\.ts\s*$/, '.js'));
                });

                return extensionConverted;
            }
        }

        var options = this.options(defaultOptions);

        var ts = new TopologicalSorter(options.extractDependencies.bind(options));
        ts.importFiles(this.filesSrc);

        var sorted = ts.sortNodes();
        sorted.reverse();



        if(DEBUG) {
            grunt.log.writeln();
            grunt.log.writeln('Sort completed.');
        }

        var cwd = process.cwd(),
            path = require('path');

        globalConfig.sortedFiles = [];
        sorted.forEach(function(node) {
            // make sorted paths relative to cwd
            var relativePath = path.relative(cwd, node.name);
            globalConfig.sortedFiles.push(relativePath);
            if(DEBUG) {
                grunt.log.writeln(relativePath);
            }
        });

        if (this.errorCount) { return false; }
    });
};
