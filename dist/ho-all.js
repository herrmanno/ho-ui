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
                    if (css === void 0) { css = component.style; }
                    var id = 'style-' + component.name;
                    if (!!document.querySelector("style[id=\"" + id + "\"]"))
                        return;
                    var style = component.style.replace('this', component.name);
                    var tag = document.createElement('style');
                    tag.id = id;
                    tag.innerHTML = '\n' + style + '\n';
                    document.head.appendChild(tag);
                    /*
                    let style = this.parseStyle(component.style);
                    style.forEach(s => {
                        this.applyStyleBlock(component, s);
                    });
                    */
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
        var actions;
        (function (actions) {
            var Action = (function () {
                function Action() {
                }
                Object.defineProperty(Action.prototype, "name", {
                    get: function () {
                        return this.constructor.toString().match(/\w+/g)[1];
                    },
                    enumerable: true,
                    configurable: true
                });
                return Action;
            })();
            actions.Action = Action;
        })(actions = flux.actions || (flux.actions = {}));
    })(flux = ho.flux || (ho.flux = {}));
})(ho || (ho = {}));

var ho;
(function (ho) {
    var flux;
    (function (flux) {
        var actions;
        (function (actions) {
            var Promise = ho.promise.Promise;
            actions.mapping = {};
            actions.useDir = true;
            var Registry = (function () {
                function Registry() {
                    this.actions = {};
                    this.actionLoader = new ho.classloader.ClassLoader({
                        urlTemplate: 'actions/${name}.js',
                        useDir: actions.useDir
                    });
                }
                Registry.prototype.register = function (action) {
                    this.actions[action.name] = action;
                    return action;
                };
                Registry.prototype.get = function (actionClass) {
                    var name = void 0;
                    if (typeof actionClass === 'string')
                        name = actionClass;
                    else
                        name = actionClass.toString().match(/\w+/g)[1];
                    return this.actions[name];
                };
                Registry.prototype.loadAction = function (name) {
                    var self = this;
                    if (!!this.actions[name])
                        return Promise.create(this.actions[name]);
                    return this.actionLoader.load({
                        name: name,
                        url: actions.mapping[name],
                        super: ["ho.flux.action.Action"]
                    })
                        .then(function (classes) {
                        classes.map(function (a) {
                            if (!self.get(a))
                                self.register(new a);
                        });
                        return self.get(classes.pop());
                    });
                };
                return Registry;
            })();
            actions.Registry = Registry;
        })(actions = flux.actions || (flux.actions = {}));
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
                Registry.prototype.loadStore = function (name, init) {
                    if (init === void 0) { init = true; }
                    var self = this;
                    var cls = [];
                    if (!!this.stores[name])
                        return Promise.create(this.stores[name]);
                    return this.storeLoader.load({
                        name: name,
                        url: registry.mapping[name],
                        super: ["ho.flux.Store"]
                    })
                        .then(function (classes) {
                        cls = classes;
                        classes = classes.filter(function (c) {
                            return !self.get(c);
                        });
                        var promises = classes.map(function (c) {
                            var result = self.register(new c);
                            if (init)
                                result = result.init();
                            return Promise.create(result);
                        });
                        return Promise.all(promises);
                    })
                        .then(function (p) {
                        return self.get(cls.pop());
                    });
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
                this.actions = [];
                this.id = ho.flux.DISPATCHER.register(this.handle.bind(this));
                //ho.flux.STORES.register(this);
            }
            Store.prototype.init = function () {
                return ho.promise.Promise.all(this.actions.map(function (a) {
                    return ho.flux.ACTIONS.loadAction(a);
                }));
            };
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
        var Promise = ho.promise.Promise;
        flux.DISPATCHER = new flux.Dispatcher();
        flux.STORES = new flux.registry.Registry();
        flux.ACTIONS = new flux.actions.Registry();
        flux.dir = false;
        function run(router) {
            if (router === void 0) { router = flux.Router; }
            return new Promise(function (resolve, reject) {
                if (!!flux.STORES.get(router))
                    resolve(flux.STORES.get(router));
                else if (router === flux.Router)
                    resolve(new flux.Router());
                else if (typeof router === 'function')
                    resolve(new router());
                else if (typeof router === 'string') {
                    flux.STORES.loadStore(router)
                        .then(function (s) { return resolve(s); });
                }
            })
                .then(function (r) {
                return flux.STORES.register(r).init();
            });
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
                .then(ho.components.run.bind(ho.components, undefined))
                .then(ho.flux.run.bind(ho.flux, undefined));
            return p;
        }
        ui.run = run;
        var components = [
            "FluxComponent",
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
                        ho.flux.STORES.loadStore(_this.router, false)
                            .then(function (r) { return resolve(r); })
                            .catch(reject);
                    }
                    else {
                        resolve(new _this.router());
                    }
                })
                    .then(function (r) {
                    ho.flux.Router = r.constructor;
                    ho.flux.STORES.register(r);
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
                ho.components.registry.useDir = this.dir;
                ho.flux.registry.useDir = this.dir;
                ho.flux.actions.useDir = this.dir;
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9zb3VyY2Uvc3JjL2hvL3Byb21pc2UvcHJvbWlzZS50cyIsIi9zb3VyY2Uvc3JjL2hvL2NsYXNzbG9hZGVyL3V0aWwvZ2V0LnRzIiwiL3NvdXJjZS9zcmMvaG8vY2xhc3Nsb2FkZXIvdXRpbC9leHBvc2UudHMiLCIvc291cmNlL3NyYy9oby9jbGFzc2xvYWRlci94aHIvZ2V0LnRzIiwiL3NvdXJjZS9zcmMvaG8vY2xhc3Nsb2FkZXIvdHlwZXMudHMiLCIvc291cmNlL3NyYy9oby9jbGFzc2xvYWRlci9sb2FkYXJndW1lbnRzLnRzIiwiL3NvdXJjZS9zcmMvaG8vY2xhc3Nsb2FkZXIvbG9hZGVyY29uZmlnLnRzIiwiL3NvdXJjZS9zcmMvaG8vY2xhc3Nsb2FkZXIvbG9hZHR5cGUudHMiLCIvc291cmNlL3NyYy9oby9jbGFzc2xvYWRlci9jbGFzc2xvYWRlci50cyIsIi9zb3VyY2Uvc3JjL2hvL2NsYXNzbG9hZGVyL21haW4udHMiLCIvc291cmNlL3dhdGNoLnRzIiwiL3NvdXJjZS9zcmMvaG8vY29tcG9uZW50cy90ZW1wL3RlbXAudHMiLCIvc291cmNlL3NyYy9oby9jb21wb25lbnRzL3N0eWxlci9zdHlsZXIudHMiLCIvc291cmNlL3NyYy9oby9jb21wb25lbnRzL3JlbmRlcmVyL3JlbmRlcmVyLnRzIiwiL3NvdXJjZS9zcmMvaG8vY29tcG9uZW50cy9odG1scHJvdmlkZXIvaHRtbHByb3ZpZGVyLnRzIiwiL3NvdXJjZS9zcmMvaG8vY29tcG9uZW50cy9hdHRyaWJ1dGUudHMiLCIvc291cmNlL3NyYy9oby9jb21wb25lbnRzL2NvbXBvbmVudC50cyIsIi9zb3VyY2Uvc3JjL2hvL2NvbXBvbmVudHMvcmVnaXN0cnkvcmVnaXN0cnkudHMiLCIvc291cmNlL3NyYy9oby9jb21wb25lbnRzL2NvbXBvbmVudHMudHMiLCIvc291cmNlL3NyYy9oby9mbHV4L2NhbGxiYWNraG9sZGVyLnRzIiwiL3NvdXJjZS9zcmMvaG8vZmx1eC9zdGF0ZS50cyIsIi9zb3VyY2Uvc3JjL2hvL2ZsdXgvYWN0aW9ucy9hY3Rpb24udHMiLCIvc291cmNlL3NyYy9oby9mbHV4L2FjdGlvbnMvcmVnaXN0cnkudHMiLCIvc291cmNlL3NyYy9oby9mbHV4L3JlZ2lzdHJ5L3JlZ2lzdHJ5LnRzIiwiL3NvdXJjZS9zcmMvaG8vZmx1eC9zdGF0ZXByb3ZpZGVyL3N0YXRlcHJvdmlkZXIudHMiLCIvc291cmNlL3NyYy9oby9mbHV4L3N0b3JlLnRzIiwiL3NvdXJjZS9zcmMvaG8vZmx1eC9yb3V0ZXIudHMiLCIvc291cmNlL3NyYy9oby9mbHV4L2Rpc3BhdGNoZXIudHMiLCIvc291cmNlL3NyYy9oby9mbHV4L2ZsdXgudHMiLCIvc291cmNlL3VpLnRzIl0sIm5hbWVzIjpbImhvIiwiaG8ucHJvbWlzZSIsImhvLnByb21pc2UuUHJvbWlzZSIsImhvLnByb21pc2UuUHJvbWlzZS5jb25zdHJ1Y3RvciIsImhvLnByb21pc2UuUHJvbWlzZS5zZXQiLCJoby5wcm9taXNlLlByb21pc2UucmVzb2x2ZSIsImhvLnByb21pc2UuUHJvbWlzZS5fcmVzb2x2ZSIsImhvLnByb21pc2UuUHJvbWlzZS5yZWplY3QiLCJoby5wcm9taXNlLlByb21pc2UuX3JlamVjdCIsImhvLnByb21pc2UuUHJvbWlzZS50aGVuIiwiaG8ucHJvbWlzZS5Qcm9taXNlLmNhdGNoIiwiaG8ucHJvbWlzZS5Qcm9taXNlLmFsbCIsImhvLnByb21pc2UuUHJvbWlzZS5jaGFpbiIsImhvLnByb21pc2UuUHJvbWlzZS5jaGFpbi5uZXh0IiwiaG8ucHJvbWlzZS5Qcm9taXNlLmNyZWF0ZSIsImhvLmNsYXNzbG9hZGVyIiwiaG8uY2xhc3Nsb2FkZXIudXRpbCIsImhvLmNsYXNzbG9hZGVyLnV0aWwuZ2V0IiwiaG8uY2xhc3Nsb2FkZXIudXRpbC5leHBvc2UiLCJoby5jbGFzc2xvYWRlci54aHIiLCJoby5jbGFzc2xvYWRlci54aHIuZ2V0IiwiaG8uY2xhc3Nsb2FkZXIuTG9hZEFyZ3VtZW50cyIsImhvLmNsYXNzbG9hZGVyLkxvYWRBcmd1bWVudHMuY29uc3RydWN0b3IiLCJoby5jbGFzc2xvYWRlci5XYXJuTGV2ZWwiLCJoby5jbGFzc2xvYWRlci5Mb2FkZXJDb25maWciLCJoby5jbGFzc2xvYWRlci5Mb2FkZXJDb25maWcuY29uc3RydWN0b3IiLCJoby5jbGFzc2xvYWRlci5Mb2FkVHlwZSIsImhvLmNsYXNzbG9hZGVyLkNsYXNzTG9hZGVyIiwiaG8uY2xhc3Nsb2FkZXIuQ2xhc3NMb2FkZXIuY29uc3RydWN0b3IiLCJoby5jbGFzc2xvYWRlci5DbGFzc0xvYWRlci5jb25maWciLCJoby5jbGFzc2xvYWRlci5DbGFzc0xvYWRlci5sb2FkIiwiaG8uY2xhc3Nsb2FkZXIuQ2xhc3NMb2FkZXIubG9hZF9zY3JpcHQiLCJoby5jbGFzc2xvYWRlci5DbGFzc0xvYWRlci5sb2FkX3NjcmlwdC5sb2FkX2ludGVybmFsIiwiaG8uY2xhc3Nsb2FkZXIuQ2xhc3NMb2FkZXIubG9hZF9mdW5jdGlvbiIsImhvLmNsYXNzbG9hZGVyLkNsYXNzTG9hZGVyLmxvYWRfZXZhbCIsImhvLmNsYXNzbG9hZGVyLkNsYXNzTG9hZGVyLmdldFBhcmVudE5hbWUiLCJoby5jbGFzc2xvYWRlci5DbGFzc0xvYWRlci5wYXJzZVBhcmVudEZyb21Tb3VyY2UiLCJoby5jbGFzc2xvYWRlci5DbGFzc0xvYWRlci5yZXNvbHZlVXJsIiwiaG8uY2xhc3Nsb2FkZXIuQ2xhc3NMb2FkZXIuZXhpc3RzIiwiaG8uY2xhc3Nsb2FkZXIuY29uZmlnIiwiaG8uY2xhc3Nsb2FkZXIubG9hZCIsImhvLndhdGNoIiwiaG8ud2F0Y2gud2F0Y2giLCJoby53YXRjaC5XYXRjaGVyIiwiaG8ud2F0Y2guV2F0Y2hlci5jb25zdHJ1Y3RvciIsImhvLndhdGNoLldhdGNoZXIud2F0Y2giLCJoby53YXRjaC5XYXRjaGVyLmNvcHkiLCJoby5jb21wb25lbnRzIiwiaG8uY29tcG9uZW50cy50ZW1wIiwiaG8uY29tcG9uZW50cy50ZW1wLnNldCIsImhvLmNvbXBvbmVudHMudGVtcC5nZXQiLCJoby5jb21wb25lbnRzLnRlbXAuY2FsbCIsImhvLmNvbXBvbmVudHMuc3R5bGVyIiwiaG8uY29tcG9uZW50cy5zdHlsZXIuU3R5bGVyIiwiaG8uY29tcG9uZW50cy5zdHlsZXIuU3R5bGVyLmNvbnN0cnVjdG9yIiwiaG8uY29tcG9uZW50cy5zdHlsZXIuU3R5bGVyLmFwcGx5U3R5bGUiLCJoby5jb21wb25lbnRzLnN0eWxlci5TdHlsZXIuYXBwbHlTdHlsZUJsb2NrIiwiaG8uY29tcG9uZW50cy5zdHlsZXIuU3R5bGVyLmFwcGx5UnVsZSIsImhvLmNvbXBvbmVudHMuc3R5bGVyLlN0eWxlci5wYXJzZVN0eWxlIiwiaG8uY29tcG9uZW50cy5yZW5kZXJlciIsImhvLmNvbXBvbmVudHMucmVuZGVyZXIuTm9kZSIsImhvLmNvbXBvbmVudHMucmVuZGVyZXIuTm9kZS5jb25zdHJ1Y3RvciIsImhvLmNvbXBvbmVudHMucmVuZGVyZXIuUmVuZGVyZXIiLCJoby5jb21wb25lbnRzLnJlbmRlcmVyLlJlbmRlcmVyLmNvbnN0cnVjdG9yIiwiaG8uY29tcG9uZW50cy5yZW5kZXJlci5SZW5kZXJlci5yZW5kZXIiLCJoby5jb21wb25lbnRzLnJlbmRlcmVyLlJlbmRlcmVyLnBhcnNlIiwiaG8uY29tcG9uZW50cy5yZW5kZXJlci5SZW5kZXJlci5yZW5kZXJSZXBlYXQiLCJoby5jb21wb25lbnRzLnJlbmRlcmVyLlJlbmRlcmVyLmRvbVRvU3RyaW5nIiwiaG8uY29tcG9uZW50cy5yZW5kZXJlci5SZW5kZXJlci5yZXBsIiwiaG8uY29tcG9uZW50cy5yZW5kZXJlci5SZW5kZXJlci5ldmFsdWF0ZSIsImhvLmNvbXBvbmVudHMucmVuZGVyZXIuUmVuZGVyZXIuZXZhbHVhdGVWYWx1ZSIsImhvLmNvbXBvbmVudHMucmVuZGVyZXIuUmVuZGVyZXIuZXZhbHVhdGVWYWx1ZUFuZE1vZGVsIiwiaG8uY29tcG9uZW50cy5yZW5kZXJlci5SZW5kZXJlci5ldmFsdWF0ZUV4cHJlc3Npb24iLCJoby5jb21wb25lbnRzLnJlbmRlcmVyLlJlbmRlcmVyLmV2YWx1YXRlRnVuY3Rpb24iLCJoby5jb21wb25lbnRzLnJlbmRlcmVyLlJlbmRlcmVyLmNvcHlOb2RlIiwiaG8uY29tcG9uZW50cy5yZW5kZXJlci5SZW5kZXJlci5pc1ZvaWQiLCJoby5jb21wb25lbnRzLmh0bWxwcm92aWRlciIsImhvLmNvbXBvbmVudHMuaHRtbHByb3ZpZGVyLkh0bWxQcm92aWRlciIsImhvLmNvbXBvbmVudHMuaHRtbHByb3ZpZGVyLkh0bWxQcm92aWRlci5jb25zdHJ1Y3RvciIsImhvLmNvbXBvbmVudHMuaHRtbHByb3ZpZGVyLkh0bWxQcm92aWRlci5yZXNvbHZlIiwiaG8uY29tcG9uZW50cy5odG1scHJvdmlkZXIuSHRtbFByb3ZpZGVyLmdldEhUTUwiLCJoby5jb21wb25lbnRzLkF0dHJpYnV0ZSIsImhvLmNvbXBvbmVudHMuQXR0cmlidXRlLmNvbnN0cnVjdG9yIiwiaG8uY29tcG9uZW50cy5BdHRyaWJ1dGUuaW5pdCIsImhvLmNvbXBvbmVudHMuQXR0cmlidXRlLm5hbWUiLCJoby5jb21wb25lbnRzLkF0dHJpYnV0ZS51cGRhdGUiLCJoby5jb21wb25lbnRzLkF0dHJpYnV0ZS5nZXROYW1lIiwiaG8uY29tcG9uZW50cy5XYXRjaEF0dHJpYnV0ZSIsImhvLmNvbXBvbmVudHMuV2F0Y2hBdHRyaWJ1dGUuY29uc3RydWN0b3IiLCJoby5jb21wb25lbnRzLldhdGNoQXR0cmlidXRlLndhdGNoIiwiaG8uY29tcG9uZW50cy5XYXRjaEF0dHJpYnV0ZS5ldmFsIiwiaG8uY29tcG9uZW50cy5Db21wb25lbnQiLCJoby5jb21wb25lbnRzLkNvbXBvbmVudC5jb25zdHJ1Y3RvciIsImhvLmNvbXBvbmVudHMuQ29tcG9uZW50Lm5hbWUiLCJoby5jb21wb25lbnRzLkNvbXBvbmVudC5nZXROYW1lIiwiaG8uY29tcG9uZW50cy5Db21wb25lbnQuZ2V0UGFyZW50IiwiaG8uY29tcG9uZW50cy5Db21wb25lbnQuX2luaXQiLCJoby5jb21wb25lbnRzLkNvbXBvbmVudC5pbml0IiwiaG8uY29tcG9uZW50cy5Db21wb25lbnQudXBkYXRlIiwiaG8uY29tcG9uZW50cy5Db21wb25lbnQucmVuZGVyIiwiaG8uY29tcG9uZW50cy5Db21wb25lbnQuaW5pdFN0eWxlIiwiaG8uY29tcG9uZW50cy5Db21wb25lbnQuaW5pdEhUTUwiLCJoby5jb21wb25lbnRzLkNvbXBvbmVudC5pbml0UHJvcGVydGllcyIsImhvLmNvbXBvbmVudHMuQ29tcG9uZW50LmluaXRDaGlsZHJlbiIsImhvLmNvbXBvbmVudHMuQ29tcG9uZW50LmluaXRBdHRyaWJ1dGVzIiwiaG8uY29tcG9uZW50cy5Db21wb25lbnQubG9hZFJlcXVpcmVtZW50cyIsImhvLmNvbXBvbmVudHMuQ29tcG9uZW50LmdldENvbXBvbmVudCIsImhvLmNvbXBvbmVudHMucmVnaXN0cnkiLCJoby5jb21wb25lbnRzLnJlZ2lzdHJ5LlJlZ2lzdHJ5IiwiaG8uY29tcG9uZW50cy5yZWdpc3RyeS5SZWdpc3RyeS5jb25zdHJ1Y3RvciIsImhvLmNvbXBvbmVudHMucmVnaXN0cnkuUmVnaXN0cnkucmVnaXN0ZXIiLCJoby5jb21wb25lbnRzLnJlZ2lzdHJ5LlJlZ2lzdHJ5LnJ1biIsImhvLmNvbXBvbmVudHMucmVnaXN0cnkuUmVnaXN0cnkuaW5pdENvbXBvbmVudCIsImhvLmNvbXBvbmVudHMucmVnaXN0cnkuUmVnaXN0cnkuaW5pdEVsZW1lbnQiLCJoby5jb21wb25lbnRzLnJlZ2lzdHJ5LlJlZ2lzdHJ5Lmhhc0NvbXBvbmVudCIsImhvLmNvbXBvbmVudHMucmVnaXN0cnkuUmVnaXN0cnkuaGFzQXR0cmlidXRlIiwiaG8uY29tcG9uZW50cy5yZWdpc3RyeS5SZWdpc3RyeS5nZXRBdHRyaWJ1dGUiLCJoby5jb21wb25lbnRzLnJlZ2lzdHJ5LlJlZ2lzdHJ5LmxvYWRDb21wb25lbnQiLCJoby5jb21wb25lbnRzLnJlZ2lzdHJ5LlJlZ2lzdHJ5LmxvYWRBdHRyaWJ1dGUiLCJoby5jb21wb25lbnRzLnJ1biIsImhvLmNvbXBvbmVudHMucmVnaXN0ZXIiLCJoby5mbHV4IiwiaG8uZmx1eC5DYWxsYmFja0hvbGRlciIsImhvLmZsdXguQ2FsbGJhY2tIb2xkZXIuY29uc3RydWN0b3IiLCJoby5mbHV4LkNhbGxiYWNrSG9sZGVyLnJlZ2lzdGVyIiwiaG8uZmx1eC5DYWxsYmFja0hvbGRlci51bnJlZ2lzdGVyIiwiaG8uZmx1eC5hY3Rpb25zIiwiaG8uZmx1eC5hY3Rpb25zLkFjdGlvbiIsImhvLmZsdXguYWN0aW9ucy5BY3Rpb24uY29uc3RydWN0b3IiLCJoby5mbHV4LmFjdGlvbnMuQWN0aW9uLm5hbWUiLCJoby5mbHV4LmFjdGlvbnMuUmVnaXN0cnkiLCJoby5mbHV4LmFjdGlvbnMuUmVnaXN0cnkuY29uc3RydWN0b3IiLCJoby5mbHV4LmFjdGlvbnMuUmVnaXN0cnkucmVnaXN0ZXIiLCJoby5mbHV4LmFjdGlvbnMuUmVnaXN0cnkuZ2V0IiwiaG8uZmx1eC5hY3Rpb25zLlJlZ2lzdHJ5LmxvYWRBY3Rpb24iLCJoby5mbHV4LnJlZ2lzdHJ5IiwiaG8uZmx1eC5yZWdpc3RyeS5SZWdpc3RyeSIsImhvLmZsdXgucmVnaXN0cnkuUmVnaXN0cnkuY29uc3RydWN0b3IiLCJoby5mbHV4LnJlZ2lzdHJ5LlJlZ2lzdHJ5LnJlZ2lzdGVyIiwiaG8uZmx1eC5yZWdpc3RyeS5SZWdpc3RyeS5nZXQiLCJoby5mbHV4LnJlZ2lzdHJ5LlJlZ2lzdHJ5LmxvYWRTdG9yZSIsImhvLmZsdXguc3RhdGVwcm92aWRlciIsImhvLmZsdXguc3RhdGVwcm92aWRlci5TdGF0ZVByb3ZpZGVyIiwiaG8uZmx1eC5zdGF0ZXByb3ZpZGVyLlN0YXRlUHJvdmlkZXIuY29uc3RydWN0b3IiLCJoby5mbHV4LnN0YXRlcHJvdmlkZXIuU3RhdGVQcm92aWRlci5yZXNvbHZlIiwiaG8uZmx1eC5zdGF0ZXByb3ZpZGVyLlN0YXRlUHJvdmlkZXIuZ2V0U3RhdGVzIiwiaG8uZmx1eC5TdG9yZSIsImhvLmZsdXguU3RvcmUuY29uc3RydWN0b3IiLCJoby5mbHV4LlN0b3JlLmluaXQiLCJoby5mbHV4LlN0b3JlLm5hbWUiLCJoby5mbHV4LlN0b3JlLnJlZ2lzdGVyIiwiaG8uZmx1eC5TdG9yZS5vbiIsImhvLmZsdXguU3RvcmUuaGFuZGxlIiwiaG8uZmx1eC5TdG9yZS5jaGFuZ2VkIiwiaG8uZmx1eC5Sb3V0ZXIiLCJoby5mbHV4LlJvdXRlci5jb25zdHJ1Y3RvciIsImhvLmZsdXguUm91dGVyLmluaXQiLCJoby5mbHV4LlJvdXRlci5nbyIsImhvLmZsdXguUm91dGVyLmluaXRTdGF0ZXMiLCJoby5mbHV4LlJvdXRlci5nZXRTdGF0ZUZyb21OYW1lIiwiaG8uZmx1eC5Sb3V0ZXIub25TdGF0ZUNoYW5nZVJlcXVlc3RlZCIsImhvLmZsdXguUm91dGVyLm9uSGFzaENoYW5nZSIsImhvLmZsdXguUm91dGVyLnNldFVybCIsImhvLmZsdXguUm91dGVyLnJlZ2V4RnJvbVVybCIsImhvLmZsdXguUm91dGVyLmFyZ3NGcm9tVXJsIiwiaG8uZmx1eC5Sb3V0ZXIuc3RhdGVGcm9tVXJsIiwiaG8uZmx1eC5Sb3V0ZXIudXJsRnJvbVN0YXRlIiwiaG8uZmx1eC5Sb3V0ZXIuZXF1YWxzIiwiaG8uZmx1eC5EaXNwYXRjaGVyIiwiaG8uZmx1eC5EaXNwYXRjaGVyLmNvbnN0cnVjdG9yIiwiaG8uZmx1eC5EaXNwYXRjaGVyLndhaXRGb3IiLCJoby5mbHV4LkRpc3BhdGNoZXIuZGlzcGF0Y2giLCJoby5mbHV4LkRpc3BhdGNoZXIuaW52b2tlQ2FsbGJhY2siLCJoby5mbHV4LkRpc3BhdGNoZXIuc3RhcnREaXNwYXRjaGluZyIsImhvLmZsdXguRGlzcGF0Y2hlci5zdG9wRGlzcGF0Y2hpbmciLCJoby5mbHV4LnJ1biIsImhvLnVpIiwiaG8udWkucnVuIiwiaG8udWkuT3B0aW9ucyIsImhvLnVpLk9wdGlvbnMuY29uc3RydWN0b3IiLCJoby51aS5PcHRpb25zLnByb2Nlc3MiLCJoby51aS5PcHRpb25zLnByb2Nlc3NSb290IiwiaG8udWkuT3B0aW9ucy5wcm9jZXNzUm91dGVyIiwiaG8udWkuT3B0aW9ucy5wcm9jZXNzTWFwIiwiaG8u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QSxHQUFHQSxDQUFDQSxJQUFJQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQSxLQUFLQSxJQUFJQSxFQUFFQSxDQUFDQTt3QkFDNUNBLElBQUlBLEdBQUdBLEVBQUVBLElBQUlBLEVBQUVBLE9BQU9BLEVBQUVBLE1BQU1BLEVBQUVBLFdBQVdBLEVBQUVBLE1BQU1BLEVBQUVBLE9BQU9BLENBQUNBO3dCQUM3REEsQUFDQUEseUNBRHlDQTt3QkFDekNBLEVBQUVBLENBQUFBLENBQUNBLENBQUNBLENBQUNBLEtBQUtBLEtBQUtBLENBQUNBLENBQUNBLENBQUNBLENBQUNBOzRCQUNsQkEsR0FBR0EsR0FBR0EsSUFBSUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7NEJBQ2pDQSxHQUFHQSxHQUFHQSxHQUFHQSxDQUFDQSxNQUFNQSxDQUFDQSxDQUFDQSxFQUFFQSxHQUFHQSxDQUFDQSxNQUFNQSxHQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTs0QkFDbENBLElBQUlBLEdBQUdBLE1BQU1BLENBQUNBOzRCQUNDQSxNQUFNQSxHQUFHQSxLQUFLQSxDQUFDQTs0QkFDOUJBLFdBQVdBLEdBQUdBLElBQUlBLENBQUNBOzRCQUNuQkEsTUFBTUEsR0FBR0EsS0FBS0EsQ0FBQ0E7d0JBQ2hCQSxDQUFDQTt3QkFBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0E7NEJBQ1BBLEdBQUdBLEdBQUdBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLElBQUlBLEVBQUVBLENBQUNBOzRCQUNsQkEsSUFBSUEsR0FBR0EsQ0FBQ0EsR0FBR0EsR0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsS0FBS0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7NEJBQ3ZDQSxPQUFPQSxHQUFHQSxHQUFHQSxDQUFDQSxDQUFDQSxDQUFDQSxLQUFLQSxHQUFHQSxDQUFDQTs0QkFDVkEsTUFBTUEsR0FBR0EsSUFBSUEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0E7NEJBQzFDQSxXQUFXQSxHQUFHQSxNQUFNQSxJQUFJQSxHQUFHQSxDQUFDQSxHQUFHQSxDQUFDQSxNQUFNQSxHQUFDQSxDQUFDQSxDQUFDQSxLQUFLQSxHQUFHQSxDQUFDQTs0QkFDbERBLE1BQU1BLEdBQUdBLENBQUNBLENBQUNBLEdBQUdBLENBQUNBLEtBQUtBLENBQUNBLElBQUlBLENBQUNBLENBQUNBLENBQUNBLE1BQU1BLENBQUNBLENBQUNBOzRCQUVwQ0EsRUFBRUEsQ0FBQUEsQ0FBQ0EsV0FBV0EsSUFBSUEsRUFBRUEsQ0FBQ0EsVUFBVUEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsWUFBWUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7Z0NBQ3RFQSxXQUFXQSxHQUFHQSxLQUFLQSxDQUFDQTtnQ0FDcEJBLEdBQUdBLEdBQUdBLEdBQUdBLENBQUNBLE1BQU1BLENBQUNBLENBQUNBLEVBQUVBLEdBQUdBLENBQUNBLE1BQU1BLEdBQUNBLENBQUNBLENBQUNBLEdBQUdBLEdBQUdBLENBQUNBO2dDQUV4Q0EsT0FBT0EsR0FBR0EsSUFBSUEsQ0FBQ0E7NEJBQ2hCQSxDQUFDQTt3QkFDRkEsQ0FBQ0E7d0JBRURBLElBQUlBLEdBQUdBLElBQUlBLENBQUNBLEtBQUtBLENBQUNBLEdBQUdBLENBQUNBLE1BQU1BLEdBQUdBLENBQUNBLElBQUlBLEtBQUtBLE1BQU1BLEdBQUdBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBLENBQUVBLENBQUNBO3dCQUUzREEsRUFBRUEsQ0FBQUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7NEJBQ1pBLEtBQUtBLENBQUNBO3dCQUNQQSxDQUFDQTt3QkFBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0E7NEJBQ1BBLElBQUlBLENBQUNBLFFBQVFBLENBQUNBLElBQUlBLENBQUNBLEVBQUNBLE1BQU1BLEVBQUVBLElBQUlBLEVBQUVBLElBQUlBLEVBQUVBLEdBQUdBLEVBQUVBLElBQUlBLEVBQUVBLElBQUlBLEVBQUVBLE1BQU1BLEVBQUVBLE1BQU1BLEVBQUVBLFdBQVdBLEVBQUVBLFdBQVdBLEVBQUVBLE1BQU1BLEVBQUVBLE1BQU1BLEVBQUVBLFFBQVFBLEVBQUVBLEVBQUVBLEVBQUNBLENBQUNBLENBQUNBOzRCQUVsSUEsRUFBRUEsQ0FBQUEsQ0FBQ0EsQ0FBQ0EsT0FBT0EsSUFBSUEsQ0FBQ0EsV0FBV0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7Z0NBQzdCQSxJQUFJQSxNQUFNQSxHQUFHQSxJQUFJQSxDQUFDQSxLQUFLQSxDQUFDQSxJQUFJQSxFQUFFQSxJQUFJQSxDQUFDQSxRQUFRQSxDQUFDQSxJQUFJQSxDQUFDQSxRQUFRQSxDQUFDQSxNQUFNQSxHQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtnQ0FDckVBLElBQUlBLEdBQUdBLE1BQU1BLENBQUNBLElBQUlBLENBQUNBO2dDQUNuQkEsSUFBSUEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsR0FBR0EsRUFBRUEsQ0FBQ0E7Z0NBQ3BCQSxJQUFJQSxDQUFDQSxRQUFRQSxDQUFDQSxJQUFJQSxDQUFDQSxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQTs0QkFDakNBLENBQUNBO3dCQUNGQSxDQUFDQTt3QkFFREEsQ0FBQ0EsR0FBR0EsSUFBSUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0E7b0JBQzVCQSxDQUFDQTtvQkFFREEsTUFBTUEsQ0FBQ0EsRUFBQ0EsSUFBSUEsRUFBRUEsSUFBSUEsRUFBRUEsSUFBSUEsRUFBRUEsSUFBSUEsRUFBQ0EsQ0FBQ0E7Z0JBQ2pDQSxDQUFDQTtnQkFFT0gsK0JBQVlBLEdBQXBCQSxVQUFxQkEsSUFBSUEsRUFBRUEsTUFBTUE7b0JBQ2hDSSxNQUFNQSxHQUFHQSxFQUFFQSxDQUFDQSxNQUFNQSxDQUFDQSxNQUFNQSxDQUFDQSxDQUFDQTtvQkFFM0JBLEdBQUdBLENBQUFBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBLEdBQUdBLENBQUNBLEVBQUVBLENBQUNBLEdBQUdBLElBQUlBLENBQUNBLFFBQVFBLENBQUNBLE1BQU1BLEVBQUVBLENBQUNBLEVBQUVBLEVBQUVBLENBQUNBO3dCQUM5Q0EsSUFBSUEsS0FBS0EsR0FBR0EsSUFBSUEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7d0JBQzdCQSxFQUFFQSxDQUFBQSxDQUFDQSxLQUFLQSxDQUFDQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQTs0QkFDakJBLElBQUlBLEtBQUtBLEdBQUdBLHlDQUF5Q0EsQ0FBQ0E7NEJBQ3REQSxJQUFJQSxDQUFDQSxHQUFHQSxLQUFLQSxDQUFDQSxJQUFJQSxDQUFDQSxLQUFLQSxDQUFDQSxLQUFLQSxDQUFDQSxDQUFDQSxLQUFLQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTs0QkFDekNBLElBQUlBLElBQUlBLEdBQUdBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBOzRCQUNoQkEsSUFBSUEsU0FBU0EsQ0FBQ0E7NEJBQ2RBLEVBQUVBLENBQUFBLENBQUNBLElBQUlBLENBQUNBLE9BQU9BLENBQUNBLEdBQUdBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO2dDQUMzQkEsSUFBSUEsS0FBS0EsR0FBR0EsSUFBSUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0E7Z0NBQzVCQSxJQUFJQSxHQUFHQSxLQUFLQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxJQUFJQSxFQUFFQSxDQUFDQTtnQ0FDdkJBLFNBQVNBLEdBQUdBLEtBQUtBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLElBQUlBLEVBQUVBLENBQUNBOzRCQUM3QkEsQ0FBQ0E7NEJBRURBLElBQUlBLEtBQUtBLEdBQUdBLElBQUlBLENBQUNBLFFBQVFBLENBQUNBLE1BQU1BLEVBQUVBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBOzRCQUV4Q0EsSUFBSUEsTUFBTUEsR0FBR0EsRUFBRUEsQ0FB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QUdBLENBQUNBLEdBQUdBLEtBQUtBLENBQUNBO2dCQUM1RUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7Z0JBRUhBLE1BQU1BLENBQUNBLE9BQU9BLENBQUNBLFVBQUFBLENBQUNBO29CQUNmQSxBQUNBQSwyRUFEMkVBO29CQUMzRUEsRUFBRUEsQ0FBQ0EsV0FBV0EsQ0FBQ0EsT0FBT0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsS0FBSUEsQ0FBQ0EsR0FBR0EsR0FBR0EsU0FBU0EsR0FBR0EsQ0FBQ0EsR0FBR0EsR0FBR0EsR0FBR0EsQ0FBQ0EsR0FBR0EsS0FBS0EsQ0FBQ0E7Z0JBQ3hFQSxDQUFDQSxDQUFDQSxDQUFDQTtZQUNKQSxDQUFDQTtZQUVTTCw0QkFBVUEsR0FBcEJBO2dCQUNDTSxFQUFFQSxDQUFDQSxVQUFVQSxDQUFDQSxRQUFRQSxDQUFDQSxNQUFNQSxHQUFHQSxJQUFJQSxDQUFDQSxHQUFHQSxDQUFDQTtnQkFDekNBLEVBQUVBLENBQUNBLElBQUlBLENBQUNBLFFBQVFBLENBQUNBLE1BQU1BLEdBQUdBLElBQUlBLENBQUNBLEdBQUdBLENBQUNBO2dCQUNuQ0EsRUFBRUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsTUFBTUEsR0FBR0EsSUFBSUEsQ0FBQ0EsR0FBR0EsQ0FBQ0E7WUFDbkNBLENBQUNBO1lBRVNOLDRCQUFVQSxHQUFwQkE7Z0JBQ0NPOzs7O2tCQUlFQTtZQUNIQSxDQUFDQTtZQUNGUCxjQUFDQTtRQUFEQSxDQTNGQUYsQUEyRkNFLElBQUFGO0lBRUZBLENBQUNBLEVBaElTaEwsRUFBRUEsR0FBRkEsS0FBRUEsS0FBRkEsS0FBRUEsUUFnSVhBO0FBQURBLENBQUNBLEVBaElNLEVBQUUsS0FBRixFQUFFLFFBZ0lSIiwiZmlsZSI6ImhvLWFsbC5qcyIsInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZSBoby5wcm9taXNlIHtcclxuXHJcbiAgICBleHBvcnQgY2xhc3MgUHJvbWlzZTxULCBFPiB7XHJcblxyXG4gICAgICAgIGNvbnN0cnVjdG9yKGZ1bmM/OiAocmVzb2x2ZTooYXJnOlQpPT52b2lkLCByZWplY3Q6KGFyZzpFKT0+dm9pZCkgPT4gYW55KSB7XHJcbiAgICAgICAgICAgIGlmICh0eXBlb2YgZnVuYyA9PT0gJ2Z1bmN0aW9uJylcclxuICAgICAgICAgICAgICAgIGZ1bmMuY2FsbChcclxuICAgICAgICAgICAgICAgICAgICBhcmd1bWVudHMuY2FsbGVlLFxyXG4gICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uKGFyZzogVCl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucmVzb2x2ZShhcmcpXHJcbiAgICAgICAgICAgICAgICAgICAgfS5iaW5kKHRoaXMpLFxyXG4gICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uKGFyZzpFKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5yZWplY3QoYXJnKTtcclxuICAgICAgICAgICAgICAgICAgICB9LmJpbmQodGhpcylcclxuICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIGRhdGE6IFR8RSA9IHVuZGVmaW5lZDtcclxuICAgICAgICBwcml2YXRlIG9uUmVzb2x2ZTogKGFyZzE6VCkgPT4gYW55ID0gdW5kZWZpbmVkO1xyXG4gICAgICAgIHByaXZhdGUgb25SZWplY3Q6IChhcmcxOkUpID0+IGFueSA9IHVuZGVmaW5lZDtcclxuXHJcbiAgICAgICAgcHVibGljIHJlc29sdmVkOiBib29sZWFuID0gZmFsc2U7XHJcbiAgICAgICAgcHVibGljIHJlamVjdGVkOiBib29sZWFuID0gZmFsc2U7XHJcbiAgICAgICAgcHVibGljIGRvbmU6IGJvb2xlYW4gPSBmYWxzZTtcclxuXHJcbiAgICAgICAgcHJpdmF0ZSByZXQ6IFByb21pc2U8VCwgRT4gPSB1bmRlZmluZWQ7XHJcblxyXG4gICAgICAgIHByaXZhdGUgc2V0KGRhdGE/OiBUfEUpOiB2b2lkIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuZG9uZSlcclxuICAgICAgICAgICAgICAgIHRocm93IFwiUHJvbWlzZSBpcyBhbHJlYWR5IHJlc29sdmVkIC8gcmVqZWN0ZWRcIjtcclxuICAgICAgICAgICAgdGhpcy5kYXRhID0gZGF0YTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyByZXNvbHZlKGRhdGE/OiBUKTogdm9pZCB7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0KGRhdGEpO1xyXG4gICAgICAgICAgICB0aGlzLnJlc29sdmVkID0gdGhpcy5kb25lID0gdHJ1ZTtcclxuICAgICAgICAgICAgaWYgKHR5cGVvZiB0aGlzLm9uUmVzb2x2ZSA9PT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fcmVzb2x2ZSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIF9yZXNvbHZlKCk6IHZvaWQge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5yZXQgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5yZXQgPSBuZXcgUHJvbWlzZTxULEU+KCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHZhciB2OiBhbnkgPSB0aGlzLm9uUmVzb2x2ZSg8VD50aGlzLmRhdGEpO1xyXG5cclxuICAgICAgICAgICAgaWYgKHYgJiYgdiBpbnN0YW5jZW9mIFByb21pc2UpIHtcclxuICAgICAgICAgICAgICAgIHYudGhlbih0aGlzLnJldC5yZXNvbHZlLmJpbmQodGhpcy5yZXQpLCB0aGlzLnJldC5yZWplY3QuYmluZCh0aGlzLnJldCkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5yZXQucmVzb2x2ZSh2KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHJlamVjdChkYXRhPzogRSk6IHZvaWQge1xyXG4gICAgICAgICAgICB0aGlzLnNldChkYXRhKTtcclxuICAgICAgICAgICAgdGhpcy5yZWplY3RlZCA9IHRoaXMuZG9uZSA9IHRydWU7XHJcblxyXG4gICAgICAgICAgICBpZiAodHlwZW9mIHRoaXMub25SZWplY3QgPT09ICdmdW5jdGlvbicpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMub25SZWplY3QoPEU+dGhpcy5kYXRhKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKHRoaXMucmV0KSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnJldC5yZWplY3QoPEU+dGhpcy5kYXRhKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSBfcmVqZWN0KCk6IHZvaWQge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5yZXQgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5yZXQgPSBuZXcgUHJvbWlzZTxULEU+KCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmKHR5cGVvZiB0aGlzLm9uUmVqZWN0ID09PSAnZnVuY3Rpb24nKVxyXG4gICAgICAgICAgICAgICAgdGhpcy5vblJlamVjdCg8RT50aGlzLmRhdGEpO1xyXG4gICAgICAgICAgICB0aGlzLnJldC5yZWplY3QoPEU+dGhpcy5kYXRhKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyB0aGVuKHJlczogKGFyZzE6VCk9PmFueSwgcmVqPzogKGFyZzE6RSk9PmFueSk6IFByb21pc2U8YW55LGFueT4ge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5yZXQgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5yZXQgPSBuZXcgUHJvbWlzZTxULEU+KCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChyZXMgJiYgdHlwZW9mIHJlcyA9PT0gJ2Z1bmN0aW9uJylcclxuICAgICAgICAgICAgICAgIHRoaXMub25SZXNvbHZlID0gcmVzO1xyXG5cclxuICAgICAgICAgICAgaWYgKHJlaiAmJiB0eXBlb2YgcmVqID09PSAnZnVuY3Rpb24nKVxyXG4gICAgICAgICAgICAgICAgdGhpcy5vblJlamVjdCA9IHJlajtcclxuXHJcbiAgICAgICAgICAgIGlmICh0aGlzLnJlc29sdmVkKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9yZXNvbHZlKCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmICh0aGlzLnJlamVjdGVkKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9yZWplY3QoKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMucmV0O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIGNhdGNoKGNiOiAoYXJnMTpFKT0+YW55KTogdm9pZCB7XHJcbiAgICAgICAgICAgIHRoaXMub25SZWplY3QgPSBjYjtcclxuXHJcbiAgICAgICAgICAgIGlmICh0aGlzLnJlamVjdGVkKVxyXG4gICAgICAgICAgICAgICAgdGhpcy5fcmVqZWN0KCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzdGF0aWMgYWxsKGFycjogQXJyYXk8UHJvbWlzZTxhbnksIGFueT4+KTogUHJvbWlzZTxhbnksIGFueT4ge1xyXG4gICAgICAgICAgICB2YXIgcCA9IG5ldyBQcm9taXNlKCk7XHJcblxyXG4gICAgICAgICAgICB2YXIgZGF0YSA9IFtdO1xyXG5cclxuICAgICAgICAgICAgaWYgKGFyci5sZW5ndGggPT09IDApIHtcclxuICAgICAgICAgICAgICAgIHAucmVzb2x2ZSgpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgYXJyLmZvckVhY2goKHByb20sIGluZGV4KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgcHJvbVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbihkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwLmRvbmUpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhW2luZGV4XSA9IGQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhbGxSZXNvbHZlZCA9IGFyci5yZWR1Y2UoZnVuY3Rpb24oc3RhdGUsIHAxKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gc3RhdGUgJiYgcDEucmVzb2x2ZWQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIHRydWUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoYWxsUmVzb2x2ZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHAucmVzb2x2ZShkYXRhKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAuY2F0Y2goZnVuY3Rpb24oZXJyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHAucmVqZWN0KGVycik7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHA7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzdGF0aWMgY2hhaW4oYXJyOiBBcnJheTxQcm9taXNlPGFueSwgYW55Pj4pOiBQcm9taXNlPGFueSwgYW55PiB7XHJcbiAgICAgICAgICAgIHZhciBwOiBQcm9taXNlPGFueSwgYW55PiA9IG5ldyBQcm9taXNlKCk7XHJcbiAgICAgICAgICAgIHZhciBkYXRhOiBBcnJheTxhbnk+ID0gW107XHJcblxyXG4gICAgICAgICAgICBmdW5jdGlvbiBuZXh0KCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHAuZG9uZSlcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICAgICAgICAgICAgdmFyIG46IFByb21pc2U8YW55LCBhbnk+ID0gYXJyLmxlbmd0aCA/IGFyci5zaGlmdCgpIDogcDtcclxuICAgICAgICAgICAgICAgIG4udGhlbihcclxuICAgICAgICAgICAgICAgICAgICAocmVzdWx0KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEucHVzaChyZXN1bHQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBuZXh0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAoZXJyKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHAucmVqZWN0KGVycik7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIG5leHQoKTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBwO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc3RhdGljIGNyZWF0ZShvYmo6IGFueSk6IFByb21pc2U8YW55LCBhbnk+IHtcclxuICAgICAgICAgICAgaWYgKG9iaiBpbnN0YW5jZW9mIFByb21pc2UpXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gb2JqO1xyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHZhciBwID0gbmV3IFByb21pc2UoKTtcclxuICAgICAgICAgICAgICAgIHAucmVzb2x2ZShvYmopO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHA7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG59XHJcbiIsIm1vZHVsZSBoby5jbGFzc2xvYWRlci51dGlsIHtcblxuXHRleHBvcnQgZnVuY3Rpb24gZ2V0KHBhdGg6IHN0cmluZywgb2JqOmFueSA9IHdpbmRvdyk6IGFueSB7XG5cdFx0cGF0aC5zcGxpdCgnLicpLm1hcChwYXJ0ID0+IHtcblx0XHRcdG9iaiA9IG9ialtwYXJ0XTtcblx0XHR9KVxuXHRcdHJldHVybiBvYmo7XG5cdH1cbn1cbiIsIm1vZHVsZSBoby5jbGFzc2xvYWRlci51dGlsIHtcblx0ZXhwb3J0IGZ1bmN0aW9uIGV4cG9zZShuYW1lOnN0cmluZywgb2JqOmFueSwgZXJyb3IgPSBmYWxzZSkge1xuXHRcdGxldCBwYXRoID0gbmFtZS5zcGxpdCgnLicpO1xuXHRcdG5hbWUgPSBwYXRoLnBvcCgpO1xuXG5cdFx0bGV0IGdsb2JhbCA9IHdpbmRvdztcblxuXHRcdHBhdGgubWFwKHBhcnQgPT4ge1xuXHRcdFx0Z2xvYmFsW3BhcnRdID0gZ2xvYmFsW3BhcnRdIHx8IHt9O1xuXHRcdFx0Z2xvYmFsID0gZ2xvYmFsW3BhcnRdO1xuXHRcdH0pXG5cblx0XHRpZighIWdsb2JhbFtuYW1lXSkge1xuXHRcdFx0bGV0IG1zZyA9IFwiR2xvYmFsIG9iamVjdCBcIiArIHBhdGguam9pbignLicpICsgXCIuXCIgKyBuYW1lICsgXCIgYWxyZWFkeSBleGlzdHNcIjtcblx0XHRcdGlmKGVycm9yKVxuXHRcdFx0XHR0aHJvdyBtc2c7XG5cdFx0XHRlbHNlXG5cdFx0XHRcdGNvbnNvbGUuaW5mbyhtc2cpO1xuXG5cdFx0fVxuXG5cdFx0Z2xvYmFsW25hbWVdID0gb2JqO1xuXHR9XG59XG4iLCJtb2R1bGUgaG8uY2xhc3Nsb2FkZXIueGhyIHtcblxuXHRleHBvcnQgZnVuY3Rpb24gZ2V0KHVybDogc3RyaW5nKTogaG8ucHJvbWlzZS5Qcm9taXNlPHN0cmluZywgc3RyaW5nPiB7XG5cdFx0cmV0dXJuIG5ldyBoby5wcm9taXNlLlByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuXG4gICAgICAgICAgICAgICAgbGV0IHhtbGh0dHAgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICAgICAgICAgICAgICB4bWxodHRwLm9ucmVhZHlzdGF0ZWNoYW5nZSA9ICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYoeG1saHR0cC5yZWFkeVN0YXRlID09IDQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCByZXNwID0geG1saHR0cC5yZXNwb25zZVRleHQ7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZih4bWxodHRwLnN0YXR1cyA9PSAyMDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKHJlc3ApO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVqZWN0KHJlc3ApO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgIHhtbGh0dHAub3BlbignR0VUJywgdXJsKTtcbiAgICAgICAgICAgICAgICB4bWxodHRwLnNlbmQoKTtcbiAgICAgICAgICAgIH0pO1xuXHR9XG59XG4iLCJtb2R1bGUgaG8uY2xhc3Nsb2FkZXIge1xuXG5cdGV4cG9ydCB0eXBlIGNsYXp6ID0gRnVuY3Rpb247XG5cdGV4cG9ydCB0eXBlIFByb21pc2VPZkNsYXNzZXMgPSBoby5wcm9taXNlLlByb21pc2U8Y2xhenpbXSwgYW55PjtcblxufVxuIiwibW9kdWxlIGhvLmNsYXNzbG9hZGVyIHtcblxuXHRleHBvcnQgaW50ZXJmYWNlIElMb2FkQXJndW1lbnRzIHtcblx0XHRuYW1lPzogc3RyaW5nO1xuXHRcdHVybD86IHN0cmluZztcblx0XHRwYXJlbnQ/OiBib29sZWFuO1xuXHRcdGV4cG9zZT86IGJvb2xlYW47XG5cdFx0c3VwZXI/OiBBcnJheTxzdHJpbmc+O1xuXHR9XG5cblx0ZXhwb3J0IGNsYXNzIExvYWRBcmd1bWVudHMgaW1wbGVtZW50cyBJTG9hZEFyZ3VtZW50cyB7XG5cblx0XHRuYW1lOiBzdHJpbmc7XG5cdFx0dXJsOiBzdHJpbmc7XG5cdFx0cGFyZW50OiBib29sZWFuO1xuXHRcdGV4cG9zZTogYm9vbGVhbjtcblx0XHRzdXBlcjogQXJyYXk8c3RyaW5nPjtcblxuXHRcdGNvbnN0cnVjdG9yKGFyZzogSUxvYWRBcmd1bWVudHMsIHJlc29sdmVVcmw6IChuYW1lOnN0cmluZyk9PnN0cmluZykge1xuXHRcdFx0dGhpcy5uYW1lID0gYXJnLm5hbWU7XG5cdFx0XHR0aGlzLnVybCA9IGFyZy51cmwgfHwgcmVzb2x2ZVVybChhcmcubmFtZSk7XG5cdFx0XHR0aGlzLnBhcmVudCA9IGFyZy5wYXJlbnQgfHwgdHJ1ZTtcblx0XHRcdHRoaXMuZXhwb3NlID0gYXJnLmV4cG9zZSB8fCB0cnVlO1xuXHRcdFx0dGhpcy5zdXBlciA9IGFyZy5zdXBlcjtcblx0XHR9XG5cblx0fVxuXG59XG4iLCJtb2R1bGUgaG8uY2xhc3Nsb2FkZXIge1xuXG5cdGV4cG9ydCBlbnVtIFdhcm5MZXZlbCB7XG5cdFx0SU5GTyxcblx0XHRFUlJPUlxuXHR9XG5cblx0ZXhwb3J0IGludGVyZmFjZSBJTG9hZGVyQ29uZmlnIHtcblx0XHRsb2FkVHlwZT86IExvYWRUeXBlO1xuXHRcdHVybFRlbXBsYXRlPzogc3RyaW5nO1xuXHRcdHVzZURpcj86IGJvb2xlYW47XG5cdFx0dXNlTWluPzogYm9vbGVhbjtcblx0XHQvL2V4aXN0cz86IChuYW1lOiBzdHJpbmcpPT5ib29sZWFuO1xuXHRcdGNhY2hlPzogYm9vbGVhbjtcblx0XHR3YXJuTGV2ZWw/OiBXYXJuTGV2ZWxcblx0fVxuXG5cdGV4cG9ydCBjbGFzcyBMb2FkZXJDb25maWcgaW1wbGVtZW50cyBJTG9hZGVyQ29uZmlnIHtcblxuXHRcdGxvYWRUeXBlOiBMb2FkVHlwZTtcblx0XHR1cmxUZW1wbGF0ZTogc3RyaW5nO1xuXHRcdHVzZURpcjogYm9vbGVhbjtcblx0XHR1c2VNaW46IGJvb2xlYW47XG5cdFx0Ly9leGlzdHM6IChuYW1lOiBzdHJpbmcpPT5ib29sZWFuO1xuXHRcdGNhY2hlOiBib29sZWFuO1xuXHRcdHdhcm5MZXZlbDogV2FybkxldmVsO1xuXG5cdFx0Y29uc3RydWN0b3IoYzogSUxvYWRlckNvbmZpZyA9IDxJTG9hZGVyQ29uZmlnPnt9KSB7XG5cdFx0XHR0aGlzLmxvYWRUeXBlID0gYy5sb2FkVHlwZSB8fCBMb2FkVHlwZS5FVkFMO1xuXHRcdFx0dGhpcy51cmxUZW1wbGF0ZSA9IGMudXJsVGVtcGxhdGUgfHwgXCIke25hbWV9LmpzXCJcblx0XHRcdHRoaXMudXNlRGlyID0gdHlwZW9mIGMudXNlRGlyID09PSAnYm9vbGVhbicgPyBjLnVzZURpciA6IHRydWU7XG5cdFx0XHR0aGlzLnVzZU1pbiA9IHR5cGVvZiBjLnVzZU1pbiA9PT0gJ2Jvb2xlYW4nID8gYy51c2VNaW4gOiBmYWxzZTtcblx0XHRcdC8vdGhpcy5leGlzdHMgPSBjLmV4aXN0cyB8fCB0aGlzLmV4aXN0cy5iaW5kKHRoaXMpO1xuXHRcdFx0dGhpcy5jYWNoZSA9IHR5cGVvZiBjLmNhY2hlID09PSAnYm9vbGVhbicgPyBjLmNhY2hlIDogdHJ1ZTtcblx0XHRcdHRoaXMud2FybkxldmVsID0gYy53YXJuTGV2ZWwgfHwgV2FybkxldmVsLklORk87XG5cdFx0fVxuXG5cdH1cblxufVxuIiwibW9kdWxlIGhvLmNsYXNzbG9hZGVyIHtcblxuXHRleHBvcnQgZW51bSBMb2FkVHlwZSB7XG5cdFx0U0NSSVBULFxuXHRcdEZVTkNUSU9OLFxuXHRcdEVWQUxcblx0fVxuXHRcbn1cbiIsIm1vZHVsZSBoby5jbGFzc2xvYWRlciB7XG5cblx0ZXhwb3J0IGxldCBtYXBwaW5nOiB7W2tleTpzdHJpbmddOiBzdHJpbmd9ID0ge31cblxuXHRleHBvcnQgY2xhc3MgQ2xhc3NMb2FkZXIge1xuXG5cdFx0cHJpdmF0ZSBjb25mOiBJTG9hZGVyQ29uZmlnID0gPElMb2FkZXJDb25maWc+e307XG5cdFx0cHJpdmF0ZSBjYWNoZToge1trZXk6c3RyaW5nXTogRnVuY3Rpb259ID0ge31cblxuXHRcdGNvbnN0cnVjdG9yKGM/OiBJTG9hZGVyQ29uZmlnKSB7XG5cdFx0XHR0aGlzLmNvbmYgPSBuZXcgTG9hZGVyQ29uZmlnKGMpO1xuXHRcdH1cblxuXHRcdGNvbmZpZyhjOiBJTG9hZGVyQ29uZmlnKTogdm9pZCB7XG5cdFx0XHR0aGlzLmNvbmYgPSBuZXcgTG9hZGVyQ29uZmlnKGMpO1xuXHRcdH1cblxuXHRcdGxvYWQoYXJnOiBJTG9hZEFyZ3VtZW50cykge1xuXHRcdFx0YXJnID0gbmV3IExvYWRBcmd1bWVudHMoYXJnLCB0aGlzLnJlc29sdmVVcmwuYmluZCh0aGlzKSk7XG5cblx0XHRcdHN3aXRjaCh0aGlzLmNvbmYubG9hZFR5cGUpIHtcblx0XHRcdFx0Y2FzZSBMb2FkVHlwZS5TQ1JJUFQ6XG5cdFx0XHRcdFx0cmV0dXJuIHRoaXMubG9hZF9zY3JpcHQoYXJnKTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSBMb2FkVHlwZS5GVU5DVElPTjpcblx0XHRcdFx0XHRyZXR1cm4gdGhpcy5sb2FkX2Z1bmN0aW9uKGFyZyk7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgTG9hZFR5cGUuRVZBTDpcblx0XHRcdFx0XHRyZXR1cm4gdGhpcy5sb2FkX2V2YWwoYXJnKTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdH1cblx0XHR9XG5cblx0XHRwcm90ZWN0ZWQgbG9hZF9zY3JpcHQoYXJnOiBJTG9hZEFyZ3VtZW50cyk6IFByb21pc2VPZkNsYXNzZXMge1xuXHRcdFx0bGV0IHNlbGYgPSB0aGlzO1xuXHRcdFx0bGV0IHBhcmVudHMgPSBbXTtcblx0XHRcdGxldCBwID0gbmV3IGhvLnByb21pc2UuUHJvbWlzZTxjbGF6eltdLCBhbnk+KCk7XG5cblx0XHRcdGlmKHRoaXMuY29uZi5jYWNoZSAmJiAhIXRoaXMuY2FjaGVbYXJnLm5hbWVdKVxuXHRcdFx0XHRyZXR1cm4gaG8ucHJvbWlzZS5Qcm9taXNlLmNyZWF0ZShbdGhpcy5jYWNoZVthcmcubmFtZV1dKTtcblxuXHRcdFx0aWYoISFhcmcucGFyZW50KSB7XG5cdFx0XHRcdHRoaXMuZ2V0UGFyZW50TmFtZShhcmcudXJsKVxuXHRcdFx0XHQudGhlbihwYXJlbnROYW1lID0+IHtcblx0XHRcdFx0XHQvL2lmKGFyZy5zdXBlciA9PT0gcGFyZW50TmFtZSlcblx0XHRcdFx0XHRpZihhcmcuc3VwZXIuaW5kZXhPZihwYXJlbnROYW1lKSAhPT0gLTEpXG5cdFx0XHRcdFx0XHRyZXR1cm4gW107XG5cdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0cmV0dXJuIHNlbGYubG9hZCh7bmFtZTogcGFyZW50TmFtZSwgcGFyZW50OiB0cnVlLCBleHBvc2U6IGFyZy5leHBvc2UsIHN1cGVyOiBhcmcuc3VwZXJ9KVxuXHRcdFx0XHR9KVxuXHRcdFx0XHQudGhlbihwID0+IHtcblx0XHRcdFx0XHRwYXJlbnRzID0gcFxuXHRcdFx0XHRcdHJldHVybiBsb2FkX2ludGVybmFsKCk7XG5cdFx0XHRcdH0pXG5cdFx0XHRcdC50aGVuKGNsYXp6ID0+IHtcblx0XHRcdFx0XHRpZihzZWxmLmNvbmYuY2FjaGUpXG5cdFx0XHRcdFx0XHRzZWxmLmNhY2hlW2FyZy5uYW1lXSA9IGNsYXp6O1xuXHRcdFx0XHRcdHBhcmVudHMgPSBwYXJlbnRzLmNvbmNhdChjbGF6eik7XG5cdFx0XHRcdFx0cC5yZXNvbHZlKHBhcmVudHMpO1xuXHRcdFx0XHR9KVxuXHRcdFx0fVxuXHRcdFx0ZWxzZSB7XG5cdFx0XHRcdGxvYWRfaW50ZXJuYWwoKVxuXHRcdFx0XHQudGhlbihjbGF6eiA9PiB7XG5cdFx0XHRcdFx0cC5yZXNvbHZlKGNsYXp6KTtcblx0XHRcdFx0fSlcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIHA7XG5cblxuXHRcdFx0ZnVuY3Rpb24gbG9hZF9pbnRlcm5hbCgpOiBQcm9taXNlT2ZDbGFzc2VzIHtcblx0XHRcdFx0cmV0dXJuIG5ldyBoby5wcm9taXNlLlByb21pc2U8Y2xhenpbXSwgYW55PigocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG5cdFx0XHRcdFx0bGV0IHNyYyA9IGFyZy51cmw7XG5cdFx0XHRcdFx0bGV0IHNjcmlwdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NjcmlwdCcpO1xuXHRcdFx0XHRcdHNjcmlwdC5vbmxvYWQgPSBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRcdGlmKHR5cGVvZiB1dGlsLmdldChhcmcubmFtZSkgPT09ICdmdW5jdGlvbicpXG5cdFx0XHRcdFx0XHRcdHJlc29sdmUoW3V0aWwuZ2V0KGFyZy5uYW1lKV0pO1xuXHRcdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0XHRyZWplY3QoYEVycm9yIHdoaWxlIGxvYWRpbmcgQ2xhc3MgJHthcmcubmFtZX1gKVxuXHRcdFx0XHRcdH0uYmluZCh0aGlzKTtcblx0XHRcdFx0XHRzY3JpcHQuc3JjID0gc3JjO1xuXHRcdFx0XHRcdGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdoZWFkJylbMF0uYXBwZW5kQ2hpbGQoc2NyaXB0KTtcblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cblx0XHR9XG5cblx0XHRwcm90ZWN0ZWQgbG9hZF9mdW5jdGlvbihhcmc6IElMb2FkQXJndW1lbnRzKTogUHJvbWlzZU9mQ2xhc3NlcyB7XG5cdFx0XHRsZXQgc2VsZiA9IHRoaXM7XG5cdFx0XHRsZXQgcGFyZW50cyA9IFtdO1xuXHRcdFx0bGV0IHNvdXJjZTtcblxuXHRcdFx0cmV0dXJuIHhoci5nZXQoYXJnLnVybClcblx0XHRcdC50aGVuKHNyYyA9PiB7XG5cdFx0XHRcdHNvdXJjZSA9IHNyYztcblx0XHRcdFx0aWYoISFhcmcucGFyZW50KSB7XG5cdFx0XHRcdFx0bGV0IHBhcmVudE5hbWUgPSBzZWxmLnBhcnNlUGFyZW50RnJvbVNvdXJjZShzcmMpO1xuXHRcdFx0XHRcdC8vaWYoYXJnLnN1cGVyID09PSBwYXJlbnROYW1lKVxuXHRcdFx0XHRcdGlmKGFyZy5zdXBlci5pbmRleE9mKHBhcmVudE5hbWUpICE9PSAtMSlcblx0XHRcdFx0XHRcdHJldHVybiBbXTtcblx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRyZXR1cm4gc2VsZi5sb2FkKHtuYW1lOiBwYXJlbnROYW1lLCBwYXJlbnQ6IHRydWUsIGV4cG9zZTogYXJnLmV4cG9zZSwgc3VwZXI6IGFyZy5zdXBlcn0pO1xuXHRcdFx0XHR9XG5cdFx0XHR9KVxuXHRcdFx0LnRoZW4ocCA9PiB7XG5cdFx0XHRcdHBhcmVudHMgPSBwO1xuXHRcdFx0XHRsZXQgc3JjID0gc291cmNlICsgXCJcXG5yZXR1cm4gXCIgKyBhcmcubmFtZSArIFwiXFxuLy8jIHNvdXJjZVVSTD1cIiArIHdpbmRvdy5sb2NhdGlvbi5ocmVmICsgYXJnLnVybDtcblx0XHRcdFx0bGV0IGNsYXp6ID0gbmV3IEZ1bmN0aW9uKHNyYykoKTtcblx0XHRcdFx0aWYoYXJnLmV4cG9zZSlcblx0XHRcdFx0XHR1dGlsLmV4cG9zZShhcmcubmFtZSwgY2xhenosIHNlbGYuY29uZi53YXJuTGV2ZWwgPT0gV2FybkxldmVsLkVSUk9SKTtcblx0XHRcdFx0cmV0dXJuIGNsYXp6XG5cdFx0XHR9KVxuXHRcdFx0LnRoZW4oY2xhenogPT4ge1xuXHRcdFx0XHRpZihzZWxmLmNvbmYuY2FjaGUpXG5cdFx0XHRcdFx0c2VsZi5jYWNoZVthcmcubmFtZV0gPSBjbGF6ejtcblx0XHRcdFx0cGFyZW50cy5wdXNoKGNsYXp6KTtcblx0XHRcdFx0cmV0dXJuIHBhcmVudHM7XG5cdFx0XHR9KVxuXHRcdH1cblxuXHRcdHByb3RlY3RlZCBsb2FkX2V2YWwoYXJnOiBJTG9hZEFyZ3VtZW50cyk6IFByb21pc2VPZkNsYXNzZXMge1xuXHRcdFx0bGV0IHNlbGYgPSB0aGlzO1xuXHRcdFx0bGV0IHBhcmVudHMgPSBbXTtcblx0XHRcdGxldCBzb3VyY2U7XG5cblx0XHRcdHJldHVybiB4aHIuZ2V0KGFyZy51cmwpXG5cdFx0XHQudGhlbihzcmMgPT4ge1xuXHRcdFx0XHRzb3VyY2UgPSBzcmM7XG5cdFx0XHRcdGlmKCEhYXJnLnBhcmVudCkge1xuXHRcdFx0XHRcdGxldCBwYXJlbnROYW1lID0gc2VsZi5wYXJzZVBhcmVudEZyb21Tb3VyY2Uoc3JjKTtcblx0XHRcdFx0XHQvL2lmKGFyZy5zdXBlciA9PT0gcGFyZW50TmFtZSlcblx0XHRcdFx0XHRpZihhcmcuc3VwZXIuaW5kZXhPZihwYXJlbnROYW1lKSAhPT0gLTEpXG5cdFx0XHRcdFx0XHRyZXR1cm4gW107XG5cdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0cmV0dXJuIHNlbGYubG9hZCh7bmFtZTogcGFyZW50TmFtZSwgcGFyZW50OiB0cnVlLCBleHBvc2U6IGFyZy5leHBvc2UsIHN1cGVyOiBhcmcuc3VwZXJ9KTtcblx0XHRcdFx0fVxuXHRcdFx0fSlcblx0XHRcdC50aGVuKHAgPT4ge1xuXHRcdFx0XHRwYXJlbnRzID0gcDtcblx0XHRcdFx0bGV0IHJldCA9IFwiXFxuKGZ1bmN0aW9uKCl7cmV0dXJuIFwiICsgYXJnLm5hbWUgKyBcIjt9KSgpO1wiO1xuXHRcdFx0XHRsZXQgc3JjID0gc291cmNlICsgcmV0ICsgXCJcXG4vLyMgc291cmNlVVJMPVwiICsgd2luZG93LmxvY2F0aW9uLmhyZWYgKyBhcmcudXJsO1xuXHRcdFx0XHRsZXQgY2xhenogPSBldmFsKHNyYyk7XG5cdFx0XHRcdGlmKGFyZy5leHBvc2UpXG5cdFx0XHRcdFx0dXRpbC5leHBvc2UoYXJnLm5hbWUsIGNsYXp6LCBzZWxmLmNvbmYud2FybkxldmVsID09IFdhcm5MZXZlbC5FUlJPUik7XG5cdFx0XHRcdHJldHVybiBjbGF6ejtcblx0XHRcdH0pXG5cdFx0XHQudGhlbihjbGF6eiA9PiB7XG5cdFx0XHRcdGlmKHNlbGYuY29uZi5jYWNoZSlcblx0XHRcdFx0XHRzZWxmLmNhY2hlW2FyZy5uYW1lXSA9IGNsYXp6O1xuXHRcdFx0XHRwYXJlbnRzLnB1c2goY2xhenopO1xuXHRcdFx0XHRyZXR1cm4gcGFyZW50cztcblx0XHRcdH0pXG5cdFx0fVxuXG5cdFx0cHJvdGVjdGVkIGdldFBhcmVudE5hbWUodXJsOiBzdHJpbmcpOiBoby5wcm9taXNlLlByb21pc2U8c3RyaW5nLCBhbnk+IHtcblx0XHRcdGxldCBzZWxmID0gdGhpcztcblxuXHRcdFx0cmV0dXJuXHR4aHIuZ2V0KHVybClcblx0XHRcdFx0LnRoZW4oc3JjID0+IHtcblx0XHRcdFx0XHRyZXR1cm4gc2VsZi5wYXJzZVBhcmVudEZyb21Tb3VyY2Uoc3JjKTtcblx0XHRcdFx0fSlcblx0XHR9XG5cblx0XHRwcm90ZWN0ZWQgcGFyc2VQYXJlbnRGcm9tU291cmNlKHNyYzogc3RyaW5nKTogc3RyaW5nIHtcblx0XHRcdGxldCByX3N1cGVyID0gL31cXClcXCgoLiopXFwpOy87XG5cdFx0XHRsZXQgbWF0Y2ggPSBzcmMubWF0Y2gocl9zdXBlcik7XG5cdFx0XHRpZihtYXRjaClcblx0XHRcdFx0cmV0dXJuIG1hdGNoWzFdO1xuXHRcdFx0ZWxzZVxuXHRcdFx0XHRyZXR1cm4gdW5kZWZpbmVkO1xuXHRcdH1cblxuXHRcdHB1YmxpYyByZXNvbHZlVXJsKG5hbWU6IHN0cmluZyk6IHN0cmluZyB7XG5cdFx0XHRpZighIW1hcHBpbmdbbmFtZV0pXG4gICAgICAgICAgICAgICAgcmV0dXJuIG1hcHBpbmdbbmFtZV07XG5cblx0XHRcdGlmKHRoaXMuY29uZi51c2VEaXIpIHtcbiAgICAgICAgICAgICAgICBuYW1lICs9ICcuJyArIG5hbWUuc3BsaXQoJy4nKS5wb3AoKTtcbiAgICAgICAgICAgIH1cblxuXHRcdFx0bmFtZSA9IG5hbWUuc3BsaXQoJy4nKS5qb2luKCcvJyk7XG5cblx0XHRcdGlmKHRoaXMuY29uZi51c2VNaW4pXG4gICAgICAgICAgICAgICAgbmFtZSArPSAnLm1pbidcblxuXHRcdFx0cmV0dXJuIHRoaXMuY29uZi51cmxUZW1wbGF0ZS5yZXBsYWNlKCcke25hbWV9JywgbmFtZSk7XG5cdFx0fVxuXG5cdFx0cHJvdGVjdGVkIGV4aXN0cyhuYW1lOiBzdHJpbmcpOiBib29sZWFuIHtcblx0XHRcdHJldHVybiAhIXRoaXMuY2FjaGVbbmFtZV07XG5cdFx0fVxuXHR9XG59XG4iLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vLi4vLi4vYm93ZXJfY29tcG9uZW50cy9oby1wcm9taXNlL2Rpc3QvcHJvbWlzZS5kLnRzXCIvPlxuXG5tb2R1bGUgaG8uY2xhc3Nsb2FkZXIge1xuXG5cdGxldCBsb2FkZXIgPSBuZXcgQ2xhc3NMb2FkZXIoKTtcblxuXHRleHBvcnQgZnVuY3Rpb24gY29uZmlnKGM6IElMb2FkZXJDb25maWcpOiB2b2lkIHtcblx0XHRsb2FkZXIuY29uZmlnKGMpO1xuXHR9O1xuXG5cdGV4cG9ydCBmdW5jdGlvbiBsb2FkKGFyZzogSUxvYWRBcmd1bWVudHMpOiBQcm9taXNlT2ZDbGFzc2VzIHtcblx0XHRyZXR1cm4gbG9hZGVyLmxvYWQoYXJnKTtcblx0fTtcblxuXG59XG4iLCJpbnRlcmZhY2UgV2luZG93IHtcblx0d2Via2l0UmVxdWVzdEFuaW1hdGlvbkZyYW1lOiAoY2FsbGJhY2s6IEZyYW1lUmVxdWVzdENhbGxiYWNrKSA9PiBudW1iZXI7XG5cdG1velJlcXVlc3RBbmltYXRpb25GcmFtZTogKGNhbGxiYWNrOiBGcmFtZVJlcXVlc3RDYWxsYmFjaykgPT4gbnVtYmVyO1xuXHRvUmVxdWVzdEFuaW1hdGlvbkZyYW1lOiAoY2FsbGJhY2s6IEZyYW1lUmVxdWVzdENhbGxiYWNrKSA9PiBudW1iZXI7XG59XG5cbm1vZHVsZSBoby53YXRjaCB7XG5cblx0ZXhwb3J0IHR5cGUgSGFuZGxlciA9IChvYmo6YW55LCBuYW1lOnN0cmluZywgb2xkVjphbnksIG5ld1Y6YW55LCAgdGltZXN0YW1wPzogbnVtYmVyKT0+YW55O1xuXG5cdGV4cG9ydCBmdW5jdGlvbiB3YXRjaChvYmo6IGFueSwgbmFtZTogc3RyaW5nLCBoYW5kbGVyOiBIYW5kbGVyKTogdm9pZCB7XG5cdFx0bmV3IFdhdGNoZXIob2JqLCBuYW1lLCBoYW5kbGVyKTtcblx0fVxuXG5cdGNsYXNzIFdhdGNoZXIge1xuXG5cdFx0cHJpdmF0ZSBvbGRWYWw6YW55O1xuXG5cdFx0Y29uc3RydWN0b3IocHJpdmF0ZSBvYmo6IGFueSwgcHJpdmF0ZSBuYW1lOiBzdHJpbmcsIHByaXZhdGUgaGFuZGxlcjogSGFuZGxlcikge1xuXHRcdFx0dGhpcy5vbGRWYWwgPSB0aGlzLmNvcHkob2JqW25hbWVdKTtcblxuXHRcdFx0dGhpcy53YXRjaCh0aW1lc3RhbXAgPT4ge1xuXHRcdFx0XHRpZih0aGlzLm9sZFZhbCAhPT0gb2JqW25hbWVdKSB7XG5cdFx0XHRcdFx0dGhpcy5oYW5kbGVyLmNhbGwobnVsbCwgb2JqLCBuYW1lLCB0aGlzLm9sZFZhbCwgb2JqW25hbWVdLCB0aW1lc3RhbXApO1xuXHRcdFx0XHRcdHRoaXMub2xkVmFsID0gdGhpcy5jb3B5KG9ialtuYW1lXSk7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdH1cblxuXHRcdHByaXZhdGUgd2F0Y2goY2I6ICh0aW1lU3RhbXA6bnVtYmVyKT0+YW55KTogdm9pZCB7XG5cdFx0XHRsZXQgZm46IEZ1bmN0aW9uID1cblx0XHRcdHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUgICAgICAgfHxcblx0ICBcdFx0d2luZG93LndlYmtpdFJlcXVlc3RBbmltYXRpb25GcmFtZSB8fFxuXHQgIFx0XHR3aW5kb3cubW96UmVxdWVzdEFuaW1hdGlvbkZyYW1lICAgIHx8XG5cdCAgXHRcdHdpbmRvdy5vUmVxdWVzdEFuaW1hdGlvbkZyYW1lICAgICAgfHxcblx0ICBcdFx0d2luZG93Lm1zUmVxdWVzdEFuaW1hdGlvbkZyYW1lICAgICB8fFxuXHQgIFx0XHRmdW5jdGlvbihjYWxsYmFjazogRnVuY3Rpb24pe1xuXHRcdFx0XHR3aW5kb3cuc2V0VGltZW91dChjYWxsYmFjaywgMTAwMCAvIDYwKTtcblx0ICBcdFx0fTtcblxuXHRcdFx0bGV0IHdyYXAgPSAodHM6IG51bWJlcikgPT4ge1xuXHRcdFx0XHRjYih0cyk7XG5cdFx0XHRcdGZuKHdyYXApO1xuXHRcdFx0fVxuXG5cdFx0XHRmbih3cmFwKTtcblx0XHR9XG5cblx0XHRwcml2YXRlIGNvcHkodmFsOiBhbnkpOiBhbnkge1xuXHRcdFx0cmV0dXJuIEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkodmFsKSk7XG5cdFx0fVxuXHR9XG5cbn1cbiIsIm1vZHVsZSBoby5jb21wb25lbnRzLnRlbXAge1xuXHRcdHZhciBjOiBudW1iZXIgPSAtMTtcblx0XHR2YXIgZGF0YTogYW55W10gPSBbXTtcblxuXHRcdGV4cG9ydCBmdW5jdGlvbiBzZXQoZDogYW55KTogbnVtYmVyIHtcblx0XHRcdGMrKztcblx0XHRcdGRhdGFbY10gPSBkO1xuXHRcdFx0cmV0dXJuIGM7XG5cdFx0fVxuXG5cdFx0ZXhwb3J0IGZ1bmN0aW9uIGdldChpOiBudW1iZXIpOiBhbnkge1xuXHRcdFx0cmV0dXJuIGRhdGFbaV07XG5cdFx0fVxuXG5cdFx0ZXhwb3J0IGZ1bmN0aW9uIGNhbGwoaTogbnVtYmVyLCAuLi5hcmdzKTogdm9pZCB7XG5cdFx0XHRkYXRhW2ldKC4uLmFyZ3MpO1xuXHRcdH1cbn1cbiIsIm1vZHVsZSBoby5jb21wb25lbnRzLnN0eWxlciB7XHJcblxyXG5cdGV4cG9ydCBpbnRlcmZhY2UgSVN0eWxlciB7XHJcblx0XHRhcHBseVN0eWxlKGNvbXBvbmVudDogQ29tcG9uZW50LCBjc3M/OiBzdHJpbmcpOiB2b2lkXHJcblx0fVxyXG5cclxuXHRpbnRlcmZhY2UgU3R5bGVCbG9jayB7XHJcblx0XHRzZWxlY3Rvcjogc3RyaW5nO1xyXG5cdFx0cnVsZXM6IEFycmF5PFN0eWxlUnVsZT47XHJcblx0fVxyXG5cclxuXHRpbnRlcmZhY2UgU3R5bGVSdWxlIHtcclxuXHRcdHByb3BlcnR5OiBzdHJpbmc7XHJcblx0XHR2YWx1ZTogc3RyaW5nO1xyXG5cdH1cclxuXHJcblx0Y2xhc3MgU3R5bGVyIGltcGxlbWVudHMgSVN0eWxlciB7XHJcblx0XHRwdWJsaWMgYXBwbHlTdHlsZShjb21wb25lbnQ6IENvbXBvbmVudCwgY3NzID0gY29tcG9uZW50LnN0eWxlKTogdm9pZCB7XHJcblx0XHRcdGxldCBpZCA9ICdzdHlsZS0nK2NvbXBvbmVudC5uYW1lO1xyXG5cdFx0XHRpZighIWRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYHN0eWxlW2lkPVwiJHtpZH1cIl1gKSlcclxuXHRcdFx0XHRyZXR1cm47XHJcblxyXG5cdFx0XHRsZXQgc3R5bGUgPSBjb21wb25lbnQuc3R5bGUucmVwbGFjZSgndGhpcycsIGNvbXBvbmVudC5uYW1lKTtcclxuXHRcdFx0bGV0IHRhZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3N0eWxlJyk7XHJcblx0XHRcdHRhZy5pZCA9IGlkO1xyXG5cdFx0XHR0YWcuaW5uZXJIVE1MID0gJ1xcbicgKyBzdHlsZSArICdcXG4nO1xyXG5cdFx0XHRkb2N1bWVudC5oZWFkLmFwcGVuZENoaWxkKHRhZyk7XHJcblxyXG5cdFx0XHQvKlxyXG5cdFx0XHRsZXQgc3R5bGUgPSB0aGlzLnBhcnNlU3R5bGUoY29tcG9uZW50LnN0eWxlKTtcclxuXHRcdFx0c3R5bGUuZm9yRWFjaChzID0+IHtcclxuXHRcdFx0XHR0aGlzLmFwcGx5U3R5bGVCbG9jayhjb21wb25lbnQsIHMpO1xyXG5cdFx0XHR9KTtcclxuXHRcdFx0Ki9cclxuXHRcdH1cclxuXHJcblx0XHRwcm90ZWN0ZWQgYXBwbHlTdHlsZUJsb2NrKGNvbXBvbmVudDogQ29tcG9uZW50LCBzdHlsZTogU3R5bGVCbG9jayk6IHZvaWQge1xyXG5cdFx0XHRpZihzdHlsZS5zZWxlY3Rvci50cmltKCkudG9Mb3dlckNhc2UoKSA9PT0gJ3RoaXMnKSB7XHJcblx0XHRcdFx0c3R5bGUucnVsZXMuZm9yRWFjaChyID0+IHtcclxuXHRcdFx0XHRcdHRoaXMuYXBwbHlSdWxlKGNvbXBvbmVudC5lbGVtZW50LCByKTtcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0fVxyXG5cdFx0XHRlbHNlIHtcclxuXHRcdFx0XHRBcnJheS5wcm90b3R5cGUuZm9yRWFjaC5jYWxsKGNvbXBvbmVudC5lbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoc3R5bGUuc2VsZWN0b3IpLCBlbCA9PiB7XHJcblx0XHRcdFx0XHRzdHlsZS5ydWxlcy5mb3JFYWNoKHIgPT4ge1xyXG5cdFx0XHRcdFx0XHR0aGlzLmFwcGx5UnVsZShlbCwgcik7XHJcblx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdHByb3RlY3RlZCBhcHBseVJ1bGUoZWxlbWVudDogSFRNTEVsZW1lbnQsIHJ1bGU6IFN0eWxlUnVsZSk6IHZvaWQge1xyXG5cdFx0XHRsZXQgcHJvcCA9IHJ1bGUucHJvcGVydHkucmVwbGFjZSgvLShcXHcpL2csIChfLCBsZXR0ZXI6IHN0cmluZykgPT4ge1xyXG5cdFx0XHRcdHJldHVybiBsZXR0ZXIudG9VcHBlckNhc2UoKTtcclxuXHRcdFx0fSkudHJpbSgpO1xyXG5cdFx0XHRlbGVtZW50LnN0eWxlW3Byb3BdID0gcnVsZS52YWx1ZTtcclxuXHRcdH1cclxuXHJcblx0XHRwcm90ZWN0ZWQgcGFyc2VTdHlsZShjc3M6IHN0cmluZyk6IEFycmF5PFN0eWxlQmxvY2s+IHtcclxuXHRcdFx0bGV0IHIgPSAvKC4rPylcXHMqeyguKj8pfS9nbTtcclxuXHRcdFx0bGV0IHIyID0gLyguKz8pXFxzPzooLis/KTsvZ207XHJcblx0XHRcdGNzcyA9IGNzcy5yZXBsYWNlKC9cXG4vZywgJycpO1xyXG5cdFx0XHRsZXQgYmxvY2tzOiBTdHlsZUJsb2NrW10gPSAoPHN0cmluZ1tdPmNzcy5tYXRjaChyKSB8fCBbXSlcclxuXHRcdFx0XHQubWFwKGIgPT4ge1xyXG5cdFx0XHRcdFx0aWYoIWIubWF0Y2gocikpXHJcblx0XHRcdFx0XHRcdHJldHVybiBudWxsO1xyXG5cclxuXHRcdFx0XHRcdGxldCBbXywgc2VsZWN0b3IsIF9ydWxlc10gPSByLmV4ZWMoYik7XHJcblx0XHRcdFx0XHRsZXQgcnVsZXM6IFN0eWxlUnVsZVtdID0gKDxzdHJpbmdbXT5fcnVsZXMubWF0Y2gocjIpIHx8IFtdKVxyXG5cdFx0XHRcdFx0XHQubWFwKHIgPT4ge1xyXG5cdFx0XHRcdFx0XHRcdGlmKCFyLm1hdGNoKHIyKSlcclxuXHRcdFx0XHRcdFx0XHRcdHJldHVybiBudWxsO1xyXG5cclxuXHRcdFx0XHRcdFx0XHRsZXQgW18sIHByb3BlcnR5LCB2YWx1ZV0gPSByMi5leGVjKHIpO1xyXG5cdFx0XHRcdFx0XHRcdHJldHVybiB7cHJvcGVydHksIHZhbHVlfTtcclxuXHRcdFx0XHRcdFx0fSlcclxuXHRcdFx0XHRcdFx0LmZpbHRlcihyID0+IHtcclxuXHRcdFx0XHRcdFx0XHRyZXR1cm4gciAhPT0gbnVsbDtcclxuXHRcdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0XHRyZXR1cm4ge3NlbGVjdG9yLCBydWxlc307XHJcblx0XHRcdFx0fSlcclxuXHRcdFx0XHQuZmlsdGVyKGIgPT4ge1xyXG5cdFx0XHRcdFx0cmV0dXJuIGIgIT09IG51bGw7XHJcblx0XHRcdFx0fSk7XHJcblxyXG5cclxuXHRcdFx0cmV0dXJuIGJsb2NrcztcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdGV4cG9ydCBsZXQgaW5zdGFuY2U6IElTdHlsZXIgPSBuZXcgU3R5bGVyKCk7XHJcbn1cclxuIiwibW9kdWxlIGhvLmNvbXBvbmVudHMucmVuZGVyZXIge1xyXG5cclxuICAgIGludGVyZmFjZSBOb2RlSHRtbCB7XHJcbiAgICAgICAgcm9vdDogTm9kZTtcclxuICAgICAgICBodG1sOiBzdHJpbmc7XHJcbiAgICB9XHJcblxyXG4gICAgY2xhc3MgTm9kZSB7XHJcbiAgICAgICAgaHRtbDogc3RyaW5nO1xyXG4gICAgICAgIHBhcmVudDogTm9kZTtcclxuICAgICAgICBjaGlsZHJlbjogQXJyYXk8Tm9kZT4gPSBbXTtcclxuICAgICAgICB0eXBlOiBzdHJpbmc7XHJcbiAgICAgICAgc2VsZkNsb3Npbmc6IGJvb2xlYW47XHJcbiAgICAgICAgaXNWb2lkOiBib29sZWFuO1xyXG4gICAgICAgIHJlcGVhdDogYm9vbGVhbjtcclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgY2xhc3MgUmVuZGVyZXIge1xyXG5cclxuICAgICAgICBwcml2YXRlIHI6IGFueSA9IHtcclxuXHRcdFx0dGFnOiAvPChbXj5dKj8oPzooPzooJ3xcIilbXidcIl0qP1xcMilbXj5dKj8pKik+LyxcclxuXHRcdFx0cmVwZWF0OiAvcmVwZWF0PVtcInwnXS4rW1wifCddLyxcclxuXHRcdFx0dHlwZTogL1tcXHN8L10qKC4qPylbXFxzfFxcL3w+XS8sXHJcblx0XHRcdHRleHQ6IC8oPzoufFtcXHJcXG5dKSo/W15cIidcXFxcXTwvbSxcclxuXHRcdH07XHJcblxyXG4gICAgICAgIHByaXZhdGUgdm9pZHMgPSBbXCJhcmVhXCIsIFwiYmFzZVwiLCBcImJyXCIsIFwiY29sXCIsIFwiY29tbWFuZFwiLCBcImVtYmVkXCIsIFwiaHJcIiwgXCJpbWdcIiwgXCJpbnB1dFwiLCBcImtleWdlblwiLCBcImxpbmtcIiwgXCJtZXRhXCIsIFwicGFyYW1cIiwgXCJzb3VyY2VcIiwgXCJ0cmFja1wiLCBcIndiclwiXTtcclxuXHJcbiAgICAgICAgcHJpdmF0ZSBjYWNoZToge1trZXk6c3RyaW5nXTpOb2RlfSA9IHt9O1xyXG5cclxuICAgICAgICBwdWJsaWMgcmVuZGVyKGNvbXBvbmVudDogQ29tcG9uZW50KTogdm9pZCB7XHJcbiAgICAgICAgICAgIGlmKHR5cGVvZiBjb21wb25lbnQuaHRtbCA9PT0gJ2Jvb2xlYW4nICYmICFjb21wb25lbnQuaHRtbClcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgICAgICAgIGxldCBuYW1lID0gY29tcG9uZW50Lm5hbWU7XHJcbiAgICAgICAgICAgIGxldCByb290ID0gdGhpcy5jYWNoZVtuYW1lXSA9IHRoaXMuY2FjaGVbbmFtZV0gfHwgdGhpcy5wYXJzZShjb21wb25lbnQuaHRtbCkucm9vdDtcclxuICAgICAgICAgICAgcm9vdCA9IHRoaXMucmVuZGVyUmVwZWF0KHRoaXMuY29weU5vZGUocm9vdCksIGNvbXBvbmVudCk7XHJcblxyXG4gICAgICAgICAgICBsZXQgaHRtbCA9IHRoaXMuZG9tVG9TdHJpbmcocm9vdCwgLTEpO1xyXG5cclxuICAgICAgICAgICAgY29tcG9uZW50LmVsZW1lbnQuaW5uZXJIVE1MID0gaHRtbDtcclxuXHJcbiAgICAgICAgfVxyXG5cclxuXHJcblx0XHRwcml2YXRlIHBhcnNlKGh0bWw6IHN0cmluZywgcm9vdD0gbmV3IE5vZGUoKSk6IE5vZGVIdG1sIHtcclxuXHJcblx0XHRcdHZhciBtO1xyXG5cdFx0XHR3aGlsZSgobSA9IHRoaXMuci50YWcuZXhlYyhodG1sKSkgIT09IG51bGwpIHtcclxuXHRcdFx0XHR2YXIgdGFnLCB0eXBlLCBjbG9zaW5nLCBpc1ZvaWQsIHNlbGZDbG9zaW5nLCByZXBlYXQsIHVuQ2xvc2U7XHJcblx0XHRcdFx0Ly8tLS0tLS0tIGZvdW5kIHNvbWUgdGV4dCBiZWZvcmUgbmV4dCB0YWdcclxuXHRcdFx0XHRpZihtLmluZGV4ICE9PSAwKSB7XHJcblx0XHRcdFx0XHR0YWcgPSBodG1sLm1hdGNoKHRoaXMuci50ZXh0KVswXTtcclxuXHRcdFx0XHRcdHRhZyA9IHRhZy5zdWJzdHIoMCwgdGFnLmxlbmd0aC0xKTtcclxuXHRcdFx0XHRcdHR5cGUgPSAnVEVYVCc7XHJcbiAgICAgICAgICAgICAgICAgICAgaXNWb2lkID0gZmFsc2U7XHJcblx0XHRcdFx0XHRzZWxmQ2xvc2luZyA9IHRydWU7XHJcblx0XHRcdFx0XHRyZXBlYXQgPSBmYWxzZTtcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0dGFnID0gbVsxXS50cmltKCk7XHJcblx0XHRcdFx0XHR0eXBlID0gKHRhZysnPicpLm1hdGNoKHRoaXMuci50eXBlKVsxXTtcclxuXHRcdFx0XHRcdGNsb3NpbmcgPSB0YWdbMF0gPT09ICcvJztcclxuICAgICAgICAgICAgICAgICAgICBpc1ZvaWQgPSB0aGlzLmlzVm9pZCh0eXBlKTtcclxuXHRcdFx0XHRcdHNlbGZDbG9zaW5nID0gaXNWb2lkIHx8IHRhZ1t0YWcubGVuZ3RoLTFdID09PSAnLyc7XHJcblx0XHRcdFx0XHRyZXBlYXQgPSAhIXRhZy5tYXRjaCh0aGlzLnIucmVwZWF0KTtcclxuXHJcblx0XHRcdFx0XHRpZihzZWxmQ2xvc2luZyAmJiBoby5jb21wb25lbnRzLnJlZ2lzdHJ5Lmluc3RhbmNlLmhhc0NvbXBvbmVudCh0eXBlKSkge1xyXG5cdFx0XHRcdFx0XHRzZWxmQ2xvc2luZyA9IGZhbHNlO1xyXG5cdFx0XHRcdFx0XHR0YWcgPSB0YWcuc3Vic3RyKDAsIHRhZy5sZW5ndGgtMSkgKyBcIiBcIjtcclxuXHJcblx0XHRcdFx0XHRcdHVuQ2xvc2UgPSB0cnVlO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0aHRtbCA9IGh0bWwuc2xpY2UodGFnLmxlbmd0aCArICh0eXBlID09PSAnVEVYVCcgPyAwIDogMikgKTtcclxuXHJcblx0XHRcdFx0aWYoY2xvc2luZykge1xyXG5cdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdHJvb3QuY2hpbGRyZW4ucHVzaCh7cGFyZW50OiByb290LCBodG1sOiB0YWcsIHR5cGU6IHR5cGUsIGlzVm9pZDogaXNWb2lkLCBzZWxmQ2xvc2luZzogc2VsZkNsb3NpbmcsIHJlcGVhdDogcmVwZWF0LCBjaGlsZHJlbjogW119KTtcclxuXHJcblx0XHRcdFx0XHRpZighdW5DbG9zZSAmJiAhc2VsZkNsb3NpbmcpIHtcclxuXHRcdFx0XHRcdFx0dmFyIHJlc3VsdCA9IHRoaXMucGFyc2UoaHRtbCwgcm9vdC5jaGlsZHJlbltyb290LmNoaWxkcmVuLmxlbmd0aC0xXSk7XHJcblx0XHRcdFx0XHRcdGh0bWwgPSByZXN1bHQuaHRtbDtcclxuXHRcdFx0XHRcdFx0cm9vdC5jaGlsZHJlbi5wb3AoKTtcclxuXHRcdFx0XHRcdFx0cm9vdC5jaGlsZHJlbi5wdXNoKHJlc3VsdC5yb290KTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdG0gPSBodG1sLm1hdGNoKHRoaXMuci50YWcpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRyZXR1cm4ge3Jvb3Q6IHJvb3QsIGh0bWw6IGh0bWx9O1xyXG5cdFx0fVxyXG5cclxuXHRcdHByaXZhdGUgcmVuZGVyUmVwZWF0KHJvb3QsIG1vZGVscyk6IE5vZGUge1xyXG5cdFx0XHRtb2RlbHMgPSBbXS5jb25jYXQobW9kZWxzKTtcclxuXHJcblx0XHRcdGZvcih2YXIgYyA9IDA7IGMgPCByb290LmNoaWxkcmVuLmxlbmd0aDsgYysrKSB7XHJcblx0XHRcdFx0dmFyIGNoaWxkID0gcm9vdC5jaGlsZHJlbltjXTtcclxuXHRcdFx0XHRpZihjaGlsZC5yZXBlYXQpIHtcclxuXHRcdFx0XHRcdHZhciByZWdleCA9IC9yZXBlYXQ9W1wifCddXFxzKihcXFMrKVxccythc1xccysoXFxTKz8pW1wifCddLztcclxuXHRcdFx0XHRcdHZhciBtID0gY2hpbGQuaHRtbC5tYXRjaChyZWdleCkuc2xpY2UoMSk7XHJcblx0XHRcdFx0XHR2YXIgbmFtZSA9IG1bMV07XHJcblx0XHRcdFx0XHR2YXIgaW5kZXhOYW1lO1xyXG5cdFx0XHRcdFx0aWYobmFtZS5pbmRleE9mKCcsJykgPiAtMSkge1xyXG5cdFx0XHRcdFx0XHR2YXIgbmFtZXMgPSBuYW1lLnNwbGl0KCcsJyk7XHJcblx0XHRcdFx0XHRcdG5hbWUgPSBuYW1lc1swXS50cmltKCk7XHJcblx0XHRcdFx0XHRcdGluZGV4TmFtZSA9IG5hbWVzWzFdLnRyaW0oKTtcclxuXHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHR2YXIgbW9kZWwgPSB0aGlzLmV2YWx1YXRlKG1vZGVscywgbVswXSk7XHJcblxyXG5cdFx0XHRcdFx0dmFyIGhvbGRlciA9IFtdO1xyXG5cdFx0XHRcdFx0bW9kZWwuZm9yRWFjaChmdW5jdGlvbih2YWx1ZSwgaW5kZXgpIHtcclxuXHRcdFx0XHRcdFx0dmFyIG1vZGVsMiA9IHt9O1xyXG5cdFx0XHRcdFx0XHRtb2RlbDJbbmFtZV0gPSB2YWx1ZTtcclxuXHRcdFx0XHRcdFx0bW9kZWwyW2luZGV4TmFtZV0gPSBpbmRleDtcclxuXHJcblx0XHRcdFx0XHRcdHZhciBtb2RlbHMyID0gW10uY29uY2F0KG1vZGVscyk7XHJcblx0XHRcdFx0XHRcdG1vZGVsczIudW5zaGlmdChtb2RlbDIpO1xyXG5cclxuXHRcdFx0XHRcdFx0dmFyIG5vZGUgPSB0aGlzLmNvcHlOb2RlKGNoaWxkKTtcclxuXHRcdFx0XHRcdFx0bm9kZS5yZXBlYXQgPSBmYWxzZTtcclxuXHRcdFx0XHRcdFx0bm9kZS5odG1sID0gbm9kZS5odG1sLnJlcGxhY2UodGhpcy5yLnJlcGVhdCwgJycpO1xyXG5cdFx0XHRcdFx0XHRub2RlLmh0bWwgPSB0aGlzLnJlcGwobm9kZS5odG1sLCBtb2RlbHMyKTtcclxuXHJcblx0XHRcdFx0XHRcdG5vZGUgPSB0aGlzLnJlbmRlclJlcGVhdChub2RlLCBtb2RlbHMyKTtcclxuXHJcblx0XHRcdFx0XHRcdC8vcm9vdC5jaGlsZHJlbi5zcGxpY2Uocm9vdC5jaGlsZHJlbi5pbmRleE9mKGNoaWxkKSwgMCwgbm9kZSk7XHJcblx0XHRcdFx0XHRcdGhvbGRlci5wdXNoKG5vZGUpO1xyXG5cdFx0XHRcdFx0fS5iaW5kKHRoaXMpKTtcclxuXHJcblx0XHRcdFx0XHRob2xkZXIuZm9yRWFjaChmdW5jdGlvbihuKSB7XHJcblx0XHRcdFx0XHRcdHJvb3QuY2hpbGRyZW4uc3BsaWNlKHJvb3QuY2hpbGRyZW4uaW5kZXhPZihjaGlsZCksIDAsIG4pO1xyXG5cdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0XHRyb290LmNoaWxkcmVuLnNwbGljZShyb290LmNoaWxkcmVuLmluZGV4T2YoY2hpbGQpLCAxKTtcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0Y2hpbGQuaHRtbCA9IHRoaXMucmVwbChjaGlsZC5odG1sLCBtb2RlbHMpO1xyXG5cdFx0XHRcdFx0Y2hpbGQgPSB0aGlzLnJlbmRlclJlcGVhdChjaGlsZCwgbW9kZWxzKTtcclxuXHRcdFx0XHRcdHJvb3QuY2hpbGRyZW5bY10gPSBjaGlsZDtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHJldHVybiByb290O1xyXG5cdFx0fVxyXG5cclxuXHRcdHByaXZhdGUgZG9tVG9TdHJpbmcocm9vdDogTm9kZSwgaW5kZW50OiBudW1iZXIpOiBzdHJpbmcge1xyXG5cdFx0XHRpbmRlbnQgPSBpbmRlbnQgfHwgMDtcclxuXHRcdFx0dmFyIGh0bWwgPSAnJztcclxuICAgICAgICAgICAgY29uc3QgdGFiOiBhbnkgPSAnXFx0JztcclxuXHJcblx0XHRcdGlmKHJvb3QuaHRtbCkge1xyXG5cdFx0XHRcdGh0bWwgKz0gbmV3IEFycmF5KGluZGVudCkuam9pbih0YWIpOyAvL3RhYi5yZXBlYXQoaW5kZW50KTs7XHJcblx0XHRcdFx0aWYocm9vdC50eXBlICE9PSAnVEVYVCcpIHtcclxuXHRcdFx0XHRcdGlmKHJvb3Quc2VsZkNsb3NpbmcgJiYgIXJvb3QuaXNWb2lkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGh0bWwgKz0gJzwnICsgcm9vdC5odG1sLnN1YnN0cigwLCAtLXJvb3QuaHRtbC5sZW5ndGgpICsgJz4nO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBodG1sICs9ICc8Lycrcm9vdC50eXBlKyc+XFxuJztcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBodG1sICs9ICc8JyArIHJvb3QuaHRtbCArICc+JztcclxuICAgICAgICAgICAgICAgIH1cclxuXHRcdFx0XHRlbHNlIGh0bWwgKz0gcm9vdC5odG1sO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRpZihodG1sKVxyXG5cdFx0XHRcdGh0bWwgKz0gJ1xcbic7XHJcblxyXG5cdFx0XHRpZihyb290LmNoaWxkcmVuLmxlbmd0aCkge1xyXG5cdFx0XHRcdGh0bWwgKz0gcm9vdC5jaGlsZHJlbi5tYXAoZnVuY3Rpb24oYykge1xyXG5cdFx0XHRcdFx0cmV0dXJuIHRoaXMuZG9tVG9TdHJpbmcoYywgaW5kZW50Kyhyb290LnR5cGUgPyAxIDogMikpO1xyXG5cdFx0XHRcdH0uYmluZCh0aGlzKSkuam9pbignXFxuJyk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGlmKHJvb3QudHlwZSAmJiByb290LnR5cGUgIT09ICdURVhUJyAmJiAhcm9vdC5zZWxmQ2xvc2luZykge1xyXG5cdFx0XHRcdGh0bWwgKz0gbmV3IEFycmF5KGluZGVudCkuam9pbih0YWIpOyAvL3RhYi5yZXBlYXQoaW5kZW50KTtcclxuXHRcdFx0XHRodG1sICs9ICc8Lycrcm9vdC50eXBlKyc+XFxuJztcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0cmV0dXJuIGh0bWw7XHJcblx0XHR9XHJcblxyXG4gICAgICAgIHByaXZhdGUgcmVwbChzdHI6IHN0cmluZywgbW9kZWxzOiBhbnlbXSk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIHZhciByZWdleEcgPSAveyguKz8pfX0/L2c7XHJcblxyXG4gICAgICAgICAgICB2YXIgbSA9IHN0ci5tYXRjaChyZWdleEcpO1xyXG4gICAgICAgICAgICBpZighbSlcclxuICAgICAgICAgICAgICAgIHJldHVybiBzdHI7XHJcblxyXG4gICAgICAgICAgICB3aGlsZShtLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIHBhdGggPSBtWzBdO1xyXG4gICAgICAgICAgICAgICAgcGF0aCA9IHBhdGguc3Vic3RyKDEsIHBhdGgubGVuZ3RoLTIpO1xyXG5cclxuICAgICAgICAgICAgICAgIHZhciB2YWx1ZSA9IHRoaXMuZXZhbHVhdGUobW9kZWxzLCBwYXRoKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZih2YWx1ZSAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYodHlwZW9mIHZhbHVlID09PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlID0gXCJoby5jb21wb25lbnRzLkNvbXBvbmVudC5nZXRDb21wb25lbnQodGhpcykuXCIrcGF0aDtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgc3RyID0gc3RyLnJlcGxhY2UobVswXSwgdmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIG0gPSBtLnNsaWNlKDEpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gc3RyO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSBldmFsdWF0ZShtb2RlbHM6IGFueVtdLCBwYXRoOiBzdHJpbmcpOiBhbnkge1xyXG4gICAgICAgICAgICBpZihwYXRoWzBdID09PSAneycgJiYgcGF0aFstLXBhdGgubGVuZ3RoXSA9PT0gJ30nKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuZXZhbHVhdGVFeHByZXNzaW9uKG1vZGVscywgcGF0aC5zdWJzdHIoMSwgcGF0aC5sZW5ndGgtMikpXHJcbiAgICAgICAgICAgIGVsc2UgaWYocGF0aFswXSA9PT0gJyMnKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuZXZhbHVhdGVGdW5jdGlvbihtb2RlbHMsIHBhdGguc3Vic3RyKDEpKTtcclxuICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuZXZhbHVhdGVWYWx1ZShtb2RlbHMsIHBhdGgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSBldmFsdWF0ZVZhbHVlKG1vZGVsczogYW55W10sIHBhdGg6IHN0cmluZyk6IGFueSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmV2YWx1YXRlVmFsdWVBbmRNb2RlbChtb2RlbHMsIHBhdGgpLnZhbHVlO1xyXG4gICAgICAgIH1cclxuXHJcblx0XHRwcml2YXRlIGV2YWx1YXRlVmFsdWVBbmRNb2RlbChtb2RlbHM6IGFueVtdLCBwYXRoOiBzdHJpbmcpOiB7dmFsdWU6IGFueSwgbW9kZWw6IGFueX0ge1xyXG5cdFx0XHRpZihtb2RlbHMuaW5kZXhPZih3aW5kb3cpID09IC0xKVxyXG4gICAgICAgICAgICAgICAgbW9kZWxzLnB1c2god2luZG93KTtcclxuXHJcbiAgICAgICAgICAgIHZhciBtaSA9IDA7XHJcblx0XHRcdHZhciBtb2RlbCA9IHZvaWQgMDtcclxuXHRcdFx0d2hpbGUobWkgPCBtb2RlbHMubGVuZ3RoICYmIG1vZGVsID09PSB1bmRlZmluZWQpIHtcclxuXHRcdFx0XHRtb2RlbCA9IG1vZGVsc1ttaV07XHJcblx0XHRcdFx0dHJ5IHtcclxuXHRcdFx0XHRcdG1vZGVsID0gbmV3IEZ1bmN0aW9uKFwibW9kZWxcIiwgXCJyZXR1cm4gbW9kZWxbJ1wiICsgcGF0aC5zcGxpdChcIi5cIikuam9pbihcIiddWydcIikgKyBcIiddXCIpKG1vZGVsKTtcclxuXHRcdFx0XHR9IGNhdGNoKGUpIHtcclxuXHRcdFx0XHRcdG1vZGVsID0gdm9pZCAwO1xyXG5cdFx0XHRcdH0gZmluYWxseSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbWkrKztcclxuICAgICAgICAgICAgICAgIH1cclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0cmV0dXJuIHtcInZhbHVlXCI6IG1vZGVsLCBcIm1vZGVsXCI6IG1vZGVsc1stLW1pXX07XHJcblx0XHR9XHJcblxyXG4gICAgICAgIHByaXZhdGUgZXZhbHVhdGVFeHByZXNzaW9uKG1vZGVsczogYW55W10sIHBhdGg6IHN0cmluZyk6IGFueSB7XHJcblx0XHRcdGlmKG1vZGVscy5pbmRleE9mKHdpbmRvdykgPT0gLTEpXHJcbiAgICAgICAgICAgICAgICBtb2RlbHMucHVzaCh3aW5kb3cpO1xyXG5cclxuICAgICAgICAgICAgdmFyIG1pID0gMDtcclxuXHRcdFx0dmFyIG1vZGVsID0gdm9pZCAwO1xyXG5cdFx0XHR3aGlsZShtaSA8IG1vZGVscy5sZW5ndGggJiYgbW9kZWwgPT09IHVuZGVmaW5lZCkge1xyXG5cdFx0XHRcdG1vZGVsID0gbW9kZWxzW21pXTtcclxuXHRcdFx0XHR0cnkge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vd2l0aChtb2RlbCkgbW9kZWwgPSBldmFsKHBhdGgpO1xyXG4gICAgICAgICAgICAgICAgICAgIG1vZGVsID0gbmV3IEZ1bmN0aW9uKE9iamVjdC5rZXlzKG1vZGVsKS50b1N0cmluZygpLCBcInJldHVybiBcIiArIHBhdGgpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5hcHBseShudWxsLCBPYmplY3Qua2V5cyhtb2RlbCkubWFwKChrKSA9PiB7cmV0dXJuIG1vZGVsW2tdfSkgKTtcclxuXHRcdFx0XHR9IGNhdGNoKGUpIHtcclxuXHRcdFx0XHRcdG1vZGVsID0gdm9pZCAwO1xyXG5cdFx0XHRcdH0gZmluYWxseSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbWkrKztcclxuICAgICAgICAgICAgICAgIH1cclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0cmV0dXJuIG1vZGVsO1xyXG5cdFx0fVxyXG5cclxuICAgICAgICBwcml2YXRlIGV2YWx1YXRlRnVuY3Rpb24obW9kZWxzOiBhbnlbXSwgcGF0aDogc3RyaW5nKTogYW55IHtcclxuICAgICAgICAgICAgbGV0IGV4cCA9IHRoaXMuZXZhbHVhdGVFeHByZXNzaW9uLmJpbmQodGhpcywgbW9kZWxzKTtcclxuXHRcdFx0dmFyIFtuYW1lLCBhcmdzXSA9IHBhdGguc3BsaXQoJygnKTtcclxuICAgICAgICAgICAgYXJncyA9IGFyZ3Muc3Vic3RyKDAsIC0tYXJncy5sZW5ndGgpO1xyXG5cclxuICAgICAgICAgICAgbGV0IHt2YWx1ZSwgbW9kZWx9ID0gdGhpcy5ldmFsdWF0ZVZhbHVlQW5kTW9kZWwobW9kZWxzLCBuYW1lKTtcclxuICAgICAgICAgICAgbGV0IGZ1bmM6IEZ1bmN0aW9uID0gdmFsdWU7XHJcbiAgICAgICAgICAgIGxldCBhcmdBcnI6IHN0cmluZ1tdID0gYXJncy5zcGxpdCgnLicpLm1hcCgoYXJnKSA9PiB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gYXJnLmluZGV4T2YoJyMnKSA9PT0gMCA/XHJcbiAgICAgICAgICAgICAgICAgICAgYXJnLnN1YnN0cigxKSA6XHJcbiAgICAgICAgICAgICAgICAgICAgZXhwKGFyZyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgZnVuYyA9IGZ1bmMuYmluZChtb2RlbCwgLi4uYXJnQXJyKTtcclxuXHJcbiAgICAgICAgICAgIGxldCBpbmRleCA9IGhvLmNvbXBvbmVudHMudGVtcC5zZXQoZnVuYyk7XHJcblxyXG4gICAgICAgICAgICB2YXIgc3RyID0gYGhvLmNvbXBvbmVudHMudGVtcC5jYWxsKCR7aW5kZXh9KWA7XHJcbiAgICAgICAgICAgIHJldHVybiBzdHI7XHJcblx0XHR9XHJcblxyXG5cdFx0cHJpdmF0ZSBjb3B5Tm9kZShub2RlOiBOb2RlKTogTm9kZSB7XHJcblx0XHRcdHZhciBjb3B5Tm9kZSA9IHRoaXMuY29weU5vZGUuYmluZCh0aGlzKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBuID0gPE5vZGU+e1xyXG5cdFx0XHRcdHBhcmVudDogbm9kZS5wYXJlbnQsXHJcblx0XHRcdFx0aHRtbDogbm9kZS5odG1sLFxyXG5cdFx0XHRcdHR5cGU6IG5vZGUudHlwZSxcclxuXHRcdFx0XHRzZWxmQ2xvc2luZzogbm9kZS5zZWxmQ2xvc2luZyxcclxuXHRcdFx0XHRyZXBlYXQ6IG5vZGUucmVwZWF0LFxyXG5cdFx0XHRcdGNoaWxkcmVuOiBub2RlLmNoaWxkcmVuLm1hcChjb3B5Tm9kZSlcclxuXHRcdFx0fTtcclxuXHJcblx0XHRcdHJldHVybiBuO1xyXG5cdFx0fVxyXG5cclxuICAgICAgICBwcml2YXRlIGlzVm9pZChuYW1lOiBzdHJpbmcpOiBib29sZWFuIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMudm9pZHMuaW5kZXhPZihuYW1lLnRvTG93ZXJDYXNlKCkpICE9PSAtMTtcclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBsZXQgaW5zdGFuY2UgPSBuZXcgUmVuZGVyZXIoKTtcclxuXHJcbn1cclxuIiwibW9kdWxlIGhvLmNvbXBvbmVudHMuaHRtbHByb3ZpZGVyIHtcclxuICAgIGltcG9ydCBQcm9taXNlID0gaG8ucHJvbWlzZS5Qcm9taXNlO1xyXG5cclxuICAgIGV4cG9ydCBjbGFzcyBIdG1sUHJvdmlkZXIge1xyXG5cclxuICAgICAgICBwcml2YXRlIGNhY2hlOiB7W2theTpzdHJpbmddOnN0cmluZ30gPSB7fTtcclxuXHJcbiAgICAgICAgcmVzb2x2ZShuYW1lOiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICBpZihoby5jb21wb25lbnRzLnJlZ2lzdHJ5LnVzZURpcikge1xyXG4gICAgICAgICAgICAgICAgbmFtZSArPSAnLicgKyBuYW1lLnNwbGl0KCcuJykucG9wKCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIG5hbWUgPSBuYW1lLnNwbGl0KCcuJykuam9pbignLycpO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGBjb21wb25lbnRzLyR7bmFtZX0uaHRtbGA7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBnZXRIVE1MKG5hbWU6IHN0cmluZyk6IFByb21pc2U8c3RyaW5nLCBzdHJpbmc+IHtcclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuXHJcbiAgICAgICAgICAgICAgICBpZih0eXBlb2YgdGhpcy5jYWNoZVtuYW1lXSA9PT0gJ3N0cmluZycpXHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlc29sdmUodGhpcy5jYWNoZVtuYW1lXSk7XHJcblxyXG4gICAgICAgICAgICAgICAgbGV0IHVybCA9IHRoaXMucmVzb2x2ZShuYW1lKTtcclxuXHJcbiAgICAgICAgICAgICAgICBsZXQgeG1saHR0cCA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xyXG4gICAgXHRcdFx0eG1saHR0cC5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbigpIHtcclxuICAgIFx0XHRcdFx0aWYoeG1saHR0cC5yZWFkeVN0YXRlID09IDQpIHtcclxuICAgIFx0XHRcdFx0XHRsZXQgcmVzcCA9IHhtbGh0dHAucmVzcG9uc2VUZXh0O1xyXG4gICAgXHRcdFx0XHRcdGlmKHhtbGh0dHAuc3RhdHVzID09IDIwMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShyZXNwKTtcclxuICAgIFx0XHRcdFx0XHR9IGVsc2Uge1xyXG4gICAgXHRcdFx0XHRcdFx0cmVqZWN0KGBFcnJvciB3aGlsZSBsb2FkaW5nIGh0bWwgZm9yIENvbXBvbmVudCAke25hbWV9YCk7XHJcbiAgICBcdFx0XHRcdFx0fVxyXG4gICAgXHRcdFx0XHR9XHJcbiAgICBcdFx0XHR9O1xyXG5cclxuICAgIFx0XHRcdHhtbGh0dHAub3BlbignR0VUJywgdXJsLCB0cnVlKTtcclxuICAgIFx0XHRcdHhtbGh0dHAuc2VuZCgpO1xyXG5cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBsZXQgaW5zdGFuY2UgPSBuZXcgSHRtbFByb3ZpZGVyKCk7XHJcblxyXG59XHJcbiIsIm1vZHVsZSBoby5jb21wb25lbnRzIHtcblxuXHRpbXBvcnQgUHJvbWlzZSA9IGhvLnByb21pc2UuUHJvbWlzZTtcblxuXHQvKipcblx0XHRCYXNlY2xhc3MgZm9yIEF0dHJpYnV0ZXMuXG5cdFx0VXNlZCBBdHRyaWJ1dGVzIG5lZWRzIHRvIGJlIHNwZWNpZmllZCBieSBDb21wb25lbnQjYXR0cmlidXRlcyBwcm9wZXJ0eSB0byBnZXQgbG9hZGVkIHByb3Blcmx5LlxuXHQqL1xuXHRleHBvcnQgY2xhc3MgQXR0cmlidXRlIHtcblxuXHRcdHByb3RlY3RlZCBlbGVtZW50OiBIVE1MRWxlbWVudDtcblx0XHRwcm90ZWN0ZWQgY29tcG9uZW50OiBDb21wb25lbnQ7XG5cdFx0cHJvdGVjdGVkIHZhbHVlOiBzdHJpbmc7XG5cblx0XHRjb25zdHJ1Y3RvcihlbGVtZW50OiBIVE1MRWxlbWVudCwgdmFsdWU/OiBzdHJpbmcpIHtcblx0XHRcdHRoaXMuZWxlbWVudCA9IGVsZW1lbnQ7XG5cdFx0XHR0aGlzLmNvbXBvbmVudCA9IENvbXBvbmVudC5nZXRDb21wb25lbnQoZWxlbWVudCk7XG5cdFx0XHR0aGlzLnZhbHVlID0gdmFsdWU7XG5cblx0XHRcdHRoaXMuaW5pdCgpO1xuXHRcdH1cblxuXHRcdHByb3RlY3RlZCBpbml0KCk6IHZvaWQge31cblxuXHRcdGdldCBuYW1lKCkge1xuXHRcdFx0cmV0dXJuIEF0dHJpYnV0ZS5nZXROYW1lKHRoaXMpO1xuXHRcdH1cblxuXG5cdFx0cHVibGljIHVwZGF0ZSgpOiB2b2lkIHtcblxuXHRcdH1cblxuXG5cdFx0c3RhdGljIGdldE5hbWUoY2xheno6IHR5cGVvZiBBdHRyaWJ1dGUgfCBBdHRyaWJ1dGUpOiBzdHJpbmcge1xuICAgICAgICAgICAgaWYoY2xhenogaW5zdGFuY2VvZiBBdHRyaWJ1dGUpXG4gICAgICAgICAgICAgICAgcmV0dXJuIGNsYXp6LmNvbnN0cnVjdG9yLnRvU3RyaW5nKCkubWF0Y2goL1xcdysvZylbMV07XG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgcmV0dXJuIGNsYXp6LnRvU3RyaW5nKCkubWF0Y2goL1xcdysvZylbMV07XG4gICAgICAgIH1cblx0fVxuXG5cdGV4cG9ydCBjbGFzcyBXYXRjaEF0dHJpYnV0ZSBleHRlbmRzIEF0dHJpYnV0ZSB7XG5cblx0XHRwcm90ZWN0ZWQgcjogUmVnRXhwID0gLyMoLis/KSMvZztcblxuXHRcdGNvbnN0cnVjdG9yKGVsZW1lbnQ6IEhUTUxFbGVtZW50LCB2YWx1ZT86IHN0cmluZykge1xuXHRcdFx0c3VwZXIoZWxlbWVudCwgdmFsdWUpO1xuXG5cdFx0XHRsZXQgbTogYW55W10gPSB0aGlzLnZhbHVlLm1hdGNoKHRoaXMucikgfHwgW107XG5cdFx0XHRtLm1hcChmdW5jdGlvbih3KSB7XG5cdFx0XHRcdHcgPSB3LnN1YnN0cigxLCB3Lmxlbmd0aC0yKTtcblx0XHRcdFx0dGhpcy53YXRjaCh3KTtcblx0XHRcdH0uYmluZCh0aGlzKSk7XG5cdFx0XHR0aGlzLnZhbHVlID0gdGhpcy52YWx1ZS5yZXBsYWNlKC8jL2csICcnKTtcblx0XHR9XG5cblxuXHRcdHByb3RlY3RlZCB3YXRjaChwYXRoOiBzdHJpbmcpOiB2b2lkIHtcblx0XHRcdGxldCBwYXRoQXJyID0gcGF0aC5zcGxpdCgnLicpO1xuXHRcdFx0bGV0IHByb3AgPSBwYXRoQXJyLnBvcCgpO1xuXHRcdFx0bGV0IG9iaiA9IHRoaXMuY29tcG9uZW50O1xuXG5cdFx0XHRwYXRoQXJyLm1hcCgocGFydCkgPT4ge1xuXHRcdFx0XHRvYmogPSBvYmpbcGFydF07XG5cdFx0XHR9KTtcblxuXHRcdFx0aG8ud2F0Y2gud2F0Y2gob2JqLCBwcm9wLCB0aGlzLnVwZGF0ZS5iaW5kKHRoaXMpKTtcblx0XHR9XG5cblx0XHRwcm90ZWN0ZWQgZXZhbChwYXRoOiBzdHJpbmcpOiBhbnkge1xuXHRcdFx0bGV0IG1vZGVsID0gdGhpcy5jb21wb25lbnQ7XG5cdFx0XHRtb2RlbCA9IG5ldyBGdW5jdGlvbihPYmplY3Qua2V5cyhtb2RlbCkudG9TdHJpbmcoKSwgXCJyZXR1cm4gXCIgKyBwYXRoKVxuXHRcdFx0XHQuYXBwbHkobnVsbCwgT2JqZWN0LmtleXMobW9kZWwpLm1hcCgoaykgPT4ge3JldHVybiBtb2RlbFtrXX0pICk7XG5cdFx0XHRyZXR1cm4gbW9kZWw7XG5cdFx0fVxuXG5cdH1cbn1cbiIsIm1vZHVsZSBoby5jb21wb25lbnRzIHtcclxuXHJcbiAgICBpbXBvcnQgUHJvbWlzZSA9IGhvLnByb21pc2UuUHJvbWlzZTtcclxuICAgIGltcG9ydCBIdG1sUHJvdmlkZXIgPSBoby5jb21wb25lbnRzLmh0bWxwcm92aWRlci5pbnN0YW5jZTtcclxuICAgIGltcG9ydCBSZW5kZXJlciA9IGhvLmNvbXBvbmVudHMucmVuZGVyZXIuaW5zdGFuY2U7XHJcblxyXG4gICAgZXhwb3J0IGludGVyZmFjZSBDb21wb25lbnRFbGVtZW50IGV4dGVuZHMgSFRNTEVsZW1lbnQge1xyXG4gICAgICAgIGNvbXBvbmVudD86IENvbXBvbmVudDtcclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgaW50ZXJmYWNlIElQcm9wcmV0eSB7XHJcbiAgICAgICAgbmFtZTogc3RyaW5nO1xyXG4gICAgICAgIHJlcXVpcmVkPzogYm9vbGVhbjtcclxuICAgICAgICBkZWZhdWx0PzogYW55O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICAgIEJhc2VjbGFzcyBmb3IgQ29tcG9uZW50c1xyXG4gICAgICAgIGltcG9ydGFudDogZG8gaW5pdGlhbGl6YXRpb24gd29yayBpbiBDb21wb25lbnQjaW5pdFxyXG4gICAgKi9cclxuICAgIGV4cG9ydCBjbGFzcyBDb21wb25lbnQge1xyXG4gICAgICAgIHB1YmxpYyBlbGVtZW50OiBDb21wb25lbnRFbGVtZW50O1xyXG4gICAgICAgIHB1YmxpYyBvcmlnaW5hbF9pbm5lckhUTUw6IHN0cmluZztcclxuICAgICAgICBwdWJsaWMgaHRtbDogc3RyaW5nID0gJyc7XHJcbiAgICAgICAgcHVibGljIHN0eWxlOiBzdHJpbmcgPSAnJztcclxuICAgICAgICBwdWJsaWMgcHJvcGVydGllczogQXJyYXk8c3RyaW5nfElQcm9wcmV0eT4gPSBbXTtcclxuICAgICAgICBwdWJsaWMgYXR0cmlidXRlczogQXJyYXk8c3RyaW5nPiA9IFtdO1xyXG4gICAgICAgIHB1YmxpYyByZXF1aXJlczogQXJyYXk8c3RyaW5nPiA9IFtdO1xyXG4gICAgICAgIHB1YmxpYyBjaGlsZHJlbjoge1trZXk6IHN0cmluZ106IGFueX0gPSB7fTtcclxuXHJcbiAgICAgICAgY29uc3RydWN0b3IoZWxlbWVudDogSFRNTEVsZW1lbnQpIHtcclxuICAgICAgICAgICAgLy8tLS0tLS0tIGluaXQgRWxlbWVuZXQgYW5kIEVsZW1lbnRzJyBvcmlnaW5hbCBpbm5lckhUTUxcclxuICAgICAgICAgICAgdGhpcy5lbGVtZW50ID0gZWxlbWVudDtcclxuICAgICAgICAgICAgdGhpcy5lbGVtZW50LmNvbXBvbmVudCA9IHRoaXM7XHJcbiAgICAgICAgICAgIHRoaXMub3JpZ2luYWxfaW5uZXJIVE1MID0gZWxlbWVudC5pbm5lckhUTUw7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgZ2V0IG5hbWUoKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgcmV0dXJuIENvbXBvbmVudC5nZXROYW1lKHRoaXMpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIGdldE5hbWUoKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMubmFtZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBnZXRQYXJlbnQoKTogQ29tcG9uZW50IHtcclxuICAgICAgICAgICAgcmV0dXJuIENvbXBvbmVudC5nZXRDb21wb25lbnQoPENvbXBvbmVudEVsZW1lbnQ+dGhpcy5lbGVtZW50LnBhcmVudE5vZGUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIF9pbml0KCk6IFByb21pc2U8YW55LCBhbnk+IHtcclxuICAgICAgICAgICAgbGV0IHJlbmRlciA9IHRoaXMucmVuZGVyLmJpbmQodGhpcyk7XHJcbiAgICAgICAgICAgIC8vLS0tLS0tLS0gaW5pdCBQcm9wZXJ0aWVzXHJcbiAgICAgICAgICAgIHRoaXMuaW5pdFByb3BlcnRpZXMoKTtcclxuXHJcbiAgICAgICAgICAgIC8vLS0tLS0tLSBjYWxsIGluaXQoKSAmIGxvYWRSZXF1aXJlbWVudHMoKSAtPiB0aGVuIHJlbmRlclxyXG4gICAgICAgICAgICBsZXQgcmVhZHkgPSBbdGhpcy5pbml0SFRNTCgpLCBQcm9taXNlLmNyZWF0ZSh0aGlzLmluaXQoKSksIHRoaXMubG9hZFJlcXVpcmVtZW50cygpXTtcclxuXHJcbiAgICAgICAgICAgIGxldCBwID0gbmV3IFByb21pc2U8YW55LCBhbnk+KCk7XHJcblxyXG4gICAgICAgICAgICBQcm9taXNlLmFsbChyZWFkeSlcclxuICAgICAgICAgICAgLnRoZW4oKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgcC5yZXNvbHZlKCk7XHJcbiAgICAgICAgICAgICAgICByZW5kZXIoKTtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLmNhdGNoKChlcnIpID0+IHtcclxuICAgICAgICAgICAgICAgIHAucmVqZWN0KGVycik7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBlcnI7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHA7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgICAgTWV0aG9kIHRoYXQgZ2V0IGNhbGxlZCBhZnRlciBpbml0aWFsaXphdGlvbiBvZiBhIG5ldyBpbnN0YW5jZS5cclxuICAgICAgICAgICAgRG8gaW5pdC13b3JrIGhlcmUuXHJcbiAgICAgICAgICAgIE1heSByZXR1cm4gYSBQcm9taXNlLlxyXG4gICAgICAgICovXHJcbiAgICAgICAgcHVibGljIGluaXQoKTogYW55IHt9XHJcblxyXG4gICAgICAgIHB1YmxpYyB1cGRhdGUoKTogdm9pZCB7cmV0dXJuIHZvaWQgMDt9XHJcblxyXG4gICAgICAgIHB1YmxpYyByZW5kZXIoKTogdm9pZCB7XHJcbiAgICBcdFx0UmVuZGVyZXIucmVuZGVyKHRoaXMpO1xyXG5cclxuICAgIFx0XHRoby5jb21wb25lbnRzLnJlZ2lzdHJ5Lmluc3RhbmNlLmluaXRFbGVtZW50KHRoaXMuZWxlbWVudClcclxuICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy5pbml0Q2hpbGRyZW4oKTtcclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLmluaXRTdHlsZSgpO1xyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMuaW5pdEF0dHJpYnV0ZXMoKTtcclxuXHJcbiAgICBcdFx0XHR0aGlzLnVwZGF0ZSgpO1xyXG5cclxuICAgICAgICAgICAgfS5iaW5kKHRoaXMpKTtcclxuICAgIFx0fTtcclxuXHJcbiAgICAgICAgcHJpdmF0ZSBpbml0U3R5bGUoKTogdm9pZCB7XHJcbiAgICAgICAgICAgIGlmKHR5cGVvZiB0aGlzLnN0eWxlID09PSAndW5kZWZpbmVkJylcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgaWYodGhpcy5zdHlsZSA9PT0gbnVsbClcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgaWYodHlwZW9mIHRoaXMuc3R5bGUgPT09ICdzdHJpbmcnICYmIHRoaXMuc3R5bGUubGVuZ3RoID09PSAwKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgICAgICAgc3R5bGVyLmluc3RhbmNlLmFwcGx5U3R5bGUodGhpcyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAqICBBc3N1cmUgdGhhdCB0aGlzIGluc3RhbmNlIGhhcyBhbiB2YWxpZCBodG1sIGF0dHJpYnV0ZSBhbmQgaWYgbm90IGxvYWQgYW5kIHNldCBpdC5cclxuICAgICAgICAqL1xyXG4gICAgICAgIHByaXZhdGUgaW5pdEhUTUwoKTogUHJvbWlzZTxhbnksYW55PiB7XHJcbiAgICAgICAgICAgIGxldCBwID0gbmV3IFByb21pc2UoKTtcclxuICAgICAgICAgICAgbGV0IHNlbGYgPSB0aGlzO1xyXG5cclxuICAgICAgICAgICAgaWYodHlwZW9mIHRoaXMuaHRtbCA9PT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuaHRtbCA9ICcnO1xyXG4gICAgICAgICAgICAgICAgcC5yZXNvbHZlKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBpZih0aGlzLmh0bWwuaW5kZXhPZihcIi5odG1sXCIsIHRoaXMuaHRtbC5sZW5ndGggLSBcIi5odG1sXCIubGVuZ3RoKSAhPT0gLTEpIHtcclxuICAgICAgICAgICAgICAgICAgICBIdG1sUHJvdmlkZXIuZ2V0SFRNTCh0aGlzLm5hbWUpXHJcbiAgICAgICAgICAgICAgICAgICAgLnRoZW4oKGh0bWwpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5odG1sID0gaHRtbDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcC5yZXNvbHZlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICAuY2F0Y2gocC5yZWplY3QpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBwLnJlc29sdmUoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHA7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIGluaXRQcm9wZXJ0aWVzKCk6IHZvaWQge1xyXG4gICAgICAgICAgICB0aGlzLnByb3BlcnRpZXMuZm9yRWFjaChmdW5jdGlvbihwcm9wKSB7XHJcbiAgICAgICAgICAgICAgICBpZih0eXBlb2YgcHJvcCA9PT0gJ29iamVjdCcpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnByb3BlcnRpZXNbcHJvcC5uYW1lXSA9IHRoaXMuZWxlbWVudFtwcm9wLm5hbWVdIHx8IHRoaXMuZWxlbWVudC5nZXRBdHRyaWJ1dGUocHJvcC5uYW1lKSB8fCBwcm9wLmRlZmF1bHQ7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYodGhpcy5wcm9wZXJ0aWVzW3Byb3AubmFtZV0gPT09IHVuZGVmaW5lZCAmJiBwcm9wLnJlcXVpcmVkID09PSB0cnVlKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBgUHJvcGVydHkgJHtwcm9wLm5hbWV9IGlzIHJlcXVpcmVkIGJ1dCBub3QgcHJvdmlkZWRgO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSBpZih0eXBlb2YgcHJvcCA9PT0gJ3N0cmluZycpXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wcm9wZXJ0aWVzW3Byb3BdID0gdGhpcy5lbGVtZW50W3Byb3BdIHx8IHRoaXMuZWxlbWVudC5nZXRBdHRyaWJ1dGUocHJvcCk7XHJcbiAgICAgICAgICAgIH0uYmluZCh0aGlzKSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIGluaXRDaGlsZHJlbigpOiB2b2lkIHtcclxuICAgICAgICAgICAgbGV0IGNoaWxkcyA9IHRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKCcqJyk7XHJcbiAgICBcdFx0Zm9yKGxldCBjID0gMDsgYyA8IGNoaWxkcy5sZW5ndGg7IGMrKykge1xyXG4gICAgXHRcdFx0bGV0IGNoaWxkOiBFbGVtZW50ID0gPEVsZW1lbnQ+Y2hpbGRzW2NdO1xyXG4gICAgXHRcdFx0aWYoY2hpbGQuaWQpIHtcclxuICAgIFx0XHRcdFx0dGhpcy5jaGlsZHJlbltjaGlsZC5pZF0gPSBjaGlsZDtcclxuICAgIFx0XHRcdH1cclxuICAgIFx0XHRcdGlmKGNoaWxkLnRhZ05hbWUpXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jaGlsZHJlbltjaGlsZC50YWdOYW1lXSA9IHRoaXMuY2hpbGRyZW5bY2hpbGQudGFnTmFtZV0gfHwgW107XHJcbiAgICAgICAgICAgICAgICAoPEVsZW1lbnRbXT50aGlzLmNoaWxkcmVuW2NoaWxkLnRhZ05hbWVdKS5wdXNoKGNoaWxkKTtcclxuICAgIFx0XHR9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIGluaXRBdHRyaWJ1dGVzKCk6IHZvaWQge1xyXG4gICAgICAgICAgICB0aGlzLmF0dHJpYnV0ZXNcclxuICAgICAgICAgICAgLmZvckVhY2goKGEpID0+IHtcclxuICAgICAgICAgICAgICAgIGxldCBhdHRyID0gaG8uY29tcG9uZW50cy5yZWdpc3RyeS5pbnN0YW5jZS5nZXRBdHRyaWJ1dGUoYSk7XHJcbiAgICAgICAgICAgICAgICBBcnJheS5wcm90b3R5cGUuZm9yRWFjaC5jYWxsKHRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKGAqWyR7YX1dYCksIChlOiBIVE1MRWxlbWVudCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCB2YWwgPSBlLmhhc093blByb3BlcnR5KGEpID8gZVthXSA6IGUuZ2V0QXR0cmlidXRlKGEpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKHR5cGVvZiB2YWwgPT09ICdzdHJpbmcnICYmIHZhbCA9PT0gJycpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbCA9IHZvaWQgMDtcclxuICAgICAgICAgICAgICAgICAgICBuZXcgYXR0cihlLCB2YWwpLnVwZGF0ZSgpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSBsb2FkUmVxdWlyZW1lbnRzKCkge1xyXG4gICAgXHRcdGxldCBjb21wb25lbnRzOiBhbnlbXSA9IHRoaXMucmVxdWlyZXNcclxuICAgICAgICAgICAgLmZpbHRlcigocmVxKSA9PiB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gIWhvLmNvbXBvbmVudHMucmVnaXN0cnkuaW5zdGFuY2UuaGFzQ29tcG9uZW50KHJlcSk7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5tYXAoKHJlcSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGhvLmNvbXBvbmVudHMucmVnaXN0cnkuaW5zdGFuY2UubG9hZENvbXBvbmVudChyZXEpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcblxyXG4gICAgICAgICAgICBsZXQgYXR0cmlidXRlczogYW55W10gPSB0aGlzLmF0dHJpYnV0ZXNcclxuICAgICAgICAgICAgLmZpbHRlcigocmVxKSA9PiB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gIWhvLmNvbXBvbmVudHMucmVnaXN0cnkuaW5zdGFuY2UuaGFzQXR0cmlidXRlKHJlcSk7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5tYXAoKHJlcSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGhvLmNvbXBvbmVudHMucmVnaXN0cnkuaW5zdGFuY2UubG9hZEF0dHJpYnV0ZShyZXEpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcblxyXG4gICAgICAgICAgICBsZXQgcHJvbWlzZXMgPSBjb21wb25lbnRzLmNvbmNhdChhdHRyaWJ1dGVzKTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBQcm9taXNlLmFsbChwcm9taXNlcyk7XHJcbiAgICBcdH07XHJcblxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgc3RhdGljIHJlZ2lzdGVyKGM6IHR5cGVvZiBDb21wb25lbnQpOiB2b2lkIHtcclxuICAgICAgICAgICAgaG8uY29tcG9uZW50cy5yZWdpc3RyeS5pbnN0YW5jZS5yZWdpc3RlcihjKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgKi9cclxuXHJcbiAgICAgICAgLypcclxuICAgICAgICBzdGF0aWMgcnVuKG9wdD86IGFueSkge1xyXG4gICAgICAgICAgICBoby5jb21wb25lbnRzLnJlZ2lzdHJ5Lmluc3RhbmNlLnNldE9wdGlvbnMob3B0KTtcclxuICAgICAgICAgICAgaG8uY29tcG9uZW50cy5yZWdpc3RyeS5pbnN0YW5jZS5ydW4oKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgKi9cclxuXHJcbiAgICAgICAgc3RhdGljIGdldENvbXBvbmVudChlbGVtZW50OiBDb21wb25lbnRFbGVtZW50KTogQ29tcG9uZW50IHtcclxuICAgICAgICAgICAgd2hpbGUoIWVsZW1lbnQuY29tcG9uZW50KVxyXG4gICAgXHRcdFx0ZWxlbWVudCA9IDxDb21wb25lbnRFbGVtZW50PmVsZW1lbnQucGFyZW50Tm9kZTtcclxuICAgIFx0XHRyZXR1cm4gZWxlbWVudC5jb21wb25lbnQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzdGF0aWMgZ2V0TmFtZShjbGF6ejogdHlwZW9mIENvbXBvbmVudCk6IHN0cmluZztcclxuICAgICAgICBzdGF0aWMgZ2V0TmFtZShjbGF6ejogQ29tcG9uZW50KTogc3RyaW5nO1xyXG4gICAgICAgIHN0YXRpYyBnZXROYW1lKGNsYXp6OiAodHlwZW9mIENvbXBvbmVudCkgfCAoQ29tcG9uZW50KSk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIGlmKGNsYXp6IGluc3RhbmNlb2YgQ29tcG9uZW50KVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGNsYXp6LmNvbnN0cnVjdG9yLnRvU3RyaW5nKCkubWF0Y2goL1xcdysvZylbMV07XHJcbiAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgIHJldHVybiBjbGF6ei50b1N0cmluZygpLm1hdGNoKC9cXHcrL2cpWzFdO1xyXG4gICAgICAgIH1cclxuXHJcblxyXG4gICAgfVxyXG59XHJcbiIsIm1vZHVsZSBoby5jb21wb25lbnRzLnJlZ2lzdHJ5IHtcclxuICAgIGltcG9ydCBQcm9taXNlID0gaG8ucHJvbWlzZS5Qcm9taXNlO1xyXG5cclxuICAgIGV4cG9ydCBsZXQgbWFwcGluZzoge1trZXk6c3RyaW5nXTpzdHJpbmd9ID0ge307XHJcbiAgICBleHBvcnQgbGV0IHVzZURpciA9IHRydWU7XHJcblxyXG4gICAgZXhwb3J0IGNsYXNzIFJlZ2lzdHJ5IHtcclxuXHJcbiAgICAgICAgcHJpdmF0ZSBjb21wb25lbnRzOiBBcnJheTx0eXBlb2YgQ29tcG9uZW50PiA9IFtdO1xyXG4gICAgICAgIHByaXZhdGUgYXR0cmlidXRlczogQXJyYXk8dHlwZW9mIEF0dHJpYnV0ZT4gPSBbXTtcclxuXHJcbiAgICAgICAgcHJpdmF0ZSBjb21wb25lbnRMb2FkZXIgPSBuZXcgaG8uY2xhc3Nsb2FkZXIuQ2xhc3NMb2FkZXIoe1xyXG4gICAgICAgICAgICB1cmxUZW1wbGF0ZTogJ2NvbXBvbmVudHMvJHtuYW1lfS5qcycsXHJcbiAgICAgICAgICAgIHVzZURpclxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBwcml2YXRlIGF0dHJpYnV0ZUxvYWRlciA9IG5ldyBoby5jbGFzc2xvYWRlci5DbGFzc0xvYWRlcih7XHJcbiAgICAgICAgICAgIHVybFRlbXBsYXRlOiAnYXR0cmlidXRlcy8ke25hbWV9LmpzJyxcclxuICAgICAgICAgICAgdXNlRGlyXHJcbiAgICAgICAgfSk7XHJcblxyXG5cclxuXHJcbiAgICAgICAgcHVibGljIHJlZ2lzdGVyKGNhOiB0eXBlb2YgQ29tcG9uZW50IHwgdHlwZW9mIEF0dHJpYnV0ZSk6IHZvaWQge1xyXG4gICAgICAgICAgICBpZihjYS5wcm90b3R5cGUgaW5zdGFuY2VvZiBDb21wb25lbnQpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuY29tcG9uZW50cy5wdXNoKDx0eXBlb2YgQ29tcG9uZW50PmNhKTtcclxuICAgICAgICAgICAgICAgIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoQ29tcG9uZW50LmdldE5hbWUoPHR5cGVvZiBDb21wb25lbnQ+Y2EpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmKGNhLnByb3RvdHlwZSBpbnN0YW5jZW9mIEF0dHJpYnV0ZSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5hdHRyaWJ1dGVzLnB1c2goPHR5cGVvZiBBdHRyaWJ1dGU+Y2EpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgcnVuKCk6IFByb21pc2U8YW55LCBhbnk+IHtcclxuICAgICAgICAgICAgbGV0IGluaXRDb21wb25lbnQ6IChjOiB0eXBlb2YgQ29tcG9uZW50KT0+UHJvbWlzZTxhbnksIGFueT4gPSB0aGlzLmluaXRDb21wb25lbnQuYmluZCh0aGlzKTtcclxuICAgICAgICAgICAgbGV0IHByb21pc2VzOiBBcnJheTxQcm9taXNlPGFueSwgYW55Pj4gPSB0aGlzLmNvbXBvbmVudHMubWFwKChjKT0+e1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGluaXRDb21wb25lbnQoPGFueT5jKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5hbGwocHJvbWlzZXMpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIGluaXRDb21wb25lbnQoY29tcG9uZW50OiB0eXBlb2YgQ29tcG9uZW50LCBlbGVtZW50OkhUTUxFbGVtZW50fERvY3VtZW50PWRvY3VtZW50KTogUHJvbWlzZTxhbnksIGFueT4ge1xyXG4gICAgICAgICAgICBsZXQgcHJvbWlzZXM6IEFycmF5PFByb21pc2U8YW55LCBhbnk+PiA9IEFycmF5LnByb3RvdHlwZS5tYXAuY2FsbChcclxuICAgICAgICAgICAgICAgIGVsZW1lbnQucXVlcnlTZWxlY3RvckFsbChDb21wb25lbnQuZ2V0TmFtZShjb21wb25lbnQpKSxcclxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uKGUpOiBQcm9taXNlPGFueSwgYW55PiB7XHJcblx0ICAgICAgICAgICAgICAgIHJldHVybiBuZXcgY29tcG9uZW50KGUpLl9pbml0KCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblx0XHRcdCk7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5hbGwocHJvbWlzZXMpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIGluaXRFbGVtZW50KGVsZW1lbnQ6IEhUTUxFbGVtZW50KTogUHJvbWlzZTxhbnksIGFueT4ge1xyXG4gICAgICAgICAgICBsZXQgaW5pdENvbXBvbmVudDogKGM6IHR5cGVvZiBDb21wb25lbnQsIGVsZW1lbnQ6IEhUTUxFbGVtZW50KT0+UHJvbWlzZTxhbnksIGFueT4gPSB0aGlzLmluaXRDb21wb25lbnQuYmluZCh0aGlzKTtcclxuICAgICAgICAgICAgbGV0IHByb21pc2VzOiBBcnJheTxQcm9taXNlPGFueSwgYW55Pj4gPSBBcnJheS5wcm90b3R5cGUubWFwLmNhbGwoXHJcbiAgICAgICAgICAgICAgICB0aGlzLmNvbXBvbmVudHMsXHJcbiAgICAgICAgICAgICAgICBjb21wb25lbnQgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBpbml0Q29tcG9uZW50KGNvbXBvbmVudCwgZWxlbWVudCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICk7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5hbGwocHJvbWlzZXMpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIGhhc0NvbXBvbmVudChuYW1lOiBzdHJpbmcpOiBib29sZWFuIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY29tcG9uZW50c1xyXG4gICAgICAgICAgICAgICAgLmZpbHRlcigoY29tcG9uZW50KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIENvbXBvbmVudC5nZXROYW1lKGNvbXBvbmVudCkgPT09IG5hbWU7XHJcbiAgICAgICAgICAgICAgICB9KS5sZW5ndGggPiAwO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIGhhc0F0dHJpYnV0ZShuYW1lOiBzdHJpbmcpOiBib29sZWFuIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuYXR0cmlidXRlc1xyXG4gICAgICAgICAgICAgICAgLmZpbHRlcigoYXR0cmlidXRlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIEF0dHJpYnV0ZS5nZXROYW1lKGF0dHJpYnV0ZSkgPT09IG5hbWU7XHJcbiAgICAgICAgICAgICAgICB9KS5sZW5ndGggPiAwO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIGdldEF0dHJpYnV0ZShuYW1lOiBzdHJpbmcpOiB0eXBlb2YgQXR0cmlidXRlIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuYXR0cmlidXRlc1xyXG4gICAgICAgICAgICAuZmlsdGVyKChhdHRyaWJ1dGUpID0+IHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBBdHRyaWJ1dGUuZ2V0TmFtZShhdHRyaWJ1dGUpID09PSBuYW1lO1xyXG4gICAgICAgICAgICB9KVswXTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBsb2FkQ29tcG9uZW50KG5hbWU6IHN0cmluZyk6IFByb21pc2U8dHlwZW9mIENvbXBvbmVudCwgc3RyaW5nPiB7XHJcbiAgICAgICAgICAgIGxldCBzZWxmID0gdGhpcztcclxuICAgICAgICAgICAgbGV0IHN1cCA9IHRoaXMuY29tcG9uZW50cy5tYXAoYyA9PiB7cmV0dXJuIENvbXBvbmVudC5nZXROYW1lKGMpfSkuY29uY2F0KFtcImhvLmNvbXBvbmVudHMuQ29tcG9uZW50XCJdKVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY29tcG9uZW50TG9hZGVyLmxvYWQoe1xyXG4gICAgICAgICAgICAgICAgbmFtZSxcclxuICAgICAgICAgICAgICAgIHVybDogbWFwcGluZ1tuYW1lXSxcclxuICAgICAgICAgICAgICAgIHN1cGVyOiBzdXBcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLnRoZW4oY2xhc3NlcyA9PiB7XHJcbiAgICAgICAgICAgICAgICBjbGFzc2VzLm1hcChjID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBzZWxmLnJlZ2lzdGVyKDx0eXBlb2YgQ29tcG9uZW50PmMpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gY2xhc3Nlcy5wb3AoKTtcclxuICAgICAgICAgICAgfSlcclxuXHJcblxyXG4gICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICBsZXQgc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5nZXRQYXJlbnRPZkNvbXBvbmVudChuYW1lKVxyXG4gICAgICAgICAgICAudGhlbigocGFyZW50KSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZihzZWxmLmhhc0NvbXBvbmVudChwYXJlbnQpIHx8IHBhcmVudCA9PT0gJ2hvLmNvbXBvbmVudHMuQ29tcG9uZW50JylcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIGVsc2UgcmV0dXJuIHNlbGYubG9hZENvbXBvbmVudChwYXJlbnQpO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAudGhlbigocGFyZW50VHlwZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGhvLmNvbXBvbmVudHMuY29tcG9uZW50cHJvdmlkZXIuaW5zdGFuY2UuZ2V0Q29tcG9uZW50KG5hbWUpXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC50aGVuKChjb21wb25lbnQpID0+IHtcclxuICAgICAgICAgICAgICAgIHNlbGYucmVnaXN0ZXIoY29tcG9uZW50KTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBjb21wb25lbnQ7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAvL3JldHVybiB0aGlzLm9wdGlvbnMuY29tcG9uZW50UHJvdmlkZXIuZ2V0Q29tcG9uZW50KG5hbWUpXHJcbiAgICAgICAgICAgICovXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgbG9hZEF0dHJpYnV0ZShuYW1lOiBzdHJpbmcpOiBQcm9taXNlPHR5cGVvZiBBdHRyaWJ1dGUsIHN0cmluZz4ge1xyXG5cclxuICAgICAgICAgICAgbGV0IHNlbGYgPSB0aGlzO1xyXG4gICAgICAgICAgICBsZXQgYmFzZSA9IFtcImhvLmNvbXBvbmVudHMuQXR0cmlidXRlXCIsIFwiaG8uY29tcG9uZW50cy5XYXRjaEF0dHJpYnV0ZVwiXTtcclxuICAgICAgICAgICAgbGV0IHN1cCA9IHRoaXMuYXR0cmlidXRlcy5tYXAoYSA9PiB7cmV0dXJuIEF0dHJpYnV0ZS5nZXROYW1lKGEpfSkuY29uY2F0KGJhc2UpXHJcblxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5hdHRyaWJ1dGVMb2FkZXIubG9hZCh7XHJcbiAgICAgICAgICAgICAgICBuYW1lLFxyXG4gICAgICAgICAgICAgICAgdXJsOiBtYXBwaW5nW25hbWVdLFxyXG4gICAgICAgICAgICAgICAgc3VwZXI6IHN1cFxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAudGhlbihjbGFzc2VzID0+IHtcclxuICAgICAgICAgICAgICAgIGNsYXNzZXMubWFwKGMgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHNlbGYucmVnaXN0ZXIoPHR5cGVvZiBBdHRyaWJ1dGU+Yyk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBjbGFzc2VzLnBvcCgpO1xyXG4gICAgICAgICAgICB9KVxyXG5cclxuXHJcbiAgICAgICAgICAgIC8qXHJcbiAgICAgICAgICAgIGxldCBzZWxmID0gdGhpcztcclxuXHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmdldFBhcmVudE9mQXR0cmlidXRlKG5hbWUpXHJcbiAgICAgICAgICAgIC50aGVuKChwYXJlbnQpID0+IHtcclxuICAgICAgICAgICAgICAgIGlmKHNlbGYuaGFzQXR0cmlidXRlKHBhcmVudCkgfHwgcGFyZW50ID09PSAnaG8uY29tcG9uZW50cy5BdHRyaWJ1dGUnIHx8IHBhcmVudCA9PT0gJ2hvLmNvbXBvbmVudHMuV2F0Y2hBdHRyaWJ1dGUnKVxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICAgICAgZWxzZSByZXR1cm4gc2VsZi5sb2FkQXR0cmlidXRlKHBhcmVudCk7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC50aGVuKChwYXJlbnRUeXBlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gaG8uY29tcG9uZW50cy5hdHRyaWJ1dGVwcm92aWRlci5pbnN0YW5jZS5nZXRBdHRyaWJ1dGUobmFtZSlcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLnRoZW4oKGF0dHJpYnV0ZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgc2VsZi5yZWdpc3RlcihhdHRyaWJ1dGUpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGF0dHJpYnV0ZTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICovXHJcblxyXG4gICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICBsZXQgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgUHJvbWlzZTx0eXBlb2YgQXR0cmlidXRlLCBzdHJpbmc+KChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICAgICAgICAgIGhvLmNvbXBvbmVudHMuYXR0cmlidXRlcHJvdmlkZXIuaW5zdGFuY2UuZ2V0QXR0cmlidXRlKG5hbWUpXHJcbiAgICAgICAgICAgICAgICAudGhlbigoYXR0cmlidXRlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5yZWdpc3RlcihhdHRyaWJ1dGUpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoYXR0cmlidXRlKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgKi9cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qXHJcblxyXG4gICAgICAgIHByb3RlY3RlZCBnZXRQYXJlbnRPZkNvbXBvbmVudChuYW1lOiBzdHJpbmcpOiBQcm9taXNlPHN0cmluZywgYW55PiB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmdldFBhcmVudE9mQ2xhc3MoaG8uY29tcG9uZW50cy5jb21wb25lbnRwcm92aWRlci5pbnN0YW5jZS5yZXNvbHZlKG5hbWUpKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByb3RlY3RlZCBnZXRQYXJlbnRPZkF0dHJpYnV0ZShuYW1lOiBzdHJpbmcpOiBQcm9taXNlPHN0cmluZywgYW55PiB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmdldFBhcmVudE9mQ2xhc3MoaG8uY29tcG9uZW50cy5hdHRyaWJ1dGVwcm92aWRlci5pbnN0YW5jZS5yZXNvbHZlKG5hbWUpKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByb3RlY3RlZCBnZXRQYXJlbnRPZkNsYXNzKHBhdGg6IHN0cmluZyk6IFByb21pc2U8c3RyaW5nLCBhbnk+IHtcclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuXHJcbiAgICAgICAgICAgICAgICBsZXQgeG1saHR0cCA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xyXG4gICAgICAgICAgICAgICAgeG1saHR0cC5vbnJlYWR5c3RhdGVjaGFuZ2UgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYoeG1saHR0cC5yZWFkeVN0YXRlID09IDQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHJlc3AgPSB4bWxodHRwLnJlc3BvbnNlVGV4dDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYoeG1saHR0cC5zdGF0dXMgPT0gMjAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgbSA9IHJlc3AubWF0Y2goL31cXClcXCgoLiopXFwpOy8pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYobSAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUobVsxXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKG51bGwpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVqZWN0KHJlc3ApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAgICAgeG1saHR0cC5vcGVuKCdHRVQnLCBwYXRoKTtcclxuICAgICAgICAgICAgICAgIHhtbGh0dHAuc2VuZCgpO1xyXG5cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAqL1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgbGV0IGluc3RhbmNlID0gbmV3IFJlZ2lzdHJ5KCk7XHJcbn1cclxuIiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uLy4uLy4uL2Jvd2VyX2NvbXBvbmVudHMvaG8tcHJvbWlzZS9kaXN0L3Byb21pc2UuZC50c1wiLz5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi8uLi8uLi9ib3dlcl9jb21wb25lbnRzL2hvLWNsYXNzbG9hZGVyL2Rpc3QvY2xhc3Nsb2FkZXIuZC50c1wiLz5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi8uLi8uLi9ib3dlcl9jb21wb25lbnRzL2hvLXdhdGNoL2Rpc3Qvd2F0Y2guZC50c1wiLz5cblxubW9kdWxlIGhvLmNvbXBvbmVudHMge1xuXHRleHBvcnQgZnVuY3Rpb24gcnVuKCk6IGhvLnByb21pc2UuUHJvbWlzZTxhbnksIGFueT4ge1xuXHRcdHJldHVybiBoby5jb21wb25lbnRzLnJlZ2lzdHJ5Lmluc3RhbmNlLnJ1bigpO1xuXHR9XG5cblx0ZXhwb3J0IGZ1bmN0aW9uIHJlZ2lzdGVyKGM6IHR5cGVvZiBDb21wb25lbnQgfCB0eXBlb2YgQXR0cmlidXRlKTogdm9pZCB7XG5cdFx0aG8uY29tcG9uZW50cy5yZWdpc3RyeS5pbnN0YW5jZS5yZWdpc3RlcihjKTtcblx0fVxuXG59XG4iLCJtb2R1bGUgaG8uZmx1eCB7XHJcblxyXG5cdGV4cG9ydCBjbGFzcyBDYWxsYmFja0hvbGRlciB7XHJcblxyXG5cdFx0cHJvdGVjdGVkIHByZWZpeDogc3RyaW5nID0gJ0lEXyc7XHJcbiAgICBcdHByb3RlY3RlZCBsYXN0SUQ6IG51bWJlciA9IDE7XHJcblx0XHRwcm90ZWN0ZWQgY2FsbGJhY2tzOiB7W2tleTpzdHJpbmddOkZ1bmN0aW9ufSA9IHt9O1xyXG5cclxuXHRcdHB1YmxpYyByZWdpc3RlcihjYWxsYmFjazogRnVuY3Rpb24sIHNlbGY/OiBhbnkpOiBzdHJpbmcge1xyXG4gICAgXHRcdGxldCBpZCA9IHRoaXMucHJlZml4ICsgdGhpcy5sYXN0SUQrKztcclxuICAgIFx0XHR0aGlzLmNhbGxiYWNrc1tpZF0gPSBzZWxmID8gY2FsbGJhY2suYmluZChzZWxmKSA6IGNhbGxiYWNrO1xyXG4gICAgXHRcdHJldHVybiBpZDtcclxuICBcdFx0fVxyXG5cclxuICBcdFx0cHVibGljIHVucmVnaXN0ZXIoaWQpIHtcclxuICAgICAgXHRcdGlmKCF0aGlzLmNhbGxiYWNrc1tpZF0pXHJcblx0XHRcdFx0dGhyb3cgJ0NvdWxkIG5vdCB1bnJlZ2lzdGVyIGNhbGxiYWNrIGZvciBpZCAnICsgaWQ7XHJcbiAgICBcdFx0ZGVsZXRlIHRoaXMuY2FsbGJhY2tzW2lkXTtcclxuICBcdFx0fTtcclxuXHR9XHJcbn1cclxuIiwiXHJcbm1vZHVsZSBoby5mbHV4IHtcclxuXHRpbXBvcnQgUHJvbWlzZSA9IGhvLnByb21pc2UuUHJvbWlzZTtcclxuXHJcblxyXG5cdGV4cG9ydCBpbnRlcmZhY2UgSVN0YXRlIHtcclxuXHRcdG5hbWU6IHN0cmluZztcclxuXHRcdHVybDogc3RyaW5nO1xyXG5cdFx0cmVkaXJlY3Q/OiBzdHJpbmc7XHJcblx0XHRiZWZvcmU/OiAoZGF0YTogSVJvdXRlRGF0YSk9PlByb21pc2U8YW55LCBhbnk+O1xyXG5cdFx0dmlldz86IEFycmF5PElWaWV3U3RhdGU+O1xyXG5cdH1cclxuXHJcblx0ZXhwb3J0IGludGVyZmFjZSBJVmlld1N0YXRlIHtcclxuXHQgICAgbmFtZTogc3RyaW5nO1xyXG5cdFx0aHRtbDogc3RyaW5nO1xyXG5cdH1cclxuXHJcblx0ZXhwb3J0IGludGVyZmFjZSBJU3RhdGVzIHtcclxuXHQgICAgc3RhdGVzOiBBcnJheTxJU3RhdGU+O1xyXG5cdH1cclxuXHJcbn1cclxuIiwibW9kdWxlIGhvLmZsdXguYWN0aW9ucyB7XG5cdGV4cG9ydCBjbGFzcyBBY3Rpb24ge1xuXG5cdFx0Z2V0IG5hbWUoKTogc3RyaW5nIHtcblx0XHQgICByZXR1cm4gdGhpcy5jb25zdHJ1Y3Rvci50b1N0cmluZygpLm1hdGNoKC9cXHcrL2cpWzFdO1xuXHQgICB9XG5cdCAgIFxuXHR9XG59XG4iLCJcclxubW9kdWxlIGhvLmZsdXguYWN0aW9ucyB7XHJcblx0aW1wb3J0IFByb21pc2UgPSBoby5wcm9taXNlLlByb21pc2U7XHJcblxyXG5cdGV4cG9ydCBsZXQgbWFwcGluZzoge1trZXk6c3RyaW5nXTpzdHJpbmd9ID0ge307XHJcblx0ZXhwb3J0IGxldCB1c2VEaXIgPSB0cnVlO1xyXG5cclxuXHRleHBvcnQgY2xhc3MgUmVnaXN0cnkge1xyXG5cclxuXHRcdHByaXZhdGUgYWN0aW9uczoge1trZXk6IHN0cmluZ106IEFjdGlvbn0gPSB7fTtcclxuXHJcblx0XHRwcml2YXRlIGFjdGlvbkxvYWRlciA9IG5ldyBoby5jbGFzc2xvYWRlci5DbGFzc0xvYWRlcih7XHJcbiAgICAgICAgICAgdXJsVGVtcGxhdGU6ICdhY3Rpb25zLyR7bmFtZX0uanMnLFxyXG4gICAgICAgICAgIHVzZURpclxyXG4gICAgICAgfSk7XHJcblxyXG5cdFx0cHVibGljIHJlZ2lzdGVyKGFjdGlvbjogQWN0aW9uKTogQWN0aW9uIHtcclxuXHRcdFx0dGhpcy5hY3Rpb25zW2FjdGlvbi5uYW1lXSA9IGFjdGlvbjtcclxuXHRcdFx0cmV0dXJuIGFjdGlvbjtcclxuXHRcdH1cclxuXHJcblx0XHRwdWJsaWMgZ2V0KGFjdGlvbkNsYXNzOiBzdHJpbmcpOiBTdG9yZTxhbnk+XHJcblx0XHRwdWJsaWMgZ2V0PFQgZXh0ZW5kcyBBY3Rpb24+KGFjdGlvbkNsYXNzOiB7bmV3KCk6VH0pOiBUXHJcblx0XHRwdWJsaWMgZ2V0PFQgZXh0ZW5kcyBBY3Rpb24+KGFjdGlvbkNsYXNzOiBhbnkpOiBUIHtcclxuXHRcdFx0bGV0IG5hbWUgPSB2b2lkIDA7XHJcblx0XHRcdGlmKHR5cGVvZiBhY3Rpb25DbGFzcyA9PT0gJ3N0cmluZycpXHJcblx0XHRcdFx0bmFtZSA9IGFjdGlvbkNsYXNzO1xyXG5cdFx0XHRlbHNlXHJcblx0XHRcdFx0bmFtZSA9IGFjdGlvbkNsYXNzLnRvU3RyaW5nKCkubWF0Y2goL1xcdysvZylbMV07XHJcblx0XHRcdHJldHVybiA8VD50aGlzLmFjdGlvbnNbbmFtZV07XHJcblx0XHR9XHJcblxyXG5cdFx0cHVibGljIGxvYWRBY3Rpb24obmFtZTogc3RyaW5nKTogUHJvbWlzZTxBY3Rpb24sIHN0cmluZz4ge1xyXG5cclxuXHRcdFx0bGV0IHNlbGYgPSB0aGlzO1xyXG5cclxuXHRcdFx0aWYoISF0aGlzLmFjdGlvbnNbbmFtZV0pXHJcblx0XHRcdFx0cmV0dXJuIFByb21pc2UuY3JlYXRlKHRoaXMuYWN0aW9uc1tuYW1lXSk7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5hY3Rpb25Mb2FkZXIubG9hZCh7XHJcbiAgICAgICAgICAgICAgICBuYW1lLFxyXG5cdFx0XHRcdHVybDogbWFwcGluZ1tuYW1lXSxcclxuICAgICAgICAgICAgICAgIHN1cGVyOiBbXCJoby5mbHV4LmFjdGlvbi5BY3Rpb25cIl1cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLnRoZW4oKGNsYXNzZXM6IEFycmF5PHR5cGVvZiBBY3Rpb24+KSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjbGFzc2VzLm1hcChhID0+IHtcclxuXHRcdFx0XHRcdGlmKCFzZWxmLmdldChhKSlcclxuXHRcdFx0XHRcdFx0c2VsZi5yZWdpc3RlcihuZXcgYSk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBzZWxmLmdldChjbGFzc2VzLnBvcCgpKTtcclxuICAgICAgICAgICAgfSlcclxuXHJcblx0XHR9XHJcblxyXG5cdH1cclxuXHJcbn1cclxuIiwiXHJcbm1vZHVsZSBoby5mbHV4LnJlZ2lzdHJ5IHtcclxuXHRpbXBvcnQgUHJvbWlzZSA9IGhvLnByb21pc2UuUHJvbWlzZTtcclxuXHJcblx0ZXhwb3J0IGxldCBtYXBwaW5nOiB7W2tleTpzdHJpbmddOnN0cmluZ30gPSB7fTtcclxuXHRleHBvcnQgbGV0IHVzZURpciA9IHRydWU7XHJcblxyXG5cdGV4cG9ydCBjbGFzcyBSZWdpc3RyeSB7XHJcblxyXG5cdFx0cHJpdmF0ZSBzdG9yZXM6IHtba2V5OiBzdHJpbmddOiBTdG9yZTxhbnk+fSA9IHt9O1xyXG5cclxuXHRcdHByaXZhdGUgc3RvcmVMb2FkZXIgPSBuZXcgaG8uY2xhc3Nsb2FkZXIuQ2xhc3NMb2FkZXIoe1xyXG4gICAgICAgICAgIHVybFRlbXBsYXRlOiAnc3RvcmVzLyR7bmFtZX0uanMnLFxyXG4gICAgICAgICAgIHVzZURpclxyXG4gICAgICAgfSk7XHJcblxyXG5cdFx0cHVibGljIHJlZ2lzdGVyKHN0b3JlOiBTdG9yZTxhbnk+KTogU3RvcmU8YW55PiB7XHJcblx0XHRcdHRoaXMuc3RvcmVzW3N0b3JlLm5hbWVdID0gc3RvcmU7XHJcblx0XHRcdHJldHVybiBzdG9yZTtcclxuXHRcdH1cclxuXHJcblx0XHRwdWJsaWMgZ2V0KHN0b3JlQ2xhc3M6IHN0cmluZyk6IFN0b3JlPGFueT5cclxuXHRcdHB1YmxpYyBnZXQ8VCBleHRlbmRzIFN0b3JlPGFueT4+KHN0b3JlQ2xhc3M6IHtuZXcoKTpUfSk6IFRcclxuXHRcdHB1YmxpYyBnZXQ8VCBleHRlbmRzIFN0b3JlPGFueT4+KHN0b3JlQ2xhc3M6IGFueSk6IFQge1xyXG5cdFx0XHRsZXQgbmFtZSA9IHZvaWQgMDtcclxuXHRcdFx0aWYodHlwZW9mIHN0b3JlQ2xhc3MgPT09ICdzdHJpbmcnKVxyXG5cdFx0XHRcdG5hbWUgPSBzdG9yZUNsYXNzO1xyXG5cdFx0XHRlbHNlXHJcblx0XHRcdFx0bmFtZSA9IHN0b3JlQ2xhc3MudG9TdHJpbmcoKS5tYXRjaCgvXFx3Ky9nKVsxXTtcclxuXHRcdFx0cmV0dXJuIDxUPnRoaXMuc3RvcmVzW25hbWVdO1xyXG5cdFx0fVxyXG5cclxuXHRcdHB1YmxpYyBsb2FkU3RvcmUobmFtZTogc3RyaW5nLCBpbml0ID0gdHJ1ZSk6IFByb21pc2U8U3RvcmU8YW55Piwgc3RyaW5nPiB7XHJcblxyXG5cdFx0XHRsZXQgc2VsZiA9IHRoaXM7XHJcblx0XHRcdGxldCBjbHM6IEFycmF5PHR5cGVvZiBTdG9yZT4gPSBbXTtcclxuXHJcblx0XHRcdGlmKCEhdGhpcy5zdG9yZXNbbmFtZV0pXHJcblx0XHRcdFx0cmV0dXJuIFByb21pc2UuY3JlYXRlKHRoaXMuc3RvcmVzW25hbWVdKTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnN0b3JlTG9hZGVyLmxvYWQoe1xyXG4gICAgICAgICAgICAgICAgbmFtZSxcclxuXHRcdFx0XHR1cmw6IG1hcHBpbmdbbmFtZV0sXHJcbiAgICAgICAgICAgICAgICBzdXBlcjogW1wiaG8uZmx1eC5TdG9yZVwiXVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAudGhlbigoY2xhc3NlczogQXJyYXk8dHlwZW9mIFN0b3JlPikgPT4ge1xyXG4gICAgICAgICAgICAgICAgY2xzID0gY2xhc3NlcztcclxuXHRcdFx0XHRjbGFzc2VzID0gY2xhc3Nlcy5maWx0ZXIoYyA9PiB7XHJcblx0XHRcdFx0XHRyZXR1cm4gIXNlbGYuZ2V0KGMpO1xyXG5cdFx0XHRcdH0pO1xyXG5cclxuXHRcdFx0XHRsZXQgcHJvbWlzZXMgPSAgY2xhc3Nlcy5tYXAoYyA9PiB7XHJcblx0XHRcdFx0XHRsZXQgcmVzdWx0OiBhbnkgPSBzZWxmLnJlZ2lzdGVyKG5ldyBjKTtcclxuXHRcdFx0XHRcdGlmKGluaXQpXHJcblx0XHRcdFx0XHRcdHJlc3VsdCA9IHJlc3VsdC5pbml0KCk7XHJcblx0XHRcdFx0XHRyZXR1cm4gUHJvbWlzZS5jcmVhdGUocmVzdWx0KTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgIHJldHVybiBQcm9taXNlLmFsbChwcm9taXNlcyk7XHJcbiAgICAgICAgICAgIH0pXHJcblx0XHRcdC50aGVuKHAgPT4ge1xyXG5cdFx0XHRcdHJldHVybiBzZWxmLmdldChjbHMucG9wKCkpO1xyXG5cdFx0XHR9KVxyXG5cclxuXHRcdH1cclxuXHJcblx0fVxyXG5cclxufVxyXG4iLCJcclxubW9kdWxlIGhvLmZsdXguc3RhdGVwcm92aWRlciB7XHJcblx0aW1wb3J0IFByb21pc2UgPSBoby5wcm9taXNlLlByb21pc2U7XHJcblxyXG4gICAgZXhwb3J0IGludGVyZmFjZSBJU3RhdGVQcm92aWRlciB7XHJcbiAgICAgICAgdXNlTWluOmJvb2xlYW47XHJcblx0XHRyZXNvbHZlKCk6IHN0cmluZztcclxuXHRcdGdldFN0YXRlcyhuYW1lPzpzdHJpbmcpOiBQcm9taXNlPElTdGF0ZXMsIHN0cmluZz47XHJcbiAgICB9XHJcblxyXG5cdGNsYXNzIFN0YXRlUHJvdmlkZXIgaW1wbGVtZW50cyBJU3RhdGVQcm92aWRlciB7XHJcblxyXG4gICAgICAgIHVzZU1pbjogYm9vbGVhbiA9IGZhbHNlO1xyXG5cclxuICAgICAgICByZXNvbHZlKCk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnVzZU1pbiA/XHJcbiAgICAgICAgICAgICAgICBgc3RhdGVzLm1pbi5qc2AgOlxyXG4gICAgICAgICAgICAgICAgYHN0YXRlcy5qc2A7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBnZXRTdGF0ZXMobmFtZSA9IFwiU3RhdGVzXCIpOiBQcm9taXNlPElTdGF0ZXMsIHN0cmluZz4ge1xyXG5cdFx0XHRyZXR1cm4gbmV3IFByb21pc2U8SVN0YXRlcywgYW55PigocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcblx0XHRcdFx0bGV0IHNyYyA9IHRoaXMucmVzb2x2ZSgpO1xyXG4gICAgICAgICAgICAgICAgbGV0IHNjcmlwdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NjcmlwdCcpO1xyXG4gICAgICAgICAgICAgICAgc2NyaXB0Lm9ubG9hZCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUobmV3IHdpbmRvd1tuYW1lXSk7XHJcbiAgICAgICAgICAgICAgICB9O1xyXG5cdFx0XHRcdHNjcmlwdC5vbmVycm9yID0gKGUpID0+IHtcclxuXHRcdFx0XHRcdHJlamVjdChlKTtcclxuXHRcdFx0XHR9O1xyXG4gICAgICAgICAgICAgICAgc2NyaXB0LnNyYyA9IHNyYztcclxuICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdoZWFkJylbMF0uYXBwZW5kQ2hpbGQoc2NyaXB0KTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGxldCBpbnN0YW5jZTogSVN0YXRlUHJvdmlkZXIgPSBuZXcgU3RhdGVQcm92aWRlcigpO1xyXG59XHJcbiIsIlxyXG5tb2R1bGUgaG8uZmx1eCB7XHJcblxyXG5cdGV4cG9ydCBjbGFzcyBTdG9yZTxUPiBleHRlbmRzIENhbGxiYWNrSG9sZGVyIHtcclxuXHJcblx0XHRwcm90ZWN0ZWQgZGF0YTogVDtcclxuXHRcdHByaXZhdGUgaWQ6IHN0cmluZztcclxuXHRcdHByaXZhdGUgaGFuZGxlcnM6IHtba2V5OiBzdHJpbmddOiBGdW5jdGlvbn0gPSB7fTtcclxuXHRcdHByb3RlY3RlZCBhY3Rpb25zOiBzdHJpbmdbXSA9IFtdO1xyXG5cclxuXHRcdGNvbnN0cnVjdG9yKCkge1xyXG5cdFx0XHRzdXBlcigpO1xyXG5cdFx0XHR0aGlzLmlkID0gaG8uZmx1eC5ESVNQQVRDSEVSLnJlZ2lzdGVyKHRoaXMuaGFuZGxlLmJpbmQodGhpcykpO1xyXG5cdFx0XHQvL2hvLmZsdXguU1RPUkVTLnJlZ2lzdGVyKHRoaXMpO1xyXG5cdFx0fVxyXG5cclxuXHRcdHB1YmxpYyBpbml0KCk6IGhvLnByb21pc2UuUHJvbWlzZTxhbnksIGFueT4ge1xyXG5cdFx0XHRyZXR1cm4gaG8ucHJvbWlzZS5Qcm9taXNlLmFsbCh0aGlzLmFjdGlvbnMubWFwKGE9PntcclxuXHRcdFx0XHRyZXR1cm4gaG8uZmx1eC5BQ1RJT05TLmxvYWRBY3Rpb24oYSk7XHJcblx0XHRcdH0pKTtcclxuXHRcdH1cclxuXHJcblx0XHQgZ2V0IG5hbWUoKTogc3RyaW5nIHtcclxuXHRcdFx0cmV0dXJuIHRoaXMuY29uc3RydWN0b3IudG9TdHJpbmcoKS5tYXRjaCgvXFx3Ky9nKVsxXTtcclxuXHRcdH1cclxuXHJcblx0XHRwdWJsaWMgcmVnaXN0ZXIoY2FsbGJhY2s6IChkYXRhOlQpPT52b2lkLCBzZWxmPzphbnkpOiBzdHJpbmcge1xyXG5cdFx0XHRyZXR1cm4gc3VwZXIucmVnaXN0ZXIoY2FsbGJhY2ssIHNlbGYpO1xyXG5cdFx0fVxyXG5cclxuXHRcdHByb3RlY3RlZCBvbih0eXBlOiBzdHJpbmcsIGZ1bmM6IEZ1bmN0aW9uKTogdm9pZCB7XHJcblx0XHRcdHRoaXMuaGFuZGxlcnNbdHlwZV0gPSBmdW5jO1xyXG5cdFx0fVxyXG5cclxuXHRcdHByb3RlY3RlZCBoYW5kbGUoYWN0aW9uOiBJQWN0aW9uKTogdm9pZCB7XHJcblx0XHRcdGlmKHR5cGVvZiB0aGlzLmhhbmRsZXJzW2FjdGlvbi50eXBlXSA9PT0gJ2Z1bmN0aW9uJylcclxuXHRcdFx0XHR0aGlzLmhhbmRsZXJzW2FjdGlvbi50eXBlXShhY3Rpb24uZGF0YSk7XHJcblx0XHR9O1xyXG5cclxuXHJcblx0XHRwcm90ZWN0ZWQgY2hhbmdlZCgpOiB2b2lkIHtcclxuXHRcdFx0Zm9yIChsZXQgaWQgaW4gdGhpcy5jYWxsYmFja3MpIHtcclxuXHRcdFx0ICBsZXQgY2IgPSB0aGlzLmNhbGxiYWNrc1tpZF07XHJcblx0XHRcdCAgaWYoY2IpXHJcblx0XHRcdCAgXHRjYih0aGlzLmRhdGEpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cclxuXHR9O1xyXG5cclxuXHJcbn1cclxuIiwiXHJcblxyXG5tb2R1bGUgaG8uZmx1eCB7XHJcblxyXG5cdGltcG9ydCBQcm9taXNlID0gaG8ucHJvbWlzZS5Qcm9taXNlO1xyXG5cclxuXHJcblx0LyoqIERhdGEgdGhhdCBhIFJvdXRlciNnbyB0YWtlcyAqL1xyXG5cdGV4cG9ydCBpbnRlcmZhY2UgSVJvdXRlRGF0YSB7XHJcblx0ICAgIHN0YXRlOiBzdHJpbmc7XHJcblx0XHRhcmdzOiBhbnk7XHJcblx0XHRleHRlcm46IGJvb2xlYW47XHJcblx0fVxyXG5cclxuXHQvKiogRGF0YSB0aGF0IFJvdXRlciNjaGFuZ2VzIGVtaXQgdG8gaXRzIGxpc3RlbmVycyAqL1xyXG5cdGV4cG9ydCBpbnRlcmZhY2UgSVJvdXRlckRhdGEge1xyXG5cdCAgICBzdGF0ZTogSVN0YXRlO1xyXG5cdFx0YXJnczogYW55O1xyXG5cdFx0ZXh0ZXJuOiBib29sZWFuO1xyXG5cdH1cclxuXHJcblx0ZXhwb3J0IGNsYXNzIFJvdXRlciBleHRlbmRzIFN0b3JlPElSb3V0ZXJEYXRhPiB7XHJcblxyXG5cdFx0cHJpdmF0ZSBtYXBwaW5nOkFycmF5PElTdGF0ZT4gPSBudWxsO1xyXG5cclxuXHRcdHB1YmxpYyBpbml0KCk6IFByb21pc2U8YW55LCBhbnk+IHtcclxuXHRcdFx0dGhpcy5vbignU1RBVEUnLCB0aGlzLm9uU3RhdGVDaGFuZ2VSZXF1ZXN0ZWQuYmluZCh0aGlzKSk7XHJcblxyXG5cdFx0XHRsZXQgb25IYXNoQ2hhbmdlID0gdGhpcy5vbkhhc2hDaGFuZ2UuYmluZCh0aGlzKTtcclxuXHJcblx0XHRcdHJldHVybiB0aGlzLmluaXRTdGF0ZXMoKVxyXG5cdFx0XHQudGhlbigoKSA9PiB7XHJcblx0XHRcdFx0d2luZG93Lm9uaGFzaGNoYW5nZSA9IG9uSGFzaENoYW5nZTtcclxuXHRcdFx0XHRvbkhhc2hDaGFuZ2UoKTtcclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblxyXG5cdFx0cHVibGljIGdvKHN0YXRlOiBzdHJpbmcsIGRhdGE/OiBhbnkpOiB2b2lkXHJcblx0XHRwdWJsaWMgZ28oZGF0YTogSVJvdXRlRGF0YSk6IHZvaWRcclxuXHRcdHB1YmxpYyBnbyhkYXRhOiBJUm91dGVEYXRhIHwgc3RyaW5nLCBhcmdzPzogYW55KTogdm9pZCB7XHJcblxyXG5cdFx0XHRsZXQgX2RhdGE6IElSb3V0ZURhdGEgPSB7XHJcblx0XHRcdFx0c3RhdGU6IHVuZGVmaW5lZCxcclxuXHRcdFx0XHRhcmdzOiB1bmRlZmluZWQsXHJcblx0XHRcdFx0ZXh0ZXJuOiBmYWxzZVxyXG5cdFx0XHR9O1xyXG5cclxuXHRcdFx0aWYodHlwZW9mIGRhdGEgPT09ICdzdHJpbmcnKSB7XHJcblx0XHRcdFx0X2RhdGEuc3RhdGUgPSBkYXRhO1xyXG5cdFx0XHRcdF9kYXRhLmFyZ3MgPSBhcmdzO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdF9kYXRhLnN0YXRlID0gZGF0YS5zdGF0ZTtcclxuXHRcdFx0XHRfZGF0YS5hcmdzID0gZGF0YS5hcmdzO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRoby5mbHV4LkRJU1BBVENIRVIuZGlzcGF0Y2goe1xyXG5cdFx0XHRcdHR5cGU6ICdTVEFURScsXHJcblx0XHRcdFx0ZGF0YTogX2RhdGFcclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblxyXG5cdFx0cHJpdmF0ZSBpbml0U3RhdGVzKCk6IFByb21pc2U8YW55LCBhbnk+IHtcclxuXHRcdFx0cmV0dXJuIHN0YXRlcHJvdmlkZXIuaW5zdGFuY2UuZ2V0U3RhdGVzKClcclxuXHRcdFx0LnRoZW4oZnVuY3Rpb24oaXN0YXRlcykge1xyXG5cdFx0XHRcdHRoaXMubWFwcGluZyA9IGlzdGF0ZXMuc3RhdGVzO1xyXG5cdFx0XHR9LmJpbmQodGhpcykpO1xyXG5cdFx0fVxyXG5cclxuXHRcdHByaXZhdGUgZ2V0U3RhdGVGcm9tTmFtZShuYW1lOiBzdHJpbmcpOiBJU3RhdGUge1xyXG5cdFx0XHRyZXR1cm4gdGhpcy5tYXBwaW5nLmZpbHRlcigocyk9PntcclxuXHRcdFx0XHRyZXR1cm4gcy5uYW1lID09PSBuYW1lXHJcblx0XHRcdH0pWzBdO1xyXG5cdFx0fVxyXG5cclxuXHRcdHByb3RlY3RlZCBvblN0YXRlQ2hhbmdlUmVxdWVzdGVkKGRhdGE6IElSb3V0ZURhdGEpOiB2b2lkIHtcclxuXHRcdFx0Ly9nZXQgcmVxdWVzdGVkIHN0YXRlXHJcblx0XHRcdGxldCBzdGF0ZSA9IHRoaXMuZ2V0U3RhdGVGcm9tTmFtZShkYXRhLnN0YXRlKTtcclxuXHRcdFx0bGV0IHVybCA9IHRoaXMudXJsRnJvbVN0YXRlKHN0YXRlLnVybCwgZGF0YS5hcmdzKTtcclxuXHJcblx0XHRcdC8vY3VycmVudCBzdGF0ZSBhbmQgYXJncyBlcXVhbHMgcmVxdWVzdGVkIHN0YXRlIGFuZCBhcmdzIC0+IHJldHVyblxyXG5cdFx0XHRpZihcclxuXHRcdFx0XHR0aGlzLmRhdGEgJiZcclxuXHRcdFx0XHR0aGlzLmRhdGEuc3RhdGUgJiZcclxuXHRcdFx0XHR0aGlzLmRhdGEuc3RhdGUubmFtZSA9PT0gZGF0YS5zdGF0ZSAmJlxyXG5cdFx0XHRcdHRoaXMuZXF1YWxzKHRoaXMuZGF0YS5hcmdzLCBkYXRhLmFyZ3MpICYmXHJcblx0XHRcdFx0dXJsID09PSB3aW5kb3cubG9jYXRpb24uaGFzaC5zdWJzdHIoMSlcclxuXHRcdFx0KSB7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblxyXG5cclxuXHJcblx0XHRcdC8vcmVxdWVzdGVkIHN0YXRlIGhhcyBhbiByZWRpcmVjdCBwcm9wZXJ0eSAtPiBjYWxsIHJlZGlyZWN0IHN0YXRlXHJcblx0XHRcdGlmKCEhc3RhdGUucmVkaXJlY3QpIHtcclxuXHRcdFx0XHRzdGF0ZSA9IHRoaXMuZ2V0U3RhdGVGcm9tTmFtZShzdGF0ZS5yZWRpcmVjdCk7XHJcblx0XHRcdH1cclxuXHJcblxyXG5cdFx0XHRsZXQgcHJvbSA9IHR5cGVvZiBzdGF0ZS5iZWZvcmUgPT09ICdmdW5jdGlvbicgPyBzdGF0ZS5iZWZvcmUoZGF0YSkgOiBQcm9taXNlLmNyZWF0ZSh1bmRlZmluZWQpO1xyXG5cdFx0XHRwcm9tXHJcblx0XHRcdC50aGVuKGZ1bmN0aW9uKCkge1xyXG5cclxuXHRcdFx0XHQvL2RvZXMgdGhlIHN0YXRlIGNoYW5nZSByZXF1ZXN0IGNvbWVzIGZyb20gZXh0ZXJuIGUuZy4gdXJsIGNoYW5nZSBpbiBicm93c2VyIHdpbmRvdyA/XHJcblx0XHRcdFx0bGV0IGV4dGVybiA9ICEhIGRhdGEuZXh0ZXJuO1xyXG5cclxuXHRcdFx0XHR0aGlzLmRhdGEgPSB7XHJcblx0XHRcdFx0XHRzdGF0ZTogc3RhdGUsXHJcblx0XHRcdFx0XHRhcmdzOiBkYXRhLmFyZ3MsXHJcblx0XHRcdFx0XHRleHRlcm46IGV4dGVybixcclxuXHRcdFx0XHR9O1xyXG5cclxuXHRcdFx0XHQvLy0tLS0tLS0gc2V0IHVybCBmb3IgYnJvd3NlclxyXG5cdFx0XHRcdHZhciB1cmwgPSB0aGlzLnVybEZyb21TdGF0ZShzdGF0ZS51cmwsIGRhdGEuYXJncyk7XHJcblx0XHRcdFx0dGhpcy5zZXRVcmwodXJsKTtcclxuXHJcblx0XHRcdFx0dGhpcy5jaGFuZ2VkKCk7XHJcblxyXG5cdFx0XHR9LmJpbmQodGhpcyksXHJcblx0XHRcdGZ1bmN0aW9uKGRhdGEpIHtcclxuXHRcdFx0XHR0aGlzLm9uU3RhdGVDaGFuZ2VSZXF1ZXN0ZWQoZGF0YSk7XHJcblx0XHRcdH0uYmluZCh0aGlzKSk7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdHByaXZhdGUgb25IYXNoQ2hhbmdlKCk6IHZvaWQge1xyXG5cdFx0XHRsZXQgcyA9IHRoaXMuc3RhdGVGcm9tVXJsKHdpbmRvdy5sb2NhdGlvbi5oYXNoLnN1YnN0cigxKSk7XHJcblxyXG5cdFx0XHRoby5mbHV4LkRJU1BBVENIRVIuZGlzcGF0Y2goe1xyXG5cdFx0XHRcdHR5cGU6ICdTVEFURScsXHJcblx0XHRcdFx0ZGF0YToge1xyXG5cdFx0XHRcdFx0c3RhdGU6IHMuc3RhdGUsXHJcblx0XHRcdFx0XHRhcmdzOiBzLmFyZ3MsXHJcblx0XHRcdFx0XHRleHRlcm46IHRydWUsXHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHJcblx0XHRwcml2YXRlIHNldFVybCh1cmw6IHN0cmluZyk6IHZvaWQge1xyXG5cdFx0XHRpZih3aW5kb3cubG9jYXRpb24uaGFzaC5zdWJzdHIoMSkgPT09IHVybClcclxuXHRcdFx0XHRyZXR1cm47XHJcblxyXG5cdFx0XHRsZXQgbCA9IHdpbmRvdy5vbmhhc2hjaGFuZ2U7XHJcblx0XHRcdHdpbmRvdy5vbmhhc2hjaGFuZ2UgPSBudWxsO1xyXG5cdFx0XHR3aW5kb3cubG9jYXRpb24uaGFzaCA9IHVybDtcclxuXHRcdFx0d2luZG93Lm9uaGFzaGNoYW5nZSA9IGw7XHJcblx0XHR9XHJcblxyXG5cdFx0cHJpdmF0ZSByZWdleEZyb21VcmwodXJsOiBzdHJpbmcpOiBzdHJpbmcge1xyXG5cdFx0XHR2YXIgcmVnZXggPSAvOihbXFx3XSspLztcclxuXHRcdFx0d2hpbGUodXJsLm1hdGNoKHJlZ2V4KSkge1xyXG5cdFx0XHRcdHVybCA9IHVybC5yZXBsYWNlKHJlZ2V4LCBcIihbXlxcL10rKVwiKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRyZXR1cm4gdXJsKyckJztcclxuXHRcdH1cclxuXHJcblx0XHRwcml2YXRlIGFyZ3NGcm9tVXJsKHBhdHRlcm46IHN0cmluZywgdXJsOiBzdHJpbmcpOiBhbnkge1xyXG5cdFx0XHRsZXQgciA9IHRoaXMucmVnZXhGcm9tVXJsKHBhdHRlcm4pO1xyXG5cdFx0XHRsZXQgbmFtZXMgPSBwYXR0ZXJuLm1hdGNoKHIpLnNsaWNlKDEpO1xyXG5cdFx0XHRsZXQgdmFsdWVzID0gdXJsLm1hdGNoKHIpLnNsaWNlKDEpO1xyXG5cclxuXHRcdFx0bGV0IGFyZ3MgPSB7fTtcclxuXHRcdFx0bmFtZXMuZm9yRWFjaChmdW5jdGlvbihuYW1lLCBpKSB7XHJcblx0XHRcdFx0YXJnc1tuYW1lLnN1YnN0cigxKV0gPSB2YWx1ZXNbaV07XHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdFx0cmV0dXJuIGFyZ3M7XHJcblx0XHR9XHJcblxyXG5cdFx0cHJpdmF0ZSBzdGF0ZUZyb21VcmwodXJsOiBzdHJpbmcpOiBJUm91dGVEYXRhIHtcclxuXHRcdFx0dmFyIHMgPSB2b2lkIDA7XHJcblx0XHRcdHRoaXMubWFwcGluZy5mb3JFYWNoKChzdGF0ZTogSVN0YXRlKSA9PiB7XHJcblx0XHRcdFx0aWYocylcclxuXHRcdFx0XHRcdHJldHVybjtcclxuXHJcblx0XHRcdFx0dmFyIHIgPSB0aGlzLnJlZ2V4RnJvbVVybChzdGF0ZS51cmwpO1xyXG5cdFx0XHRcdGlmKHVybC5tYXRjaChyKSkge1xyXG5cdFx0XHRcdFx0dmFyIGFyZ3MgPSB0aGlzLmFyZ3NGcm9tVXJsKHN0YXRlLnVybCwgdXJsKTtcclxuXHRcdFx0XHRcdHMgPSB7XHJcblx0XHRcdFx0XHRcdFwic3RhdGVcIjogc3RhdGUubmFtZSxcclxuXHRcdFx0XHRcdFx0XCJhcmdzXCI6IGFyZ3MsXHJcblx0XHRcdFx0XHRcdFwiZXh0ZXJuXCI6IGZhbHNlXHJcblx0XHRcdFx0XHR9O1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0XHRpZighcylcclxuXHRcdFx0XHR0aHJvdyBcIk5vIFN0YXRlIGZvdW5kIGZvciB1cmwgXCIrdXJsO1xyXG5cclxuXHRcdFx0cmV0dXJuIHM7XHJcblx0XHR9XHJcblxyXG5cdFx0cHJpdmF0ZSB1cmxGcm9tU3RhdGUodXJsOiBzdHJpbmcsIGFyZ3M6IGFueSk6IHN0cmluZyB7XHJcblx0XHRcdGxldCByZWdleCA9IC86KFtcXHddKykvO1xyXG5cdFx0XHR3aGlsZSh1cmwubWF0Y2gocmVnZXgpKSB7XHJcblx0XHRcdFx0dXJsID0gdXJsLnJlcGxhY2UocmVnZXgsIGZ1bmN0aW9uKG0pIHtcclxuXHRcdFx0XHRcdHJldHVybiBhcmdzW20uc3Vic3RyKDEpXTtcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0fVxyXG5cdFx0XHRyZXR1cm4gdXJsO1xyXG5cdFx0fVxyXG5cclxuXHRcdHByaXZhdGUgZXF1YWxzKG8xOiBhbnksIG8yOiBhbnkpIDogYm9vbGVhbiB7XHJcblx0XHRcdHJldHVybiBKU09OLnN0cmluZ2lmeShvMSkgPT09IEpTT04uc3RyaW5naWZ5KG8yKTtcclxuXHRcdH1cclxuXHJcblx0fVxyXG59XHJcbiIsIlxyXG5tb2R1bGUgaG8uZmx1eCB7XHJcblxyXG5cdGV4cG9ydCBpbnRlcmZhY2UgSUFjdGlvbiB7XHJcblx0ICAgIHR5cGU6c3RyaW5nO1xyXG5cdFx0ZGF0YT86YW55O1xyXG5cdH1cclxuXHJcblx0ZXhwb3J0IGNsYXNzIERpc3BhdGNoZXIgZXh0ZW5kcyBDYWxsYmFja0hvbGRlciB7XHJcblxyXG4gICAgXHRwcml2YXRlIGlzUGVuZGluZzoge1trZXk6c3RyaW5nXTpib29sZWFufSA9IHt9O1xyXG4gICAgXHRwcml2YXRlIGlzSGFuZGxlZDoge1trZXk6c3RyaW5nXTpib29sZWFufSA9IHt9O1xyXG4gICAgXHRwcml2YXRlIGlzRGlzcGF0Y2hpbmc6IGJvb2xlYW4gPSBmYWxzZTtcclxuICAgIFx0cHJpdmF0ZSBwZW5kaW5nUGF5bG9hZDogSUFjdGlvbiA9IG51bGw7XHJcblxyXG5cdFx0cHVibGljIHdhaXRGb3IoLi4uaWRzOiBBcnJheTxudW1iZXI+KTogdm9pZCB7XHJcblx0XHRcdGlmKCF0aGlzLmlzRGlzcGF0Y2hpbmcpXHJcblx0XHQgIFx0XHR0aHJvdyAnRGlzcGF0Y2hlci53YWl0Rm9yKC4uLik6IE11c3QgYmUgaW52b2tlZCB3aGlsZSBkaXNwYXRjaGluZy4nO1xyXG5cclxuXHRcdFx0Zm9yIChsZXQgaWkgPSAwOyBpaSA8IGlkcy5sZW5ndGg7IGlpKyspIHtcclxuXHRcdFx0ICBsZXQgaWQgPSBpZHNbaWldO1xyXG5cclxuXHRcdFx0ICBpZiAodGhpcy5pc1BlbmRpbmdbaWRdKSB7XHJcblx0XHQgICAgICBcdGlmKCF0aGlzLmlzSGFuZGxlZFtpZF0pXHJcblx0XHRcdCAgICAgIFx0dGhyb3cgYHdhaXRGb3IoLi4uKTogQ2lyY3VsYXIgZGVwZW5kZW5jeSBkZXRlY3RlZCB3aGlsZSB3YXRpbmcgZm9yICR7aWR9YDtcclxuXHRcdFx0XHRjb250aW51ZTtcclxuXHRcdFx0ICB9XHJcblxyXG5cdFx0XHQgIGlmKCF0aGlzLmNhbGxiYWNrc1tpZF0pXHJcblx0XHRcdCAgXHR0aHJvdyBgd2FpdEZvciguLi4pOiAke2lkfSBkb2VzIG5vdCBtYXAgdG8gYSByZWdpc3RlcmVkIGNhbGxiYWNrLmA7XHJcblxyXG5cdFx0XHQgIHRoaXMuaW52b2tlQ2FsbGJhY2soaWQpO1xyXG5cdFx0XHR9XHJcblx0XHR9O1xyXG5cclxuXHRcdHB1YmxpYyBkaXNwYXRjaChhY3Rpb246IElBY3Rpb24pIHtcclxuXHRcdFx0aWYodGhpcy5pc0Rpc3BhdGNoaW5nKVxyXG5cdFx0ICAgIFx0dGhyb3cgJ0Nhbm5vdCBkaXNwYXRjaCBpbiB0aGUgbWlkZGxlIG9mIGEgZGlzcGF0Y2guJztcclxuXHJcblx0XHRcdHRoaXMuc3RhcnREaXNwYXRjaGluZyhhY3Rpb24pO1xyXG5cclxuXHRcdCAgICB0cnkge1xyXG5cdFx0ICAgICAgZm9yIChsZXQgaWQgaW4gdGhpcy5jYWxsYmFja3MpIHtcclxuXHRcdCAgICAgICAgaWYgKHRoaXMuaXNQZW5kaW5nW2lkXSkge1xyXG5cdFx0ICAgICAgICAgIGNvbnRpbnVlO1xyXG5cdFx0ICAgICAgICB9XHJcblx0XHQgICAgICAgIHRoaXMuaW52b2tlQ2FsbGJhY2soaWQpO1xyXG5cdFx0ICAgICAgfVxyXG5cdFx0ICAgIH0gZmluYWxseSB7XHJcblx0XHQgICAgICB0aGlzLnN0b3BEaXNwYXRjaGluZygpO1xyXG5cdFx0ICAgIH1cclxuXHRcdH07XHJcblxyXG5cdCAgXHRwcml2YXRlIGludm9rZUNhbGxiYWNrKGlkOiBudW1iZXIpOiB2b2lkIHtcclxuXHQgICAgXHR0aGlzLmlzUGVuZGluZ1tpZF0gPSB0cnVlO1xyXG5cdCAgICBcdHRoaXMuY2FsbGJhY2tzW2lkXSh0aGlzLnBlbmRpbmdQYXlsb2FkKTtcclxuXHQgICAgXHR0aGlzLmlzSGFuZGxlZFtpZF0gPSB0cnVlO1xyXG5cdCAgXHR9XHJcblxyXG5cdCAgXHRwcml2YXRlIHN0YXJ0RGlzcGF0Y2hpbmcocGF5bG9hZDogSUFjdGlvbik6IHZvaWQge1xyXG5cdCAgICBcdGZvciAobGV0IGlkIGluIHRoaXMuY2FsbGJhY2tzKSB7XHJcblx0ICAgICAgXHRcdHRoaXMuaXNQZW5kaW5nW2lkXSA9IGZhbHNlO1xyXG5cdCAgICAgIFx0XHR0aGlzLmlzSGFuZGxlZFtpZF0gPSBmYWxzZTtcclxuXHQgICAgXHR9XHJcblx0ICAgIFx0dGhpcy5wZW5kaW5nUGF5bG9hZCA9IHBheWxvYWQ7XHJcblx0ICAgIFx0dGhpcy5pc0Rpc3BhdGNoaW5nID0gdHJ1ZTtcclxuICBcdFx0fVxyXG5cclxuXHQgIFx0cHJpdmF0ZSBzdG9wRGlzcGF0Y2hpbmcoKTogdm9pZCB7XHJcblx0ICAgIFx0dGhpcy5wZW5kaW5nUGF5bG9hZCA9IG51bGw7XHJcblx0ICAgIFx0dGhpcy5pc0Rpc3BhdGNoaW5nID0gZmFsc2U7XHJcblx0ICBcdH1cclxuXHR9XHJcbn1cclxuIiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uLy4uLy4uL2Jvd2VyX2NvbXBvbmVudHMvaG8tcHJvbWlzZS9kaXN0L3Byb21pc2UuZC50c1wiLz5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uLy4uLy4uL2Jvd2VyX2NvbXBvbmVudHMvaG8tY2xhc3Nsb2FkZXIvZGlzdC9jbGFzc2xvYWRlci5kLnRzXCIvPlxyXG5cclxubW9kdWxlIGhvLmZsdXgge1xyXG5cdGltcG9ydCBQcm9taXNlID0gaG8ucHJvbWlzZS5Qcm9taXNlO1xyXG5cclxuXHRleHBvcnQgbGV0IERJU1BBVENIRVI6IERpc3BhdGNoZXIgPSBuZXcgRGlzcGF0Y2hlcigpO1xyXG5cclxuXHRleHBvcnQgbGV0IFNUT1JFUzogcmVnaXN0cnkuUmVnaXN0cnkgPSBuZXcgcmVnaXN0cnkuUmVnaXN0cnkoKTtcclxuXHJcblx0ZXhwb3J0IGxldCBBQ1RJT05TOiBhY3Rpb25zLlJlZ2lzdHJ5ID0gbmV3IGFjdGlvbnMuUmVnaXN0cnkoKTtcclxuXHJcblx0ZXhwb3J0IGxldCBkaXI6IGJvb2xlYW4gPSBmYWxzZTtcclxuXHJcblxyXG5cdGV4cG9ydCBmdW5jdGlvbiBydW4ocm91dGVyOmFueSA9IFJvdXRlcik6IFByb21pc2U8YW55LCBhbnk+IHtcclxuXHRcdHJldHVybiBuZXcgUHJvbWlzZTxhbnksIGFueT4oKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG5cdFx0XHRpZighIVNUT1JFUy5nZXQocm91dGVyKSlcclxuXHRcdFx0XHRyZXNvbHZlKFNUT1JFUy5nZXQocm91dGVyKSlcclxuXHRcdFx0ZWxzZSBpZihyb3V0ZXIgPT09IFJvdXRlcilcclxuXHRcdFx0XHRyZXNvbHZlKG5ldyBSb3V0ZXIoKSk7XHJcblx0XHRcdGVsc2UgaWYodHlwZW9mIHJvdXRlciA9PT0gJ2Z1bmN0aW9uJylcclxuXHRcdFx0XHRyZXNvbHZlKG5ldyByb3V0ZXIoKSlcclxuXHRcdFx0ZWxzZSBpZih0eXBlb2Ygcm91dGVyID09PSAnc3RyaW5nJykge1xyXG5cdFx0XHRcdFNUT1JFUy5sb2FkU3RvcmUocm91dGVyKVxyXG5cdFx0XHRcdC50aGVuKHMgPT4gcmVzb2x2ZShzKSlcclxuXHRcdFx0fVxyXG5cdFx0fSlcclxuXHRcdC50aGVuKHIgPT4ge1xyXG5cdFx0XHRyZXR1cm4gU1RPUkVTLnJlZ2lzdGVyKHIpLmluaXQoKTtcclxuXHRcdH0pO1xyXG5cclxuXHR9XHJcbn1cclxuIiwibW9kdWxlIGhvLnVpIHtcclxuXHJcblx0ZXhwb3J0IGZ1bmN0aW9uIHJ1bihvcHRpb25zOklPcHRpb25zPW5ldyBPcHRpb25zKCkpOiBoby5wcm9taXNlLlByb21pc2U8YW55LCBhbnk+IHtcclxuXHRcdG9wdGlvbnMgPSBuZXcgT3B0aW9ucyhvcHRpb25zKTtcclxuXHJcblx0XHRsZXQgcCA9IG9wdGlvbnMucHJvY2VzcygpXHJcblx0XHQudGhlbihoby5jb21wb25lbnRzLnJ1bi5iaW5kKGhvLmNvbXBvbmVudHMsIHVuZGVmaW5lZCkpXHJcblx0XHQudGhlbihoby5mbHV4LnJ1bi5iaW5kKGhvLmZsdXgsIHVuZGVmaW5lZCkpO1xyXG5cclxuXHRcdHJldHVybiBwO1xyXG5cdH1cclxuXHJcblx0bGV0IGNvbXBvbmVudHMgPSBbXHJcblx0XHRcIkZsdXhDb21wb25lbnRcIixcclxuXHRcdFwiVmlld1wiLFxyXG5cdF07XHJcblxyXG5cdGxldCBhdHRyaWJ1dGVzID0gW1xyXG5cdFx0XCJCaW5kXCIsXHJcblx0XHRcIkJpbmRCaVwiLFxyXG5cdF07XHJcblxyXG5cdGxldCBzdG9yZXMgPSBbXHJcblxyXG5cdF07XHJcblxyXG5cdGV4cG9ydCBpbnRlcmZhY2UgSU9wdGlvbnMge1xyXG5cdFx0cm9vdDogc3RyaW5nIHwgdHlwZW9mIGhvLmNvbXBvbmVudHMuQ29tcG9uZW50OyAvL1Jvb3QgY29tcG9uZW50IHRvIHJlZ2lzdGVyO1xyXG5cdFx0cm91dGVyOiBzdHJpbmcgfCB0eXBlb2YgaG8uZmx1eC5Sb3V0ZXI7IC8vYWx0ZXJuYXRpdmUgcm91dGVyIGNsYXNzXHJcblx0XHRtYXA6IHN0cmluZyB8IGJvb2xlYW47IC8vIGlmIHNldCwgbWFwIGFsbCBoby51aSBjb21wb25lbnRzIGluIHRoZSBjb21wb25lbnRwcm92aWRlciB0byB0aGUgZ2l2ZW4gdXJsXHJcblx0XHRkaXI6IGJvb2xlYW47IC8vIHNldCB1c2VkaXIgaW4gaG8uY29tcG9uZW50c1xyXG5cdFx0bWluOiBib29sZWFuO1xyXG5cdFx0cHJvY2VzczogKCk9PmhvLnByb21pc2UuUHJvbWlzZTxhbnksIGFueT47XHJcblx0fVxyXG5cclxuXHRjbGFzcyBPcHRpb25zIGltcGxlbWVudHMgSU9wdGlvbnMge1xyXG5cdFx0cm9vdDogc3RyaW5nIHwgdHlwZW9mIGhvLmNvbXBvbmVudHMuQ29tcG9uZW50ID0gXCJBcHBcIlxyXG5cdFx0cm91dGVyOiBzdHJpbmcgfCB0eXBlb2YgaG8uZmx1eC5Sb3V0ZXIgPSBoby5mbHV4LlJvdXRlcjtcclxuXHRcdG1hcDogc3RyaW5nIHwgYm9vbGVhbiA9IHRydWU7XHJcblx0XHRtYXBEZWZhdWx0ID0gXCJib3dlcl9jb21wb25lbnRzL2hvLXVpL2Rpc3QvXCI7XHJcblx0XHRkaXIgPSB0cnVlO1xyXG5cdFx0bWluID0gZmFsc2U7XHJcblxyXG5cdFx0Y29uc3RydWN0b3Iob3B0OiBJT3B0aW9ucyA9IDxJT3B0aW9ucz57fSkge1xyXG5cdFx0XHRmb3IodmFyIGtleSBpbiBvcHQpIHtcclxuXHRcdFx0XHR0aGlzW2tleV0gPSBvcHRba2V5XTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdHByb2Nlc3MoKTogaG8ucHJvbWlzZS5Qcm9taXNlPGFueSwgYW55PntcclxuXHRcdFx0cmV0dXJuIGhvLnByb21pc2UuUHJvbWlzZS5jcmVhdGUodGhpcy5wcm9jZXNzRGlyKCkpXHJcblx0XHRcdC50aGVuKHRoaXMucHJvY2Vzc01pbi5iaW5kKHRoaXMpKVxyXG5cdFx0XHQudGhlbih0aGlzLnByb2Nlc3NNYXAuYmluZCh0aGlzKSlcclxuXHRcdFx0LnRoZW4odGhpcy5wcm9jZXNzUm91dGVyLmJpbmQodGhpcykpXHJcblx0XHRcdC50aGVuKHRoaXMucHJvY2Vzc1Jvb3QuYmluZCh0aGlzKSlcclxuXHRcdH1cclxuXHJcblx0XHRwcm90ZWN0ZWQgcHJvY2Vzc1Jvb3QoKSB7XHJcblx0XHRcdHJldHVybiBuZXcgaG8ucHJvbWlzZS5Qcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuXHRcdFx0XHRpZih0eXBlb2YgdGhpcy5yb290ID09PSAnc3RyaW5nJykge1xyXG5cdFx0XHRcdFx0aG8uY29tcG9uZW50cy5yZWdpc3RyeS5pbnN0YW5jZS5sb2FkQ29tcG9uZW50KDxzdHJpbmc+dGhpcy5yb290KVxyXG5cdFx0XHRcdFx0LnRoZW4ocmVzb2x2ZSlcclxuXHRcdFx0XHRcdC5jYXRjaChyZWplY3QpO1xyXG5cclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0aG8uY29tcG9uZW50cy5yZWdpc3RyeS5pbnN0YW5jZS5yZWdpc3Rlcig8dHlwZW9mIGhvLmNvbXBvbmVudHMuQ29tcG9uZW50PnRoaXMucm9vdClcclxuXHRcdFx0XHRcdHJlc29sdmUobnVsbCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHJcblx0XHRwcm90ZWN0ZWQgcHJvY2Vzc1JvdXRlcigpOiBoby5wcm9taXNlLlByb21pc2U8YW55LCBhbnk+IHtcclxuXHRcdFx0cmV0dXJuIG5ldyBoby5wcm9taXNlLlByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG5cdFx0XHRcdGlmKHR5cGVvZiB0aGlzLnJvdXRlciA9PT0gJ3N0cmluZycpIHtcclxuXHRcdFx0XHRcdGhvLmZsdXguU1RPUkVTLmxvYWRTdG9yZSg8c3RyaW5nPnRoaXMucm91dGVyLCBmYWxzZSlcclxuXHRcdFx0XHRcdC50aGVuKHIgPT4gcmVzb2x2ZShyKSlcclxuXHRcdFx0XHRcdC5jYXRjaChyZWplY3QpO1xyXG5cclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0cmVzb2x2ZShuZXcgKDx0eXBlb2YgaG8uZmx1eC5Sb3V0ZXI+dGhpcy5yb3V0ZXIpKCkpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSlcclxuXHRcdFx0LnRoZW4oKHI6IGhvLmZsdXguUm91dGVyKSA9PiB7XHJcblx0XHRcdFx0aG8uZmx1eC5Sb3V0ZXIgPSA8dHlwZW9mIGhvLmZsdXguUm91dGVyPnIuY29uc3RydWN0b3I7XHJcblx0XHRcdFx0aG8uZmx1eC5TVE9SRVMucmVnaXN0ZXIocik7XHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHRwcm90ZWN0ZWQgcHJvY2Vzc01hcCgpOiB2b2lkIHtcclxuXHRcdFx0aWYodHlwZW9mIHRoaXMubWFwID09PSAnYm9vbGVhbicpIHtcclxuXHRcdFx0XHRpZighdGhpcy5tYXApXHJcblx0XHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0dGhpcy5tYXAgPSB0aGlzLm1hcERlZmF1bHQ7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGNvbXBvbmVudHMuZm9yRWFjaChjID0+IHtcclxuXHRcdFx0XHQvL2hvLmNvbXBvbmVudHMucmVnaXN0cnkubWFwcGluZ1tjXSA9IHRoaXMubWFwICsgJ2NvbXBvbmVudHMvJyArIGMgKyAnLycgKyBjICsgJy5qcyc7XHJcblx0XHRcdFx0aG8uY2xhc3Nsb2FkZXIubWFwcGluZ1tjXSA9IHRoaXMubWFwICsgJ2NvbXBvbmVudHMvJyArIGMgKyAnLycgKyBjICsgJy5qcyc7XHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdFx0YXR0cmlidXRlcy5mb3JFYWNoKGEgPT4ge1xyXG5cdFx0XHRcdC8vaG8uY29tcG9uZW50cy5yZWdpc3RyeS5tYXBwaW5nW2FdID0gdGhpcy5tYXAgKyAnYXR0cmlidXRlcy8nICsgYSArICcvJyArIGEgKyAnLmpzJztcclxuXHRcdFx0XHRoby5jbGFzc2xvYWRlci5tYXBwaW5nW2FdID0gdGhpcy5tYXAgKyAnYXR0cmlidXRlcy8nICsgYSArICcvJyArIGEgKyAnLmpzJztcclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0XHRzdG9yZXMuZm9yRWFjaChzID0+IHtcclxuXHRcdFx0XHQvL2hvLmZsdXgucmVnaXN0cnkubWFwcGluZ1tzXSA9IHRoaXMubWFwICsgJ3N0b3Jlcy8nICsgcyArICcvJyArIHMgKyAnLmpzJztcclxuXHRcdFx0XHRoby5jbGFzc2xvYWRlci5tYXBwaW5nW3NdID0gdGhpcy5tYXAgKyAnc3RvcmVzLycgKyBzICsgJy8nICsgcyArICcuanMnO1xyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHJcblx0XHRwcm90ZWN0ZWQgcHJvY2Vzc0RpcigpOiB2b2lkIHtcclxuXHRcdFx0aG8uY29tcG9uZW50cy5yZWdpc3RyeS51c2VEaXIgPSB0aGlzLmRpcjtcclxuXHRcdFx0aG8uZmx1eC5yZWdpc3RyeS51c2VEaXIgPSB0aGlzLmRpcjtcclxuXHRcdFx0aG8uZmx1eC5hY3Rpb25zLnVzZURpciA9IHRoaXMuZGlyO1xyXG5cdFx0fVxyXG5cclxuXHRcdHByb3RlY3RlZCBwcm9jZXNzTWluKCk6IHZvaWQge1xyXG5cdFx0XHQvKlxyXG5cdFx0XHRoby5jb21wb25lbnRzLmNvbXBvbmVudHByb3ZpZGVyLmluc3RhbmNlLnVzZU1pbiA9IHRoaXMubWluO1xyXG5cdFx0XHRoby5jb21wb25lbnRzLmF0dHJpYnV0ZXByb3ZpZGVyLmluc3RhbmNlLnVzZU1pbiA9IHRoaXMubWluO1xyXG5cdFx0XHRoby5mbHV4LnN0b3JlcHJvdmlkZXIuaW5zdGFuY2UudXNlTWluID0gdGhpcy5taW47XHJcblx0XHRcdCovXHJcblx0XHR9XHJcblx0fVxyXG5cclxufVxyXG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=