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
            function expose(name, obj) {
                var path = name.split('.');
                name = path.pop();
                var global = window;
                path.map(function (part) {
                    global[part] = global[part] || {};
                    global = global[part];
                });
                if (!!global[name])
                    throw "Global object " + path.join('.') + "." + name + " already exists";
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
        var LoaderConfig = (function () {
            function LoaderConfig(c) {
                if (c === void 0) { c = {}; }
                this.loadType = c.loadType || classloader.LoadType.EVAL;
                this.urlTemplate = c.urlTemplate || "${name}.js";
                this.useDir = typeof c.useDir === 'boolean' ? c.useDir : true;
                this.useMin = typeof c.useMin === 'boolean' ? c.useMin : false;
                //this.exists = c.exists || this.exists.bind(this);
                this.cache = typeof c.cache === 'boolean' ? c.cache : true;
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
                        classloader.util.expose(arg.name, clazz);
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
                        classloader.util.expose(arg.name, clazz);
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
                    return this.attributeLoader.load({
                        name: name,
                        url: registry.mapping[name],
                        super: ["ho.components.Attribute", "ho.components.WatchAttribute"]
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9zb3VyY2Uvc3JjL2hvL3Byb21pc2UvcHJvbWlzZS50cyIsIi9zb3VyY2Uvc3JjL2hvL2NsYXNzbG9hZGVyL3V0aWwvZ2V0LnRzIiwiL3NvdXJjZS9zcmMvaG8vY2xhc3Nsb2FkZXIvdXRpbC9leHBvc2UudHMiLCIvc291cmNlL3NyYy9oby9jbGFzc2xvYWRlci94aHIvZ2V0LnRzIiwiL3NvdXJjZS9zcmMvaG8vY2xhc3Nsb2FkZXIvdHlwZXMudHMiLCIvc291cmNlL3NyYy9oby9jbGFzc2xvYWRlci9sb2FkYXJndW1lbnRzLnRzIiwiL3NvdXJjZS9zcmMvaG8vY2xhc3Nsb2FkZXIvbG9hZGVyY29uZmlnLnRzIiwiL3NvdXJjZS9zcmMvaG8vY2xhc3Nsb2FkZXIvbG9hZHR5cGUudHMiLCIvc291cmNlL3NyYy9oby9jbGFzc2xvYWRlci9jbGFzc2xvYWRlci50cyIsIi9zb3VyY2Uvc3JjL2hvL2NsYXNzbG9hZGVyL21haW4udHMiLCIvc291cmNlL3dhdGNoLnRzIiwiL3NvdXJjZS9zcmMvaG8vY29tcG9uZW50cy90ZW1wL3RlbXAudHMiLCIvc291cmNlL3NyYy9oby9jb21wb25lbnRzL3N0eWxlci9zdHlsZXIudHMiLCIvc291cmNlL3NyYy9oby9jb21wb25lbnRzL3JlbmRlcmVyL3JlbmRlcmVyLnRzIiwiL3NvdXJjZS9zcmMvaG8vY29tcG9uZW50cy9odG1scHJvdmlkZXIvaHRtbHByb3ZpZGVyLnRzIiwiL3NvdXJjZS9zcmMvaG8vY29tcG9uZW50cy9hdHRyaWJ1dGUudHMiLCIvc291cmNlL3NyYy9oby9jb21wb25lbnRzL2NvbXBvbmVudC50cyIsIi9zb3VyY2Uvc3JjL2hvL2NvbXBvbmVudHMvcmVnaXN0cnkvcmVnaXN0cnkudHMiLCIvc291cmNlL3NyYy9oby9jb21wb25lbnRzL2NvbXBvbmVudHMudHMiLCIvc291cmNlL3NyYy9oby9mbHV4L2NhbGxiYWNraG9sZGVyLnRzIiwiL3NvdXJjZS9zcmMvaG8vZmx1eC9zdGF0ZS50cyIsIi9zb3VyY2Uvc3JjL2hvL2ZsdXgvcmVnaXN0cnkvcmVnaXN0cnkudHMiLCIvc291cmNlL3NyYy9oby9mbHV4L3N0YXRlcHJvdmlkZXIvc3RhdGVwcm92aWRlci50cyIsIi9zb3VyY2Uvc3JjL2hvL2ZsdXgvc3RvcmUudHMiLCIvc291cmNlL3NyYy9oby9mbHV4L3JvdXRlci50cyIsIi9zb3VyY2Uvc3JjL2hvL2ZsdXgvZGlzcGF0Y2hlci50cyIsIi9zb3VyY2Uvc3JjL2hvL2ZsdXgvZmx1eC50cyIsIi9zb3VyY2UvdWkudHMiXSwibmFtZXMiOlsiaG8iLCJoby5wcm9taXNlIiwiaG8ucHJvbWlzZS5Qcm9taXNlIiwiaG8ucHJvbWlzZS5Qcm9taXNlLmNvbnN0cnVjdG9yIiwiaG8ucHJvbWlzZS5Qcm9taXNlLnNldCIsImhvLnByb21pc2UuUHJvbWlzZS5yZXNvbHZlIiwiaG8ucHJvbWlzZS5Qcm9taXNlLl9yZXNvbHZlIiwiaG8ucHJvbWlzZS5Qcm9taXNlLnJlamVjdCIsImhvLnByb21pc2UuUHJvbWlzZS5fcmVqZWN0IiwiaG8ucHJvbWlzZS5Qcm9taXNlLnRoZW4iLCJoby5wcm9taXNlLlByb21pc2UuY2F0Y2giLCJoby5wcm9taXNlLlByb21pc2UuYWxsIiwiaG8ucHJvbWlzZS5Qcm9taXNlLmNoYWluIiwiaG8ucHJvbWlzZS5Qcm9taXNlLmNoYWluLm5leHQiLCJoby5wcm9taXNlLlByb21pc2UuY3JlYXRlIiwiaG8uY2xhc3Nsb2FkZXIiLCJoby5jbGFzc2xvYWRlci51dGlsIiwiaG8uY2xhc3Nsb2FkZXIudXRpbC5nZXQiLCJoby5jbGFzc2xvYWRlci51dGlsLmV4cG9zZSIsImhvLmNsYXNzbG9hZGVyLnhociIsImhvLmNsYXNzbG9hZGVyLnhoci5nZXQiLCJoby5jbGFzc2xvYWRlci5Mb2FkQXJndW1lbnRzIiwiaG8uY2xhc3Nsb2FkZXIuTG9hZEFyZ3VtZW50cy5jb25zdHJ1Y3RvciIsImhvLmNsYXNzbG9hZGVyLkxvYWRlckNvbmZpZyIsImhvLmNsYXNzbG9hZGVyLkxvYWRlckNvbmZpZy5jb25zdHJ1Y3RvciIsImhvLmNsYXNzbG9hZGVyLkxvYWRUeXBlIiwiaG8uY2xhc3Nsb2FkZXIuQ2xhc3NMb2FkZXIiLCJoby5jbGFzc2xvYWRlci5DbGFzc0xvYWRlci5jb25zdHJ1Y3RvciIsImhvLmNsYXNzbG9hZGVyLkNsYXNzTG9hZGVyLmNvbmZpZyIsImhvLmNsYXNzbG9hZGVyLkNsYXNzTG9hZGVyLmxvYWQiLCJoby5jbGFzc2xvYWRlci5DbGFzc0xvYWRlci5sb2FkX3NjcmlwdCIsImhvLmNsYXNzbG9hZGVyLkNsYXNzTG9hZGVyLmxvYWRfc2NyaXB0LmxvYWRfaW50ZXJuYWwiLCJoby5jbGFzc2xvYWRlci5DbGFzc0xvYWRlci5sb2FkX2Z1bmN0aW9uIiwiaG8uY2xhc3Nsb2FkZXIuQ2xhc3NMb2FkZXIubG9hZF9ldmFsIiwiaG8uY2xhc3Nsb2FkZXIuQ2xhc3NMb2FkZXIuZ2V0UGFyZW50TmFtZSIsImhvLmNsYXNzbG9hZGVyLkNsYXNzTG9hZGVyLnBhcnNlUGFyZW50RnJvbVNvdXJjZSIsImhvLmNsYXNzbG9hZGVyLkNsYXNzTG9hZGVyLnJlc29sdmVVcmwiLCJoby5jbGFzc2xvYWRlci5DbGFzc0xvYWRlci5leGlzdHMiLCJoby5jbGFzc2xvYWRlci5jb25maWciLCJoby5jbGFzc2xvYWRlci5sb2FkIiwiaG8ud2F0Y2giLCJoby53YXRjaC53YXRjaCIsImhvLndhdGNoLldhdGNoZXIiLCJoby53YXRjaC5XYXRjaGVyLmNvbnN0cnVjdG9yIiwiaG8ud2F0Y2guV2F0Y2hlci53YXRjaCIsImhvLndhdGNoLldhdGNoZXIuY29weSIsImhvLmNvbXBvbmVudHMiLCJoby5jb21wb25lbnRzLnRlbXAiLCJoby5jb21wb25lbnRzLnRlbXAuc2V0IiwiaG8uY29tcG9uZW50cy50ZW1wLmdldCIsImhvLmNvbXBvbmVudHMudGVtcC5jYWxsIiwiaG8uY29tcG9uZW50cy5zdHlsZXIiLCJoby5jb21wb25lbnRzLnN0eWxlci5TdHlsZXIiLCJoby5jb21wb25lbnRzLnN0eWxlci5TdHlsZXIuY29uc3RydWN0b3IiLCJoby5jb21wb25lbnRzLnN0eWxlci5TdHlsZXIuYXBwbHlTdHlsZSIsImhvLmNvbXBvbmVudHMuc3R5bGVyLlN0eWxlci5hcHBseVN0eWxlQmxvY2siLCJoby5jb21wb25lbnRzLnN0eWxlci5TdHlsZXIuYXBwbHlSdWxlIiwiaG8uY29tcG9uZW50cy5zdHlsZXIuU3R5bGVyLnBhcnNlU3R5bGUiLCJoby5jb21wb25lbnRzLnJlbmRlcmVyIiwiaG8uY29tcG9uZW50cy5yZW5kZXJlci5Ob2RlIiwiaG8uY29tcG9uZW50cy5yZW5kZXJlci5Ob2RlLmNvbnN0cnVjdG9yIiwiaG8uY29tcG9uZW50cy5yZW5kZXJlci5SZW5kZXJlciIsImhvLmNvbXBvbmVudHMucmVuZGVyZXIuUmVuZGVyZXIuY29uc3RydWN0b3IiLCJoby5jb21wb25lbnRzLnJlbmRlcmVyLlJlbmRlcmVyLnJlbmRlciIsImhvLmNvbXBvbmVudHMucmVuZGVyZXIuUmVuZGVyZXIucGFyc2UiLCJoby5jb21wb25lbnRzLnJlbmRlcmVyLlJlbmRlcmVyLnJlbmRlclJlcGVhdCIsImhvLmNvbXBvbmVudHMucmVuZGVyZXIuUmVuZGVyZXIuZG9tVG9TdHJpbmciLCJoby5jb21wb25lbnRzLnJlbmRlcmVyLlJlbmRlcmVyLnJlcGwiLCJoby5jb21wb25lbnRzLnJlbmRlcmVyLlJlbmRlcmVyLmV2YWx1YXRlIiwiaG8uY29tcG9uZW50cy5yZW5kZXJlci5SZW5kZXJlci5ldmFsdWF0ZVZhbHVlIiwiaG8uY29tcG9uZW50cy5yZW5kZXJlci5SZW5kZXJlci5ldmFsdWF0ZVZhbHVlQW5kTW9kZWwiLCJoby5jb21wb25lbnRzLnJlbmRlcmVyLlJlbmRlcmVyLmV2YWx1YXRlRXhwcmVzc2lvbiIsImhvLmNvbXBvbmVudHMucmVuZGVyZXIuUmVuZGVyZXIuZXZhbHVhdGVGdW5jdGlvbiIsImhvLmNvbXBvbmVudHMucmVuZGVyZXIuUmVuZGVyZXIuY29weU5vZGUiLCJoby5jb21wb25lbnRzLnJlbmRlcmVyLlJlbmRlcmVyLmlzVm9pZCIsImhvLmNvbXBvbmVudHMuaHRtbHByb3ZpZGVyIiwiaG8uY29tcG9uZW50cy5odG1scHJvdmlkZXIuSHRtbFByb3ZpZGVyIiwiaG8uY29tcG9uZW50cy5odG1scHJvdmlkZXIuSHRtbFByb3ZpZGVyLmNvbnN0cnVjdG9yIiwiaG8uY29tcG9uZW50cy5odG1scHJvdmlkZXIuSHRtbFByb3ZpZGVyLnJlc29sdmUiLCJoby5jb21wb25lbnRzLmh0bWxwcm92aWRlci5IdG1sUHJvdmlkZXIuZ2V0SFRNTCIsImhvLmNvbXBvbmVudHMuQXR0cmlidXRlIiwiaG8uY29tcG9uZW50cy5BdHRyaWJ1dGUuY29uc3RydWN0b3IiLCJoby5jb21wb25lbnRzLkF0dHJpYnV0ZS5pbml0IiwiaG8uY29tcG9uZW50cy5BdHRyaWJ1dGUubmFtZSIsImhvLmNvbXBvbmVudHMuQXR0cmlidXRlLnVwZGF0ZSIsImhvLmNvbXBvbmVudHMuQXR0cmlidXRlLmdldE5hbWUiLCJoby5jb21wb25lbnRzLldhdGNoQXR0cmlidXRlIiwiaG8uY29tcG9uZW50cy5XYXRjaEF0dHJpYnV0ZS5jb25zdHJ1Y3RvciIsImhvLmNvbXBvbmVudHMuV2F0Y2hBdHRyaWJ1dGUud2F0Y2giLCJoby5jb21wb25lbnRzLldhdGNoQXR0cmlidXRlLmV2YWwiLCJoby5jb21wb25lbnRzLkNvbXBvbmVudCIsImhvLmNvbXBvbmVudHMuQ29tcG9uZW50LmNvbnN0cnVjdG9yIiwiaG8uY29tcG9uZW50cy5Db21wb25lbnQubmFtZSIsImhvLmNvbXBvbmVudHMuQ29tcG9uZW50LmdldE5hbWUiLCJoby5jb21wb25lbnRzLkNvbXBvbmVudC5nZXRQYXJlbnQiLCJoby5jb21wb25lbnRzLkNvbXBvbmVudC5faW5pdCIsImhvLmNvbXBvbmVudHMuQ29tcG9uZW50LmluaXQiLCJoby5jb21wb25lbnRzLkNvbXBvbmVudC51cGRhdGUiLCJoby5jb21wb25lbnRzLkNvbXBvbmVudC5yZW5kZXIiLCJoby5jb21wb25lbnRzLkNvbXBvbmVudC5pbml0U3R5bGUiLCJoby5jb21wb25lbnRzLkNvbXBvbmVudC5pbml0SFRNTCIsImhvLmNvbXBvbmVudHMuQ29tcG9uZW50LmluaXRQcm9wZXJ0aWVzIiwiaG8uY29tcG9uZW50cy5Db21wb25lbnQuaW5pdENoaWxkcmVuIiwiaG8uY29tcG9uZW50cy5Db21wb25lbnQuaW5pdEF0dHJpYnV0ZXMiLCJoby5jb21wb25lbnRzLkNvbXBvbmVudC5sb2FkUmVxdWlyZW1lbnRzIiwiaG8uY29tcG9uZW50cy5Db21wb25lbnQuZ2V0Q29tcG9uZW50IiwiaG8uY29tcG9uZW50cy5yZWdpc3RyeSIsImhvLmNvbXBvbmVudHMucmVnaXN0cnkuUmVnaXN0cnkiLCJoby5jb21wb25lbnRzLnJlZ2lzdHJ5LlJlZ2lzdHJ5LmNvbnN0cnVjdG9yIiwiaG8uY29tcG9uZW50cy5yZWdpc3RyeS5SZWdpc3RyeS5yZWdpc3RlciIsImhvLmNvbXBvbmVudHMucmVnaXN0cnkuUmVnaXN0cnkucnVuIiwiaG8uY29tcG9uZW50cy5yZWdpc3RyeS5SZWdpc3RyeS5pbml0Q29tcG9uZW50IiwiaG8uY29tcG9uZW50cy5yZWdpc3RyeS5SZWdpc3RyeS5pbml0RWxlbWVudCIsImhvLmNvbXBvbmVudHMucmVnaXN0cnkuUmVnaXN0cnkuaGFzQ29tcG9uZW50IiwiaG8uY29tcG9uZW50cy5yZWdpc3RyeS5SZWdpc3RyeS5oYXNBdHRyaWJ1dGUiLCJoby5jb21wb25lbnRzLnJlZ2lzdHJ5LlJlZ2lzdHJ5LmdldEF0dHJpYnV0ZSIsImhvLmNvbXBvbmVudHMucmVnaXN0cnkuUmVnaXN0cnkubG9hZENvbXBvbmVudCIsImhvLmNvbXBvbmVudHMucmVnaXN0cnkuUmVnaXN0cnkubG9hZEF0dHJpYnV0ZSIsImhvLmNvbXBvbmVudHMucnVuIiwiaG8uY29tcG9uZW50cy5yZWdpc3RlciIsImhvLmZsdXgiLCJoby5mbHV4LkNhbGxiYWNrSG9sZGVyIiwiaG8uZmx1eC5DYWxsYmFja0hvbGRlci5jb25zdHJ1Y3RvciIsImhvLmZsdXguQ2FsbGJhY2tIb2xkZXIucmVnaXN0ZXIiLCJoby5mbHV4LkNhbGxiYWNrSG9sZGVyLnVucmVnaXN0ZXIiLCJoby5mbHV4LnJlZ2lzdHJ5IiwiaG8uZmx1eC5yZWdpc3RyeS5SZWdpc3RyeSIsImhvLmZsdXgucmVnaXN0cnkuUmVnaXN0cnkuY29uc3RydWN0b3IiLCJoby5mbHV4LnJlZ2lzdHJ5LlJlZ2lzdHJ5LnJlZ2lzdGVyIiwiaG8uZmx1eC5yZWdpc3RyeS5SZWdpc3RyeS5nZXQiLCJoby5mbHV4LnJlZ2lzdHJ5LlJlZ2lzdHJ5LmxvYWRTdG9yZSIsImhvLmZsdXguc3RhdGVwcm92aWRlciIsImhvLmZsdXguc3RhdGVwcm92aWRlci5TdGF0ZVByb3ZpZGVyIiwiaG8uZmx1eC5zdGF0ZXByb3ZpZGVyLlN0YXRlUHJvdmlkZXIuY29uc3RydWN0b3IiLCJoby5mbHV4LnN0YXRlcHJvdmlkZXIuU3RhdGVQcm92aWRlci5yZXNvbHZlIiwiaG8uZmx1eC5zdGF0ZXByb3ZpZGVyLlN0YXRlUHJvdmlkZXIuZ2V0U3RhdGVzIiwiaG8uZmx1eC5TdG9yZSIsImhvLmZsdXguU3RvcmUuY29uc3RydWN0b3IiLCJoby5mbHV4LlN0b3JlLmluaXQiLCJoby5mbHV4LlN0b3JlLm5hbWUiLCJoby5mbHV4LlN0b3JlLnJlZ2lzdGVyIiwiaG8uZmx1eC5TdG9yZS5vbiIsImhvLmZsdXguU3RvcmUuaGFuZGxlIiwiaG8uZmx1eC5TdG9yZS5jaGFuZ2VkIiwiaG8uZmx1eC5Sb3V0ZXIiLCJoby5mbHV4LlJvdXRlci5jb25zdHJ1Y3RvciIsImhvLmZsdXguUm91dGVyLmluaXQiLCJoby5mbHV4LlJvdXRlci5nbyIsImhvLmZsdXguUm91dGVyLmluaXRTdGF0ZXMiLCJoby5mbHV4LlJvdXRlci5nZXRTdGF0ZUZyb21OYW1lIiwiaG8uZmx1eC5Sb3V0ZXIub25TdGF0ZUNoYW5nZVJlcXVlc3RlZCIsImhvLmZsdXguUm91dGVyLm9uSGFzaENoYW5nZSIsImhvLmZsdXguUm91dGVyLnNldFVybCIsImhvLmZsdXguUm91dGVyLnJlZ2V4RnJvbVVybCIsImhvLmZsdXguUm91dGVyLmFyZ3NGcm9tVXJsIiwiaG8uZmx1eC5Sb3V0ZXIuc3RhdGVGcm9tVXJsIiwiaG8uZmx1eC5Sb3V0ZXIudXJsRnJvbVN0YXRlIiwiaG8uZmx1eC5Sb3V0ZXIuZXF1YWxzIiwiaG8uZmx1eC5EaXNwYXRjaGVyIiwiaG8uZmx1eC5EaXNwYXRjaGVyLmNvbnN0cnVjdG9yIiwiaG8uZmx1eC5EaXNwYXRjaGVyLndhaXRGb3IiLCJoby5mbHV4LkRpc3BhdGNoZXIuZGlzcGF0Y2giLCJoby5mbHV4LkRpc3BhdGNoZXIuaW52b2tlQ2FsbGJhY2siLCJoby5mbHV4LkRpc3BhdGNoZXIuc3RhcnREaXNwYXRjaGluZyIsImhvLmZsdXguRGlzcGF0Y2hlci5zdG9wRGlzcGF0Y2hpbmciLCJoby5mbHV4LnJ1biIsImhvLnVpIiwiaG8udWkucnVuIiwiaG8udWkuT3B0aW9ucyIsImhvLnVpLk9wdGlvbnMuY29uc3RydWN0b3IiLCJoby51aS5PcHRpb25zLnByb2Nlc3MiLCJoby51aS5PcHRpb25zLnByb2Nlc3NSb290IiwiaG8udWkuT3B0aW9ucy5wcm9jZXNzUm91dGVyIiwiaG8udWkuT3B0aW9ucy5wcm9jZXNzTWFwIiwiaG8udWkuT3B0aW9ucy5wcm9jZXNzRGlyIiwiaG8udWkuT3B0aW9ucy5wcm9jZXNzTWluIl0sIm1hcHBpbmdzIjoiQUFBQSxJQUFPLEVBQUUsQ0FnTFI7QUFoTEQsV0FBTyxFQUFFO0lBQUNBLElBQUFBLE9BQU9BLENBZ0xoQkE7SUFoTFNBLFdBQUFBLE9BQU9BLEVBQUNBLENBQUNBO1FBRWZDO1lBRUlDLGlCQUFZQSxJQUEyREE7Z0JBYS9EQyxTQUFJQSxHQUFRQSxTQUFTQSxDQUFDQTtnQkFDdEJBLGNBQVNBLEdBQW9CQSxTQUFTQSxDQUFDQTtnQkFDdkNBLGFBQVFBLEdBQW9CQSxTQUFTQSxDQUFDQTtnQkFFdkNBLGFBQVFBLEdBQVlBLEtBQUtBLENBQUNBO2dCQUMxQkEsYUFBUUEsR0FBWUEsS0FBS0EsQ0FBQ0E7Z0JBQzFCQSxTQUFJQSxHQUFZQSxLQUFLQSxDQUFDQTtnQkFFckJBLFFBQUdB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Q0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7NEJBQ2pDQSxHQUFHQSxHQUFHQSxHQUFHQSxDQUFDQSxNQUFNQSxDQUFDQSxDQUFDQSxFQUFFQSxHQUFHQSxDQUFDQSxNQUFNQSxHQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTs0QkFDbENBLElBQUlBLEdBQUdBLE1BQU1BLENBQUNBOzRCQUNDQSxNQUFNQSxHQUFHQSxLQUFLQSxDQUFDQTs0QkFDOUJBLFdBQVdBLEdBQUdBLElBQUlBLENBQUNBOzRCQUNuQkEsTUFBTUEsR0FBR0EsS0FBS0EsQ0FBQ0E7d0JBQ2hCQSxDQUFDQTt3QkFBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0E7NEJBQ1BBLEdBQUdBLEdBQUdBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLElBQUlBLEVBQUVBLENBQUNBOzRCQUNsQkEsSUFBSUEsR0FBR0EsQ0FBQ0EsR0FBR0EsR0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsS0FBS0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7NEJBQ3ZDQSxPQUFPQSxHQUFHQSxHQUFHQSxDQUFDQSxDQUFDQSxDQUFDQSxLQUFLQSxHQUFHQSxDQUFDQTs0QkFDVkEsTUFBTUEsR0FBR0EsSUFBSUEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0E7NEJBQzFDQSxXQUFXQSxHQUFHQSxNQUFNQSxJQUFJQSxHQUFHQSxDQUFDQSxHQUFHQSxDQUFDQSxNQUFNQSxHQUFDQSxDQUFDQSxDQUFDQSxLQUFLQSxHQUFHQSxDQUFDQTs0QkFDbERBLE1BQU1BLEdBQUdBLENBQUNBLENBQUNBLEdBQUdBLENBQUNBLEtBQUtBLENBQUNBLElBQUlBLENBQUNBLENBQUNBLENBQUNBLE1BQU1BLENBQUNBLENBQUNBOzRCQUVwQ0EsRUFBRUEsQ0FBQUEsQ0FBQ0EsV0FBV0EsSUFBSUEsRUFBRUEsQ0FBQ0EsVUFBVUEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsWUFBWUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7Z0NBQ3RFQSxXQUFXQSxHQUFHQSxLQUFLQSxDQUFDQTtnQ0FDcEJBLEdBQUdBLEdBQUdBLEdBQUdBLENBQUNBLE1BQU1BLENBQUNBLENBQUNBLEVBQUVBLEdBQUdBLENBQUNBLE1BQU1BLEdBQUNBLENBQUNBLENBQUNBLEdBQUdBLEdBQUdBLENBQUNBO2dDQUV4Q0EsT0FBT0EsR0FBR0EsSUFBSUEsQ0FBQ0E7NEJBQ2hCQSxDQUFDQTt3QkFDRkEsQ0FBQ0E7d0JBRURBLElBQUlBLEdBQUdBLElBQUlBLENBQUNBLEtBQUtBLENBQUNBLEdBQUdBLENBQUNBLE1BQU1BLEdBQUdBLENBQUNBLElBQUlBLEtBQUtBLE1BQU1BLEdBQUdBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBLENBQUVBLENBQUNBO3dCQUUzREEsRUFBRUEsQ0FBQUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7NEJBQ1pBLEtBQUtBLENBQUNBO3dCQUNQQSxDQUFDQTt3QkFBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0E7NEJBQ1BBLElBQUlBLENBQUNBLFFBQVFBLENBQUNBLElBQUlBLENBQUNBLEVBQUNBLE1BQU1BLEVBQUVBLElBQUlBLEVBQUVBLElBQUlBLEVBQUVBLEdBQUdBLEVBQUVBLElBQUlBLEVBQUVBLElBQUlBLEVBQUVBLE1BQU1BLEVBQUVBLE1BQU1BLEVBQUVBLFdBQVdBLEVBQUVBLFdBQVdBLEVBQUVBLE1BQU1BLEVBQUVBLE1BQU1BLEVBQUVBLFFBQVFBLEVBQUVBLEVBQUVBLEVBQUNBLENBQUNBLENBQUNBOzRCQUVsSUEsRUFBRUEsQ0FBQUEsQ0FBQ0EsQ0FBQ0EsT0FBT0EsSUFBSUEsQ0FBQ0EsV0FBV0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7Z0NBQzdCQSxJQUFJQSxNQUFNQSxHQUFHQSxJQUFJQSxDQUFDQSxLQUFLQSxDQUFDQSxJQUFJQSxFQUFFQSxJQUFJQSxDQUFDQSxRQUFRQSxDQUFDQSxJQUFJQSxDQUFDQSxRQUFRQSxDQUFDQSxNQUFNQSxHQUFDQSxDQUFD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U04sNEJBQVVBLEdBQXBCQTtnQkFDQ087Ozs7a0JBSUVBO1lBQ0hBLENBQUNBO1lBQ0ZQLGNBQUNBO1FBQURBLENBckZBRixBQXFGQ0UsSUFBQUY7SUFFRkEsQ0FBQ0EsRUExSFN0SyxFQUFFQSxHQUFGQSxLQUFFQSxLQUFGQSxLQUFFQSxRQTBIWEE7QUFBREEsQ0FBQ0EsRUExSE0sRUFBRSxLQUFGLEVBQUUsUUEwSFIiLCJmaWxlIjoiaG8tYWxsLmpzIiwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlIGhvLnByb21pc2Uge1xyXG5cclxuICAgIGV4cG9ydCBjbGFzcyBQcm9taXNlPFQsIEU+IHtcclxuXHJcbiAgICAgICAgY29uc3RydWN0b3IoZnVuYz86IChyZXNvbHZlOihhcmc6VCk9PnZvaWQsIHJlamVjdDooYXJnOkUpPT52b2lkKSA9PiBhbnkpIHtcclxuICAgICAgICAgICAgaWYgKHR5cGVvZiBmdW5jID09PSAnZnVuY3Rpb24nKVxyXG4gICAgICAgICAgICAgICAgZnVuYy5jYWxsKFxyXG4gICAgICAgICAgICAgICAgICAgIGFyZ3VtZW50cy5jYWxsZWUsXHJcbiAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24oYXJnOiBUKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5yZXNvbHZlKGFyZylcclxuICAgICAgICAgICAgICAgICAgICB9LmJpbmQodGhpcyksXHJcbiAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24oYXJnOkUpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnJlamVjdChhcmcpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0uYmluZCh0aGlzKVxyXG4gICAgICAgICAgICAgICAgKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByaXZhdGUgZGF0YTogVHxFID0gdW5kZWZpbmVkO1xyXG4gICAgICAgIHByaXZhdGUgb25SZXNvbHZlOiAoYXJnMTpUKSA9PiBhbnkgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgcHJpdmF0ZSBvblJlamVjdDogKGFyZzE6RSkgPT4gYW55ID0gdW5kZWZpbmVkO1xyXG5cclxuICAgICAgICBwdWJsaWMgcmVzb2x2ZWQ6IGJvb2xlYW4gPSBmYWxzZTtcclxuICAgICAgICBwdWJsaWMgcmVqZWN0ZWQ6IGJvb2xlYW4gPSBmYWxzZTtcclxuICAgICAgICBwdWJsaWMgZG9uZTogYm9vbGVhbiA9IGZhbHNlO1xyXG5cclxuICAgICAgICBwcml2YXRlIHJldDogUHJvbWlzZTxULCBFPiA9IHVuZGVmaW5lZDtcclxuXHJcbiAgICAgICAgcHJpdmF0ZSBzZXQoZGF0YT86IFR8RSk6IHZvaWQge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5kb25lKVxyXG4gICAgICAgICAgICAgICAgdGhyb3cgXCJQcm9taXNlIGlzIGFscmVhZHkgcmVzb2x2ZWQgLyByZWplY3RlZFwiO1xyXG4gICAgICAgICAgICB0aGlzLmRhdGEgPSBkYXRhO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHJlc29sdmUoZGF0YT86IFQpOiB2b2lkIHtcclxuICAgICAgICAgICAgdGhpcy5zZXQoZGF0YSk7XHJcbiAgICAgICAgICAgIHRoaXMucmVzb2x2ZWQgPSB0aGlzLmRvbmUgPSB0cnVlO1xyXG4gICAgICAgICAgICBpZiAodHlwZW9mIHRoaXMub25SZXNvbHZlID09PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9yZXNvbHZlKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByaXZhdGUgX3Jlc29sdmUoKTogdm9pZCB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnJldCA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnJldCA9IG5ldyBQcm9taXNlPFQsRT4oKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdmFyIHY6IGFueSA9IHRoaXMub25SZXNvbHZlKDxUPnRoaXMuZGF0YSk7XHJcblxyXG4gICAgICAgICAgICBpZiAodiAmJiB2IGluc3RhbmNlb2YgUHJvbWlzZSkge1xyXG4gICAgICAgICAgICAgICAgdi50aGVuKHRoaXMucmV0LnJlc29sdmUuYmluZCh0aGlzLnJldCksIHRoaXMucmV0LnJlamVjdC5iaW5kKHRoaXMucmV0KSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnJldC5yZXNvbHZlKHYpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgcmVqZWN0KGRhdGE/OiBFKTogdm9pZCB7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0KGRhdGEpO1xyXG4gICAgICAgICAgICB0aGlzLnJlamVjdGVkID0gdGhpcy5kb25lID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgICAgIGlmICh0eXBlb2YgdGhpcy5vblJlamVjdCA9PT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5vblJlamVjdCg8RT50aGlzLmRhdGEpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAodGhpcy5yZXQpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMucmV0LnJlamVjdCg8RT50aGlzLmRhdGEpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIF9yZWplY3QoKTogdm9pZCB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnJldCA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnJldCA9IG5ldyBQcm9taXNlPFQsRT4oKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYodHlwZW9mIHRoaXMub25SZWplY3QgPT09ICdmdW5jdGlvbicpXHJcbiAgICAgICAgICAgICAgICB0aGlzLm9uUmVqZWN0KDxFPnRoaXMuZGF0YSk7XHJcbiAgICAgICAgICAgIHRoaXMucmV0LnJlamVjdCg8RT50aGlzLmRhdGEpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHRoZW4ocmVzOiAoYXJnMTpUKT0+YW55LCByZWo/OiAoYXJnMTpFKT0+YW55KTogUHJvbWlzZTxhbnksYW55PiB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnJldCA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnJldCA9IG5ldyBQcm9taXNlPFQsRT4oKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKHJlcyAmJiB0eXBlb2YgcmVzID09PSAnZnVuY3Rpb24nKVxyXG4gICAgICAgICAgICAgICAgdGhpcy5vblJlc29sdmUgPSByZXM7XHJcblxyXG4gICAgICAgICAgICBpZiAocmVqICYmIHR5cGVvZiByZWogPT09ICdmdW5jdGlvbicpXHJcbiAgICAgICAgICAgICAgICB0aGlzLm9uUmVqZWN0ID0gcmVqO1xyXG5cclxuICAgICAgICAgICAgaWYgKHRoaXMucmVzb2x2ZWQpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3Jlc29sdmUoKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKHRoaXMucmVqZWN0ZWQpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3JlamVjdCgpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5yZXQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgY2F0Y2goY2I6IChhcmcxOkUpPT5hbnkpOiB2b2lkIHtcclxuICAgICAgICAgICAgdGhpcy5vblJlamVjdCA9IGNiO1xyXG5cclxuICAgICAgICAgICAgaWYgKHRoaXMucmVqZWN0ZWQpXHJcbiAgICAgICAgICAgICAgICB0aGlzLl9yZWplY3QoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHN0YXRpYyBhbGwoYXJyOiBBcnJheTxQcm9taXNlPGFueSwgYW55Pj4pOiBQcm9taXNlPGFueSwgYW55PiB7XHJcbiAgICAgICAgICAgIHZhciBwID0gbmV3IFByb21pc2UoKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBkYXRhID0gW107XHJcblxyXG4gICAgICAgICAgICBpZiAoYXJyLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgICAgICAgICAgcC5yZXNvbHZlKCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBhcnIuZm9yRWFjaCgocHJvbSwgaW5kZXgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBwcm9tXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKGQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHAuZG9uZSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFbaW5kZXhdID0gZDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGFsbFJlc29sdmVkID0gYXJyLnJlZHVjZShmdW5jdGlvbihzdGF0ZSwgcDEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBzdGF0ZSAmJiBwMS5yZXNvbHZlZDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSwgdHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChhbGxSZXNvbHZlZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcC5yZXNvbHZlKGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5jYXRjaChmdW5jdGlvbihlcnIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcC5yZWplY3QoZXJyKTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gcDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHN0YXRpYyBjaGFpbihhcnI6IEFycmF5PFByb21pc2U8YW55LCBhbnk+Pik6IFByb21pc2U8YW55LCBhbnk+IHtcclxuICAgICAgICAgICAgdmFyIHA6IFByb21pc2U8YW55LCBhbnk+ID0gbmV3IFByb21pc2UoKTtcclxuICAgICAgICAgICAgdmFyIGRhdGE6IEFycmF5PGFueT4gPSBbXTtcclxuXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIG5leHQoKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAocC5kb25lKVxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgbjogUHJvbWlzZTxhbnksIGFueT4gPSBhcnIubGVuZ3RoID8gYXJyLnNoaWZ0KCkgOiBwO1xyXG4gICAgICAgICAgICAgICAgbi50aGVuKFxyXG4gICAgICAgICAgICAgICAgICAgIChyZXN1bHQpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YS5wdXNoKHJlc3VsdCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5leHQoKTtcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIChlcnIpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcC5yZWplY3QoZXJyKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgbmV4dCgpO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHA7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzdGF0aWMgY3JlYXRlKG9iajogYW55KTogUHJvbWlzZTxhbnksIGFueT4ge1xyXG4gICAgICAgICAgICBpZiAob2JqIGluc3RhbmNlb2YgUHJvbWlzZSlcclxuICAgICAgICAgICAgICAgIHJldHVybiBvYmo7XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdmFyIHAgPSBuZXcgUHJvbWlzZSgpO1xyXG4gICAgICAgICAgICAgICAgcC5yZXNvbHZlKG9iaik7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbn1cclxuIiwibW9kdWxlIGhvLmNsYXNzbG9hZGVyLnV0aWwge1xuXG5cdGV4cG9ydCBmdW5jdGlvbiBnZXQocGF0aDogc3RyaW5nLCBvYmo6YW55ID0gd2luZG93KTogYW55IHtcblx0XHRwYXRoLnNwbGl0KCcuJykubWFwKHBhcnQgPT4ge1xuXHRcdFx0b2JqID0gb2JqW3BhcnRdO1xuXHRcdH0pXG5cdFx0cmV0dXJuIG9iajtcblx0fVxufVxuIiwibW9kdWxlIGhvLmNsYXNzbG9hZGVyLnV0aWwge1xuXHRleHBvcnQgZnVuY3Rpb24gZXhwb3NlKG5hbWU6c3RyaW5nLCBvYmo6YW55KSB7XG5cdFx0bGV0IHBhdGggPSBuYW1lLnNwbGl0KCcuJyk7XG5cdFx0bmFtZSA9IHBhdGgucG9wKCk7XG5cblx0XHRsZXQgZ2xvYmFsID0gd2luZG93O1xuXG5cdFx0cGF0aC5tYXAocGFydCA9PiB7XG5cdFx0XHRnbG9iYWxbcGFydF0gPSBnbG9iYWxbcGFydF0gfHwge307XG5cdFx0XHRnbG9iYWwgPSBnbG9iYWxbcGFydF07XG5cdFx0fSlcblxuXHRcdGlmKCEhZ2xvYmFsW25hbWVdKVxuXHRcdFx0dGhyb3cgXCJHbG9iYWwgb2JqZWN0IFwiICsgcGF0aC5qb2luKCcuJykgKyBcIi5cIiArIG5hbWUgKyBcIiBhbHJlYWR5IGV4aXN0c1wiO1xuXG5cdFx0Z2xvYmFsW25hbWVdID0gb2JqO1xuXHR9XG59XG4iLCJtb2R1bGUgaG8uY2xhc3Nsb2FkZXIueGhyIHtcblxuXHRleHBvcnQgZnVuY3Rpb24gZ2V0KHVybDogc3RyaW5nKTogaG8ucHJvbWlzZS5Qcm9taXNlPHN0cmluZywgc3RyaW5nPiB7XG5cdFx0cmV0dXJuIG5ldyBoby5wcm9taXNlLlByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuXG4gICAgICAgICAgICAgICAgbGV0IHhtbGh0dHAgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICAgICAgICAgICAgICB4bWxodHRwLm9ucmVhZHlzdGF0ZWNoYW5nZSA9ICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYoeG1saHR0cC5yZWFkeVN0YXRlID09IDQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCByZXNwID0geG1saHR0cC5yZXNwb25zZVRleHQ7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZih4bWxodHRwLnN0YXR1cyA9PSAyMDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKHJlc3ApO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVqZWN0KHJlc3ApO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgIHhtbGh0dHAub3BlbignR0VUJywgdXJsKTtcbiAgICAgICAgICAgICAgICB4bWxodHRwLnNlbmQoKTtcbiAgICAgICAgICAgIH0pO1xuXHR9XG59XG4iLCJtb2R1bGUgaG8uY2xhc3Nsb2FkZXIge1xuXG5cdGV4cG9ydCB0eXBlIGNsYXp6ID0gRnVuY3Rpb247XG5cdGV4cG9ydCB0eXBlIFByb21pc2VPZkNsYXNzZXMgPSBoby5wcm9taXNlLlByb21pc2U8Y2xhenpbXSwgYW55PjtcblxufVxuIiwibW9kdWxlIGhvLmNsYXNzbG9hZGVyIHtcblxuXHRleHBvcnQgaW50ZXJmYWNlIElMb2FkQXJndW1lbnRzIHtcblx0XHRuYW1lPzogc3RyaW5nO1xuXHRcdHVybD86IHN0cmluZztcblx0XHRwYXJlbnQ/OiBib29sZWFuO1xuXHRcdGV4cG9zZT86IGJvb2xlYW47XG5cdFx0c3VwZXI/OiBBcnJheTxzdHJpbmc+O1xuXHR9XG5cblx0ZXhwb3J0IGNsYXNzIExvYWRBcmd1bWVudHMgaW1wbGVtZW50cyBJTG9hZEFyZ3VtZW50cyB7XG5cblx0XHRuYW1lOiBzdHJpbmc7XG5cdFx0dXJsOiBzdHJpbmc7XG5cdFx0cGFyZW50OiBib29sZWFuO1xuXHRcdGV4cG9zZTogYm9vbGVhbjtcblx0XHRzdXBlcjogQXJyYXk8c3RyaW5nPjtcblxuXHRcdGNvbnN0cnVjdG9yKGFyZzogSUxvYWRBcmd1bWVudHMsIHJlc29sdmVVcmw6IChuYW1lOnN0cmluZyk9PnN0cmluZykge1xuXHRcdFx0dGhpcy5uYW1lID0gYXJnLm5hbWU7XG5cdFx0XHR0aGlzLnVybCA9IGFyZy51cmwgfHwgcmVzb2x2ZVVybChhcmcubmFtZSk7XG5cdFx0XHR0aGlzLnBhcmVudCA9IGFyZy5wYXJlbnQgfHwgdHJ1ZTtcblx0XHRcdHRoaXMuZXhwb3NlID0gYXJnLmV4cG9zZSB8fCB0cnVlO1xuXHRcdFx0dGhpcy5zdXBlciA9IGFyZy5zdXBlcjtcblx0XHR9XG5cblx0fVxuXG59XG4iLCJtb2R1bGUgaG8uY2xhc3Nsb2FkZXIge1xuXG5cdGV4cG9ydCBpbnRlcmZhY2UgSUxvYWRlckNvbmZpZyB7XG5cdFx0bG9hZFR5cGU/OiBMb2FkVHlwZTtcblx0XHR1cmxUZW1wbGF0ZT86IHN0cmluZztcblx0XHR1c2VEaXI/OiBib29sZWFuO1xuXHRcdHVzZU1pbj86IGJvb2xlYW47XG5cdFx0Ly9leGlzdHM/OiAobmFtZTogc3RyaW5nKT0+Ym9vbGVhbjtcblx0XHRjYWNoZT86IGJvb2xlYW47XG5cdH1cblxuXHRleHBvcnQgY2xhc3MgTG9hZGVyQ29uZmlnIGltcGxlbWVudHMgSUxvYWRlckNvbmZpZyB7XG5cblx0XHRsb2FkVHlwZTogTG9hZFR5cGU7XG5cdFx0dXJsVGVtcGxhdGU6IHN0cmluZztcblx0XHR1c2VEaXI6IGJvb2xlYW47XG5cdFx0dXNlTWluOiBib29sZWFuO1xuXHRcdC8vZXhpc3RzOiAobmFtZTogc3RyaW5nKT0+Ym9vbGVhbjtcblx0XHRjYWNoZTogYm9vbGVhbjtcblxuXHRcdGNvbnN0cnVjdG9yKGM6IElMb2FkZXJDb25maWcgPSA8SUxvYWRlckNvbmZpZz57fSkge1xuXHRcdFx0dGhpcy5sb2FkVHlwZSA9IGMubG9hZFR5cGUgfHwgTG9hZFR5cGUuRVZBTDtcblx0XHRcdHRoaXMudXJsVGVtcGxhdGUgPSBjLnVybFRlbXBsYXRlIHx8IFwiJHtuYW1lfS5qc1wiXG5cdFx0XHR0aGlzLnVzZURpciA9IHR5cGVvZiBjLnVzZURpciA9PT0gJ2Jvb2xlYW4nID8gYy51c2VEaXIgOiB0cnVlO1xuXHRcdFx0dGhpcy51c2VNaW4gPSB0eXBlb2YgYy51c2VNaW4gPT09ICdib29sZWFuJyA/IGMudXNlTWluIDogZmFsc2U7XG5cdFx0XHQvL3RoaXMuZXhpc3RzID0gYy5leGlzdHMgfHwgdGhpcy5leGlzdHMuYmluZCh0aGlzKTtcblx0XHRcdHRoaXMuY2FjaGUgPSB0eXBlb2YgYy5jYWNoZSA9PT0gJ2Jvb2xlYW4nID8gYy5jYWNoZSA6IHRydWU7XG5cdFx0fVxuXG5cdH1cblxufVxuIiwibW9kdWxlIGhvLmNsYXNzbG9hZGVyIHtcblxuXHRleHBvcnQgZW51bSBMb2FkVHlwZSB7XG5cdFx0U0NSSVBULFxuXHRcdEZVTkNUSU9OLFxuXHRcdEVWQUxcblx0fVxuXHRcbn1cbiIsIm1vZHVsZSBoby5jbGFzc2xvYWRlciB7XG5cblx0ZXhwb3J0IGxldCBtYXBwaW5nOiB7W2tleTpzdHJpbmddOiBzdHJpbmd9ID0ge31cblxuXHRleHBvcnQgY2xhc3MgQ2xhc3NMb2FkZXIge1xuXG5cdFx0cHJpdmF0ZSBjb25mOiBJTG9hZGVyQ29uZmlnID0gPElMb2FkZXJDb25maWc+e307XG5cdFx0cHJpdmF0ZSBjYWNoZToge1trZXk6c3RyaW5nXTogRnVuY3Rpb259ID0ge31cblxuXHRcdGNvbnN0cnVjdG9yKGM/OiBJTG9hZGVyQ29uZmlnKSB7XG5cdFx0XHR0aGlzLmNvbmYgPSBuZXcgTG9hZGVyQ29uZmlnKGMpO1xuXHRcdH1cblxuXHRcdGNvbmZpZyhjOiBJTG9hZGVyQ29uZmlnKTogdm9pZCB7XG5cdFx0XHR0aGlzLmNvbmYgPSBuZXcgTG9hZGVyQ29uZmlnKGMpO1xuXHRcdH1cblxuXHRcdGxvYWQoYXJnOiBJTG9hZEFyZ3VtZW50cykge1xuXHRcdFx0YXJnID0gbmV3IExvYWRBcmd1bWVudHMoYXJnLCB0aGlzLnJlc29sdmVVcmwuYmluZCh0aGlzKSk7XG5cblx0XHRcdHN3aXRjaCh0aGlzLmNvbmYubG9hZFR5cGUpIHtcblx0XHRcdFx0Y2FzZSBMb2FkVHlwZS5TQ1JJUFQ6XG5cdFx0XHRcdFx0cmV0dXJuIHRoaXMubG9hZF9zY3JpcHQoYXJnKTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSBMb2FkVHlwZS5GVU5DVElPTjpcblx0XHRcdFx0XHRyZXR1cm4gdGhpcy5sb2FkX2Z1bmN0aW9uKGFyZyk7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgTG9hZFR5cGUuRVZBTDpcblx0XHRcdFx0XHRyZXR1cm4gdGhpcy5sb2FkX2V2YWwoYXJnKTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdH1cblx0XHR9XG5cblx0XHRwcm90ZWN0ZWQgbG9hZF9zY3JpcHQoYXJnOiBJTG9hZEFyZ3VtZW50cyk6IFByb21pc2VPZkNsYXNzZXMge1xuXHRcdFx0bGV0IHNlbGYgPSB0aGlzO1xuXHRcdFx0bGV0IHBhcmVudHMgPSBbXTtcblx0XHRcdGxldCBwID0gbmV3IGhvLnByb21pc2UuUHJvbWlzZTxjbGF6eltdLCBhbnk+KCk7XG5cblx0XHRcdGlmKHRoaXMuY29uZi5jYWNoZSAmJiAhIXRoaXMuY2FjaGVbYXJnLm5hbWVdKVxuXHRcdFx0XHRyZXR1cm4gaG8ucHJvbWlzZS5Qcm9taXNlLmNyZWF0ZShbdGhpcy5jYWNoZVthcmcubmFtZV1dKTtcblxuXHRcdFx0aWYoISFhcmcucGFyZW50KSB7XG5cdFx0XHRcdHRoaXMuZ2V0UGFyZW50TmFtZShhcmcudXJsKVxuXHRcdFx0XHQudGhlbihwYXJlbnROYW1lID0+IHtcblx0XHRcdFx0XHQvL2lmKGFyZy5zdXBlciA9PT0gcGFyZW50TmFtZSlcblx0XHRcdFx0XHRpZihhcmcuc3VwZXIuaW5kZXhPZihwYXJlbnROYW1lKSAhPT0gLTEpXG5cdFx0XHRcdFx0XHRyZXR1cm4gW107XG5cdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0cmV0dXJuIHNlbGYubG9hZCh7bmFtZTogcGFyZW50TmFtZSwgcGFyZW50OiB0cnVlLCBleHBvc2U6IGFyZy5leHBvc2UsIHN1cGVyOiBhcmcuc3VwZXJ9KVxuXHRcdFx0XHR9KVxuXHRcdFx0XHQudGhlbihwID0+IHtcblx0XHRcdFx0XHRwYXJlbnRzID0gcFxuXHRcdFx0XHRcdHJldHVybiBsb2FkX2ludGVybmFsKCk7XG5cdFx0XHRcdH0pXG5cdFx0XHRcdC50aGVuKGNsYXp6ID0+IHtcblx0XHRcdFx0XHRpZihzZWxmLmNvbmYuY2FjaGUpXG5cdFx0XHRcdFx0XHRzZWxmLmNhY2hlW2FyZy5uYW1lXSA9IGNsYXp6O1xuXHRcdFx0XHRcdHBhcmVudHMgPSBwYXJlbnRzLmNvbmNhdChjbGF6eik7XG5cdFx0XHRcdFx0cC5yZXNvbHZlKHBhcmVudHMpO1xuXHRcdFx0XHR9KVxuXHRcdFx0fVxuXHRcdFx0ZWxzZSB7XG5cdFx0XHRcdGxvYWRfaW50ZXJuYWwoKVxuXHRcdFx0XHQudGhlbihjbGF6eiA9PiB7XG5cdFx0XHRcdFx0cC5yZXNvbHZlKGNsYXp6KTtcblx0XHRcdFx0fSlcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIHA7XG5cblxuXHRcdFx0ZnVuY3Rpb24gbG9hZF9pbnRlcm5hbCgpOiBQcm9taXNlT2ZDbGFzc2VzIHtcblx0XHRcdFx0cmV0dXJuIG5ldyBoby5wcm9taXNlLlByb21pc2U8Y2xhenpbXSwgYW55PigocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG5cdFx0XHRcdFx0bGV0IHNyYyA9IGFyZy51cmw7XG5cdFx0XHRcdFx0bGV0IHNjcmlwdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NjcmlwdCcpO1xuXHRcdFx0XHRcdHNjcmlwdC5vbmxvYWQgPSBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRcdGlmKHR5cGVvZiB1dGlsLmdldChhcmcubmFtZSkgPT09ICdmdW5jdGlvbicpXG5cdFx0XHRcdFx0XHRcdHJlc29sdmUoW3V0aWwuZ2V0KGFyZy5uYW1lKV0pO1xuXHRcdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0XHRyZWplY3QoYEVycm9yIHdoaWxlIGxvYWRpbmcgQ2xhc3MgJHthcmcubmFtZX1gKVxuXHRcdFx0XHRcdH0uYmluZCh0aGlzKTtcblx0XHRcdFx0XHRzY3JpcHQuc3JjID0gc3JjO1xuXHRcdFx0XHRcdGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdoZWFkJylbMF0uYXBwZW5kQ2hpbGQoc2NyaXB0KTtcblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cblx0XHR9XG5cblx0XHRwcm90ZWN0ZWQgbG9hZF9mdW5jdGlvbihhcmc6IElMb2FkQXJndW1lbnRzKTogUHJvbWlzZU9mQ2xhc3NlcyB7XG5cdFx0XHRsZXQgc2VsZiA9IHRoaXM7XG5cdFx0XHRsZXQgcGFyZW50cyA9IFtdO1xuXHRcdFx0bGV0IHNvdXJjZTtcblxuXHRcdFx0cmV0dXJuIHhoci5nZXQoYXJnLnVybClcblx0XHRcdC50aGVuKHNyYyA9PiB7XG5cdFx0XHRcdHNvdXJjZSA9IHNyYztcblx0XHRcdFx0aWYoISFhcmcucGFyZW50KSB7XG5cdFx0XHRcdFx0bGV0IHBhcmVudE5hbWUgPSBzZWxmLnBhcnNlUGFyZW50RnJvbVNvdXJjZShzcmMpO1xuXHRcdFx0XHRcdC8vaWYoYXJnLnN1cGVyID09PSBwYXJlbnROYW1lKVxuXHRcdFx0XHRcdGlmKGFyZy5zdXBlci5pbmRleE9mKHBhcmVudE5hbWUpICE9PSAtMSlcblx0XHRcdFx0XHRcdHJldHVybiBbXTtcblx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRyZXR1cm4gc2VsZi5sb2FkKHtuYW1lOiBwYXJlbnROYW1lLCBwYXJlbnQ6IHRydWUsIGV4cG9zZTogYXJnLmV4cG9zZSwgc3VwZXI6IGFyZy5zdXBlcn0pO1xuXHRcdFx0XHR9XG5cdFx0XHR9KVxuXHRcdFx0LnRoZW4ocCA9PiB7XG5cdFx0XHRcdHBhcmVudHMgPSBwO1xuXHRcdFx0XHRsZXQgc3JjID0gc291cmNlICsgXCJcXG5yZXR1cm4gXCIgKyBhcmcubmFtZSArIFwiXFxuLy8jIHNvdXJjZVVSTD1cIiArIHdpbmRvdy5sb2NhdGlvbi5ocmVmICsgYXJnLnVybDtcblx0XHRcdFx0bGV0IGNsYXp6ID0gbmV3IEZ1bmN0aW9uKHNyYykoKTtcblx0XHRcdFx0aWYoYXJnLmV4cG9zZSlcblx0XHRcdFx0XHR1dGlsLmV4cG9zZShhcmcubmFtZSwgY2xhenopO1xuXHRcdFx0XHRyZXR1cm4gY2xhenpcblx0XHRcdH0pXG5cdFx0XHQudGhlbihjbGF6eiA9PiB7XG5cdFx0XHRcdGlmKHNlbGYuY29uZi5jYWNoZSlcblx0XHRcdFx0XHRzZWxmLmNhY2hlW2FyZy5uYW1lXSA9IGNsYXp6O1xuXHRcdFx0XHRwYXJlbnRzLnB1c2goY2xhenopO1xuXHRcdFx0XHRyZXR1cm4gcGFyZW50cztcblx0XHRcdH0pXG5cdFx0fVxuXG5cdFx0cHJvdGVjdGVkIGxvYWRfZXZhbChhcmc6IElMb2FkQXJndW1lbnRzKTogUHJvbWlzZU9mQ2xhc3NlcyB7XG5cdFx0XHRsZXQgc2VsZiA9IHRoaXM7XG5cdFx0XHRsZXQgcGFyZW50cyA9IFtdO1xuXHRcdFx0bGV0IHNvdXJjZTtcblxuXHRcdFx0cmV0dXJuIHhoci5nZXQoYXJnLnVybClcblx0XHRcdC50aGVuKHNyYyA9PiB7XG5cdFx0XHRcdHNvdXJjZSA9IHNyYztcblx0XHRcdFx0aWYoISFhcmcucGFyZW50KSB7XG5cdFx0XHRcdFx0bGV0IHBhcmVudE5hbWUgPSBzZWxmLnBhcnNlUGFyZW50RnJvbVNvdXJjZShzcmMpO1xuXHRcdFx0XHRcdC8vaWYoYXJnLnN1cGVyID09PSBwYXJlbnROYW1lKVxuXHRcdFx0XHRcdGlmKGFyZy5zdXBlci5pbmRleE9mKHBhcmVudE5hbWUpICE9PSAtMSlcblx0XHRcdFx0XHRcdHJldHVybiBbXTtcblx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRyZXR1cm4gc2VsZi5sb2FkKHtuYW1lOiBwYXJlbnROYW1lLCBwYXJlbnQ6IHRydWUsIGV4cG9zZTogYXJnLmV4cG9zZSwgc3VwZXI6IGFyZy5zdXBlcn0pO1xuXHRcdFx0XHR9XG5cdFx0XHR9KVxuXHRcdFx0LnRoZW4ocCA9PiB7XG5cdFx0XHRcdHBhcmVudHMgPSBwO1xuXHRcdFx0XHRsZXQgcmV0ID0gXCJcXG4oZnVuY3Rpb24oKXtyZXR1cm4gXCIgKyBhcmcubmFtZSArIFwiO30pKCk7XCI7XG5cdFx0XHRcdGxldCBzcmMgPSBzb3VyY2UgKyByZXQgKyBcIlxcbi8vIyBzb3VyY2VVUkw9XCIgKyB3aW5kb3cubG9jYXRpb24uaHJlZiArIGFyZy51cmw7XG5cdFx0XHRcdGxldCBjbGF6eiA9IGV2YWwoc3JjKTtcblx0XHRcdFx0aWYoYXJnLmV4cG9zZSlcblx0XHRcdFx0XHR1dGlsLmV4cG9zZShhcmcubmFtZSwgY2xhenopO1xuXHRcdFx0XHRyZXR1cm4gY2xheno7XG5cdFx0XHR9KVxuXHRcdFx0LnRoZW4oY2xhenogPT4ge1xuXHRcdFx0XHRpZihzZWxmLmNvbmYuY2FjaGUpXG5cdFx0XHRcdFx0c2VsZi5jYWNoZVthcmcubmFtZV0gPSBjbGF6ejtcblx0XHRcdFx0cGFyZW50cy5wdXNoKGNsYXp6KTtcblx0XHRcdFx0cmV0dXJuIHBhcmVudHM7XG5cdFx0XHR9KVxuXHRcdH1cblxuXHRcdHByb3RlY3RlZCBnZXRQYXJlbnROYW1lKHVybDogc3RyaW5nKTogaG8ucHJvbWlzZS5Qcm9taXNlPHN0cmluZywgYW55PiB7XG5cdFx0XHRsZXQgc2VsZiA9IHRoaXM7XG5cblx0XHRcdHJldHVyblx0eGhyLmdldCh1cmwpXG5cdFx0XHRcdC50aGVuKHNyYyA9PiB7XG5cdFx0XHRcdFx0cmV0dXJuIHNlbGYucGFyc2VQYXJlbnRGcm9tU291cmNlKHNyYyk7XG5cdFx0XHRcdH0pXG5cdFx0fVxuXG5cdFx0cHJvdGVjdGVkIHBhcnNlUGFyZW50RnJvbVNvdXJjZShzcmM6IHN0cmluZyk6IHN0cmluZyB7XG5cdFx0XHRsZXQgcl9zdXBlciA9IC99XFwpXFwoKC4qKVxcKTsvO1xuXHRcdFx0bGV0IG1hdGNoID0gc3JjLm1hdGNoKHJfc3VwZXIpO1xuXHRcdFx0aWYobWF0Y2gpXG5cdFx0XHRcdHJldHVybiBtYXRjaFsxXTtcblx0XHRcdGVsc2Vcblx0XHRcdFx0cmV0dXJuIHVuZGVmaW5lZDtcblx0XHR9XG5cblx0XHRwdWJsaWMgcmVzb2x2ZVVybChuYW1lOiBzdHJpbmcpOiBzdHJpbmcge1xuXHRcdFx0aWYoISFtYXBwaW5nW25hbWVdKVxuICAgICAgICAgICAgICAgIHJldHVybiBtYXBwaW5nW25hbWVdO1xuXG5cdFx0XHRpZih0aGlzLmNvbmYudXNlRGlyKSB7XG4gICAgICAgICAgICAgICAgbmFtZSArPSAnLicgKyBuYW1lLnNwbGl0KCcuJykucG9wKCk7XG4gICAgICAgICAgICB9XG5cblx0XHRcdG5hbWUgPSBuYW1lLnNwbGl0KCcuJykuam9pbignLycpO1xuXG5cdFx0XHRpZih0aGlzLmNvbmYudXNlTWluKVxuICAgICAgICAgICAgICAgIG5hbWUgKz0gJy5taW4nXG5cblx0XHRcdHJldHVybiB0aGlzLmNvbmYudXJsVGVtcGxhdGUucmVwbGFjZSgnJHtuYW1lfScsIG5hbWUpO1xuXHRcdH1cblxuXHRcdHByb3RlY3RlZCBleGlzdHMobmFtZTogc3RyaW5nKTogYm9vbGVhbiB7XG5cdFx0XHRyZXR1cm4gISF0aGlzLmNhY2hlW25hbWVdO1xuXHRcdH1cblx0fVxufVxuIiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uLy4uLy4uL2Jvd2VyX2NvbXBvbmVudHMvaG8tcHJvbWlzZS9kaXN0L3Byb21pc2UuZC50c1wiLz5cblxubW9kdWxlIGhvLmNsYXNzbG9hZGVyIHtcblxuXHRsZXQgbG9hZGVyID0gbmV3IENsYXNzTG9hZGVyKCk7XG5cblx0ZXhwb3J0IGZ1bmN0aW9uIGNvbmZpZyhjOiBJTG9hZGVyQ29uZmlnKTogdm9pZCB7XG5cdFx0bG9hZGVyLmNvbmZpZyhjKTtcblx0fTtcblxuXHRleHBvcnQgZnVuY3Rpb24gbG9hZChhcmc6IElMb2FkQXJndW1lbnRzKTogUHJvbWlzZU9mQ2xhc3NlcyB7XG5cdFx0cmV0dXJuIGxvYWRlci5sb2FkKGFyZyk7XG5cdH07XG5cblxufVxuIiwiaW50ZXJmYWNlIFdpbmRvdyB7XG5cdHdlYmtpdFJlcXVlc3RBbmltYXRpb25GcmFtZTogKGNhbGxiYWNrOiBGcmFtZVJlcXVlc3RDYWxsYmFjaykgPT4gbnVtYmVyO1xuXHRtb3pSZXF1ZXN0QW5pbWF0aW9uRnJhbWU6IChjYWxsYmFjazogRnJhbWVSZXF1ZXN0Q2FsbGJhY2spID0+IG51bWJlcjtcblx0b1JlcXVlc3RBbmltYXRpb25GcmFtZTogKGNhbGxiYWNrOiBGcmFtZVJlcXVlc3RDYWxsYmFjaykgPT4gbnVtYmVyO1xufVxuXG5tb2R1bGUgaG8ud2F0Y2gge1xuXG5cdGV4cG9ydCB0eXBlIEhhbmRsZXIgPSAob2JqOmFueSwgbmFtZTpzdHJpbmcsIG9sZFY6YW55LCBuZXdWOmFueSwgIHRpbWVzdGFtcD86IG51bWJlcik9PmFueTtcblxuXHRleHBvcnQgZnVuY3Rpb24gd2F0Y2gob2JqOiBhbnksIG5hbWU6IHN0cmluZywgaGFuZGxlcjogSGFuZGxlcik6IHZvaWQge1xuXHRcdG5ldyBXYXRjaGVyKG9iaiwgbmFtZSwgaGFuZGxlcik7XG5cdH1cblxuXHRjbGFzcyBXYXRjaGVyIHtcblxuXHRcdHByaXZhdGUgb2xkVmFsOmFueTtcblxuXHRcdGNvbnN0cnVjdG9yKHByaXZhdGUgb2JqOiBhbnksIHByaXZhdGUgbmFtZTogc3RyaW5nLCBwcml2YXRlIGhhbmRsZXI6IEhhbmRsZXIpIHtcblx0XHRcdHRoaXMub2xkVmFsID0gdGhpcy5jb3B5KG9ialtuYW1lXSk7XG5cblx0XHRcdHRoaXMud2F0Y2godGltZXN0YW1wID0+IHtcblx0XHRcdFx0aWYodGhpcy5vbGRWYWwgIT09IG9ialtuYW1lXSkge1xuXHRcdFx0XHRcdHRoaXMuaGFuZGxlci5jYWxsKG51bGwsIG9iaiwgbmFtZSwgdGhpcy5vbGRWYWwsIG9ialtuYW1lXSwgdGltZXN0YW1wKTtcblx0XHRcdFx0XHR0aGlzLm9sZFZhbCA9IHRoaXMuY29weShvYmpbbmFtZV0pO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHR9XG5cblx0XHRwcml2YXRlIHdhdGNoKGNiOiAodGltZVN0YW1wOm51bWJlcik9PmFueSk6IHZvaWQge1xuXHRcdFx0bGV0IGZuOiBGdW5jdGlvbiA9XG5cdFx0XHR3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lICAgICAgIHx8XG5cdCAgXHRcdHdpbmRvdy53ZWJraXRSZXF1ZXN0QW5pbWF0aW9uRnJhbWUgfHxcblx0ICBcdFx0d2luZG93Lm1velJlcXVlc3RBbmltYXRpb25GcmFtZSAgICB8fFxuXHQgIFx0XHR3aW5kb3cub1JlcXVlc3RBbmltYXRpb25GcmFtZSAgICAgIHx8XG5cdCAgXHRcdHdpbmRvdy5tc1JlcXVlc3RBbmltYXRpb25GcmFtZSAgICAgfHxcblx0ICBcdFx0ZnVuY3Rpb24oY2FsbGJhY2s6IEZ1bmN0aW9uKXtcblx0XHRcdFx0d2luZG93LnNldFRpbWVvdXQoY2FsbGJhY2ssIDEwMDAgLyA2MCk7XG5cdCAgXHRcdH07XG5cblx0XHRcdGxldCB3cmFwID0gKHRzOiBudW1iZXIpID0+IHtcblx0XHRcdFx0Y2IodHMpO1xuXHRcdFx0XHRmbih3cmFwKTtcblx0XHRcdH1cblxuXHRcdFx0Zm4od3JhcCk7XG5cdFx0fVxuXG5cdFx0cHJpdmF0ZSBjb3B5KHZhbDogYW55KTogYW55IHtcblx0XHRcdHJldHVybiBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KHZhbCkpO1xuXHRcdH1cblx0fVxuXG59XG4iLCJtb2R1bGUgaG8uY29tcG9uZW50cy50ZW1wIHtcblx0XHR2YXIgYzogbnVtYmVyID0gLTE7XG5cdFx0dmFyIGRhdGE6IGFueVtdID0gW107XG5cblx0XHRleHBvcnQgZnVuY3Rpb24gc2V0KGQ6IGFueSk6IG51bWJlciB7XG5cdFx0XHRjKys7XG5cdFx0XHRkYXRhW2NdID0gZDtcblx0XHRcdHJldHVybiBjO1xuXHRcdH1cblxuXHRcdGV4cG9ydCBmdW5jdGlvbiBnZXQoaTogbnVtYmVyKTogYW55IHtcblx0XHRcdHJldHVybiBkYXRhW2ldO1xuXHRcdH1cblxuXHRcdGV4cG9ydCBmdW5jdGlvbiBjYWxsKGk6IG51bWJlciwgLi4uYXJncyk6IHZvaWQge1xuXHRcdFx0ZGF0YVtpXSguLi5hcmdzKTtcblx0XHR9XG59XG4iLCJtb2R1bGUgaG8uY29tcG9uZW50cy5zdHlsZXIge1xuXG5cdGV4cG9ydCBpbnRlcmZhY2UgSVN0eWxlciB7XG5cdFx0YXBwbHlTdHlsZShjb21wb25lbnQ6IENvbXBvbmVudCwgY3NzPzogc3RyaW5nKTogdm9pZFxuXHR9XG5cblx0aW50ZXJmYWNlIFN0eWxlQmxvY2sge1xuXHRcdHNlbGVjdG9yOiBzdHJpbmc7XG5cdFx0cnVsZXM6IEFycmF5PFN0eWxlUnVsZT47XG5cdH1cblxuXHRpbnRlcmZhY2UgU3R5bGVSdWxlIHtcblx0XHRwcm9wZXJ0eTogc3RyaW5nO1xuXHRcdHZhbHVlOiBzdHJpbmc7XG5cdH1cblxuXHRjbGFzcyBTdHlsZXIgaW1wbGVtZW50cyBJU3R5bGVyIHtcblx0XHRwdWJsaWMgYXBwbHlTdHlsZShjb21wb25lbnQ6IENvbXBvbmVudCwgY3NzID0gY29tcG9uZW50LnN0eWxlKTogdm9pZCB7XG5cdFx0XHRsZXQgc3R5bGUgPSB0aGlzLnBhcnNlU3R5bGUoY29tcG9uZW50LnN0eWxlKTtcblx0XHRcdHN0eWxlLmZvckVhY2gocyA9PiB7XG5cdFx0XHRcdHRoaXMuYXBwbHlTdHlsZUJsb2NrKGNvbXBvbmVudCwgcyk7XG5cdFx0XHR9KTtcblx0XHR9XG5cblx0XHRwcm90ZWN0ZWQgYXBwbHlTdHlsZUJsb2NrKGNvbXBvbmVudDogQ29tcG9uZW50LCBzdHlsZTogU3R5bGVCbG9jayk6IHZvaWQge1xuXHRcdFx0aWYoc3R5bGUuc2VsZWN0b3IudHJpbSgpLnRvTG93ZXJDYXNlKCkgPT09ICd0aGlzJykge1xuXHRcdFx0XHRzdHlsZS5ydWxlcy5mb3JFYWNoKHIgPT4ge1xuXHRcdFx0XHRcdHRoaXMuYXBwbHlSdWxlKGNvbXBvbmVudC5lbGVtZW50LCByKTtcblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0XHRlbHNlIHtcblx0XHRcdFx0QXJyYXkucHJvdG90eXBlLmZvckVhY2guY2FsbChjb21wb25lbnQuZWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKHN0eWxlLnNlbGVjdG9yKSwgZWwgPT4ge1xuXHRcdFx0XHRcdHN0eWxlLnJ1bGVzLmZvckVhY2gociA9PiB7XG5cdFx0XHRcdFx0XHR0aGlzLmFwcGx5UnVsZShlbCwgcik7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHByb3RlY3RlZCBhcHBseVJ1bGUoZWxlbWVudDogSFRNTEVsZW1lbnQsIHJ1bGU6IFN0eWxlUnVsZSk6IHZvaWQge1xuXHRcdFx0bGV0IHByb3AgPSBydWxlLnByb3BlcnR5LnJlcGxhY2UoLy0oXFx3KS9nLCAoXywgbGV0dGVyOiBzdHJpbmcpID0+IHtcblx0XHRcdFx0cmV0dXJuIGxldHRlci50b1VwcGVyQ2FzZSgpO1xuXHRcdFx0fSkudHJpbSgpO1xuXHRcdFx0ZWxlbWVudC5zdHlsZVtwcm9wXSA9IHJ1bGUudmFsdWU7XG5cdFx0fVxuXG5cdFx0cHJvdGVjdGVkIHBhcnNlU3R5bGUoY3NzOiBzdHJpbmcpOiBBcnJheTxTdHlsZUJsb2NrPiB7XG5cdFx0XHRsZXQgciA9IC8oLis/KVxccyp7KC4qPyl9L2dtO1xuXHRcdFx0bGV0IHIyID0gLyguKz8pXFxzPzooLis/KTsvZ207XG5cdFx0XHRjc3MgPSBjc3MucmVwbGFjZSgvXFxuL2csICcnKTtcblx0XHRcdGxldCBibG9ja3M6IFN0eWxlQmxvY2tbXSA9ICg8c3RyaW5nW10+Y3NzLm1hdGNoKHIpIHx8IFtdKVxuXHRcdFx0XHQubWFwKGIgPT4ge1xuXHRcdFx0XHRcdGlmKCFiLm1hdGNoKHIpKVxuXHRcdFx0XHRcdFx0cmV0dXJuIG51bGw7XG5cblx0XHRcdFx0XHRsZXQgW18sIHNlbGVjdG9yLCBfcnVsZXNdID0gci5leGVjKGIpO1xuXHRcdFx0XHRcdGxldCBydWxlczogU3R5bGVSdWxlW10gPSAoPHN0cmluZ1tdPl9ydWxlcy5tYXRjaChyMikgfHwgW10pXG5cdFx0XHRcdFx0XHQubWFwKHIgPT4ge1xuXHRcdFx0XHRcdFx0XHRpZighci5tYXRjaChyMikpXG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuIG51bGw7XG5cblx0XHRcdFx0XHRcdFx0bGV0IFtfLCBwcm9wZXJ0eSwgdmFsdWVdID0gcjIuZXhlYyhyKTtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIHtwcm9wZXJ0eSwgdmFsdWV9O1xuXHRcdFx0XHRcdFx0fSlcblx0XHRcdFx0XHRcdC5maWx0ZXIociA9PiB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiByICE9PSBudWxsO1xuXHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0cmV0dXJuIHtzZWxlY3RvciwgcnVsZXN9O1xuXHRcdFx0XHR9KVxuXHRcdFx0XHQuZmlsdGVyKGIgPT4ge1xuXHRcdFx0XHRcdHJldHVybiBiICE9PSBudWxsO1xuXHRcdFx0XHR9KTtcblxuXG5cdFx0XHRyZXR1cm4gYmxvY2tzO1xuXHRcdH1cblx0fVxuXG5cdGV4cG9ydCBsZXQgaW5zdGFuY2U6IElTdHlsZXIgPSBuZXcgU3R5bGVyKCk7XG59XG4iLCJtb2R1bGUgaG8uY29tcG9uZW50cy5yZW5kZXJlciB7XG5cbiAgICBpbnRlcmZhY2UgTm9kZUh0bWwge1xuICAgICAgICByb290OiBOb2RlO1xuICAgICAgICBodG1sOiBzdHJpbmc7XG4gICAgfVxuXG4gICAgY2xhc3MgTm9kZSB7XG4gICAgICAgIGh0bWw6IHN0cmluZztcbiAgICAgICAgcGFyZW50OiBOb2RlO1xuICAgICAgICBjaGlsZHJlbjogQXJyYXk8Tm9kZT4gPSBbXTtcbiAgICAgICAgdHlwZTogc3RyaW5nO1xuICAgICAgICBzZWxmQ2xvc2luZzogYm9vbGVhbjtcbiAgICAgICAgaXNWb2lkOiBib29sZWFuO1xuICAgICAgICByZXBlYXQ6IGJvb2xlYW47XG4gICAgfVxuXG4gICAgZXhwb3J0IGNsYXNzIFJlbmRlcmVyIHtcblxuICAgICAgICBwcml2YXRlIHI6IGFueSA9IHtcblx0XHRcdHRhZzogLzwoW14+XSo/KD86KD86KCd8XCIpW14nXCJdKj9cXDIpW14+XSo/KSopPi8sXG5cdFx0XHRyZXBlYXQ6IC9yZXBlYXQ9W1wifCddLitbXCJ8J10vLFxuXHRcdFx0dHlwZTogL1tcXHN8L10qKC4qPylbXFxzfFxcL3w+XS8sXG5cdFx0XHR0ZXh0OiAvKD86LnxbXFxyXFxuXSkqP1teXCInXFxcXF08L20sXG5cdFx0fTtcblxuICAgICAgICBwcml2YXRlIHZvaWRzID0gW1wiYXJlYVwiLCBcImJhc2VcIiwgXCJiclwiLCBcImNvbFwiLCBcImNvbW1hbmRcIiwgXCJlbWJlZFwiLCBcImhyXCIsIFwiaW1nXCIsIFwiaW5wdXRcIiwgXCJrZXlnZW5cIiwgXCJsaW5rXCIsIFwibWV0YVwiLCBcInBhcmFtXCIsIFwic291cmNlXCIsIFwidHJhY2tcIiwgXCJ3YnJcIl07XG5cbiAgICAgICAgcHJpdmF0ZSBjYWNoZToge1trZXk6c3RyaW5nXTpOb2RlfSA9IHt9O1xuXG4gICAgICAgIHB1YmxpYyByZW5kZXIoY29tcG9uZW50OiBDb21wb25lbnQpOiB2b2lkIHtcbiAgICAgICAgICAgIGlmKHR5cGVvZiBjb21wb25lbnQuaHRtbCA9PT0gJ2Jvb2xlYW4nICYmICFjb21wb25lbnQuaHRtbClcbiAgICAgICAgICAgICAgICByZXR1cm47XG5cbiAgICAgICAgICAgIGxldCBuYW1lID0gY29tcG9uZW50Lm5hbWU7XG4gICAgICAgICAgICBsZXQgcm9vdCA9IHRoaXMuY2FjaGVbbmFtZV0gPSB0aGlzLmNhY2hlW25hbWVdIHx8IHRoaXMucGFyc2UoY29tcG9uZW50Lmh0bWwpLnJvb3Q7XG4gICAgICAgICAgICByb290ID0gdGhpcy5yZW5kZXJSZXBlYXQodGhpcy5jb3B5Tm9kZShyb290KSwgY29tcG9uZW50KTtcblxuICAgICAgICAgICAgbGV0IGh0bWwgPSB0aGlzLmRvbVRvU3RyaW5nKHJvb3QsIC0xKTtcblxuICAgICAgICAgICAgY29tcG9uZW50LmVsZW1lbnQuaW5uZXJIVE1MID0gaHRtbDtcblxuICAgICAgICB9XG5cblxuXHRcdHByaXZhdGUgcGFyc2UoaHRtbDogc3RyaW5nLCByb290PSBuZXcgTm9kZSgpKTogTm9kZUh0bWwge1xuXG5cdFx0XHR2YXIgbTtcblx0XHRcdHdoaWxlKChtID0gdGhpcy5yLnRhZy5leGVjKGh0bWwpKSAhPT0gbnVsbCkge1xuXHRcdFx0XHR2YXIgdGFnLCB0eXBlLCBjbG9zaW5nLCBpc1ZvaWQsIHNlbGZDbG9zaW5nLCByZXBlYXQsIHVuQ2xvc2U7XG5cdFx0XHRcdC8vLS0tLS0tLSBmb3VuZCBzb21lIHRleHQgYmVmb3JlIG5leHQgdGFnXG5cdFx0XHRcdGlmKG0uaW5kZXggIT09IDApIHtcblx0XHRcdFx0XHR0YWcgPSBodG1sLm1hdGNoKHRoaXMuci50ZXh0KVswXTtcblx0XHRcdFx0XHR0YWcgPSB0YWcuc3Vic3RyKDAsIHRhZy5sZW5ndGgtMSk7XG5cdFx0XHRcdFx0dHlwZSA9ICdURVhUJztcbiAgICAgICAgICAgICAgICAgICAgaXNWb2lkID0gZmFsc2U7XG5cdFx0XHRcdFx0c2VsZkNsb3NpbmcgPSB0cnVlO1xuXHRcdFx0XHRcdHJlcGVhdCA9IGZhbHNlO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHRhZyA9IG1bMV0udHJpbSgpO1xuXHRcdFx0XHRcdHR5cGUgPSAodGFnKyc+JykubWF0Y2godGhpcy5yLnR5cGUpWzFdO1xuXHRcdFx0XHRcdGNsb3NpbmcgPSB0YWdbMF0gPT09ICcvJztcbiAgICAgICAgICAgICAgICAgICAgaXNWb2lkID0gdGhpcy5pc1ZvaWQodHlwZSk7XG5cdFx0XHRcdFx0c2VsZkNsb3NpbmcgPSBpc1ZvaWQgfHwgdGFnW3RhZy5sZW5ndGgtMV0gPT09ICcvJztcblx0XHRcdFx0XHRyZXBlYXQgPSAhIXRhZy5tYXRjaCh0aGlzLnIucmVwZWF0KTtcblxuXHRcdFx0XHRcdGlmKHNlbGZDbG9zaW5nICYmIGhvLmNvbXBvbmVudHMucmVnaXN0cnkuaW5zdGFuY2UuaGFzQ29tcG9uZW50KHR5cGUpKSB7XG5cdFx0XHRcdFx0XHRzZWxmQ2xvc2luZyA9IGZhbHNlO1xuXHRcdFx0XHRcdFx0dGFnID0gdGFnLnN1YnN0cigwLCB0YWcubGVuZ3RoLTEpICsgXCIgXCI7XG5cblx0XHRcdFx0XHRcdHVuQ2xvc2UgPSB0cnVlO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXG5cdFx0XHRcdGh0bWwgPSBodG1sLnNsaWNlKHRhZy5sZW5ndGggKyAodHlwZSA9PT0gJ1RFWFQnID8gMCA6IDIpICk7XG5cblx0XHRcdFx0aWYoY2xvc2luZykge1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHJvb3QuY2hpbGRyZW4ucHVzaCh7cGFyZW50OiByb290LCBodG1sOiB0YWcsIHR5cGU6IHR5cGUsIGlzVm9pZDogaXNWb2lkLCBzZWxmQ2xvc2luZzogc2VsZkNsb3NpbmcsIHJlcGVhdDogcmVwZWF0LCBjaGlsZHJlbjogW119KTtcblxuXHRcdFx0XHRcdGlmKCF1bkNsb3NlICYmICFzZWxmQ2xvc2luZykge1xuXHRcdFx0XHRcdFx0dmFyIHJlc3VsdCA9IHRoaXMucGFyc2UoaHRtbCwgcm9vdC5jaGlsZHJlbltyb290LmNoaWxkcmVuLmxlbmd0aC0xXSk7XG5cdFx0XHRcdFx0XHRodG1sID0gcmVzdWx0Lmh0bWw7XG5cdFx0XHRcdFx0XHRyb290LmNoaWxkcmVuLnBvcCgpO1xuXHRcdFx0XHRcdFx0cm9vdC5jaGlsZHJlbi5wdXNoKHJlc3VsdC5yb290KTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRtID0gaHRtbC5tYXRjaCh0aGlzLnIudGFnKTtcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIHtyb290OiByb290LCBodG1sOiBodG1sfTtcblx0XHR9XG5cblx0XHRwcml2YXRlIHJlbmRlclJlcGVhdChyb290LCBtb2RlbHMpOiBOb2RlIHtcblx0XHRcdG1vZGVscyA9IFtdLmNvbmNhdChtb2RlbHMpO1xuXG5cdFx0XHRmb3IodmFyIGMgPSAwOyBjIDwgcm9vdC5jaGlsZHJlbi5sZW5ndGg7IGMrKykge1xuXHRcdFx0XHR2YXIgY2hpbGQgPSByb290LmNoaWxkcmVuW2NdO1xuXHRcdFx0XHRpZihjaGlsZC5yZXBlYXQpIHtcblx0XHRcdFx0XHR2YXIgcmVnZXggPSAvcmVwZWF0PVtcInwnXVxccyooXFxTKylcXHMrYXNcXHMrKFxcUys/KVtcInwnXS87XG5cdFx0XHRcdFx0dmFyIG0gPSBjaGlsZC5odG1sLm1hdGNoKHJlZ2V4KS5zbGljZSgxKTtcblx0XHRcdFx0XHR2YXIgbmFtZSA9IG1bMV07XG5cdFx0XHRcdFx0dmFyIGluZGV4TmFtZTtcblx0XHRcdFx0XHRpZihuYW1lLmluZGV4T2YoJywnKSA+IC0xKSB7XG5cdFx0XHRcdFx0XHR2YXIgbmFtZXMgPSBuYW1lLnNwbGl0KCcsJyk7XG5cdFx0XHRcdFx0XHRuYW1lID0gbmFtZXNbMF0udHJpbSgpO1xuXHRcdFx0XHRcdFx0aW5kZXhOYW1lID0gbmFtZXNbMV0udHJpbSgpO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdHZhciBtb2RlbCA9IHRoaXMuZXZhbHVhdGUobW9kZWxzLCBtWzBdKTtcblxuXHRcdFx0XHRcdHZhciBob2xkZXIgPSBbXTtcblx0XHRcdFx0XHRtb2RlbC5mb3JFYWNoKGZ1bmN0aW9uKHZhbHVlLCBpbmRleCkge1xuXHRcdFx0XHRcdFx0dmFyIG1vZGVsMiA9IHt9O1xuXHRcdFx0XHRcdFx0bW9kZWwyW25hbWVdID0gdmFsdWU7XG5cdFx0XHRcdFx0XHRtb2RlbDJbaW5kZXhOYW1lXSA9IGluZGV4O1xuXG5cdFx0XHRcdFx0XHR2YXIgbW9kZWxzMiA9IFtdLmNvbmNhdChtb2RlbHMpO1xuXHRcdFx0XHRcdFx0bW9kZWxzMi51bnNoaWZ0KG1vZGVsMik7XG5cblx0XHRcdFx0XHRcdHZhciBub2RlID0gdGhpcy5jb3B5Tm9kZShjaGlsZCk7XG5cdFx0XHRcdFx0XHRub2RlLnJlcGVhdCA9IGZhbHNlO1xuXHRcdFx0XHRcdFx0bm9kZS5odG1sID0gbm9kZS5odG1sLnJlcGxhY2UodGhpcy5yLnJlcGVhdCwgJycpO1xuXHRcdFx0XHRcdFx0bm9kZS5odG1sID0gdGhpcy5yZXBsKG5vZGUuaHRtbCwgbW9kZWxzMik7XG5cblx0XHRcdFx0XHRcdG5vZGUgPSB0aGlzLnJlbmRlclJlcGVhdChub2RlLCBtb2RlbHMyKTtcblxuXHRcdFx0XHRcdFx0Ly9yb290LmNoaWxkcmVuLnNwbGljZShyb290LmNoaWxkcmVuLmluZGV4T2YoY2hpbGQpLCAwLCBub2RlKTtcblx0XHRcdFx0XHRcdGhvbGRlci5wdXNoKG5vZGUpO1xuXHRcdFx0XHRcdH0uYmluZCh0aGlzKSk7XG5cblx0XHRcdFx0XHRob2xkZXIuZm9yRWFjaChmdW5jdGlvbihuKSB7XG5cdFx0XHRcdFx0XHRyb290LmNoaWxkcmVuLnNwbGljZShyb290LmNoaWxkcmVuLmluZGV4T2YoY2hpbGQpLCAwLCBuKTtcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRyb290LmNoaWxkcmVuLnNwbGljZShyb290LmNoaWxkcmVuLmluZGV4T2YoY2hpbGQpLCAxKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRjaGlsZC5odG1sID0gdGhpcy5yZXBsKGNoaWxkLmh0bWwsIG1vZGVscyk7XG5cdFx0XHRcdFx0Y2hpbGQgPSB0aGlzLnJlbmRlclJlcGVhdChjaGlsZCwgbW9kZWxzKTtcblx0XHRcdFx0XHRyb290LmNoaWxkcmVuW2NdID0gY2hpbGQ7XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIHJvb3Q7XG5cdFx0fVxuXG5cdFx0cHJpdmF0ZSBkb21Ub1N0cmluZyhyb290OiBOb2RlLCBpbmRlbnQ6IG51bWJlcik6IHN0cmluZyB7XG5cdFx0XHRpbmRlbnQgPSBpbmRlbnQgfHwgMDtcblx0XHRcdHZhciBodG1sID0gJyc7XG4gICAgICAgICAgICBjb25zdCB0YWI6IGFueSA9ICdcXHQnO1xuXG5cdFx0XHRpZihyb290Lmh0bWwpIHtcblx0XHRcdFx0aHRtbCArPSBuZXcgQXJyYXkoaW5kZW50KS5qb2luKHRhYik7IC8vdGFiLnJlcGVhdChpbmRlbnQpOztcblx0XHRcdFx0aWYocm9vdC50eXBlICE9PSAnVEVYVCcpIHtcblx0XHRcdFx0XHRpZihyb290LnNlbGZDbG9zaW5nICYmICFyb290LmlzVm9pZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaHRtbCArPSAnPCcgKyByb290Lmh0bWwuc3Vic3RyKDAsIC0tcm9vdC5odG1sLmxlbmd0aCkgKyAnPic7XG4gICAgICAgICAgICAgICAgICAgICAgICBodG1sICs9ICc8Lycrcm9vdC50eXBlKyc+XFxuJztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgICAgICBodG1sICs9ICc8JyArIHJvb3QuaHRtbCArICc+JztcbiAgICAgICAgICAgICAgICB9XG5cdFx0XHRcdGVsc2UgaHRtbCArPSByb290Lmh0bWw7XG5cdFx0XHR9XG5cblx0XHRcdGlmKGh0bWwpXG5cdFx0XHRcdGh0bWwgKz0gJ1xcbic7XG5cblx0XHRcdGlmKHJvb3QuY2hpbGRyZW4ubGVuZ3RoKSB7XG5cdFx0XHRcdGh0bWwgKz0gcm9vdC5jaGlsZHJlbi5tYXAoZnVuY3Rpb24oYykge1xuXHRcdFx0XHRcdHJldHVybiB0aGlzLmRvbVRvU3RyaW5nKGMsIGluZGVudCsocm9vdC50eXBlID8gMSA6IDIpKTtcblx0XHRcdFx0fS5iaW5kKHRoaXMpKS5qb2luKCdcXG4nKTtcblx0XHRcdH1cblxuXHRcdFx0aWYocm9vdC50eXBlICYmIHJvb3QudHlwZSAhPT0gJ1RFWFQnICYmICFyb290LnNlbGZDbG9zaW5nKSB7XG5cdFx0XHRcdGh0bWwgKz0gbmV3IEFycmF5KGluZGVudCkuam9pbih0YWIpOyAvL3RhYi5yZXBlYXQoaW5kZW50KTtcblx0XHRcdFx0aHRtbCArPSAnPC8nK3Jvb3QudHlwZSsnPlxcbic7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiBodG1sO1xuXHRcdH1cblxuICAgICAgICBwcml2YXRlIHJlcGwoc3RyOiBzdHJpbmcsIG1vZGVsczogYW55W10pOiBzdHJpbmcge1xuICAgICAgICAgICAgdmFyIHJlZ2V4RyA9IC97KC4rPyl9fT8vZztcblxuICAgICAgICAgICAgdmFyIG0gPSBzdHIubWF0Y2gocmVnZXhHKTtcbiAgICAgICAgICAgIGlmKCFtKVxuICAgICAgICAgICAgICAgIHJldHVybiBzdHI7XG5cbiAgICAgICAgICAgIHdoaWxlKG0ubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgdmFyIHBhdGggPSBtWzBdO1xuICAgICAgICAgICAgICAgIHBhdGggPSBwYXRoLnN1YnN0cigxLCBwYXRoLmxlbmd0aC0yKTtcblxuICAgICAgICAgICAgICAgIHZhciB2YWx1ZSA9IHRoaXMuZXZhbHVhdGUobW9kZWxzLCBwYXRoKTtcblxuICAgICAgICAgICAgICAgIGlmKHZhbHVlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYodHlwZW9mIHZhbHVlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IFwiaG8uY29tcG9uZW50cy5Db21wb25lbnQuZ2V0Q29tcG9uZW50KHRoaXMpLlwiK3BhdGg7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgc3RyID0gc3RyLnJlcGxhY2UobVswXSwgdmFsdWUpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIG0gPSBtLnNsaWNlKDEpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gc3RyO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJpdmF0ZSBldmFsdWF0ZShtb2RlbHM6IGFueVtdLCBwYXRoOiBzdHJpbmcpOiBhbnkge1xuICAgICAgICAgICAgaWYocGF0aFswXSA9PT0gJ3snICYmIHBhdGhbLS1wYXRoLmxlbmd0aF0gPT09ICd9JylcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5ldmFsdWF0ZUV4cHJlc3Npb24obW9kZWxzLCBwYXRoLnN1YnN0cigxLCBwYXRoLmxlbmd0aC0yKSlcbiAgICAgICAgICAgIGVsc2UgaWYocGF0aFswXSA9PT0gJyMnKVxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmV2YWx1YXRlRnVuY3Rpb24obW9kZWxzLCBwYXRoLnN1YnN0cigxKSk7XG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuZXZhbHVhdGVWYWx1ZShtb2RlbHMsIHBhdGgpO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJpdmF0ZSBldmFsdWF0ZVZhbHVlKG1vZGVsczogYW55W10sIHBhdGg6IHN0cmluZyk6IGFueSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5ldmFsdWF0ZVZhbHVlQW5kTW9kZWwobW9kZWxzLCBwYXRoKS52YWx1ZTtcbiAgICAgICAgfVxuXG5cdFx0cHJpdmF0ZSBldmFsdWF0ZVZhbHVlQW5kTW9kZWwobW9kZWxzOiBhbnlbXSwgcGF0aDogc3RyaW5nKToge3ZhbHVlOiBhbnksIG1vZGVsOiBhbnl9IHtcblx0XHRcdGlmKG1vZGVscy5pbmRleE9mKHdpbmRvdykgPT0gLTEpXG4gICAgICAgICAgICAgICAgbW9kZWxzLnB1c2god2luZG93KTtcblxuICAgICAgICAgICAgdmFyIG1pID0gMDtcblx0XHRcdHZhciBtb2RlbCA9IHZvaWQgMDtcblx0XHRcdHdoaWxlKG1pIDwgbW9kZWxzLmxlbmd0aCAmJiBtb2RlbCA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRcdG1vZGVsID0gbW9kZWxzW21pXTtcblx0XHRcdFx0dHJ5IHtcblx0XHRcdFx0XHRtb2RlbCA9IG5ldyBGdW5jdGlvbihcIm1vZGVsXCIsIFwicmV0dXJuIG1vZGVsWydcIiArIHBhdGguc3BsaXQoXCIuXCIpLmpvaW4oXCInXVsnXCIpICsgXCInXVwiKShtb2RlbCk7XG5cdFx0XHRcdH0gY2F0Y2goZSkge1xuXHRcdFx0XHRcdG1vZGVsID0gdm9pZCAwO1xuXHRcdFx0XHR9IGZpbmFsbHkge1xuICAgICAgICAgICAgICAgICAgICBtaSsrO1xuICAgICAgICAgICAgICAgIH1cblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIHtcInZhbHVlXCI6IG1vZGVsLCBcIm1vZGVsXCI6IG1vZGVsc1stLW1pXX07XG5cdFx0fVxuXG4gICAgICAgIHByaXZhdGUgZXZhbHVhdGVFeHByZXNzaW9uKG1vZGVsczogYW55W10sIHBhdGg6IHN0cmluZyk6IGFueSB7XG5cdFx0XHRpZihtb2RlbHMuaW5kZXhPZih3aW5kb3cpID09IC0xKVxuICAgICAgICAgICAgICAgIG1vZGVscy5wdXNoKHdpbmRvdyk7XG5cbiAgICAgICAgICAgIHZhciBtaSA9IDA7XG5cdFx0XHR2YXIgbW9kZWwgPSB2b2lkIDA7XG5cdFx0XHR3aGlsZShtaSA8IG1vZGVscy5sZW5ndGggJiYgbW9kZWwgPT09IHVuZGVmaW5lZCkge1xuXHRcdFx0XHRtb2RlbCA9IG1vZGVsc1ttaV07XG5cdFx0XHRcdHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIC8vd2l0aChtb2RlbCkgbW9kZWwgPSBldmFsKHBhdGgpO1xuICAgICAgICAgICAgICAgICAgICBtb2RlbCA9IG5ldyBGdW5jdGlvbihPYmplY3Qua2V5cyhtb2RlbCkudG9TdHJpbmcoKSwgXCJyZXR1cm4gXCIgKyBwYXRoKVxuICAgICAgICAgICAgICAgICAgICAgICAgLmFwcGx5KG51bGwsIE9iamVjdC5rZXlzKG1vZGVsKS5tYXAoKGspID0+IHtyZXR1cm4gbW9kZWxba119KSApO1xuXHRcdFx0XHR9IGNhdGNoKGUpIHtcblx0XHRcdFx0XHRtb2RlbCA9IHZvaWQgMDtcblx0XHRcdFx0fSBmaW5hbGx5IHtcbiAgICAgICAgICAgICAgICAgICAgbWkrKztcbiAgICAgICAgICAgICAgICB9XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiBtb2RlbDtcblx0XHR9XG5cbiAgICAgICAgcHJpdmF0ZSBldmFsdWF0ZUZ1bmN0aW9uKG1vZGVsczogYW55W10sIHBhdGg6IHN0cmluZyk6IGFueSB7XG4gICAgICAgICAgICBsZXQgZXhwID0gdGhpcy5ldmFsdWF0ZUV4cHJlc3Npb24uYmluZCh0aGlzLCBtb2RlbHMpO1xuXHRcdFx0dmFyIFtuYW1lLCBhcmdzXSA9IHBhdGguc3BsaXQoJygnKTtcbiAgICAgICAgICAgIGFyZ3MgPSBhcmdzLnN1YnN0cigwLCAtLWFyZ3MubGVuZ3RoKTtcblxuICAgICAgICAgICAgbGV0IHt2YWx1ZSwgbW9kZWx9ID0gdGhpcy5ldmFsdWF0ZVZhbHVlQW5kTW9kZWwobW9kZWxzLCBuYW1lKTtcbiAgICAgICAgICAgIGxldCBmdW5jOiBGdW5jdGlvbiA9IHZhbHVlO1xuICAgICAgICAgICAgbGV0IGFyZ0Fycjogc3RyaW5nW10gPSBhcmdzLnNwbGl0KCcuJykubWFwKChhcmcpID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gYXJnLmluZGV4T2YoJyMnKSA9PT0gMCA/XG4gICAgICAgICAgICAgICAgICAgIGFyZy5zdWJzdHIoMSkgOlxuICAgICAgICAgICAgICAgICAgICBleHAoYXJnKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBmdW5jID0gZnVuYy5iaW5kKG1vZGVsLCAuLi5hcmdBcnIpO1xuXG4gICAgICAgICAgICBsZXQgaW5kZXggPSBoby5jb21wb25lbnRzLnRlbXAuc2V0KGZ1bmMpO1xuXG4gICAgICAgICAgICB2YXIgc3RyID0gYGhvLmNvbXBvbmVudHMudGVtcC5jYWxsKCR7aW5kZXh9KWA7XG4gICAgICAgICAgICByZXR1cm4gc3RyO1xuXHRcdH1cblxuXHRcdHByaXZhdGUgY29weU5vZGUobm9kZTogTm9kZSk6IE5vZGUge1xuXHRcdFx0dmFyIGNvcHlOb2RlID0gdGhpcy5jb3B5Tm9kZS5iaW5kKHRoaXMpO1xuXG4gICAgICAgICAgICB2YXIgbiA9IDxOb2RlPntcblx0XHRcdFx0cGFyZW50OiBub2RlLnBhcmVudCxcblx0XHRcdFx0aHRtbDogbm9kZS5odG1sLFxuXHRcdFx0XHR0eXBlOiBub2RlLnR5cGUsXG5cdFx0XHRcdHNlbGZDbG9zaW5nOiBub2RlLnNlbGZDbG9zaW5nLFxuXHRcdFx0XHRyZXBlYXQ6IG5vZGUucmVwZWF0LFxuXHRcdFx0XHRjaGlsZHJlbjogbm9kZS5jaGlsZHJlbi5tYXAoY29weU5vZGUpXG5cdFx0XHR9O1xuXG5cdFx0XHRyZXR1cm4gbjtcblx0XHR9XG5cbiAgICAgICAgcHJpdmF0ZSBpc1ZvaWQobmFtZTogc3RyaW5nKTogYm9vbGVhbiB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy52b2lkcy5pbmRleE9mKG5hbWUudG9Mb3dlckNhc2UoKSkgIT09IC0xO1xuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICBleHBvcnQgbGV0IGluc3RhbmNlID0gbmV3IFJlbmRlcmVyKCk7XG5cbn1cbiIsIm1vZHVsZSBoby5jb21wb25lbnRzLmh0bWxwcm92aWRlciB7XG4gICAgaW1wb3J0IFByb21pc2UgPSBoby5wcm9taXNlLlByb21pc2U7XG5cbiAgICBleHBvcnQgY2xhc3MgSHRtbFByb3ZpZGVyIHtcblxuICAgICAgICBwcml2YXRlIGNhY2hlOiB7W2theTpzdHJpbmddOnN0cmluZ30gPSB7fTtcblxuICAgICAgICByZXNvbHZlKG5hbWU6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgICAgICAgICBpZihoby5jb21wb25lbnRzLnJlZ2lzdHJ5LnVzZURpcikge1xuICAgICAgICAgICAgICAgIG5hbWUgKz0gJy4nICsgbmFtZS5zcGxpdCgnLicpLnBvcCgpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBuYW1lID0gbmFtZS5zcGxpdCgnLicpLmpvaW4oJy8nKTtcblxuICAgICAgICAgICAgcmV0dXJuIGBjb21wb25lbnRzLyR7bmFtZX0uaHRtbGA7XG4gICAgICAgIH1cblxuICAgICAgICBnZXRIVE1MKG5hbWU6IHN0cmluZyk6IFByb21pc2U8c3RyaW5nLCBzdHJpbmc+IHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG5cbiAgICAgICAgICAgICAgICBpZih0eXBlb2YgdGhpcy5jYWNoZVtuYW1lXSA9PT0gJ3N0cmluZycpXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiByZXNvbHZlKHRoaXMuY2FjaGVbbmFtZV0pO1xuXG4gICAgICAgICAgICAgICAgbGV0IHVybCA9IHRoaXMucmVzb2x2ZShuYW1lKTtcblxuICAgICAgICAgICAgICAgIGxldCB4bWxodHRwID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgXHRcdFx0eG1saHR0cC5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbigpIHtcbiAgICBcdFx0XHRcdGlmKHhtbGh0dHAucmVhZHlTdGF0ZSA9PSA0KSB7XG4gICAgXHRcdFx0XHRcdGxldCByZXNwID0geG1saHR0cC5yZXNwb25zZVRleHQ7XG4gICAgXHRcdFx0XHRcdGlmKHhtbGh0dHAuc3RhdHVzID09IDIwMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUocmVzcCk7XG4gICAgXHRcdFx0XHRcdH0gZWxzZSB7XG4gICAgXHRcdFx0XHRcdFx0cmVqZWN0KGBFcnJvciB3aGlsZSBsb2FkaW5nIGh0bWwgZm9yIENvbXBvbmVudCAke25hbWV9YCk7XG4gICAgXHRcdFx0XHRcdH1cbiAgICBcdFx0XHRcdH1cbiAgICBcdFx0XHR9O1xuXG4gICAgXHRcdFx0eG1saHR0cC5vcGVuKCdHRVQnLCB1cmwsIHRydWUpO1xuICAgIFx0XHRcdHhtbGh0dHAuc2VuZCgpO1xuXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGV4cG9ydCBsZXQgaW5zdGFuY2UgPSBuZXcgSHRtbFByb3ZpZGVyKCk7XG5cbn1cbiIsIm1vZHVsZSBoby5jb21wb25lbnRzIHtcblxuXHRpbXBvcnQgUHJvbWlzZSA9IGhvLnByb21pc2UuUHJvbWlzZTtcblxuXHQvKipcblx0XHRCYXNlY2xhc3MgZm9yIEF0dHJpYnV0ZXMuXG5cdFx0VXNlZCBBdHRyaWJ1dGVzIG5lZWRzIHRvIGJlIHNwZWNpZmllZCBieSBDb21wb25lbnQjYXR0cmlidXRlcyBwcm9wZXJ0eSB0byBnZXQgbG9hZGVkIHByb3Blcmx5LlxuXHQqL1xuXHRleHBvcnQgY2xhc3MgQXR0cmlidXRlIHtcblxuXHRcdHByb3RlY3RlZCBlbGVtZW50OiBIVE1MRWxlbWVudDtcblx0XHRwcm90ZWN0ZWQgY29tcG9uZW50OiBDb21wb25lbnQ7XG5cdFx0cHJvdGVjdGVkIHZhbHVlOiBzdHJpbmc7XG5cblx0XHRjb25zdHJ1Y3RvcihlbGVtZW50OiBIVE1MRWxlbWVudCwgdmFsdWU/OiBzdHJpbmcpIHtcblx0XHRcdHRoaXMuZWxlbWVudCA9IGVsZW1lbnQ7XG5cdFx0XHR0aGlzLmNvbXBvbmVudCA9IENvbXBvbmVudC5nZXRDb21wb25lbnQoZWxlbWVudCk7XG5cdFx0XHR0aGlzLnZhbHVlID0gdmFsdWU7XG5cblx0XHRcdHRoaXMuaW5pdCgpO1xuXHRcdH1cblxuXHRcdHByb3RlY3RlZCBpbml0KCk6IHZvaWQge31cblxuXHRcdGdldCBuYW1lKCkge1xuXHRcdFx0cmV0dXJuIEF0dHJpYnV0ZS5nZXROYW1lKHRoaXMpO1xuXHRcdH1cblxuXG5cdFx0cHVibGljIHVwZGF0ZSgpOiB2b2lkIHtcblxuXHRcdH1cblxuXG5cdFx0c3RhdGljIGdldE5hbWUoY2xheno6IHR5cGVvZiBBdHRyaWJ1dGUgfCBBdHRyaWJ1dGUpOiBzdHJpbmcge1xuICAgICAgICAgICAgaWYoY2xhenogaW5zdGFuY2VvZiBBdHRyaWJ1dGUpXG4gICAgICAgICAgICAgICAgcmV0dXJuIGNsYXp6LmNvbnN0cnVjdG9yLnRvU3RyaW5nKCkubWF0Y2goL1xcdysvZylbMV07XG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgcmV0dXJuIGNsYXp6LnRvU3RyaW5nKCkubWF0Y2goL1xcdysvZylbMV07XG4gICAgICAgIH1cblx0fVxuXG5cdGV4cG9ydCBjbGFzcyBXYXRjaEF0dHJpYnV0ZSBleHRlbmRzIEF0dHJpYnV0ZSB7XG5cblx0XHRwcm90ZWN0ZWQgcjogUmVnRXhwID0gLyMoLis/KSMvZztcblxuXHRcdGNvbnN0cnVjdG9yKGVsZW1lbnQ6IEhUTUxFbGVtZW50LCB2YWx1ZT86IHN0cmluZykge1xuXHRcdFx0c3VwZXIoZWxlbWVudCwgdmFsdWUpO1xuXG5cdFx0XHRsZXQgbTogYW55W10gPSB0aGlzLnZhbHVlLm1hdGNoKHRoaXMucikgfHwgW107XG5cdFx0XHRtLm1hcChmdW5jdGlvbih3KSB7XG5cdFx0XHRcdHcgPSB3LnN1YnN0cigxLCB3Lmxlbmd0aC0yKTtcblx0XHRcdFx0dGhpcy53YXRjaCh3KTtcblx0XHRcdH0uYmluZCh0aGlzKSk7XG5cdFx0XHR0aGlzLnZhbHVlID0gdGhpcy52YWx1ZS5yZXBsYWNlKC8jL2csICcnKTtcblx0XHR9XG5cblxuXHRcdHByb3RlY3RlZCB3YXRjaChwYXRoOiBzdHJpbmcpOiB2b2lkIHtcblx0XHRcdGxldCBwYXRoQXJyID0gcGF0aC5zcGxpdCgnLicpO1xuXHRcdFx0bGV0IHByb3AgPSBwYXRoQXJyLnBvcCgpO1xuXHRcdFx0bGV0IG9iaiA9IHRoaXMuY29tcG9uZW50O1xuXG5cdFx0XHRwYXRoQXJyLm1hcCgocGFydCkgPT4ge1xuXHRcdFx0XHRvYmogPSBvYmpbcGFydF07XG5cdFx0XHR9KTtcblxuXHRcdFx0aG8ud2F0Y2gud2F0Y2gob2JqLCBwcm9wLCB0aGlzLnVwZGF0ZS5iaW5kKHRoaXMpKTtcblx0XHR9XG5cblx0XHRwcm90ZWN0ZWQgZXZhbChwYXRoOiBzdHJpbmcpOiBhbnkge1xuXHRcdFx0bGV0IG1vZGVsID0gdGhpcy5jb21wb25lbnQ7XG5cdFx0XHRtb2RlbCA9IG5ldyBGdW5jdGlvbihPYmplY3Qua2V5cyhtb2RlbCkudG9TdHJpbmcoKSwgXCJyZXR1cm4gXCIgKyBwYXRoKVxuXHRcdFx0XHQuYXBwbHkobnVsbCwgT2JqZWN0LmtleXMobW9kZWwpLm1hcCgoaykgPT4ge3JldHVybiBtb2RlbFtrXX0pICk7XG5cdFx0XHRyZXR1cm4gbW9kZWw7XG5cdFx0fVxuXG5cdH1cbn1cbiIsIm1vZHVsZSBoby5jb21wb25lbnRzIHtcblxuICAgIGltcG9ydCBQcm9taXNlID0gaG8ucHJvbWlzZS5Qcm9taXNlO1xuICAgIGltcG9ydCBIdG1sUHJvdmlkZXIgPSBoby5jb21wb25lbnRzLmh0bWxwcm92aWRlci5pbnN0YW5jZTtcbiAgICBpbXBvcnQgUmVuZGVyZXIgPSBoby5jb21wb25lbnRzLnJlbmRlcmVyLmluc3RhbmNlO1xuXG4gICAgZXhwb3J0IGludGVyZmFjZSBDb21wb25lbnRFbGVtZW50IGV4dGVuZHMgSFRNTEVsZW1lbnQge1xuICAgICAgICBjb21wb25lbnQ/OiBDb21wb25lbnQ7XG4gICAgfVxuXG4gICAgZXhwb3J0IGludGVyZmFjZSBJUHJvcHJldHkge1xuICAgICAgICBuYW1lOiBzdHJpbmc7XG4gICAgICAgIHJlcXVpcmVkPzogYm9vbGVhbjtcbiAgICAgICAgZGVmYXVsdD86IGFueTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgICAgQmFzZWNsYXNzIGZvciBDb21wb25lbnRzXG4gICAgICAgIGltcG9ydGFudDogZG8gaW5pdGlhbGl6YXRpb24gd29yayBpbiBDb21wb25lbnQjaW5pdFxuICAgICovXG4gICAgZXhwb3J0IGNsYXNzIENvbXBvbmVudCB7XG4gICAgICAgIHB1YmxpYyBlbGVtZW50OiBDb21wb25lbnRFbGVtZW50O1xuICAgICAgICBwdWJsaWMgb3JpZ2luYWxfaW5uZXJIVE1MOiBzdHJpbmc7XG4gICAgICAgIHB1YmxpYyBodG1sOiBzdHJpbmcgPSAnJztcbiAgICAgICAgcHVibGljIHN0eWxlOiBzdHJpbmcgPSAnJztcbiAgICAgICAgcHVibGljIHByb3BlcnRpZXM6IEFycmF5PHN0cmluZ3xJUHJvcHJldHk+ID0gW107XG4gICAgICAgIHB1YmxpYyBhdHRyaWJ1dGVzOiBBcnJheTxzdHJpbmc+ID0gW107XG4gICAgICAgIHB1YmxpYyByZXF1aXJlczogQXJyYXk8c3RyaW5nPiA9IFtdO1xuICAgICAgICBwdWJsaWMgY2hpbGRyZW46IHtba2V5OiBzdHJpbmddOiBhbnl9ID0ge307XG5cbiAgICAgICAgY29uc3RydWN0b3IoZWxlbWVudDogSFRNTEVsZW1lbnQpIHtcbiAgICAgICAgICAgIC8vLS0tLS0tLSBpbml0IEVsZW1lbmV0IGFuZCBFbGVtZW50cycgb3JpZ2luYWwgaW5uZXJIVE1MXG4gICAgICAgICAgICB0aGlzLmVsZW1lbnQgPSBlbGVtZW50O1xuICAgICAgICAgICAgdGhpcy5lbGVtZW50LmNvbXBvbmVudCA9IHRoaXM7XG4gICAgICAgICAgICB0aGlzLm9yaWdpbmFsX2lubmVySFRNTCA9IGVsZW1lbnQuaW5uZXJIVE1MO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIGdldCBuYW1lKCk6IHN0cmluZyB7XG4gICAgICAgICAgICByZXR1cm4gQ29tcG9uZW50LmdldE5hbWUodGhpcyk7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgZ2V0TmFtZSgpOiBzdHJpbmcge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMubmFtZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBnZXRQYXJlbnQoKTogQ29tcG9uZW50IHtcbiAgICAgICAgICAgIHJldHVybiBDb21wb25lbnQuZ2V0Q29tcG9uZW50KDxDb21wb25lbnRFbGVtZW50PnRoaXMuZWxlbWVudC5wYXJlbnROb2RlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBfaW5pdCgpOiBQcm9taXNlPGFueSwgYW55PiB7XG4gICAgICAgICAgICBsZXQgcmVuZGVyID0gdGhpcy5yZW5kZXIuYmluZCh0aGlzKTtcbiAgICAgICAgICAgIC8vLS0tLS0tLS0gaW5pdCBQcm9wZXJ0aWVzXG4gICAgICAgICAgICB0aGlzLmluaXRQcm9wZXJ0aWVzKCk7XG5cbiAgICAgICAgICAgIC8vLS0tLS0tLSBjYWxsIGluaXQoKSAmIGxvYWRSZXF1aXJlbWVudHMoKSAtPiB0aGVuIHJlbmRlclxuICAgICAgICAgICAgbGV0IHJlYWR5ID0gW3RoaXMuaW5pdEhUTUwoKSwgUHJvbWlzZS5jcmVhdGUodGhpcy5pbml0KCkpLCB0aGlzLmxvYWRSZXF1aXJlbWVudHMoKV07XG5cbiAgICAgICAgICAgIGxldCBwID0gbmV3IFByb21pc2U8YW55LCBhbnk+KCk7XG5cbiAgICAgICAgICAgIFByb21pc2UuYWxsKHJlYWR5KVxuICAgICAgICAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgIHAucmVzb2x2ZSgpO1xuICAgICAgICAgICAgICAgIHJlbmRlcigpO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5jYXRjaCgoZXJyKSA9PiB7XG4gICAgICAgICAgICAgICAgcC5yZWplY3QoZXJyKTtcbiAgICAgICAgICAgICAgICB0aHJvdyBlcnI7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgcmV0dXJuIHA7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICAgIE1ldGhvZCB0aGF0IGdldCBjYWxsZWQgYWZ0ZXIgaW5pdGlhbGl6YXRpb24gb2YgYSBuZXcgaW5zdGFuY2UuXG4gICAgICAgICAgICBEbyBpbml0LXdvcmsgaGVyZS5cbiAgICAgICAgICAgIE1heSByZXR1cm4gYSBQcm9taXNlLlxuICAgICAgICAqL1xuICAgICAgICBwdWJsaWMgaW5pdCgpOiBhbnkge31cblxuICAgICAgICBwdWJsaWMgdXBkYXRlKCk6IHZvaWQge3JldHVybiB2b2lkIDA7fVxuXG4gICAgICAgIHB1YmxpYyByZW5kZXIoKTogdm9pZCB7XG4gICAgXHRcdFJlbmRlcmVyLnJlbmRlcih0aGlzKTtcblxuICAgIFx0XHRoby5jb21wb25lbnRzLnJlZ2lzdHJ5Lmluc3RhbmNlLmluaXRFbGVtZW50KHRoaXMuZWxlbWVudClcbiAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKCkge1xuXG4gICAgICAgICAgICAgICAgdGhpcy5pbml0Q2hpbGRyZW4oKTtcblxuICAgICAgICAgICAgICAgIHRoaXMuaW5pdFN0eWxlKCk7XG5cbiAgICAgICAgICAgICAgICB0aGlzLmluaXRBdHRyaWJ1dGVzKCk7XG5cbiAgICBcdFx0XHR0aGlzLnVwZGF0ZSgpO1xuXG4gICAgICAgICAgICB9LmJpbmQodGhpcykpO1xuICAgIFx0fTtcblxuICAgICAgICBwcml2YXRlIGluaXRTdHlsZSgpOiB2b2lkIHtcbiAgICAgICAgICAgIGlmKHR5cGVvZiB0aGlzLnN0eWxlID09PSAndW5kZWZpbmVkJylcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICBpZih0aGlzLnN0eWxlID09PSBudWxsKVxuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIGlmKHR5cGVvZiB0aGlzLnN0eWxlID09PSAnc3RyaW5nJyAmJiB0aGlzLnN0eWxlLmxlbmd0aCA9PT0gMClcbiAgICAgICAgICAgICAgICByZXR1cm47XG5cbiAgICAgICAgICAgIHN0eWxlci5pbnN0YW5jZS5hcHBseVN0eWxlKHRoaXMpO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICogIEFzc3VyZSB0aGF0IHRoaXMgaW5zdGFuY2UgaGFzIGFuIHZhbGlkIGh0bWwgYXR0cmlidXRlIGFuZCBpZiBub3QgbG9hZCBhbmQgc2V0IGl0LlxuICAgICAgICAqL1xuICAgICAgICBwcml2YXRlIGluaXRIVE1MKCk6IFByb21pc2U8YW55LGFueT4ge1xuICAgICAgICAgICAgbGV0IHAgPSBuZXcgUHJvbWlzZSgpO1xuICAgICAgICAgICAgbGV0IHNlbGYgPSB0aGlzO1xuXG4gICAgICAgICAgICBpZih0eXBlb2YgdGhpcy5odG1sID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgICAgIHRoaXMuaHRtbCA9ICcnO1xuICAgICAgICAgICAgICAgIHAucmVzb2x2ZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYodGhpcy5odG1sLmluZGV4T2YoXCIuaHRtbFwiLCB0aGlzLmh0bWwubGVuZ3RoIC0gXCIuaHRtbFwiLmxlbmd0aCkgIT09IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgIEh0bWxQcm92aWRlci5nZXRIVE1MKHRoaXMubmFtZSlcbiAgICAgICAgICAgICAgICAgICAgLnRoZW4oKGh0bWwpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuaHRtbCA9IGh0bWw7XG4gICAgICAgICAgICAgICAgICAgICAgICBwLnJlc29sdmUoKTtcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgLmNhdGNoKHAucmVqZWN0KTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBwLnJlc29sdmUoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBwO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJpdmF0ZSBpbml0UHJvcGVydGllcygpOiB2b2lkIHtcbiAgICAgICAgICAgIHRoaXMucHJvcGVydGllcy5mb3JFYWNoKGZ1bmN0aW9uKHByb3ApIHtcbiAgICAgICAgICAgICAgICBpZih0eXBlb2YgcHJvcCA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wcm9wZXJ0aWVzW3Byb3AubmFtZV0gPSB0aGlzLmVsZW1lbnRbcHJvcC5uYW1lXSB8fCB0aGlzLmVsZW1lbnQuZ2V0QXR0cmlidXRlKHByb3AubmFtZSkgfHwgcHJvcC5kZWZhdWx0O1xuICAgICAgICAgICAgICAgICAgICBpZih0aGlzLnByb3BlcnRpZXNbcHJvcC5uYW1lXSA9PT0gdW5kZWZpbmVkICYmIHByb3AucmVxdWlyZWQgPT09IHRydWUpXG4gICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBgUHJvcGVydHkgJHtwcm9wLm5hbWV9IGlzIHJlcXVpcmVkIGJ1dCBub3QgcHJvdmlkZWRgO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIGlmKHR5cGVvZiBwcm9wID09PSAnc3RyaW5nJylcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wcm9wZXJ0aWVzW3Byb3BdID0gdGhpcy5lbGVtZW50W3Byb3BdIHx8IHRoaXMuZWxlbWVudC5nZXRBdHRyaWJ1dGUocHJvcCk7XG4gICAgICAgICAgICB9LmJpbmQodGhpcykpO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJpdmF0ZSBpbml0Q2hpbGRyZW4oKTogdm9pZCB7XG4gICAgICAgICAgICBsZXQgY2hpbGRzID0gdGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJyonKTtcbiAgICBcdFx0Zm9yKGxldCBjID0gMDsgYyA8IGNoaWxkcy5sZW5ndGg7IGMrKykge1xuICAgIFx0XHRcdGxldCBjaGlsZDogRWxlbWVudCA9IDxFbGVtZW50PmNoaWxkc1tjXTtcbiAgICBcdFx0XHRpZihjaGlsZC5pZCkge1xuICAgIFx0XHRcdFx0dGhpcy5jaGlsZHJlbltjaGlsZC5pZF0gPSBjaGlsZDtcbiAgICBcdFx0XHR9XG4gICAgXHRcdFx0aWYoY2hpbGQudGFnTmFtZSlcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jaGlsZHJlbltjaGlsZC50YWdOYW1lXSA9IHRoaXMuY2hpbGRyZW5bY2hpbGQudGFnTmFtZV0gfHwgW107XG4gICAgICAgICAgICAgICAgKDxFbGVtZW50W10+dGhpcy5jaGlsZHJlbltjaGlsZC50YWdOYW1lXSkucHVzaChjaGlsZCk7XG4gICAgXHRcdH1cbiAgICAgICAgfVxuXG4gICAgICAgIHByaXZhdGUgaW5pdEF0dHJpYnV0ZXMoKTogdm9pZCB7XG4gICAgICAgICAgICB0aGlzLmF0dHJpYnV0ZXNcbiAgICAgICAgICAgIC5mb3JFYWNoKChhKSA9PiB7XG4gICAgICAgICAgICAgICAgbGV0IGF0dHIgPSBoby5jb21wb25lbnRzLnJlZ2lzdHJ5Lmluc3RhbmNlLmdldEF0dHJpYnV0ZShhKTtcbiAgICAgICAgICAgICAgICBBcnJheS5wcm90b3R5cGUuZm9yRWFjaC5jYWxsKHRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKGAqWyR7YX1dYCksIChlOiBIVE1MRWxlbWVudCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBsZXQgdmFsID0gZS5oYXNPd25Qcm9wZXJ0eShhKSA/IGVbYV0gOiBlLmdldEF0dHJpYnV0ZShhKTtcbiAgICAgICAgICAgICAgICAgICAgaWYodHlwZW9mIHZhbCA9PT0gJ3N0cmluZycgJiYgdmFsID09PSAnJylcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbCA9IHZvaWQgMDtcbiAgICAgICAgICAgICAgICAgICAgbmV3IGF0dHIoZSwgdmFsKS51cGRhdGUoKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJpdmF0ZSBsb2FkUmVxdWlyZW1lbnRzKCkge1xuICAgIFx0XHRsZXQgY29tcG9uZW50czogYW55W10gPSB0aGlzLnJlcXVpcmVzXG4gICAgICAgICAgICAuZmlsdGVyKChyZXEpID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gIWhvLmNvbXBvbmVudHMucmVnaXN0cnkuaW5zdGFuY2UuaGFzQ29tcG9uZW50KHJlcSk7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLm1hcCgocmVxKSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGhvLmNvbXBvbmVudHMucmVnaXN0cnkuaW5zdGFuY2UubG9hZENvbXBvbmVudChyZXEpO1xuICAgICAgICAgICAgfSk7XG5cblxuICAgICAgICAgICAgbGV0IGF0dHJpYnV0ZXM6IGFueVtdID0gdGhpcy5hdHRyaWJ1dGVzXG4gICAgICAgICAgICAuZmlsdGVyKChyZXEpID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gIWhvLmNvbXBvbmVudHMucmVnaXN0cnkuaW5zdGFuY2UuaGFzQXR0cmlidXRlKHJlcSk7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLm1hcCgocmVxKSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGhvLmNvbXBvbmVudHMucmVnaXN0cnkuaW5zdGFuY2UubG9hZEF0dHJpYnV0ZShyZXEpO1xuICAgICAgICAgICAgfSk7XG5cblxuICAgICAgICAgICAgbGV0IHByb21pc2VzID0gY29tcG9uZW50cy5jb25jYXQoYXR0cmlidXRlcyk7XG5cbiAgICAgICAgICAgIHJldHVybiBQcm9taXNlLmFsbChwcm9taXNlcyk7XG4gICAgXHR9O1xuXG4gICAgICAgIC8qXG4gICAgICAgIHN0YXRpYyByZWdpc3RlcihjOiB0eXBlb2YgQ29tcG9uZW50KTogdm9pZCB7XG4gICAgICAgICAgICBoby5jb21wb25lbnRzLnJlZ2lzdHJ5Lmluc3RhbmNlLnJlZ2lzdGVyKGMpO1xuICAgICAgICB9XG4gICAgICAgICovXG5cbiAgICAgICAgLypcbiAgICAgICAgc3RhdGljIHJ1bihvcHQ/OiBhbnkpIHtcbiAgICAgICAgICAgIGhvLmNvbXBvbmVudHMucmVnaXN0cnkuaW5zdGFuY2Uuc2V0T3B0aW9ucyhvcHQpO1xuICAgICAgICAgICAgaG8uY29tcG9uZW50cy5yZWdpc3RyeS5pbnN0YW5jZS5ydW4oKTtcbiAgICAgICAgfVxuICAgICAgICAqL1xuXG4gICAgICAgIHN0YXRpYyBnZXRDb21wb25lbnQoZWxlbWVudDogQ29tcG9uZW50RWxlbWVudCk6IENvbXBvbmVudCB7XG4gICAgICAgICAgICB3aGlsZSghZWxlbWVudC5jb21wb25lbnQpXG4gICAgXHRcdFx0ZWxlbWVudCA9IDxDb21wb25lbnRFbGVtZW50PmVsZW1lbnQucGFyZW50Tm9kZTtcbiAgICBcdFx0cmV0dXJuIGVsZW1lbnQuY29tcG9uZW50O1xuICAgICAgICB9XG5cbiAgICAgICAgc3RhdGljIGdldE5hbWUoY2xheno6IHR5cGVvZiBDb21wb25lbnQpOiBzdHJpbmc7XG4gICAgICAgIHN0YXRpYyBnZXROYW1lKGNsYXp6OiBDb21wb25lbnQpOiBzdHJpbmc7XG4gICAgICAgIHN0YXRpYyBnZXROYW1lKGNsYXp6OiAodHlwZW9mIENvbXBvbmVudCkgfCAoQ29tcG9uZW50KSk6IHN0cmluZyB7XG4gICAgICAgICAgICBpZihjbGF6eiBpbnN0YW5jZW9mIENvbXBvbmVudClcbiAgICAgICAgICAgICAgICByZXR1cm4gY2xhenouY29uc3RydWN0b3IudG9TdHJpbmcoKS5tYXRjaCgvXFx3Ky9nKVsxXTtcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICByZXR1cm4gY2xhenoudG9TdHJpbmcoKS5tYXRjaCgvXFx3Ky9nKVsxXTtcbiAgICAgICAgfVxuXG5cbiAgICB9XG59XG4iLCJtb2R1bGUgaG8uY29tcG9uZW50cy5yZWdpc3RyeSB7XG4gICAgaW1wb3J0IFByb21pc2UgPSBoby5wcm9taXNlLlByb21pc2U7XG5cbiAgICBleHBvcnQgbGV0IG1hcHBpbmc6IHtba2V5OnN0cmluZ106c3RyaW5nfSA9IHt9O1xuICAgIGV4cG9ydCBsZXQgdXNlRGlyID0gdHJ1ZTtcblxuICAgIGV4cG9ydCBjbGFzcyBSZWdpc3RyeSB7XG5cbiAgICAgICAgcHJpdmF0ZSBjb21wb25lbnRzOiBBcnJheTx0eXBlb2YgQ29tcG9uZW50PiA9IFtdO1xuICAgICAgICBwcml2YXRlIGF0dHJpYnV0ZXM6IEFycmF5PHR5cGVvZiBBdHRyaWJ1dGU+ID0gW107XG5cbiAgICAgICAgcHJpdmF0ZSBjb21wb25lbnRMb2FkZXIgPSBuZXcgaG8uY2xhc3Nsb2FkZXIuQ2xhc3NMb2FkZXIoe1xuICAgICAgICAgICAgdXJsVGVtcGxhdGU6ICdjb21wb25lbnRzLyR7bmFtZX0uanMnLFxuICAgICAgICAgICAgdXNlRGlyXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHByaXZhdGUgYXR0cmlidXRlTG9hZGVyID0gbmV3IGhvLmNsYXNzbG9hZGVyLkNsYXNzTG9hZGVyKHtcbiAgICAgICAgICAgIHVybFRlbXBsYXRlOiAnYXR0cmlidXRlcy8ke25hbWV9LmpzJyxcbiAgICAgICAgICAgIHVzZURpclxuICAgICAgICB9KTtcblxuXG5cbiAgICAgICAgcHVibGljIHJlZ2lzdGVyKGNhOiB0eXBlb2YgQ29tcG9uZW50IHwgdHlwZW9mIEF0dHJpYnV0ZSk6IHZvaWQge1xuICAgICAgICAgICAgaWYoY2EucHJvdG90eXBlIGluc3RhbmNlb2YgQ29tcG9uZW50KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jb21wb25lbnRzLnB1c2goPHR5cGVvZiBDb21wb25lbnQ+Y2EpO1xuICAgICAgICAgICAgICAgIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoQ29tcG9uZW50LmdldE5hbWUoPHR5cGVvZiBDb21wb25lbnQ+Y2EpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYoY2EucHJvdG90eXBlIGluc3RhbmNlb2YgQXR0cmlidXRlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5hdHRyaWJ1dGVzLnB1c2goPHR5cGVvZiBBdHRyaWJ1dGU+Y2EpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIHJ1bigpOiBQcm9taXNlPGFueSwgYW55PiB7XG4gICAgICAgICAgICBsZXQgaW5pdENvbXBvbmVudDogKGM6IHR5cGVvZiBDb21wb25lbnQpPT5Qcm9taXNlPGFueSwgYW55PiA9IHRoaXMuaW5pdENvbXBvbmVudC5iaW5kKHRoaXMpO1xuICAgICAgICAgICAgbGV0IHByb21pc2VzOiBBcnJheTxQcm9taXNlPGFueSwgYW55Pj4gPSB0aGlzLmNvbXBvbmVudHMubWFwKChjKT0+e1xuICAgICAgICAgICAgICAgIHJldHVybiBpbml0Q29tcG9uZW50KDxhbnk+Yyk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgcmV0dXJuIFByb21pc2UuYWxsKHByb21pc2VzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBpbml0Q29tcG9uZW50KGNvbXBvbmVudDogdHlwZW9mIENvbXBvbmVudCwgZWxlbWVudDpIVE1MRWxlbWVudHxEb2N1bWVudD1kb2N1bWVudCk6IFByb21pc2U8YW55LCBhbnk+IHtcbiAgICAgICAgICAgIGxldCBwcm9taXNlczogQXJyYXk8UHJvbWlzZTxhbnksIGFueT4+ID0gQXJyYXkucHJvdG90eXBlLm1hcC5jYWxsKFxuICAgICAgICAgICAgICAgIGVsZW1lbnQucXVlcnlTZWxlY3RvckFsbChDb21wb25lbnQuZ2V0TmFtZShjb21wb25lbnQpKSxcbiAgICAgICAgICAgICAgICBmdW5jdGlvbihlKTogUHJvbWlzZTxhbnksIGFueT4ge1xuXHQgICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBjb21wb25lbnQoZSkuX2luaXQoKTtcbiAgICAgICAgICAgICAgICB9XG5cdFx0XHQpO1xuXG4gICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5hbGwocHJvbWlzZXMpO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIGluaXRFbGVtZW50KGVsZW1lbnQ6IEhUTUxFbGVtZW50KTogUHJvbWlzZTxhbnksIGFueT4ge1xuICAgICAgICAgICAgbGV0IGluaXRDb21wb25lbnQ6IChjOiB0eXBlb2YgQ29tcG9uZW50LCBlbGVtZW50OiBIVE1MRWxlbWVudCk9PlByb21pc2U8YW55LCBhbnk+ID0gdGhpcy5pbml0Q29tcG9uZW50LmJpbmQodGhpcyk7XG4gICAgICAgICAgICBsZXQgcHJvbWlzZXM6IEFycmF5PFByb21pc2U8YW55LCBhbnk+PiA9IEFycmF5LnByb3RvdHlwZS5tYXAuY2FsbChcbiAgICAgICAgICAgICAgICB0aGlzLmNvbXBvbmVudHMsXG4gICAgICAgICAgICAgICAgY29tcG9uZW50ID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGluaXRDb21wb25lbnQoY29tcG9uZW50LCBlbGVtZW50KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICApO1xuXG4gICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5hbGwocHJvbWlzZXMpO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIGhhc0NvbXBvbmVudChuYW1lOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNvbXBvbmVudHNcbiAgICAgICAgICAgICAgICAuZmlsdGVyKChjb21wb25lbnQpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIENvbXBvbmVudC5nZXROYW1lKGNvbXBvbmVudCkgPT09IG5hbWU7XG4gICAgICAgICAgICAgICAgfSkubGVuZ3RoID4gMDtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBoYXNBdHRyaWJ1dGUobmFtZTogc3RyaW5nKTogYm9vbGVhbiB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5hdHRyaWJ1dGVzXG4gICAgICAgICAgICAgICAgLmZpbHRlcigoYXR0cmlidXRlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBBdHRyaWJ1dGUuZ2V0TmFtZShhdHRyaWJ1dGUpID09PSBuYW1lO1xuICAgICAgICAgICAgICAgIH0pLmxlbmd0aCA+IDA7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgZ2V0QXR0cmlidXRlKG5hbWU6IHN0cmluZyk6IHR5cGVvZiBBdHRyaWJ1dGUge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuYXR0cmlidXRlc1xuICAgICAgICAgICAgLmZpbHRlcigoYXR0cmlidXRlKSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIEF0dHJpYnV0ZS5nZXROYW1lKGF0dHJpYnV0ZSkgPT09IG5hbWU7XG4gICAgICAgICAgICB9KVswXTtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBsb2FkQ29tcG9uZW50KG5hbWU6IHN0cmluZyk6IFByb21pc2U8dHlwZW9mIENvbXBvbmVudCwgc3RyaW5nPiB7XG4gICAgICAgICAgICBsZXQgc2VsZiA9IHRoaXM7XG4gICAgICAgICAgICBsZXQgc3VwID0gdGhpcy5jb21wb25lbnRzLm1hcChjID0+IHtyZXR1cm4gQ29tcG9uZW50LmdldE5hbWUoYyl9KS5jb25jYXQoW1wiaG8uY29tcG9uZW50cy5Db21wb25lbnRcIl0pXG5cbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNvbXBvbmVudExvYWRlci5sb2FkKHtcbiAgICAgICAgICAgICAgICBuYW1lLFxuICAgICAgICAgICAgICAgIHVybDogbWFwcGluZ1tuYW1lXSxcbiAgICAgICAgICAgICAgICBzdXBlcjogc3VwXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLnRoZW4oY2xhc3NlcyA9PiB7XG4gICAgICAgICAgICAgICAgY2xhc3Nlcy5tYXAoYyA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYucmVnaXN0ZXIoPHR5cGVvZiBDb21wb25lbnQ+Yyk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNsYXNzZXMucG9wKCk7XG4gICAgICAgICAgICB9KVxuXG5cbiAgICAgICAgICAgIC8qXG4gICAgICAgICAgICBsZXQgc2VsZiA9IHRoaXM7XG5cbiAgICAgICAgICAgIHJldHVybiB0aGlzLmdldFBhcmVudE9mQ29tcG9uZW50KG5hbWUpXG4gICAgICAgICAgICAudGhlbigocGFyZW50KSA9PiB7XG4gICAgICAgICAgICAgICAgaWYoc2VsZi5oYXNDb21wb25lbnQocGFyZW50KSB8fCBwYXJlbnQgPT09ICdoby5jb21wb25lbnRzLkNvbXBvbmVudCcpXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgIGVsc2UgcmV0dXJuIHNlbGYubG9hZENvbXBvbmVudChwYXJlbnQpO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC50aGVuKChwYXJlbnRUeXBlKSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGhvLmNvbXBvbmVudHMuY29tcG9uZW50cHJvdmlkZXIuaW5zdGFuY2UuZ2V0Q29tcG9uZW50KG5hbWUpXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLnRoZW4oKGNvbXBvbmVudCkgPT4ge1xuICAgICAgICAgICAgICAgIHNlbGYucmVnaXN0ZXIoY29tcG9uZW50KTtcbiAgICAgICAgICAgICAgICByZXR1cm4gY29tcG9uZW50O1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAvL3JldHVybiB0aGlzLm9wdGlvbnMuY29tcG9uZW50UHJvdmlkZXIuZ2V0Q29tcG9uZW50KG5hbWUpXG4gICAgICAgICAgICAqL1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIGxvYWRBdHRyaWJ1dGUobmFtZTogc3RyaW5nKTogUHJvbWlzZTx0eXBlb2YgQXR0cmlidXRlLCBzdHJpbmc+IHtcblxuICAgICAgICAgICAgbGV0IHNlbGYgPSB0aGlzO1xuXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5hdHRyaWJ1dGVMb2FkZXIubG9hZCh7XG4gICAgICAgICAgICAgICAgbmFtZSxcbiAgICAgICAgICAgICAgICB1cmw6IG1hcHBpbmdbbmFtZV0sXG4gICAgICAgICAgICAgICAgc3VwZXI6IFtcImhvLmNvbXBvbmVudHMuQXR0cmlidXRlXCIsIFwiaG8uY29tcG9uZW50cy5XYXRjaEF0dHJpYnV0ZVwiXVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC50aGVuKGNsYXNzZXMgPT4ge1xuICAgICAgICAgICAgICAgIGNsYXNzZXMubWFwKGMgPT4ge1xuICAgICAgICAgICAgICAgICAgICBzZWxmLnJlZ2lzdGVyKDx0eXBlb2YgQXR0cmlidXRlPmMpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHJldHVybiBjbGFzc2VzLnBvcCgpO1xuICAgICAgICAgICAgfSlcblxuXG4gICAgICAgICAgICAvKlxuICAgICAgICAgICAgbGV0IHNlbGYgPSB0aGlzO1xuXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5nZXRQYXJlbnRPZkF0dHJpYnV0ZShuYW1lKVxuICAgICAgICAgICAgLnRoZW4oKHBhcmVudCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmKHNlbGYuaGFzQXR0cmlidXRlKHBhcmVudCkgfHwgcGFyZW50ID09PSAnaG8uY29tcG9uZW50cy5BdHRyaWJ1dGUnIHx8IHBhcmVudCA9PT0gJ2hvLmNvbXBvbmVudHMuV2F0Y2hBdHRyaWJ1dGUnKVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICBlbHNlIHJldHVybiBzZWxmLmxvYWRBdHRyaWJ1dGUocGFyZW50KTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAudGhlbigocGFyZW50VHlwZSkgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiBoby5jb21wb25lbnRzLmF0dHJpYnV0ZXByb3ZpZGVyLmluc3RhbmNlLmdldEF0dHJpYnV0ZShuYW1lKVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC50aGVuKChhdHRyaWJ1dGUpID0+IHtcbiAgICAgICAgICAgICAgICBzZWxmLnJlZ2lzdGVyKGF0dHJpYnV0ZSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGF0dHJpYnV0ZTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgKi9cblxuICAgICAgICAgICAgLypcbiAgICAgICAgICAgIGxldCBzZWxmID0gdGhpcztcbiAgICAgICAgICAgIHJldHVybiBuZXcgUHJvbWlzZTx0eXBlb2YgQXR0cmlidXRlLCBzdHJpbmc+KChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgICAgICBoby5jb21wb25lbnRzLmF0dHJpYnV0ZXByb3ZpZGVyLmluc3RhbmNlLmdldEF0dHJpYnV0ZShuYW1lKVxuICAgICAgICAgICAgICAgIC50aGVuKChhdHRyaWJ1dGUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5yZWdpc3RlcihhdHRyaWJ1dGUpO1xuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKGF0dHJpYnV0ZSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICovXG4gICAgICAgIH1cblxuICAgICAgICAvKlxuXG4gICAgICAgIHByb3RlY3RlZCBnZXRQYXJlbnRPZkNvbXBvbmVudChuYW1lOiBzdHJpbmcpOiBQcm9taXNlPHN0cmluZywgYW55PiB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5nZXRQYXJlbnRPZkNsYXNzKGhvLmNvbXBvbmVudHMuY29tcG9uZW50cHJvdmlkZXIuaW5zdGFuY2UucmVzb2x2ZShuYW1lKSk7XG4gICAgICAgIH1cblxuICAgICAgICBwcm90ZWN0ZWQgZ2V0UGFyZW50T2ZBdHRyaWJ1dGUobmFtZTogc3RyaW5nKTogUHJvbWlzZTxzdHJpbmcsIGFueT4ge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZ2V0UGFyZW50T2ZDbGFzcyhoby5jb21wb25lbnRzLmF0dHJpYnV0ZXByb3ZpZGVyLmluc3RhbmNlLnJlc29sdmUobmFtZSkpO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJvdGVjdGVkIGdldFBhcmVudE9mQ2xhc3MocGF0aDogc3RyaW5nKTogUHJvbWlzZTxzdHJpbmcsIGFueT4ge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcblxuICAgICAgICAgICAgICAgIGxldCB4bWxodHRwID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgICAgICAgICAgICAgeG1saHR0cC5vbnJlYWR5c3RhdGVjaGFuZ2UgPSAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmKHhtbGh0dHAucmVhZHlTdGF0ZSA9PSA0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgcmVzcCA9IHhtbGh0dHAucmVzcG9uc2VUZXh0O1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYoeG1saHR0cC5zdGF0dXMgPT0gMjAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IG0gPSByZXNwLm1hdGNoKC99XFwpXFwoKC4qKVxcKTsvKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZihtICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUobVsxXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKG51bGwpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVqZWN0KHJlc3ApO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgeG1saHR0cC5vcGVuKCdHRVQnLCBwYXRoKTtcbiAgICAgICAgICAgICAgICB4bWxodHRwLnNlbmQoKTtcblxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICAqL1xuXG4gICAgfVxuXG4gICAgZXhwb3J0IGxldCBpbnN0YW5jZSA9IG5ldyBSZWdpc3RyeSgpO1xufVxuIiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uLy4uLy4uL2Jvd2VyX2NvbXBvbmVudHMvaG8tcHJvbWlzZS9kaXN0L3Byb21pc2UuZC50c1wiLz5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi8uLi8uLi9ib3dlcl9jb21wb25lbnRzL2hvLWNsYXNzbG9hZGVyL2Rpc3QvY2xhc3Nsb2FkZXIuZC50c1wiLz5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi8uLi8uLi9ib3dlcl9jb21wb25lbnRzL2hvLXdhdGNoL2Rpc3Qvd2F0Y2guZC50c1wiLz5cblxubW9kdWxlIGhvLmNvbXBvbmVudHMge1xuXHRleHBvcnQgZnVuY3Rpb24gcnVuKCk6IGhvLnByb21pc2UuUHJvbWlzZTxhbnksIGFueT4ge1xuXHRcdHJldHVybiBoby5jb21wb25lbnRzLnJlZ2lzdHJ5Lmluc3RhbmNlLnJ1bigpO1xuXHR9XG5cblx0ZXhwb3J0IGZ1bmN0aW9uIHJlZ2lzdGVyKGM6IHR5cGVvZiBDb21wb25lbnQgfCB0eXBlb2YgQXR0cmlidXRlKTogdm9pZCB7XG5cdFx0aG8uY29tcG9uZW50cy5yZWdpc3RyeS5pbnN0YW5jZS5yZWdpc3RlcihjKTtcblx0fVxuXG59XG4iLCJtb2R1bGUgaG8uZmx1eCB7XHJcblxyXG5cdGV4cG9ydCBjbGFzcyBDYWxsYmFja0hvbGRlciB7XHJcblxyXG5cdFx0cHJvdGVjdGVkIHByZWZpeDogc3RyaW5nID0gJ0lEXyc7XHJcbiAgICBcdHByb3RlY3RlZCBsYXN0SUQ6IG51bWJlciA9IDE7XHJcblx0XHRwcm90ZWN0ZWQgY2FsbGJhY2tzOiB7W2tleTpzdHJpbmddOkZ1bmN0aW9ufSA9IHt9O1xyXG5cclxuXHRcdHB1YmxpYyByZWdpc3RlcihjYWxsYmFjazogRnVuY3Rpb24sIHNlbGY/OiBhbnkpOiBzdHJpbmcge1xyXG4gICAgXHRcdGxldCBpZCA9IHRoaXMucHJlZml4ICsgdGhpcy5sYXN0SUQrKztcclxuICAgIFx0XHR0aGlzLmNhbGxiYWNrc1tpZF0gPSBzZWxmID8gY2FsbGJhY2suYmluZChzZWxmKSA6IGNhbGxiYWNrO1xyXG4gICAgXHRcdHJldHVybiBpZDtcclxuICBcdFx0fVxyXG5cclxuICBcdFx0cHVibGljIHVucmVnaXN0ZXIoaWQpIHtcclxuICAgICAgXHRcdGlmKCF0aGlzLmNhbGxiYWNrc1tpZF0pXHJcblx0XHRcdFx0dGhyb3cgJ0NvdWxkIG5vdCB1bnJlZ2lzdGVyIGNhbGxiYWNrIGZvciBpZCAnICsgaWQ7XHJcbiAgICBcdFx0ZGVsZXRlIHRoaXMuY2FsbGJhY2tzW2lkXTtcclxuICBcdFx0fTtcclxuXHR9XHJcbn1cclxuIiwiXHJcbm1vZHVsZSBoby5mbHV4IHtcclxuXHRpbXBvcnQgUHJvbWlzZSA9IGhvLnByb21pc2UuUHJvbWlzZTtcclxuXHJcblxyXG5cdGV4cG9ydCBpbnRlcmZhY2UgSVN0YXRlIHtcclxuXHRcdG5hbWU6IHN0cmluZztcclxuXHRcdHVybDogc3RyaW5nO1xyXG5cdFx0cmVkaXJlY3Q/OiBzdHJpbmc7XHJcblx0XHRiZWZvcmU/OiAoZGF0YTogSVJvdXRlRGF0YSk9PlByb21pc2U8YW55LCBhbnk+O1xyXG5cdFx0dmlldz86IEFycmF5PElWaWV3U3RhdGU+O1xyXG5cdH1cclxuXHJcblx0ZXhwb3J0IGludGVyZmFjZSBJVmlld1N0YXRlIHtcclxuXHQgICAgbmFtZTogc3RyaW5nO1xyXG5cdFx0aHRtbDogc3RyaW5nO1xyXG5cdH1cclxuXHJcblx0ZXhwb3J0IGludGVyZmFjZSBJU3RhdGVzIHtcclxuXHQgICAgc3RhdGVzOiBBcnJheTxJU3RhdGU+O1xyXG5cdH1cclxuXHJcbn1cclxuIiwiXHJcbm1vZHVsZSBoby5mbHV4LnJlZ2lzdHJ5IHtcclxuXHRpbXBvcnQgUHJvbWlzZSA9IGhvLnByb21pc2UuUHJvbWlzZTtcclxuXHJcblx0ZXhwb3J0IGxldCBtYXBwaW5nOiB7W2tleTpzdHJpbmddOnN0cmluZ30gPSB7fTtcclxuXHRleHBvcnQgbGV0IHVzZURpciA9IHRydWU7XHJcblxyXG5cdGV4cG9ydCBjbGFzcyBSZWdpc3RyeSB7XHJcblxyXG5cdFx0cHJpdmF0ZSBzdG9yZXM6IHtba2V5OiBzdHJpbmddOiBTdG9yZTxhbnk+fSA9IHt9O1xyXG5cclxuXHRcdHByaXZhdGUgc3RvcmVMb2FkZXIgPSBuZXcgaG8uY2xhc3Nsb2FkZXIuQ2xhc3NMb2FkZXIoe1xyXG4gICAgICAgICAgIHVybFRlbXBsYXRlOiAnc3RvcmVzLyR7bmFtZX0uanMnLFxyXG4gICAgICAgICAgIHVzZURpclxyXG4gICAgICAgfSk7XHJcblxyXG5cdFx0cHVibGljIHJlZ2lzdGVyKHN0b3JlOiBTdG9yZTxhbnk+KTogU3RvcmU8YW55PiB7XHJcblx0XHRcdHRoaXMuc3RvcmVzW3N0b3JlLm5hbWVdID0gc3RvcmU7XHJcblx0XHRcdHJldHVybiBzdG9yZTtcclxuXHRcdH1cclxuXHJcblx0XHRwdWJsaWMgZ2V0KHN0b3JlQ2xhc3M6IHN0cmluZyk6IFN0b3JlPGFueT5cclxuXHRcdHB1YmxpYyBnZXQ8VCBleHRlbmRzIFN0b3JlPGFueT4+KHN0b3JlQ2xhc3M6IHtuZXcoKTpUfSk6IFRcclxuXHRcdHB1YmxpYyBnZXQ8VCBleHRlbmRzIFN0b3JlPGFueT4+KHN0b3JlQ2xhc3M6IGFueSk6IFQge1xyXG5cdFx0XHRsZXQgbmFtZSA9IHZvaWQgMDtcclxuXHRcdFx0aWYodHlwZW9mIHN0b3JlQ2xhc3MgPT09ICdzdHJpbmcnKVxyXG5cdFx0XHRcdG5hbWUgPSBzdG9yZUNsYXNzO1xyXG5cdFx0XHRlbHNlXHJcblx0XHRcdFx0bmFtZSA9IHN0b3JlQ2xhc3MudG9TdHJpbmcoKS5tYXRjaCgvXFx3Ky9nKVsxXTtcclxuXHRcdFx0cmV0dXJuIDxUPnRoaXMuc3RvcmVzW25hbWVdO1xyXG5cdFx0fVxyXG5cclxuXHRcdHB1YmxpYyBsb2FkU3RvcmUobmFtZTogc3RyaW5nKTogUHJvbWlzZTxTdG9yZTxhbnk+LCBzdHJpbmc+IHtcclxuXHJcblx0XHRcdGxldCBzZWxmID0gdGhpcztcclxuXHJcblx0XHRcdGlmKCEhdGhpcy5zdG9yZXNbbmFtZV0pXHJcblx0XHRcdFx0cmV0dXJuIFByb21pc2UuY3JlYXRlKHRoaXMuc3RvcmVzW25hbWVdKTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnN0b3JlTG9hZGVyLmxvYWQoe1xyXG4gICAgICAgICAgICAgICAgbmFtZSxcclxuXHRcdFx0XHR1cmw6IG1hcHBpbmdbbmFtZV0sXHJcbiAgICAgICAgICAgICAgICBzdXBlcjogW1wiaG8uZmx1eC5TdG9yZVwiXVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAudGhlbigoY2xhc3NlczogQXJyYXk8dHlwZW9mIFN0b3JlPikgPT4ge1xyXG4gICAgICAgICAgICAgICAgY2xhc3Nlcy5tYXAoYyA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5yZWdpc3RlcihuZXcgYykuaW5pdCgpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gc2VsZi5nZXQoY2xhc3Nlcy5wb3AoKSk7XHJcbiAgICAgICAgICAgIH0pXHJcblxyXG5cdFx0XHQvKlxyXG5cdFx0XHRsZXQgc2VsZiA9IHRoaXM7XHJcblxyXG5cdFx0ICAgXHRsZXQgcmV0ID0gdGhpcy5nZXRQYXJlbnRPZlN0b3JlKG5hbWUpXHJcblx0XHQgICBcdC50aGVuKChwYXJlbnQpID0+IHtcclxuXHRcdFx0ICAgXHRpZihzZWxmLnN0b3Jlc1twYXJlbnRdIGluc3RhbmNlb2YgU3RvcmUgfHwgcGFyZW50ID09PSAnaG8uZmx1eC5TdG9yZScpXHJcblx0XHRcdFx0ICAgXHRyZXR1cm4gdHJ1ZTtcclxuXHQgICBcdFx0XHRlbHNlXHJcblx0XHRcdCAgIFx0XHRyZXR1cm4gc2VsZi5sb2FkU3RvcmUocGFyZW50KTtcclxuXHRcdCAgIFx0fSlcclxuXHRcdCAgIFx0LnRoZW4oKHBhcmVudFR5cGUpID0+IHtcclxuXHRcdFx0ICAgXHRyZXR1cm4gaG8uZmx1eC5zdG9yZXByb3ZpZGVyLmluc3RhbmNlLmdldFN0b3JlKG5hbWUpO1xyXG5cdFx0ICAgXHR9KVxyXG5cdFx0ICAgXHQudGhlbigoc3RvcmVDbGFzcykgPT4ge1xyXG5cdFx0XHQgICBcdHJldHVybiBzZWxmLnJlZ2lzdGVyKG5ldyBzdG9yZUNsYXNzKS5pbml0KCk7XHJcblx0XHQgICBcdH0pXHJcblx0XHRcdC50aGVuKCgpPT57XHJcblx0XHRcdCAgIFx0cmV0dXJuIHNlbGYuc3RvcmVzW25hbWVdO1xyXG5cdFx0XHR9KTtcclxuXHJcblx0XHRcdHJldHVybiByZXQ7XHJcblx0XHRcdCovXHJcblxyXG5cdFx0XHQvKlxyXG5cdFx0XHRyZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XHJcblx0XHRcdFx0aWYodGhpcy5nZXQobmFtZSkgaW5zdGFuY2VvZiBTdG9yZSlcclxuXHRcdFx0XHRcdHJlc29sdmUodGhpcy5nZXQobmFtZSkpXHJcblx0XHRcdFx0ZWxzZSB7XHJcblxyXG5cdFx0XHRcdFx0c3RvcmVwcm92aWRlci5pbnN0YW5jZS5nZXRTdG9yZShuYW1lKVxyXG5cdFx0XHRcdFx0LnRoZW4oKHN0b3JlQ2xhc3MpID0+IHtcclxuXHRcdFx0XHRcdFx0dGhpcy5yZWdpc3RlcihuZXcgc3RvcmVDbGFzcygpKTtcclxuXHRcdFx0XHRcdFx0cmVzb2x2ZSh0aGlzLmdldChuYW1lKSk7XHJcblx0XHRcdFx0XHR9KVxyXG5cdFx0XHRcdFx0LmNhdGNoKHJlamVjdCk7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0fS5iaW5kKHRoaXMpKTtcclxuXHRcdFx0Ki9cclxuXHJcblx0XHRcdC8qXHJcblx0XHRcdGlmKFNUT1JFU1tuYW1lXSAhPT0gdW5kZWZpbmVkICYmIFNUT1JFU1tuYW1lXSBpbnN0YW5jZW9mIFN0b3JlKVxyXG5cdFx0XHRcdHJldHVybiBQcm9taXNlLmNyZWF0ZShTVE9SRVNbbmFtZV0pO1xyXG5cdFx0XHRlbHNlIHtcclxuXHRcdFx0XHRyZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG5cdFx0XHRcdFx0c3RvcmVwcm92aWRlci5pbnN0YW5jZS5nZXRTdG9yZShuYW1lKVxyXG5cdFx0XHRcdFx0LnRoZW4oKHMpPT57cmVzb2x2ZShzKTt9KVxyXG5cdFx0XHRcdFx0LmNhdGNoKChlKT0+e3JlamVjdChlKTt9KTtcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0fVxyXG5cdFx0XHQqL1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvKlxyXG5cdFx0cHJvdGVjdGVkIGdldFBhcmVudE9mU3RvcmUobmFtZTogc3RyaW5nKTogUHJvbWlzZTxzdHJpbmcsIGFueT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG5cclxuICAgICAgICAgICAgICAgIGxldCB4bWxodHRwID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XHJcbiAgICAgICAgICAgICAgICB4bWxodHRwLm9ucmVhZHlzdGF0ZWNoYW5nZSA9ICgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBpZih4bWxodHRwLnJlYWR5U3RhdGUgPT0gNCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgcmVzcCA9IHhtbGh0dHAucmVzcG9uc2VUZXh0O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZih4bWxodHRwLnN0YXR1cyA9PSAyMDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBtID0gcmVzcC5tYXRjaCgvfVxcKVxcKCguKilcXCk7Lyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZihtICE9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShtWzFdKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUobnVsbCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZWplY3QocmVzcCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgICAgICB4bWxodHRwLm9wZW4oJ0dFVCcsIGhvLmZsdXguc3RvcmVwcm92aWRlci5pbnN0YW5jZS5yZXNvbHZlKG5hbWUpKTtcclxuICAgICAgICAgICAgICAgIHhtbGh0dHAuc2VuZCgpO1xyXG5cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cdFx0Ki9cclxuXHR9XHJcblxyXG59XHJcbiIsIlxyXG5tb2R1bGUgaG8uZmx1eC5zdGF0ZXByb3ZpZGVyIHtcclxuXHRpbXBvcnQgUHJvbWlzZSA9IGhvLnByb21pc2UuUHJvbWlzZTtcclxuXHJcbiAgICBleHBvcnQgaW50ZXJmYWNlIElTdGF0ZVByb3ZpZGVyIHtcclxuICAgICAgICB1c2VNaW46Ym9vbGVhbjtcclxuXHRcdHJlc29sdmUoKTogc3RyaW5nO1xyXG5cdFx0Z2V0U3RhdGVzKG5hbWU/OnN0cmluZyk6IFByb21pc2U8SVN0YXRlcywgc3RyaW5nPjtcclxuICAgIH1cclxuXHJcblx0Y2xhc3MgU3RhdGVQcm92aWRlciBpbXBsZW1lbnRzIElTdGF0ZVByb3ZpZGVyIHtcclxuXHJcbiAgICAgICAgdXNlTWluOiBib29sZWFuID0gZmFsc2U7XHJcblxyXG4gICAgICAgIHJlc29sdmUoKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMudXNlTWluID9cclxuICAgICAgICAgICAgICAgIGBzdGF0ZXMubWluLmpzYCA6XHJcbiAgICAgICAgICAgICAgICBgc3RhdGVzLmpzYDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGdldFN0YXRlcyhuYW1lID0gXCJTdGF0ZXNcIik6IFByb21pc2U8SVN0YXRlcywgc3RyaW5nPiB7XHJcblx0XHRcdHJldHVybiBuZXcgUHJvbWlzZTxJU3RhdGVzLCBhbnk+KChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuXHRcdFx0XHRsZXQgc3JjID0gdGhpcy5yZXNvbHZlKCk7XHJcbiAgICAgICAgICAgICAgICBsZXQgc2NyaXB0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc2NyaXB0Jyk7XHJcbiAgICAgICAgICAgICAgICBzY3JpcHQub25sb2FkID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShuZXcgd2luZG93W25hbWVdKTtcclxuICAgICAgICAgICAgICAgIH07XHJcblx0XHRcdFx0c2NyaXB0Lm9uZXJyb3IgPSAoZSkgPT4ge1xyXG5cdFx0XHRcdFx0cmVqZWN0KGUpO1xyXG5cdFx0XHRcdH07XHJcbiAgICAgICAgICAgICAgICBzY3JpcHQuc3JjID0gc3JjO1xyXG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2hlYWQnKVswXS5hcHBlbmRDaGlsZChzY3JpcHQpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgbGV0IGluc3RhbmNlOiBJU3RhdGVQcm92aWRlciA9IG5ldyBTdGF0ZVByb3ZpZGVyKCk7XHJcbn1cclxuIiwiXHJcbm1vZHVsZSBoby5mbHV4IHtcclxuXHJcblx0ZXhwb3J0IGNsYXNzIFN0b3JlPFQ+IGV4dGVuZHMgQ2FsbGJhY2tIb2xkZXIge1xyXG5cclxuXHRcdHByb3RlY3RlZCBkYXRhOiBUO1xyXG5cdFx0cHJpdmF0ZSBpZDogc3RyaW5nO1xyXG5cdFx0cHJpdmF0ZSBoYW5kbGVyczoge1trZXk6IHN0cmluZ106IEZ1bmN0aW9ufSA9IHt9O1xyXG5cclxuXHJcblx0XHRjb25zdHJ1Y3RvcigpIHtcclxuXHRcdFx0c3VwZXIoKTtcclxuXHRcdFx0dGhpcy5pZCA9IGhvLmZsdXguRElTUEFUQ0hFUi5yZWdpc3Rlcih0aGlzLmhhbmRsZS5iaW5kKHRoaXMpKTtcclxuXHRcdFx0Ly9oby5mbHV4LlNUT1JFU1t0aGlzLm5hbWVdID0gdGhpcztcclxuXHRcdFx0aG8uZmx1eC5TVE9SRVMucmVnaXN0ZXIodGhpcyk7XHJcblx0XHR9XHJcblxyXG5cdFx0cHVibGljIGluaXQoKTogYW55IHt9XHJcblxyXG5cdFx0IGdldCBuYW1lKCk6IHN0cmluZyB7XHJcblx0XHRcdHJldHVybiB0aGlzLmNvbnN0cnVjdG9yLnRvU3RyaW5nKCkubWF0Y2goL1xcdysvZylbMV07XHJcblx0XHR9XHJcblxyXG5cdFx0cHVibGljIHJlZ2lzdGVyKGNhbGxiYWNrOiAoZGF0YTpUKT0+dm9pZCwgc2VsZj86YW55KTogc3RyaW5nIHtcclxuXHRcdFx0cmV0dXJuIHN1cGVyLnJlZ2lzdGVyKGNhbGxiYWNrLCBzZWxmKTtcclxuXHRcdH1cclxuXHJcblx0XHRwcm90ZWN0ZWQgb24odHlwZTogc3RyaW5nLCBmdW5jOiBGdW5jdGlvbik6IHZvaWQge1xyXG5cdFx0XHR0aGlzLmhhbmRsZXJzW3R5cGVdID0gZnVuYztcclxuXHRcdH1cclxuXHJcblx0XHRwcm90ZWN0ZWQgaGFuZGxlKGFjdGlvbjogSUFjdGlvbik6IHZvaWQge1xyXG5cdFx0XHRpZih0eXBlb2YgdGhpcy5oYW5kbGVyc1thY3Rpb24udHlwZV0gPT09ICdmdW5jdGlvbicpXHJcblx0XHRcdFx0dGhpcy5oYW5kbGVyc1thY3Rpb24udHlwZV0oYWN0aW9uLmRhdGEpO1xyXG5cdFx0fTtcclxuXHJcblxyXG5cdFx0cHJvdGVjdGVkIGNoYW5nZWQoKTogdm9pZCB7XHJcblx0XHRcdGZvciAobGV0IGlkIGluIHRoaXMuY2FsbGJhY2tzKSB7XHJcblx0XHRcdCAgbGV0IGNiID0gdGhpcy5jYWxsYmFja3NbaWRdO1xyXG5cdFx0XHQgIGlmKGNiKVxyXG5cdFx0XHQgIFx0Y2IodGhpcy5kYXRhKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHJcblx0fTtcclxuXHJcblxyXG59XHJcbiIsIlxyXG5cclxubW9kdWxlIGhvLmZsdXgge1xyXG5cclxuXHRpbXBvcnQgUHJvbWlzZSA9IGhvLnByb21pc2UuUHJvbWlzZTtcclxuXHJcblxyXG5cdC8qKiBEYXRhIHRoYXQgYSBSb3V0ZXIjZ28gdGFrZXMgKi9cclxuXHRleHBvcnQgaW50ZXJmYWNlIElSb3V0ZURhdGEge1xyXG5cdCAgICBzdGF0ZTogc3RyaW5nO1xyXG5cdFx0YXJnczogYW55O1xyXG5cdFx0ZXh0ZXJuOiBib29sZWFuO1xyXG5cdH1cclxuXHJcblx0LyoqIERhdGEgdGhhdCBSb3V0ZXIjY2hhbmdlcyBlbWl0IHRvIGl0cyBsaXN0ZW5lcnMgKi9cclxuXHRleHBvcnQgaW50ZXJmYWNlIElSb3V0ZXJEYXRhIHtcclxuXHQgICAgc3RhdGU6IElTdGF0ZTtcclxuXHRcdGFyZ3M6IGFueTtcclxuXHRcdGV4dGVybjogYm9vbGVhbjtcclxuXHR9XHJcblxyXG5cdGV4cG9ydCBjbGFzcyBSb3V0ZXIgZXh0ZW5kcyBTdG9yZTxJUm91dGVyRGF0YT4ge1xyXG5cclxuXHRcdHByaXZhdGUgbWFwcGluZzpBcnJheTxJU3RhdGU+ID0gbnVsbDtcclxuXHJcblx0XHRwdWJsaWMgaW5pdCgpOiBQcm9taXNlPGFueSwgYW55PiB7XHJcblx0XHRcdHRoaXMub24oJ1NUQVRFJywgdGhpcy5vblN0YXRlQ2hhbmdlUmVxdWVzdGVkLmJpbmQodGhpcykpO1xyXG5cclxuXHRcdFx0bGV0IG9uSGFzaENoYW5nZSA9IHRoaXMub25IYXNoQ2hhbmdlLmJpbmQodGhpcyk7XHJcblxyXG5cdFx0XHRyZXR1cm4gdGhpcy5pbml0U3RhdGVzKClcclxuXHRcdFx0LnRoZW4oKCkgPT4ge1xyXG5cdFx0XHRcdHdpbmRvdy5vbmhhc2hjaGFuZ2UgPSBvbkhhc2hDaGFuZ2U7XHJcblx0XHRcdFx0b25IYXNoQ2hhbmdlKCk7XHJcblx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cclxuXHRcdHB1YmxpYyBnbyhzdGF0ZTogc3RyaW5nLCBkYXRhPzogYW55KTogdm9pZFxyXG5cdFx0cHVibGljIGdvKGRhdGE6IElSb3V0ZURhdGEpOiB2b2lkXHJcblx0XHRwdWJsaWMgZ28oZGF0YTogSVJvdXRlRGF0YSB8IHN0cmluZywgYXJncz86IGFueSk6IHZvaWQge1xyXG5cclxuXHRcdFx0bGV0IF9kYXRhOiBJUm91dGVEYXRhID0ge1xyXG5cdFx0XHRcdHN0YXRlOiB1bmRlZmluZWQsXHJcblx0XHRcdFx0YXJnczogdW5kZWZpbmVkLFxyXG5cdFx0XHRcdGV4dGVybjogZmFsc2VcclxuXHRcdFx0fTtcclxuXHJcblx0XHRcdGlmKHR5cGVvZiBkYXRhID09PSAnc3RyaW5nJykge1xyXG5cdFx0XHRcdF9kYXRhLnN0YXRlID0gZGF0YTtcclxuXHRcdFx0XHRfZGF0YS5hcmdzID0gYXJncztcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRfZGF0YS5zdGF0ZSA9IGRhdGEuc3RhdGU7XHJcblx0XHRcdFx0X2RhdGEuYXJncyA9IGRhdGEuYXJncztcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0aG8uZmx1eC5ESVNQQVRDSEVSLmRpc3BhdGNoKHtcclxuXHRcdFx0XHR0eXBlOiAnU1RBVEUnLFxyXG5cdFx0XHRcdGRhdGE6IF9kYXRhXHJcblx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cclxuXHRcdHByaXZhdGUgaW5pdFN0YXRlcygpOiBQcm9taXNlPGFueSwgYW55PiB7XHJcblx0XHRcdHJldHVybiBzdGF0ZXByb3ZpZGVyLmluc3RhbmNlLmdldFN0YXRlcygpXHJcblx0XHRcdC50aGVuKGZ1bmN0aW9uKGlzdGF0ZXMpIHtcclxuXHRcdFx0XHR0aGlzLm1hcHBpbmcgPSBpc3RhdGVzLnN0YXRlcztcclxuXHRcdFx0fS5iaW5kKHRoaXMpKTtcclxuXHRcdH1cclxuXHJcblx0XHRwcml2YXRlIGdldFN0YXRlRnJvbU5hbWUobmFtZTogc3RyaW5nKTogSVN0YXRlIHtcclxuXHRcdFx0cmV0dXJuIHRoaXMubWFwcGluZy5maWx0ZXIoKHMpPT57XHJcblx0XHRcdFx0cmV0dXJuIHMubmFtZSA9PT0gbmFtZVxyXG5cdFx0XHR9KVswXTtcclxuXHRcdH1cclxuXHJcblx0XHRwcm90ZWN0ZWQgb25TdGF0ZUNoYW5nZVJlcXVlc3RlZChkYXRhOiBJUm91dGVEYXRhKTogdm9pZCB7XHJcblx0XHRcdC8vZ2V0IHJlcXVlc3RlZCBzdGF0ZVxyXG5cdFx0XHRsZXQgc3RhdGUgPSB0aGlzLmdldFN0YXRlRnJvbU5hbWUoZGF0YS5zdGF0ZSk7XHJcblx0XHRcdGxldCB1cmwgPSB0aGlzLnVybEZyb21TdGF0ZShzdGF0ZS51cmwsIGRhdGEuYXJncyk7XHJcblxyXG5cdFx0XHQvL2N1cnJlbnQgc3RhdGUgYW5kIGFyZ3MgZXF1YWxzIHJlcXVlc3RlZCBzdGF0ZSBhbmQgYXJncyAtPiByZXR1cm5cclxuXHRcdFx0aWYoXHJcblx0XHRcdFx0dGhpcy5kYXRhICYmXHJcblx0XHRcdFx0dGhpcy5kYXRhLnN0YXRlICYmXHJcblx0XHRcdFx0dGhpcy5kYXRhLnN0YXRlLm5hbWUgPT09IGRhdGEuc3RhdGUgJiZcclxuXHRcdFx0XHR0aGlzLmVxdWFscyh0aGlzLmRhdGEuYXJncywgZGF0YS5hcmdzKSAmJlxyXG5cdFx0XHRcdHVybCA9PT0gd2luZG93LmxvY2F0aW9uLmhhc2guc3Vic3RyKDEpXHJcblx0XHRcdCkge1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cclxuXHJcblxyXG5cdFx0XHQvL3JlcXVlc3RlZCBzdGF0ZSBoYXMgYW4gcmVkaXJlY3QgcHJvcGVydHkgLT4gY2FsbCByZWRpcmVjdCBzdGF0ZVxyXG5cdFx0XHRpZighIXN0YXRlLnJlZGlyZWN0KSB7XHJcblx0XHRcdFx0c3RhdGUgPSB0aGlzLmdldFN0YXRlRnJvbU5hbWUoc3RhdGUucmVkaXJlY3QpO1xyXG5cdFx0XHR9XHJcblxyXG5cclxuXHRcdFx0bGV0IHByb20gPSB0eXBlb2Ygc3RhdGUuYmVmb3JlID09PSAnZnVuY3Rpb24nID8gc3RhdGUuYmVmb3JlKGRhdGEpIDogUHJvbWlzZS5jcmVhdGUodW5kZWZpbmVkKTtcclxuXHRcdFx0cHJvbVxyXG5cdFx0XHQudGhlbihmdW5jdGlvbigpIHtcclxuXHJcblx0XHRcdFx0Ly9kb2VzIHRoZSBzdGF0ZSBjaGFuZ2UgcmVxdWVzdCBjb21lcyBmcm9tIGV4dGVybiBlLmcuIHVybCBjaGFuZ2UgaW4gYnJvd3NlciB3aW5kb3cgP1xyXG5cdFx0XHRcdGxldCBleHRlcm4gPSAhISBkYXRhLmV4dGVybjtcclxuXHJcblx0XHRcdFx0dGhpcy5kYXRhID0ge1xyXG5cdFx0XHRcdFx0c3RhdGU6IHN0YXRlLFxyXG5cdFx0XHRcdFx0YXJnczogZGF0YS5hcmdzLFxyXG5cdFx0XHRcdFx0ZXh0ZXJuOiBleHRlcm4sXHJcblx0XHRcdFx0fTtcclxuXHJcblx0XHRcdFx0Ly8tLS0tLS0tIHNldCB1cmwgZm9yIGJyb3dzZXJcclxuXHRcdFx0XHR2YXIgdXJsID0gdGhpcy51cmxGcm9tU3RhdGUoc3RhdGUudXJsLCBkYXRhLmFyZ3MpO1xyXG5cdFx0XHRcdHRoaXMuc2V0VXJsKHVybCk7XHJcblxyXG5cdFx0XHRcdHRoaXMuY2hhbmdlZCgpO1xyXG5cclxuXHRcdFx0fS5iaW5kKHRoaXMpLFxyXG5cdFx0XHRmdW5jdGlvbihkYXRhKSB7XHJcblx0XHRcdFx0dGhpcy5vblN0YXRlQ2hhbmdlUmVxdWVzdGVkKGRhdGEpO1xyXG5cdFx0XHR9LmJpbmQodGhpcykpO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHRwcml2YXRlIG9uSGFzaENoYW5nZSgpOiB2b2lkIHtcclxuXHRcdFx0bGV0IHMgPSB0aGlzLnN0YXRlRnJvbVVybCh3aW5kb3cubG9jYXRpb24uaGFzaC5zdWJzdHIoMSkpO1xyXG5cclxuXHRcdFx0aG8uZmx1eC5ESVNQQVRDSEVSLmRpc3BhdGNoKHtcclxuXHRcdFx0XHR0eXBlOiAnU1RBVEUnLFxyXG5cdFx0XHRcdGRhdGE6IHtcclxuXHRcdFx0XHRcdHN0YXRlOiBzLnN0YXRlLFxyXG5cdFx0XHRcdFx0YXJnczogcy5hcmdzLFxyXG5cdFx0XHRcdFx0ZXh0ZXJuOiB0cnVlLFxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblxyXG5cdFx0cHJpdmF0ZSBzZXRVcmwodXJsOiBzdHJpbmcpOiB2b2lkIHtcclxuXHRcdFx0aWYod2luZG93LmxvY2F0aW9uLmhhc2guc3Vic3RyKDEpID09PSB1cmwpXHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cclxuXHRcdFx0bGV0IGwgPSB3aW5kb3cub25oYXNoY2hhbmdlO1xyXG5cdFx0XHR3aW5kb3cub25oYXNoY2hhbmdlID0gbnVsbDtcclxuXHRcdFx0d2luZG93LmxvY2F0aW9uLmhhc2ggPSB1cmw7XHJcblx0XHRcdHdpbmRvdy5vbmhhc2hjaGFuZ2UgPSBsO1xyXG5cdFx0fVxyXG5cclxuXHRcdHByaXZhdGUgcmVnZXhGcm9tVXJsKHVybDogc3RyaW5nKTogc3RyaW5nIHtcclxuXHRcdFx0dmFyIHJlZ2V4ID0gLzooW1xcd10rKS87XHJcblx0XHRcdHdoaWxlKHVybC5tYXRjaChyZWdleCkpIHtcclxuXHRcdFx0XHR1cmwgPSB1cmwucmVwbGFjZShyZWdleCwgXCIoW15cXC9dKylcIik7XHJcblx0XHRcdH1cclxuXHRcdFx0cmV0dXJuIHVybCsnJCc7XHJcblx0XHR9XHJcblxyXG5cdFx0cHJpdmF0ZSBhcmdzRnJvbVVybChwYXR0ZXJuOiBzdHJpbmcsIHVybDogc3RyaW5nKTogYW55IHtcclxuXHRcdFx0bGV0IHIgPSB0aGlzLnJlZ2V4RnJvbVVybChwYXR0ZXJuKTtcclxuXHRcdFx0bGV0IG5hbWVzID0gcGF0dGVybi5tYXRjaChyKS5zbGljZSgxKTtcclxuXHRcdFx0bGV0IHZhbHVlcyA9IHVybC5tYXRjaChyKS5zbGljZSgxKTtcclxuXHJcblx0XHRcdGxldCBhcmdzID0ge307XHJcblx0XHRcdG5hbWVzLmZvckVhY2goZnVuY3Rpb24obmFtZSwgaSkge1xyXG5cdFx0XHRcdGFyZ3NbbmFtZS5zdWJzdHIoMSldID0gdmFsdWVzW2ldO1xyXG5cdFx0XHR9KTtcclxuXHJcblx0XHRcdHJldHVybiBhcmdzO1xyXG5cdFx0fVxyXG5cclxuXHRcdHByaXZhdGUgc3RhdGVGcm9tVXJsKHVybDogc3RyaW5nKTogSVJvdXRlRGF0YSB7XHJcblx0XHRcdHZhciBzID0gdm9pZCAwO1xyXG5cdFx0XHR0aGlzLm1hcHBpbmcuZm9yRWFjaCgoc3RhdGU6IElTdGF0ZSkgPT4ge1xyXG5cdFx0XHRcdGlmKHMpXHJcblx0XHRcdFx0XHRyZXR1cm47XHJcblxyXG5cdFx0XHRcdHZhciByID0gdGhpcy5yZWdleEZyb21Vcmwoc3RhdGUudXJsKTtcclxuXHRcdFx0XHRpZih1cmwubWF0Y2gocikpIHtcclxuXHRcdFx0XHRcdHZhciBhcmdzID0gdGhpcy5hcmdzRnJvbVVybChzdGF0ZS51cmwsIHVybCk7XHJcblx0XHRcdFx0XHRzID0ge1xyXG5cdFx0XHRcdFx0XHRcInN0YXRlXCI6IHN0YXRlLm5hbWUsXHJcblx0XHRcdFx0XHRcdFwiYXJnc1wiOiBhcmdzLFxyXG5cdFx0XHRcdFx0XHRcImV4dGVyblwiOiBmYWxzZVxyXG5cdFx0XHRcdFx0fTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdFx0aWYoIXMpXHJcblx0XHRcdFx0dGhyb3cgXCJObyBTdGF0ZSBmb3VuZCBmb3IgdXJsIFwiK3VybDtcclxuXHJcblx0XHRcdHJldHVybiBzO1xyXG5cdFx0fVxyXG5cclxuXHRcdHByaXZhdGUgdXJsRnJvbVN0YXRlKHVybDogc3RyaW5nLCBhcmdzOiBhbnkpOiBzdHJpbmcge1xyXG5cdFx0XHRsZXQgcmVnZXggPSAvOihbXFx3XSspLztcclxuXHRcdFx0d2hpbGUodXJsLm1hdGNoKHJlZ2V4KSkge1xyXG5cdFx0XHRcdHVybCA9IHVybC5yZXBsYWNlKHJlZ2V4LCBmdW5jdGlvbihtKSB7XHJcblx0XHRcdFx0XHRyZXR1cm4gYXJnc1ttLnN1YnN0cigxKV07XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdH1cclxuXHRcdFx0cmV0dXJuIHVybDtcclxuXHRcdH1cclxuXHJcblx0XHRwcml2YXRlIGVxdWFscyhvMTogYW55LCBvMjogYW55KSA6IGJvb2xlYW4ge1xyXG5cdFx0XHRyZXR1cm4gSlNPTi5zdHJpbmdpZnkobzEpID09PSBKU09OLnN0cmluZ2lmeShvMik7XHJcblx0XHR9XHJcblxyXG5cdH1cclxufVxyXG4iLCJcclxubW9kdWxlIGhvLmZsdXgge1xyXG5cclxuXHRleHBvcnQgaW50ZXJmYWNlIElBY3Rpb24ge1xyXG5cdCAgICB0eXBlOnN0cmluZztcclxuXHRcdGRhdGE/OmFueTtcclxuXHR9XHJcblxyXG5cdGV4cG9ydCBjbGFzcyBEaXNwYXRjaGVyIGV4dGVuZHMgQ2FsbGJhY2tIb2xkZXIge1xyXG5cclxuICAgIFx0cHJpdmF0ZSBpc1BlbmRpbmc6IHtba2V5OnN0cmluZ106Ym9vbGVhbn0gPSB7fTtcclxuICAgIFx0cHJpdmF0ZSBpc0hhbmRsZWQ6IHtba2V5OnN0cmluZ106Ym9vbGVhbn0gPSB7fTtcclxuICAgIFx0cHJpdmF0ZSBpc0Rpc3BhdGNoaW5nOiBib29sZWFuID0gZmFsc2U7XHJcbiAgICBcdHByaXZhdGUgcGVuZGluZ1BheWxvYWQ6IElBY3Rpb24gPSBudWxsO1xyXG5cclxuXHRcdHB1YmxpYyB3YWl0Rm9yKC4uLmlkczogQXJyYXk8bnVtYmVyPik6IHZvaWQge1xyXG5cdFx0XHRpZighdGhpcy5pc0Rpc3BhdGNoaW5nKVxyXG5cdFx0ICBcdFx0dGhyb3cgJ0Rpc3BhdGNoZXIud2FpdEZvciguLi4pOiBNdXN0IGJlIGludm9rZWQgd2hpbGUgZGlzcGF0Y2hpbmcuJztcclxuXHJcblx0XHRcdGZvciAobGV0IGlpID0gMDsgaWkgPCBpZHMubGVuZ3RoOyBpaSsrKSB7XHJcblx0XHRcdCAgbGV0IGlkID0gaWRzW2lpXTtcclxuXHJcblx0XHRcdCAgaWYgKHRoaXMuaXNQZW5kaW5nW2lkXSkge1xyXG5cdFx0ICAgICAgXHRpZighdGhpcy5pc0hhbmRsZWRbaWRdKVxyXG5cdFx0XHQgICAgICBcdHRocm93IGB3YWl0Rm9yKC4uLik6IENpcmN1bGFyIGRlcGVuZGVuY3kgZGV0ZWN0ZWQgd2hpbGUgd2F0aW5nIGZvciAke2lkfWA7XHJcblx0XHRcdFx0Y29udGludWU7XHJcblx0XHRcdCAgfVxyXG5cclxuXHRcdFx0ICBpZighdGhpcy5jYWxsYmFja3NbaWRdKVxyXG5cdFx0XHQgIFx0dGhyb3cgYHdhaXRGb3IoLi4uKTogJHtpZH0gZG9lcyBub3QgbWFwIHRvIGEgcmVnaXN0ZXJlZCBjYWxsYmFjay5gO1xyXG5cclxuXHRcdFx0ICB0aGlzLmludm9rZUNhbGxiYWNrKGlkKTtcclxuXHRcdFx0fVxyXG5cdFx0fTtcclxuXHJcblx0XHRwdWJsaWMgZGlzcGF0Y2goYWN0aW9uOiBJQWN0aW9uKSB7XHJcblx0XHRcdGlmKHRoaXMuaXNEaXNwYXRjaGluZylcclxuXHRcdCAgICBcdHRocm93ICdDYW5ub3QgZGlzcGF0Y2ggaW4gdGhlIG1pZGRsZSBvZiBhIGRpc3BhdGNoLic7XHJcblxyXG5cdFx0XHR0aGlzLnN0YXJ0RGlzcGF0Y2hpbmcoYWN0aW9uKTtcclxuXHJcblx0XHQgICAgdHJ5IHtcclxuXHRcdCAgICAgIGZvciAobGV0IGlkIGluIHRoaXMuY2FsbGJhY2tzKSB7XHJcblx0XHQgICAgICAgIGlmICh0aGlzLmlzUGVuZGluZ1tpZF0pIHtcclxuXHRcdCAgICAgICAgICBjb250aW51ZTtcclxuXHRcdCAgICAgICAgfVxyXG5cdFx0ICAgICAgICB0aGlzLmludm9rZUNhbGxiYWNrKGlkKTtcclxuXHRcdCAgICAgIH1cclxuXHRcdCAgICB9IGZpbmFsbHkge1xyXG5cdFx0ICAgICAgdGhpcy5zdG9wRGlzcGF0Y2hpbmcoKTtcclxuXHRcdCAgICB9XHJcblx0XHR9O1xyXG5cclxuXHQgIFx0cHJpdmF0ZSBpbnZva2VDYWxsYmFjayhpZDogbnVtYmVyKTogdm9pZCB7XHJcblx0ICAgIFx0dGhpcy5pc1BlbmRpbmdbaWRdID0gdHJ1ZTtcclxuXHQgICAgXHR0aGlzLmNhbGxiYWNrc1tpZF0odGhpcy5wZW5kaW5nUGF5bG9hZCk7XHJcblx0ICAgIFx0dGhpcy5pc0hhbmRsZWRbaWRdID0gdHJ1ZTtcclxuXHQgIFx0fVxyXG5cclxuXHQgIFx0cHJpdmF0ZSBzdGFydERpc3BhdGNoaW5nKHBheWxvYWQ6IElBY3Rpb24pOiB2b2lkIHtcclxuXHQgICAgXHRmb3IgKGxldCBpZCBpbiB0aGlzLmNhbGxiYWNrcykge1xyXG5cdCAgICAgIFx0XHR0aGlzLmlzUGVuZGluZ1tpZF0gPSBmYWxzZTtcclxuXHQgICAgICBcdFx0dGhpcy5pc0hhbmRsZWRbaWRdID0gZmFsc2U7XHJcblx0ICAgIFx0fVxyXG5cdCAgICBcdHRoaXMucGVuZGluZ1BheWxvYWQgPSBwYXlsb2FkO1xyXG5cdCAgICBcdHRoaXMuaXNEaXNwYXRjaGluZyA9IHRydWU7XHJcbiAgXHRcdH1cclxuXHJcblx0ICBcdHByaXZhdGUgc3RvcERpc3BhdGNoaW5nKCk6IHZvaWQge1xyXG5cdCAgICBcdHRoaXMucGVuZGluZ1BheWxvYWQgPSBudWxsO1xyXG5cdCAgICBcdHRoaXMuaXNEaXNwYXRjaGluZyA9IGZhbHNlO1xyXG5cdCAgXHR9XHJcblx0fVxyXG59XHJcbiIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi8uLi8uLi9ib3dlcl9jb21wb25lbnRzL2hvLXByb21pc2UvZGlzdC9wcm9taXNlLmQudHNcIi8+XHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi8uLi8uLi9ib3dlcl9jb21wb25lbnRzL2hvLWNsYXNzbG9hZGVyL2Rpc3QvY2xhc3Nsb2FkZXIuZC50c1wiLz5cclxuXHJcbm1vZHVsZSBoby5mbHV4IHtcclxuXHRpbXBvcnQgUHJvbWlzZSA9IGhvLnByb21pc2UuUHJvbWlzZTtcclxuXHJcblx0ZXhwb3J0IGxldCBESVNQQVRDSEVSOiBEaXNwYXRjaGVyID0gbmV3IERpc3BhdGNoZXIoKTtcclxuXHJcblx0ZXhwb3J0IGxldCBTVE9SRVM6IHJlZ2lzdHJ5LlJlZ2lzdHJ5ID0gbmV3IHJlZ2lzdHJ5LlJlZ2lzdHJ5KCk7XHJcblxyXG5cdGV4cG9ydCBsZXQgZGlyOiBib29sZWFuID0gZmFsc2U7XHJcblxyXG5cdC8vaWYoaG8uZmx1eC5TVE9SRVMuZ2V0KFJvdXRlcikgPT09IHVuZGVmaW5lZClcclxuXHQvL1x0bmV3IFJvdXRlcigpO1xyXG5cclxuXHRleHBvcnQgZnVuY3Rpb24gcnVuKCk6IFByb21pc2U8YW55LCBhbnk+IHtcclxuXHRcdC8vcmV0dXJuICg8Um91dGVyPmhvLmZsdXguU1RPUkVTWydSb3V0ZXInXSkuaW5pdCgpO1xyXG5cdFx0cmV0dXJuIFNUT1JFUy5nZXQoUm91dGVyKS5pbml0KCk7XHJcblx0fVxyXG59XHJcbiIsIm1vZHVsZSBoby51aSB7XG5cblx0ZXhwb3J0IGZ1bmN0aW9uIHJ1bihvcHRpb25zOklPcHRpb25zPW5ldyBPcHRpb25zKCkpOiBoby5wcm9taXNlLlByb21pc2U8YW55LCBhbnk+IHtcblx0XHRvcHRpb25zID0gbmV3IE9wdGlvbnMob3B0aW9ucyk7XG5cblx0XHRsZXQgcCA9IG9wdGlvbnMucHJvY2VzcygpXG5cdFx0LnRoZW4oaG8uY29tcG9uZW50cy5ydW4pXG5cdFx0LnRoZW4oaG8uZmx1eC5ydW4pO1xuXG5cdFx0cmV0dXJuIHA7XG5cdH1cblxuXHRsZXQgY29tcG9uZW50cyA9IFtcblx0XHRcIlN0b3JlZFwiLFxuXHRcdFwiVmlld1wiLFxuXHRdO1xuXG5cdGxldCBhdHRyaWJ1dGVzID0gW1xuXHRcdFwiQmluZFwiLFxuXHRcdFwiQmluZEJpXCIsXG5cdF07XG5cblx0bGV0IHN0b3JlcyA9IFtcblxuXHRdO1xuXG5cdGV4cG9ydCBpbnRlcmZhY2UgSU9wdGlvbnMge1xuXHRcdHJvb3Q6IHN0cmluZyB8IHR5cGVvZiBoby5jb21wb25lbnRzLkNvbXBvbmVudDsgLy9Sb290IGNvbXBvbmVudCB0byByZWdpc3Rlcjtcblx0XHRyb3V0ZXI6IHN0cmluZyB8IHR5cGVvZiBoby5mbHV4LlJvdXRlcjsgLy9hbHRlcm5hdGl2ZSByb3V0ZXIgY2xhc3Ncblx0XHRtYXA6IHN0cmluZyB8IGJvb2xlYW47IC8vIGlmIHNldCwgbWFwIGFsbCBoby51aSBjb21wb25lbnRzIGluIHRoZSBjb21wb25lbnRwcm92aWRlciB0byB0aGUgZ2l2ZW4gdXJsXG5cdFx0ZGlyOiBib29sZWFuOyAvLyBzZXQgdXNlZGlyIGluIGhvLmNvbXBvbmVudHNcblx0XHRtaW46IGJvb2xlYW47XG5cdFx0cHJvY2VzczogKCk9PmhvLnByb21pc2UuUHJvbWlzZTxhbnksIGFueT47XG5cdH1cblxuXHRjbGFzcyBPcHRpb25zIGltcGxlbWVudHMgSU9wdGlvbnMge1xuXHRcdHJvb3Q6IHN0cmluZyB8IHR5cGVvZiBoby5jb21wb25lbnRzLkNvbXBvbmVudCA9IFwiQXBwXCJcblx0XHRyb3V0ZXI6IHN0cmluZyB8IHR5cGVvZiBoby5mbHV4LlJvdXRlciA9IGhvLmZsdXguUm91dGVyO1xuXHRcdG1hcDogc3RyaW5nIHwgYm9vbGVhbiA9IHRydWU7XG5cdFx0bWFwRGVmYXVsdCA9IFwiYm93ZXJfY29tcG9uZW50cy9oby11aS9kaXN0L1wiO1xuXHRcdGRpciA9IHRydWU7XG5cdFx0bWluID0gZmFsc2U7XG5cblx0XHRjb25zdHJ1Y3RvcihvcHQ6IElPcHRpb25zID0gPElPcHRpb25zPnt9KSB7XG5cdFx0XHRmb3IodmFyIGtleSBpbiBvcHQpIHtcblx0XHRcdFx0dGhpc1trZXldID0gb3B0W2tleV07XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0cHJvY2VzcygpOiBoby5wcm9taXNlLlByb21pc2U8YW55LCBhbnk+e1xuXHRcdFx0cmV0dXJuIGhvLnByb21pc2UuUHJvbWlzZS5jcmVhdGUodGhpcy5wcm9jZXNzRGlyKCkpXG5cdFx0XHQudGhlbih0aGlzLnByb2Nlc3NNaW4uYmluZCh0aGlzKSlcblx0XHRcdC50aGVuKHRoaXMucHJvY2Vzc01hcC5iaW5kKHRoaXMpKVxuXHRcdFx0LnRoZW4odGhpcy5wcm9jZXNzUm91dGVyLmJpbmQodGhpcykpXG5cdFx0XHQudGhlbih0aGlzLnByb2Nlc3NSb290LmJpbmQodGhpcykpXG5cdFx0fVxuXG5cdFx0cHJvdGVjdGVkIHByb2Nlc3NSb290KCkge1xuXHRcdFx0cmV0dXJuIG5ldyBoby5wcm9taXNlLlByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuXHRcdFx0XHRpZih0eXBlb2YgdGhpcy5yb290ID09PSAnc3RyaW5nJykge1xuXHRcdFx0XHRcdGhvLmNvbXBvbmVudHMucmVnaXN0cnkuaW5zdGFuY2UubG9hZENvbXBvbmVudCg8c3RyaW5nPnRoaXMucm9vdClcblx0XHRcdFx0XHQudGhlbihyZXNvbHZlKVxuXHRcdFx0XHRcdC5jYXRjaChyZWplY3QpO1xuXG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0aG8uY29tcG9uZW50cy5yZWdpc3RyeS5pbnN0YW5jZS5yZWdpc3Rlcig8dHlwZW9mIGhvLmNvbXBvbmVudHMuQ29tcG9uZW50PnRoaXMucm9vdClcblx0XHRcdFx0XHRyZXNvbHZlKG51bGwpO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHR9XG5cblx0XHRwcm90ZWN0ZWQgcHJvY2Vzc1JvdXRlcigpOiBoby5wcm9taXNlLlByb21pc2U8YW55LCBhbnk+IHtcblx0XHRcdHJldHVybiBuZXcgaG8ucHJvbWlzZS5Qcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcblx0XHRcdFx0aWYodHlwZW9mIHRoaXMucm91dGVyID09PSAnc3RyaW5nJykge1xuXHRcdFx0XHRcdGhvLmZsdXguU1RPUkVTLmxvYWRTdG9yZSg8c3RyaW5nPnRoaXMucm91dGVyKVxuXHRcdFx0XHRcdC50aGVuKHJlc29sdmUpXG5cdFx0XHRcdFx0LmNhdGNoKHJlamVjdCk7XG5cblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRyZXNvbHZlKG5ldyAoPHR5cGVvZiBoby5mbHV4LlJvdXRlcj50aGlzLnJvdXRlcikoKSk7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXG5cdFx0fVxuXG5cdFx0cHJvdGVjdGVkIHByb2Nlc3NNYXAoKTogdm9pZCB7XG5cdFx0XHRpZih0eXBlb2YgdGhpcy5tYXAgPT09ICdib29sZWFuJykge1xuXHRcdFx0XHRpZighdGhpcy5tYXApXG5cdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0dGhpcy5tYXAgPSB0aGlzLm1hcERlZmF1bHQ7XG5cdFx0XHR9XG5cblx0XHRcdGNvbXBvbmVudHMuZm9yRWFjaChjID0+IHtcblx0XHRcdFx0Ly9oby5jb21wb25lbnRzLnJlZ2lzdHJ5Lm1hcHBpbmdbY10gPSB0aGlzLm1hcCArICdjb21wb25lbnRzLycgKyBjICsgJy8nICsgYyArICcuanMnO1xuXHRcdFx0XHRoby5jbGFzc2xvYWRlci5tYXBwaW5nW2NdID0gdGhpcy5tYXAgKyAnY29tcG9uZW50cy8nICsgYyArICcvJyArIGMgKyAnLmpzJztcblx0XHRcdH0pO1xuXG5cdFx0XHRhdHRyaWJ1dGVzLmZvckVhY2goYSA9PiB7XG5cdFx0XHRcdC8vaG8uY29tcG9uZW50cy5yZWdpc3RyeS5tYXBwaW5nW2FdID0gdGhpcy5tYXAgKyAnYXR0cmlidXRlcy8nICsgYSArICcvJyArIGEgKyAnLmpzJztcblx0XHRcdFx0aG8uY2xhc3Nsb2FkZXIubWFwcGluZ1thXSA9IHRoaXMubWFwICsgJ2F0dHJpYnV0ZXMvJyArIGEgKyAnLycgKyBhICsgJy5qcyc7XG5cdFx0XHR9KTtcblxuXHRcdFx0c3RvcmVzLmZvckVhY2gocyA9PiB7XG5cdFx0XHRcdC8vaG8uZmx1eC5yZWdpc3RyeS5tYXBwaW5nW3NdID0gdGhpcy5tYXAgKyAnc3RvcmVzLycgKyBzICsgJy8nICsgcyArICcuanMnO1xuXHRcdFx0XHRoby5jbGFzc2xvYWRlci5tYXBwaW5nW3NdID0gdGhpcy5tYXAgKyAnc3RvcmVzLycgKyBzICsgJy8nICsgcyArICcuanMnO1xuXHRcdFx0fSk7XG5cdFx0fVxuXG5cdFx0cHJvdGVjdGVkIHByb2Nlc3NEaXIoKTogdm9pZCB7XG5cdFx0XHRoby5jb21wb25lbnRzLmRpciA9IHRoaXMuZGlyO1xuXHRcdH1cblxuXHRcdHByb3RlY3RlZCBwcm9jZXNzTWluKCk6IHZvaWQge1xuXHRcdFx0Lypcblx0XHRcdGhvLmNvbXBvbmVudHMuY29tcG9uZW50cHJvdmlkZXIuaW5zdGFuY2UudXNlTWluID0gdGhpcy5taW47XG5cdFx0XHRoby5jb21wb25lbnRzLmF0dHJpYnV0ZXByb3ZpZGVyLmluc3RhbmNlLnVzZU1pbiA9IHRoaXMubWluO1xuXHRcdFx0aG8uZmx1eC5zdG9yZXByb3ZpZGVyLmluc3RhbmNlLnVzZU1pbiA9IHRoaXMubWluO1xuXHRcdFx0Ki9cblx0XHR9XG5cdH1cblxufVxuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9