var ho;
(function (ho) {
    var promise;
    (function (promise) {
        var Promise = (function () {
            function Promise(func) {
                this.data = undefined;
                this.onResolve = undefined;
                this.onReject = undefined;
                this.resolved = false;
                this.rejected = false;
                this.done = false;
                this.ret = undefined;
                if (typeof func === 'function')
                    func.call(arguments.callee, function (arg) {
                        this.resolve(arg);
                    }.bind(this), function (arg) {
                        this.reject(arg);
                    }.bind(this));
            }
            Promise.prototype.set = function (data) {
                if (this.done)
                    throw "Promise is already resolved / rejected";
                this.data = data;
            };
            Promise.prototype.resolve = function (data) {
                this.set(data);
                this.resolved = this.done = true;
                if (typeof this.onResolve === 'function') {
                    this._resolve();
                }
            };
            Promise.prototype._resolve = function () {
                if (this.ret === undefined) {
                    this.ret = new Promise();
                }
                var v = this.onResolve(this.data);
                if (v && v instanceof Promise) {
                    v.then(this.ret.resolve.bind(this.ret), this.ret.reject.bind(this.ret));
                }
                else {
                    this.ret.resolve(v);
                }
            };
            Promise.prototype.reject = function (data) {
                this.set(data);
                this.rejected = this.done = true;
                if (typeof this.onReject === 'function') {
                    this.onReject(this.data);
                }
                if (this.ret) {
                    this.ret.reject(this.data);
                }
            };
            Promise.prototype._reject = function () {
                if (this.ret === undefined) {
                    this.ret = new Promise();
                }
                if (typeof this.onReject === 'function')
                    this.onReject(this.data);
                this.ret.reject(this.data);
            };
            Promise.prototype.then = function (res, rej) {
                if (this.ret === undefined) {
                    this.ret = new Promise();
                }
                if (res && typeof res === 'function')
                    this.onResolve = res;
                if (rej && typeof rej === 'function')
                    this.onReject = rej;
                if (this.resolved) {
                    this._resolve();
                }
                if (this.rejected) {
                    this._reject();
                }
                return this.ret;
            };
            Promise.prototype.catch = function (cb) {
                this.onReject = cb;
                if (this.rejected)
                    this._reject();
            };
            Promise.all = function (arr) {
                var p = new Promise();
                var data = [];
                if (arr.length === 0) {
                    p.resolve();
                }
                else {
                    arr.forEach(function (prom, index) {
                        prom
                            .then(function (d) {
                            if (p.done)
                                return;
                            data[index] = d;
                            var allResolved = arr.reduce(function (state, p1) {
                                return state && p1.resolved;
                            }, true);
                            if (allResolved) {
                                p.resolve(data);
                            }
                        })
                            .catch(function (err) {
                            p.reject(err);
                        });
                    });
                }
                return p;
            };
            Promise.chain = function (arr) {
                var p = new Promise();
                var data = [];
                function next() {
                    if (p.done)
                        return;
                    var n = arr.length ? arr.shift() : p;
                    n.then(function (result) {
                        data.push(result);
                        next();
                    }, function (err) {
                        p.reject(err);
                    });
                }
                next();
                return p;
            };
            Promise.create = function (obj) {
                if (obj instanceof Promise)
                    return obj;
                else {
                    var p = new Promise();
                    p.resolve(obj);
                    return p;
                }
            };
            return Promise;
        })();
        promise.Promise = Promise;
    })(promise = ho.promise || (ho.promise = {}));
})(ho || (ho = {}));

var ho;
(function (ho) {
    var classloader;
    (function (classloader) {
        var util;
        (function (util) {
            function get(path, obj) {
                if (obj === void 0) { obj = window; }
                path.split('.').map(function (part) {
                    obj = obj[part];
                });
                return obj;
            }
            util.get = get;
        })(util = classloader.util || (classloader.util = {}));
    })(classloader = ho.classloader || (ho.classloader = {}));
})(ho || (ho = {}));

var ho;
(function (ho) {
    var classloader;
    (function (classloader) {
        var util;
        (function (util) {
            function expose(name, obj, error) {
                if (error === void 0) { error = false; }
                var path = name.split('.');
                name = path.pop();
                var global = window;
                path.map(function (part) {
                    global[part] = global[part] || {};
                    global = global[part];
                });
                if (!!global[name]) {
                    var msg = "Global object " + path.join('.') + "." + name + " already exists";
                    if (error)
                        throw msg;
                    else
                        console.info(msg);
                }
                global[name] = obj;
            }
            util.expose = expose;
        })(util = classloader.util || (classloader.util = {}));
    })(classloader = ho.classloader || (ho.classloader = {}));
})(ho || (ho = {}));

var ho;
(function (ho) {
    var classloader;
    (function (classloader) {
        var xhr;
        (function (xhr) {
            function get(url) {
                return new ho.promise.Promise(function (resolve, reject) {
                    var xmlhttp = new XMLHttpRequest();
                    xmlhttp.onreadystatechange = function () {
                        if (xmlhttp.readyState == 4) {
                            var resp = xmlhttp.responseText;
                            if (xmlhttp.status == 200) {
                                resolve(resp);
                            }
                            else {
                                reject(resp);
                            }
                        }
                    };
                    xmlhttp.open('GET', url);
                    xmlhttp.send();
                });
            }
            xhr.get = get;
        })(xhr = classloader.xhr || (classloader.xhr = {}));
    })(classloader = ho.classloader || (ho.classloader = {}));
})(ho || (ho = {}));



var ho;
(function (ho) {
    var classloader;
    (function (classloader) {
        var LoadArguments = (function () {
            function LoadArguments(arg, resolveUrl) {
                this.name = arg.name;
                this.url = arg.url || resolveUrl(arg.name);
                this.parent = arg.parent || true;
                this.expose = arg.expose || true;
                this.super = arg.super;
            }
            return LoadArguments;
        })();
        classloader.LoadArguments = LoadArguments;
    })(classloader = ho.classloader || (ho.classloader = {}));
})(ho || (ho = {}));

var ho;
(function (ho) {
    var classloader;
    (function (classloader) {
        (function (WarnLevel) {
            WarnLevel[WarnLevel["INFO"] = 0] = "INFO";
            WarnLevel[WarnLevel["ERROR"] = 1] = "ERROR";
        })(classloader.WarnLevel || (classloader.WarnLevel = {}));
        var WarnLevel = classloader.WarnLevel;
        var LoaderConfig = (function () {
            function LoaderConfig(c) {
                if (c === void 0) { c = {}; }
                this.loadType = c.loadType || classloader.LoadType.EVAL;
                this.urlTemplate = c.urlTemplate || "${name}.js";
                this.useDir = typeof c.useDir === 'boolean' ? c.useDir : true;
                this.useMin = typeof c.useMin === 'boolean' ? c.useMin : false;
                //this.exists = c.exists || this.exists.bind(this);
                this.cache = typeof c.cache === 'boolean' ? c.cache : true;
                this.warnLevel = c.warnLevel || WarnLevel.INFO;
            }
            return LoaderConfig;
        })();
        classloader.LoaderConfig = LoaderConfig;
    })(classloader = ho.classloader || (ho.classloader = {}));
})(ho || (ho = {}));

var ho;
(function (ho) {
    var classloader;
    (function (classloader) {
        (function (LoadType) {
            LoadType[LoadType["SCRIPT"] = 0] = "SCRIPT";
            LoadType[LoadType["FUNCTION"] = 1] = "FUNCTION";
            LoadType[LoadType["EVAL"] = 2] = "EVAL";
        })(classloader.LoadType || (classloader.LoadType = {}));
        var LoadType = classloader.LoadType;
    })(classloader = ho.classloader || (ho.classloader = {}));
})(ho || (ho = {}));

var ho;
(function (ho) {
    var classloader;
    (function (classloader) {
        classloader.mapping = {};
        var ClassLoader = (function () {
            function ClassLoader(c) {
                this.conf = {};
                this.cache = {};
                this.conf = new classloader.LoaderConfig(c);
            }
            ClassLoader.prototype.config = function (c) {
                this.conf = new classloader.LoaderConfig(c);
            };
            ClassLoader.prototype.load = function (arg) {
                arg = new classloader.LoadArguments(arg, this.resolveUrl.bind(this));
                switch (this.conf.loadType) {
                    case classloader.LoadType.SCRIPT:
                        return this.load_script(arg);
                        break;
                    case classloader.LoadType.FUNCTION:
                        return this.load_function(arg);
                        break;
                    case classloader.LoadType.EVAL:
                        return this.load_eval(arg);
                        break;
                }
            };
            ClassLoader.prototype.load_script = function (arg) {
                var self = this;
                var parents = [];
                var p = new ho.promise.Promise();
                if (this.conf.cache && !!this.cache[arg.name])
                    return ho.promise.Promise.create([this.cache[arg.name]]);
                if (!!arg.parent) {
                    this.getParentName(arg.url)
                        .then(function (parentName) {
                        //if(arg.super === parentName)
                        if (arg.super.indexOf(parentName) !== -1)
                            return [];
                        else
                            return self.load({ name: parentName, parent: true, expose: arg.expose, super: arg.super });
                    })
                        .then(function (p) {
                        parents = p;
                        return load_internal();
                    })
                        .then(function (clazz) {
                        if (self.conf.cache)
                            self.cache[arg.name] = clazz;
                        parents = parents.concat(clazz);
                        p.resolve(parents);
                    });
                }
                else {
                    load_internal()
                        .then(function (clazz) {
                        p.resolve(clazz);
                    });
                }
                return p;
                function load_internal() {
                    var _this = this;
                    return new ho.promise.Promise(function (resolve, reject) {
                        var src = arg.url;
                        var script = document.createElement('script');
                        script.onload = function () {
                            if (typeof classloader.util.get(arg.name) === 'function')
                                resolve([classloader.util.get(arg.name)]);
                            else
                                reject("Error while loading Class " + arg.name);
                        }.bind(_this);
                        script.src = src;
                        document.getElementsByTagName('head')[0].appendChild(script);
                    });
                }
            };
            ClassLoader.prototype.load_function = function (arg) {
                var self = this;
                var parents = [];
                var source;
                return classloader.xhr.get(arg.url)
                    .then(function (src) {
                    source = src;
                    if (!!arg.parent) {
                        var parentName = self.parseParentFromSource(src);
                        //if(arg.super === parentName)
                        if (arg.super.indexOf(parentName) !== -1)
                            return [];
                        else
                            return self.load({ name: parentName, parent: true, expose: arg.expose, super: arg.super });
                    }
                })
                    .then(function (p) {
                    parents = p;
                    var src = source + "\nreturn " + arg.name + "\n//# sourceURL=" + window.location.href + arg.url;
                    var clazz = new Function(src)();
                    if (arg.expose)
                        classloader.util.expose(arg.name, clazz, self.conf.warnLevel == classloader.WarnLevel.ERROR);
                    return clazz;
                })
                    .then(function (clazz) {
                    if (self.conf.cache)
                        self.cache[arg.name] = clazz;
                    parents.push(clazz);
                    return parents;
                });
            };
            ClassLoader.prototype.load_eval = function (arg) {
                var self = this;
                var parents = [];
                var source;
                return classloader.xhr.get(arg.url)
                    .then(function (src) {
                    source = src;
                    if (!!arg.parent) {
                        var parentName = self.parseParentFromSource(src);
                        //if(arg.super === parentName)
                        if (arg.super.indexOf(parentName) !== -1)
                            return [];
                        else
                            return self.load({ name: parentName, parent: true, expose: arg.expose, super: arg.super });
                    }
                })
                    .then(function (p) {
                    parents = p;
                    var ret = "\n(function(){return " + arg.name + ";})();";
                    var src = source + ret + "\n//# sourceURL=" + window.location.href + arg.url;
                    var clazz = eval(src);
                    if (arg.expose)
                        classloader.util.expose(arg.name, clazz, self.conf.warnLevel == classloader.WarnLevel.ERROR);
                    return clazz;
                })
                    .then(function (clazz) {
                    if (self.conf.cache)
                        self.cache[arg.name] = clazz;
                    parents.push(clazz);
                    return parents;
                });
            };
            ClassLoader.prototype.getParentName = function (url) {
                var self = this;
                return classloader.xhr.get(url)
                    .then(function (src) {
                    return self.parseParentFromSource(src);
                });
            };
            ClassLoader.prototype.parseParentFromSource = function (src) {
                var r_super = /}\)\((.*)\);/;
                var match = src.match(r_super);
                if (match)
                    return match[1];
                else
                    return undefined;
            };
            ClassLoader.prototype.resolveUrl = function (name) {
                if (!!classloader.mapping[name])
                    return classloader.mapping[name];
                if (this.conf.useDir) {
                    name += '.' + name.split('.').pop();
                }
                name = name.split('.').join('/');
                if (this.conf.useMin)
                    name += '.min';
                return this.conf.urlTemplate.replace('${name}', name);
            };
            ClassLoader.prototype.exists = function (name) {
                return !!this.cache[name];
            };
            return ClassLoader;
        })();
        classloader.ClassLoader = ClassLoader;
    })(classloader = ho.classloader || (ho.classloader = {}));
})(ho || (ho = {}));

/// <reference path="../../../bower_components/ho-promise/dist/promise.d.ts"/>
var ho;
(function (ho) {
    var classloader;
    (function (classloader) {
        var loader = new classloader.ClassLoader();
        function config(c) {
            loader.config(c);
        }
        classloader.config = config;
        ;
        function load(arg) {
            return loader.load(arg);
        }
        classloader.load = load;
        ;
    })(classloader = ho.classloader || (ho.classloader = {}));
})(ho || (ho = {}));

var ho;
(function (ho) {
    var watch;
    (function (watch_1) {
        function watch(obj, name, handler) {
            new Watcher(obj, name, handler);
        }
        watch_1.watch = watch;
        var Watcher = (function () {
            function Watcher(obj, name, handler) {
                var _this = this;
                this.obj = obj;
                this.name = name;
                this.handler = handler;
                this.oldVal = this.copy(obj[name]);
                this.watch(function (timestamp) {
                    if (_this.oldVal !== obj[name]) {
                        _this.handler.call(null, obj, name, _this.oldVal, obj[name], timestamp);
                        _this.oldVal = _this.copy(obj[name]);
                    }
                });
            }
            Watcher.prototype.watch = function (cb) {
                var fn = window.requestAnimationFrame ||
                    window.webkitRequestAnimationFrame ||
                    window.mozRequestAnimationFrame ||
                    window.oRequestAnimationFrame ||
                    window.msRequestAnimationFrame ||
                    function (callback) {
                        window.setTimeout(callback, 1000 / 60);
                    };
                var wrap = function (ts) {
                    cb(ts);
                    fn(wrap);
                };
                fn(wrap);
            };
            Watcher.prototype.copy = function (val) {
                return JSON.parse(JSON.stringify(val));
            };
            return Watcher;
        })();
    })(watch = ho.watch || (ho.watch = {}));
})(ho || (ho = {}));

var ho;
(function (ho) {
    var components;
    (function (components) {
        var temp;
        (function (temp) {
            var c = -1;
            var data = [];
            function set(d) {
                c++;
                data[c] = d;
                return c;
            }
            temp.set = set;
            function get(i) {
                return data[i];
            }
            temp.get = get;
            function call(i) {
                var args = [];
                for (var _i = 1; _i < arguments.length; _i++) {
                    args[_i - 1] = arguments[_i];
                }
                data[i].apply(data, args);
            }
            temp.call = call;
        })(temp = components.temp || (components.temp = {}));
    })(components = ho.components || (ho.components = {}));
})(ho || (ho = {}));

var ho;
(function (ho) {
    var components;
    (function (components) {
        var styler;
        (function (styler) {
            var Styler = (function () {
                function Styler() {
                }
                Styler.prototype.applyStyle = function (component, css) {
                    var _this = this;
                    if (css === void 0) { css = component.style; }
                    var style = this.parseStyle(component.style);
                    style.forEach(function (s) {
                        _this.applyStyleBlock(component, s);
                    });
                };
                Styler.prototype.applyStyleBlock = function (component, style) {
                    var _this = this;
                    if (style.selector.trim().toLowerCase() === 'this') {
                        style.rules.forEach(function (r) {
                            _this.applyRule(component.element, r);
                        });
                    }
                    else {
                        Array.prototype.forEach.call(component.element.querySelectorAll(style.selector), function (el) {
                            style.rules.forEach(function (r) {
                                _this.applyRule(el, r);
                            });
                        });
                    }
                };
                Styler.prototype.applyRule = function (element, rule) {
                    var prop = rule.property.replace(/-(\w)/g, function (_, letter) {
                        return letter.toUpperCase();
                    }).trim();
                    element.style[prop] = rule.value;
                };
                Styler.prototype.parseStyle = function (css) {
                    var r = /(.+?)\s*{(.*?)}/gm;
                    var r2 = /(.+?)\s?:(.+?);/gm;
                    css = css.replace(/\n/g, '');
                    var blocks = (css.match(r) || [])
                        .map(function (b) {
                        if (!b.match(r))
                            return null;
                        var _a = r.exec(b), _ = _a[0], selector = _a[1], _rules = _a[2];
                        var rules = (_rules.match(r2) || [])
                            .map(function (r) {
                            if (!r.match(r2))
                                return null;
                            var _a = r2.exec(r), _ = _a[0], property = _a[1], value = _a[2];
                            return { property: property, value: value };
                        })
                            .filter(function (r) {
                            return r !== null;
                        });
                        return { selector: selector, rules: rules };
                    })
                        .filter(function (b) {
                        return b !== null;
                    });
                    return blocks;
                };
                return Styler;
            })();
            styler.instance = new Styler();
        })(styler = components.styler || (components.styler = {}));
    })(components = ho.components || (ho.components = {}));
})(ho || (ho = {}));

var ho;
(function (ho) {
    var components;
    (function (components) {
        var renderer;
        (function (renderer) {
            var Node = (function () {
                function Node() {
                    this.children = [];
                }
                return Node;
            })();
            var Renderer = (function () {
                function Renderer() {
                    this.r = {
                        tag: /<([^>]*?(?:(?:('|")[^'"]*?\2)[^>]*?)*)>/,
                        repeat: /repeat=["|'].+["|']/,
                        type: /[\s|/]*(.*?)[\s|\/|>]/,
                        text: /(?:.|[\r\n])*?[^"'\\]</m,
                    };
                    this.voids = ["area", "base", "br", "col", "command", "embed", "hr", "img", "input", "keygen", "link", "meta", "param", "source", "track", "wbr"];
                    this.cache = {};
                }
                Renderer.prototype.render = function (component) {
                    if (typeof component.html === 'boolean' && !component.html)
                        return;
                    var name = component.name;
                    var root = this.cache[name] = this.cache[name] || this.parse(component.html).root;
                    root = this.renderRepeat(this.copyNode(root), component);
                    var html = this.domToString(root, -1);
                    component.element.innerHTML = html;
                };
                Renderer.prototype.parse = function (html, root) {
                    if (root === void 0) { root = new Node(); }
                    var m;
                    while ((m = this.r.tag.exec(html)) !== null) {
                        var tag, type, closing, isVoid, selfClosing, repeat, unClose;
                        //------- found some text before next tag
                        if (m.index !== 0) {
                            tag = html.match(this.r.text)[0];
                            tag = tag.substr(0, tag.length - 1);
                            type = 'TEXT';
                            isVoid = false;
                            selfClosing = true;
                            repeat = false;
                        }
                        else {
                            tag = m[1].trim();
                            type = (tag + '>').match(this.r.type)[1];
                            closing = tag[0] === '/';
                            isVoid = this.isVoid(type);
                            selfClosing = isVoid || tag[tag.length - 1] === '/';
                            repeat = !!tag.match(this.r.repeat);
                            if (selfClosing && ho.components.registry.instance.hasComponent(type)) {
                                selfClosing = false;
                                tag = tag.substr(0, tag.length - 1) + " ";
                                unClose = true;
                            }
                        }
                        html = html.slice(tag.length + (type === 'TEXT' ? 0 : 2));
                        if (closing) {
                            break;
                        }
                        else {
                            root.children.push({ parent: root, html: tag, type: type, isVoid: isVoid, selfClosing: selfClosing, repeat: repeat, children: [] });
                            if (!unClose && !selfClosing) {
                                var result = this.parse(html, root.children[root.children.length - 1]);
                                html = result.html;
                                root.children.pop();
                                root.children.push(result.root);
                            }
                        }
                        m = html.match(this.r.tag);
                    }
                    return { root: root, html: html };
                };
                Renderer.prototype.renderRepeat = function (root, models) {
                    models = [].concat(models);
                    for (var c = 0; c < root.children.length; c++) {
                        var child = root.children[c];
                        if (child.repeat) {
                            var regex = /repeat=["|']\s*(\S+)\s+as\s+(\S+?)["|']/;
                            var m = child.html.match(regex).slice(1);
                            var name = m[1];
                            var indexName;
                            if (name.indexOf(',') > -1) {
                                var names = name.split(',');
                                name = names[0].trim();
                                indexName = names[1].trim();
                            }
                            var model = this.evaluate(models, m[0]);
                            var holder = [];
                            model.forEach(function (value, index) {
                                var model2 = {};
                                model2[name] = value;
                                model2[indexName] = index;
                                var models2 = [].concat(models);
                                models2.unshift(model2);
                                var node = this.copyNode(child);
                                node.repeat = false;
                                node.html = node.html.replace(this.r.repeat, '');
                                node.html = this.repl(node.html, models2);
                                node = this.renderRepeat(node, models2);
                                //root.children.splice(root.children.indexOf(child), 0, node);
                                holder.push(node);
                            }.bind(this));
                            holder.forEach(function (n) {
                                root.children.splice(root.children.indexOf(child), 0, n);
                            });
                            root.children.splice(root.children.indexOf(child), 1);
                        }
                        else {
                            child.html = this.repl(child.html, models);
                            child = this.renderRepeat(child, models);
                            root.children[c] = child;
                        }
                    }
                    return root;
                };
                Renderer.prototype.domToString = function (root, indent) {
                    indent = indent || 0;
                    var html = '';
                    var tab = '\t';
                    if (root.html) {
                        html += new Array(indent).join(tab); //tab.repeat(indent);;
                        if (root.type !== 'TEXT') {
                            if (root.selfClosing && !root.isVoid) {
                                html += '<' + root.html.substr(0, --root.html.length) + '>';
                                html += '</' + root.type + '>\n';
                            }
                            else
                                html += '<' + root.html + '>';
                        }
                        else
                            html += root.html;
                    }
                    if (html)
                        html += '\n';
                    if (root.children.length) {
                        html += root.children.map(function (c) {
                            return this.domToString(c, indent + (root.type ? 1 : 2));
                        }.bind(this)).join('\n');
                    }
                    if (root.type && root.type !== 'TEXT' && !root.selfClosing) {
                        html += new Array(indent).join(tab); //tab.repeat(indent);
                        html += '</' + root.type + '>\n';
                    }
                    return html;
                };
                Renderer.prototype.repl = function (str, models) {
                    var regexG = /{(.+?)}}?/g;
                    var m = str.match(regexG);
                    if (!m)
                        return str;
                    while (m.length) {
                        var path = m[0];
                        path = path.substr(1, path.length - 2);
                        var value = this.evaluate(models, path);
                        if (value !== undefined) {
                            if (typeof value === 'function') {
                                value = "ho.components.Component.getComponent(this)." + path;
                            }
                            str = str.replace(m[0], value);
                        }
                        m = m.slice(1);
                    }
                    return str;
                };
                Renderer.prototype.evaluate = function (models, path) {
                    if (path[0] === '{' && path[--path.length] === '}')
                        return this.evaluateExpression(models, path.substr(1, path.length - 2));
                    else if (path[0] === '#')
                        return this.evaluateFunction(models, path.substr(1));
                    else
                        return this.evaluateValue(models, path);
                };
                Renderer.prototype.evaluateValue = function (models, path) {
                    return this.evaluateValueAndModel(models, path).value;
                };
                Renderer.prototype.evaluateValueAndModel = function (models, path) {
                    if (models.indexOf(window) == -1)
                        models.push(window);
                    var mi = 0;
                    var model = void 0;
                    while (mi < models.length && model === undefined) {
                        model = models[mi];
                        try {
                            model = new Function("model", "return model['" + path.split(".").join("']['") + "']")(model);
                        }
                        catch (e) {
                            model = void 0;
                        }
                        finally {
                            mi++;
                        }
                    }
                    return { "value": model, "model": models[--mi] };
                };
                Renderer.prototype.evaluateExpression = function (models, path) {
                    if (models.indexOf(window) == -1)
                        models.push(window);
                    var mi = 0;
                    var model = void 0;
                    while (mi < models.length && model === undefined) {
                        model = models[mi];
                        try {
                            //with(model) model = eval(path);
                            model = new Function(Object.keys(model).toString(), "return " + path)
                                .apply(null, Object.keys(model).map(function (k) { return model[k]; }));
                        }
                        catch (e) {
                            model = void 0;
                        }
                        finally {
                            mi++;
                        }
                    }
                    return model;
                };
                Renderer.prototype.evaluateFunction = function (models, path) {
                    var exp = this.evaluateExpression.bind(this, models);
                    var _a = path.split('('), name = _a[0], args = _a[1];
                    args = args.substr(0, --args.length);
                    var _b = this.evaluateValueAndModel(models, name), value = _b.value, model = _b.model;
                    var func = value;
                    var argArr = args.split('.').map(function (arg) {
                        return arg.indexOf('#') === 0 ?
                            arg.substr(1) :
                            exp(arg);
                    });
                    func = func.bind.apply(func, [model].concat(argArr));
                    var index = ho.components.temp.set(func);
                    var str = "ho.components.temp.call(" + index + ")";
                    return str;
                };
                Renderer.prototype.copyNode = function (node) {
                    var copyNode = this.copyNode.bind(this);
                    var n = {
                        parent: node.parent,
                        html: node.html,
                        type: node.type,
                        selfClosing: node.selfClosing,
                        repeat: node.repeat,
                        children: node.children.map(copyNode)
                    };
                    return n;
                };
                Renderer.prototype.isVoid = function (name) {
                    return this.voids.indexOf(name.toLowerCase()) !== -1;
                };
                return Renderer;
            })();
            renderer.Renderer = Renderer;
            renderer.instance = new Renderer();
        })(renderer = components.renderer || (components.renderer = {}));
    })(components = ho.components || (ho.components = {}));
})(ho || (ho = {}));

var ho;
(function (ho) {
    var components;
    (function (components) {
        var htmlprovider;
        (function (htmlprovider) {
            var Promise = ho.promise.Promise;
            var HtmlProvider = (function () {
                function HtmlProvider() {
                    this.cache = {};
                }
                HtmlProvider.prototype.resolve = function (name) {
                    if (ho.components.registry.useDir) {
                        name += '.' + name.split('.').pop();
                    }
                    name = name.split('.').join('/');
                    return "components/" + name + ".html";
                };
                HtmlProvider.prototype.getHTML = function (name) {
                    var _this = this;
                    return new Promise(function (resolve, reject) {
                        if (typeof _this.cache[name] === 'string')
                            return resolve(_this.cache[name]);
                        var url = _this.resolve(name);
                        var xmlhttp = new XMLHttpRequest();
                        xmlhttp.onreadystatechange = function () {
                            if (xmlhttp.readyState == 4) {
                                var resp = xmlhttp.responseText;
                                if (xmlhttp.status == 200) {
                                    resolve(resp);
                                }
                                else {
                                    reject("Error while loading html for Component " + name);
                                }
                            }
                        };
                        xmlhttp.open('GET', url, true);
                        xmlhttp.send();
                    });
                };
                return HtmlProvider;
            })();
            htmlprovider.HtmlProvider = HtmlProvider;
            htmlprovider.instance = new HtmlProvider();
        })(htmlprovider = components.htmlprovider || (components.htmlprovider = {}));
    })(components = ho.components || (ho.components = {}));
})(ho || (ho = {}));

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var ho;
(function (ho) {
    var components;
    (function (components) {
        /**
            Baseclass for Attributes.
            Used Attributes needs to be specified by Component#attributes property to get loaded properly.
        */
        var Attribute = (function () {
            function Attribute(element, value) {
                this.element = element;
                this.component = components.Component.getComponent(element);
                this.value = value;
                this.init();
            }
            Attribute.prototype.init = function () { };
            Object.defineProperty(Attribute.prototype, "name", {
                get: function () {
                    return Attribute.getName(this);
                },
                enumerable: true,
                configurable: true
            });
            Attribute.prototype.update = function () {
            };
            Attribute.getName = function (clazz) {
                if (clazz instanceof Attribute)
                    return clazz.constructor.toString().match(/\w+/g)[1];
                else
                    return clazz.toString().match(/\w+/g)[1];
            };
            return Attribute;
        })();
        components.Attribute = Attribute;
        var WatchAttribute = (function (_super) {
            __extends(WatchAttribute, _super);
            function WatchAttribute(element, value) {
                _super.call(this, element, value);
                this.r = /#(.+?)#/g;
                var m = this.value.match(this.r) || [];
                m.map(function (w) {
                    w = w.substr(1, w.length - 2);
                    this.watch(w);
                }.bind(this));
                this.value = this.value.replace(/#/g, '');
            }
            WatchAttribute.prototype.watch = function (path) {
                var pathArr = path.split('.');
                var prop = pathArr.pop();
                var obj = this.component;
                pathArr.map(function (part) {
                    obj = obj[part];
                });
                ho.watch.watch(obj, prop, this.update.bind(this));
            };
            WatchAttribute.prototype.eval = function (path) {
                var model = this.component;
                model = new Function(Object.keys(model).toString(), "return " + path)
                    .apply(null, Object.keys(model).map(function (k) { return model[k]; }));
                return model;
            };
            return WatchAttribute;
        })(Attribute);
        components.WatchAttribute = WatchAttribute;
    })(components = ho.components || (ho.components = {}));
})(ho || (ho = {}));

var ho;
(function (ho) {
    var components;
    (function (components_1) {
        var Promise = ho.promise.Promise;
        var HtmlProvider = ho.components.htmlprovider.instance;
        var Renderer = ho.components.renderer.instance;
        /**
            Baseclass for Components
            important: do initialization work in Component#init
        */
        var Component = (function () {
            function Component(element) {
                this.html = '';
                this.style = '';
                this.properties = [];
                this.attributes = [];
                this.requires = [];
                this.children = {};
                //------- init Elemenet and Elements' original innerHTML
                this.element = element;
                this.element.component = this;
                this.original_innerHTML = element.innerHTML;
            }
            Object.defineProperty(Component.prototype, "name", {
                get: function () {
                    return Component.getName(this);
                },
                enumerable: true,
                configurable: true
            });
            Component.prototype.getName = function () {
                return this.name;
            };
            Component.prototype.getParent = function () {
                return Component.getComponent(this.element.parentNode);
            };
            Component.prototype._init = function () {
                var render = this.render.bind(this);
                //-------- init Properties
                this.initProperties();
                //------- call init() & loadRequirements() -> then render
                var ready = [this.initHTML(), Promise.create(this.init()), this.loadRequirements()];
                var p = new Promise();
                Promise.all(ready)
                    .then(function () {
                    p.resolve();
                    render();
                })
                    .catch(function (err) {
                    p.reject(err);
                    throw err;
                });
                return p;
            };
            /**
                Method that get called after initialization of a new instance.
                Do init-work here.
                May return a Promise.
            */
            Component.prototype.init = function () { };
            Component.prototype.update = function () { return void 0; };
            Component.prototype.render = function () {
                Renderer.render(this);
                ho.components.registry.instance.initElement(this.element)
                    .then(function () {
                    this.initChildren();
                    this.initStyle();
                    this.initAttributes();
                    this.update();
                }.bind(this));
            };
            ;
            Component.prototype.initStyle = function () {
                if (typeof this.style === 'undefined')
                    return;
                if (this.style === null)
                    return;
                if (typeof this.style === 'string' && this.style.length === 0)
                    return;
                components_1.styler.instance.applyStyle(this);
            };
            /**
            *  Assure that this instance has an valid html attribute and if not load and set it.
            */
            Component.prototype.initHTML = function () {
                var p = new Promise();
                var self = this;
                if (typeof this.html === 'undefined') {
                    this.html = '';
                    p.resolve();
                }
                else {
                    if (this.html.indexOf(".html", this.html.length - ".html".length) !== -1) {
                        HtmlProvider.getHTML(this.name)
                            .then(function (html) {
                            self.html = html;
                            p.resolve();
                        })
                            .catch(p.reject);
                    }
                    else {
                        p.resolve();
                    }
                }
                return p;
            };
            Component.prototype.initProperties = function () {
                this.properties.forEach(function (prop) {
                    if (typeof prop === 'object') {
                        this.properties[prop.name] = this.element[prop.name] || this.element.getAttribute(prop.name) || prop.default;
                        if (this.properties[prop.name] === undefined && prop.required === true)
                            throw "Property " + prop.name + " is required but not provided";
                    }
                    else if (typeof prop === 'string')
                        this.properties[prop] = this.element[prop] || this.element.getAttribute(prop);
                }.bind(this));
            };
            Component.prototype.initChildren = function () {
                var childs = this.element.querySelectorAll('*');
                for (var c = 0; c < childs.length; c++) {
                    var child = childs[c];
                    if (child.id) {
                        this.children[child.id] = child;
                    }
                    if (child.tagName)
                        this.children[child.tagName] = this.children[child.tagName] || [];
                    this.children[child.tagName].push(child);
                }
            };
            Component.prototype.initAttributes = function () {
                var _this = this;
                this.attributes
                    .forEach(function (a) {
                    var attr = ho.components.registry.instance.getAttribute(a);
                    Array.prototype.forEach.call(_this.element.querySelectorAll("*[" + a + "]"), function (e) {
                        var val = e.hasOwnProperty(a) ? e[a] : e.getAttribute(a);
                        if (typeof val === 'string' && val === '')
                            val = void 0;
                        new attr(e, val).update();
                    });
                });
            };
            Component.prototype.loadRequirements = function () {
                var components = this.requires
                    .filter(function (req) {
                    return !ho.components.registry.instance.hasComponent(req);
                })
                    .map(function (req) {
                    return ho.components.registry.instance.loadComponent(req);
                });
                var attributes = this.attributes
                    .filter(function (req) {
                    return !ho.components.registry.instance.hasAttribute(req);
                })
                    .map(function (req) {
                    return ho.components.registry.instance.loadAttribute(req);
                });
                var promises = components.concat(attributes);
                return Promise.all(promises);
            };
            ;
            /*
            static register(c: typeof Component): void {
                ho.components.registry.instance.register(c);
            }
            */
            /*
            static run(opt?: any) {
                ho.components.registry.instance.setOptions(opt);
                ho.components.registry.instance.run();
            }
            */
            Component.getComponent = function (element) {
                while (!element.component)
                    element = element.parentNode;
                return element.component;
            };
            Component.getName = function (clazz) {
                if (clazz instanceof Component)
                    return clazz.constructor.toString().match(/\w+/g)[1];
                else
                    return clazz.toString().match(/\w+/g)[1];
            };
            return Component;
        })();
        components_1.Component = Component;
    })(components = ho.components || (ho.components = {}));
})(ho || (ho = {}));

var ho;
(function (ho) {
    var components;
    (function (components) {
        var registry;
        (function (registry) {
            var Promise = ho.promise.Promise;
            registry.mapping = {};
            registry.useDir = true;
            var Registry = (function () {
                function Registry() {
                    this.components = [];
                    this.attributes = [];
                    this.componentLoader = new ho.classloader.ClassLoader({
                        urlTemplate: 'components/${name}.js',
                        useDir: registry.useDir
                    });
                    this.attributeLoader = new ho.classloader.ClassLoader({
                        urlTemplate: 'attributes/${name}.js',
                        useDir: registry.useDir
                    });
                }
                Registry.prototype.register = function (ca) {
                    if (ca.prototype instanceof components.Component) {
                        this.components.push(ca);
                        document.createElement(components.Component.getName(ca));
                    }
                    else if (ca.prototype instanceof components.Attribute) {
                        this.attributes.push(ca);
                    }
                };
                Registry.prototype.run = function () {
                    var initComponent = this.initComponent.bind(this);
                    var promises = this.components.map(function (c) {
                        return initComponent(c);
                    });
                    return Promise.all(promises);
                };
                Registry.prototype.initComponent = function (component, element) {
                    if (element === void 0) { element = document; }
                    var promises = Array.prototype.map.call(element.querySelectorAll(components.Component.getName(component)), function (e) {
                        return new component(e)._init();
                    });
                    return Promise.all(promises);
                };
                Registry.prototype.initElement = function (element) {
                    var initComponent = this.initComponent.bind(this);
                    var promises = Array.prototype.map.call(this.components, function (component) {
                        return initComponent(component, element);
                    });
                    return Promise.all(promises);
                };
                Registry.prototype.hasComponent = function (name) {
                    return this.components
                        .filter(function (component) {
                        return components.Component.getName(component) === name;
                    }).length > 0;
                };
                Registry.prototype.hasAttribute = function (name) {
                    return this.attributes
                        .filter(function (attribute) {
                        return components.Attribute.getName(attribute) === name;
                    }).length > 0;
                };
                Registry.prototype.getAttribute = function (name) {
                    return this.attributes
                        .filter(function (attribute) {
                        return components.Attribute.getName(attribute) === name;
                    })[0];
                };
                Registry.prototype.loadComponent = function (name) {
                    var self = this;
                    var sup = this.components.map(function (c) { return components.Component.getName(c); }).concat(["ho.components.Component"]);
                    return this.componentLoader.load({
                        name: name,
                        url: registry.mapping[name],
                        super: sup
                    })
                        .then(function (classes) {
                        classes.map(function (c) {
                            self.register(c);
                        });
                        return classes.pop();
                    });
                    /*
                    let self = this;
        
                    return this.getParentOfComponent(name)
                    .then((parent) => {
                        if(self.hasComponent(parent) || parent === 'ho.components.Component')
                            return true;
                        else return self.loadComponent(parent);
                    })
                    .then((parentType) => {
                        return ho.components.componentprovider.instance.getComponent(name)
                    })
                    .then((component) => {
                        self.register(component);
                        return component;
                    });
                    //return this.options.componentProvider.getComponent(name)
                    */
                };
                Registry.prototype.loadAttribute = function (name) {
                    var self = this;
                    var base = ["ho.components.Attribute", "ho.components.WatchAttribute"];
                    var sup = this.attributes.map(function (a) { return components.Attribute.getName(a); }).concat(base);
                    return this.attributeLoader.load({
                        name: name,
                        url: registry.mapping[name],
                        super: sup
                    })
                        .then(function (classes) {
                        classes.map(function (c) {
                            self.register(c);
                        });
                        return classes.pop();
                    });
                    /*
                    let self = this;
        
                    return this.getParentOfAttribute(name)
                    .then((parent) => {
                        if(self.hasAttribute(parent) || parent === 'ho.components.Attribute' || parent === 'ho.components.WatchAttribute')
                            return true;
                        else return self.loadAttribute(parent);
                    })
                    .then((parentType) => {
                        return ho.components.attributeprovider.instance.getAttribute(name)
                    })
                    .then((attribute) => {
                        self.register(attribute);
                        return attribute;
                    });
                    */
                    /*
                    let self = this;
                    return new Promise<typeof Attribute, string>((resolve, reject) => {
                        ho.components.attributeprovider.instance.getAttribute(name)
                        .then((attribute) => {
                            self.register(attribute);
                            resolve(attribute);
                        });
                    });
                    */
                };
                return Registry;
            })();
            registry.Registry = Registry;
            registry.instance = new Registry();
        })(registry = components.registry || (components.registry = {}));
    })(components = ho.components || (ho.components = {}));
})(ho || (ho = {}));

/// <reference path="../../../bower_components/ho-promise/dist/promise.d.ts"/>
/// <reference path="../../../bower_components/ho-classloader/dist/classloader.d.ts"/>
/// <reference path="../../../bower_components/ho-watch/dist/watch.d.ts"/>
var ho;
(function (ho) {
    var components;
    (function (components) {
        function run() {
            return ho.components.registry.instance.run();
        }
        components.run = run;
        function register(c) {
            ho.components.registry.instance.register(c);
        }
        components.register = register;
    })(components = ho.components || (ho.components = {}));
})(ho || (ho = {}));

var ho;
(function (ho) {
    var flux;
    (function (flux) {
        var CallbackHolder = (function () {
            function CallbackHolder() {
                this.prefix = 'ID_';
                this.lastID = 1;
                this.callbacks = {};
            }
            CallbackHolder.prototype.register = function (callback, self) {
                var id = this.prefix + this.lastID++;
                this.callbacks[id] = self ? callback.bind(self) : callback;
                return id;
            };
            CallbackHolder.prototype.unregister = function (id) {
                if (!this.callbacks[id])
                    throw 'Could not unregister callback for id ' + id;
                delete this.callbacks[id];
            };
            ;
            return CallbackHolder;
        })();
        flux.CallbackHolder = CallbackHolder;
    })(flux = ho.flux || (ho.flux = {}));
})(ho || (ho = {}));



var ho;
(function (ho) {
    var flux;
    (function (flux) {
        var registry;
        (function (registry) {
            var Promise = ho.promise.Promise;
            registry.mapping = {};
            registry.useDir = true;
            var Registry = (function () {
                function Registry() {
                    this.stores = {};
                    this.storeLoader = new ho.classloader.ClassLoader({
                        urlTemplate: 'stores/${name}.js',
                        useDir: registry.useDir
                    });
                }
                Registry.prototype.register = function (store) {
                    this.stores[store.name] = store;
                    return store;
                };
                Registry.prototype.get = function (storeClass) {
                    var name = void 0;
                    if (typeof storeClass === 'string')
                        name = storeClass;
                    else
                        name = storeClass.toString().match(/\w+/g)[1];
                    return this.stores[name];
                };
                Registry.prototype.loadStore = function (name) {
                    var self = this;
                    if (!!this.stores[name])
                        return Promise.create(this.stores[name]);
                    return this.storeLoader.load({
                        name: name,
                        url: registry.mapping[name],
                        super: ["ho.flux.Store"]
                    })
                        .then(function (classes) {
                        classes.map(function (c) {
                            self.register(new c).init();
                        });
                        return self.get(classes.pop());
                    });
                    /*
                    let self = this;
        
                    let ret = this.getParentOfStore(name)
                    .then((parent) => {
                        if(self.stores[parent] instanceof Store || parent === 'ho.flux.Store')
                            return true;
                        else
                            return self.loadStore(parent);
                    })
                    .then((parentType) => {
                        return ho.flux.storeprovider.instance.getStore(name);
                    })
                    .then((storeClass) => {
                        return self.register(new storeClass).init();
                    })
                    .then(()=>{
                        return self.stores[name];
                    });
        
                    return ret;
                    */
                    /*
                    return new Promise(function(resolve, reject) {
                        if(this.get(name) instanceof Store)
                            resolve(this.get(name))
                        else {
        
                            storeprovider.instance.getStore(name)
                            .then((storeClass) => {
                                this.register(new storeClass());
                                resolve(this.get(name));
                            })
                            .catch(reject);
                        }
        
                    }.bind(this));
                    */
                    /*
                    if(STORES[name] !== undefined && STORES[name] instanceof Store)
                        return Promise.create(STORES[name]);
                    else {
                        return new Promise((resolve, reject) => {
                            storeprovider.instance.getStore(name)
                            .then((s)=>{resolve(s);})
                            .catch((e)=>{reject(e);});
                        });
                    }
                    */
                };
                return Registry;
            })();
            registry.Registry = Registry;
        })(registry = flux.registry || (flux.registry = {}));
    })(flux = ho.flux || (ho.flux = {}));
})(ho || (ho = {}));

var ho;
(function (ho) {
    var flux;
    (function (flux) {
        var stateprovider;
        (function (stateprovider) {
            var Promise = ho.promise.Promise;
            var StateProvider = (function () {
                function StateProvider() {
                    this.useMin = false;
                }
                StateProvider.prototype.resolve = function () {
                    return this.useMin ?
                        "states.min.js" :
                        "states.js";
                };
                StateProvider.prototype.getStates = function (name) {
                    var _this = this;
                    if (name === void 0) { name = "States"; }
                    return new Promise(function (resolve, reject) {
                        var src = _this.resolve();
                        var script = document.createElement('script');
                        script.onload = function () {
                            resolve(new window[name]);
                        };
                        script.onerror = function (e) {
                            reject(e);
                        };
                        script.src = src;
                        document.getElementsByTagName('head')[0].appendChild(script);
                    });
                };
                return StateProvider;
            })();
            stateprovider.instance = new StateProvider();
        })(stateprovider = flux.stateprovider || (flux.stateprovider = {}));
    })(flux = ho.flux || (ho.flux = {}));
})(ho || (ho = {}));

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var ho;
(function (ho) {
    var flux;
    (function (flux) {
        var Store = (function (_super) {
            __extends(Store, _super);
            function Store() {
                _super.call(this);
                this.handlers = {};
                this.id = ho.flux.DISPATCHER.register(this.handle.bind(this));
                //ho.flux.STORES[this.name] = this;
                ho.flux.STORES.register(this);
            }
            Store.prototype.init = function () { };
            Object.defineProperty(Store.prototype, "name", {
                get: function () {
                    return this.constructor.toString().match(/\w+/g)[1];
                },
                enumerable: true,
                configurable: true
            });
            Store.prototype.register = function (callback, self) {
                return _super.prototype.register.call(this, callback, self);
            };
            Store.prototype.on = function (type, func) {
                this.handlers[type] = func;
            };
            Store.prototype.handle = function (action) {
                if (typeof this.handlers[action.type] === 'function')
                    this.handlers[action.type](action.data);
            };
            ;
            Store.prototype.changed = function () {
                for (var id in this.callbacks) {
                    var cb = this.callbacks[id];
                    if (cb)
                        cb(this.data);
                }
            };
            return Store;
        })(flux.CallbackHolder);
        flux.Store = Store;
        ;
    })(flux = ho.flux || (ho.flux = {}));
})(ho || (ho = {}));

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var ho;
(function (ho) {
    var flux;
    (function (flux) {
        var Promise = ho.promise.Promise;
        var Router = (function (_super) {
            __extends(Router, _super);
            function Router() {
                _super.apply(this, arguments);
                this.mapping = null;
            }
            Router.prototype.init = function () {
                this.on('STATE', this.onStateChangeRequested.bind(this));
                var onHashChange = this.onHashChange.bind(this);
                return this.initStates()
                    .then(function () {
                    window.onhashchange = onHashChange;
                    onHashChange();
                });
            };
            Router.prototype.go = function (data, args) {
                var _data = {
                    state: undefined,
                    args: undefined,
                    extern: false
                };
                if (typeof data === 'string') {
                    _data.state = data;
                    _data.args = args;
                }
                else {
                    _data.state = data.state;
                    _data.args = data.args;
                }
                ho.flux.DISPATCHER.dispatch({
                    type: 'STATE',
                    data: _data
                });
            };
            Router.prototype.initStates = function () {
                return flux.stateprovider.instance.getStates()
                    .then(function (istates) {
                    this.mapping = istates.states;
                }.bind(this));
            };
            Router.prototype.getStateFromName = function (name) {
                return this.mapping.filter(function (s) {
                    return s.name === name;
                })[0];
            };
            Router.prototype.onStateChangeRequested = function (data) {
                //get requested state
                var state = this.getStateFromName(data.state);
                var url = this.urlFromState(state.url, data.args);
                //current state and args equals requested state and args -> return
                if (this.data &&
                    this.data.state &&
                    this.data.state.name === data.state &&
                    this.equals(this.data.args, data.args) &&
                    url === window.location.hash.substr(1)) {
                    return;
                }
                //requested state has an redirect property -> call redirect state
                if (!!state.redirect) {
                    state = this.getStateFromName(state.redirect);
                }
                var prom = typeof state.before === 'function' ? state.before(data) : Promise.create(undefined);
                prom
                    .then(function () {
                    //does the state change request comes from extern e.g. url change in browser window ?
                    var extern = !!data.extern;
                    this.data = {
                        state: state,
                        args: data.args,
                        extern: extern,
                    };
                    //------- set url for browser
                    var url = this.urlFromState(state.url, data.args);
                    this.setUrl(url);
                    this.changed();
                }.bind(this), function (data) {
                    this.onStateChangeRequested(data);
                }.bind(this));
            };
            Router.prototype.onHashChange = function () {
                var s = this.stateFromUrl(window.location.hash.substr(1));
                ho.flux.DISPATCHER.dispatch({
                    type: 'STATE',
                    data: {
                        state: s.state,
                        args: s.args,
                        extern: true,
                    }
                });
            };
            Router.prototype.setUrl = function (url) {
                if (window.location.hash.substr(1) === url)
                    return;
                var l = window.onhashchange;
                window.onhashchange = null;
                window.location.hash = url;
                window.onhashchange = l;
            };
            Router.prototype.regexFromUrl = function (url) {
                var regex = /:([\w]+)/;
                while (url.match(regex)) {
                    url = url.replace(regex, "([^\/]+)");
                }
                return url + '$';
            };
            Router.prototype.argsFromUrl = function (pattern, url) {
                var r = this.regexFromUrl(pattern);
                var names = pattern.match(r).slice(1);
                var values = url.match(r).slice(1);
                var args = {};
                names.forEach(function (name, i) {
                    args[name.substr(1)] = values[i];
                });
                return args;
            };
            Router.prototype.stateFromUrl = function (url) {
                var _this = this;
                var s = void 0;
                this.mapping.forEach(function (state) {
                    if (s)
                        return;
                    var r = _this.regexFromUrl(state.url);
                    if (url.match(r)) {
                        var args = _this.argsFromUrl(state.url, url);
                        s = {
                            "state": state.name,
                            "args": args,
                            "extern": false
                        };
                    }
                });
                if (!s)
                    throw "No State found for url " + url;
                return s;
            };
            Router.prototype.urlFromState = function (url, args) {
                var regex = /:([\w]+)/;
                while (url.match(regex)) {
                    url = url.replace(regex, function (m) {
                        return args[m.substr(1)];
                    });
                }
                return url;
            };
            Router.prototype.equals = function (o1, o2) {
                return JSON.stringify(o1) === JSON.stringify(o2);
            };
            return Router;
        })(flux.Store);
        flux.Router = Router;
    })(flux = ho.flux || (ho.flux = {}));
})(ho || (ho = {}));

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var ho;
(function (ho) {
    var flux;
    (function (flux) {
        var Dispatcher = (function (_super) {
            __extends(Dispatcher, _super);
            function Dispatcher() {
                _super.apply(this, arguments);
                this.isPending = {};
                this.isHandled = {};
                this.isDispatching = false;
                this.pendingPayload = null;
            }
            Dispatcher.prototype.waitFor = function () {
                var ids = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    ids[_i - 0] = arguments[_i];
                }
                if (!this.isDispatching)
                    throw 'Dispatcher.waitFor(...): Must be invoked while dispatching.';
                for (var ii = 0; ii < ids.length; ii++) {
                    var id = ids[ii];
                    if (this.isPending[id]) {
                        if (!this.isHandled[id])
                            throw "waitFor(...): Circular dependency detected while wating for " + id;
                        continue;
                    }
                    if (!this.callbacks[id])
                        throw "waitFor(...): " + id + " does not map to a registered callback.";
                    this.invokeCallback(id);
                }
            };
            ;
            Dispatcher.prototype.dispatch = function (action) {
                if (this.isDispatching)
                    throw 'Cannot dispatch in the middle of a dispatch.';
                this.startDispatching(action);
                try {
                    for (var id in this.callbacks) {
                        if (this.isPending[id]) {
                            continue;
                        }
                        this.invokeCallback(id);
                    }
                }
                finally {
                    this.stopDispatching();
                }
            };
            ;
            Dispatcher.prototype.invokeCallback = function (id) {
                this.isPending[id] = true;
                this.callbacks[id](this.pendingPayload);
                this.isHandled[id] = true;
            };
            Dispatcher.prototype.startDispatching = function (payload) {
                for (var id in this.callbacks) {
                    this.isPending[id] = false;
                    this.isHandled[id] = false;
                }
                this.pendingPayload = payload;
                this.isDispatching = true;
            };
            Dispatcher.prototype.stopDispatching = function () {
                this.pendingPayload = null;
                this.isDispatching = false;
            };
            return Dispatcher;
        })(flux.CallbackHolder);
        flux.Dispatcher = Dispatcher;
    })(flux = ho.flux || (ho.flux = {}));
})(ho || (ho = {}));

/// <reference path="../../../bower_components/ho-promise/dist/promise.d.ts"/>
/// <reference path="../../../bower_components/ho-classloader/dist/classloader.d.ts"/>
var ho;
(function (ho) {
    var flux;
    (function (flux) {
        flux.DISPATCHER = new flux.Dispatcher();
        flux.STORES = new flux.registry.Registry();
        flux.dir = false;
        //if(ho.flux.STORES.get(Router) === undefined)
        //	new Router();
        function run() {
            //return (<Router>ho.flux.STORES['Router']).init();
            return flux.STORES.get(flux.Router).init();
        }
        flux.run = run;
    })(flux = ho.flux || (ho.flux = {}));
})(ho || (ho = {}));

var ho;
(function (ho) {
    var ui;
    (function (ui) {
        function run(options) {
            if (options === void 0) { options = new Options(); }
            options = new Options(options);
            var p = options.process()
                .then(ho.components.run)
                .then(ho.flux.run);
            return p;
        }
        ui.run = run;
        var components = [
            "Stored",
            "View",
        ];
        var attributes = [
            "Bind",
            "BindBi",
        ];
        var stores = [];
        var Options = (function () {
            function Options(opt) {
                if (opt === void 0) { opt = {}; }
                this.root = "App";
                this.router = ho.flux.Router;
                this.map = true;
                this.mapDefault = "bower_components/ho-ui/dist/";
                this.dir = true;
                this.min = false;
                for (var key in opt) {
                    this[key] = opt[key];
                }
            }
            Options.prototype.process = function () {
                return ho.promise.Promise.create(this.processDir())
                    .then(this.processMin.bind(this))
                    .then(this.processMap.bind(this))
                    .then(this.processRouter.bind(this))
                    .then(this.processRoot.bind(this));
            };
            Options.prototype.processRoot = function () {
                var _this = this;
                return new ho.promise.Promise(function (resolve, reject) {
                    if (typeof _this.root === 'string') {
                        ho.components.registry.instance.loadComponent(_this.root)
                            .then(resolve)
                            .catch(reject);
                    }
                    else {
                        ho.components.registry.instance.register(_this.root);
                        resolve(null);
                    }
                });
            };
            Options.prototype.processRouter = function () {
                var _this = this;
                return new ho.promise.Promise(function (resolve, reject) {
                    if (typeof _this.router === 'string') {
                        ho.flux.STORES.loadStore(_this.router)
                            .then(resolve)
                            .catch(reject);
                    }
                    else {
                        resolve(new _this.router());
                    }
                });
            };
            Options.prototype.processMap = function () {
                var _this = this;
                if (typeof this.map === 'boolean') {
                    if (!this.map)
                        return;
                    else
                        this.map = this.mapDefault;
                }
                components.forEach(function (c) {
                    //ho.components.registry.mapping[c] = this.map + 'components/' + c + '/' + c + '.js';
                    ho.classloader.mapping[c] = _this.map + 'components/' + c + '/' + c + '.js';
                });
                attributes.forEach(function (a) {
                    //ho.components.registry.mapping[a] = this.map + 'attributes/' + a + '/' + a + '.js';
                    ho.classloader.mapping[a] = _this.map + 'attributes/' + a + '/' + a + '.js';
                });
                stores.forEach(function (s) {
                    //ho.flux.registry.mapping[s] = this.map + 'stores/' + s + '/' + s + '.js';
                    ho.classloader.mapping[s] = _this.map + 'stores/' + s + '/' + s + '.js';
                });
            };
            Options.prototype.processDir = function () {
                ho.components.dir = this.dir;
            };
            Options.prototype.processMin = function () {
                /*
                ho.components.componentprovider.instance.useMin = this.min;
                ho.components.attributeprovider.instance.useMin = this.min;
                ho.flux.storeprovider.instance.useMin = this.min;
                */
            };
            return Options;
        })();
    })(ui = ho.ui || (ho.ui = {}));
})(ho || (ho = {}));

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9zb3VyY2Uvc3JjL2hvL3Byb21pc2UvcHJvbWlzZS50cyIsIi9zb3VyY2Uvc3JjL2hvL2NsYXNzbG9hZGVyL3V0aWwvZ2V0LnRzIiwiL3NvdXJjZS9zcmMvaG8vY2xhc3Nsb2FkZXIvdXRpbC9leHBvc2UudHMiLCIvc291cmNlL3NyYy9oby9jbGFzc2xvYWRlci94aHIvZ2V0LnRzIiwiL3NvdXJjZS9zcmMvaG8vY2xhc3Nsb2FkZXIvdHlwZXMudHMiLCIvc291cmNlL3NyYy9oby9jbGFzc2xvYWRlci9sb2FkYXJndW1lbnRzLnRzIiwiL3NvdXJjZS9zcmMvaG8vY2xhc3Nsb2FkZXIvbG9hZGVyY29uZmlnLnRzIiwiL3NvdXJjZS9zcmMvaG8vY2xhc3Nsb2FkZXIvbG9hZHR5cGUudHMiLCIvc291cmNlL3NyYy9oby9jbGFzc2xvYWRlci9jbGFzc2xvYWRlci50cyIsIi9zb3VyY2Uvc3JjL2hvL2NsYXNzbG9hZGVyL21haW4udHMiLCIvc291cmNlL3dhdGNoLnRzIiwiL3NvdXJjZS9zcmMvaG8vY29tcG9uZW50cy90ZW1wL3RlbXAudHMiLCIvc291cmNlL3NyYy9oby9jb21wb25lbnRzL3N0eWxlci9zdHlsZXIudHMiLCIvc291cmNlL3NyYy9oby9jb21wb25lbnRzL3JlbmRlcmVyL3JlbmRlcmVyLnRzIiwiL3NvdXJjZS9zcmMvaG8vY29tcG9uZW50cy9odG1scHJvdmlkZXIvaHRtbHByb3ZpZGVyLnRzIiwiL3NvdXJjZS9zcmMvaG8vY29tcG9uZW50cy9hdHRyaWJ1dGUudHMiLCIvc291cmNlL3NyYy9oby9jb21wb25lbnRzL2NvbXBvbmVudC50cyIsIi9zb3VyY2Uvc3JjL2hvL2NvbXBvbmVudHMvcmVnaXN0cnkvcmVnaXN0cnkudHMiLCIvc291cmNlL3NyYy9oby9jb21wb25lbnRzL2NvbXBvbmVudHMudHMiLCIvc291cmNlL3NyYy9oby9mbHV4L2NhbGxiYWNraG9sZGVyLnRzIiwiL3NvdXJjZS9zcmMvaG8vZmx1eC9zdGF0ZS50cyIsIi9zb3VyY2Uvc3JjL2hvL2ZsdXgvcmVnaXN0cnkvcmVnaXN0cnkudHMiLCIvc291cmNlL3NyYy9oby9mbHV4L3N0YXRlcHJvdmlkZXIvc3RhdGVwcm92aWRlci50cyIsIi9zb3VyY2Uvc3JjL2hvL2ZsdXgvc3RvcmUudHMiLCIvc291cmNlL3NyYy9oby9mbHV4L3JvdXRlci50cyIsIi9zb3VyY2Uvc3JjL2hvL2ZsdXgvZGlzcGF0Y2hlci50cyIsIi9zb3VyY2Uvc3JjL2hvL2ZsdXgvZmx1eC50cyIsIi9zb3VyY2UvdWkudHMiXSwibmFtZXMiOlsiaG8iLCJoby5wcm9taXNlIiwiaG8ucHJvbWlzZS5Qcm9taXNlIiwiaG8ucHJvbWlzZS5Qcm9taXNlLmNvbnN0cnVjdG9yIiwiaG8ucHJvbWlzZS5Qcm9taXNlLnNldCIsImhvLnByb21pc2UuUHJvbWlzZS5yZXNvbHZlIiwiaG8ucHJvbWlzZS5Qcm9taXNlLl9yZXNvbHZlIiwiaG8ucHJvbWlzZS5Qcm9taXNlLnJlamVjdCIsImhvLnByb21pc2UuUHJvbWlzZS5fcmVqZWN0IiwiaG8ucHJvbWlzZS5Qcm9taXNlLnRoZW4iLCJoby5wcm9taXNlLlByb21pc2UuY2F0Y2giLCJoby5wcm9taXNlLlByb21pc2UuYWxsIiwiaG8ucHJvbWlzZS5Qcm9taXNlLmNoYWluIiwiaG8ucHJvbWlzZS5Qcm9taXNlLmNoYWluLm5leHQiLCJoby5wcm9taXNlLlByb21pc2UuY3JlYXRlIiwiaG8uY2xhc3Nsb2FkZXIiLCJoby5jbGFzc2xvYWRlci51dGlsIiwiaG8uY2xhc3Nsb2FkZXIudXRpbC5nZXQiLCJoby5jbGFzc2xvYWRlci51dGlsLmV4cG9zZSIsImhvLmNsYXNzbG9hZGVyLnhociIsImhvLmNsYXNzbG9hZGVyLnhoci5nZXQiLCJoby5jbGFzc2xvYWRlci5Mb2FkQXJndW1lbnRzIiwiaG8uY2xhc3Nsb2FkZXIuTG9hZEFyZ3VtZW50cy5jb25zdHJ1Y3RvciIsImhvLmNsYXNzbG9hZGVyLldhcm5MZXZlbCIsImhvLmNsYXNzbG9hZGVyLkxvYWRlckNvbmZpZyIsImhvLmNsYXNzbG9hZGVyLkxvYWRlckNvbmZpZy5jb25zdHJ1Y3RvciIsImhvLmNsYXNzbG9hZGVyLkxvYWRUeXBlIiwiaG8uY2xhc3Nsb2FkZXIuQ2xhc3NMb2FkZXIiLCJoby5jbGFzc2xvYWRlci5DbGFzc0xvYWRlci5jb25zdHJ1Y3RvciIsImhvLmNsYXNzbG9hZGVyLkNsYXNzTG9hZGVyLmNvbmZpZyIsImhvLmNsYXNzbG9hZGVyLkNsYXNzTG9hZGVyLmxvYWQiLCJoby5jbGFzc2xvYWRlci5DbGFzc0xvYWRlci5sb2FkX3NjcmlwdCIsImhvLmNsYXNzbG9hZGVyLkNsYXNzTG9hZGVyLmxvYWRfc2NyaXB0LmxvYWRfaW50ZXJuYWwiLCJoby5jbGFzc2xvYWRlci5DbGFzc0xvYWRlci5sb2FkX2Z1bmN0aW9uIiwiaG8uY2xhc3Nsb2FkZXIuQ2xhc3NMb2FkZXIubG9hZF9ldmFsIiwiaG8uY2xhc3Nsb2FkZXIuQ2xhc3NMb2FkZXIuZ2V0UGFyZW50TmFtZSIsImhvLmNsYXNzbG9hZGVyLkNsYXNzTG9hZGVyLnBhcnNlUGFyZW50RnJvbVNvdXJjZSIsImhvLmNsYXNzbG9hZGVyLkNsYXNzTG9hZGVyLnJlc29sdmVVcmwiLCJoby5jbGFzc2xvYWRlci5DbGFzc0xvYWRlci5leGlzdHMiLCJoby5jbGFzc2xvYWRlci5jb25maWciLCJoby5jbGFzc2xvYWRlci5sb2FkIiwiaG8ud2F0Y2giLCJoby53YXRjaC53YXRjaCIsImhvLndhdGNoLldhdGNoZXIiLCJoby53YXRjaC5XYXRjaGVyLmNvbnN0cnVjdG9yIiwiaG8ud2F0Y2guV2F0Y2hlci53YXRjaCIsImhvLndhdGNoLldhdGNoZXIuY29weSIsImhvLmNvbXBvbmVudHMiLCJoby5jb21wb25lbnRzLnRlbXAiLCJoby5jb21wb25lbnRzLnRlbXAuc2V0IiwiaG8uY29tcG9uZW50cy50ZW1wLmdldCIsImhvLmNvbXBvbmVudHMudGVtcC5jYWxsIiwiaG8uY29tcG9uZW50cy5zdHlsZXIiLCJoby5jb21wb25lbnRzLnN0eWxlci5TdHlsZXIiLCJoby5jb21wb25lbnRzLnN0eWxlci5TdHlsZXIuY29uc3RydWN0b3IiLCJoby5jb21wb25lbnRzLnN0eWxlci5TdHlsZXIuYXBwbHlTdHlsZSIsImhvLmNvbXBvbmVudHMuc3R5bGVyLlN0eWxlci5hcHBseVN0eWxlQmxvY2siLCJoby5jb21wb25lbnRzLnN0eWxlci5TdHlsZXIuYXBwbHlSdWxlIiwiaG8uY29tcG9uZW50cy5zdHlsZXIuU3R5bGVyLnBhcnNlU3R5bGUiLCJoby5jb21wb25lbnRzLnJlbmRlcmVyIiwiaG8uY29tcG9uZW50cy5yZW5kZXJlci5Ob2RlIiwiaG8uY29tcG9uZW50cy5yZW5kZXJlci5Ob2RlLmNvbnN0cnVjdG9yIiwiaG8uY29tcG9uZW50cy5yZW5kZXJlci5SZW5kZXJlciIsImhvLmNvbXBvbmVudHMucmVuZGVyZXIuUmVuZGVyZXIuY29uc3RydWN0b3IiLCJoby5jb21wb25lbnRzLnJlbmRlcmVyLlJlbmRlcmVyLnJlbmRlciIsImhvLmNvbXBvbmVudHMucmVuZGVyZXIuUmVuZGVyZXIucGFyc2UiLCJoby5jb21wb25lbnRzLnJlbmRlcmVyLlJlbmRlcmVyLnJlbmRlclJlcGVhdCIsImhvLmNvbXBvbmVudHMucmVuZGVyZXIuUmVuZGVyZXIuZG9tVG9TdHJpbmciLCJoby5jb21wb25lbnRzLnJlbmRlcmVyLlJlbmRlcmVyLnJlcGwiLCJoby5jb21wb25lbnRzLnJlbmRlcmVyLlJlbmRlcmVyLmV2YWx1YXRlIiwiaG8uY29tcG9uZW50cy5yZW5kZXJlci5SZW5kZXJlci5ldmFsdWF0ZVZhbHVlIiwiaG8uY29tcG9uZW50cy5yZW5kZXJlci5SZW5kZXJlci5ldmFsdWF0ZVZhbHVlQW5kTW9kZWwiLCJoby5jb21wb25lbnRzLnJlbmRlcmVyLlJlbmRlcmVyLmV2YWx1YXRlRXhwcmVzc2lvbiIsImhvLmNvbXBvbmVudHMucmVuZGVyZXIuUmVuZGVyZXIuZXZhbHVhdGVGdW5jdGlvbiIsImhvLmNvbXBvbmVudHMucmVuZGVyZXIuUmVuZGVyZXIuY29weU5vZGUiLCJoby5jb21wb25lbnRzLnJlbmRlcmVyLlJlbmRlcmVyLmlzVm9pZCIsImhvLmNvbXBvbmVudHMuaHRtbHByb3ZpZGVyIiwiaG8uY29tcG9uZW50cy5odG1scHJvdmlkZXIuSHRtbFByb3ZpZGVyIiwiaG8uY29tcG9uZW50cy5odG1scHJvdmlkZXIuSHRtbFByb3ZpZGVyLmNvbnN0cnVjdG9yIiwiaG8uY29tcG9uZW50cy5odG1scHJvdmlkZXIuSHRtbFByb3ZpZGVyLnJlc29sdmUiLCJoby5jb21wb25lbnRzLmh0bWxwcm92aWRlci5IdG1sUHJvdmlkZXIuZ2V0SFRNTCIsImhvLmNvbXBvbmVudHMuQXR0cmlidXRlIiwiaG8uY29tcG9uZW50cy5BdHRyaWJ1dGUuY29uc3RydWN0b3IiLCJoby5jb21wb25lbnRzLkF0dHJpYnV0ZS5pbml0IiwiaG8uY29tcG9uZW50cy5BdHRyaWJ1dGUubmFtZSIsImhvLmNvbXBvbmVudHMuQXR0cmlidXRlLnVwZGF0ZSIsImhvLmNvbXBvbmVudHMuQXR0cmlidXRlLmdldE5hbWUiLCJoby5jb21wb25lbnRzLldhdGNoQXR0cmlidXRlIiwiaG8uY29tcG9uZW50cy5XYXRjaEF0dHJpYnV0ZS5jb25zdHJ1Y3RvciIsImhvLmNvbXBvbmVudHMuV2F0Y2hBdHRyaWJ1dGUud2F0Y2giLCJoby5jb21wb25lbnRzLldhdGNoQXR0cmlidXRlLmV2YWwiLCJoby5jb21wb25lbnRzLkNvbXBvbmVudCIsImhvLmNvbXBvbmVudHMuQ29tcG9uZW50LmNvbnN0cnVjdG9yIiwiaG8uY29tcG9uZW50cy5Db21wb25lbnQubmFtZSIsImhvLmNvbXBvbmVudHMuQ29tcG9uZW50LmdldE5hbWUiLCJoby5jb21wb25lbnRzLkNvbXBvbmVudC5nZXRQYXJlbnQiLCJoby5jb21wb25lbnRzLkNvbXBvbmVudC5faW5pdCIsImhvLmNvbXBvbmVudHMuQ29tcG9uZW50LmluaXQiLCJoby5jb21wb25lbnRzLkNvbXBvbmVudC51cGRhdGUiLCJoby5jb21wb25lbnRzLkNvbXBvbmVudC5yZW5kZXIiLCJoby5jb21wb25lbnRzLkNvbXBvbmVudC5pbml0U3R5bGUiLCJoby5jb21wb25lbnRzLkNvbXBvbmVudC5pbml0SFRNTCIsImhvLmNvbXBvbmVudHMuQ29tcG9uZW50LmluaXRQcm9wZXJ0aWVzIiwiaG8uY29tcG9uZW50cy5Db21wb25lbnQuaW5pdENoaWxkcmVuIiwiaG8uY29tcG9uZW50cy5Db21wb25lbnQuaW5pdEF0dHJpYnV0ZXMiLCJoby5jb21wb25lbnRzLkNvbXBvbmVudC5sb2FkUmVxdWlyZW1lbnRzIiwiaG8uY29tcG9uZW50cy5Db21wb25lbnQuZ2V0Q29tcG9uZW50IiwiaG8uY29tcG9uZW50cy5yZWdpc3RyeSIsImhvLmNvbXBvbmVudHMucmVnaXN0cnkuUmVnaXN0cnkiLCJoby5jb21wb25lbnRzLnJlZ2lzdHJ5LlJlZ2lzdHJ5LmNvbnN0cnVjdG9yIiwiaG8uY29tcG9uZW50cy5yZWdpc3RyeS5SZWdpc3RyeS5yZWdpc3RlciIsImhvLmNvbXBvbmVudHMucmVnaXN0cnkuUmVnaXN0cnkucnVuIiwiaG8uY29tcG9uZW50cy5yZWdpc3RyeS5SZWdpc3RyeS5pbml0Q29tcG9uZW50IiwiaG8uY29tcG9uZW50cy5yZWdpc3RyeS5SZWdpc3RyeS5pbml0RWxlbWVudCIsImhvLmNvbXBvbmVudHMucmVnaXN0cnkuUmVnaXN0cnkuaGFzQ29tcG9uZW50IiwiaG8uY29tcG9uZW50cy5yZWdpc3RyeS5SZWdpc3RyeS5oYXNBdHRyaWJ1dGUiLCJoby5jb21wb25lbnRzLnJlZ2lzdHJ5LlJlZ2lzdHJ5LmdldEF0dHJpYnV0ZSIsImhvLmNvbXBvbmVudHMucmVnaXN0cnkuUmVnaXN0cnkubG9hZENvbXBvbmVudCIsImhvLmNvbXBvbmVudHMucmVnaXN0cnkuUmVnaXN0cnkubG9hZEF0dHJpYnV0ZSIsImhvLmNvbXBvbmVudHMucnVuIiwiaG8uY29tcG9uZW50cy5yZWdpc3RlciIsImhvLmZsdXgiLCJoby5mbHV4LkNhbGxiYWNrSG9sZGVyIiwiaG8uZmx1eC5DYWxsYmFja0hvbGRlci5jb25zdHJ1Y3RvciIsImhvLmZsdXguQ2FsbGJhY2tIb2xkZXIucmVnaXN0ZXIiLCJoby5mbHV4LkNhbGxiYWNrSG9sZGVyLnVucmVnaXN0ZXIiLCJoby5mbHV4LnJlZ2lzdHJ5IiwiaG8uZmx1eC5yZWdpc3RyeS5SZWdpc3RyeSIsImhvLmZsdXgucmVnaXN0cnkuUmVnaXN0cnkuY29uc3RydWN0b3IiLCJoby5mbHV4LnJlZ2lzdHJ5LlJlZ2lzdHJ5LnJlZ2lzdGVyIiwiaG8uZmx1eC5yZWdpc3RyeS5SZWdpc3RyeS5nZXQiLCJoby5mbHV4LnJlZ2lzdHJ5LlJlZ2lzdHJ5LmxvYWRTdG9yZSIsImhvLmZsdXguc3RhdGVwcm92aWRlciIsImhvLmZsdXguc3RhdGVwcm92aWRlci5TdGF0ZVByb3ZpZGVyIiwiaG8uZmx1eC5zdGF0ZXByb3ZpZGVyLlN0YXRlUHJvdmlkZXIuY29uc3RydWN0b3IiLCJoby5mbHV4LnN0YXRlcHJvdmlkZXIuU3RhdGVQcm92aWRlci5yZXNvbHZlIiwiaG8uZmx1eC5zdGF0ZXByb3ZpZGVyLlN0YXRlUHJvdmlkZXIuZ2V0U3RhdGVzIiwiaG8uZmx1eC5TdG9yZSIsImhvLmZsdXguU3RvcmUuY29uc3RydWN0b3IiLCJoby5mbHV4LlN0b3JlLmluaXQiLCJoby5mbHV4LlN0b3JlLm5hbWUiLCJoby5mbHV4LlN0b3JlLnJlZ2lzdGVyIiwiaG8uZmx1eC5TdG9yZS5vbiIsImhvLmZsdXguU3RvcmUuaGFuZGxlIiwiaG8uZmx1eC5TdG9yZS5jaGFuZ2VkIiwiaG8uZmx1eC5Sb3V0ZXIiLCJoby5mbHV4LlJvdXRlci5jb25zdHJ1Y3RvciIsImhvLmZsdXguUm91dGVyLmluaXQiLCJoby5mbHV4LlJvdXRlci5nbyIsImhvLmZsdXguUm91dGVyLmluaXRTdGF0ZXMiLCJoby5mbHV4LlJvdXRlci5nZXRTdGF0ZUZyb21OYW1lIiwiaG8uZmx1eC5Sb3V0ZXIub25TdGF0ZUNoYW5nZVJlcXVlc3RlZCIsImhvLmZsdXguUm91dGVyLm9uSGFzaENoYW5nZSIsImhvLmZsdXguUm91dGVyLnNldFVybCIsImhvLmZsdXguUm91dGVyLnJlZ2V4RnJvbVVybCIsImhvLmZsdXguUm91dGVyLmFyZ3NGcm9tVXJsIiwiaG8uZmx1eC5Sb3V0ZXIuc3RhdGVGcm9tVXJsIiwiaG8uZmx1eC5Sb3V0ZXIudXJsRnJvbVN0YXRlIiwiaG8uZmx1eC5Sb3V0ZXIuZXF1YWxzIiwiaG8uZmx1eC5EaXNwYXRjaGVyIiwiaG8uZmx1eC5EaXNwYXRjaGVyLmNvbnN0cnVjdG9yIiwiaG8uZmx1eC5EaXNwYXRjaGVyLndhaXRGb3IiLCJoby5mbHV4LkRpc3BhdGNoZXIuZGlzcGF0Y2giLCJoby5mbHV4LkRpc3BhdGNoZXIuaW52b2tlQ2FsbGJhY2siLCJoby5mbHV4LkRpc3BhdGNoZXIuc3RhcnREaXNwYXRjaGluZyIsImhvLmZsdXguRGlzcGF0Y2hlci5zdG9wRGlzcGF0Y2hpbmciLCJoby5mbHV4LnJ1biIsImhvLnVpIiwiaG8udWkucnVuIiwiaG8udWkuT3B0aW9ucyIsImhvLnVpLk9wdGlvbnMuY29uc3RydWN0b3IiLCJoby51aS5PcHRpb25zLnByb2Nlc3MiLCJoby51aS5PcHRpb25zLnByb2Nlc3NSb290IiwiaG8udWkuT3B0aW9ucy5wcm9jZXNzUm91dGVyIiwiaG8udWkuT3B0aW9ucy5wcm9jZXNzTWFwIiwiaG8udWkuT3B0aW9ucy5wcm9jZXNzRGlyIiwiaG8udWkuT3B0aW9ucy5wcm9jZXNzTWluIl0sIm1hcHBpbmdzIjoiQUFBQSxJQUFPLEVBQUUsQ0FnTFI7QUFoTEQsV0FBTyxFQUFFO0lBQUNBLElBQUFBLE9BQU9BLENBZ0xoQkE7SUFoTFNBLFdBQUFBLE9BQU9BLEVBQUNBLENBQUNBO1FBRWZDO1lBRUlDLGlCQUFZQSxJQUEyREE7Z0JBYS9EQyxTQUFJQSxHQUFRQSxTQUFTQSxDQUFDQTtnQkFDdEJBLGNBQVNBLEdBQW9CQSxTQUFTQSxDQUFDQTtnQkFDdkNBLGFBQVFBLEdBQW9CQSxTQUFTQSxDQUFDQTtnQkFFdkNBLGFBQVFBLEdBQVlBLEtBQUtBLENBQUNBO2dCQUMxQkEsYUFBUUEsR0FBWUEsS0FBS0EsQ0FBQ0E7Z0JBQzFCQSxTQUFJQSxHQUFZ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LENBQUNBLElBQUlBLEVBQUVBLENBQUNBOzRCQUNsQkEsSUFBSUEsR0FBR0EsQ0FBQ0EsR0FBR0EsR0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsS0FBS0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7NEJBQ3ZDQSxPQUFPQSxHQUFHQSxHQUFHQSxDQUFDQSxDQUFDQSxDQUFDQSxLQUFLQSxHQUFHQSxDQUFDQTs0QkFDVkEsTUFBTUEsR0FBR0EsSUFBSUEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0E7NEJBQzFDQSxXQUFXQSxHQUFHQSxNQUFNQSxJQUFJQSxHQUFHQSxDQUFDQSxHQUFHQSxDQUFDQSxNQUFNQSxHQUFDQSxDQUFDQSxDQUFDQSxLQUFLQSxHQUFHQSxDQUFDQTs0QkFDbERBLE1BQU1BLEdBQUdBLENBQUNBLENBQUNBLEdBQUdBLENBQUNBLEtBQUtBLENBQUNBLElBQUlBLENBQUNBLENBQUNBLENBQUNBLE1BQU1BLENBQUNBLENBQUNBOzRCQUVwQ0EsRUFBRUEsQ0FBQUEsQ0FBQ0EsV0FBV0EsSUFBSUEsRUFBRUEsQ0FBQ0EsVUFBVUEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsWUFBWUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7Z0NBQ3RFQSxXQUFXQSxHQUFHQSxLQUFLQSxDQUFDQTtnQ0FDcEJBLEdBQUdBLEdBQUdBLEdBQUdBLENBQUNBLE1BQU1BLENBQUNBLENBQUNBLEVBQUVBLEdBQUdBLENBQUNBLE1BQU1BLEdBQUNBLENBQUNBLENBQUNBLEdBQUdBLEdBQUdBLENBQUNBO2dDQUV4Q0EsT0FBT0EsR0FBR0EsSUFBSUEsQ0FBQ0E7NEJBQ2hCQSxDQUFDQTt3QkFDRkEsQ0FBQ0E7d0JBRURBLElBQUlBLEdBQUdBLElBQUlBLENBQUNBLEtBQUtBLENBQUNBLEdBQUdBLENBQUNBLE1BQU1BLEdBQUdBLENBQUNBLElBQUlBLEtBQUtBLE1BQU1BLEdBQUdBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBLENBQUVBLENBQUNBO3dCQUUzREEsRUFBRUEsQ0FBQUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7NEJBQ1pBLEtBQUtBLENBQUNBO3dCQUNQQSxDQUFDQTt3QkFBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0E7NEJBQ1BBLElBQUlBLENBQUNBLFFBQVFBLENBQUNBLElBQUlBLENBQUNBLEVBQUNBLE1BQU1BLEVBQUVBLElBQUlBLEVBQUVBLElBQUlBLEVBQUVBLEdBQUdBLEVBQUVBLElBQUlBLEVBQUVBLElBQUlBLEVBQUVBLE1BQU1BLEVBQUVBLE1BQU1BLEVBQUVBLFdBQVdBLEVBQUVBLFdBQVdBLEVBQUVBLE1BQU1BLEVBQUVBLE1BQU1BLEVBQUVBLFFBQVFBLEVBQUVBLEVBQUVBLEVBQUNBLENBQUNBLENBQUNBOzRCQUVsSUEsRUFBRUEsQ0FBQUEsQ0FBQ0EsQ0FBQ0EsT0FBT0EsSUFBSUEsQ0FBQ0EsV0FBV0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7Z0NBQzdCQSxJQUFJQSxNQUFNQSxHQUFHQSxJQUFJQSxDQUFDQSxLQUFLQSxDQUFDQSxJQUFJQSxFQUFFQSxJQUFJQSxDQUFDQSxRQUFRQSxDQUFDQSxJQUFJQSxDQUFDQSxRQUFRQSxDQUFDQSxNQUFNQSxHQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtnQ0FDckVBLElBQUlBLEdBQUdBLE1BQU1BLENBQUNBLElBQUlBLENBQUNBO2dDQUNuQkEsSUFBSUEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsR0FBR0EsRUFBRUEsQ0FBQ0E7Z0NBQ3BCQSxJQUFJQSxDQUFDQSxRQUFRQSxDQUFDQSxJQUFJQSxDQUFDQSxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQTs0QkFDakNBLENBQUNBO3dCQUNGQSxDQUFDQTt3QkFFREEsQ0FBQ0EsR0FBR0EsSUFBSUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0E7b0JBQzVCQSxDQUFDQTtvQkFFREEsTUFBTUEsQ0FB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RUFBRUEsR0FBRkEsS0FBRUEsS0FBRkEsS0FBRUEsUUEwSFhBO0FBQURBLENBQUNBLEVBMUhNLEVBQUUsS0FBRixFQUFFLFFBMEhSIiwiZmlsZSI6ImhvLWFsbC5qcyIsInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZSBoby5wcm9taXNlIHtcclxuXHJcbiAgICBleHBvcnQgY2xhc3MgUHJvbWlzZTxULCBFPiB7XHJcblxyXG4gICAgICAgIGNvbnN0cnVjdG9yKGZ1bmM/OiAocmVzb2x2ZTooYXJnOlQpPT52b2lkLCByZWplY3Q6KGFyZzpFKT0+dm9pZCkgPT4gYW55KSB7XHJcbiAgICAgICAgICAgIGlmICh0eXBlb2YgZnVuYyA9PT0gJ2Z1bmN0aW9uJylcclxuICAgICAgICAgICAgICAgIGZ1bmMuY2FsbChcclxuICAgICAgICAgICAgICAgICAgICBhcmd1bWVudHMuY2FsbGVlLFxyXG4gICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uKGFyZzogVCl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucmVzb2x2ZShhcmcpXHJcbiAgICAgICAgICAgICAgICAgICAgfS5iaW5kKHRoaXMpLFxyXG4gICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uKGFyZzpFKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5yZWplY3QoYXJnKTtcclxuICAgICAgICAgICAgICAgICAgICB9LmJpbmQodGhpcylcclxuICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIGRhdGE6IFR8RSA9IHVuZGVmaW5lZDtcclxuICAgICAgICBwcml2YXRlIG9uUmVzb2x2ZTogKGFyZzE6VCkgPT4gYW55ID0gdW5kZWZpbmVkO1xyXG4gICAgICAgIHByaXZhdGUgb25SZWplY3Q6IChhcmcxOkUpID0+IGFueSA9IHVuZGVmaW5lZDtcclxuXHJcbiAgICAgICAgcHVibGljIHJlc29sdmVkOiBib29sZWFuID0gZmFsc2U7XHJcbiAgICAgICAgcHVibGljIHJlamVjdGVkOiBib29sZWFuID0gZmFsc2U7XHJcbiAgICAgICAgcHVibGljIGRvbmU6IGJvb2xlYW4gPSBmYWxzZTtcclxuXHJcbiAgICAgICAgcHJpdmF0ZSByZXQ6IFByb21pc2U8VCwgRT4gPSB1bmRlZmluZWQ7XHJcblxyXG4gICAgICAgIHByaXZhdGUgc2V0KGRhdGE/OiBUfEUpOiB2b2lkIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuZG9uZSlcclxuICAgICAgICAgICAgICAgIHRocm93IFwiUHJvbWlzZSBpcyBhbHJlYWR5IHJlc29sdmVkIC8gcmVqZWN0ZWRcIjtcclxuICAgICAgICAgICAgdGhpcy5kYXRhID0gZGF0YTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyByZXNvbHZlKGRhdGE/OiBUKTogdm9pZCB7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0KGRhdGEpO1xyXG4gICAgICAgICAgICB0aGlzLnJlc29sdmVkID0gdGhpcy5kb25lID0gdHJ1ZTtcclxuICAgICAgICAgICAgaWYgKHR5cGVvZiB0aGlzLm9uUmVzb2x2ZSA9PT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fcmVzb2x2ZSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIF9yZXNvbHZlKCk6IHZvaWQge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5yZXQgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5yZXQgPSBuZXcgUHJvbWlzZTxULEU+KCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHZhciB2OiBhbnkgPSB0aGlzLm9uUmVzb2x2ZSg8VD50aGlzLmRhdGEpO1xyXG5cclxuICAgICAgICAgICAgaWYgKHYgJiYgdiBpbnN0YW5jZW9mIFByb21pc2UpIHtcclxuICAgICAgICAgICAgICAgIHYudGhlbih0aGlzLnJldC5yZXNvbHZlLmJpbmQodGhpcy5yZXQpLCB0aGlzLnJldC5yZWplY3QuYmluZCh0aGlzLnJldCkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5yZXQucmVzb2x2ZSh2KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHJlamVjdChkYXRhPzogRSk6IHZvaWQge1xyXG4gICAgICAgICAgICB0aGlzLnNldChkYXRhKTtcclxuICAgICAgICAgICAgdGhpcy5yZWplY3RlZCA9IHRoaXMuZG9uZSA9IHRydWU7XHJcblxyXG4gICAgICAgICAgICBpZiAodHlwZW9mIHRoaXMub25SZWplY3QgPT09ICdmdW5jdGlvbicpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMub25SZWplY3QoPEU+dGhpcy5kYXRhKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKHRoaXMucmV0KSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnJldC5yZWplY3QoPEU+dGhpcy5kYXRhKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSBfcmVqZWN0KCk6IHZvaWQge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5yZXQgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5yZXQgPSBuZXcgUHJvbWlzZTxULEU+KCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmKHR5cGVvZiB0aGlzLm9uUmVqZWN0ID09PSAnZnVuY3Rpb24nKVxyXG4gICAgICAgICAgICAgICAgdGhpcy5vblJlamVjdCg8RT50aGlzLmRhdGEpO1xyXG4gICAgICAgICAgICB0aGlzLnJldC5yZWplY3QoPEU+dGhpcy5kYXRhKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyB0aGVuKHJlczogKGFyZzE6VCk9PmFueSwgcmVqPzogKGFyZzE6RSk9PmFueSk6IFByb21pc2U8YW55LGFueT4ge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5yZXQgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5yZXQgPSBuZXcgUHJvbWlzZTxULEU+KCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChyZXMgJiYgdHlwZW9mIHJlcyA9PT0gJ2Z1bmN0aW9uJylcclxuICAgICAgICAgICAgICAgIHRoaXMub25SZXNvbHZlID0gcmVzO1xyXG5cclxuICAgICAgICAgICAgaWYgKHJlaiAmJiB0eXBlb2YgcmVqID09PSAnZnVuY3Rpb24nKVxyXG4gICAgICAgICAgICAgICAgdGhpcy5vblJlamVjdCA9IHJlajtcclxuXHJcbiAgICAgICAgICAgIGlmICh0aGlzLnJlc29sdmVkKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9yZXNvbHZlKCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmICh0aGlzLnJlamVjdGVkKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9yZWplY3QoKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMucmV0O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIGNhdGNoKGNiOiAoYXJnMTpFKT0+YW55KTogdm9pZCB7XHJcbiAgICAgICAgICAgIHRoaXMub25SZWplY3QgPSBjYjtcclxuXHJcbiAgICAgICAgICAgIGlmICh0aGlzLnJlamVjdGVkKVxyXG4gICAgICAgICAgICAgICAgdGhpcy5fcmVqZWN0KCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzdGF0aWMgYWxsKGFycjogQXJyYXk8UHJvbWlzZTxhbnksIGFueT4+KTogUHJvbWlzZTxhbnksIGFueT4ge1xyXG4gICAgICAgICAgICB2YXIgcCA9IG5ldyBQcm9taXNlKCk7XHJcblxyXG4gICAgICAgICAgICB2YXIgZGF0YSA9IFtdO1xyXG5cclxuICAgICAgICAgICAgaWYgKGFyci5sZW5ndGggPT09IDApIHtcclxuICAgICAgICAgICAgICAgIHAucmVzb2x2ZSgpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgYXJyLmZvckVhY2goKHByb20sIGluZGV4KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgcHJvbVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbihkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwLmRvbmUpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhW2luZGV4XSA9IGQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhbGxSZXNvbHZlZCA9IGFyci5yZWR1Y2UoZnVuY3Rpb24oc3RhdGUsIHAxKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gc3RhdGUgJiYgcDEucmVzb2x2ZWQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIHRydWUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoYWxsUmVzb2x2ZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHAucmVzb2x2ZShkYXRhKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAuY2F0Y2goZnVuY3Rpb24oZXJyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHAucmVqZWN0KGVycik7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHA7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzdGF0aWMgY2hhaW4oYXJyOiBBcnJheTxQcm9taXNlPGFueSwgYW55Pj4pOiBQcm9taXNlPGFueSwgYW55PiB7XHJcbiAgICAgICAgICAgIHZhciBwOiBQcm9taXNlPGFueSwgYW55PiA9IG5ldyBQcm9taXNlKCk7XHJcbiAgICAgICAgICAgIHZhciBkYXRhOiBBcnJheTxhbnk+ID0gW107XHJcblxyXG4gICAgICAgICAgICBmdW5jdGlvbiBuZXh0KCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHAuZG9uZSlcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICAgICAgICAgICAgdmFyIG46IFByb21pc2U8YW55LCBhbnk+ID0gYXJyLmxlbmd0aCA/IGFyci5zaGlmdCgpIDogcDtcclxuICAgICAgICAgICAgICAgIG4udGhlbihcclxuICAgICAgICAgICAgICAgICAgICAocmVzdWx0KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEucHVzaChyZXN1bHQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBuZXh0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAoZXJyKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHAucmVqZWN0KGVycik7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIG5leHQoKTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBwO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc3RhdGljIGNyZWF0ZShvYmo6IGFueSk6IFByb21pc2U8YW55LCBhbnk+IHtcclxuICAgICAgICAgICAgaWYgKG9iaiBpbnN0YW5jZW9mIFByb21pc2UpXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gb2JqO1xyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHZhciBwID0gbmV3IFByb21pc2UoKTtcclxuICAgICAgICAgICAgICAgIHAucmVzb2x2ZShvYmopO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHA7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG59XHJcbiIsIm1vZHVsZSBoby5jbGFzc2xvYWRlci51dGlsIHtcblxuXHRleHBvcnQgZnVuY3Rpb24gZ2V0KHBhdGg6IHN0cmluZywgb2JqOmFueSA9IHdpbmRvdyk6IGFueSB7XG5cdFx0cGF0aC5zcGxpdCgnLicpLm1hcChwYXJ0ID0+IHtcblx0XHRcdG9iaiA9IG9ialtwYXJ0XTtcblx0XHR9KVxuXHRcdHJldHVybiBvYmo7XG5cdH1cbn1cbiIsIm1vZHVsZSBoby5jbGFzc2xvYWRlci51dGlsIHtcblx0ZXhwb3J0IGZ1bmN0aW9uIGV4cG9zZShuYW1lOnN0cmluZywgb2JqOmFueSwgZXJyb3IgPSBmYWxzZSkge1xuXHRcdGxldCBwYXRoID0gbmFtZS5zcGxpdCgnLicpO1xuXHRcdG5hbWUgPSBwYXRoLnBvcCgpO1xuXG5cdFx0bGV0IGdsb2JhbCA9IHdpbmRvdztcblxuXHRcdHBhdGgubWFwKHBhcnQgPT4ge1xuXHRcdFx0Z2xvYmFsW3BhcnRdID0gZ2xvYmFsW3BhcnRdIHx8IHt9O1xuXHRcdFx0Z2xvYmFsID0gZ2xvYmFsW3BhcnRdO1xuXHRcdH0pXG5cblx0XHRpZighIWdsb2JhbFtuYW1lXSkge1xuXHRcdFx0bGV0IG1zZyA9IFwiR2xvYmFsIG9iamVjdCBcIiArIHBhdGguam9pbignLicpICsgXCIuXCIgKyBuYW1lICsgXCIgYWxyZWFkeSBleGlzdHNcIjtcblx0XHRcdGlmKGVycm9yKVxuXHRcdFx0XHR0aHJvdyBtc2c7XG5cdFx0XHRlbHNlXG5cdFx0XHRcdGNvbnNvbGUuaW5mbyhtc2cpO1xuXG5cdFx0fVxuXG5cdFx0Z2xvYmFsW25hbWVdID0gb2JqO1xuXHR9XG59XG4iLCJtb2R1bGUgaG8uY2xhc3Nsb2FkZXIueGhyIHtcblxuXHRleHBvcnQgZnVuY3Rpb24gZ2V0KHVybDogc3RyaW5nKTogaG8ucHJvbWlzZS5Qcm9taXNlPHN0cmluZywgc3RyaW5nPiB7XG5cdFx0cmV0dXJuIG5ldyBoby5wcm9taXNlLlByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuXG4gICAgICAgICAgICAgICAgbGV0IHhtbGh0dHAgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICAgICAgICAgICAgICB4bWxodHRwLm9ucmVhZHlzdGF0ZWNoYW5nZSA9ICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYoeG1saHR0cC5yZWFkeVN0YXRlID09IDQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCByZXNwID0geG1saHR0cC5yZXNwb25zZVRleHQ7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZih4bWxodHRwLnN0YXR1cyA9PSAyMDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKHJlc3ApO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVqZWN0KHJlc3ApO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgIHhtbGh0dHAub3BlbignR0VUJywgdXJsKTtcbiAgICAgICAgICAgICAgICB4bWxodHRwLnNlbmQoKTtcbiAgICAgICAgICAgIH0pO1xuXHR9XG59XG4iLCJtb2R1bGUgaG8uY2xhc3Nsb2FkZXIge1xuXG5cdGV4cG9ydCB0eXBlIGNsYXp6ID0gRnVuY3Rpb247XG5cdGV4cG9ydCB0eXBlIFByb21pc2VPZkNsYXNzZXMgPSBoby5wcm9taXNlLlByb21pc2U8Y2xhenpbXSwgYW55PjtcblxufVxuIiwibW9kdWxlIGhvLmNsYXNzbG9hZGVyIHtcblxuXHRleHBvcnQgaW50ZXJmYWNlIElMb2FkQXJndW1lbnRzIHtcblx0XHRuYW1lPzogc3RyaW5nO1xuXHRcdHVybD86IHN0cmluZztcblx0XHRwYXJlbnQ/OiBib29sZWFuO1xuXHRcdGV4cG9zZT86IGJvb2xlYW47XG5cdFx0c3VwZXI/OiBBcnJheTxzdHJpbmc+O1xuXHR9XG5cblx0ZXhwb3J0IGNsYXNzIExvYWRBcmd1bWVudHMgaW1wbGVtZW50cyBJTG9hZEFyZ3VtZW50cyB7XG5cblx0XHRuYW1lOiBzdHJpbmc7XG5cdFx0dXJsOiBzdHJpbmc7XG5cdFx0cGFyZW50OiBib29sZWFuO1xuXHRcdGV4cG9zZTogYm9vbGVhbjtcblx0XHRzdXBlcjogQXJyYXk8c3RyaW5nPjtcblxuXHRcdGNvbnN0cnVjdG9yKGFyZzogSUxvYWRBcmd1bWVudHMsIHJlc29sdmVVcmw6IChuYW1lOnN0cmluZyk9PnN0cmluZykge1xuXHRcdFx0dGhpcy5uYW1lID0gYXJnLm5hbWU7XG5cdFx0XHR0aGlzLnVybCA9IGFyZy51cmwgfHwgcmVzb2x2ZVVybChhcmcubmFtZSk7XG5cdFx0XHR0aGlzLnBhcmVudCA9IGFyZy5wYXJlbnQgfHwgdHJ1ZTtcblx0XHRcdHRoaXMuZXhwb3NlID0gYXJnLmV4cG9zZSB8fCB0cnVlO1xuXHRcdFx0dGhpcy5zdXBlciA9IGFyZy5zdXBlcjtcblx0XHR9XG5cblx0fVxuXG59XG4iLCJtb2R1bGUgaG8uY2xhc3Nsb2FkZXIge1xuXG5cdGV4cG9ydCBlbnVtIFdhcm5MZXZlbCB7XG5cdFx0SU5GTyxcblx0XHRFUlJPUlxuXHR9XG5cblx0ZXhwb3J0IGludGVyZmFjZSBJTG9hZGVyQ29uZmlnIHtcblx0XHRsb2FkVHlwZT86IExvYWRUeXBlO1xuXHRcdHVybFRlbXBsYXRlPzogc3RyaW5nO1xuXHRcdHVzZURpcj86IGJvb2xlYW47XG5cdFx0dXNlTWluPzogYm9vbGVhbjtcblx0XHQvL2V4aXN0cz86IChuYW1lOiBzdHJpbmcpPT5ib29sZWFuO1xuXHRcdGNhY2hlPzogYm9vbGVhbjtcblx0XHR3YXJuTGV2ZWw/OiBXYXJuTGV2ZWxcblx0fVxuXG5cdGV4cG9ydCBjbGFzcyBMb2FkZXJDb25maWcgaW1wbGVtZW50cyBJTG9hZGVyQ29uZmlnIHtcblxuXHRcdGxvYWRUeXBlOiBMb2FkVHlwZTtcblx0XHR1cmxUZW1wbGF0ZTogc3RyaW5nO1xuXHRcdHVzZURpcjogYm9vbGVhbjtcblx0XHR1c2VNaW46IGJvb2xlYW47XG5cdFx0Ly9leGlzdHM6IChuYW1lOiBzdHJpbmcpPT5ib29sZWFuO1xuXHRcdGNhY2hlOiBib29sZWFuO1xuXHRcdHdhcm5MZXZlbDogV2FybkxldmVsO1xuXG5cdFx0Y29uc3RydWN0b3IoYzogSUxvYWRlckNvbmZpZyA9IDxJTG9hZGVyQ29uZmlnPnt9KSB7XG5cdFx0XHR0aGlzLmxvYWRUeXBlID0gYy5sb2FkVHlwZSB8fCBMb2FkVHlwZS5FVkFMO1xuXHRcdFx0dGhpcy51cmxUZW1wbGF0ZSA9IGMudXJsVGVtcGxhdGUgfHwgXCIke25hbWV9LmpzXCJcblx0XHRcdHRoaXMudXNlRGlyID0gdHlwZW9mIGMudXNlRGlyID09PSAnYm9vbGVhbicgPyBjLnVzZURpciA6IHRydWU7XG5cdFx0XHR0aGlzLnVzZU1pbiA9IHR5cGVvZiBjLnVzZU1pbiA9PT0gJ2Jvb2xlYW4nID8gYy51c2VNaW4gOiBmYWxzZTtcblx0XHRcdC8vdGhpcy5leGlzdHMgPSBjLmV4aXN0cyB8fCB0aGlzLmV4aXN0cy5iaW5kKHRoaXMpO1xuXHRcdFx0dGhpcy5jYWNoZSA9IHR5cGVvZiBjLmNhY2hlID09PSAnYm9vbGVhbicgPyBjLmNhY2hlIDogdHJ1ZTtcblx0XHRcdHRoaXMud2FybkxldmVsID0gYy53YXJuTGV2ZWwgfHwgV2FybkxldmVsLklORk87XG5cdFx0fVxuXG5cdH1cblxufVxuIiwibW9kdWxlIGhvLmNsYXNzbG9hZGVyIHtcblxuXHRleHBvcnQgZW51bSBMb2FkVHlwZSB7XG5cdFx0U0NSSVBULFxuXHRcdEZVTkNUSU9OLFxuXHRcdEVWQUxcblx0fVxuXHRcbn1cbiIsIm1vZHVsZSBoby5jbGFzc2xvYWRlciB7XG5cblx0ZXhwb3J0IGxldCBtYXBwaW5nOiB7W2tleTpzdHJpbmddOiBzdHJpbmd9ID0ge31cblxuXHRleHBvcnQgY2xhc3MgQ2xhc3NMb2FkZXIge1xuXG5cdFx0cHJpdmF0ZSBjb25mOiBJTG9hZGVyQ29uZmlnID0gPElMb2FkZXJDb25maWc+e307XG5cdFx0cHJpdmF0ZSBjYWNoZToge1trZXk6c3RyaW5nXTogRnVuY3Rpb259ID0ge31cblxuXHRcdGNvbnN0cnVjdG9yKGM/OiBJTG9hZGVyQ29uZmlnKSB7XG5cdFx0XHR0aGlzLmNvbmYgPSBuZXcgTG9hZGVyQ29uZmlnKGMpO1xuXHRcdH1cblxuXHRcdGNvbmZpZyhjOiBJTG9hZGVyQ29uZmlnKTogdm9pZCB7XG5cdFx0XHR0aGlzLmNvbmYgPSBuZXcgTG9hZGVyQ29uZmlnKGMpO1xuXHRcdH1cblxuXHRcdGxvYWQoYXJnOiBJTG9hZEFyZ3VtZW50cykge1xuXHRcdFx0YXJnID0gbmV3IExvYWRBcmd1bWVudHMoYXJnLCB0aGlzLnJlc29sdmVVcmwuYmluZCh0aGlzKSk7XG5cblx0XHRcdHN3aXRjaCh0aGlzLmNvbmYubG9hZFR5cGUpIHtcblx0XHRcdFx0Y2FzZSBMb2FkVHlwZS5TQ1JJUFQ6XG5cdFx0XHRcdFx0cmV0dXJuIHRoaXMubG9hZF9zY3JpcHQoYXJnKTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSBMb2FkVHlwZS5GVU5DVElPTjpcblx0XHRcdFx0XHRyZXR1cm4gdGhpcy5sb2FkX2Z1bmN0aW9uKGFyZyk7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgTG9hZFR5cGUuRVZBTDpcblx0XHRcdFx0XHRyZXR1cm4gdGhpcy5sb2FkX2V2YWwoYXJnKTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdH1cblx0XHR9XG5cblx0XHRwcm90ZWN0ZWQgbG9hZF9zY3JpcHQoYXJnOiBJTG9hZEFyZ3VtZW50cyk6IFByb21pc2VPZkNsYXNzZXMge1xuXHRcdFx0bGV0IHNlbGYgPSB0aGlzO1xuXHRcdFx0bGV0IHBhcmVudHMgPSBbXTtcblx0XHRcdGxldCBwID0gbmV3IGhvLnByb21pc2UuUHJvbWlzZTxjbGF6eltdLCBhbnk+KCk7XG5cblx0XHRcdGlmKHRoaXMuY29uZi5jYWNoZSAmJiAhIXRoaXMuY2FjaGVbYXJnLm5hbWVdKVxuXHRcdFx0XHRyZXR1cm4gaG8ucHJvbWlzZS5Qcm9taXNlLmNyZWF0ZShbdGhpcy5jYWNoZVthcmcubmFtZV1dKTtcblxuXHRcdFx0aWYoISFhcmcucGFyZW50KSB7XG5cdFx0XHRcdHRoaXMuZ2V0UGFyZW50TmFtZShhcmcudXJsKVxuXHRcdFx0XHQudGhlbihwYXJlbnROYW1lID0+IHtcblx0XHRcdFx0XHQvL2lmKGFyZy5zdXBlciA9PT0gcGFyZW50TmFtZSlcblx0XHRcdFx0XHRpZihhcmcuc3VwZXIuaW5kZXhPZihwYXJlbnROYW1lKSAhPT0gLTEpXG5cdFx0XHRcdFx0XHRyZXR1cm4gW107XG5cdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0cmV0dXJuIHNlbGYubG9hZCh7bmFtZTogcGFyZW50TmFtZSwgcGFyZW50OiB0cnVlLCBleHBvc2U6IGFyZy5leHBvc2UsIHN1cGVyOiBhcmcuc3VwZXJ9KVxuXHRcdFx0XHR9KVxuXHRcdFx0XHQudGhlbihwID0+IHtcblx0XHRcdFx0XHRwYXJlbnRzID0gcFxuXHRcdFx0XHRcdHJldHVybiBsb2FkX2ludGVybmFsKCk7XG5cdFx0XHRcdH0pXG5cdFx0XHRcdC50aGVuKGNsYXp6ID0+IHtcblx0XHRcdFx0XHRpZihzZWxmLmNvbmYuY2FjaGUpXG5cdFx0XHRcdFx0XHRzZWxmLmNhY2hlW2FyZy5uYW1lXSA9IGNsYXp6O1xuXHRcdFx0XHRcdHBhcmVudHMgPSBwYXJlbnRzLmNvbmNhdChjbGF6eik7XG5cdFx0XHRcdFx0cC5yZXNvbHZlKHBhcmVudHMpO1xuXHRcdFx0XHR9KVxuXHRcdFx0fVxuXHRcdFx0ZWxzZSB7XG5cdFx0XHRcdGxvYWRfaW50ZXJuYWwoKVxuXHRcdFx0XHQudGhlbihjbGF6eiA9PiB7XG5cdFx0XHRcdFx0cC5yZXNvbHZlKGNsYXp6KTtcblx0XHRcdFx0fSlcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIHA7XG5cblxuXHRcdFx0ZnVuY3Rpb24gbG9hZF9pbnRlcm5hbCgpOiBQcm9taXNlT2ZDbGFzc2VzIHtcblx0XHRcdFx0cmV0dXJuIG5ldyBoby5wcm9taXNlLlByb21pc2U8Y2xhenpbXSwgYW55PigocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG5cdFx0XHRcdFx0bGV0IHNyYyA9IGFyZy51cmw7XG5cdFx0XHRcdFx0bGV0IHNjcmlwdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NjcmlwdCcpO1xuXHRcdFx0XHRcdHNjcmlwdC5vbmxvYWQgPSBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRcdGlmKHR5cGVvZiB1dGlsLmdldChhcmcubmFtZSkgPT09ICdmdW5jdGlvbicpXG5cdFx0XHRcdFx0XHRcdHJlc29sdmUoW3V0aWwuZ2V0KGFyZy5uYW1lKV0pO1xuXHRcdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0XHRyZWplY3QoYEVycm9yIHdoaWxlIGxvYWRpbmcgQ2xhc3MgJHthcmcubmFtZX1gKVxuXHRcdFx0XHRcdH0uYmluZCh0aGlzKTtcblx0XHRcdFx0XHRzY3JpcHQuc3JjID0gc3JjO1xuXHRcdFx0XHRcdGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdoZWFkJylbMF0uYXBwZW5kQ2hpbGQoc2NyaXB0KTtcblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cblx0XHR9XG5cblx0XHRwcm90ZWN0ZWQgbG9hZF9mdW5jdGlvbihhcmc6IElMb2FkQXJndW1lbnRzKTogUHJvbWlzZU9mQ2xhc3NlcyB7XG5cdFx0XHRsZXQgc2VsZiA9IHRoaXM7XG5cdFx0XHRsZXQgcGFyZW50cyA9IFtdO1xuXHRcdFx0bGV0IHNvdXJjZTtcblxuXHRcdFx0cmV0dXJuIHhoci5nZXQoYXJnLnVybClcblx0XHRcdC50aGVuKHNyYyA9PiB7XG5cdFx0XHRcdHNvdXJjZSA9IHNyYztcblx0XHRcdFx0aWYoISFhcmcucGFyZW50KSB7XG5cdFx0XHRcdFx0bGV0IHBhcmVudE5hbWUgPSBzZWxmLnBhcnNlUGFyZW50RnJvbVNvdXJjZShzcmMpO1xuXHRcdFx0XHRcdC8vaWYoYXJnLnN1cGVyID09PSBwYXJlbnROYW1lKVxuXHRcdFx0XHRcdGlmKGFyZy5zdXBlci5pbmRleE9mKHBhcmVudE5hbWUpICE9PSAtMSlcblx0XHRcdFx0XHRcdHJldHVybiBbXTtcblx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRyZXR1cm4gc2VsZi5sb2FkKHtuYW1lOiBwYXJlbnROYW1lLCBwYXJlbnQ6IHRydWUsIGV4cG9zZTogYXJnLmV4cG9zZSwgc3VwZXI6IGFyZy5zdXBlcn0pO1xuXHRcdFx0XHR9XG5cdFx0XHR9KVxuXHRcdFx0LnRoZW4ocCA9PiB7XG5cdFx0XHRcdHBhcmVudHMgPSBwO1xuXHRcdFx0XHRsZXQgc3JjID0gc291cmNlICsgXCJcXG5yZXR1cm4gXCIgKyBhcmcubmFtZSArIFwiXFxuLy8jIHNvdXJjZVVSTD1cIiArIHdpbmRvdy5sb2NhdGlvbi5ocmVmICsgYXJnLnVybDtcblx0XHRcdFx0bGV0IGNsYXp6ID0gbmV3IEZ1bmN0aW9uKHNyYykoKTtcblx0XHRcdFx0aWYoYXJnLmV4cG9zZSlcblx0XHRcdFx0XHR1dGlsLmV4cG9zZShhcmcubmFtZSwgY2xhenosIHNlbGYuY29uZi53YXJuTGV2ZWwgPT0gV2FybkxldmVsLkVSUk9SKTtcblx0XHRcdFx0cmV0dXJuIGNsYXp6XG5cdFx0XHR9KVxuXHRcdFx0LnRoZW4oY2xhenogPT4ge1xuXHRcdFx0XHRpZihzZWxmLmNvbmYuY2FjaGUpXG5cdFx0XHRcdFx0c2VsZi5jYWNoZVthcmcubmFtZV0gPSBjbGF6ejtcblx0XHRcdFx0cGFyZW50cy5wdXNoKGNsYXp6KTtcblx0XHRcdFx0cmV0dXJuIHBhcmVudHM7XG5cdFx0XHR9KVxuXHRcdH1cblxuXHRcdHByb3RlY3RlZCBsb2FkX2V2YWwoYXJnOiBJTG9hZEFyZ3VtZW50cyk6IFByb21pc2VPZkNsYXNzZXMge1xuXHRcdFx0bGV0IHNlbGYgPSB0aGlzO1xuXHRcdFx0bGV0IHBhcmVudHMgPSBbXTtcblx0XHRcdGxldCBzb3VyY2U7XG5cblx0XHRcdHJldHVybiB4aHIuZ2V0KGFyZy51cmwpXG5cdFx0XHQudGhlbihzcmMgPT4ge1xuXHRcdFx0XHRzb3VyY2UgPSBzcmM7XG5cdFx0XHRcdGlmKCEhYXJnLnBhcmVudCkge1xuXHRcdFx0XHRcdGxldCBwYXJlbnROYW1lID0gc2VsZi5wYXJzZVBhcmVudEZyb21Tb3VyY2Uoc3JjKTtcblx0XHRcdFx0XHQvL2lmKGFyZy5zdXBlciA9PT0gcGFyZW50TmFtZSlcblx0XHRcdFx0XHRpZihhcmcuc3VwZXIuaW5kZXhPZihwYXJlbnROYW1lKSAhPT0gLTEpXG5cdFx0XHRcdFx0XHRyZXR1cm4gW107XG5cdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0cmV0dXJuIHNlbGYubG9hZCh7bmFtZTogcGFyZW50TmFtZSwgcGFyZW50OiB0cnVlLCBleHBvc2U6IGFyZy5leHBvc2UsIHN1cGVyOiBhcmcuc3VwZXJ9KTtcblx0XHRcdFx0fVxuXHRcdFx0fSlcblx0XHRcdC50aGVuKHAgPT4ge1xuXHRcdFx0XHRwYXJlbnRzID0gcDtcblx0XHRcdFx0bGV0IHJldCA9IFwiXFxuKGZ1bmN0aW9uKCl7cmV0dXJuIFwiICsgYXJnLm5hbWUgKyBcIjt9KSgpO1wiO1xuXHRcdFx0XHRsZXQgc3JjID0gc291cmNlICsgcmV0ICsgXCJcXG4vLyMgc291cmNlVVJMPVwiICsgd2luZG93LmxvY2F0aW9uLmhyZWYgKyBhcmcudXJsO1xuXHRcdFx0XHRsZXQgY2xhenogPSBldmFsKHNyYyk7XG5cdFx0XHRcdGlmKGFyZy5leHBvc2UpXG5cdFx0XHRcdFx0dXRpbC5leHBvc2UoYXJnLm5hbWUsIGNsYXp6LCBzZWxmLmNvbmYud2FybkxldmVsID09IFdhcm5MZXZlbC5FUlJPUik7XG5cdFx0XHRcdHJldHVybiBjbGF6ejtcblx0XHRcdH0pXG5cdFx0XHQudGhlbihjbGF6eiA9PiB7XG5cdFx0XHRcdGlmKHNlbGYuY29uZi5jYWNoZSlcblx0XHRcdFx0XHRzZWxmLmNhY2hlW2FyZy5uYW1lXSA9IGNsYXp6O1xuXHRcdFx0XHRwYXJlbnRzLnB1c2goY2xhenopO1xuXHRcdFx0XHRyZXR1cm4gcGFyZW50cztcblx0XHRcdH0pXG5cdFx0fVxuXG5cdFx0cHJvdGVjdGVkIGdldFBhcmVudE5hbWUodXJsOiBzdHJpbmcpOiBoby5wcm9taXNlLlByb21pc2U8c3RyaW5nLCBhbnk+IHtcblx0XHRcdGxldCBzZWxmID0gdGhpcztcblxuXHRcdFx0cmV0dXJuXHR4aHIuZ2V0KHVybClcblx0XHRcdFx0LnRoZW4oc3JjID0+IHtcblx0XHRcdFx0XHRyZXR1cm4gc2VsZi5wYXJzZVBhcmVudEZyb21Tb3VyY2Uoc3JjKTtcblx0XHRcdFx0fSlcblx0XHR9XG5cblx0XHRwcm90ZWN0ZWQgcGFyc2VQYXJlbnRGcm9tU291cmNlKHNyYzogc3RyaW5nKTogc3RyaW5nIHtcblx0XHRcdGxldCByX3N1cGVyID0gL31cXClcXCgoLiopXFwpOy87XG5cdFx0XHRsZXQgbWF0Y2ggPSBzcmMubWF0Y2gocl9zdXBlcik7XG5cdFx0XHRpZihtYXRjaClcblx0XHRcdFx0cmV0dXJuIG1hdGNoWzFdO1xuXHRcdFx0ZWxzZVxuXHRcdFx0XHRyZXR1cm4gdW5kZWZpbmVkO1xuXHRcdH1cblxuXHRcdHB1YmxpYyByZXNvbHZlVXJsKG5hbWU6IHN0cmluZyk6IHN0cmluZyB7XG5cdFx0XHRpZighIW1hcHBpbmdbbmFtZV0pXG4gICAgICAgICAgICAgICAgcmV0dXJuIG1hcHBpbmdbbmFtZV07XG5cblx0XHRcdGlmKHRoaXMuY29uZi51c2VEaXIpIHtcbiAgICAgICAgICAgICAgICBuYW1lICs9ICcuJyArIG5hbWUuc3BsaXQoJy4nKS5wb3AoKTtcbiAgICAgICAgICAgIH1cblxuXHRcdFx0bmFtZSA9IG5hbWUuc3BsaXQoJy4nKS5qb2luKCcvJyk7XG5cblx0XHRcdGlmKHRoaXMuY29uZi51c2VNaW4pXG4gICAgICAgICAgICAgICAgbmFtZSArPSAnLm1pbidcblxuXHRcdFx0cmV0dXJuIHRoaXMuY29uZi51cmxUZW1wbGF0ZS5yZXBsYWNlKCcke25hbWV9JywgbmFtZSk7XG5cdFx0fVxuXG5cdFx0cHJvdGVjdGVkIGV4aXN0cyhuYW1lOiBzdHJpbmcpOiBib29sZWFuIHtcblx0XHRcdHJldHVybiAhIXRoaXMuY2FjaGVbbmFtZV07XG5cdFx0fVxuXHR9XG59XG4iLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vLi4vLi4vYm93ZXJfY29tcG9uZW50cy9oby1wcm9taXNlL2Rpc3QvcHJvbWlzZS5kLnRzXCIvPlxuXG5tb2R1bGUgaG8uY2xhc3Nsb2FkZXIge1xuXG5cdGxldCBsb2FkZXIgPSBuZXcgQ2xhc3NMb2FkZXIoKTtcblxuXHRleHBvcnQgZnVuY3Rpb24gY29uZmlnKGM6IElMb2FkZXJDb25maWcpOiB2b2lkIHtcblx0XHRsb2FkZXIuY29uZmlnKGMpO1xuXHR9O1xuXG5cdGV4cG9ydCBmdW5jdGlvbiBsb2FkKGFyZzogSUxvYWRBcmd1bWVudHMpOiBQcm9taXNlT2ZDbGFzc2VzIHtcblx0XHRyZXR1cm4gbG9hZGVyLmxvYWQoYXJnKTtcblx0fTtcblxuXG59XG4iLCJpbnRlcmZhY2UgV2luZG93IHtcblx0d2Via2l0UmVxdWVzdEFuaW1hdGlvbkZyYW1lOiAoY2FsbGJhY2s6IEZyYW1lUmVxdWVzdENhbGxiYWNrKSA9PiBudW1iZXI7XG5cdG1velJlcXVlc3RBbmltYXRpb25GcmFtZTogKGNhbGxiYWNrOiBGcmFtZVJlcXVlc3RDYWxsYmFjaykgPT4gbnVtYmVyO1xuXHRvUmVxdWVzdEFuaW1hdGlvbkZyYW1lOiAoY2FsbGJhY2s6IEZyYW1lUmVxdWVzdENhbGxiYWNrKSA9PiBudW1iZXI7XG59XG5cbm1vZHVsZSBoby53YXRjaCB7XG5cblx0ZXhwb3J0IHR5cGUgSGFuZGxlciA9IChvYmo6YW55LCBuYW1lOnN0cmluZywgb2xkVjphbnksIG5ld1Y6YW55LCAgdGltZXN0YW1wPzogbnVtYmVyKT0+YW55O1xuXG5cdGV4cG9ydCBmdW5jdGlvbiB3YXRjaChvYmo6IGFueSwgbmFtZTogc3RyaW5nLCBoYW5kbGVyOiBIYW5kbGVyKTogdm9pZCB7XG5cdFx0bmV3IFdhdGNoZXIob2JqLCBuYW1lLCBoYW5kbGVyKTtcblx0fVxuXG5cdGNsYXNzIFdhdGNoZXIge1xuXG5cdFx0cHJpdmF0ZSBvbGRWYWw6YW55O1xuXG5cdFx0Y29uc3RydWN0b3IocHJpdmF0ZSBvYmo6IGFueSwgcHJpdmF0ZSBuYW1lOiBzdHJpbmcsIHByaXZhdGUgaGFuZGxlcjogSGFuZGxlcikge1xuXHRcdFx0dGhpcy5vbGRWYWwgPSB0aGlzLmNvcHkob2JqW25hbWVdKTtcblxuXHRcdFx0dGhpcy53YXRjaCh0aW1lc3RhbXAgPT4ge1xuXHRcdFx0XHRpZih0aGlzLm9sZFZhbCAhPT0gb2JqW25hbWVdKSB7XG5cdFx0XHRcdFx0dGhpcy5oYW5kbGVyLmNhbGwobnVsbCwgb2JqLCBuYW1lLCB0aGlzLm9sZFZhbCwgb2JqW25hbWVdLCB0aW1lc3RhbXApO1xuXHRcdFx0XHRcdHRoaXMub2xkVmFsID0gdGhpcy5jb3B5KG9ialtuYW1lXSk7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdH1cblxuXHRcdHByaXZhdGUgd2F0Y2goY2I6ICh0aW1lU3RhbXA6bnVtYmVyKT0+YW55KTogdm9pZCB7XG5cdFx0XHRsZXQgZm46IEZ1bmN0aW9uID1cblx0XHRcdHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUgICAgICAgfHxcblx0ICBcdFx0d2luZG93LndlYmtpdFJlcXVlc3RBbmltYXRpb25GcmFtZSB8fFxuXHQgIFx0XHR3aW5kb3cubW96UmVxdWVzdEFuaW1hdGlvbkZyYW1lICAgIHx8XG5cdCAgXHRcdHdpbmRvdy5vUmVxdWVzdEFuaW1hdGlvbkZyYW1lICAgICAgfHxcblx0ICBcdFx0d2luZG93Lm1zUmVxdWVzdEFuaW1hdGlvbkZyYW1lICAgICB8fFxuXHQgIFx0XHRmdW5jdGlvbihjYWxsYmFjazogRnVuY3Rpb24pe1xuXHRcdFx0XHR3aW5kb3cuc2V0VGltZW91dChjYWxsYmFjaywgMTAwMCAvIDYwKTtcblx0ICBcdFx0fTtcblxuXHRcdFx0bGV0IHdyYXAgPSAodHM6IG51bWJlcikgPT4ge1xuXHRcdFx0XHRjYih0cyk7XG5cdFx0XHRcdGZuKHdyYXApO1xuXHRcdFx0fVxuXG5cdFx0XHRmbih3cmFwKTtcblx0XHR9XG5cblx0XHRwcml2YXRlIGNvcHkodmFsOiBhbnkpOiBhbnkge1xuXHRcdFx0cmV0dXJuIEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkodmFsKSk7XG5cdFx0fVxuXHR9XG5cbn1cbiIsIm1vZHVsZSBoby5jb21wb25lbnRzLnRlbXAge1xuXHRcdHZhciBjOiBudW1iZXIgPSAtMTtcblx0XHR2YXIgZGF0YTogYW55W10gPSBbXTtcblxuXHRcdGV4cG9ydCBmdW5jdGlvbiBzZXQoZDogYW55KTogbnVtYmVyIHtcblx0XHRcdGMrKztcblx0XHRcdGRhdGFbY10gPSBkO1xuXHRcdFx0cmV0dXJuIGM7XG5cdFx0fVxuXG5cdFx0ZXhwb3J0IGZ1bmN0aW9uIGdldChpOiBudW1iZXIpOiBhbnkge1xuXHRcdFx0cmV0dXJuIGRhdGFbaV07XG5cdFx0fVxuXG5cdFx0ZXhwb3J0IGZ1bmN0aW9uIGNhbGwoaTogbnVtYmVyLCAuLi5hcmdzKTogdm9pZCB7XG5cdFx0XHRkYXRhW2ldKC4uLmFyZ3MpO1xuXHRcdH1cbn1cbiIsIm1vZHVsZSBoby5jb21wb25lbnRzLnN0eWxlciB7XG5cblx0ZXhwb3J0IGludGVyZmFjZSBJU3R5bGVyIHtcblx0XHRhcHBseVN0eWxlKGNvbXBvbmVudDogQ29tcG9uZW50LCBjc3M/OiBzdHJpbmcpOiB2b2lkXG5cdH1cblxuXHRpbnRlcmZhY2UgU3R5bGVCbG9jayB7XG5cdFx0c2VsZWN0b3I6IHN0cmluZztcblx0XHRydWxlczogQXJyYXk8U3R5bGVSdWxlPjtcblx0fVxuXG5cdGludGVyZmFjZSBTdHlsZVJ1bGUge1xuXHRcdHByb3BlcnR5OiBzdHJpbmc7XG5cdFx0dmFsdWU6IHN0cmluZztcblx0fVxuXG5cdGNsYXNzIFN0eWxlciBpbXBsZW1lbnRzIElTdHlsZXIge1xuXHRcdHB1YmxpYyBhcHBseVN0eWxlKGNvbXBvbmVudDogQ29tcG9uZW50LCBjc3MgPSBjb21wb25lbnQuc3R5bGUpOiB2b2lkIHtcblx0XHRcdGxldCBzdHlsZSA9IHRoaXMucGFyc2VTdHlsZShjb21wb25lbnQuc3R5bGUpO1xuXHRcdFx0c3R5bGUuZm9yRWFjaChzID0+IHtcblx0XHRcdFx0dGhpcy5hcHBseVN0eWxlQmxvY2soY29tcG9uZW50LCBzKTtcblx0XHRcdH0pO1xuXHRcdH1cblxuXHRcdHByb3RlY3RlZCBhcHBseVN0eWxlQmxvY2soY29tcG9uZW50OiBDb21wb25lbnQsIHN0eWxlOiBTdHlsZUJsb2NrKTogdm9pZCB7XG5cdFx0XHRpZihzdHlsZS5zZWxlY3Rvci50cmltKCkudG9Mb3dlckNhc2UoKSA9PT0gJ3RoaXMnKSB7XG5cdFx0XHRcdHN0eWxlLnJ1bGVzLmZvckVhY2gociA9PiB7XG5cdFx0XHRcdFx0dGhpcy5hcHBseVJ1bGUoY29tcG9uZW50LmVsZW1lbnQsIHIpO1xuXHRcdFx0XHR9KTtcblx0XHRcdH1cblx0XHRcdGVsc2Uge1xuXHRcdFx0XHRBcnJheS5wcm90b3R5cGUuZm9yRWFjaC5jYWxsKGNvbXBvbmVudC5lbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoc3R5bGUuc2VsZWN0b3IpLCBlbCA9PiB7XG5cdFx0XHRcdFx0c3R5bGUucnVsZXMuZm9yRWFjaChyID0+IHtcblx0XHRcdFx0XHRcdHRoaXMuYXBwbHlSdWxlKGVsLCByKTtcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0cHJvdGVjdGVkIGFwcGx5UnVsZShlbGVtZW50OiBIVE1MRWxlbWVudCwgcnVsZTogU3R5bGVSdWxlKTogdm9pZCB7XG5cdFx0XHRsZXQgcHJvcCA9IHJ1bGUucHJvcGVydHkucmVwbGFjZSgvLShcXHcpL2csIChfLCBsZXR0ZXI6IHN0cmluZykgPT4ge1xuXHRcdFx0XHRyZXR1cm4gbGV0dGVyLnRvVXBwZXJDYXNlKCk7XG5cdFx0XHR9KS50cmltKCk7XG5cdFx0XHRlbGVtZW50LnN0eWxlW3Byb3BdID0gcnVsZS52YWx1ZTtcblx0XHR9XG5cblx0XHRwcm90ZWN0ZWQgcGFyc2VTdHlsZShjc3M6IHN0cmluZyk6IEFycmF5PFN0eWxlQmxvY2s+IHtcblx0XHRcdGxldCByID0gLyguKz8pXFxzKnsoLio/KX0vZ207XG5cdFx0XHRsZXQgcjIgPSAvKC4rPylcXHM/OiguKz8pOy9nbTtcblx0XHRcdGNzcyA9IGNzcy5yZXBsYWNlKC9cXG4vZywgJycpO1xuXHRcdFx0bGV0IGJsb2NrczogU3R5bGVCbG9ja1tdID0gKDxzdHJpbmdbXT5jc3MubWF0Y2gocikgfHwgW10pXG5cdFx0XHRcdC5tYXAoYiA9PiB7XG5cdFx0XHRcdFx0aWYoIWIubWF0Y2gocikpXG5cdFx0XHRcdFx0XHRyZXR1cm4gbnVsbDtcblxuXHRcdFx0XHRcdGxldCBbXywgc2VsZWN0b3IsIF9ydWxlc10gPSByLmV4ZWMoYik7XG5cdFx0XHRcdFx0bGV0IHJ1bGVzOiBTdHlsZVJ1bGVbXSA9ICg8c3RyaW5nW10+X3J1bGVzLm1hdGNoKHIyKSB8fCBbXSlcblx0XHRcdFx0XHRcdC5tYXAociA9PiB7XG5cdFx0XHRcdFx0XHRcdGlmKCFyLm1hdGNoKHIyKSlcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gbnVsbDtcblxuXHRcdFx0XHRcdFx0XHRsZXQgW18sIHByb3BlcnR5LCB2YWx1ZV0gPSByMi5leGVjKHIpO1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4ge3Byb3BlcnR5LCB2YWx1ZX07XG5cdFx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdFx0LmZpbHRlcihyID0+IHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIHIgIT09IG51bGw7XG5cdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRyZXR1cm4ge3NlbGVjdG9yLCBydWxlc307XG5cdFx0XHRcdH0pXG5cdFx0XHRcdC5maWx0ZXIoYiA9PiB7XG5cdFx0XHRcdFx0cmV0dXJuIGIgIT09IG51bGw7XG5cdFx0XHRcdH0pO1xuXG5cblx0XHRcdHJldHVybiBibG9ja3M7XG5cdFx0fVxuXHR9XG5cblx0ZXhwb3J0IGxldCBpbnN0YW5jZTogSVN0eWxlciA9IG5ldyBTdHlsZXIoKTtcbn1cbiIsIm1vZHVsZSBoby5jb21wb25lbnRzLnJlbmRlcmVyIHtcblxuICAgIGludGVyZmFjZSBOb2RlSHRtbCB7XG4gICAgICAgIHJvb3Q6IE5vZGU7XG4gICAgICAgIGh0bWw6IHN0cmluZztcbiAgICB9XG5cbiAgICBjbGFzcyBOb2RlIHtcbiAgICAgICAgaHRtbDogc3RyaW5nO1xuICAgICAgICBwYXJlbnQ6IE5vZGU7XG4gICAgICAgIGNoaWxkcmVuOiBBcnJheTxOb2RlPiA9IFtdO1xuICAgICAgICB0eXBlOiBzdHJpbmc7XG4gICAgICAgIHNlbGZDbG9zaW5nOiBib29sZWFuO1xuICAgICAgICBpc1ZvaWQ6IGJvb2xlYW47XG4gICAgICAgIHJlcGVhdDogYm9vbGVhbjtcbiAgICB9XG5cbiAgICBleHBvcnQgY2xhc3MgUmVuZGVyZXIge1xuXG4gICAgICAgIHByaXZhdGUgcjogYW55ID0ge1xuXHRcdFx0dGFnOiAvPChbXj5dKj8oPzooPzooJ3xcIilbXidcIl0qP1xcMilbXj5dKj8pKik+Lyxcblx0XHRcdHJlcGVhdDogL3JlcGVhdD1bXCJ8J10uK1tcInwnXS8sXG5cdFx0XHR0eXBlOiAvW1xcc3wvXSooLio/KVtcXHN8XFwvfD5dLyxcblx0XHRcdHRleHQ6IC8oPzoufFtcXHJcXG5dKSo/W15cIidcXFxcXTwvbSxcblx0XHR9O1xuXG4gICAgICAgIHByaXZhdGUgdm9pZHMgPSBbXCJhcmVhXCIsIFwiYmFzZVwiLCBcImJyXCIsIFwiY29sXCIsIFwiY29tbWFuZFwiLCBcImVtYmVkXCIsIFwiaHJcIiwgXCJpbWdcIiwgXCJpbnB1dFwiLCBcImtleWdlblwiLCBcImxpbmtcIiwgXCJtZXRhXCIsIFwicGFyYW1cIiwgXCJzb3VyY2VcIiwgXCJ0cmFja1wiLCBcIndiclwiXTtcblxuICAgICAgICBwcml2YXRlIGNhY2hlOiB7W2tleTpzdHJpbmddOk5vZGV9ID0ge307XG5cbiAgICAgICAgcHVibGljIHJlbmRlcihjb21wb25lbnQ6IENvbXBvbmVudCk6IHZvaWQge1xuICAgICAgICAgICAgaWYodHlwZW9mIGNvbXBvbmVudC5odG1sID09PSAnYm9vbGVhbicgJiYgIWNvbXBvbmVudC5odG1sKVxuICAgICAgICAgICAgICAgIHJldHVybjtcblxuICAgICAgICAgICAgbGV0IG5hbWUgPSBjb21wb25lbnQubmFtZTtcbiAgICAgICAgICAgIGxldCByb290ID0gdGhpcy5jYWNoZVtuYW1lXSA9IHRoaXMuY2FjaGVbbmFtZV0gfHwgdGhpcy5wYXJzZShjb21wb25lbnQuaHRtbCkucm9vdDtcbiAgICAgICAgICAgIHJvb3QgPSB0aGlzLnJlbmRlclJlcGVhdCh0aGlzLmNvcHlOb2RlKHJvb3QpLCBjb21wb25lbnQpO1xuXG4gICAgICAgICAgICBsZXQgaHRtbCA9IHRoaXMuZG9tVG9TdHJpbmcocm9vdCwgLTEpO1xuXG4gICAgICAgICAgICBjb21wb25lbnQuZWxlbWVudC5pbm5lckhUTUwgPSBodG1sO1xuXG4gICAgICAgIH1cblxuXG5cdFx0cHJpdmF0ZSBwYXJzZShodG1sOiBzdHJpbmcsIHJvb3Q9IG5ldyBOb2RlKCkpOiBOb2RlSHRtbCB7XG5cblx0XHRcdHZhciBtO1xuXHRcdFx0d2hpbGUoKG0gPSB0aGlzLnIudGFnLmV4ZWMoaHRtbCkpICE9PSBudWxsKSB7XG5cdFx0XHRcdHZhciB0YWcsIHR5cGUsIGNsb3NpbmcsIGlzVm9pZCwgc2VsZkNsb3NpbmcsIHJlcGVhdCwgdW5DbG9zZTtcblx0XHRcdFx0Ly8tLS0tLS0tIGZvdW5kIHNvbWUgdGV4dCBiZWZvcmUgbmV4dCB0YWdcblx0XHRcdFx0aWYobS5pbmRleCAhPT0gMCkge1xuXHRcdFx0XHRcdHRhZyA9IGh0bWwubWF0Y2godGhpcy5yLnRleHQpWzBdO1xuXHRcdFx0XHRcdHRhZyA9IHRhZy5zdWJzdHIoMCwgdGFnLmxlbmd0aC0xKTtcblx0XHRcdFx0XHR0eXBlID0gJ1RFWFQnO1xuICAgICAgICAgICAgICAgICAgICBpc1ZvaWQgPSBmYWxzZTtcblx0XHRcdFx0XHRzZWxmQ2xvc2luZyA9IHRydWU7XG5cdFx0XHRcdFx0cmVwZWF0ID0gZmFsc2U7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0dGFnID0gbVsxXS50cmltKCk7XG5cdFx0XHRcdFx0dHlwZSA9ICh0YWcrJz4nKS5tYXRjaCh0aGlzLnIudHlwZSlbMV07XG5cdFx0XHRcdFx0Y2xvc2luZyA9IHRhZ1swXSA9PT0gJy8nO1xuICAgICAgICAgICAgICAgICAgICBpc1ZvaWQgPSB0aGlzLmlzVm9pZCh0eXBlKTtcblx0XHRcdFx0XHRzZWxmQ2xvc2luZyA9IGlzVm9pZCB8fCB0YWdbdGFnLmxlbmd0aC0xXSA9PT0gJy8nO1xuXHRcdFx0XHRcdHJlcGVhdCA9ICEhdGFnLm1hdGNoKHRoaXMuci5yZXBlYXQpO1xuXG5cdFx0XHRcdFx0aWYoc2VsZkNsb3NpbmcgJiYgaG8uY29tcG9uZW50cy5yZWdpc3RyeS5pbnN0YW5jZS5oYXNDb21wb25lbnQodHlwZSkpIHtcblx0XHRcdFx0XHRcdHNlbGZDbG9zaW5nID0gZmFsc2U7XG5cdFx0XHRcdFx0XHR0YWcgPSB0YWcuc3Vic3RyKDAsIHRhZy5sZW5ndGgtMSkgKyBcIiBcIjtcblxuXHRcdFx0XHRcdFx0dW5DbG9zZSA9IHRydWU7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cblx0XHRcdFx0aHRtbCA9IGh0bWwuc2xpY2UodGFnLmxlbmd0aCArICh0eXBlID09PSAnVEVYVCcgPyAwIDogMikgKTtcblxuXHRcdFx0XHRpZihjbG9zaW5nKSB7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0cm9vdC5jaGlsZHJlbi5wdXNoKHtwYXJlbnQ6IHJvb3QsIGh0bWw6IHRhZywgdHlwZTogdHlwZSwgaXNWb2lkOiBpc1ZvaWQsIHNlbGZDbG9zaW5nOiBzZWxmQ2xvc2luZywgcmVwZWF0OiByZXBlYXQsIGNoaWxkcmVuOiBbXX0pO1xuXG5cdFx0XHRcdFx0aWYoIXVuQ2xvc2UgJiYgIXNlbGZDbG9zaW5nKSB7XG5cdFx0XHRcdFx0XHR2YXIgcmVzdWx0ID0gdGhpcy5wYXJzZShodG1sLCByb290LmNoaWxkcmVuW3Jvb3QuY2hpbGRyZW4ubGVuZ3RoLTFdKTtcblx0XHRcdFx0XHRcdGh0bWwgPSByZXN1bHQuaHRtbDtcblx0XHRcdFx0XHRcdHJvb3QuY2hpbGRyZW4ucG9wKCk7XG5cdFx0XHRcdFx0XHRyb290LmNoaWxkcmVuLnB1c2gocmVzdWx0LnJvb3QpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXG5cdFx0XHRcdG0gPSBodG1sLm1hdGNoKHRoaXMuci50YWcpO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4ge3Jvb3Q6IHJvb3QsIGh0bWw6IGh0bWx9O1xuXHRcdH1cblxuXHRcdHByaXZhdGUgcmVuZGVyUmVwZWF0KHJvb3QsIG1vZGVscyk6IE5vZGUge1xuXHRcdFx0bW9kZWxzID0gW10uY29uY2F0KG1vZGVscyk7XG5cblx0XHRcdGZvcih2YXIgYyA9IDA7IGMgPCByb290LmNoaWxkcmVuLmxlbmd0aDsgYysrKSB7XG5cdFx0XHRcdHZhciBjaGlsZCA9IHJvb3QuY2hpbGRyZW5bY107XG5cdFx0XHRcdGlmKGNoaWxkLnJlcGVhdCkge1xuXHRcdFx0XHRcdHZhciByZWdleCA9IC9yZXBlYXQ9W1wifCddXFxzKihcXFMrKVxccythc1xccysoXFxTKz8pW1wifCddLztcblx0XHRcdFx0XHR2YXIgbSA9IGNoaWxkLmh0bWwubWF0Y2gocmVnZXgpLnNsaWNlKDEpO1xuXHRcdFx0XHRcdHZhciBuYW1lID0gbVsxXTtcblx0XHRcdFx0XHR2YXIgaW5kZXhOYW1lO1xuXHRcdFx0XHRcdGlmKG5hbWUuaW5kZXhPZignLCcpID4gLTEpIHtcblx0XHRcdFx0XHRcdHZhciBuYW1lcyA9IG5hbWUuc3BsaXQoJywnKTtcblx0XHRcdFx0XHRcdG5hbWUgPSBuYW1lc1swXS50cmltKCk7XG5cdFx0XHRcdFx0XHRpbmRleE5hbWUgPSBuYW1lc1sxXS50cmltKCk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0dmFyIG1vZGVsID0gdGhpcy5ldmFsdWF0ZShtb2RlbHMsIG1bMF0pO1xuXG5cdFx0XHRcdFx0dmFyIGhvbGRlciA9IFtdO1xuXHRcdFx0XHRcdG1vZGVsLmZvckVhY2goZnVuY3Rpb24odmFsdWUsIGluZGV4KSB7XG5cdFx0XHRcdFx0XHR2YXIgbW9kZWwyID0ge307XG5cdFx0XHRcdFx0XHRtb2RlbDJbbmFtZV0gPSB2YWx1ZTtcblx0XHRcdFx0XHRcdG1vZGVsMltpbmRleE5hbWVdID0gaW5kZXg7XG5cblx0XHRcdFx0XHRcdHZhciBtb2RlbHMyID0gW10uY29uY2F0KG1vZGVscyk7XG5cdFx0XHRcdFx0XHRtb2RlbHMyLnVuc2hpZnQobW9kZWwyKTtcblxuXHRcdFx0XHRcdFx0dmFyIG5vZGUgPSB0aGlzLmNvcHlOb2RlKGNoaWxkKTtcblx0XHRcdFx0XHRcdG5vZGUucmVwZWF0ID0gZmFsc2U7XG5cdFx0XHRcdFx0XHRub2RlLmh0bWwgPSBub2RlLmh0bWwucmVwbGFjZSh0aGlzLnIucmVwZWF0LCAnJyk7XG5cdFx0XHRcdFx0XHRub2RlLmh0bWwgPSB0aGlzLnJlcGwobm9kZS5odG1sLCBtb2RlbHMyKTtcblxuXHRcdFx0XHRcdFx0bm9kZSA9IHRoaXMucmVuZGVyUmVwZWF0KG5vZGUsIG1vZGVsczIpO1xuXG5cdFx0XHRcdFx0XHQvL3Jvb3QuY2hpbGRyZW4uc3BsaWNlKHJvb3QuY2hpbGRyZW4uaW5kZXhPZihjaGlsZCksIDAsIG5vZGUpO1xuXHRcdFx0XHRcdFx0aG9sZGVyLnB1c2gobm9kZSk7XG5cdFx0XHRcdFx0fS5iaW5kKHRoaXMpKTtcblxuXHRcdFx0XHRcdGhvbGRlci5mb3JFYWNoKGZ1bmN0aW9uKG4pIHtcblx0XHRcdFx0XHRcdHJvb3QuY2hpbGRyZW4uc3BsaWNlKHJvb3QuY2hpbGRyZW4uaW5kZXhPZihjaGlsZCksIDAsIG4pO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdHJvb3QuY2hpbGRyZW4uc3BsaWNlKHJvb3QuY2hpbGRyZW4uaW5kZXhPZihjaGlsZCksIDEpO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdGNoaWxkLmh0bWwgPSB0aGlzLnJlcGwoY2hpbGQuaHRtbCwgbW9kZWxzKTtcblx0XHRcdFx0XHRjaGlsZCA9IHRoaXMucmVuZGVyUmVwZWF0KGNoaWxkLCBtb2RlbHMpO1xuXHRcdFx0XHRcdHJvb3QuY2hpbGRyZW5bY10gPSBjaGlsZDtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gcm9vdDtcblx0XHR9XG5cblx0XHRwcml2YXRlIGRvbVRvU3RyaW5nKHJvb3Q6IE5vZGUsIGluZGVudDogbnVtYmVyKTogc3RyaW5nIHtcblx0XHRcdGluZGVudCA9IGluZGVudCB8fCAwO1xuXHRcdFx0dmFyIGh0bWwgPSAnJztcbiAgICAgICAgICAgIGNvbnN0IHRhYjogYW55ID0gJ1xcdCc7XG5cblx0XHRcdGlmKHJvb3QuaHRtbCkge1xuXHRcdFx0XHRodG1sICs9IG5ldyBBcnJheShpbmRlbnQpLmpvaW4odGFiKTsgLy90YWIucmVwZWF0KGluZGVudCk7O1xuXHRcdFx0XHRpZihyb290LnR5cGUgIT09ICdURVhUJykge1xuXHRcdFx0XHRcdGlmKHJvb3Quc2VsZkNsb3NpbmcgJiYgIXJvb3QuaXNWb2lkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBodG1sICs9ICc8JyArIHJvb3QuaHRtbC5zdWJzdHIoMCwgLS1yb290Lmh0bWwubGVuZ3RoKSArICc+JztcbiAgICAgICAgICAgICAgICAgICAgICAgIGh0bWwgKz0gJzwvJytyb290LnR5cGUrJz5cXG4nO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgICAgIGh0bWwgKz0gJzwnICsgcm9vdC5odG1sICsgJz4nO1xuICAgICAgICAgICAgICAgIH1cblx0XHRcdFx0ZWxzZSBodG1sICs9IHJvb3QuaHRtbDtcblx0XHRcdH1cblxuXHRcdFx0aWYoaHRtbClcblx0XHRcdFx0aHRtbCArPSAnXFxuJztcblxuXHRcdFx0aWYocm9vdC5jaGlsZHJlbi5sZW5ndGgpIHtcblx0XHRcdFx0aHRtbCArPSByb290LmNoaWxkcmVuLm1hcChmdW5jdGlvbihjKSB7XG5cdFx0XHRcdFx0cmV0dXJuIHRoaXMuZG9tVG9TdHJpbmcoYywgaW5kZW50Kyhyb290LnR5cGUgPyAxIDogMikpO1xuXHRcdFx0XHR9LmJpbmQodGhpcykpLmpvaW4oJ1xcbicpO1xuXHRcdFx0fVxuXG5cdFx0XHRpZihyb290LnR5cGUgJiYgcm9vdC50eXBlICE9PSAnVEVYVCcgJiYgIXJvb3Quc2VsZkNsb3NpbmcpIHtcblx0XHRcdFx0aHRtbCArPSBuZXcgQXJyYXkoaW5kZW50KS5qb2luKHRhYik7IC8vdGFiLnJlcGVhdChpbmRlbnQpO1xuXHRcdFx0XHRodG1sICs9ICc8Lycrcm9vdC50eXBlKyc+XFxuJztcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIGh0bWw7XG5cdFx0fVxuXG4gICAgICAgIHByaXZhdGUgcmVwbChzdHI6IHN0cmluZywgbW9kZWxzOiBhbnlbXSk6IHN0cmluZyB7XG4gICAgICAgICAgICB2YXIgcmVnZXhHID0gL3soLis/KX19Py9nO1xuXG4gICAgICAgICAgICB2YXIgbSA9IHN0ci5tYXRjaChyZWdleEcpO1xuICAgICAgICAgICAgaWYoIW0pXG4gICAgICAgICAgICAgICAgcmV0dXJuIHN0cjtcblxuICAgICAgICAgICAgd2hpbGUobS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICB2YXIgcGF0aCA9IG1bMF07XG4gICAgICAgICAgICAgICAgcGF0aCA9IHBhdGguc3Vic3RyKDEsIHBhdGgubGVuZ3RoLTIpO1xuXG4gICAgICAgICAgICAgICAgdmFyIHZhbHVlID0gdGhpcy5ldmFsdWF0ZShtb2RlbHMsIHBhdGgpO1xuXG4gICAgICAgICAgICAgICAgaWYodmFsdWUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICBpZih0eXBlb2YgdmFsdWUgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlID0gXCJoby5jb21wb25lbnRzLkNvbXBvbmVudC5nZXRDb21wb25lbnQodGhpcykuXCIrcGF0aDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBzdHIgPSBzdHIucmVwbGFjZShtWzBdLCB2YWx1ZSk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgbSA9IG0uc2xpY2UoMSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBzdHI7XG4gICAgICAgIH1cblxuICAgICAgICBwcml2YXRlIGV2YWx1YXRlKG1vZGVsczogYW55W10sIHBhdGg6IHN0cmluZyk6IGFueSB7XG4gICAgICAgICAgICBpZihwYXRoWzBdID09PSAneycgJiYgcGF0aFstLXBhdGgubGVuZ3RoXSA9PT0gJ30nKVxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmV2YWx1YXRlRXhwcmVzc2lvbihtb2RlbHMsIHBhdGguc3Vic3RyKDEsIHBhdGgubGVuZ3RoLTIpKVxuICAgICAgICAgICAgZWxzZSBpZihwYXRoWzBdID09PSAnIycpXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuZXZhbHVhdGVGdW5jdGlvbihtb2RlbHMsIHBhdGguc3Vic3RyKDEpKTtcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5ldmFsdWF0ZVZhbHVlKG1vZGVscywgcGF0aCk7XG4gICAgICAgIH1cblxuICAgICAgICBwcml2YXRlIGV2YWx1YXRlVmFsdWUobW9kZWxzOiBhbnlbXSwgcGF0aDogc3RyaW5nKTogYW55IHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmV2YWx1YXRlVmFsdWVBbmRNb2RlbChtb2RlbHMsIHBhdGgpLnZhbHVlO1xuICAgICAgICB9XG5cblx0XHRwcml2YXRlIGV2YWx1YXRlVmFsdWVBbmRNb2RlbChtb2RlbHM6IGFueVtdLCBwYXRoOiBzdHJpbmcpOiB7dmFsdWU6IGFueSwgbW9kZWw6IGFueX0ge1xuXHRcdFx0aWYobW9kZWxzLmluZGV4T2Yod2luZG93KSA9PSAtMSlcbiAgICAgICAgICAgICAgICBtb2RlbHMucHVzaCh3aW5kb3cpO1xuXG4gICAgICAgICAgICB2YXIgbWkgPSAwO1xuXHRcdFx0dmFyIG1vZGVsID0gdm9pZCAwO1xuXHRcdFx0d2hpbGUobWkgPCBtb2RlbHMubGVuZ3RoICYmIG1vZGVsID09PSB1bmRlZmluZWQpIHtcblx0XHRcdFx0bW9kZWwgPSBtb2RlbHNbbWldO1xuXHRcdFx0XHR0cnkge1xuXHRcdFx0XHRcdG1vZGVsID0gbmV3IEZ1bmN0aW9uKFwibW9kZWxcIiwgXCJyZXR1cm4gbW9kZWxbJ1wiICsgcGF0aC5zcGxpdChcIi5cIikuam9pbihcIiddWydcIikgKyBcIiddXCIpKG1vZGVsKTtcblx0XHRcdFx0fSBjYXRjaChlKSB7XG5cdFx0XHRcdFx0bW9kZWwgPSB2b2lkIDA7XG5cdFx0XHRcdH0gZmluYWxseSB7XG4gICAgICAgICAgICAgICAgICAgIG1pKys7XG4gICAgICAgICAgICAgICAgfVxuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4ge1widmFsdWVcIjogbW9kZWwsIFwibW9kZWxcIjogbW9kZWxzWy0tbWldfTtcblx0XHR9XG5cbiAgICAgICAgcHJpdmF0ZSBldmFsdWF0ZUV4cHJlc3Npb24obW9kZWxzOiBhbnlbXSwgcGF0aDogc3RyaW5nKTogYW55IHtcblx0XHRcdGlmKG1vZGVscy5pbmRleE9mKHdpbmRvdykgPT0gLTEpXG4gICAgICAgICAgICAgICAgbW9kZWxzLnB1c2god2luZG93KTtcblxuICAgICAgICAgICAgdmFyIG1pID0gMDtcblx0XHRcdHZhciBtb2RlbCA9IHZvaWQgMDtcblx0XHRcdHdoaWxlKG1pIDwgbW9kZWxzLmxlbmd0aCAmJiBtb2RlbCA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRcdG1vZGVsID0gbW9kZWxzW21pXTtcblx0XHRcdFx0dHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgLy93aXRoKG1vZGVsKSBtb2RlbCA9IGV2YWwocGF0aCk7XG4gICAgICAgICAgICAgICAgICAgIG1vZGVsID0gbmV3IEZ1bmN0aW9uKE9iamVjdC5rZXlzKG1vZGVsKS50b1N0cmluZygpLCBcInJldHVybiBcIiArIHBhdGgpXG4gICAgICAgICAgICAgICAgICAgICAgICAuYXBwbHkobnVsbCwgT2JqZWN0LmtleXMobW9kZWwpLm1hcCgoaykgPT4ge3JldHVybiBtb2RlbFtrXX0pICk7XG5cdFx0XHRcdH0gY2F0Y2goZSkge1xuXHRcdFx0XHRcdG1vZGVsID0gdm9pZCAwO1xuXHRcdFx0XHR9IGZpbmFsbHkge1xuICAgICAgICAgICAgICAgICAgICBtaSsrO1xuICAgICAgICAgICAgICAgIH1cblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIG1vZGVsO1xuXHRcdH1cblxuICAgICAgICBwcml2YXRlIGV2YWx1YXRlRnVuY3Rpb24obW9kZWxzOiBhbnlbXSwgcGF0aDogc3RyaW5nKTogYW55IHtcbiAgICAgICAgICAgIGxldCBleHAgPSB0aGlzLmV2YWx1YXRlRXhwcmVzc2lvbi5iaW5kKHRoaXMsIG1vZGVscyk7XG5cdFx0XHR2YXIgW25hbWUsIGFyZ3NdID0gcGF0aC5zcGxpdCgnKCcpO1xuICAgICAgICAgICAgYXJncyA9IGFyZ3Muc3Vic3RyKDAsIC0tYXJncy5sZW5ndGgpO1xuXG4gICAgICAgICAgICBsZXQge3ZhbHVlLCBtb2RlbH0gPSB0aGlzLmV2YWx1YXRlVmFsdWVBbmRNb2RlbChtb2RlbHMsIG5hbWUpO1xuICAgICAgICAgICAgbGV0IGZ1bmM6IEZ1bmN0aW9uID0gdmFsdWU7XG4gICAgICAgICAgICBsZXQgYXJnQXJyOiBzdHJpbmdbXSA9IGFyZ3Muc3BsaXQoJy4nKS5tYXAoKGFyZykgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiBhcmcuaW5kZXhPZignIycpID09PSAwID9cbiAgICAgICAgICAgICAgICAgICAgYXJnLnN1YnN0cigxKSA6XG4gICAgICAgICAgICAgICAgICAgIGV4cChhcmcpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGZ1bmMgPSBmdW5jLmJpbmQobW9kZWwsIC4uLmFyZ0Fycik7XG5cbiAgICAgICAgICAgIGxldCBpbmRleCA9IGhvLmNvbXBvbmVudHMudGVtcC5zZXQoZnVuYyk7XG5cbiAgICAgICAgICAgIHZhciBzdHIgPSBgaG8uY29tcG9uZW50cy50ZW1wLmNhbGwoJHtpbmRleH0pYDtcbiAgICAgICAgICAgIHJldHVybiBzdHI7XG5cdFx0fVxuXG5cdFx0cHJpdmF0ZSBjb3B5Tm9kZShub2RlOiBOb2RlKTogTm9kZSB7XG5cdFx0XHR2YXIgY29weU5vZGUgPSB0aGlzLmNvcHlOb2RlLmJpbmQodGhpcyk7XG5cbiAgICAgICAgICAgIHZhciBuID0gPE5vZGU+e1xuXHRcdFx0XHRwYXJlbnQ6IG5vZGUucGFyZW50LFxuXHRcdFx0XHRodG1sOiBub2RlLmh0bWwsXG5cdFx0XHRcdHR5cGU6IG5vZGUudHlwZSxcblx0XHRcdFx0c2VsZkNsb3Npbmc6IG5vZGUuc2VsZkNsb3NpbmcsXG5cdFx0XHRcdHJlcGVhdDogbm9kZS5yZXBlYXQsXG5cdFx0XHRcdGNoaWxkcmVuOiBub2RlLmNoaWxkcmVuLm1hcChjb3B5Tm9kZSlcblx0XHRcdH07XG5cblx0XHRcdHJldHVybiBuO1xuXHRcdH1cblxuICAgICAgICBwcml2YXRlIGlzVm9pZChuYW1lOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnZvaWRzLmluZGV4T2YobmFtZS50b0xvd2VyQ2FzZSgpKSAhPT0gLTE7XG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIGV4cG9ydCBsZXQgaW5zdGFuY2UgPSBuZXcgUmVuZGVyZXIoKTtcblxufVxuIiwibW9kdWxlIGhvLmNvbXBvbmVudHMuaHRtbHByb3ZpZGVyIHtcbiAgICBpbXBvcnQgUHJvbWlzZSA9IGhvLnByb21pc2UuUHJvbWlzZTtcblxuICAgIGV4cG9ydCBjbGFzcyBIdG1sUHJvdmlkZXIge1xuXG4gICAgICAgIHByaXZhdGUgY2FjaGU6IHtba2F5OnN0cmluZ106c3RyaW5nfSA9IHt9O1xuXG4gICAgICAgIHJlc29sdmUobmFtZTogc3RyaW5nKTogc3RyaW5nIHtcbiAgICAgICAgICAgIGlmKGhvLmNvbXBvbmVudHMucmVnaXN0cnkudXNlRGlyKSB7XG4gICAgICAgICAgICAgICAgbmFtZSArPSAnLicgKyBuYW1lLnNwbGl0KCcuJykucG9wKCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIG5hbWUgPSBuYW1lLnNwbGl0KCcuJykuam9pbignLycpO1xuXG4gICAgICAgICAgICByZXR1cm4gYGNvbXBvbmVudHMvJHtuYW1lfS5odG1sYDtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldEhUTUwobmFtZTogc3RyaW5nKTogUHJvbWlzZTxzdHJpbmcsIHN0cmluZz4ge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcblxuICAgICAgICAgICAgICAgIGlmKHR5cGVvZiB0aGlzLmNhY2hlW25hbWVdID09PSAnc3RyaW5nJylcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlc29sdmUodGhpcy5jYWNoZVtuYW1lXSk7XG5cbiAgICAgICAgICAgICAgICBsZXQgdXJsID0gdGhpcy5yZXNvbHZlKG5hbWUpO1xuXG4gICAgICAgICAgICAgICAgbGV0IHhtbGh0dHAgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICBcdFx0XHR4bWxodHRwLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uKCkge1xuICAgIFx0XHRcdFx0aWYoeG1saHR0cC5yZWFkeVN0YXRlID09IDQpIHtcbiAgICBcdFx0XHRcdFx0bGV0IHJlc3AgPSB4bWxodHRwLnJlc3BvbnNlVGV4dDtcbiAgICBcdFx0XHRcdFx0aWYoeG1saHR0cC5zdGF0dXMgPT0gMjAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShyZXNwKTtcbiAgICBcdFx0XHRcdFx0fSBlbHNlIHtcbiAgICBcdFx0XHRcdFx0XHRyZWplY3QoYEVycm9yIHdoaWxlIGxvYWRpbmcgaHRtbCBmb3IgQ29tcG9uZW50ICR7bmFtZX1gKTtcbiAgICBcdFx0XHRcdFx0fVxuICAgIFx0XHRcdFx0fVxuICAgIFx0XHRcdH07XG5cbiAgICBcdFx0XHR4bWxodHRwLm9wZW4oJ0dFVCcsIHVybCwgdHJ1ZSk7XG4gICAgXHRcdFx0eG1saHR0cC5zZW5kKCk7XG5cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZXhwb3J0IGxldCBpbnN0YW5jZSA9IG5ldyBIdG1sUHJvdmlkZXIoKTtcblxufVxuIiwibW9kdWxlIGhvLmNvbXBvbmVudHMge1xuXG5cdGltcG9ydCBQcm9taXNlID0gaG8ucHJvbWlzZS5Qcm9taXNlO1xuXG5cdC8qKlxuXHRcdEJhc2VjbGFzcyBmb3IgQXR0cmlidXRlcy5cblx0XHRVc2VkIEF0dHJpYnV0ZXMgbmVlZHMgdG8gYmUgc3BlY2lmaWVkIGJ5IENvbXBvbmVudCNhdHRyaWJ1dGVzIHByb3BlcnR5IHRvIGdldCBsb2FkZWQgcHJvcGVybHkuXG5cdCovXG5cdGV4cG9ydCBjbGFzcyBBdHRyaWJ1dGUge1xuXG5cdFx0cHJvdGVjdGVkIGVsZW1lbnQ6IEhUTUxFbGVtZW50O1xuXHRcdHByb3RlY3RlZCBjb21wb25lbnQ6IENvbXBvbmVudDtcblx0XHRwcm90ZWN0ZWQgdmFsdWU6IHN0cmluZztcblxuXHRcdGNvbnN0cnVjdG9yKGVsZW1lbnQ6IEhUTUxFbGVtZW50LCB2YWx1ZT86IHN0cmluZykge1xuXHRcdFx0dGhpcy5lbGVtZW50ID0gZWxlbWVudDtcblx0XHRcdHRoaXMuY29tcG9uZW50ID0gQ29tcG9uZW50LmdldENvbXBvbmVudChlbGVtZW50KTtcblx0XHRcdHRoaXMudmFsdWUgPSB2YWx1ZTtcblxuXHRcdFx0dGhpcy5pbml0KCk7XG5cdFx0fVxuXG5cdFx0cHJvdGVjdGVkIGluaXQoKTogdm9pZCB7fVxuXG5cdFx0Z2V0IG5hbWUoKSB7XG5cdFx0XHRyZXR1cm4gQXR0cmlidXRlLmdldE5hbWUodGhpcyk7XG5cdFx0fVxuXG5cblx0XHRwdWJsaWMgdXBkYXRlKCk6IHZvaWQge1xuXG5cdFx0fVxuXG5cblx0XHRzdGF0aWMgZ2V0TmFtZShjbGF6ejogdHlwZW9mIEF0dHJpYnV0ZSB8IEF0dHJpYnV0ZSk6IHN0cmluZyB7XG4gICAgICAgICAgICBpZihjbGF6eiBpbnN0YW5jZW9mIEF0dHJpYnV0ZSlcbiAgICAgICAgICAgICAgICByZXR1cm4gY2xhenouY29uc3RydWN0b3IudG9TdHJpbmcoKS5tYXRjaCgvXFx3Ky9nKVsxXTtcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICByZXR1cm4gY2xhenoudG9TdHJpbmcoKS5tYXRjaCgvXFx3Ky9nKVsxXTtcbiAgICAgICAgfVxuXHR9XG5cblx0ZXhwb3J0IGNsYXNzIFdhdGNoQXR0cmlidXRlIGV4dGVuZHMgQXR0cmlidXRlIHtcblxuXHRcdHByb3RlY3RlZCByOiBSZWdFeHAgPSAvIyguKz8pIy9nO1xuXG5cdFx0Y29uc3RydWN0b3IoZWxlbWVudDogSFRNTEVsZW1lbnQsIHZhbHVlPzogc3RyaW5nKSB7XG5cdFx0XHRzdXBlcihlbGVtZW50LCB2YWx1ZSk7XG5cblx0XHRcdGxldCBtOiBhbnlbXSA9IHRoaXMudmFsdWUubWF0Y2godGhpcy5yKSB8fCBbXTtcblx0XHRcdG0ubWFwKGZ1bmN0aW9uKHcpIHtcblx0XHRcdFx0dyA9IHcuc3Vic3RyKDEsIHcubGVuZ3RoLTIpO1xuXHRcdFx0XHR0aGlzLndhdGNoKHcpO1xuXHRcdFx0fS5iaW5kKHRoaXMpKTtcblx0XHRcdHRoaXMudmFsdWUgPSB0aGlzLnZhbHVlLnJlcGxhY2UoLyMvZywgJycpO1xuXHRcdH1cblxuXG5cdFx0cHJvdGVjdGVkIHdhdGNoKHBhdGg6IHN0cmluZyk6IHZvaWQge1xuXHRcdFx0bGV0IHBhdGhBcnIgPSBwYXRoLnNwbGl0KCcuJyk7XG5cdFx0XHRsZXQgcHJvcCA9IHBhdGhBcnIucG9wKCk7XG5cdFx0XHRsZXQgb2JqID0gdGhpcy5jb21wb25lbnQ7XG5cblx0XHRcdHBhdGhBcnIubWFwKChwYXJ0KSA9PiB7XG5cdFx0XHRcdG9iaiA9IG9ialtwYXJ0XTtcblx0XHRcdH0pO1xuXG5cdFx0XHRoby53YXRjaC53YXRjaChvYmosIHByb3AsIHRoaXMudXBkYXRlLmJpbmQodGhpcykpO1xuXHRcdH1cblxuXHRcdHByb3RlY3RlZCBldmFsKHBhdGg6IHN0cmluZyk6IGFueSB7XG5cdFx0XHRsZXQgbW9kZWwgPSB0aGlzLmNvbXBvbmVudDtcblx0XHRcdG1vZGVsID0gbmV3IEZ1bmN0aW9uKE9iamVjdC5rZXlzKG1vZGVsKS50b1N0cmluZygpLCBcInJldHVybiBcIiArIHBhdGgpXG5cdFx0XHRcdC5hcHBseShudWxsLCBPYmplY3Qua2V5cyhtb2RlbCkubWFwKChrKSA9PiB7cmV0dXJuIG1vZGVsW2tdfSkgKTtcblx0XHRcdHJldHVybiBtb2RlbDtcblx0XHR9XG5cblx0fVxufVxuIiwibW9kdWxlIGhvLmNvbXBvbmVudHMge1xuXG4gICAgaW1wb3J0IFByb21pc2UgPSBoby5wcm9taXNlLlByb21pc2U7XG4gICAgaW1wb3J0IEh0bWxQcm92aWRlciA9IGhvLmNvbXBvbmVudHMuaHRtbHByb3ZpZGVyLmluc3RhbmNlO1xuICAgIGltcG9ydCBSZW5kZXJlciA9IGhvLmNvbXBvbmVudHMucmVuZGVyZXIuaW5zdGFuY2U7XG5cbiAgICBleHBvcnQgaW50ZXJmYWNlIENvbXBvbmVudEVsZW1lbnQgZXh0ZW5kcyBIVE1MRWxlbWVudCB7XG4gICAgICAgIGNvbXBvbmVudD86IENvbXBvbmVudDtcbiAgICB9XG5cbiAgICBleHBvcnQgaW50ZXJmYWNlIElQcm9wcmV0eSB7XG4gICAgICAgIG5hbWU6IHN0cmluZztcbiAgICAgICAgcmVxdWlyZWQ/OiBib29sZWFuO1xuICAgICAgICBkZWZhdWx0PzogYW55O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAgICBCYXNlY2xhc3MgZm9yIENvbXBvbmVudHNcbiAgICAgICAgaW1wb3J0YW50OiBkbyBpbml0aWFsaXphdGlvbiB3b3JrIGluIENvbXBvbmVudCNpbml0XG4gICAgKi9cbiAgICBleHBvcnQgY2xhc3MgQ29tcG9uZW50IHtcbiAgICAgICAgcHVibGljIGVsZW1lbnQ6IENvbXBvbmVudEVsZW1lbnQ7XG4gICAgICAgIHB1YmxpYyBvcmlnaW5hbF9pbm5lckhUTUw6IHN0cmluZztcbiAgICAgICAgcHVibGljIGh0bWw6IHN0cmluZyA9ICcnO1xuICAgICAgICBwdWJsaWMgc3R5bGU6IHN0cmluZyA9ICcnO1xuICAgICAgICBwdWJsaWMgcHJvcGVydGllczogQXJyYXk8c3RyaW5nfElQcm9wcmV0eT4gPSBbXTtcbiAgICAgICAgcHVibGljIGF0dHJpYnV0ZXM6IEFycmF5PHN0cmluZz4gPSBbXTtcbiAgICAgICAgcHVibGljIHJlcXVpcmVzOiBBcnJheTxzdHJpbmc+ID0gW107XG4gICAgICAgIHB1YmxpYyBjaGlsZHJlbjoge1trZXk6IHN0cmluZ106IGFueX0gPSB7fTtcblxuICAgICAgICBjb25zdHJ1Y3RvcihlbGVtZW50OiBIVE1MRWxlbWVudCkge1xuICAgICAgICAgICAgLy8tLS0tLS0tIGluaXQgRWxlbWVuZXQgYW5kIEVsZW1lbnRzJyBvcmlnaW5hbCBpbm5lckhUTUxcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudCA9IGVsZW1lbnQ7XG4gICAgICAgICAgICB0aGlzLmVsZW1lbnQuY29tcG9uZW50ID0gdGhpcztcbiAgICAgICAgICAgIHRoaXMub3JpZ2luYWxfaW5uZXJIVE1MID0gZWxlbWVudC5pbm5lckhUTUw7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgZ2V0IG5hbWUoKTogc3RyaW5nIHtcbiAgICAgICAgICAgIHJldHVybiBDb21wb25lbnQuZ2V0TmFtZSh0aGlzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBnZXROYW1lKCk6IHN0cmluZyB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5uYW1lO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIGdldFBhcmVudCgpOiBDb21wb25lbnQge1xuICAgICAgICAgICAgcmV0dXJuIENvbXBvbmVudC5nZXRDb21wb25lbnQoPENvbXBvbmVudEVsZW1lbnQ+dGhpcy5lbGVtZW50LnBhcmVudE5vZGUpO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIF9pbml0KCk6IFByb21pc2U8YW55LCBhbnk+IHtcbiAgICAgICAgICAgIGxldCByZW5kZXIgPSB0aGlzLnJlbmRlci5iaW5kKHRoaXMpO1xuICAgICAgICAgICAgLy8tLS0tLS0tLSBpbml0IFByb3BlcnRpZXNcbiAgICAgICAgICAgIHRoaXMuaW5pdFByb3BlcnRpZXMoKTtcblxuICAgICAgICAgICAgLy8tLS0tLS0tIGNhbGwgaW5pdCgpICYgbG9hZFJlcXVpcmVtZW50cygpIC0+IHRoZW4gcmVuZGVyXG4gICAgICAgICAgICBsZXQgcmVhZHkgPSBbdGhpcy5pbml0SFRNTCgpLCBQcm9taXNlLmNyZWF0ZSh0aGlzLmluaXQoKSksIHRoaXMubG9hZFJlcXVpcmVtZW50cygpXTtcblxuICAgICAgICAgICAgbGV0IHAgPSBuZXcgUHJvbWlzZTxhbnksIGFueT4oKTtcblxuICAgICAgICAgICAgUHJvbWlzZS5hbGwocmVhZHkpXG4gICAgICAgICAgICAudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgcC5yZXNvbHZlKCk7XG4gICAgICAgICAgICAgICAgcmVuZGVyKCk7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmNhdGNoKChlcnIpID0+IHtcbiAgICAgICAgICAgICAgICBwLnJlamVjdChlcnIpO1xuICAgICAgICAgICAgICAgIHRocm93IGVycjtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICByZXR1cm4gcDtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgICAgTWV0aG9kIHRoYXQgZ2V0IGNhbGxlZCBhZnRlciBpbml0aWFsaXphdGlvbiBvZiBhIG5ldyBpbnN0YW5jZS5cbiAgICAgICAgICAgIERvIGluaXQtd29yayBoZXJlLlxuICAgICAgICAgICAgTWF5IHJldHVybiBhIFByb21pc2UuXG4gICAgICAgICovXG4gICAgICAgIHB1YmxpYyBpbml0KCk6IGFueSB7fVxuXG4gICAgICAgIHB1YmxpYyB1cGRhdGUoKTogdm9pZCB7cmV0dXJuIHZvaWQgMDt9XG5cbiAgICAgICAgcHVibGljIHJlbmRlcigpOiB2b2lkIHtcbiAgICBcdFx0UmVuZGVyZXIucmVuZGVyKHRoaXMpO1xuXG4gICAgXHRcdGhvLmNvbXBvbmVudHMucmVnaXN0cnkuaW5zdGFuY2UuaW5pdEVsZW1lbnQodGhpcy5lbGVtZW50KVxuICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgICAgICAgICB0aGlzLmluaXRDaGlsZHJlbigpO1xuXG4gICAgICAgICAgICAgICAgdGhpcy5pbml0U3R5bGUoKTtcblxuICAgICAgICAgICAgICAgIHRoaXMuaW5pdEF0dHJpYnV0ZXMoKTtcblxuICAgIFx0XHRcdHRoaXMudXBkYXRlKCk7XG5cbiAgICAgICAgICAgIH0uYmluZCh0aGlzKSk7XG4gICAgXHR9O1xuXG4gICAgICAgIHByaXZhdGUgaW5pdFN0eWxlKCk6IHZvaWQge1xuICAgICAgICAgICAgaWYodHlwZW9mIHRoaXMuc3R5bGUgPT09ICd1bmRlZmluZWQnKVxuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIGlmKHRoaXMuc3R5bGUgPT09IG51bGwpXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgaWYodHlwZW9mIHRoaXMuc3R5bGUgPT09ICdzdHJpbmcnICYmIHRoaXMuc3R5bGUubGVuZ3RoID09PSAwKVxuICAgICAgICAgICAgICAgIHJldHVybjtcblxuICAgICAgICAgICAgc3R5bGVyLmluc3RhbmNlLmFwcGx5U3R5bGUodGhpcyk7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgKiAgQXNzdXJlIHRoYXQgdGhpcyBpbnN0YW5jZSBoYXMgYW4gdmFsaWQgaHRtbCBhdHRyaWJ1dGUgYW5kIGlmIG5vdCBsb2FkIGFuZCBzZXQgaXQuXG4gICAgICAgICovXG4gICAgICAgIHByaXZhdGUgaW5pdEhUTUwoKTogUHJvbWlzZTxhbnksYW55PiB7XG4gICAgICAgICAgICBsZXQgcCA9IG5ldyBQcm9taXNlKCk7XG4gICAgICAgICAgICBsZXQgc2VsZiA9IHRoaXM7XG5cbiAgICAgICAgICAgIGlmKHR5cGVvZiB0aGlzLmh0bWwgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5odG1sID0gJyc7XG4gICAgICAgICAgICAgICAgcC5yZXNvbHZlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZih0aGlzLmh0bWwuaW5kZXhPZihcIi5odG1sXCIsIHRoaXMuaHRtbC5sZW5ndGggLSBcIi5odG1sXCIubGVuZ3RoKSAhPT0gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgSHRtbFByb3ZpZGVyLmdldEhUTUwodGhpcy5uYW1lKVxuICAgICAgICAgICAgICAgICAgICAudGhlbigoaHRtbCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5odG1sID0gaHRtbDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHAucmVzb2x2ZSgpO1xuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAuY2F0Y2gocC5yZWplY3QpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHAucmVzb2x2ZSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHA7XG4gICAgICAgIH1cblxuICAgICAgICBwcml2YXRlIGluaXRQcm9wZXJ0aWVzKCk6IHZvaWQge1xuICAgICAgICAgICAgdGhpcy5wcm9wZXJ0aWVzLmZvckVhY2goZnVuY3Rpb24ocHJvcCkge1xuICAgICAgICAgICAgICAgIGlmKHR5cGVvZiBwcm9wID09PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnByb3BlcnRpZXNbcHJvcC5uYW1lXSA9IHRoaXMuZWxlbWVudFtwcm9wLm5hbWVdIHx8IHRoaXMuZWxlbWVudC5nZXRBdHRyaWJ1dGUocHJvcC5uYW1lKSB8fCBwcm9wLmRlZmF1bHQ7XG4gICAgICAgICAgICAgICAgICAgIGlmKHRoaXMucHJvcGVydGllc1twcm9wLm5hbWVdID09PSB1bmRlZmluZWQgJiYgcHJvcC5yZXF1aXJlZCA9PT0gdHJ1ZSlcbiAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IGBQcm9wZXJ0eSAke3Byb3AubmFtZX0gaXMgcmVxdWlyZWQgYnV0IG5vdCBwcm92aWRlZGA7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2UgaWYodHlwZW9mIHByb3AgPT09ICdzdHJpbmcnKVxuICAgICAgICAgICAgICAgICAgICB0aGlzLnByb3BlcnRpZXNbcHJvcF0gPSB0aGlzLmVsZW1lbnRbcHJvcF0gfHwgdGhpcy5lbGVtZW50LmdldEF0dHJpYnV0ZShwcm9wKTtcbiAgICAgICAgICAgIH0uYmluZCh0aGlzKSk7XG4gICAgICAgIH1cblxuICAgICAgICBwcml2YXRlIGluaXRDaGlsZHJlbigpOiB2b2lkIHtcbiAgICAgICAgICAgIGxldCBjaGlsZHMgPSB0aGlzLmVsZW1lbnQucXVlcnlTZWxlY3RvckFsbCgnKicpO1xuICAgIFx0XHRmb3IobGV0IGMgPSAwOyBjIDwgY2hpbGRzLmxlbmd0aDsgYysrKSB7XG4gICAgXHRcdFx0bGV0IGNoaWxkOiBFbGVtZW50ID0gPEVsZW1lbnQ+Y2hpbGRzW2NdO1xuICAgIFx0XHRcdGlmKGNoaWxkLmlkKSB7XG4gICAgXHRcdFx0XHR0aGlzLmNoaWxkcmVuW2NoaWxkLmlkXSA9IGNoaWxkO1xuICAgIFx0XHRcdH1cbiAgICBcdFx0XHRpZihjaGlsZC50YWdOYW1lKVxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNoaWxkcmVuW2NoaWxkLnRhZ05hbWVdID0gdGhpcy5jaGlsZHJlbltjaGlsZC50YWdOYW1lXSB8fCBbXTtcbiAgICAgICAgICAgICAgICAoPEVsZW1lbnRbXT50aGlzLmNoaWxkcmVuW2NoaWxkLnRhZ05hbWVdKS5wdXNoKGNoaWxkKTtcbiAgICBcdFx0fVxuICAgICAgICB9XG5cbiAgICAgICAgcHJpdmF0ZSBpbml0QXR0cmlidXRlcygpOiB2b2lkIHtcbiAgICAgICAgICAgIHRoaXMuYXR0cmlidXRlc1xuICAgICAgICAgICAgLmZvckVhY2goKGEpID0+IHtcbiAgICAgICAgICAgICAgICBsZXQgYXR0ciA9IGhvLmNvbXBvbmVudHMucmVnaXN0cnkuaW5zdGFuY2UuZ2V0QXR0cmlidXRlKGEpO1xuICAgICAgICAgICAgICAgIEFycmF5LnByb3RvdHlwZS5mb3JFYWNoLmNhbGwodGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoYCpbJHthfV1gKSwgKGU6IEhUTUxFbGVtZW50KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGxldCB2YWwgPSBlLmhhc093blByb3BlcnR5KGEpID8gZVthXSA6IGUuZ2V0QXR0cmlidXRlKGEpO1xuICAgICAgICAgICAgICAgICAgICBpZih0eXBlb2YgdmFsID09PSAnc3RyaW5nJyAmJiB2YWwgPT09ICcnKVxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsID0gdm9pZCAwO1xuICAgICAgICAgICAgICAgICAgICBuZXcgYXR0cihlLCB2YWwpLnVwZGF0ZSgpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBwcml2YXRlIGxvYWRSZXF1aXJlbWVudHMoKSB7XG4gICAgXHRcdGxldCBjb21wb25lbnRzOiBhbnlbXSA9IHRoaXMucmVxdWlyZXNcbiAgICAgICAgICAgIC5maWx0ZXIoKHJlcSkgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiAhaG8uY29tcG9uZW50cy5yZWdpc3RyeS5pbnN0YW5jZS5oYXNDb21wb25lbnQocmVxKTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAubWFwKChyZXEpID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gaG8uY29tcG9uZW50cy5yZWdpc3RyeS5pbnN0YW5jZS5sb2FkQ29tcG9uZW50KHJlcSk7XG4gICAgICAgICAgICB9KTtcblxuXG4gICAgICAgICAgICBsZXQgYXR0cmlidXRlczogYW55W10gPSB0aGlzLmF0dHJpYnV0ZXNcbiAgICAgICAgICAgIC5maWx0ZXIoKHJlcSkgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiAhaG8uY29tcG9uZW50cy5yZWdpc3RyeS5pbnN0YW5jZS5oYXNBdHRyaWJ1dGUocmVxKTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAubWFwKChyZXEpID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gaG8uY29tcG9uZW50cy5yZWdpc3RyeS5pbnN0YW5jZS5sb2FkQXR0cmlidXRlKHJlcSk7XG4gICAgICAgICAgICB9KTtcblxuXG4gICAgICAgICAgICBsZXQgcHJvbWlzZXMgPSBjb21wb25lbnRzLmNvbmNhdChhdHRyaWJ1dGVzKTtcblxuICAgICAgICAgICAgcmV0dXJuIFByb21pc2UuYWxsKHByb21pc2VzKTtcbiAgICBcdH07XG5cbiAgICAgICAgLypcbiAgICAgICAgc3RhdGljIHJlZ2lzdGVyKGM6IHR5cGVvZiBDb21wb25lbnQpOiB2b2lkIHtcbiAgICAgICAgICAgIGhvLmNvbXBvbmVudHMucmVnaXN0cnkuaW5zdGFuY2UucmVnaXN0ZXIoYyk7XG4gICAgICAgIH1cbiAgICAgICAgKi9cblxuICAgICAgICAvKlxuICAgICAgICBzdGF0aWMgcnVuKG9wdD86IGFueSkge1xuICAgICAgICAgICAgaG8uY29tcG9uZW50cy5yZWdpc3RyeS5pbnN0YW5jZS5zZXRPcHRpb25zKG9wdCk7XG4gICAgICAgICAgICBoby5jb21wb25lbnRzLnJlZ2lzdHJ5Lmluc3RhbmNlLnJ1bigpO1xuICAgICAgICB9XG4gICAgICAgICovXG5cbiAgICAgICAgc3RhdGljIGdldENvbXBvbmVudChlbGVtZW50OiBDb21wb25lbnRFbGVtZW50KTogQ29tcG9uZW50IHtcbiAgICAgICAgICAgIHdoaWxlKCFlbGVtZW50LmNvbXBvbmVudClcbiAgICBcdFx0XHRlbGVtZW50ID0gPENvbXBvbmVudEVsZW1lbnQ+ZWxlbWVudC5wYXJlbnROb2RlO1xuICAgIFx0XHRyZXR1cm4gZWxlbWVudC5jb21wb25lbnQ7XG4gICAgICAgIH1cblxuICAgICAgICBzdGF0aWMgZ2V0TmFtZShjbGF6ejogdHlwZW9mIENvbXBvbmVudCk6IHN0cmluZztcbiAgICAgICAgc3RhdGljIGdldE5hbWUoY2xheno6IENvbXBvbmVudCk6IHN0cmluZztcbiAgICAgICAgc3RhdGljIGdldE5hbWUoY2xheno6ICh0eXBlb2YgQ29tcG9uZW50KSB8IChDb21wb25lbnQpKTogc3RyaW5nIHtcbiAgICAgICAgICAgIGlmKGNsYXp6IGluc3RhbmNlb2YgQ29tcG9uZW50KVxuICAgICAgICAgICAgICAgIHJldHVybiBjbGF6ei5jb25zdHJ1Y3Rvci50b1N0cmluZygpLm1hdGNoKC9cXHcrL2cpWzFdO1xuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIHJldHVybiBjbGF6ei50b1N0cmluZygpLm1hdGNoKC9cXHcrL2cpWzFdO1xuICAgICAgICB9XG5cblxuICAgIH1cbn1cbiIsIm1vZHVsZSBoby5jb21wb25lbnRzLnJlZ2lzdHJ5IHtcbiAgICBpbXBvcnQgUHJvbWlzZSA9IGhvLnByb21pc2UuUHJvbWlzZTtcblxuICAgIGV4cG9ydCBsZXQgbWFwcGluZzoge1trZXk6c3RyaW5nXTpzdHJpbmd9ID0ge307XG4gICAgZXhwb3J0IGxldCB1c2VEaXIgPSB0cnVlO1xuXG4gICAgZXhwb3J0IGNsYXNzIFJlZ2lzdHJ5IHtcblxuICAgICAgICBwcml2YXRlIGNvbXBvbmVudHM6IEFycmF5PHR5cGVvZiBDb21wb25lbnQ+ID0gW107XG4gICAgICAgIHByaXZhdGUgYXR0cmlidXRlczogQXJyYXk8dHlwZW9mIEF0dHJpYnV0ZT4gPSBbXTtcblxuICAgICAgICBwcml2YXRlIGNvbXBvbmVudExvYWRlciA9IG5ldyBoby5jbGFzc2xvYWRlci5DbGFzc0xvYWRlcih7XG4gICAgICAgICAgICB1cmxUZW1wbGF0ZTogJ2NvbXBvbmVudHMvJHtuYW1lfS5qcycsXG4gICAgICAgICAgICB1c2VEaXJcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcHJpdmF0ZSBhdHRyaWJ1dGVMb2FkZXIgPSBuZXcgaG8uY2xhc3Nsb2FkZXIuQ2xhc3NMb2FkZXIoe1xuICAgICAgICAgICAgdXJsVGVtcGxhdGU6ICdhdHRyaWJ1dGVzLyR7bmFtZX0uanMnLFxuICAgICAgICAgICAgdXNlRGlyXG4gICAgICAgIH0pO1xuXG5cblxuICAgICAgICBwdWJsaWMgcmVnaXN0ZXIoY2E6IHR5cGVvZiBDb21wb25lbnQgfCB0eXBlb2YgQXR0cmlidXRlKTogdm9pZCB7XG4gICAgICAgICAgICBpZihjYS5wcm90b3R5cGUgaW5zdGFuY2VvZiBDb21wb25lbnQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmNvbXBvbmVudHMucHVzaCg8dHlwZW9mIENvbXBvbmVudD5jYSk7XG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuY3JlYXRlRWxlbWVudChDb21wb25lbnQuZ2V0TmFtZSg8dHlwZW9mIENvbXBvbmVudD5jYSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZihjYS5wcm90b3R5cGUgaW5zdGFuY2VvZiBBdHRyaWJ1dGUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmF0dHJpYnV0ZXMucHVzaCg8dHlwZW9mIEF0dHJpYnV0ZT5jYSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgcnVuKCk6IFByb21pc2U8YW55LCBhbnk+IHtcbiAgICAgICAgICAgIGxldCBpbml0Q29tcG9uZW50OiAoYzogdHlwZW9mIENvbXBvbmVudCk9PlByb21pc2U8YW55LCBhbnk+ID0gdGhpcy5pbml0Q29tcG9uZW50LmJpbmQodGhpcyk7XG4gICAgICAgICAgICBsZXQgcHJvbWlzZXM6IEFycmF5PFByb21pc2U8YW55LCBhbnk+PiA9IHRoaXMuY29tcG9uZW50cy5tYXAoKGMpPT57XG4gICAgICAgICAgICAgICAgcmV0dXJuIGluaXRDb21wb25lbnQoPGFueT5jKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5hbGwocHJvbWlzZXMpO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIGluaXRDb21wb25lbnQoY29tcG9uZW50OiB0eXBlb2YgQ29tcG9uZW50LCBlbGVtZW50OkhUTUxFbGVtZW50fERvY3VtZW50PWRvY3VtZW50KTogUHJvbWlzZTxhbnksIGFueT4ge1xuICAgICAgICAgICAgbGV0IHByb21pc2VzOiBBcnJheTxQcm9taXNlPGFueSwgYW55Pj4gPSBBcnJheS5wcm90b3R5cGUubWFwLmNhbGwoXG4gICAgICAgICAgICAgICAgZWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKENvbXBvbmVudC5nZXROYW1lKGNvbXBvbmVudCkpLFxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uKGUpOiBQcm9taXNlPGFueSwgYW55PiB7XG5cdCAgICAgICAgICAgICAgICByZXR1cm4gbmV3IGNvbXBvbmVudChlKS5faW5pdCgpO1xuICAgICAgICAgICAgICAgIH1cblx0XHRcdCk7XG5cbiAgICAgICAgICAgIHJldHVybiBQcm9taXNlLmFsbChwcm9taXNlcyk7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgaW5pdEVsZW1lbnQoZWxlbWVudDogSFRNTEVsZW1lbnQpOiBQcm9taXNlPGFueSwgYW55PiB7XG4gICAgICAgICAgICBsZXQgaW5pdENvbXBvbmVudDogKGM6IHR5cGVvZiBDb21wb25lbnQsIGVsZW1lbnQ6IEhUTUxFbGVtZW50KT0+UHJvbWlzZTxhbnksIGFueT4gPSB0aGlzLmluaXRDb21wb25lbnQuYmluZCh0aGlzKTtcbiAgICAgICAgICAgIGxldCBwcm9taXNlczogQXJyYXk8UHJvbWlzZTxhbnksIGFueT4+ID0gQXJyYXkucHJvdG90eXBlLm1hcC5jYWxsKFxuICAgICAgICAgICAgICAgIHRoaXMuY29tcG9uZW50cyxcbiAgICAgICAgICAgICAgICBjb21wb25lbnQgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gaW5pdENvbXBvbmVudChjb21wb25lbnQsIGVsZW1lbnQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgIHJldHVybiBQcm9taXNlLmFsbChwcm9taXNlcyk7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgaGFzQ29tcG9uZW50KG5hbWU6IHN0cmluZyk6IGJvb2xlYW4ge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY29tcG9uZW50c1xuICAgICAgICAgICAgICAgIC5maWx0ZXIoKGNvbXBvbmVudCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gQ29tcG9uZW50LmdldE5hbWUoY29tcG9uZW50KSA9PT0gbmFtZTtcbiAgICAgICAgICAgICAgICB9KS5sZW5ndGggPiAwO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIGhhc0F0dHJpYnV0ZShuYW1lOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmF0dHJpYnV0ZXNcbiAgICAgICAgICAgICAgICAuZmlsdGVyKChhdHRyaWJ1dGUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIEF0dHJpYnV0ZS5nZXROYW1lKGF0dHJpYnV0ZSkgPT09IG5hbWU7XG4gICAgICAgICAgICAgICAgfSkubGVuZ3RoID4gMDtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBnZXRBdHRyaWJ1dGUobmFtZTogc3RyaW5nKTogdHlwZW9mIEF0dHJpYnV0ZSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5hdHRyaWJ1dGVzXG4gICAgICAgICAgICAuZmlsdGVyKChhdHRyaWJ1dGUpID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gQXR0cmlidXRlLmdldE5hbWUoYXR0cmlidXRlKSA9PT0gbmFtZTtcbiAgICAgICAgICAgIH0pWzBdO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIGxvYWRDb21wb25lbnQobmFtZTogc3RyaW5nKTogUHJvbWlzZTx0eXBlb2YgQ29tcG9uZW50LCBzdHJpbmc+IHtcbiAgICAgICAgICAgIGxldCBzZWxmID0gdGhpcztcbiAgICAgICAgICAgIGxldCBzdXAgPSB0aGlzLmNvbXBvbmVudHMubWFwKGMgPT4ge3JldHVybiBDb21wb25lbnQuZ2V0TmFtZShjKX0pLmNvbmNhdChbXCJoby5jb21wb25lbnRzLkNvbXBvbmVudFwiXSlcblxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY29tcG9uZW50TG9hZGVyLmxvYWQoe1xuICAgICAgICAgICAgICAgIG5hbWUsXG4gICAgICAgICAgICAgICAgdXJsOiBtYXBwaW5nW25hbWVdLFxuICAgICAgICAgICAgICAgIHN1cGVyOiBzdXBcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAudGhlbihjbGFzc2VzID0+IHtcbiAgICAgICAgICAgICAgICBjbGFzc2VzLm1hcChjID0+IHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5yZWdpc3Rlcig8dHlwZW9mIENvbXBvbmVudD5jKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICByZXR1cm4gY2xhc3Nlcy5wb3AoKTtcbiAgICAgICAgICAgIH0pXG5cblxuICAgICAgICAgICAgLypcbiAgICAgICAgICAgIGxldCBzZWxmID0gdGhpcztcblxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZ2V0UGFyZW50T2ZDb21wb25lbnQobmFtZSlcbiAgICAgICAgICAgIC50aGVuKChwYXJlbnQpID0+IHtcbiAgICAgICAgICAgICAgICBpZihzZWxmLmhhc0NvbXBvbmVudChwYXJlbnQpIHx8IHBhcmVudCA9PT0gJ2hvLmNvbXBvbmVudHMuQ29tcG9uZW50JylcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgZWxzZSByZXR1cm4gc2VsZi5sb2FkQ29tcG9uZW50KHBhcmVudCk7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLnRoZW4oKHBhcmVudFR5cGUpID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gaG8uY29tcG9uZW50cy5jb21wb25lbnRwcm92aWRlci5pbnN0YW5jZS5nZXRDb21wb25lbnQobmFtZSlcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAudGhlbigoY29tcG9uZW50KSA9PiB7XG4gICAgICAgICAgICAgICAgc2VsZi5yZWdpc3Rlcihjb21wb25lbnQpO1xuICAgICAgICAgICAgICAgIHJldHVybiBjb21wb25lbnQ7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIC8vcmV0dXJuIHRoaXMub3B0aW9ucy5jb21wb25lbnRQcm92aWRlci5nZXRDb21wb25lbnQobmFtZSlcbiAgICAgICAgICAgICovXG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgbG9hZEF0dHJpYnV0ZShuYW1lOiBzdHJpbmcpOiBQcm9taXNlPHR5cGVvZiBBdHRyaWJ1dGUsIHN0cmluZz4ge1xuXG4gICAgICAgICAgICBsZXQgc2VsZiA9IHRoaXM7XG4gICAgICAgICAgICBsZXQgYmFzZSA9IFtcImhvLmNvbXBvbmVudHMuQXR0cmlidXRlXCIsIFwiaG8uY29tcG9uZW50cy5XYXRjaEF0dHJpYnV0ZVwiXTtcbiAgICAgICAgICAgIGxldCBzdXAgPSB0aGlzLmF0dHJpYnV0ZXMubWFwKGEgPT4ge3JldHVybiBBdHRyaWJ1dGUuZ2V0TmFtZShhKX0pLmNvbmNhdChiYXNlKVxuXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5hdHRyaWJ1dGVMb2FkZXIubG9hZCh7XG4gICAgICAgICAgICAgICAgbmFtZSxcbiAgICAgICAgICAgICAgICB1cmw6IG1hcHBpbmdbbmFtZV0sXG4gICAgICAgICAgICAgICAgc3VwZXI6IHN1cFxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC50aGVuKGNsYXNzZXMgPT4ge1xuICAgICAgICAgICAgICAgIGNsYXNzZXMubWFwKGMgPT4ge1xuICAgICAgICAgICAgICAgICAgICBzZWxmLnJlZ2lzdGVyKDx0eXBlb2YgQXR0cmlidXRlPmMpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHJldHVybiBjbGFzc2VzLnBvcCgpO1xuICAgICAgICAgICAgfSlcblxuXG4gICAgICAgICAgICAvKlxuICAgICAgICAgICAgbGV0IHNlbGYgPSB0aGlzO1xuXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5nZXRQYXJlbnRPZkF0dHJpYnV0ZShuYW1lKVxuICAgICAgICAgICAgLnRoZW4oKHBhcmVudCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmKHNlbGYuaGFzQXR0cmlidXRlKHBhcmVudCkgfHwgcGFyZW50ID09PSAnaG8uY29tcG9uZW50cy5BdHRyaWJ1dGUnIHx8IHBhcmVudCA9PT0gJ2hvLmNvbXBvbmVudHMuV2F0Y2hBdHRyaWJ1dGUnKVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICBlbHNlIHJldHVybiBzZWxmLmxvYWRBdHRyaWJ1dGUocGFyZW50KTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAudGhlbigocGFyZW50VHlwZSkgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiBoby5jb21wb25lbnRzLmF0dHJpYnV0ZXByb3ZpZGVyLmluc3RhbmNlLmdldEF0dHJpYnV0ZShuYW1lKVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC50aGVuKChhdHRyaWJ1dGUpID0+IHtcbiAgICAgICAgICAgICAgICBzZWxmLnJlZ2lzdGVyKGF0dHJpYnV0ZSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGF0dHJpYnV0ZTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgKi9cblxuICAgICAgICAgICAgLypcbiAgICAgICAgICAgIGxldCBzZWxmID0gdGhpcztcbiAgICAgICAgICAgIHJldHVybiBuZXcgUHJvbWlzZTx0eXBlb2YgQXR0cmlidXRlLCBzdHJpbmc+KChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgICAgICBoby5jb21wb25lbnRzLmF0dHJpYnV0ZXByb3ZpZGVyLmluc3RhbmNlLmdldEF0dHJpYnV0ZShuYW1lKVxuICAgICAgICAgICAgICAgIC50aGVuKChhdHRyaWJ1dGUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5yZWdpc3RlcihhdHRyaWJ1dGUpO1xuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKGF0dHJpYnV0ZSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICovXG4gICAgICAgIH1cblxuICAgICAgICAvKlxuXG4gICAgICAgIHByb3RlY3RlZCBnZXRQYXJlbnRPZkNvbXBvbmVudChuYW1lOiBzdHJpbmcpOiBQcm9taXNlPHN0cmluZywgYW55PiB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5nZXRQYXJlbnRPZkNsYXNzKGhvLmNvbXBvbmVudHMuY29tcG9uZW50cHJvdmlkZXIuaW5zdGFuY2UucmVzb2x2ZShuYW1lKSk7XG4gICAgICAgIH1cblxuICAgICAgICBwcm90ZWN0ZWQgZ2V0UGFyZW50T2ZBdHRyaWJ1dGUobmFtZTogc3RyaW5nKTogUHJvbWlzZTxzdHJpbmcsIGFueT4ge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZ2V0UGFyZW50T2ZDbGFzcyhoby5jb21wb25lbnRzLmF0dHJpYnV0ZXByb3ZpZGVyLmluc3RhbmNlLnJlc29sdmUobmFtZSkpO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJvdGVjdGVkIGdldFBhcmVudE9mQ2xhc3MocGF0aDogc3RyaW5nKTogUHJvbWlzZTxzdHJpbmcsIGFueT4ge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcblxuICAgICAgICAgICAgICAgIGxldCB4bWxodHRwID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgICAgICAgICAgICAgeG1saHR0cC5vbnJlYWR5c3RhdGVjaGFuZ2UgPSAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmKHhtbGh0dHAucmVhZHlTdGF0ZSA9PSA0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgcmVzcCA9IHhtbGh0dHAucmVzcG9uc2VUZXh0O1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYoeG1saHR0cC5zdGF0dXMgPT0gMjAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IG0gPSByZXNwLm1hdGNoKC99XFwpXFwoKC4qKVxcKTsvKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZihtICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUobVsxXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKG51bGwpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVqZWN0KHJlc3ApO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgeG1saHR0cC5vcGVuKCdHRVQnLCBwYXRoKTtcbiAgICAgICAgICAgICAgICB4bWxodHRwLnNlbmQoKTtcblxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICAqL1xuXG4gICAgfVxuXG4gICAgZXhwb3J0IGxldCBpbnN0YW5jZSA9IG5ldyBSZWdpc3RyeSgpO1xufVxuIiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uLy4uLy4uL2Jvd2VyX2NvbXBvbmVudHMvaG8tcHJvbWlzZS9kaXN0L3Byb21pc2UuZC50c1wiLz5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi8uLi8uLi9ib3dlcl9jb21wb25lbnRzL2hvLWNsYXNzbG9hZGVyL2Rpc3QvY2xhc3Nsb2FkZXIuZC50c1wiLz5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi8uLi8uLi9ib3dlcl9jb21wb25lbnRzL2hvLXdhdGNoL2Rpc3Qvd2F0Y2guZC50c1wiLz5cblxubW9kdWxlIGhvLmNvbXBvbmVudHMge1xuXHRleHBvcnQgZnVuY3Rpb24gcnVuKCk6IGhvLnByb21pc2UuUHJvbWlzZTxhbnksIGFueT4ge1xuXHRcdHJldHVybiBoby5jb21wb25lbnRzLnJlZ2lzdHJ5Lmluc3RhbmNlLnJ1bigpO1xuXHR9XG5cblx0ZXhwb3J0IGZ1bmN0aW9uIHJlZ2lzdGVyKGM6IHR5cGVvZiBDb21wb25lbnQgfCB0eXBlb2YgQXR0cmlidXRlKTogdm9pZCB7XG5cdFx0aG8uY29tcG9uZW50cy5yZWdpc3RyeS5pbnN0YW5jZS5yZWdpc3RlcihjKTtcblx0fVxuXG59XG4iLCJtb2R1bGUgaG8uZmx1eCB7XHJcblxyXG5cdGV4cG9ydCBjbGFzcyBDYWxsYmFja0hvbGRlciB7XHJcblxyXG5cdFx0cHJvdGVjdGVkIHByZWZpeDogc3RyaW5nID0gJ0lEXyc7XHJcbiAgICBcdHByb3RlY3RlZCBsYXN0SUQ6IG51bWJlciA9IDE7XHJcblx0XHRwcm90ZWN0ZWQgY2FsbGJhY2tzOiB7W2tleTpzdHJpbmddOkZ1bmN0aW9ufSA9IHt9O1xyXG5cclxuXHRcdHB1YmxpYyByZWdpc3RlcihjYWxsYmFjazogRnVuY3Rpb24sIHNlbGY/OiBhbnkpOiBzdHJpbmcge1xyXG4gICAgXHRcdGxldCBpZCA9IHRoaXMucHJlZml4ICsgdGhpcy5sYXN0SUQrKztcclxuICAgIFx0XHR0aGlzLmNhbGxiYWNrc1tpZF0gPSBzZWxmID8gY2FsbGJhY2suYmluZChzZWxmKSA6IGNhbGxiYWNrO1xyXG4gICAgXHRcdHJldHVybiBpZDtcclxuICBcdFx0fVxyXG5cclxuICBcdFx0cHVibGljIHVucmVnaXN0ZXIoaWQpIHtcclxuICAgICAgXHRcdGlmKCF0aGlzLmNhbGxiYWNrc1tpZF0pXHJcblx0XHRcdFx0dGhyb3cgJ0NvdWxkIG5vdCB1bnJlZ2lzdGVyIGNhbGxiYWNrIGZvciBpZCAnICsgaWQ7XHJcbiAgICBcdFx0ZGVsZXRlIHRoaXMuY2FsbGJhY2tzW2lkXTtcclxuICBcdFx0fTtcclxuXHR9XHJcbn1cclxuIiwiXHJcbm1vZHVsZSBoby5mbHV4IHtcclxuXHRpbXBvcnQgUHJvbWlzZSA9IGhvLnByb21pc2UuUHJvbWlzZTtcclxuXHJcblxyXG5cdGV4cG9ydCBpbnRlcmZhY2UgSVN0YXRlIHtcclxuXHRcdG5hbWU6IHN0cmluZztcclxuXHRcdHVybDogc3RyaW5nO1xyXG5cdFx0cmVkaXJlY3Q/OiBzdHJpbmc7XHJcblx0XHRiZWZvcmU/OiAoZGF0YTogSVJvdXRlRGF0YSk9PlByb21pc2U8YW55LCBhbnk+O1xyXG5cdFx0dmlldz86IEFycmF5PElWaWV3U3RhdGU+O1xyXG5cdH1cclxuXHJcblx0ZXhwb3J0IGludGVyZmFjZSBJVmlld1N0YXRlIHtcclxuXHQgICAgbmFtZTogc3RyaW5nO1xyXG5cdFx0aHRtbDogc3RyaW5nO1xyXG5cdH1cclxuXHJcblx0ZXhwb3J0IGludGVyZmFjZSBJU3RhdGVzIHtcclxuXHQgICAgc3RhdGVzOiBBcnJheTxJU3RhdGU+O1xyXG5cdH1cclxuXHJcbn1cclxuIiwiXHJcbm1vZHVsZSBoby5mbHV4LnJlZ2lzdHJ5IHtcclxuXHRpbXBvcnQgUHJvbWlzZSA9IGhvLnByb21pc2UuUHJvbWlzZTtcclxuXHJcblx0ZXhwb3J0IGxldCBtYXBwaW5nOiB7W2tleTpzdHJpbmddOnN0cmluZ30gPSB7fTtcclxuXHRleHBvcnQgbGV0IHVzZURpciA9IHRydWU7XHJcblxyXG5cdGV4cG9ydCBjbGFzcyBSZWdpc3RyeSB7XHJcblxyXG5cdFx0cHJpdmF0ZSBzdG9yZXM6IHtba2V5OiBzdHJpbmddOiBTdG9yZTxhbnk+fSA9IHt9O1xyXG5cclxuXHRcdHByaXZhdGUgc3RvcmVMb2FkZXIgPSBuZXcgaG8uY2xhc3Nsb2FkZXIuQ2xhc3NMb2FkZXIoe1xyXG4gICAgICAgICAgIHVybFRlbXBsYXRlOiAnc3RvcmVzLyR7bmFtZX0uanMnLFxyXG4gICAgICAgICAgIHVzZURpclxyXG4gICAgICAgfSk7XHJcblxyXG5cdFx0cHVibGljIHJlZ2lzdGVyKHN0b3JlOiBTdG9yZTxhbnk+KTogU3RvcmU8YW55PiB7XHJcblx0XHRcdHRoaXMuc3RvcmVzW3N0b3JlLm5hbWVdID0gc3RvcmU7XHJcblx0XHRcdHJldHVybiBzdG9yZTtcclxuXHRcdH1cclxuXHJcblx0XHRwdWJsaWMgZ2V0KHN0b3JlQ2xhc3M6IHN0cmluZyk6IFN0b3JlPGFueT5cclxuXHRcdHB1YmxpYyBnZXQ8VCBleHRlbmRzIFN0b3JlPGFueT4+KHN0b3JlQ2xhc3M6IHtuZXcoKTpUfSk6IFRcclxuXHRcdHB1YmxpYyBnZXQ8VCBleHRlbmRzIFN0b3JlPGFueT4+KHN0b3JlQ2xhc3M6IGFueSk6IFQge1xyXG5cdFx0XHRsZXQgbmFtZSA9IHZvaWQgMDtcclxuXHRcdFx0aWYodHlwZW9mIHN0b3JlQ2xhc3MgPT09ICdzdHJpbmcnKVxyXG5cdFx0XHRcdG5hbWUgPSBzdG9yZUNsYXNzO1xyXG5cdFx0XHRlbHNlXHJcblx0XHRcdFx0bmFtZSA9IHN0b3JlQ2xhc3MudG9TdHJpbmcoKS5tYXRjaCgvXFx3Ky9nKVsxXTtcclxuXHRcdFx0cmV0dXJuIDxUPnRoaXMuc3RvcmVzW25hbWVdO1xyXG5cdFx0fVxyXG5cclxuXHRcdHB1YmxpYyBsb2FkU3RvcmUobmFtZTogc3RyaW5nKTogUHJvbWlzZTxTdG9yZTxhbnk+LCBzdHJpbmc+IHtcclxuXHJcblx0XHRcdGxldCBzZWxmID0gdGhpcztcclxuXHJcblx0XHRcdGlmKCEhdGhpcy5zdG9yZXNbbmFtZV0pXHJcblx0XHRcdFx0cmV0dXJuIFByb21pc2UuY3JlYXRlKHRoaXMuc3RvcmVzW25hbWVdKTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnN0b3JlTG9hZGVyLmxvYWQoe1xyXG4gICAgICAgICAgICAgICAgbmFtZSxcclxuXHRcdFx0XHR1cmw6IG1hcHBpbmdbbmFtZV0sXHJcbiAgICAgICAgICAgICAgICBzdXBlcjogW1wiaG8uZmx1eC5TdG9yZVwiXVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAudGhlbigoY2xhc3NlczogQXJyYXk8dHlwZW9mIFN0b3JlPikgPT4ge1xyXG4gICAgICAgICAgICAgICAgY2xhc3Nlcy5tYXAoYyA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5yZWdpc3RlcihuZXcgYykuaW5pdCgpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gc2VsZi5nZXQoY2xhc3Nlcy5wb3AoKSk7XHJcbiAgICAgICAgICAgIH0pXHJcblxyXG5cdFx0XHQvKlxyXG5cdFx0XHRsZXQgc2VsZiA9IHRoaXM7XHJcblxyXG5cdFx0ICAgXHRsZXQgcmV0ID0gdGhpcy5nZXRQYXJlbnRPZlN0b3JlKG5hbWUpXHJcblx0XHQgICBcdC50aGVuKChwYXJlbnQpID0+IHtcclxuXHRcdFx0ICAgXHRpZihzZWxmLnN0b3Jlc1twYXJlbnRdIGluc3RhbmNlb2YgU3RvcmUgfHwgcGFyZW50ID09PSAnaG8uZmx1eC5TdG9yZScpXHJcblx0XHRcdFx0ICAgXHRyZXR1cm4gdHJ1ZTtcclxuXHQgICBcdFx0XHRlbHNlXHJcblx0XHRcdCAgIFx0XHRyZXR1cm4gc2VsZi5sb2FkU3RvcmUocGFyZW50KTtcclxuXHRcdCAgIFx0fSlcclxuXHRcdCAgIFx0LnRoZW4oKHBhcmVudFR5cGUpID0+IHtcclxuXHRcdFx0ICAgXHRyZXR1cm4gaG8uZmx1eC5zdG9yZXByb3ZpZGVyLmluc3RhbmNlLmdldFN0b3JlKG5hbWUpO1xyXG5cdFx0ICAgXHR9KVxyXG5cdFx0ICAgXHQudGhlbigoc3RvcmVDbGFzcykgPT4ge1xyXG5cdFx0XHQgICBcdHJldHVybiBzZWxmLnJlZ2lzdGVyKG5ldyBzdG9yZUNsYXNzKS5pbml0KCk7XHJcblx0XHQgICBcdH0pXHJcblx0XHRcdC50aGVuKCgpPT57XHJcblx0XHRcdCAgIFx0cmV0dXJuIHNlbGYuc3RvcmVzW25hbWVdO1xyXG5cdFx0XHR9KTtcclxuXHJcblx0XHRcdHJldHVybiByZXQ7XHJcblx0XHRcdCovXHJcblxyXG5cdFx0XHQvKlxyXG5cdFx0XHRyZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XHJcblx0XHRcdFx0aWYodGhpcy5nZXQobmFtZSkgaW5zdGFuY2VvZiBTdG9yZSlcclxuXHRcdFx0XHRcdHJlc29sdmUodGhpcy5nZXQobmFtZSkpXHJcblx0XHRcdFx0ZWxzZSB7XHJcblxyXG5cdFx0XHRcdFx0c3RvcmVwcm92aWRlci5pbnN0YW5jZS5nZXRTdG9yZShuYW1lKVxyXG5cdFx0XHRcdFx0LnRoZW4oKHN0b3JlQ2xhc3MpID0+IHtcclxuXHRcdFx0XHRcdFx0dGhpcy5yZWdpc3RlcihuZXcgc3RvcmVDbGFzcygpKTtcclxuXHRcdFx0XHRcdFx0cmVzb2x2ZSh0aGlzLmdldChuYW1lKSk7XHJcblx0XHRcdFx0XHR9KVxyXG5cdFx0XHRcdFx0LmNhdGNoKHJlamVjdCk7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0fS5iaW5kKHRoaXMpKTtcclxuXHRcdFx0Ki9cclxuXHJcblx0XHRcdC8qXHJcblx0XHRcdGlmKFNUT1JFU1tuYW1lXSAhPT0gdW5kZWZpbmVkICYmIFNUT1JFU1tuYW1lXSBpbnN0YW5jZW9mIFN0b3JlKVxyXG5cdFx0XHRcdHJldHVybiBQcm9taXNlLmNyZWF0ZShTVE9SRVNbbmFtZV0pO1xyXG5cdFx0XHRlbHNlIHtcclxuXHRcdFx0XHRyZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG5cdFx0XHRcdFx0c3RvcmVwcm92aWRlci5pbnN0YW5jZS5nZXRTdG9yZShuYW1lKVxyXG5cdFx0XHRcdFx0LnRoZW4oKHMpPT57cmVzb2x2ZShzKTt9KVxyXG5cdFx0XHRcdFx0LmNhdGNoKChlKT0+e3JlamVjdChlKTt9KTtcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0fVxyXG5cdFx0XHQqL1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvKlxyXG5cdFx0cHJvdGVjdGVkIGdldFBhcmVudE9mU3RvcmUobmFtZTogc3RyaW5nKTogUHJvbWlzZTxzdHJpbmcsIGFueT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG5cclxuICAgICAgICAgICAgICAgIGxldCB4bWxodHRwID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XHJcbiAgICAgICAgICAgICAgICB4bWxodHRwLm9ucmVhZHlzdGF0ZWNoYW5nZSA9ICgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBpZih4bWxodHRwLnJlYWR5U3RhdGUgPT0gNCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgcmVzcCA9IHhtbGh0dHAucmVzcG9uc2VUZXh0O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZih4bWxodHRwLnN0YXR1cyA9PSAyMDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBtID0gcmVzcC5tYXRjaCgvfVxcKVxcKCguKilcXCk7Lyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZihtICE9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShtWzFdKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUobnVsbCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZWplY3QocmVzcCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgICAgICB4bWxodHRwLm9wZW4oJ0dFVCcsIGhvLmZsdXguc3RvcmVwcm92aWRlci5pbnN0YW5jZS5yZXNvbHZlKG5hbWUpKTtcclxuICAgICAgICAgICAgICAgIHhtbGh0dHAuc2VuZCgpO1xyXG5cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cdFx0Ki9cclxuXHR9XHJcblxyXG59XHJcbiIsIlxyXG5tb2R1bGUgaG8uZmx1eC5zdGF0ZXByb3ZpZGVyIHtcclxuXHRpbXBvcnQgUHJvbWlzZSA9IGhvLnByb21pc2UuUHJvbWlzZTtcclxuXHJcbiAgICBleHBvcnQgaW50ZXJmYWNlIElTdGF0ZVByb3ZpZGVyIHtcclxuICAgICAgICB1c2VNaW46Ym9vbGVhbjtcclxuXHRcdHJlc29sdmUoKTogc3RyaW5nO1xyXG5cdFx0Z2V0U3RhdGVzKG5hbWU/OnN0cmluZyk6IFByb21pc2U8SVN0YXRlcywgc3RyaW5nPjtcclxuICAgIH1cclxuXHJcblx0Y2xhc3MgU3RhdGVQcm92aWRlciBpbXBsZW1lbnRzIElTdGF0ZVByb3ZpZGVyIHtcclxuXHJcbiAgICAgICAgdXNlTWluOiBib29sZWFuID0gZmFsc2U7XHJcblxyXG4gICAgICAgIHJlc29sdmUoKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMudXNlTWluID9cclxuICAgICAgICAgICAgICAgIGBzdGF0ZXMubWluLmpzYCA6XHJcbiAgICAgICAgICAgICAgICBgc3RhdGVzLmpzYDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGdldFN0YXRlcyhuYW1lID0gXCJTdGF0ZXNcIik6IFByb21pc2U8SVN0YXRlcywgc3RyaW5nPiB7XHJcblx0XHRcdHJldHVybiBuZXcgUHJvbWlzZTxJU3RhdGVzLCBhbnk+KChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuXHRcdFx0XHRsZXQgc3JjID0gdGhpcy5yZXNvbHZlKCk7XHJcbiAgICAgICAgICAgICAgICBsZXQgc2NyaXB0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc2NyaXB0Jyk7XHJcbiAgICAgICAgICAgICAgICBzY3JpcHQub25sb2FkID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShuZXcgd2luZG93W25hbWVdKTtcclxuICAgICAgICAgICAgICAgIH07XHJcblx0XHRcdFx0c2NyaXB0Lm9uZXJyb3IgPSAoZSkgPT4ge1xyXG5cdFx0XHRcdFx0cmVqZWN0KGUpO1xyXG5cdFx0XHRcdH07XHJcbiAgICAgICAgICAgICAgICBzY3JpcHQuc3JjID0gc3JjO1xyXG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2hlYWQnKVswXS5hcHBlbmRDaGlsZChzY3JpcHQpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgbGV0IGluc3RhbmNlOiBJU3RhdGVQcm92aWRlciA9IG5ldyBTdGF0ZVByb3ZpZGVyKCk7XHJcbn1cclxuIiwiXHJcbm1vZHVsZSBoby5mbHV4IHtcclxuXHJcblx0ZXhwb3J0IGNsYXNzIFN0b3JlPFQ+IGV4dGVuZHMgQ2FsbGJhY2tIb2xkZXIge1xyXG5cclxuXHRcdHByb3RlY3RlZCBkYXRhOiBUO1xyXG5cdFx0cHJpdmF0ZSBpZDogc3RyaW5nO1xyXG5cdFx0cHJpdmF0ZSBoYW5kbGVyczoge1trZXk6IHN0cmluZ106IEZ1bmN0aW9ufSA9IHt9O1xyXG5cclxuXHJcblx0XHRjb25zdHJ1Y3RvcigpIHtcclxuXHRcdFx0c3VwZXIoKTtcclxuXHRcdFx0dGhpcy5pZCA9IGhvLmZsdXguRElTUEFUQ0hFUi5yZWdpc3Rlcih0aGlzLmhhbmRsZS5iaW5kKHRoaXMpKTtcclxuXHRcdFx0Ly9oby5mbHV4LlNUT1JFU1t0aGlzLm5hbWVdID0gdGhpcztcclxuXHRcdFx0aG8uZmx1eC5TVE9SRVMucmVnaXN0ZXIodGhpcyk7XHJcblx0XHR9XHJcblxyXG5cdFx0cHVibGljIGluaXQoKTogYW55IHt9XHJcblxyXG5cdFx0IGdldCBuYW1lKCk6IHN0cmluZyB7XHJcblx0XHRcdHJldHVybiB0aGlzLmNvbnN0cnVjdG9yLnRvU3RyaW5nKCkubWF0Y2goL1xcdysvZylbMV07XHJcblx0XHR9XHJcblxyXG5cdFx0cHVibGljIHJlZ2lzdGVyKGNhbGxiYWNrOiAoZGF0YTpUKT0+dm9pZCwgc2VsZj86YW55KTogc3RyaW5nIHtcclxuXHRcdFx0cmV0dXJuIHN1cGVyLnJlZ2lzdGVyKGNhbGxiYWNrLCBzZWxmKTtcclxuXHRcdH1cclxuXHJcblx0XHRwcm90ZWN0ZWQgb24odHlwZTogc3RyaW5nLCBmdW5jOiBGdW5jdGlvbik6IHZvaWQge1xyXG5cdFx0XHR0aGlzLmhhbmRsZXJzW3R5cGVdID0gZnVuYztcclxuXHRcdH1cclxuXHJcblx0XHRwcm90ZWN0ZWQgaGFuZGxlKGFjdGlvbjogSUFjdGlvbik6IHZvaWQge1xyXG5cdFx0XHRpZih0eXBlb2YgdGhpcy5oYW5kbGVyc1thY3Rpb24udHlwZV0gPT09ICdmdW5jdGlvbicpXHJcblx0XHRcdFx0dGhpcy5oYW5kbGVyc1thY3Rpb24udHlwZV0oYWN0aW9uLmRhdGEpO1xyXG5cdFx0fTtcclxuXHJcblxyXG5cdFx0cHJvdGVjdGVkIGNoYW5nZWQoKTogdm9pZCB7XHJcblx0XHRcdGZvciAobGV0IGlkIGluIHRoaXMuY2FsbGJhY2tzKSB7XHJcblx0XHRcdCAgbGV0IGNiID0gdGhpcy5jYWxsYmFja3NbaWRdO1xyXG5cdFx0XHQgIGlmKGNiKVxyXG5cdFx0XHQgIFx0Y2IodGhpcy5kYXRhKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHJcblx0fTtcclxuXHJcblxyXG59XHJcbiIsIlxyXG5cclxubW9kdWxlIGhvLmZsdXgge1xyXG5cclxuXHRpbXBvcnQgUHJvbWlzZSA9IGhvLnByb21pc2UuUHJvbWlzZTtcclxuXHJcblxyXG5cdC8qKiBEYXRhIHRoYXQgYSBSb3V0ZXIjZ28gdGFrZXMgKi9cclxuXHRleHBvcnQgaW50ZXJmYWNlIElSb3V0ZURhdGEge1xyXG5cdCAgICBzdGF0ZTogc3RyaW5nO1xyXG5cdFx0YXJnczogYW55O1xyXG5cdFx0ZXh0ZXJuOiBib29sZWFuO1xyXG5cdH1cclxuXHJcblx0LyoqIERhdGEgdGhhdCBSb3V0ZXIjY2hhbmdlcyBlbWl0IHRvIGl0cyBsaXN0ZW5lcnMgKi9cclxuXHRleHBvcnQgaW50ZXJmYWNlIElSb3V0ZXJEYXRhIHtcclxuXHQgICAgc3RhdGU6IElTdGF0ZTtcclxuXHRcdGFyZ3M6IGFueTtcclxuXHRcdGV4dGVybjogYm9vbGVhbjtcclxuXHR9XHJcblxyXG5cdGV4cG9ydCBjbGFzcyBSb3V0ZXIgZXh0ZW5kcyBTdG9yZTxJUm91dGVyRGF0YT4ge1xyXG5cclxuXHRcdHByaXZhdGUgbWFwcGluZzpBcnJheTxJU3RhdGU+ID0gbnVsbDtcclxuXHJcblx0XHRwdWJsaWMgaW5pdCgpOiBQcm9taXNlPGFueSwgYW55PiB7XHJcblx0XHRcdHRoaXMub24oJ1NUQVRFJywgdGhpcy5vblN0YXRlQ2hhbmdlUmVxdWVzdGVkLmJpbmQodGhpcykpO1xyXG5cclxuXHRcdFx0bGV0IG9uSGFzaENoYW5nZSA9IHRoaXMub25IYXNoQ2hhbmdlLmJpbmQodGhpcyk7XHJcblxyXG5cdFx0XHRyZXR1cm4gdGhpcy5pbml0U3RhdGVzKClcclxuXHRcdFx0LnRoZW4oKCkgPT4ge1xyXG5cdFx0XHRcdHdpbmRvdy5vbmhhc2hjaGFuZ2UgPSBvbkhhc2hDaGFuZ2U7XHJcblx0XHRcdFx0b25IYXNoQ2hhbmdlKCk7XHJcblx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cclxuXHRcdHB1YmxpYyBnbyhzdGF0ZTogc3RyaW5nLCBkYXRhPzogYW55KTogdm9pZFxyXG5cdFx0cHVibGljIGdvKGRhdGE6IElSb3V0ZURhdGEpOiB2b2lkXHJcblx0XHRwdWJsaWMgZ28oZGF0YTogSVJvdXRlRGF0YSB8IHN0cmluZywgYXJncz86IGFueSk6IHZvaWQge1xyXG5cclxuXHRcdFx0bGV0IF9kYXRhOiBJUm91dGVEYXRhID0ge1xyXG5cdFx0XHRcdHN0YXRlOiB1bmRlZmluZWQsXHJcblx0XHRcdFx0YXJnczogdW5kZWZpbmVkLFxyXG5cdFx0XHRcdGV4dGVybjogZmFsc2VcclxuXHRcdFx0fTtcclxuXHJcblx0XHRcdGlmKHR5cGVvZiBkYXRhID09PSAnc3RyaW5nJykge1xyXG5cdFx0XHRcdF9kYXRhLnN0YXRlID0gZGF0YTtcclxuXHRcdFx0XHRfZGF0YS5hcmdzID0gYXJncztcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRfZGF0YS5zdGF0ZSA9IGRhdGEuc3RhdGU7XHJcblx0XHRcdFx0X2RhdGEuYXJncyA9IGRhdGEuYXJncztcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0aG8uZmx1eC5ESVNQQVRDSEVSLmRpc3BhdGNoKHtcclxuXHRcdFx0XHR0eXBlOiAnU1RBVEUnLFxyXG5cdFx0XHRcdGRhdGE6IF9kYXRhXHJcblx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cclxuXHRcdHByaXZhdGUgaW5pdFN0YXRlcygpOiBQcm9taXNlPGFueSwgYW55PiB7XHJcblx0XHRcdHJldHVybiBzdGF0ZXByb3ZpZGVyLmluc3RhbmNlLmdldFN0YXRlcygpXHJcblx0XHRcdC50aGVuKGZ1bmN0aW9uKGlzdGF0ZXMpIHtcclxuXHRcdFx0XHR0aGlzLm1hcHBpbmcgPSBpc3RhdGVzLnN0YXRlcztcclxuXHRcdFx0fS5iaW5kKHRoaXMpKTtcclxuXHRcdH1cclxuXHJcblx0XHRwcml2YXRlIGdldFN0YXRlRnJvbU5hbWUobmFtZTogc3RyaW5nKTogSVN0YXRlIHtcclxuXHRcdFx0cmV0dXJuIHRoaXMubWFwcGluZy5maWx0ZXIoKHMpPT57XHJcblx0XHRcdFx0cmV0dXJuIHMubmFtZSA9PT0gbmFtZVxyXG5cdFx0XHR9KVswXTtcclxuXHRcdH1cclxuXHJcblx0XHRwcm90ZWN0ZWQgb25TdGF0ZUNoYW5nZVJlcXVlc3RlZChkYXRhOiBJUm91dGVEYXRhKTogdm9pZCB7XHJcblx0XHRcdC8vZ2V0IHJlcXVlc3RlZCBzdGF0ZVxyXG5cdFx0XHRsZXQgc3RhdGUgPSB0aGlzLmdldFN0YXRlRnJvbU5hbWUoZGF0YS5zdGF0ZSk7XHJcblx0XHRcdGxldCB1cmwgPSB0aGlzLnVybEZyb21TdGF0ZShzdGF0ZS51cmwsIGRhdGEuYXJncyk7XHJcblxyXG5cdFx0XHQvL2N1cnJlbnQgc3RhdGUgYW5kIGFyZ3MgZXF1YWxzIHJlcXVlc3RlZCBzdGF0ZSBhbmQgYXJncyAtPiByZXR1cm5cclxuXHRcdFx0aWYoXHJcblx0XHRcdFx0dGhpcy5kYXRhICYmXHJcblx0XHRcdFx0dGhpcy5kYXRhLnN0YXRlICYmXHJcblx0XHRcdFx0dGhpcy5kYXRhLnN0YXRlLm5hbWUgPT09IGRhdGEuc3RhdGUgJiZcclxuXHRcdFx0XHR0aGlzLmVxdWFscyh0aGlzLmRhdGEuYXJncywgZGF0YS5hcmdzKSAmJlxyXG5cdFx0XHRcdHVybCA9PT0gd2luZG93LmxvY2F0aW9uLmhhc2guc3Vic3RyKDEpXHJcblx0XHRcdCkge1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cclxuXHJcblxyXG5cdFx0XHQvL3JlcXVlc3RlZCBzdGF0ZSBoYXMgYW4gcmVkaXJlY3QgcHJvcGVydHkgLT4gY2FsbCByZWRpcmVjdCBzdGF0ZVxyXG5cdFx0XHRpZighIXN0YXRlLnJlZGlyZWN0KSB7XHJcblx0XHRcdFx0c3RhdGUgPSB0aGlzLmdldFN0YXRlRnJvbU5hbWUoc3RhdGUucmVkaXJlY3QpO1xyXG5cdFx0XHR9XHJcblxyXG5cclxuXHRcdFx0bGV0IHByb20gPSB0eXBlb2Ygc3RhdGUuYmVmb3JlID09PSAnZnVuY3Rpb24nID8gc3RhdGUuYmVmb3JlKGRhdGEpIDogUHJvbWlzZS5jcmVhdGUodW5kZWZpbmVkKTtcclxuXHRcdFx0cHJvbVxyXG5cdFx0XHQudGhlbihmdW5jdGlvbigpIHtcclxuXHJcblx0XHRcdFx0Ly9kb2VzIHRoZSBzdGF0ZSBjaGFuZ2UgcmVxdWVzdCBjb21lcyBmcm9tIGV4dGVybiBlLmcuIHVybCBjaGFuZ2UgaW4gYnJvd3NlciB3aW5kb3cgP1xyXG5cdFx0XHRcdGxldCBleHRlcm4gPSAhISBkYXRhLmV4dGVybjtcclxuXHJcblx0XHRcdFx0dGhpcy5kYXRhID0ge1xyXG5cdFx0XHRcdFx0c3RhdGU6IHN0YXRlLFxyXG5cdFx0XHRcdFx0YXJnczogZGF0YS5hcmdzLFxyXG5cdFx0XHRcdFx0ZXh0ZXJuOiBleHRlcm4sXHJcblx0XHRcdFx0fTtcclxuXHJcblx0XHRcdFx0Ly8tLS0tLS0tIHNldCB1cmwgZm9yIGJyb3dzZXJcclxuXHRcdFx0XHR2YXIgdXJsID0gdGhpcy51cmxGcm9tU3RhdGUoc3RhdGUudXJsLCBkYXRhLmFyZ3MpO1xyXG5cdFx0XHRcdHRoaXMuc2V0VXJsKHVybCk7XHJcblxyXG5cdFx0XHRcdHRoaXMuY2hhbmdlZCgpO1xyXG5cclxuXHRcdFx0fS5iaW5kKHRoaXMpLFxyXG5cdFx0XHRmdW5jdGlvbihkYXRhKSB7XHJcblx0XHRcdFx0dGhpcy5vblN0YXRlQ2hhbmdlUmVxdWVzdGVkKGRhdGEpO1xyXG5cdFx0XHR9LmJpbmQodGhpcykpO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHRwcml2YXRlIG9uSGFzaENoYW5nZSgpOiB2b2lkIHtcclxuXHRcdFx0bGV0IHMgPSB0aGlzLnN0YXRlRnJvbVVybCh3aW5kb3cubG9jYXRpb24uaGFzaC5zdWJzdHIoMSkpO1xyXG5cclxuXHRcdFx0aG8uZmx1eC5ESVNQQVRDSEVSLmRpc3BhdGNoKHtcclxuXHRcdFx0XHR0eXBlOiAnU1RBVEUnLFxyXG5cdFx0XHRcdGRhdGE6IHtcclxuXHRcdFx0XHRcdHN0YXRlOiBzLnN0YXRlLFxyXG5cdFx0XHRcdFx0YXJnczogcy5hcmdzLFxyXG5cdFx0XHRcdFx0ZXh0ZXJuOiB0cnVlLFxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblxyXG5cdFx0cHJpdmF0ZSBzZXRVcmwodXJsOiBzdHJpbmcpOiB2b2lkIHtcclxuXHRcdFx0aWYod2luZG93LmxvY2F0aW9uLmhhc2guc3Vic3RyKDEpID09PSB1cmwpXHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cclxuXHRcdFx0bGV0IGwgPSB3aW5kb3cub25oYXNoY2hhbmdlO1xyXG5cdFx0XHR3aW5kb3cub25oYXNoY2hhbmdlID0gbnVsbDtcclxuXHRcdFx0d2luZG93LmxvY2F0aW9uLmhhc2ggPSB1cmw7XHJcblx0XHRcdHdpbmRvdy5vbmhhc2hjaGFuZ2UgPSBsO1xyXG5cdFx0fVxyXG5cclxuXHRcdHByaXZhdGUgcmVnZXhGcm9tVXJsKHVybDogc3RyaW5nKTogc3RyaW5nIHtcclxuXHRcdFx0dmFyIHJlZ2V4ID0gLzooW1xcd10rKS87XHJcblx0XHRcdHdoaWxlKHVybC5tYXRjaChyZWdleCkpIHtcclxuXHRcdFx0XHR1cmwgPSB1cmwucmVwbGFjZShyZWdleCwgXCIoW15cXC9dKylcIik7XHJcblx0XHRcdH1cclxuXHRcdFx0cmV0dXJuIHVybCsnJCc7XHJcblx0XHR9XHJcblxyXG5cdFx0cHJpdmF0ZSBhcmdzRnJvbVVybChwYXR0ZXJuOiBzdHJpbmcsIHVybDogc3RyaW5nKTogYW55IHtcclxuXHRcdFx0bGV0IHIgPSB0aGlzLnJlZ2V4RnJvbVVybChwYXR0ZXJuKTtcclxuXHRcdFx0bGV0IG5hbWVzID0gcGF0dGVybi5tYXRjaChyKS5zbGljZSgxKTtcclxuXHRcdFx0bGV0IHZhbHVlcyA9IHVybC5tYXRjaChyKS5zbGljZSgxKTtcclxuXHJcblx0XHRcdGxldCBhcmdzID0ge307XHJcblx0XHRcdG5hbWVzLmZvckVhY2goZnVuY3Rpb24obmFtZSwgaSkge1xyXG5cdFx0XHRcdGFyZ3NbbmFtZS5zdWJzdHIoMSldID0gdmFsdWVzW2ldO1xyXG5cdFx0XHR9KTtcclxuXHJcblx0XHRcdHJldHVybiBhcmdzO1xyXG5cdFx0fVxyXG5cclxuXHRcdHByaXZhdGUgc3RhdGVGcm9tVXJsKHVybDogc3RyaW5nKTogSVJvdXRlRGF0YSB7XHJcblx0XHRcdHZhciBzID0gdm9pZCAwO1xyXG5cdFx0XHR0aGlzLm1hcHBpbmcuZm9yRWFjaCgoc3RhdGU6IElTdGF0ZSkgPT4ge1xyXG5cdFx0XHRcdGlmKHMpXHJcblx0XHRcdFx0XHRyZXR1cm47XHJcblxyXG5cdFx0XHRcdHZhciByID0gdGhpcy5yZWdleEZyb21Vcmwoc3RhdGUudXJsKTtcclxuXHRcdFx0XHRpZih1cmwubWF0Y2gocikpIHtcclxuXHRcdFx0XHRcdHZhciBhcmdzID0gdGhpcy5hcmdzRnJvbVVybChzdGF0ZS51cmwsIHVybCk7XHJcblx0XHRcdFx0XHRzID0ge1xyXG5cdFx0XHRcdFx0XHRcInN0YXRlXCI6IHN0YXRlLm5hbWUsXHJcblx0XHRcdFx0XHRcdFwiYXJnc1wiOiBhcmdzLFxyXG5cdFx0XHRcdFx0XHRcImV4dGVyblwiOiBmYWxzZVxyXG5cdFx0XHRcdFx0fTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdFx0aWYoIXMpXHJcblx0XHRcdFx0dGhyb3cgXCJObyBTdGF0ZSBmb3VuZCBmb3IgdXJsIFwiK3VybDtcclxuXHJcblx0XHRcdHJldHVybiBzO1xyXG5cdFx0fVxyXG5cclxuXHRcdHByaXZhdGUgdXJsRnJvbVN0YXRlKHVybDogc3RyaW5nLCBhcmdzOiBhbnkpOiBzdHJpbmcge1xyXG5cdFx0XHRsZXQgcmVnZXggPSAvOihbXFx3XSspLztcclxuXHRcdFx0d2hpbGUodXJsLm1hdGNoKHJlZ2V4KSkge1xyXG5cdFx0XHRcdHVybCA9IHVybC5yZXBsYWNlKHJlZ2V4LCBmdW5jdGlvbihtKSB7XHJcblx0XHRcdFx0XHRyZXR1cm4gYXJnc1ttLnN1YnN0cigxKV07XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdH1cclxuXHRcdFx0cmV0dXJuIHVybDtcclxuXHRcdH1cclxuXHJcblx0XHRwcml2YXRlIGVxdWFscyhvMTogYW55LCBvMjogYW55KSA6IGJvb2xlYW4ge1xyXG5cdFx0XHRyZXR1cm4gSlNPTi5zdHJpbmdpZnkobzEpID09PSBKU09OLnN0cmluZ2lmeShvMik7XHJcblx0XHR9XHJcblxyXG5cdH1cclxufVxyXG4iLCJcclxubW9kdWxlIGhvLmZsdXgge1xyXG5cclxuXHRleHBvcnQgaW50ZXJmYWNlIElBY3Rpb24ge1xyXG5cdCAgICB0eXBlOnN0cmluZztcclxuXHRcdGRhdGE/OmFueTtcclxuXHR9XHJcblxyXG5cdGV4cG9ydCBjbGFzcyBEaXNwYXRjaGVyIGV4dGVuZHMgQ2FsbGJhY2tIb2xkZXIge1xyXG5cclxuICAgIFx0cHJpdmF0ZSBpc1BlbmRpbmc6IHtba2V5OnN0cmluZ106Ym9vbGVhbn0gPSB7fTtcclxuICAgIFx0cHJpdmF0ZSBpc0hhbmRsZWQ6IHtba2V5OnN0cmluZ106Ym9vbGVhbn0gPSB7fTtcclxuICAgIFx0cHJpdmF0ZSBpc0Rpc3BhdGNoaW5nOiBib29sZWFuID0gZmFsc2U7XHJcbiAgICBcdHByaXZhdGUgcGVuZGluZ1BheWxvYWQ6IElBY3Rpb24gPSBudWxsO1xyXG5cclxuXHRcdHB1YmxpYyB3YWl0Rm9yKC4uLmlkczogQXJyYXk8bnVtYmVyPik6IHZvaWQge1xyXG5cdFx0XHRpZighdGhpcy5pc0Rpc3BhdGNoaW5nKVxyXG5cdFx0ICBcdFx0dGhyb3cgJ0Rpc3BhdGNoZXIud2FpdEZvciguLi4pOiBNdXN0IGJlIGludm9rZWQgd2hpbGUgZGlzcGF0Y2hpbmcuJztcclxuXHJcblx0XHRcdGZvciAobGV0IGlpID0gMDsgaWkgPCBpZHMubGVuZ3RoOyBpaSsrKSB7XHJcblx0XHRcdCAgbGV0IGlkID0gaWRzW2lpXTtcclxuXHJcblx0XHRcdCAgaWYgKHRoaXMuaXNQZW5kaW5nW2lkXSkge1xyXG5cdFx0ICAgICAgXHRpZighdGhpcy5pc0hhbmRsZWRbaWRdKVxyXG5cdFx0XHQgICAgICBcdHRocm93IGB3YWl0Rm9yKC4uLik6IENpcmN1bGFyIGRlcGVuZGVuY3kgZGV0ZWN0ZWQgd2hpbGUgd2F0aW5nIGZvciAke2lkfWA7XHJcblx0XHRcdFx0Y29udGludWU7XHJcblx0XHRcdCAgfVxyXG5cclxuXHRcdFx0ICBpZighdGhpcy5jYWxsYmFja3NbaWRdKVxyXG5cdFx0XHQgIFx0dGhyb3cgYHdhaXRGb3IoLi4uKTogJHtpZH0gZG9lcyBub3QgbWFwIHRvIGEgcmVnaXN0ZXJlZCBjYWxsYmFjay5gO1xyXG5cclxuXHRcdFx0ICB0aGlzLmludm9rZUNhbGxiYWNrKGlkKTtcclxuXHRcdFx0fVxyXG5cdFx0fTtcclxuXHJcblx0XHRwdWJsaWMgZGlzcGF0Y2goYWN0aW9uOiBJQWN0aW9uKSB7XHJcblx0XHRcdGlmKHRoaXMuaXNEaXNwYXRjaGluZylcclxuXHRcdCAgICBcdHRocm93ICdDYW5ub3QgZGlzcGF0Y2ggaW4gdGhlIG1pZGRsZSBvZiBhIGRpc3BhdGNoLic7XHJcblxyXG5cdFx0XHR0aGlzLnN0YXJ0RGlzcGF0Y2hpbmcoYWN0aW9uKTtcclxuXHJcblx0XHQgICAgdHJ5IHtcclxuXHRcdCAgICAgIGZvciAobGV0IGlkIGluIHRoaXMuY2FsbGJhY2tzKSB7XHJcblx0XHQgICAgICAgIGlmICh0aGlzLmlzUGVuZGluZ1tpZF0pIHtcclxuXHRcdCAgICAgICAgICBjb250aW51ZTtcclxuXHRcdCAgICAgICAgfVxyXG5cdFx0ICAgICAgICB0aGlzLmludm9rZUNhbGxiYWNrKGlkKTtcclxuXHRcdCAgICAgIH1cclxuXHRcdCAgICB9IGZpbmFsbHkge1xyXG5cdFx0ICAgICAgdGhpcy5zdG9wRGlzcGF0Y2hpbmcoKTtcclxuXHRcdCAgICB9XHJcblx0XHR9O1xyXG5cclxuXHQgIFx0cHJpdmF0ZSBpbnZva2VDYWxsYmFjayhpZDogbnVtYmVyKTogdm9pZCB7XHJcblx0ICAgIFx0dGhpcy5pc1BlbmRpbmdbaWRdID0gdHJ1ZTtcclxuXHQgICAgXHR0aGlzLmNhbGxiYWNrc1tpZF0odGhpcy5wZW5kaW5nUGF5bG9hZCk7XHJcblx0ICAgIFx0dGhpcy5pc0hhbmRsZWRbaWRdID0gdHJ1ZTtcclxuXHQgIFx0fVxyXG5cclxuXHQgIFx0cHJpdmF0ZSBzdGFydERpc3BhdGNoaW5nKHBheWxvYWQ6IElBY3Rpb24pOiB2b2lkIHtcclxuXHQgICAgXHRmb3IgKGxldCBpZCBpbiB0aGlzLmNhbGxiYWNrcykge1xyXG5cdCAgICAgIFx0XHR0aGlzLmlzUGVuZGluZ1tpZF0gPSBmYWxzZTtcclxuXHQgICAgICBcdFx0dGhpcy5pc0hhbmRsZWRbaWRdID0gZmFsc2U7XHJcblx0ICAgIFx0fVxyXG5cdCAgICBcdHRoaXMucGVuZGluZ1BheWxvYWQgPSBwYXlsb2FkO1xyXG5cdCAgICBcdHRoaXMuaXNEaXNwYXRjaGluZyA9IHRydWU7XHJcbiAgXHRcdH1cclxuXHJcblx0ICBcdHByaXZhdGUgc3RvcERpc3BhdGNoaW5nKCk6IHZvaWQge1xyXG5cdCAgICBcdHRoaXMucGVuZGluZ1BheWxvYWQgPSBudWxsO1xyXG5cdCAgICBcdHRoaXMuaXNEaXNwYXRjaGluZyA9IGZhbHNlO1xyXG5cdCAgXHR9XHJcblx0fVxyXG59XHJcbiIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi8uLi8uLi9ib3dlcl9jb21wb25lbnRzL2hvLXByb21pc2UvZGlzdC9wcm9taXNlLmQudHNcIi8+XHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi8uLi8uLi9ib3dlcl9jb21wb25lbnRzL2hvLWNsYXNzbG9hZGVyL2Rpc3QvY2xhc3Nsb2FkZXIuZC50c1wiLz5cclxuXHJcbm1vZHVsZSBoby5mbHV4IHtcclxuXHRpbXBvcnQgUHJvbWlzZSA9IGhvLnByb21pc2UuUHJvbWlzZTtcclxuXHJcblx0ZXhwb3J0IGxldCBESVNQQVRDSEVSOiBEaXNwYXRjaGVyID0gbmV3IERpc3BhdGNoZXIoKTtcclxuXHJcblx0ZXhwb3J0IGxldCBTVE9SRVM6IHJlZ2lzdHJ5LlJlZ2lzdHJ5ID0gbmV3IHJlZ2lzdHJ5LlJlZ2lzdHJ5KCk7XHJcblxyXG5cdGV4cG9ydCBsZXQgZGlyOiBib29sZWFuID0gZmFsc2U7XHJcblxyXG5cdC8vaWYoaG8uZmx1eC5TVE9SRVMuZ2V0KFJvdXRlcikgPT09IHVuZGVmaW5lZClcclxuXHQvL1x0bmV3IFJvdXRlcigpO1xyXG5cclxuXHRleHBvcnQgZnVuY3Rpb24gcnVuKCk6IFByb21pc2U8YW55LCBhbnk+IHtcclxuXHRcdC8vcmV0dXJuICg8Um91dGVyPmhvLmZsdXguU1RPUkVTWydSb3V0ZXInXSkuaW5pdCgpO1xyXG5cdFx0cmV0dXJuIFNUT1JFUy5nZXQoUm91dGVyKS5pbml0KCk7XHJcblx0fVxyXG59XHJcbiIsIm1vZHVsZSBoby51aSB7XG5cblx0ZXhwb3J0IGZ1bmN0aW9uIHJ1bihvcHRpb25zOklPcHRpb25zPW5ldyBPcHRpb25zKCkpOiBoby5wcm9taXNlLlByb21pc2U8YW55LCBhbnk+IHtcblx0XHRvcHRpb25zID0gbmV3IE9wdGlvbnMob3B0aW9ucyk7XG5cblx0XHRsZXQgcCA9IG9wdGlvbnMucHJvY2VzcygpXG5cdFx0LnRoZW4oaG8uY29tcG9uZW50cy5ydW4pXG5cdFx0LnRoZW4oaG8uZmx1eC5ydW4pO1xuXG5cdFx0cmV0dXJuIHA7XG5cdH1cblxuXHRsZXQgY29tcG9uZW50cyA9IFtcblx0XHRcIlN0b3JlZFwiLFxuXHRcdFwiVmlld1wiLFxuXHRdO1xuXG5cdGxldCBhdHRyaWJ1dGVzID0gW1xuXHRcdFwiQmluZFwiLFxuXHRcdFwiQmluZEJpXCIsXG5cdF07XG5cblx0bGV0IHN0b3JlcyA9IFtcblxuXHRdO1xuXG5cdGV4cG9ydCBpbnRlcmZhY2UgSU9wdGlvbnMge1xuXHRcdHJvb3Q6IHN0cmluZyB8IHR5cGVvZiBoby5jb21wb25lbnRzLkNvbXBvbmVudDsgLy9Sb290IGNvbXBvbmVudCB0byByZWdpc3Rlcjtcblx0XHRyb3V0ZXI6IHN0cmluZyB8IHR5cGVvZiBoby5mbHV4LlJvdXRlcjsgLy9hbHRlcm5hdGl2ZSByb3V0ZXIgY2xhc3Ncblx0XHRtYXA6IHN0cmluZyB8IGJvb2xlYW47IC8vIGlmIHNldCwgbWFwIGFsbCBoby51aSBjb21wb25lbnRzIGluIHRoZSBjb21wb25lbnRwcm92aWRlciB0byB0aGUgZ2l2ZW4gdXJsXG5cdFx0ZGlyOiBib29sZWFuOyAvLyBzZXQgdXNlZGlyIGluIGhvLmNvbXBvbmVudHNcblx0XHRtaW46IGJvb2xlYW47XG5cdFx0cHJvY2VzczogKCk9PmhvLnByb21pc2UuUHJvbWlzZTxhbnksIGFueT47XG5cdH1cblxuXHRjbGFzcyBPcHRpb25zIGltcGxlbWVudHMgSU9wdGlvbnMge1xuXHRcdHJvb3Q6IHN0cmluZyB8IHR5cGVvZiBoby5jb21wb25lbnRzLkNvbXBvbmVudCA9IFwiQXBwXCJcblx0XHRyb3V0ZXI6IHN0cmluZyB8IHR5cGVvZiBoby5mbHV4LlJvdXRlciA9IGhvLmZsdXguUm91dGVyO1xuXHRcdG1hcDogc3RyaW5nIHwgYm9vbGVhbiA9IHRydWU7XG5cdFx0bWFwRGVmYXVsdCA9IFwiYm93ZXJfY29tcG9uZW50cy9oby11aS9kaXN0L1wiO1xuXHRcdGRpciA9IHRydWU7XG5cdFx0bWluID0gZmFsc2U7XG5cblx0XHRjb25zdHJ1Y3RvcihvcHQ6IElPcHRpb25zID0gPElPcHRpb25zPnt9KSB7XG5cdFx0XHRmb3IodmFyIGtleSBpbiBvcHQpIHtcblx0XHRcdFx0dGhpc1trZXldID0gb3B0W2tleV07XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0cHJvY2VzcygpOiBoby5wcm9taXNlLlByb21pc2U8YW55LCBhbnk+e1xuXHRcdFx0cmV0dXJuIGhvLnByb21pc2UuUHJvbWlzZS5jcmVhdGUodGhpcy5wcm9jZXNzRGlyKCkpXG5cdFx0XHQudGhlbih0aGlzLnByb2Nlc3NNaW4uYmluZCh0aGlzKSlcblx0XHRcdC50aGVuKHRoaXMucHJvY2Vzc01hcC5iaW5kKHRoaXMpKVxuXHRcdFx0LnRoZW4odGhpcy5wcm9jZXNzUm91dGVyLmJpbmQodGhpcykpXG5cdFx0XHQudGhlbih0aGlzLnByb2Nlc3NSb290LmJpbmQodGhpcykpXG5cdFx0fVxuXG5cdFx0cHJvdGVjdGVkIHByb2Nlc3NSb290KCkge1xuXHRcdFx0cmV0dXJuIG5ldyBoby5wcm9taXNlLlByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuXHRcdFx0XHRpZih0eXBlb2YgdGhpcy5yb290ID09PSAnc3RyaW5nJykge1xuXHRcdFx0XHRcdGhvLmNvbXBvbmVudHMucmVnaXN0cnkuaW5zdGFuY2UubG9hZENvbXBvbmVudCg8c3RyaW5nPnRoaXMucm9vdClcblx0XHRcdFx0XHQudGhlbihyZXNvbHZlKVxuXHRcdFx0XHRcdC5jYXRjaChyZWplY3QpO1xuXG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0aG8uY29tcG9uZW50cy5yZWdpc3RyeS5pbnN0YW5jZS5yZWdpc3Rlcig8dHlwZW9mIGhvLmNvbXBvbmVudHMuQ29tcG9uZW50PnRoaXMucm9vdClcblx0XHRcdFx0XHRyZXNvbHZlKG51bGwpO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHR9XG5cblx0XHRwcm90ZWN0ZWQgcHJvY2Vzc1JvdXRlcigpOiBoby5wcm9taXNlLlByb21pc2U8YW55LCBhbnk+IHtcblx0XHRcdHJldHVybiBuZXcgaG8ucHJvbWlzZS5Qcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcblx0XHRcdFx0aWYodHlwZW9mIHRoaXMucm91dGVyID09PSAnc3RyaW5nJykge1xuXHRcdFx0XHRcdGhvLmZsdXguU1RPUkVTLmxvYWRTdG9yZSg8c3RyaW5nPnRoaXMucm91dGVyKVxuXHRcdFx0XHRcdC50aGVuKHJlc29sdmUpXG5cdFx0XHRcdFx0LmNhdGNoKHJlamVjdCk7XG5cblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRyZXNvbHZlKG5ldyAoPHR5cGVvZiBoby5mbHV4LlJvdXRlcj50aGlzLnJvdXRlcikoKSk7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXG5cdFx0fVxuXG5cdFx0cHJvdGVjdGVkIHByb2Nlc3NNYXAoKTogdm9pZCB7XG5cdFx0XHRpZih0eXBlb2YgdGhpcy5tYXAgPT09ICdib29sZWFuJykge1xuXHRcdFx0XHRpZighdGhpcy5tYXApXG5cdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0dGhpcy5tYXAgPSB0aGlzLm1hcERlZmF1bHQ7XG5cdFx0XHR9XG5cblx0XHRcdGNvbXBvbmVudHMuZm9yRWFjaChjID0+IHtcblx0XHRcdFx0Ly9oby5jb21wb25lbnRzLnJlZ2lzdHJ5Lm1hcHBpbmdbY10gPSB0aGlzLm1hcCArICdjb21wb25lbnRzLycgKyBjICsgJy8nICsgYyArICcuanMnO1xuXHRcdFx0XHRoby5jbGFzc2xvYWRlci5tYXBwaW5nW2NdID0gdGhpcy5tYXAgKyAnY29tcG9uZW50cy8nICsgYyArICcvJyArIGMgKyAnLmpzJztcblx0XHRcdH0pO1xuXG5cdFx0XHRhdHRyaWJ1dGVzLmZvckVhY2goYSA9PiB7XG5cdFx0XHRcdC8vaG8uY29tcG9uZW50cy5yZWdpc3RyeS5tYXBwaW5nW2FdID0gdGhpcy5tYXAgKyAnYXR0cmlidXRlcy8nICsgYSArICcvJyArIGEgKyAnLmpzJztcblx0XHRcdFx0aG8uY2xhc3Nsb2FkZXIubWFwcGluZ1thXSA9IHRoaXMubWFwICsgJ2F0dHJpYnV0ZXMvJyArIGEgKyAnLycgKyBhICsgJy5qcyc7XG5cdFx0XHR9KTtcblxuXHRcdFx0c3RvcmVzLmZvckVhY2gocyA9PiB7XG5cdFx0XHRcdC8vaG8uZmx1eC5yZWdpc3RyeS5tYXBwaW5nW3NdID0gdGhpcy5tYXAgKyAnc3RvcmVzLycgKyBzICsgJy8nICsgcyArICcuanMnO1xuXHRcdFx0XHRoby5jbGFzc2xvYWRlci5tYXBwaW5nW3NdID0gdGhpcy5tYXAgKyAnc3RvcmVzLycgKyBzICsgJy8nICsgcyArICcuanMnO1xuXHRcdFx0fSk7XG5cdFx0fVxuXG5cdFx0cHJvdGVjdGVkIHByb2Nlc3NEaXIoKTogdm9pZCB7XG5cdFx0XHRoby5jb21wb25lbnRzLmRpciA9IHRoaXMuZGlyO1xuXHRcdH1cblxuXHRcdHByb3RlY3RlZCBwcm9jZXNzTWluKCk6IHZvaWQge1xuXHRcdFx0Lypcblx0XHRcdGhvLmNvbXBvbmVudHMuY29tcG9uZW50cHJvdmlkZXIuaW5zdGFuY2UudXNlTWluID0gdGhpcy5taW47XG5cdFx0XHRoby5jb21wb25lbnRzLmF0dHJpYnV0ZXByb3ZpZGVyLmluc3RhbmNlLnVzZU1pbiA9IHRoaXMubWluO1xuXHRcdFx0aG8uZmx1eC5zdG9yZXByb3ZpZGVyLmluc3RhbmNlLnVzZU1pbiA9IHRoaXMubWluO1xuXHRcdFx0Ki9cblx0XHR9XG5cdH1cblxufVxuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9