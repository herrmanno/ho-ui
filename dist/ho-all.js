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
                                reject(xmlhttp.statusText);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9zb3VyY2Uvc3JjL2hvL3Byb21pc2UvcHJvbWlzZS50cyIsIi9zb3VyY2Uvc3JjL2hvL2NsYXNzbG9hZGVyL3V0aWwvZ2V0LnRzIiwiL3NvdXJjZS9zcmMvaG8vY2xhc3Nsb2FkZXIvdXRpbC9leHBvc2UudHMiLCIvc291cmNlL3NyYy9oby9jbGFzc2xvYWRlci94aHIvZ2V0LnRzIiwiL3NvdXJjZS9zcmMvaG8vY2xhc3Nsb2FkZXIvdHlwZXMudHMiLCIvc291cmNlL3NyYy9oby9jbGFzc2xvYWRlci9sb2FkYXJndW1lbnRzLnRzIiwiL3NvdXJjZS9zcmMvaG8vY2xhc3Nsb2FkZXIvbG9hZGVyY29uZmlnLnRzIiwiL3NvdXJjZS9zcmMvaG8vY2xhc3Nsb2FkZXIvbG9hZHR5cGUudHMiLCIvc291cmNlL3NyYy9oby9jbGFzc2xvYWRlci9jbGFzc2xvYWRlci50cyIsIi9zb3VyY2Uvc3JjL2hvL2NsYXNzbG9hZGVyL21haW4udHMiLCIvc291cmNlL3dhdGNoLnRzIiwiL3NvdXJjZS9zcmMvaG8vY29tcG9uZW50cy90ZW1wL3RlbXAudHMiLCIvc291cmNlL3NyYy9oby9jb21wb25lbnRzL3N0eWxlci9zdHlsZXIudHMiLCIvc291cmNlL3NyYy9oby9jb21wb25lbnRzL3JlbmRlcmVyL3JlbmRlcmVyLnRzIiwiL3NvdXJjZS9zcmMvaG8vY29tcG9uZW50cy9odG1scHJvdmlkZXIvaHRtbHByb3ZpZGVyLnRzIiwiL3NvdXJjZS9zcmMvaG8vY29tcG9uZW50cy9hdHRyaWJ1dGUudHMiLCIvc291cmNlL3NyYy9oby9jb21wb25lbnRzL2NvbXBvbmVudC50cyIsIi9zb3VyY2Uvc3JjL2hvL2NvbXBvbmVudHMvcmVnaXN0cnkvcmVnaXN0cnkudHMiLCIvc291cmNlL3NyYy9oby9jb21wb25lbnRzL2NvbXBvbmVudHMudHMiLCIvc291cmNlL3NyYy9oby9mbHV4L2NhbGxiYWNraG9sZGVyLnRzIiwiL3NvdXJjZS9zcmMvaG8vZmx1eC9zdGF0ZS50cyIsIi9zb3VyY2Uvc3JjL2hvL2ZsdXgvYWN0aW9ucy9hY3Rpb24udHMiLCIvc291cmNlL3NyYy9oby9mbHV4L2FjdGlvbnMvcmVnaXN0cnkudHMiLCIvc291cmNlL3NyYy9oby9mbHV4L3JlZ2lzdHJ5L3JlZ2lzdHJ5LnRzIiwiL3NvdXJjZS9zcmMvaG8vZmx1eC9zdGF0ZXByb3ZpZGVyL3N0YXRlcHJvdmlkZXIudHMiLCIvc291cmNlL3NyYy9oby9mbHV4L3N0b3JlLnRzIiwiL3NvdXJjZS9zcmMvaG8vZmx1eC9yb3V0ZXIudHMiLCIvc291cmNlL3NyYy9oby9mbHV4L2Rpc3BhdGNoZXIudHMiLCIvc291cmNlL3NyYy9oby9mbHV4L2ZsdXgudHMiXSwibmFtZXMiOlsiaG8iLCJoby5wcm9taXNlIiwiaG8ucHJvbWlzZS5Qcm9taXNlIiwiaG8ucHJvbWlzZS5Qcm9taXNlLmNvbnN0cnVjdG9yIiwiaG8ucHJvbWlzZS5Qcm9taXNlLnNldCIsImhvLnByb21pc2UuUHJvbWlzZS5yZXNvbHZlIiwiaG8ucHJvbWlzZS5Qcm9taXNlLl9yZXNvbHZlIiwiaG8ucHJvbWlzZS5Qcm9taXNlLnJlamVjdCIsImhvLnByb21pc2UuUHJvbWlzZS5fcmVqZWN0IiwiaG8ucHJvbWlzZS5Qcm9taXNlLnRoZW4iLCJoby5wcm9taXNlLlByb21pc2UuY2F0Y2giLCJoby5wcm9taXNlLlByb21pc2UuYWxsIiwiaG8ucHJvbWlzZS5Qcm9taXNlLmNoYWluIiwiaG8ucHJvbWlzZS5Qcm9taXNlLmNoYWluLm5leHQiLCJoby5wcm9taXNlLlByb21pc2UuY3JlYXRlIiwiaG8uY2xhc3Nsb2FkZXIiLCJoby5jbGFzc2xvYWRlci51dGlsIiwiaG8uY2xhc3Nsb2FkZXIudXRpbC5nZXQiLCJoby5jbGFzc2xvYWRlci51dGlsLmV4cG9zZSIsImhvLmNsYXNzbG9hZGVyLnhociIsImhvLmNsYXNzbG9hZGVyLnhoci5nZXQiLCJoby5jbGFzc2xvYWRlci5Mb2FkQXJndW1lbnRzIiwiaG8uY2xhc3Nsb2FkZXIuTG9hZEFyZ3VtZW50cy5jb25zdHJ1Y3RvciIsImhvLmNsYXNzbG9hZGVyLldhcm5MZXZlbCIsImhvLmNsYXNzbG9hZGVyLkxvYWRlckNvbmZpZyIsImhvLmNsYXNzbG9hZGVyLkxvYWRlckNvbmZpZy5jb25zdHJ1Y3RvciIsImhvLmNsYXNzbG9hZGVyLkxvYWRUeXBlIiwiaG8uY2xhc3Nsb2FkZXIuQ2xhc3NMb2FkZXIiLCJoby5jbGFzc2xvYWRlci5DbGFzc0xvYWRlci5jb25zdHJ1Y3RvciIsImhvLmNsYXNzbG9hZGVyLkNsYXNzTG9hZGVyLmNvbmZpZyIsImhvLmNsYXNzbG9hZGVyLkNsYXNzTG9hZGVyLmxvYWQiLCJoby5jbGFzc2xvYWRlci5DbGFzc0xvYWRlci5sb2FkX3NjcmlwdCIsImhvLmNsYXNzbG9hZGVyLkNsYXNzTG9hZGVyLmxvYWRfc2NyaXB0LmxvYWRfaW50ZXJuYWwiLCJoby5jbGFzc2xvYWRlci5DbGFzc0xvYWRlci5sb2FkX2Z1bmN0aW9uIiwiaG8uY2xhc3Nsb2FkZXIuQ2xhc3NMb2FkZXIubG9hZF9ldmFsIiwiaG8uY2xhc3Nsb2FkZXIuQ2xhc3NMb2FkZXIuZ2V0UGFyZW50TmFtZSIsImhvLmNsYXNzbG9hZGVyLkNsYXNzTG9hZGVyLnBhcnNlUGFyZW50RnJvbVNvdXJjZSIsImhvLmNsYXNzbG9hZGVyLkNsYXNzTG9hZGVyLnJlc29sdmVVcmwiLCJoby5jbGFzc2xvYWRlci5DbGFzc0xvYWRlci5leGlzdHMiLCJoby5jbGFzc2xvYWRlci5jb25maWciLCJoby5jbGFzc2xvYWRlci5sb2FkIiwiaG8ud2F0Y2giLCJoby53YXRjaC53YXRjaCIsImhvLndhdGNoLldhdGNoZXIiLCJoby53YXRjaC5XYXRjaGVyLmNvbnN0cnVjdG9yIiwiaG8ud2F0Y2guV2F0Y2hlci53YXRjaCIsImhvLndhdGNoLldhdGNoZXIuY29weSIsImhvLmNvbXBvbmVudHMiLCJoby5jb21wb25lbnRzLnRlbXAiLCJoby5jb21wb25lbnRzLnRlbXAuc2V0IiwiaG8uY29tcG9uZW50cy50ZW1wLmdldCIsImhvLmNvbXBvbmVudHMudGVtcC5jYWxsIiwiaG8uY29tcG9uZW50cy5zdHlsZXIiLCJoby5jb21wb25lbnRzLnN0eWxlci5TdHlsZXIiLCJoby5jb21wb25lbnRzLnN0eWxlci5TdHlsZXIuY29uc3RydWN0b3IiLCJoby5jb21wb25lbnRzLnN0eWxlci5TdHlsZXIuYXBwbHlTdHlsZSIsImhvLmNvbXBvbmVudHMuc3R5bGVyLlN0eWxlci5hcHBseVN0eWxlQmxvY2siLCJoby5jb21wb25lbnRzLnN0eWxlci5TdHlsZXIuYXBwbHlSdWxlIiwiaG8uY29tcG9uZW50cy5zdHlsZXIuU3R5bGVyLnBhcnNlU3R5bGUiLCJoby5jb21wb25lbnRzLnJlbmRlcmVyIiwiaG8uY29tcG9uZW50cy5yZW5kZXJlci5Ob2RlIiwiaG8uY29tcG9uZW50cy5yZW5kZXJlci5Ob2RlLmNvbnN0cnVjdG9yIiwiaG8uY29tcG9uZW50cy5yZW5kZXJlci5SZW5kZXJlciIsImhvLmNvbXBvbmVudHMucmVuZGVyZXIuUmVuZGVyZXIuY29uc3RydWN0b3IiLCJoby5jb21wb25lbnRzLnJlbmRlcmVyLlJlbmRlcmVyLnJlbmRlciIsImhvLmNvbXBvbmVudHMucmVuZGVyZXIuUmVuZGVyZXIucGFyc2UiLCJoby5jb21wb25lbnRzLnJlbmRlcmVyLlJlbmRlcmVyLnJlbmRlclJlcGVhdCIsImhvLmNvbXBvbmVudHMucmVuZGVyZXIuUmVuZGVyZXIuZG9tVG9TdHJpbmciLCJoby5jb21wb25lbnRzLnJlbmRlcmVyLlJlbmRlcmVyLnJlcGwiLCJoby5jb21wb25lbnRzLnJlbmRlcmVyLlJlbmRlcmVyLmV2YWx1YXRlIiwiaG8uY29tcG9uZW50cy5yZW5kZXJlci5SZW5kZXJlci5ldmFsdWF0ZVZhbHVlIiwiaG8uY29tcG9uZW50cy5yZW5kZXJlci5SZW5kZXJlci5ldmFsdWF0ZVZhbHVlQW5kTW9kZWwiLCJoby5jb21wb25lbnRzLnJlbmRlcmVyLlJlbmRlcmVyLmV2YWx1YXRlRXhwcmVzc2lvbiIsImhvLmNvbXBvbmVudHMucmVuZGVyZXIuUmVuZGVyZXIuZXZhbHVhdGVGdW5jdGlvbiIsImhvLmNvbXBvbmVudHMucmVuZGVyZXIuUmVuZGVyZXIuY29weU5vZGUiLCJoby5jb21wb25lbnRzLnJlbmRlcmVyLlJlbmRlcmVyLmlzVm9pZCIsImhvLmNvbXBvbmVudHMuaHRtbHByb3ZpZGVyIiwiaG8uY29tcG9uZW50cy5odG1scHJvdmlkZXIuSHRtbFByb3ZpZGVyIiwiaG8uY29tcG9uZW50cy5odG1scHJvdmlkZXIuSHRtbFByb3ZpZGVyLmNvbnN0cnVjdG9yIiwiaG8uY29tcG9uZW50cy5odG1scHJvdmlkZXIuSHRtbFByb3ZpZGVyLnJlc29sdmUiLCJoby5jb21wb25lbnRzLmh0bWxwcm92aWRlci5IdG1sUHJvdmlkZXIuZ2V0SFRNTCIsImhvLmNvbXBvbmVudHMuQXR0cmlidXRlIiwiaG8uY29tcG9uZW50cy5BdHRyaWJ1dGUuY29uc3RydWN0b3IiLCJoby5jb21wb25lbnRzLkF0dHJpYnV0ZS5pbml0IiwiaG8uY29tcG9uZW50cy5BdHRyaWJ1dGUubmFtZSIsImhvLmNvbXBvbmVudHMuQXR0cmlidXRlLnVwZGF0ZSIsImhvLmNvbXBvbmVudHMuQXR0cmlidXRlLmdldE5hbWUiLCJoby5jb21wb25lbnRzLldhdGNoQXR0cmlidXRlIiwiaG8uY29tcG9uZW50cy5XYXRjaEF0dHJpYnV0ZS5jb25zdHJ1Y3RvciIsImhvLmNvbXBvbmVudHMuV2F0Y2hBdHRyaWJ1dGUud2F0Y2giLCJoby5jb21wb25lbnRzLldhdGNoQXR0cmlidXRlLmV2YWwiLCJoby5jb21wb25lbnRzLkNvbXBvbmVudCIsImhvLmNvbXBvbmVudHMuQ29tcG9uZW50LmNvbnN0cnVjdG9yIiwiaG8uY29tcG9uZW50cy5Db21wb25lbnQubmFtZSIsImhvLmNvbXBvbmVudHMuQ29tcG9uZW50LmdldE5hbWUiLCJoby5jb21wb25lbnRzLkNvbXBvbmVudC5nZXRQYXJlbnQiLCJoby5jb21wb25lbnRzLkNvbXBvbmVudC5faW5pdCIsImhvLmNvbXBvbmVudHMuQ29tcG9uZW50LmluaXQiLCJoby5jb21wb25lbnRzLkNvbXBvbmVudC51cGRhdGUiLCJoby5jb21wb25lbnRzLkNvbXBvbmVudC5yZW5kZXIiLCJoby5jb21wb25lbnRzLkNvbXBvbmVudC5pbml0U3R5bGUiLCJoby5jb21wb25lbnRzLkNvbXBvbmVudC5pbml0SFRNTCIsImhvLmNvbXBvbmVudHMuQ29tcG9uZW50LmluaXRQcm9wZXJ0aWVzIiwiaG8uY29tcG9uZW50cy5Db21wb25lbnQuaW5pdENoaWxkcmVuIiwiaG8uY29tcG9uZW50cy5Db21wb25lbnQuaW5pdEF0dHJpYnV0ZXMiLCJoby5jb21wb25lbnRzLkNvbXBvbmVudC5sb2FkUmVxdWlyZW1lbnRzIiwiaG8uY29tcG9uZW50cy5Db21wb25lbnQuZ2V0Q29tcG9uZW50IiwiaG8uY29tcG9uZW50cy5yZWdpc3RyeSIsImhvLmNvbXBvbmVudHMucmVnaXN0cnkuUmVnaXN0cnkiLCJoby5jb21wb25lbnRzLnJlZ2lzdHJ5LlJlZ2lzdHJ5LmNvbnN0cnVjdG9yIiwiaG8uY29tcG9uZW50cy5yZWdpc3RyeS5SZWdpc3RyeS5yZWdpc3RlciIsImhvLmNvbXBvbmVudHMucmVnaXN0cnkuUmVnaXN0cnkucnVuIiwiaG8uY29tcG9uZW50cy5yZWdpc3RyeS5SZWdpc3RyeS5pbml0Q29tcG9uZW50IiwiaG8uY29tcG9uZW50cy5yZWdpc3RyeS5SZWdpc3RyeS5pbml0RWxlbWVudCIsImhvLmNvbXBvbmVudHMucmVnaXN0cnkuUmVnaXN0cnkuaGFzQ29tcG9uZW50IiwiaG8uY29tcG9uZW50cy5yZWdpc3RyeS5SZWdpc3RyeS5oYXNBdHRyaWJ1dGUiLCJoby5jb21wb25lbnRzLnJlZ2lzdHJ5LlJlZ2lzdHJ5LmdldEF0dHJpYnV0ZSIsImhvLmNvbXBvbmVudHMucmVnaXN0cnkuUmVnaXN0cnkubG9hZENvbXBvbmVudCIsImhvLmNvbXBvbmVudHMucmVnaXN0cnkuUmVnaXN0cnkubG9hZEF0dHJpYnV0ZSIsImhvLmNvbXBvbmVudHMucnVuIiwiaG8uY29tcG9uZW50cy5yZWdpc3RlciIsImhvLmZsdXgiLCJoby5mbHV4LkNhbGxiYWNrSG9sZGVyIiwiaG8uZmx1eC5DYWxsYmFja0hvbGRlci5jb25zdHJ1Y3RvciIsImhvLmZsdXguQ2FsbGJhY2tIb2xkZXIucmVnaXN0ZXIiLCJoby5mbHV4LkNhbGxiYWNrSG9sZGVyLnVucmVnaXN0ZXIiLCJoby5mbHV4LmFjdGlvbnMiLCJoby5mbHV4LmFjdGlvbnMuQWN0aW9uIiwiaG8uZmx1eC5hY3Rpb25zLkFjdGlvbi5jb25zdHJ1Y3RvciIsImhvLmZsdXguYWN0aW9ucy5BY3Rpb24ubmFtZSIsImhvLmZsdXguYWN0aW9ucy5SZWdpc3RyeSIsImhvLmZsdXguYWN0aW9ucy5SZWdpc3RyeS5jb25zdHJ1Y3RvciIsImhvLmZsdXguYWN0aW9ucy5SZWdpc3RyeS5yZWdpc3RlciIsImhvLmZsdXguYWN0aW9ucy5SZWdpc3RyeS5nZXQiLCJoby5mbHV4LmFjdGlvbnMuUmVnaXN0cnkubG9hZEFjdGlvbiIsImhvLmZsdXgucmVnaXN0cnkiLCJoby5mbHV4LnJlZ2lzdHJ5LlJlZ2lzdHJ5IiwiaG8uZmx1eC5yZWdpc3RyeS5SZWdpc3RyeS5jb25zdHJ1Y3RvciIsImhvLmZsdXgucmVnaXN0cnkuUmVnaXN0cnkucmVnaXN0ZXIiLCJoby5mbHV4LnJlZ2lzdHJ5LlJlZ2lzdHJ5LmdldCIsImhvLmZsdXgucmVnaXN0cnkuUmVnaXN0cnkubG9hZFN0b3JlIiwiaG8uZmx1eC5zdGF0ZXByb3ZpZGVyIiwiaG8uZmx1eC5zdGF0ZXByb3ZpZGVyLlN0YXRlUHJvdmlkZXIiLCJoby5mbHV4LnN0YXRlcHJvdmlkZXIuU3RhdGVQcm92aWRlci5jb25zdHJ1Y3RvciIsImhvLmZsdXguc3RhdGVwcm92aWRlci5TdGF0ZVByb3ZpZGVyLnJlc29sdmUiLCJoby5mbHV4LnN0YXRlcHJvdmlkZXIuU3RhdGVQcm92aWRlci5nZXRTdGF0ZXMiLCJoby5mbHV4LlN0b3JlIiwiaG8uZmx1eC5TdG9yZS5jb25zdHJ1Y3RvciIsImhvLmZsdXguU3RvcmUuaW5pdCIsImhvLmZsdXguU3RvcmUubmFtZSIsImhvLmZsdXguU3RvcmUucmVnaXN0ZXIiLCJoby5mbHV4LlN0b3JlLm9uIiwiaG8uZmx1eC5TdG9yZS5oYW5kbGUiLCJoby5mbHV4LlN0b3JlLmNoYW5nZWQiLCJoby5mbHV4LlJvdXRlciIsImhvLmZsdXguUm91dGVyLmNvbnN0cnVjdG9yIiwiaG8uZmx1eC5Sb3V0ZXIuaW5pdCIsImhvLmZsdXguUm91dGVyLmdvIiwiaG8uZmx1eC5Sb3V0ZXIuaW5pdFN0YXRlcyIsImhvLmZsdXguUm91dGVyLmdldFN0YXRlRnJvbU5hbWUiLCJoby5mbHV4LlJvdXRlci5vblN0YXRlQ2hhbmdlUmVxdWVzdGVkIiwiaG8uZmx1eC5Sb3V0ZXIub25IYXNoQ2hhbmdlIiwiaG8uZmx1eC5Sb3V0ZXIuc2V0VXJsIiwiaG8uZmx1eC5Sb3V0ZXIucmVnZXhGcm9tVXJsIiwiaG8uZmx1eC5Sb3V0ZXIuYXJnc0Zyb21VcmwiLCJoby5mbHV4LlJvdXRlci5zdGF0ZUZyb21VcmwiLCJoby5mbHV4LlJvdXRlci51cmxGcm9tU3RhdGUiLCJoby5mbHV4LlJvdXRlci5lcXVhbHMiLCJoby5mbHV4LkRpc3BhdGNoZXIiLCJoby5mbHV4LkRpc3BhdGNoZXIuY29uc3RydWN0b3IiLCJoby5mbHV4LkRpc3BhdGNoZXIud2FpdEZvciIsImhvLmZsdXguRGlzcGF0Y2hlci5kaXNwYXRjaCIsImhvLmZsdXguRGlzcGF0Y2hlci5pbnZva2VDYWxsYmFjayIsImhvLmZsdXguRGlzcGF0Y2hlci5zdGFydERpc3BhdGNoaW5nIiwiaG8uZmx1eC5EaXNwYXRjaGVyLnN0b3BEaXNwYXRjaGluZyIsImhvLmZsdXgucnVuIl0sIm1hcHBpbmdzIjoiQUFBQSxJQUFPLEVBQUUsQ0FnTFI7QUFoTEQsV0FBTyxFQUFFO0lBQUNBLElBQUFBLE9BQU9BLENBZ0xoQkE7SUFoTFNBLFdBQUFBLE9BQU9BLEVBQUNBLENBQUNBO1FBRWZDO1lBRUlDLGlCQUFZQSxJQUEyREE7Z0JBYS9EQyxTQUFJQSxHQUFRQSxTQUFTQSxDQUFDQTtnQkFDdEJBLGNBQVNBLEdBQW9CQSxTQUFTQSxD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Q0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7NEJBQ2xCQSxHQUFHQSxHQUFHQSxJQUFJQSxDQUFDQSxLQUFLQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTs0QkFDakNBLEdBQUdBLEdBQUdBLEdBQUdBLENBQUNBLE1BQU1BLENBQUNBLENBQUNBLEVBQUVBLEdBQUdBLENBQUNBLE1BQU1BLEdBQUNBLENBQUNBLENBQUNBLENBQUNBOzRCQUNsQ0EsSUFBSUEsR0FBR0EsTUFBTUEsQ0FBQ0E7NEJBQ0NBLE1BQU1BLEdBQUdBLEtBQUtBLENBQUNBOzRCQUM5QkEsV0FBV0EsR0FBR0EsSUFBSUEsQ0FBQ0E7NEJBQ25CQSxNQUFNQSxHQUFHQSxLQUFLQSxDQUFDQTt3QkFDaEJBLENBQUNBO3dCQUFDQSxJQUFJQSxDQUFDQSxDQUFDQTs0QkFDUEEsR0FBR0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsSUFBSUEsRUFBRUEsQ0FBQ0E7NEJBQ2xCQSxJQUFJQSxHQUFHQSxDQUFDQSxHQUFHQSxHQUFDQSxHQUFHQSxDQUFDQSxDQUFDQSxLQUFLQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTs0QkFDdkNBLE9BQU9BLEdBQUdBLEdBQUdBLENBQUNBLENBQUNBLENBQUNBLEtBQUtBLEdBQUdBLENBQUNBOzRCQUNWQSxNQUFNQSxHQUFHQSxJQUFJQSxDQUFDQSxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQTs0QkFDMUNBLFdBQVdBLEdBQUdBLE1BQU1BLElBQUlBLEdBQUdBLENBQUNBLEdBQUdBLENBQUNBLE1BQU1BLEdBQUNBLENBQUNBLENBQUNBLEtBQUtBLEdBQUdBLENBQUNBOzRCQUNsREEsTUFBTUEsR0FBR0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsS0FBS0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsTUFBTUEsQ0FBQ0EsQ0FBQ0E7NEJBRXBDQSxFQUFFQSxDQUFBQSxDQUFDQSxXQUFXQSxJQUFJQSxFQUFFQSxDQUFDQSxVQUFVQSxDQUFDQSxRQUFRQSxDQUFDQSxRQUFRQSxDQUFDQSxZQUFZQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtnQ0FDdEVBLFdBQVdBLEdBQUdBLEtBQUtBLENBQUNBO2dDQUNwQkEsR0FBR0EsR0FBR0EsR0FBR0EsQ0FBQ0EsTUFBTUEsQ0FBQ0EsQ0FBQ0EsRUFBRUEsR0FBR0EsQ0FBQ0EsTUFBTUEsR0FBQ0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsR0FBR0EsQ0FBQ0E7Z0NBRXhDQSxPQUFPQSxHQUFHQSxJQUFJQSxDQUFDQTs0QkFDaEJBLENBQUNBO3dCQUNGQSxDQUFDQTt3QkFFREEsSUFBSUEsR0FBR0EsSUFBSUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsTUFBTUEsR0FBR0EsQ0FBQ0EsSUFBSUEsS0FBS0EsTUFBTUEsR0FBR0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsQ0FBRUEsQ0FBQ0E7d0JBRTNEQSxFQUFFQSxDQUFBQSxDQUFDQSxPQUFPQSxDQUFDQSxDQUFDQSxDQUFDQTs0QkFDWkEsS0FBS0EsQ0FBQ0E7d0JBQ1BBLENBQUNBO3dCQUFDQSxJQUFJQSxDQUFDQSxDQUFDQTs0QkFDUEEsSUFBSUEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsRUFBQ0EsTUFBTUEsRUFBRUEsSUFBSUEsRUFBRUEsSUFBSUEsRUFBRUEsR0FBR0EsRUFBRUEsSUFBSUEsRUFBRUEsSUFBSUEsRUFBRUEsTUFBTUEsRUFBRUEsTUFBTUEsRUFBRUEsV0FBV0EsRUFBRUEsV0FBV0EsRUFBRUEsTUFBTUEsRUFBRUEsTUFBTUEsRUFBRUEsUUFBUUEsRUFBRUEsRUFBRUEsRUFBQ0EsQ0FBQ0EsQ0FBQ0E7NEJBRWxJQSxFQUFFQSxDQUFBQSxDQUFDQSxDQUFDQSxPQUFPQSxJQUFJQSxDQUFDQSxXQUFXQSxDQUFDQSxDQUFDQSxDQUFDQTtnQ0FDN0JBLElBQUlBLE1BQU1BLEdBQUdBLElBQUlBLENBQUNBLEtBQUtBLENBQUNBLElBQUlBLEVBQUVBLElBQUlBLENBQUNBLFFBQVFBLENBQUNBLElBQUlBLENBQUNBLFFBQVFBLENBQUNBLE1BQU1BLEdBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO2dDQUNyRUEsSUFBSUEsR0FBR0EsTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0E7Z0NBQ25CQSxJQUFJQSxDQUFDQSxRQUFRQSxDQUFDQSxHQUFHQSxFQUFFQSxDQUFDQTtnQ0FDcEJBLElBQUlBLENBQUNBLFFBQVFBLENBQUNBLElBQUlBLENBQUNBLE1BQU1BLENBQUNBLElBQUlBLENBQUNBLENBQUNBOzRCQUNqQ0EsQ0FBQ0E7d0JBQ0ZBLENBQUNBO3dCQUVEQSxDQUFDQSxHQUFHQSxJQUFJQSxDQUFDQSxLQUFLQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQTtvQkFDNUJBLENBQUNBO29CQUVEQSxNQUFNQSxDQUFDQSxFQUFDQSxJQUFJQSxFQUFFQSxJQUFJQSxFQUFFQSxJQUFJQSxFQUFFQSxJQUFJQSxFQUFDQSxDQUFDQTtnQkFDakNBLENBQUNBO2dCQUVPSCwrQkFBWUEsR0FBcEJBLFVBQXFCQSxJQUFJQSxFQUFFQSxNQUFNQTtvQkFDaENJLE1BQU1BLEdBQUdBLEVBQUVBLENBQUNBLE1BQU1BLENBQUNBLE1BQU1BLENBQUNBLENBQUNBO29CQUUzQkEsR0FBR0EsQ0FBQUEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsR0FBR0EsSUFBSUEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsTUFBTUEsRUFBRUEsQ0FBQ0EsRUFBRUEsRUFBRUEsQ0FBQ0E7d0JBQzlDQSxJQUFJQSxLQUFLQSxHQUFHQSxJQUFJQSxDQUFDQSxRQUFRQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTt3QkFDN0JBLEVBQUVBLENBQUFBLENBQUNBLEtBQUtBLENBQUNBLE1BQU1BLENBQUNBLENBQUNBLENBQUNBOzRCQUNqQkEsSUFBSUEsS0FBS0EsR0FBR0EseUNBQXlDQSxDQUFDQTs0QkFDdERBLElBQUlBLENBQUNBLEdBQUdBLEtBQUtBLENBQUNBLElBQUlBLENBQUNBLEtBQUtBLENBQUNBLEtBQUtBLENBQUNBLENBQUNBLEtBQUtBLENBQUNBLENBQUNBLENBQUNBLENBQUNBOzRCQUN6Q0EsSUFBSUEsSUFBSUEsR0FBR0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7NEJBQ2hCQSxJQUFJQSxTQUFTQSxDQUFDQTs0QkFDZEEsRUFBRUEsQ0FBQUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7Z0NBQzNCQSxJQUFJQSxLQUFLQSxHQUFHQSxJQUFJQSxDQUFDQSxLQUFLQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQTtnQ0FDNUJBLElBQUlBLEdBQUdBLEtBQUtBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLElBQUlBLEVBQUVBLENBQUNBO2dDQUN2QkEsU0FBU0EsR0FBR0EsS0FBS0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsSUFBSUEsRUFBRUEsQ0FBQ0E7NEJBQzdCQSxDQUFDQTs0QkFFREEsSUFBSUEsS0FBS0EsR0FBR0EsSUFBSUEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsTUFBTUEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7NEJBRXhDQSxJQUFJQSxNQUFNQSxHQUFHQSxFQUFFQSxDQUFDQTs0QkFDaEJBLEtBQUtBLENBQUNBLE9BQU9BLENBQUNBLFVBQVNBLEtBQUtBLEVBQUVBLEtBQUtBO2dDQUNsQyxJQUFJLE1BQU0sR0FBRyxFQUFFLENBQUM7Z0NBQ2hCLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxLQUFLLENBQUM7Z0NBQ3JCLE1BQU0sQ0FBQyxTQUFTLENBQUMsR0FBRyxLQUFLLENBQUM7Z0NBRTFCLElBQUksT0FBTyxHQUFHLEVBQUUsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUM7Z0NBQ2hDLE9B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QUlBLENBQUNBLEVBQUVBLENBQUFBLENBQUNBLE9BQU9BLE1BQU1BLEtBQUtBLFVBQVVBLENBQUNBO29CQUNwQ0EsT0FBT0EsQ0FBQ0EsSUFBSUEsTUFBTUEsRUFBRUEsQ0FBQ0EsQ0FBQUE7Z0JBQ3RCQSxJQUFJQSxDQUFDQSxFQUFFQSxDQUFBQSxDQUFDQSxPQUFPQSxNQUFNQSxLQUFLQSxRQUFRQSxDQUFDQSxDQUFDQSxDQUFDQTtvQkFDcENBLFdBQU1BLENBQUNBLFNBQVNBLENBQUNBLE1BQU1BLENBQUNBO3lCQUN2QkEsSUFBSUEsQ0FBQ0EsVUFBQUEsQ0FBQ0EsSUFBSUEsT0FBQUEsT0FBT0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsRUFBVkEsQ0FBVUEsQ0FBQ0EsQ0FBQUE7Z0JBQ3ZCQSxDQUFDQTtZQUNGQSxDQUFDQSxDQUFDQTtpQkFDREEsSUFBSUEsQ0FBQ0EsVUFBQUEsQ0FBQ0E7Z0JBQ05BLE1BQU1BLENBQUNBLFdBQU1BLENBQUNBLFFBQVFBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLElBQUlBLEVBQUVBLENBQUNBO1lBQ2xDQSxDQUFDQSxDQUFDQSxDQUFDQTtRQUVKQSxDQUFDQTtRQWpCZXRELFFBQUdBLE1BaUJsQkEsQ0FBQUE7SUFDRkEsQ0FBQ0EsRUE5QlN6SCxJQUFJQSxHQUFKQSxPQUFJQSxLQUFKQSxPQUFJQSxRQThCYkE7QUFBREEsQ0FBQ0EsRUE5Qk0sRUFBRSxLQUFGLEVBQUUsUUE4QlIiLCJmaWxlIjoiaG8tYWxsLmpzIiwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlIGhvLnByb21pc2Uge1xyXG5cclxuICAgIGV4cG9ydCBjbGFzcyBQcm9taXNlPFQsIEU+IHtcclxuXHJcbiAgICAgICAgY29uc3RydWN0b3IoZnVuYz86IChyZXNvbHZlOihhcmc6VCk9PnZvaWQsIHJlamVjdDooYXJnOkUpPT52b2lkKSA9PiBhbnkpIHtcclxuICAgICAgICAgICAgaWYgKHR5cGVvZiBmdW5jID09PSAnZnVuY3Rpb24nKVxyXG4gICAgICAgICAgICAgICAgZnVuYy5jYWxsKFxyXG4gICAgICAgICAgICAgICAgICAgIGFyZ3VtZW50cy5jYWxsZWUsXHJcbiAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24oYXJnOiBUKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5yZXNvbHZlKGFyZylcclxuICAgICAgICAgICAgICAgICAgICB9LmJpbmQodGhpcyksXHJcbiAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24oYXJnOkUpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnJlamVjdChhcmcpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0uYmluZCh0aGlzKVxyXG4gICAgICAgICAgICAgICAgKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByaXZhdGUgZGF0YTogVHxFID0gdW5kZWZpbmVkO1xyXG4gICAgICAgIHByaXZhdGUgb25SZXNvbHZlOiAoYXJnMTpUKSA9PiBhbnkgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgcHJpdmF0ZSBvblJlamVjdDogKGFyZzE6RSkgPT4gYW55ID0gdW5kZWZpbmVkO1xyXG5cclxuICAgICAgICBwdWJsaWMgcmVzb2x2ZWQ6IGJvb2xlYW4gPSBmYWxzZTtcclxuICAgICAgICBwdWJsaWMgcmVqZWN0ZWQ6IGJvb2xlYW4gPSBmYWxzZTtcclxuICAgICAgICBwdWJsaWMgZG9uZTogYm9vbGVhbiA9IGZhbHNlO1xyXG5cclxuICAgICAgICBwcml2YXRlIHJldDogUHJvbWlzZTxULCBFPiA9IHVuZGVmaW5lZDtcclxuXHJcbiAgICAgICAgcHJpdmF0ZSBzZXQoZGF0YT86IFR8RSk6IHZvaWQge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5kb25lKVxyXG4gICAgICAgICAgICAgICAgdGhyb3cgXCJQcm9taXNlIGlzIGFscmVhZHkgcmVzb2x2ZWQgLyByZWplY3RlZFwiO1xyXG4gICAgICAgICAgICB0aGlzLmRhdGEgPSBkYXRhO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHJlc29sdmUoZGF0YT86IFQpOiB2b2lkIHtcclxuICAgICAgICAgICAgdGhpcy5zZXQoZGF0YSk7XHJcbiAgICAgICAgICAgIHRoaXMucmVzb2x2ZWQgPSB0aGlzLmRvbmUgPSB0cnVlO1xyXG4gICAgICAgICAgICBpZiAodHlwZW9mIHRoaXMub25SZXNvbHZlID09PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9yZXNvbHZlKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByaXZhdGUgX3Jlc29sdmUoKTogdm9pZCB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnJldCA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnJldCA9IG5ldyBQcm9taXNlPFQsRT4oKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdmFyIHY6IGFueSA9IHRoaXMub25SZXNvbHZlKDxUPnRoaXMuZGF0YSk7XHJcblxyXG4gICAgICAgICAgICBpZiAodiAmJiB2IGluc3RhbmNlb2YgUHJvbWlzZSkge1xyXG4gICAgICAgICAgICAgICAgdi50aGVuKHRoaXMucmV0LnJlc29sdmUuYmluZCh0aGlzLnJldCksIHRoaXMucmV0LnJlamVjdC5iaW5kKHRoaXMucmV0KSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnJldC5yZXNvbHZlKHYpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgcmVqZWN0KGRhdGE/OiBFKTogdm9pZCB7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0KGRhdGEpO1xyXG4gICAgICAgICAgICB0aGlzLnJlamVjdGVkID0gdGhpcy5kb25lID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgICAgIGlmICh0eXBlb2YgdGhpcy5vblJlamVjdCA9PT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5vblJlamVjdCg8RT50aGlzLmRhdGEpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAodGhpcy5yZXQpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMucmV0LnJlamVjdCg8RT50aGlzLmRhdGEpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIF9yZWplY3QoKTogdm9pZCB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnJldCA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnJldCA9IG5ldyBQcm9taXNlPFQsRT4oKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYodHlwZW9mIHRoaXMub25SZWplY3QgPT09ICdmdW5jdGlvbicpXHJcbiAgICAgICAgICAgICAgICB0aGlzLm9uUmVqZWN0KDxFPnRoaXMuZGF0YSk7XHJcbiAgICAgICAgICAgIHRoaXMucmV0LnJlamVjdCg8RT50aGlzLmRhdGEpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHRoZW4ocmVzOiAoYXJnMTpUKT0+YW55LCByZWo/OiAoYXJnMTpFKT0+YW55KTogUHJvbWlzZTxhbnksYW55PiB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnJldCA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnJldCA9IG5ldyBQcm9taXNlPFQsRT4oKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKHJlcyAmJiB0eXBlb2YgcmVzID09PSAnZnVuY3Rpb24nKVxyXG4gICAgICAgICAgICAgICAgdGhpcy5vblJlc29sdmUgPSByZXM7XHJcblxyXG4gICAgICAgICAgICBpZiAocmVqICYmIHR5cGVvZiByZWogPT09ICdmdW5jdGlvbicpXHJcbiAgICAgICAgICAgICAgICB0aGlzLm9uUmVqZWN0ID0gcmVqO1xyXG5cclxuICAgICAgICAgICAgaWYgKHRoaXMucmVzb2x2ZWQpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3Jlc29sdmUoKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKHRoaXMucmVqZWN0ZWQpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3JlamVjdCgpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5yZXQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgY2F0Y2goY2I6IChhcmcxOkUpPT5hbnkpOiB2b2lkIHtcclxuICAgICAgICAgICAgdGhpcy5vblJlamVjdCA9IGNiO1xyXG5cclxuICAgICAgICAgICAgaWYgKHRoaXMucmVqZWN0ZWQpXHJcbiAgICAgICAgICAgICAgICB0aGlzLl9yZWplY3QoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHN0YXRpYyBhbGwoYXJyOiBBcnJheTxQcm9taXNlPGFueSwgYW55Pj4pOiBQcm9taXNlPGFueSwgYW55PiB7XHJcbiAgICAgICAgICAgIHZhciBwID0gbmV3IFByb21pc2UoKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBkYXRhID0gW107XHJcblxyXG4gICAgICAgICAgICBpZiAoYXJyLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgICAgICAgICAgcC5yZXNvbHZlKCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBhcnIuZm9yRWFjaCgocHJvbSwgaW5kZXgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBwcm9tXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKGQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHAuZG9uZSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFbaW5kZXhdID0gZDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGFsbFJlc29sdmVkID0gYXJyLnJlZHVjZShmdW5jdGlvbihzdGF0ZSwgcDEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBzdGF0ZSAmJiBwMS5yZXNvbHZlZDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSwgdHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChhbGxSZXNvbHZlZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcC5yZXNvbHZlKGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5jYXRjaChmdW5jdGlvbihlcnIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcC5yZWplY3QoZXJyKTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gcDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHN0YXRpYyBjaGFpbihhcnI6IEFycmF5PFByb21pc2U8YW55LCBhbnk+Pik6IFByb21pc2U8YW55LCBhbnk+IHtcclxuICAgICAgICAgICAgdmFyIHA6IFByb21pc2U8YW55LCBhbnk+ID0gbmV3IFByb21pc2UoKTtcclxuICAgICAgICAgICAgdmFyIGRhdGE6IEFycmF5PGFueT4gPSBbXTtcclxuXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIG5leHQoKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAocC5kb25lKVxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgbjogUHJvbWlzZTxhbnksIGFueT4gPSBhcnIubGVuZ3RoID8gYXJyLnNoaWZ0KCkgOiBwO1xyXG4gICAgICAgICAgICAgICAgbi50aGVuKFxyXG4gICAgICAgICAgICAgICAgICAgIChyZXN1bHQpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YS5wdXNoKHJlc3VsdCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5leHQoKTtcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIChlcnIpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcC5yZWplY3QoZXJyKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgbmV4dCgpO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHA7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzdGF0aWMgY3JlYXRlKG9iajogYW55KTogUHJvbWlzZTxhbnksIGFueT4ge1xyXG4gICAgICAgICAgICBpZiAob2JqIGluc3RhbmNlb2YgUHJvbWlzZSlcclxuICAgICAgICAgICAgICAgIHJldHVybiBvYmo7XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdmFyIHAgPSBuZXcgUHJvbWlzZSgpO1xyXG4gICAgICAgICAgICAgICAgcC5yZXNvbHZlKG9iaik7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbn1cclxuIiwibW9kdWxlIGhvLmNsYXNzbG9hZGVyLnV0aWwge1xuXG5cdGV4cG9ydCBmdW5jdGlvbiBnZXQocGF0aDogc3RyaW5nLCBvYmo6YW55ID0gd2luZG93KTogYW55IHtcblx0XHRwYXRoLnNwbGl0KCcuJykubWFwKHBhcnQgPT4ge1xuXHRcdFx0b2JqID0gb2JqW3BhcnRdO1xuXHRcdH0pXG5cdFx0cmV0dXJuIG9iajtcblx0fVxufVxuIiwibW9kdWxlIGhvLmNsYXNzbG9hZGVyLnV0aWwge1xuXHRleHBvcnQgZnVuY3Rpb24gZXhwb3NlKG5hbWU6c3RyaW5nLCBvYmo6YW55LCBlcnJvciA9IGZhbHNlKSB7XG5cdFx0bGV0IHBhdGggPSBuYW1lLnNwbGl0KCcuJyk7XG5cdFx0bmFtZSA9IHBhdGgucG9wKCk7XG5cblx0XHRsZXQgZ2xvYmFsID0gd2luZG93O1xuXG5cdFx0cGF0aC5tYXAocGFydCA9PiB7XG5cdFx0XHRnbG9iYWxbcGFydF0gPSBnbG9iYWxbcGFydF0gfHwge307XG5cdFx0XHRnbG9iYWwgPSBnbG9iYWxbcGFydF07XG5cdFx0fSlcblxuXHRcdGlmKCEhZ2xvYmFsW25hbWVdKSB7XG5cdFx0XHRsZXQgbXNnID0gXCJHbG9iYWwgb2JqZWN0IFwiICsgcGF0aC5qb2luKCcuJykgKyBcIi5cIiArIG5hbWUgKyBcIiBhbHJlYWR5IGV4aXN0c1wiO1xuXHRcdFx0aWYoZXJyb3IpXG5cdFx0XHRcdHRocm93IG1zZztcblx0XHRcdGVsc2Vcblx0XHRcdFx0Y29uc29sZS5pbmZvKG1zZyk7XG5cblx0XHR9XG5cblx0XHRnbG9iYWxbbmFtZV0gPSBvYmo7XG5cdH1cbn1cbiIsIm1vZHVsZSBoby5jbGFzc2xvYWRlci54aHIge1xuXG5cdGV4cG9ydCBmdW5jdGlvbiBnZXQodXJsOiBzdHJpbmcpOiBoby5wcm9taXNlLlByb21pc2U8c3RyaW5nLCBzdHJpbmc+IHtcblx0XHRyZXR1cm4gbmV3IGhvLnByb21pc2UuUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG5cbiAgICAgICAgICAgICAgICBsZXQgeG1saHR0cCA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICAgICAgICAgICAgICAgIHhtbGh0dHAub25yZWFkeXN0YXRlY2hhbmdlID0gKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZih4bWxodHRwLnJlYWR5U3RhdGUgPT0gNCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHJlc3AgPSB4bWxodHRwLnJlc3BvbnNlVGV4dDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKHhtbGh0dHAuc3RhdHVzID09IDIwMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUocmVzcCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZWplY3QocmVzcCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgeG1saHR0cC5vcGVuKCdHRVQnLCB1cmwpO1xuICAgICAgICAgICAgICAgIHhtbGh0dHAuc2VuZCgpO1xuICAgICAgICAgICAgfSk7XG5cdH1cbn1cbiIsIm1vZHVsZSBoby5jbGFzc2xvYWRlciB7XG5cblx0ZXhwb3J0IHR5cGUgY2xhenogPSBGdW5jdGlvbjtcblx0ZXhwb3J0IHR5cGUgUHJvbWlzZU9mQ2xhc3NlcyA9IGhvLnByb21pc2UuUHJvbWlzZTxjbGF6eltdLCBhbnk+O1xuXG59XG4iLCJtb2R1bGUgaG8uY2xhc3Nsb2FkZXIge1xuXG5cdGV4cG9ydCBpbnRlcmZhY2UgSUxvYWRBcmd1bWVudHMge1xuXHRcdG5hbWU/OiBzdHJpbmc7XG5cdFx0dXJsPzogc3RyaW5nO1xuXHRcdHBhcmVudD86IGJvb2xlYW47XG5cdFx0ZXhwb3NlPzogYm9vbGVhbjtcblx0XHRzdXBlcj86IEFycmF5PHN0cmluZz47XG5cdH1cblxuXHRleHBvcnQgY2xhc3MgTG9hZEFyZ3VtZW50cyBpbXBsZW1lbnRzIElMb2FkQXJndW1lbnRzIHtcblxuXHRcdG5hbWU6IHN0cmluZztcblx0XHR1cmw6IHN0cmluZztcblx0XHRwYXJlbnQ6IGJvb2xlYW47XG5cdFx0ZXhwb3NlOiBib29sZWFuO1xuXHRcdHN1cGVyOiBBcnJheTxzdHJpbmc+O1xuXG5cdFx0Y29uc3RydWN0b3IoYXJnOiBJTG9hZEFyZ3VtZW50cywgcmVzb2x2ZVVybDogKG5hbWU6c3RyaW5nKT0+c3RyaW5nKSB7XG5cdFx0XHR0aGlzLm5hbWUgPSBhcmcubmFtZTtcblx0XHRcdHRoaXMudXJsID0gYXJnLnVybCB8fCByZXNvbHZlVXJsKGFyZy5uYW1lKTtcblx0XHRcdHRoaXMucGFyZW50ID0gYXJnLnBhcmVudCB8fCB0cnVlO1xuXHRcdFx0dGhpcy5leHBvc2UgPSBhcmcuZXhwb3NlIHx8IHRydWU7XG5cdFx0XHR0aGlzLnN1cGVyID0gYXJnLnN1cGVyO1xuXHRcdH1cblxuXHR9XG5cbn1cbiIsIm1vZHVsZSBoby5jbGFzc2xvYWRlciB7XG5cblx0ZXhwb3J0IGVudW0gV2FybkxldmVsIHtcblx0XHRJTkZPLFxuXHRcdEVSUk9SXG5cdH1cblxuXHRleHBvcnQgaW50ZXJmYWNlIElMb2FkZXJDb25maWcge1xuXHRcdGxvYWRUeXBlPzogTG9hZFR5cGU7XG5cdFx0dXJsVGVtcGxhdGU/OiBzdHJpbmc7XG5cdFx0dXNlRGlyPzogYm9vbGVhbjtcblx0XHR1c2VNaW4/OiBib29sZWFuO1xuXHRcdC8vZXhpc3RzPzogKG5hbWU6IHN0cmluZyk9PmJvb2xlYW47XG5cdFx0Y2FjaGU/OiBib29sZWFuO1xuXHRcdHdhcm5MZXZlbD86IFdhcm5MZXZlbFxuXHR9XG5cblx0ZXhwb3J0IGNsYXNzIExvYWRlckNvbmZpZyBpbXBsZW1lbnRzIElMb2FkZXJDb25maWcge1xuXG5cdFx0bG9hZFR5cGU6IExvYWRUeXBlO1xuXHRcdHVybFRlbXBsYXRlOiBzdHJpbmc7XG5cdFx0dXNlRGlyOiBib29sZWFuO1xuXHRcdHVzZU1pbjogYm9vbGVhbjtcblx0XHQvL2V4aXN0czogKG5hbWU6IHN0cmluZyk9PmJvb2xlYW47XG5cdFx0Y2FjaGU6IGJvb2xlYW47XG5cdFx0d2FybkxldmVsOiBXYXJuTGV2ZWw7XG5cblx0XHRjb25zdHJ1Y3RvcihjOiBJTG9hZGVyQ29uZmlnID0gPElMb2FkZXJDb25maWc+e30pIHtcblx0XHRcdHRoaXMubG9hZFR5cGUgPSBjLmxvYWRUeXBlIHx8IExvYWRUeXBlLkVWQUw7XG5cdFx0XHR0aGlzLnVybFRlbXBsYXRlID0gYy51cmxUZW1wbGF0ZSB8fCBcIiR7bmFtZX0uanNcIlxuXHRcdFx0dGhpcy51c2VEaXIgPSB0eXBlb2YgYy51c2VEaXIgPT09ICdib29sZWFuJyA/IGMudXNlRGlyIDogdHJ1ZTtcblx0XHRcdHRoaXMudXNlTWluID0gdHlwZW9mIGMudXNlTWluID09PSAnYm9vbGVhbicgPyBjLnVzZU1pbiA6IGZhbHNlO1xuXHRcdFx0Ly90aGlzLmV4aXN0cyA9IGMuZXhpc3RzIHx8IHRoaXMuZXhpc3RzLmJpbmQodGhpcyk7XG5cdFx0XHR0aGlzLmNhY2hlID0gdHlwZW9mIGMuY2FjaGUgPT09ICdib29sZWFuJyA/IGMuY2FjaGUgOiB0cnVlO1xuXHRcdFx0dGhpcy53YXJuTGV2ZWwgPSBjLndhcm5MZXZlbCB8fCBXYXJuTGV2ZWwuSU5GTztcblx0XHR9XG5cblx0fVxuXG59XG4iLCJtb2R1bGUgaG8uY2xhc3Nsb2FkZXIge1xuXG5cdGV4cG9ydCBlbnVtIExvYWRUeXBlIHtcblx0XHRTQ1JJUFQsXG5cdFx0RlVOQ1RJT04sXG5cdFx0RVZBTFxuXHR9XG5cdFxufVxuIiwibW9kdWxlIGhvLmNsYXNzbG9hZGVyIHtcblxuXHRleHBvcnQgbGV0IG1hcHBpbmc6IHtba2V5OnN0cmluZ106IHN0cmluZ30gPSB7fVxuXG5cdGV4cG9ydCBjbGFzcyBDbGFzc0xvYWRlciB7XG5cblx0XHRwcml2YXRlIGNvbmY6IElMb2FkZXJDb25maWcgPSA8SUxvYWRlckNvbmZpZz57fTtcblx0XHRwcml2YXRlIGNhY2hlOiB7W2tleTpzdHJpbmddOiBGdW5jdGlvbn0gPSB7fVxuXG5cdFx0Y29uc3RydWN0b3IoYz86IElMb2FkZXJDb25maWcpIHtcblx0XHRcdHRoaXMuY29uZiA9IG5ldyBMb2FkZXJDb25maWcoYyk7XG5cdFx0fVxuXG5cdFx0Y29uZmlnKGM6IElMb2FkZXJDb25maWcpOiB2b2lkIHtcblx0XHRcdHRoaXMuY29uZiA9IG5ldyBMb2FkZXJDb25maWcoYyk7XG5cdFx0fVxuXG5cdFx0bG9hZChhcmc6IElMb2FkQXJndW1lbnRzKSB7XG5cdFx0XHRhcmcgPSBuZXcgTG9hZEFyZ3VtZW50cyhhcmcsIHRoaXMucmVzb2x2ZVVybC5iaW5kKHRoaXMpKTtcblxuXHRcdFx0c3dpdGNoKHRoaXMuY29uZi5sb2FkVHlwZSkge1xuXHRcdFx0XHRjYXNlIExvYWRUeXBlLlNDUklQVDpcblx0XHRcdFx0XHRyZXR1cm4gdGhpcy5sb2FkX3NjcmlwdChhcmcpO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlIExvYWRUeXBlLkZVTkNUSU9OOlxuXHRcdFx0XHRcdHJldHVybiB0aGlzLmxvYWRfZnVuY3Rpb24oYXJnKTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSBMb2FkVHlwZS5FVkFMOlxuXHRcdFx0XHRcdHJldHVybiB0aGlzLmxvYWRfZXZhbChhcmcpO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHByb3RlY3RlZCBsb2FkX3NjcmlwdChhcmc6IElMb2FkQXJndW1lbnRzKTogUHJvbWlzZU9mQ2xhc3NlcyB7XG5cdFx0XHRsZXQgc2VsZiA9IHRoaXM7XG5cdFx0XHRsZXQgcGFyZW50cyA9IFtdO1xuXHRcdFx0bGV0IHAgPSBuZXcgaG8ucHJvbWlzZS5Qcm9taXNlPGNsYXp6W10sIGFueT4oKTtcblxuXHRcdFx0aWYodGhpcy5jb25mLmNhY2hlICYmICEhdGhpcy5jYWNoZVthcmcubmFtZV0pXG5cdFx0XHRcdHJldHVybiBoby5wcm9taXNlLlByb21pc2UuY3JlYXRlKFt0aGlzLmNhY2hlW2FyZy5uYW1lXV0pO1xuXG5cdFx0XHRpZighIWFyZy5wYXJlbnQpIHtcblx0XHRcdFx0dGhpcy5nZXRQYXJlbnROYW1lKGFyZy51cmwpXG5cdFx0XHRcdC50aGVuKHBhcmVudE5hbWUgPT4ge1xuXHRcdFx0XHRcdC8vaWYoYXJnLnN1cGVyID09PSBwYXJlbnROYW1lKVxuXHRcdFx0XHRcdGlmKGFyZy5zdXBlci5pbmRleE9mKHBhcmVudE5hbWUpICE9PSAtMSlcblx0XHRcdFx0XHRcdHJldHVybiBbXTtcblx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRyZXR1cm4gc2VsZi5sb2FkKHtuYW1lOiBwYXJlbnROYW1lLCBwYXJlbnQ6IHRydWUsIGV4cG9zZTogYXJnLmV4cG9zZSwgc3VwZXI6IGFyZy5zdXBlcn0pXG5cdFx0XHRcdH0pXG5cdFx0XHRcdC50aGVuKHAgPT4ge1xuXHRcdFx0XHRcdHBhcmVudHMgPSBwXG5cdFx0XHRcdFx0cmV0dXJuIGxvYWRfaW50ZXJuYWwoKTtcblx0XHRcdFx0fSlcblx0XHRcdFx0LnRoZW4oY2xhenogPT4ge1xuXHRcdFx0XHRcdGlmKHNlbGYuY29uZi5jYWNoZSlcblx0XHRcdFx0XHRcdHNlbGYuY2FjaGVbYXJnLm5hbWVdID0gY2xheno7XG5cdFx0XHRcdFx0cGFyZW50cyA9IHBhcmVudHMuY29uY2F0KGNsYXp6KTtcblx0XHRcdFx0XHRwLnJlc29sdmUocGFyZW50cyk7XG5cdFx0XHRcdH0pXG5cdFx0XHR9XG5cdFx0XHRlbHNlIHtcblx0XHRcdFx0bG9hZF9pbnRlcm5hbCgpXG5cdFx0XHRcdC50aGVuKGNsYXp6ID0+IHtcblx0XHRcdFx0XHRwLnJlc29sdmUoY2xhenopO1xuXHRcdFx0XHR9KVxuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gcDtcblxuXG5cdFx0XHRmdW5jdGlvbiBsb2FkX2ludGVybmFsKCk6IFByb21pc2VPZkNsYXNzZXMge1xuXHRcdFx0XHRyZXR1cm4gbmV3IGhvLnByb21pc2UuUHJvbWlzZTxjbGF6eltdLCBhbnk+KChyZXNvbHZlLCByZWplY3QpID0+IHtcblx0XHRcdFx0XHRsZXQgc3JjID0gYXJnLnVybDtcblx0XHRcdFx0XHRsZXQgc2NyaXB0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc2NyaXB0Jyk7XG5cdFx0XHRcdFx0c2NyaXB0Lm9ubG9hZCA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdFx0aWYodHlwZW9mIHV0aWwuZ2V0KGFyZy5uYW1lKSA9PT0gJ2Z1bmN0aW9uJylcblx0XHRcdFx0XHRcdFx0cmVzb2x2ZShbdXRpbC5nZXQoYXJnLm5hbWUpXSk7XG5cdFx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRcdHJlamVjdChgRXJyb3Igd2hpbGUgbG9hZGluZyBDbGFzcyAke2FyZy5uYW1lfWApXG5cdFx0XHRcdFx0fS5iaW5kKHRoaXMpO1xuXHRcdFx0XHRcdHNjcmlwdC5zcmMgPSBzcmM7XG5cdFx0XHRcdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2hlYWQnKVswXS5hcHBlbmRDaGlsZChzY3JpcHQpO1xuXHRcdFx0XHR9KTtcblx0XHRcdH1cblxuXHRcdH1cblxuXHRcdHByb3RlY3RlZCBsb2FkX2Z1bmN0aW9uKGFyZzogSUxvYWRBcmd1bWVudHMpOiBQcm9taXNlT2ZDbGFzc2VzIHtcblx0XHRcdGxldCBzZWxmID0gdGhpcztcblx0XHRcdGxldCBwYXJlbnRzID0gW107XG5cdFx0XHRsZXQgc291cmNlO1xuXG5cdFx0XHRyZXR1cm4geGhyLmdldChhcmcudXJsKVxuXHRcdFx0LnRoZW4oc3JjID0+IHtcblx0XHRcdFx0c291cmNlID0gc3JjO1xuXHRcdFx0XHRpZighIWFyZy5wYXJlbnQpIHtcblx0XHRcdFx0XHRsZXQgcGFyZW50TmFtZSA9IHNlbGYucGFyc2VQYXJlbnRGcm9tU291cmNlKHNyYyk7XG5cdFx0XHRcdFx0Ly9pZihhcmcuc3VwZXIgPT09IHBhcmVudE5hbWUpXG5cdFx0XHRcdFx0aWYoYXJnLnN1cGVyLmluZGV4T2YocGFyZW50TmFtZSkgIT09IC0xKVxuXHRcdFx0XHRcdFx0cmV0dXJuIFtdO1xuXHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdHJldHVybiBzZWxmLmxvYWQoe25hbWU6IHBhcmVudE5hbWUsIHBhcmVudDogdHJ1ZSwgZXhwb3NlOiBhcmcuZXhwb3NlLCBzdXBlcjogYXJnLnN1cGVyfSk7XG5cdFx0XHRcdH1cblx0XHRcdH0pXG5cdFx0XHQudGhlbihwID0+IHtcblx0XHRcdFx0cGFyZW50cyA9IHA7XG5cdFx0XHRcdGxldCBzcmMgPSBzb3VyY2UgKyBcIlxcbnJldHVybiBcIiArIGFyZy5uYW1lICsgXCJcXG4vLyMgc291cmNlVVJMPVwiICsgd2luZG93LmxvY2F0aW9uLmhyZWYgKyBhcmcudXJsO1xuXHRcdFx0XHRsZXQgY2xhenogPSBuZXcgRnVuY3Rpb24oc3JjKSgpO1xuXHRcdFx0XHRpZihhcmcuZXhwb3NlKVxuXHRcdFx0XHRcdHV0aWwuZXhwb3NlKGFyZy5uYW1lLCBjbGF6eiwgc2VsZi5jb25mLndhcm5MZXZlbCA9PSBXYXJuTGV2ZWwuRVJST1IpO1xuXHRcdFx0XHRyZXR1cm4gY2xhenpcblx0XHRcdH0pXG5cdFx0XHQudGhlbihjbGF6eiA9PiB7XG5cdFx0XHRcdGlmKHNlbGYuY29uZi5jYWNoZSlcblx0XHRcdFx0XHRzZWxmLmNhY2hlW2FyZy5uYW1lXSA9IGNsYXp6O1xuXHRcdFx0XHRwYXJlbnRzLnB1c2goY2xhenopO1xuXHRcdFx0XHRyZXR1cm4gcGFyZW50cztcblx0XHRcdH0pXG5cdFx0fVxuXG5cdFx0cHJvdGVjdGVkIGxvYWRfZXZhbChhcmc6IElMb2FkQXJndW1lbnRzKTogUHJvbWlzZU9mQ2xhc3NlcyB7XG5cdFx0XHRsZXQgc2VsZiA9IHRoaXM7XG5cdFx0XHRsZXQgcGFyZW50cyA9IFtdO1xuXHRcdFx0bGV0IHNvdXJjZTtcblxuXHRcdFx0cmV0dXJuIHhoci5nZXQoYXJnLnVybClcblx0XHRcdC50aGVuKHNyYyA9PiB7XG5cdFx0XHRcdHNvdXJjZSA9IHNyYztcblx0XHRcdFx0aWYoISFhcmcucGFyZW50KSB7XG5cdFx0XHRcdFx0bGV0IHBhcmVudE5hbWUgPSBzZWxmLnBhcnNlUGFyZW50RnJvbVNvdXJjZShzcmMpO1xuXHRcdFx0XHRcdC8vaWYoYXJnLnN1cGVyID09PSBwYXJlbnROYW1lKVxuXHRcdFx0XHRcdGlmKGFyZy5zdXBlci5pbmRleE9mKHBhcmVudE5hbWUpICE9PSAtMSlcblx0XHRcdFx0XHRcdHJldHVybiBbXTtcblx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRyZXR1cm4gc2VsZi5sb2FkKHtuYW1lOiBwYXJlbnROYW1lLCBwYXJlbnQ6IHRydWUsIGV4cG9zZTogYXJnLmV4cG9zZSwgc3VwZXI6IGFyZy5zdXBlcn0pO1xuXHRcdFx0XHR9XG5cdFx0XHR9KVxuXHRcdFx0LnRoZW4ocCA9PiB7XG5cdFx0XHRcdHBhcmVudHMgPSBwO1xuXHRcdFx0XHRsZXQgcmV0ID0gXCJcXG4oZnVuY3Rpb24oKXtyZXR1cm4gXCIgKyBhcmcubmFtZSArIFwiO30pKCk7XCI7XG5cdFx0XHRcdGxldCBzcmMgPSBzb3VyY2UgKyByZXQgKyBcIlxcbi8vIyBzb3VyY2VVUkw9XCIgKyB3aW5kb3cubG9jYXRpb24uaHJlZiArIGFyZy51cmw7XG5cdFx0XHRcdGxldCBjbGF6eiA9IGV2YWwoc3JjKTtcblx0XHRcdFx0aWYoYXJnLmV4cG9zZSlcblx0XHRcdFx0XHR1dGlsLmV4cG9zZShhcmcubmFtZSwgY2xhenosIHNlbGYuY29uZi53YXJuTGV2ZWwgPT0gV2FybkxldmVsLkVSUk9SKTtcblx0XHRcdFx0cmV0dXJuIGNsYXp6O1xuXHRcdFx0fSlcblx0XHRcdC50aGVuKGNsYXp6ID0+IHtcblx0XHRcdFx0aWYoc2VsZi5jb25mLmNhY2hlKVxuXHRcdFx0XHRcdHNlbGYuY2FjaGVbYXJnLm5hbWVdID0gY2xheno7XG5cdFx0XHRcdHBhcmVudHMucHVzaChjbGF6eik7XG5cdFx0XHRcdHJldHVybiBwYXJlbnRzO1xuXHRcdFx0fSlcblx0XHR9XG5cblx0XHRwcm90ZWN0ZWQgZ2V0UGFyZW50TmFtZSh1cmw6IHN0cmluZyk6IGhvLnByb21pc2UuUHJvbWlzZTxzdHJpbmcsIGFueT4ge1xuXHRcdFx0bGV0IHNlbGYgPSB0aGlzO1xuXG5cdFx0XHRyZXR1cm5cdHhoci5nZXQodXJsKVxuXHRcdFx0XHQudGhlbihzcmMgPT4ge1xuXHRcdFx0XHRcdHJldHVybiBzZWxmLnBhcnNlUGFyZW50RnJvbVNvdXJjZShzcmMpO1xuXHRcdFx0XHR9KVxuXHRcdH1cblxuXHRcdHByb3RlY3RlZCBwYXJzZVBhcmVudEZyb21Tb3VyY2Uoc3JjOiBzdHJpbmcpOiBzdHJpbmcge1xuXHRcdFx0bGV0IHJfc3VwZXIgPSAvfVxcKVxcKCguKilcXCk7Lztcblx0XHRcdGxldCBtYXRjaCA9IHNyYy5tYXRjaChyX3N1cGVyKTtcblx0XHRcdGlmKG1hdGNoKVxuXHRcdFx0XHRyZXR1cm4gbWF0Y2hbMV07XG5cdFx0XHRlbHNlXG5cdFx0XHRcdHJldHVybiB1bmRlZmluZWQ7XG5cdFx0fVxuXG5cdFx0cHVibGljIHJlc29sdmVVcmwobmFtZTogc3RyaW5nKTogc3RyaW5nIHtcblx0XHRcdGlmKCEhbWFwcGluZ1tuYW1lXSlcbiAgICAgICAgICAgICAgICByZXR1cm4gbWFwcGluZ1tuYW1lXTtcblxuXHRcdFx0aWYodGhpcy5jb25mLnVzZURpcikge1xuICAgICAgICAgICAgICAgIG5hbWUgKz0gJy4nICsgbmFtZS5zcGxpdCgnLicpLnBvcCgpO1xuICAgICAgICAgICAgfVxuXG5cdFx0XHRuYW1lID0gbmFtZS5zcGxpdCgnLicpLmpvaW4oJy8nKTtcblxuXHRcdFx0aWYodGhpcy5jb25mLnVzZU1pbilcbiAgICAgICAgICAgICAgICBuYW1lICs9ICcubWluJ1xuXG5cdFx0XHRyZXR1cm4gdGhpcy5jb25mLnVybFRlbXBsYXRlLnJlcGxhY2UoJyR7bmFtZX0nLCBuYW1lKTtcblx0XHR9XG5cblx0XHRwcm90ZWN0ZWQgZXhpc3RzKG5hbWU6IHN0cmluZyk6IGJvb2xlYW4ge1xuXHRcdFx0cmV0dXJuICEhdGhpcy5jYWNoZVtuYW1lXTtcblx0XHR9XG5cdH1cbn1cbiIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi8uLi8uLi9ib3dlcl9jb21wb25lbnRzL2hvLXByb21pc2UvZGlzdC9wcm9taXNlLmQudHNcIi8+XG5cbm1vZHVsZSBoby5jbGFzc2xvYWRlciB7XG5cblx0bGV0IGxvYWRlciA9IG5ldyBDbGFzc0xvYWRlcigpO1xuXG5cdGV4cG9ydCBmdW5jdGlvbiBjb25maWcoYzogSUxvYWRlckNvbmZpZyk6IHZvaWQge1xuXHRcdGxvYWRlci5jb25maWcoYyk7XG5cdH07XG5cblx0ZXhwb3J0IGZ1bmN0aW9uIGxvYWQoYXJnOiBJTG9hZEFyZ3VtZW50cyk6IFByb21pc2VPZkNsYXNzZXMge1xuXHRcdHJldHVybiBsb2FkZXIubG9hZChhcmcpO1xuXHR9O1xuXG5cbn1cbiIsImludGVyZmFjZSBXaW5kb3cge1xuXHR3ZWJraXRSZXF1ZXN0QW5pbWF0aW9uRnJhbWU6IChjYWxsYmFjazogRnJhbWVSZXF1ZXN0Q2FsbGJhY2spID0+IG51bWJlcjtcblx0bW96UmVxdWVzdEFuaW1hdGlvbkZyYW1lOiAoY2FsbGJhY2s6IEZyYW1lUmVxdWVzdENhbGxiYWNrKSA9PiBudW1iZXI7XG5cdG9SZXF1ZXN0QW5pbWF0aW9uRnJhbWU6IChjYWxsYmFjazogRnJhbWVSZXF1ZXN0Q2FsbGJhY2spID0+IG51bWJlcjtcbn1cblxubW9kdWxlIGhvLndhdGNoIHtcblxuXHRleHBvcnQgdHlwZSBIYW5kbGVyID0gKG9iajphbnksIG5hbWU6c3RyaW5nLCBvbGRWOmFueSwgbmV3VjphbnksICB0aW1lc3RhbXA/OiBudW1iZXIpPT5hbnk7XG5cblx0ZXhwb3J0IGZ1bmN0aW9uIHdhdGNoKG9iajogYW55LCBuYW1lOiBzdHJpbmcsIGhhbmRsZXI6IEhhbmRsZXIpOiB2b2lkIHtcblx0XHRuZXcgV2F0Y2hlcihvYmosIG5hbWUsIGhhbmRsZXIpO1xuXHR9XG5cblx0Y2xhc3MgV2F0Y2hlciB7XG5cblx0XHRwcml2YXRlIG9sZFZhbDphbnk7XG5cblx0XHRjb25zdHJ1Y3Rvcihwcml2YXRlIG9iajogYW55LCBwcml2YXRlIG5hbWU6IHN0cmluZywgcHJpdmF0ZSBoYW5kbGVyOiBIYW5kbGVyKSB7XG5cdFx0XHR0aGlzLm9sZFZhbCA9IHRoaXMuY29weShvYmpbbmFtZV0pO1xuXG5cdFx0XHR0aGlzLndhdGNoKHRpbWVzdGFtcCA9PiB7XG5cdFx0XHRcdGlmKHRoaXMub2xkVmFsICE9PSBvYmpbbmFtZV0pIHtcblx0XHRcdFx0XHR0aGlzLmhhbmRsZXIuY2FsbChudWxsLCBvYmosIG5hbWUsIHRoaXMub2xkVmFsLCBvYmpbbmFtZV0sIHRpbWVzdGFtcCk7XG5cdFx0XHRcdFx0dGhpcy5vbGRWYWwgPSB0aGlzLmNvcHkob2JqW25hbWVdKTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0fVxuXG5cdFx0cHJpdmF0ZSB3YXRjaChjYjogKHRpbWVTdGFtcDpudW1iZXIpPT5hbnkpOiB2b2lkIHtcblx0XHRcdGxldCBmbjogRnVuY3Rpb24gPVxuXHRcdFx0d2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSAgICAgICB8fFxuXHQgIFx0XHR3aW5kb3cud2Via2l0UmVxdWVzdEFuaW1hdGlvbkZyYW1lIHx8XG5cdCAgXHRcdHdpbmRvdy5tb3pSZXF1ZXN0QW5pbWF0aW9uRnJhbWUgICAgfHxcblx0ICBcdFx0d2luZG93Lm9SZXF1ZXN0QW5pbWF0aW9uRnJhbWUgICAgICB8fFxuXHQgIFx0XHR3aW5kb3cubXNSZXF1ZXN0QW5pbWF0aW9uRnJhbWUgICAgIHx8XG5cdCAgXHRcdGZ1bmN0aW9uKGNhbGxiYWNrOiBGdW5jdGlvbil7XG5cdFx0XHRcdHdpbmRvdy5zZXRUaW1lb3V0KGNhbGxiYWNrLCAxMDAwIC8gNjApO1xuXHQgIFx0XHR9O1xuXG5cdFx0XHRsZXQgd3JhcCA9ICh0czogbnVtYmVyKSA9PiB7XG5cdFx0XHRcdGNiKHRzKTtcblx0XHRcdFx0Zm4od3JhcCk7XG5cdFx0XHR9XG5cblx0XHRcdGZuKHdyYXApO1xuXHRcdH1cblxuXHRcdHByaXZhdGUgY29weSh2YWw6IGFueSk6IGFueSB7XG5cdFx0XHRyZXR1cm4gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeSh2YWwpKTtcblx0XHR9XG5cdH1cblxufVxuIiwibW9kdWxlIGhvLmNvbXBvbmVudHMudGVtcCB7XG5cdFx0dmFyIGM6IG51bWJlciA9IC0xO1xuXHRcdHZhciBkYXRhOiBhbnlbXSA9IFtdO1xuXG5cdFx0ZXhwb3J0IGZ1bmN0aW9uIHNldChkOiBhbnkpOiBudW1iZXIge1xuXHRcdFx0YysrO1xuXHRcdFx0ZGF0YVtjXSA9IGQ7XG5cdFx0XHRyZXR1cm4gYztcblx0XHR9XG5cblx0XHRleHBvcnQgZnVuY3Rpb24gZ2V0KGk6IG51bWJlcik6IGFueSB7XG5cdFx0XHRyZXR1cm4gZGF0YVtpXTtcblx0XHR9XG5cblx0XHRleHBvcnQgZnVuY3Rpb24gY2FsbChpOiBudW1iZXIsIC4uLmFyZ3MpOiB2b2lkIHtcblx0XHRcdGRhdGFbaV0oLi4uYXJncyk7XG5cdFx0fVxufVxuIiwibW9kdWxlIGhvLmNvbXBvbmVudHMuc3R5bGVyIHtcclxuXHJcblx0ZXhwb3J0IGludGVyZmFjZSBJU3R5bGVyIHtcclxuXHRcdGFwcGx5U3R5bGUoY29tcG9uZW50OiBDb21wb25lbnQsIGNzcz86IHN0cmluZyk6IHZvaWRcclxuXHR9XHJcblxyXG5cdGludGVyZmFjZSBTdHlsZUJsb2NrIHtcclxuXHRcdHNlbGVjdG9yOiBzdHJpbmc7XHJcblx0XHRydWxlczogQXJyYXk8U3R5bGVSdWxlPjtcclxuXHR9XHJcblxyXG5cdGludGVyZmFjZSBTdHlsZVJ1bGUge1xyXG5cdFx0cHJvcGVydHk6IHN0cmluZztcclxuXHRcdHZhbHVlOiBzdHJpbmc7XHJcblx0fVxyXG5cclxuXHRjbGFzcyBTdHlsZXIgaW1wbGVtZW50cyBJU3R5bGVyIHtcclxuXHRcdHB1YmxpYyBhcHBseVN0eWxlKGNvbXBvbmVudDogQ29tcG9uZW50LCBjc3MgPSBjb21wb25lbnQuc3R5bGUpOiB2b2lkIHtcclxuXHRcdFx0bGV0IGlkID0gJ3N0eWxlLScrY29tcG9uZW50Lm5hbWU7XHJcblx0XHRcdGlmKCEhZG9jdW1lbnQucXVlcnlTZWxlY3Rvcihgc3R5bGVbaWQ9XCIke2lkfVwiXWApKVxyXG5cdFx0XHRcdHJldHVybjtcclxuXHJcblx0XHRcdGxldCBzdHlsZSA9IGNvbXBvbmVudC5zdHlsZS5yZXBsYWNlKCd0aGlzJywgY29tcG9uZW50Lm5hbWUpO1xyXG5cdFx0XHRsZXQgdGFnID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3R5bGUnKTtcclxuXHRcdFx0dGFnLmlkID0gaWQ7XHJcblx0XHRcdHRhZy5pbm5lckhUTUwgPSAnXFxuJyArIHN0eWxlICsgJ1xcbic7XHJcblx0XHRcdGRvY3VtZW50LmhlYWQuYXBwZW5kQ2hpbGQodGFnKTtcclxuXHJcblx0XHRcdC8qXHJcblx0XHRcdGxldCBzdHlsZSA9IHRoaXMucGFyc2VTdHlsZShjb21wb25lbnQuc3R5bGUpO1xyXG5cdFx0XHRzdHlsZS5mb3JFYWNoKHMgPT4ge1xyXG5cdFx0XHRcdHRoaXMuYXBwbHlTdHlsZUJsb2NrKGNvbXBvbmVudCwgcyk7XHJcblx0XHRcdH0pO1xyXG5cdFx0XHQqL1xyXG5cdFx0fVxyXG5cclxuXHRcdHByb3RlY3RlZCBhcHBseVN0eWxlQmxvY2soY29tcG9uZW50OiBDb21wb25lbnQsIHN0eWxlOiBTdHlsZUJsb2NrKTogdm9pZCB7XHJcblx0XHRcdGlmKHN0eWxlLnNlbGVjdG9yLnRyaW0oKS50b0xvd2VyQ2FzZSgpID09PSAndGhpcycpIHtcclxuXHRcdFx0XHRzdHlsZS5ydWxlcy5mb3JFYWNoKHIgPT4ge1xyXG5cdFx0XHRcdFx0dGhpcy5hcHBseVJ1bGUoY29tcG9uZW50LmVsZW1lbnQsIHIpO1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9XHJcblx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdEFycmF5LnByb3RvdHlwZS5mb3JFYWNoLmNhbGwoY29tcG9uZW50LmVsZW1lbnQucXVlcnlTZWxlY3RvckFsbChzdHlsZS5zZWxlY3RvciksIGVsID0+IHtcclxuXHRcdFx0XHRcdHN0eWxlLnJ1bGVzLmZvckVhY2gociA9PiB7XHJcblx0XHRcdFx0XHRcdHRoaXMuYXBwbHlSdWxlKGVsLCByKTtcclxuXHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0cHJvdGVjdGVkIGFwcGx5UnVsZShlbGVtZW50OiBIVE1MRWxlbWVudCwgcnVsZTogU3R5bGVSdWxlKTogdm9pZCB7XHJcblx0XHRcdGxldCBwcm9wID0gcnVsZS5wcm9wZXJ0eS5yZXBsYWNlKC8tKFxcdykvZywgKF8sIGxldHRlcjogc3RyaW5nKSA9PiB7XHJcblx0XHRcdFx0cmV0dXJuIGxldHRlci50b1VwcGVyQ2FzZSgpO1xyXG5cdFx0XHR9KS50cmltKCk7XHJcblx0XHRcdGVsZW1lbnQuc3R5bGVbcHJvcF0gPSBydWxlLnZhbHVlO1xyXG5cdFx0fVxyXG5cclxuXHRcdHByb3RlY3RlZCBwYXJzZVN0eWxlKGNzczogc3RyaW5nKTogQXJyYXk8U3R5bGVCbG9jaz4ge1xyXG5cdFx0XHRsZXQgciA9IC8oLis/KVxccyp7KC4qPyl9L2dtO1xyXG5cdFx0XHRsZXQgcjIgPSAvKC4rPylcXHM/OiguKz8pOy9nbTtcclxuXHRcdFx0Y3NzID0gY3NzLnJlcGxhY2UoL1xcbi9nLCAnJyk7XHJcblx0XHRcdGxldCBibG9ja3M6IFN0eWxlQmxvY2tbXSA9ICg8c3RyaW5nW10+Y3NzLm1hdGNoKHIpIHx8IFtdKVxyXG5cdFx0XHRcdC5tYXAoYiA9PiB7XHJcblx0XHRcdFx0XHRpZighYi5tYXRjaChyKSlcclxuXHRcdFx0XHRcdFx0cmV0dXJuIG51bGw7XHJcblxyXG5cdFx0XHRcdFx0bGV0IFtfLCBzZWxlY3RvciwgX3J1bGVzXSA9IHIuZXhlYyhiKTtcclxuXHRcdFx0XHRcdGxldCBydWxlczogU3R5bGVSdWxlW10gPSAoPHN0cmluZ1tdPl9ydWxlcy5tYXRjaChyMikgfHwgW10pXHJcblx0XHRcdFx0XHRcdC5tYXAociA9PiB7XHJcblx0XHRcdFx0XHRcdFx0aWYoIXIubWF0Y2gocjIpKVxyXG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuIG51bGw7XHJcblxyXG5cdFx0XHRcdFx0XHRcdGxldCBbXywgcHJvcGVydHksIHZhbHVlXSA9IHIyLmV4ZWMocik7XHJcblx0XHRcdFx0XHRcdFx0cmV0dXJuIHtwcm9wZXJ0eSwgdmFsdWV9O1xyXG5cdFx0XHRcdFx0XHR9KVxyXG5cdFx0XHRcdFx0XHQuZmlsdGVyKHIgPT4ge1xyXG5cdFx0XHRcdFx0XHRcdHJldHVybiByICE9PSBudWxsO1xyXG5cdFx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHRcdHJldHVybiB7c2VsZWN0b3IsIHJ1bGVzfTtcclxuXHRcdFx0XHR9KVxyXG5cdFx0XHRcdC5maWx0ZXIoYiA9PiB7XHJcblx0XHRcdFx0XHRyZXR1cm4gYiAhPT0gbnVsbDtcclxuXHRcdFx0XHR9KTtcclxuXHJcblxyXG5cdFx0XHRyZXR1cm4gYmxvY2tzO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0ZXhwb3J0IGxldCBpbnN0YW5jZTogSVN0eWxlciA9IG5ldyBTdHlsZXIoKTtcclxufVxyXG4iLCJtb2R1bGUgaG8uY29tcG9uZW50cy5yZW5kZXJlciB7XHJcblxyXG4gICAgaW50ZXJmYWNlIE5vZGVIdG1sIHtcclxuICAgICAgICByb290OiBOb2RlO1xyXG4gICAgICAgIGh0bWw6IHN0cmluZztcclxuICAgIH1cclxuXHJcbiAgICBjbGFzcyBOb2RlIHtcclxuICAgICAgICBodG1sOiBzdHJpbmc7XHJcbiAgICAgICAgcGFyZW50OiBOb2RlO1xyXG4gICAgICAgIGNoaWxkcmVuOiBBcnJheTxOb2RlPiA9IFtdO1xyXG4gICAgICAgIHR5cGU6IHN0cmluZztcclxuICAgICAgICBzZWxmQ2xvc2luZzogYm9vbGVhbjtcclxuICAgICAgICBpc1ZvaWQ6IGJvb2xlYW47XHJcbiAgICAgICAgcmVwZWF0OiBib29sZWFuO1xyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBjbGFzcyBSZW5kZXJlciB7XHJcblxyXG4gICAgICAgIHByaXZhdGUgcjogYW55ID0ge1xyXG5cdFx0XHR0YWc6IC88KFtePl0qPyg/Oig/OignfFwiKVteJ1wiXSo/XFwyKVtePl0qPykqKT4vLFxyXG5cdFx0XHRyZXBlYXQ6IC9yZXBlYXQ9W1wifCddLitbXCJ8J10vLFxyXG5cdFx0XHR0eXBlOiAvW1xcc3wvXSooLio/KVtcXHN8XFwvfD5dLyxcclxuXHRcdFx0dGV4dDogLyg/Oi58W1xcclxcbl0pKj9bXlwiJ1xcXFxdPC9tLFxyXG5cdFx0fTtcclxuXHJcbiAgICAgICAgcHJpdmF0ZSB2b2lkcyA9IFtcImFyZWFcIiwgXCJiYXNlXCIsIFwiYnJcIiwgXCJjb2xcIiwgXCJjb21tYW5kXCIsIFwiZW1iZWRcIiwgXCJoclwiLCBcImltZ1wiLCBcImlucHV0XCIsIFwia2V5Z2VuXCIsIFwibGlua1wiLCBcIm1ldGFcIiwgXCJwYXJhbVwiLCBcInNvdXJjZVwiLCBcInRyYWNrXCIsIFwid2JyXCJdO1xyXG5cclxuICAgICAgICBwcml2YXRlIGNhY2hlOiB7W2tleTpzdHJpbmddOk5vZGV9ID0ge307XHJcblxyXG4gICAgICAgIHB1YmxpYyByZW5kZXIoY29tcG9uZW50OiBDb21wb25lbnQpOiB2b2lkIHtcclxuICAgICAgICAgICAgaWYodHlwZW9mIGNvbXBvbmVudC5odG1sID09PSAnYm9vbGVhbicgJiYgIWNvbXBvbmVudC5odG1sKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgICAgICAgbGV0IG5hbWUgPSBjb21wb25lbnQubmFtZTtcclxuICAgICAgICAgICAgbGV0IHJvb3QgPSB0aGlzLmNhY2hlW25hbWVdID0gdGhpcy5jYWNoZVtuYW1lXSB8fCB0aGlzLnBhcnNlKGNvbXBvbmVudC5odG1sKS5yb290O1xyXG4gICAgICAgICAgICByb290ID0gdGhpcy5yZW5kZXJSZXBlYXQodGhpcy5jb3B5Tm9kZShyb290KSwgY29tcG9uZW50KTtcclxuXHJcbiAgICAgICAgICAgIGxldCBodG1sID0gdGhpcy5kb21Ub1N0cmluZyhyb290LCAtMSk7XHJcblxyXG4gICAgICAgICAgICBjb21wb25lbnQuZWxlbWVudC5pbm5lckhUTUwgPSBodG1sO1xyXG5cclxuICAgICAgICB9XHJcblxyXG5cclxuXHRcdHByaXZhdGUgcGFyc2UoaHRtbDogc3RyaW5nLCByb290PSBuZXcgTm9kZSgpKTogTm9kZUh0bWwge1xyXG5cclxuXHRcdFx0dmFyIG07XHJcblx0XHRcdHdoaWxlKChtID0gdGhpcy5yLnRhZy5leGVjKGh0bWwpKSAhPT0gbnVsbCkge1xyXG5cdFx0XHRcdHZhciB0YWcsIHR5cGUsIGNsb3NpbmcsIGlzVm9pZCwgc2VsZkNsb3NpbmcsIHJlcGVhdCwgdW5DbG9zZTtcclxuXHRcdFx0XHQvLy0tLS0tLS0gZm91bmQgc29tZSB0ZXh0IGJlZm9yZSBuZXh0IHRhZ1xyXG5cdFx0XHRcdGlmKG0uaW5kZXggIT09IDApIHtcclxuXHRcdFx0XHRcdHRhZyA9IGh0bWwubWF0Y2godGhpcy5yLnRleHQpWzBdO1xyXG5cdFx0XHRcdFx0dGFnID0gdGFnLnN1YnN0cigwLCB0YWcubGVuZ3RoLTEpO1xyXG5cdFx0XHRcdFx0dHlwZSA9ICdURVhUJztcclxuICAgICAgICAgICAgICAgICAgICBpc1ZvaWQgPSBmYWxzZTtcclxuXHRcdFx0XHRcdHNlbGZDbG9zaW5nID0gdHJ1ZTtcclxuXHRcdFx0XHRcdHJlcGVhdCA9IGZhbHNlO1xyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHR0YWcgPSBtWzFdLnRyaW0oKTtcclxuXHRcdFx0XHRcdHR5cGUgPSAodGFnKyc+JykubWF0Y2godGhpcy5yLnR5cGUpWzFdO1xyXG5cdFx0XHRcdFx0Y2xvc2luZyA9IHRhZ1swXSA9PT0gJy8nO1xyXG4gICAgICAgICAgICAgICAgICAgIGlzVm9pZCA9IHRoaXMuaXNWb2lkKHR5cGUpO1xyXG5cdFx0XHRcdFx0c2VsZkNsb3NpbmcgPSBpc1ZvaWQgfHwgdGFnW3RhZy5sZW5ndGgtMV0gPT09ICcvJztcclxuXHRcdFx0XHRcdHJlcGVhdCA9ICEhdGFnLm1hdGNoKHRoaXMuci5yZXBlYXQpO1xyXG5cclxuXHRcdFx0XHRcdGlmKHNlbGZDbG9zaW5nICYmIGhvLmNvbXBvbmVudHMucmVnaXN0cnkuaW5zdGFuY2UuaGFzQ29tcG9uZW50KHR5cGUpKSB7XHJcblx0XHRcdFx0XHRcdHNlbGZDbG9zaW5nID0gZmFsc2U7XHJcblx0XHRcdFx0XHRcdHRhZyA9IHRhZy5zdWJzdHIoMCwgdGFnLmxlbmd0aC0xKSArIFwiIFwiO1xyXG5cclxuXHRcdFx0XHRcdFx0dW5DbG9zZSA9IHRydWU7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRodG1sID0gaHRtbC5zbGljZSh0YWcubGVuZ3RoICsgKHR5cGUgPT09ICdURVhUJyA/IDAgOiAyKSApO1xyXG5cclxuXHRcdFx0XHRpZihjbG9zaW5nKSB7XHJcblx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0cm9vdC5jaGlsZHJlbi5wdXNoKHtwYXJlbnQ6IHJvb3QsIGh0bWw6IHRhZywgdHlwZTogdHlwZSwgaXNWb2lkOiBpc1ZvaWQsIHNlbGZDbG9zaW5nOiBzZWxmQ2xvc2luZywgcmVwZWF0OiByZXBlYXQsIGNoaWxkcmVuOiBbXX0pO1xyXG5cclxuXHRcdFx0XHRcdGlmKCF1bkNsb3NlICYmICFzZWxmQ2xvc2luZykge1xyXG5cdFx0XHRcdFx0XHR2YXIgcmVzdWx0ID0gdGhpcy5wYXJzZShodG1sLCByb290LmNoaWxkcmVuW3Jvb3QuY2hpbGRyZW4ubGVuZ3RoLTFdKTtcclxuXHRcdFx0XHRcdFx0aHRtbCA9IHJlc3VsdC5odG1sO1xyXG5cdFx0XHRcdFx0XHRyb290LmNoaWxkcmVuLnBvcCgpO1xyXG5cdFx0XHRcdFx0XHRyb290LmNoaWxkcmVuLnB1c2gocmVzdWx0LnJvb3QpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0bSA9IGh0bWwubWF0Y2godGhpcy5yLnRhZyk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHJldHVybiB7cm9vdDogcm9vdCwgaHRtbDogaHRtbH07XHJcblx0XHR9XHJcblxyXG5cdFx0cHJpdmF0ZSByZW5kZXJSZXBlYXQocm9vdCwgbW9kZWxzKTogTm9kZSB7XHJcblx0XHRcdG1vZGVscyA9IFtdLmNvbmNhdChtb2RlbHMpO1xyXG5cclxuXHRcdFx0Zm9yKHZhciBjID0gMDsgYyA8IHJvb3QuY2hpbGRyZW4ubGVuZ3RoOyBjKyspIHtcclxuXHRcdFx0XHR2YXIgY2hpbGQgPSByb290LmNoaWxkcmVuW2NdO1xyXG5cdFx0XHRcdGlmKGNoaWxkLnJlcGVhdCkge1xyXG5cdFx0XHRcdFx0dmFyIHJlZ2V4ID0gL3JlcGVhdD1bXCJ8J11cXHMqKFxcUyspXFxzK2FzXFxzKyhcXFMrPylbXCJ8J10vO1xyXG5cdFx0XHRcdFx0dmFyIG0gPSBjaGlsZC5odG1sLm1hdGNoKHJlZ2V4KS5zbGljZSgxKTtcclxuXHRcdFx0XHRcdHZhciBuYW1lID0gbVsxXTtcclxuXHRcdFx0XHRcdHZhciBpbmRleE5hbWU7XHJcblx0XHRcdFx0XHRpZihuYW1lLmluZGV4T2YoJywnKSA+IC0xKSB7XHJcblx0XHRcdFx0XHRcdHZhciBuYW1lcyA9IG5hbWUuc3BsaXQoJywnKTtcclxuXHRcdFx0XHRcdFx0bmFtZSA9IG5hbWVzWzBdLnRyaW0oKTtcclxuXHRcdFx0XHRcdFx0aW5kZXhOYW1lID0gbmFtZXNbMV0udHJpbSgpO1xyXG5cdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdHZhciBtb2RlbCA9IHRoaXMuZXZhbHVhdGUobW9kZWxzLCBtWzBdKTtcclxuXHJcblx0XHRcdFx0XHR2YXIgaG9sZGVyID0gW107XHJcblx0XHRcdFx0XHRtb2RlbC5mb3JFYWNoKGZ1bmN0aW9uKHZhbHVlLCBpbmRleCkge1xyXG5cdFx0XHRcdFx0XHR2YXIgbW9kZWwyID0ge307XHJcblx0XHRcdFx0XHRcdG1vZGVsMltuYW1lXSA9IHZhbHVlO1xyXG5cdFx0XHRcdFx0XHRtb2RlbDJbaW5kZXhOYW1lXSA9IGluZGV4O1xyXG5cclxuXHRcdFx0XHRcdFx0dmFyIG1vZGVsczIgPSBbXS5jb25jYXQobW9kZWxzKTtcclxuXHRcdFx0XHRcdFx0bW9kZWxzMi51bnNoaWZ0KG1vZGVsMik7XHJcblxyXG5cdFx0XHRcdFx0XHR2YXIgbm9kZSA9IHRoaXMuY29weU5vZGUoY2hpbGQpO1xyXG5cdFx0XHRcdFx0XHRub2RlLnJlcGVhdCA9IGZhbHNlO1xyXG5cdFx0XHRcdFx0XHRub2RlLmh0bWwgPSBub2RlLmh0bWwucmVwbGFjZSh0aGlzLnIucmVwZWF0LCAnJyk7XHJcblx0XHRcdFx0XHRcdG5vZGUuaHRtbCA9IHRoaXMucmVwbChub2RlLmh0bWwsIG1vZGVsczIpO1xyXG5cclxuXHRcdFx0XHRcdFx0bm9kZSA9IHRoaXMucmVuZGVyUmVwZWF0KG5vZGUsIG1vZGVsczIpO1xyXG5cclxuXHRcdFx0XHRcdFx0Ly9yb290LmNoaWxkcmVuLnNwbGljZShyb290LmNoaWxkcmVuLmluZGV4T2YoY2hpbGQpLCAwLCBub2RlKTtcclxuXHRcdFx0XHRcdFx0aG9sZGVyLnB1c2gobm9kZSk7XHJcblx0XHRcdFx0XHR9LmJpbmQodGhpcykpO1xyXG5cclxuXHRcdFx0XHRcdGhvbGRlci5mb3JFYWNoKGZ1bmN0aW9uKG4pIHtcclxuXHRcdFx0XHRcdFx0cm9vdC5jaGlsZHJlbi5zcGxpY2Uocm9vdC5jaGlsZHJlbi5pbmRleE9mKGNoaWxkKSwgMCwgbik7XHJcblx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHRcdHJvb3QuY2hpbGRyZW4uc3BsaWNlKHJvb3QuY2hpbGRyZW4uaW5kZXhPZihjaGlsZCksIDEpO1xyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRjaGlsZC5odG1sID0gdGhpcy5yZXBsKGNoaWxkLmh0bWwsIG1vZGVscyk7XHJcblx0XHRcdFx0XHRjaGlsZCA9IHRoaXMucmVuZGVyUmVwZWF0KGNoaWxkLCBtb2RlbHMpO1xyXG5cdFx0XHRcdFx0cm9vdC5jaGlsZHJlbltjXSA9IGNoaWxkO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0cmV0dXJuIHJvb3Q7XHJcblx0XHR9XHJcblxyXG5cdFx0cHJpdmF0ZSBkb21Ub1N0cmluZyhyb290OiBOb2RlLCBpbmRlbnQ6IG51bWJlcik6IHN0cmluZyB7XHJcblx0XHRcdGluZGVudCA9IGluZGVudCB8fCAwO1xyXG5cdFx0XHR2YXIgaHRtbCA9ICcnO1xyXG4gICAgICAgICAgICBjb25zdCB0YWI6IGFueSA9ICdcXHQnO1xyXG5cclxuXHRcdFx0aWYocm9vdC5odG1sKSB7XHJcblx0XHRcdFx0aHRtbCArPSBuZXcgQXJyYXkoaW5kZW50KS5qb2luKHRhYik7IC8vdGFiLnJlcGVhdChpbmRlbnQpOztcclxuXHRcdFx0XHRpZihyb290LnR5cGUgIT09ICdURVhUJykge1xyXG5cdFx0XHRcdFx0aWYocm9vdC5zZWxmQ2xvc2luZyAmJiAhcm9vdC5pc1ZvaWQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaHRtbCArPSAnPCcgKyByb290Lmh0bWwuc3Vic3RyKDAsIC0tcm9vdC5odG1sLmxlbmd0aCkgKyAnPic7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGh0bWwgKz0gJzwvJytyb290LnR5cGUrJz5cXG4nO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGh0bWwgKz0gJzwnICsgcm9vdC5odG1sICsgJz4nO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cdFx0XHRcdGVsc2UgaHRtbCArPSByb290Lmh0bWw7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGlmKGh0bWwpXHJcblx0XHRcdFx0aHRtbCArPSAnXFxuJztcclxuXHJcblx0XHRcdGlmKHJvb3QuY2hpbGRyZW4ubGVuZ3RoKSB7XHJcblx0XHRcdFx0aHRtbCArPSByb290LmNoaWxkcmVuLm1hcChmdW5jdGlvbihjKSB7XHJcblx0XHRcdFx0XHRyZXR1cm4gdGhpcy5kb21Ub1N0cmluZyhjLCBpbmRlbnQrKHJvb3QudHlwZSA/IDEgOiAyKSk7XHJcblx0XHRcdFx0fS5iaW5kKHRoaXMpKS5qb2luKCdcXG4nKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0aWYocm9vdC50eXBlICYmIHJvb3QudHlwZSAhPT0gJ1RFWFQnICYmICFyb290LnNlbGZDbG9zaW5nKSB7XHJcblx0XHRcdFx0aHRtbCArPSBuZXcgQXJyYXkoaW5kZW50KS5qb2luKHRhYik7IC8vdGFiLnJlcGVhdChpbmRlbnQpO1xyXG5cdFx0XHRcdGh0bWwgKz0gJzwvJytyb290LnR5cGUrJz5cXG4nO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRyZXR1cm4gaHRtbDtcclxuXHRcdH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSByZXBsKHN0cjogc3RyaW5nLCBtb2RlbHM6IGFueVtdKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgdmFyIHJlZ2V4RyA9IC97KC4rPyl9fT8vZztcclxuXHJcbiAgICAgICAgICAgIHZhciBtID0gc3RyLm1hdGNoKHJlZ2V4Ryk7XHJcbiAgICAgICAgICAgIGlmKCFtKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHN0cjtcclxuXHJcbiAgICAgICAgICAgIHdoaWxlKG0ubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgcGF0aCA9IG1bMF07XHJcbiAgICAgICAgICAgICAgICBwYXRoID0gcGF0aC5zdWJzdHIoMSwgcGF0aC5sZW5ndGgtMik7XHJcblxyXG4gICAgICAgICAgICAgICAgdmFyIHZhbHVlID0gdGhpcy5ldmFsdWF0ZShtb2RlbHMsIHBhdGgpO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmKHZhbHVlICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZih0eXBlb2YgdmFsdWUgPT09ICdmdW5jdGlvbicpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSBcImhvLmNvbXBvbmVudHMuQ29tcG9uZW50LmdldENvbXBvbmVudCh0aGlzKS5cIitwYXRoO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBzdHIgPSBzdHIucmVwbGFjZShtWzBdLCB2YWx1ZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgbSA9IG0uc2xpY2UoMSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiBzdHI7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIGV2YWx1YXRlKG1vZGVsczogYW55W10sIHBhdGg6IHN0cmluZyk6IGFueSB7XHJcbiAgICAgICAgICAgIGlmKHBhdGhbMF0gPT09ICd7JyAmJiBwYXRoWy0tcGF0aC5sZW5ndGhdID09PSAnfScpXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5ldmFsdWF0ZUV4cHJlc3Npb24obW9kZWxzLCBwYXRoLnN1YnN0cigxLCBwYXRoLmxlbmd0aC0yKSlcclxuICAgICAgICAgICAgZWxzZSBpZihwYXRoWzBdID09PSAnIycpXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5ldmFsdWF0ZUZ1bmN0aW9uKG1vZGVscywgcGF0aC5zdWJzdHIoMSkpO1xyXG4gICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5ldmFsdWF0ZVZhbHVlKG1vZGVscywgcGF0aCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIGV2YWx1YXRlVmFsdWUobW9kZWxzOiBhbnlbXSwgcGF0aDogc3RyaW5nKTogYW55IHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZXZhbHVhdGVWYWx1ZUFuZE1vZGVsKG1vZGVscywgcGF0aCkudmFsdWU7XHJcbiAgICAgICAgfVxyXG5cclxuXHRcdHByaXZhdGUgZXZhbHVhdGVWYWx1ZUFuZE1vZGVsKG1vZGVsczogYW55W10sIHBhdGg6IHN0cmluZyk6IHt2YWx1ZTogYW55LCBtb2RlbDogYW55fSB7XHJcblx0XHRcdGlmKG1vZGVscy5pbmRleE9mKHdpbmRvdykgPT0gLTEpXHJcbiAgICAgICAgICAgICAgICBtb2RlbHMucHVzaCh3aW5kb3cpO1xyXG5cclxuICAgICAgICAgICAgdmFyIG1pID0gMDtcclxuXHRcdFx0dmFyIG1vZGVsID0gdm9pZCAwO1xyXG5cdFx0XHR3aGlsZShtaSA8IG1vZGVscy5sZW5ndGggJiYgbW9kZWwgPT09IHVuZGVmaW5lZCkge1xyXG5cdFx0XHRcdG1vZGVsID0gbW9kZWxzW21pXTtcclxuXHRcdFx0XHR0cnkge1xyXG5cdFx0XHRcdFx0bW9kZWwgPSBuZXcgRnVuY3Rpb24oXCJtb2RlbFwiLCBcInJldHVybiBtb2RlbFsnXCIgKyBwYXRoLnNwbGl0KFwiLlwiKS5qb2luKFwiJ11bJ1wiKSArIFwiJ11cIikobW9kZWwpO1xyXG5cdFx0XHRcdH0gY2F0Y2goZSkge1xyXG5cdFx0XHRcdFx0bW9kZWwgPSB2b2lkIDA7XHJcblx0XHRcdFx0fSBmaW5hbGx5IHtcclxuICAgICAgICAgICAgICAgICAgICBtaSsrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRyZXR1cm4ge1widmFsdWVcIjogbW9kZWwsIFwibW9kZWxcIjogbW9kZWxzWy0tbWldfTtcclxuXHRcdH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSBldmFsdWF0ZUV4cHJlc3Npb24obW9kZWxzOiBhbnlbXSwgcGF0aDogc3RyaW5nKTogYW55IHtcclxuXHRcdFx0aWYobW9kZWxzLmluZGV4T2Yod2luZG93KSA9PSAtMSlcclxuICAgICAgICAgICAgICAgIG1vZGVscy5wdXNoKHdpbmRvdyk7XHJcblxyXG4gICAgICAgICAgICB2YXIgbWkgPSAwO1xyXG5cdFx0XHR2YXIgbW9kZWwgPSB2b2lkIDA7XHJcblx0XHRcdHdoaWxlKG1pIDwgbW9kZWxzLmxlbmd0aCAmJiBtb2RlbCA9PT0gdW5kZWZpbmVkKSB7XHJcblx0XHRcdFx0bW9kZWwgPSBtb2RlbHNbbWldO1xyXG5cdFx0XHRcdHRyeSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy93aXRoKG1vZGVsKSBtb2RlbCA9IGV2YWwocGF0aCk7XHJcbiAgICAgICAgICAgICAgICAgICAgbW9kZWwgPSBuZXcgRnVuY3Rpb24oT2JqZWN0LmtleXMobW9kZWwpLnRvU3RyaW5nKCksIFwicmV0dXJuIFwiICsgcGF0aClcclxuICAgICAgICAgICAgICAgICAgICAgICAgLmFwcGx5KG51bGwsIE9iamVjdC5rZXlzKG1vZGVsKS5tYXAoKGspID0+IHtyZXR1cm4gbW9kZWxba119KSApO1xyXG5cdFx0XHRcdH0gY2F0Y2goZSkge1xyXG5cdFx0XHRcdFx0bW9kZWwgPSB2b2lkIDA7XHJcblx0XHRcdFx0fSBmaW5hbGx5IHtcclxuICAgICAgICAgICAgICAgICAgICBtaSsrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRyZXR1cm4gbW9kZWw7XHJcblx0XHR9XHJcblxyXG4gICAgICAgIHByaXZhdGUgZXZhbHVhdGVGdW5jdGlvbihtb2RlbHM6IGFueVtdLCBwYXRoOiBzdHJpbmcpOiBhbnkge1xyXG4gICAgICAgICAgICBsZXQgZXhwID0gdGhpcy5ldmFsdWF0ZUV4cHJlc3Npb24uYmluZCh0aGlzLCBtb2RlbHMpO1xyXG5cdFx0XHR2YXIgW25hbWUsIGFyZ3NdID0gcGF0aC5zcGxpdCgnKCcpO1xyXG4gICAgICAgICAgICBhcmdzID0gYXJncy5zdWJzdHIoMCwgLS1hcmdzLmxlbmd0aCk7XHJcblxyXG4gICAgICAgICAgICBsZXQge3ZhbHVlLCBtb2RlbH0gPSB0aGlzLmV2YWx1YXRlVmFsdWVBbmRNb2RlbChtb2RlbHMsIG5hbWUpO1xyXG4gICAgICAgICAgICBsZXQgZnVuYzogRnVuY3Rpb24gPSB2YWx1ZTtcclxuICAgICAgICAgICAgbGV0IGFyZ0Fycjogc3RyaW5nW10gPSBhcmdzLnNwbGl0KCcuJykubWFwKChhcmcpID0+IHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBhcmcuaW5kZXhPZignIycpID09PSAwID9cclxuICAgICAgICAgICAgICAgICAgICBhcmcuc3Vic3RyKDEpIDpcclxuICAgICAgICAgICAgICAgICAgICBleHAoYXJnKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBmdW5jID0gZnVuYy5iaW5kKG1vZGVsLCAuLi5hcmdBcnIpO1xyXG5cclxuICAgICAgICAgICAgbGV0IGluZGV4ID0gaG8uY29tcG9uZW50cy50ZW1wLnNldChmdW5jKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBzdHIgPSBgaG8uY29tcG9uZW50cy50ZW1wLmNhbGwoJHtpbmRleH0pYDtcclxuICAgICAgICAgICAgcmV0dXJuIHN0cjtcclxuXHRcdH1cclxuXHJcblx0XHRwcml2YXRlIGNvcHlOb2RlKG5vZGU6IE5vZGUpOiBOb2RlIHtcclxuXHRcdFx0dmFyIGNvcHlOb2RlID0gdGhpcy5jb3B5Tm9kZS5iaW5kKHRoaXMpO1xyXG5cclxuICAgICAgICAgICAgdmFyIG4gPSA8Tm9kZT57XHJcblx0XHRcdFx0cGFyZW50OiBub2RlLnBhcmVudCxcclxuXHRcdFx0XHRodG1sOiBub2RlLmh0bWwsXHJcblx0XHRcdFx0dHlwZTogbm9kZS50eXBlLFxyXG5cdFx0XHRcdHNlbGZDbG9zaW5nOiBub2RlLnNlbGZDbG9zaW5nLFxyXG5cdFx0XHRcdHJlcGVhdDogbm9kZS5yZXBlYXQsXHJcblx0XHRcdFx0Y2hpbGRyZW46IG5vZGUuY2hpbGRyZW4ubWFwKGNvcHlOb2RlKVxyXG5cdFx0XHR9O1xyXG5cclxuXHRcdFx0cmV0dXJuIG47XHJcblx0XHR9XHJcblxyXG4gICAgICAgIHByaXZhdGUgaXNWb2lkKG5hbWU6IHN0cmluZyk6IGJvb2xlYW4ge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy52b2lkcy5pbmRleE9mKG5hbWUudG9Mb3dlckNhc2UoKSkgIT09IC0xO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGxldCBpbnN0YW5jZSA9IG5ldyBSZW5kZXJlcigpO1xyXG5cclxufVxyXG4iLCJtb2R1bGUgaG8uY29tcG9uZW50cy5odG1scHJvdmlkZXIge1xyXG4gICAgaW1wb3J0IFByb21pc2UgPSBoby5wcm9taXNlLlByb21pc2U7XHJcblxyXG4gICAgZXhwb3J0IGNsYXNzIEh0bWxQcm92aWRlciB7XHJcblxyXG4gICAgICAgIHByaXZhdGUgY2FjaGU6IHtba2F5OnN0cmluZ106c3RyaW5nfSA9IHt9O1xyXG5cclxuICAgICAgICByZXNvbHZlKG5hbWU6IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIGlmKGhvLmNvbXBvbmVudHMucmVnaXN0cnkudXNlRGlyKSB7XHJcbiAgICAgICAgICAgICAgICBuYW1lICs9ICcuJyArIG5hbWUuc3BsaXQoJy4nKS5wb3AoKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgbmFtZSA9IG5hbWUuc3BsaXQoJy4nKS5qb2luKCcvJyk7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gYGNvbXBvbmVudHMvJHtuYW1lfS5odG1sYDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGdldEhUTUwobmFtZTogc3RyaW5nKTogUHJvbWlzZTxzdHJpbmcsIHN0cmluZz4ge1xyXG4gICAgICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG5cclxuICAgICAgICAgICAgICAgIGlmKHR5cGVvZiB0aGlzLmNhY2hlW25hbWVdID09PSAnc3RyaW5nJylcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVzb2x2ZSh0aGlzLmNhY2hlW25hbWVdKTtcclxuXHJcbiAgICAgICAgICAgICAgICBsZXQgdXJsID0gdGhpcy5yZXNvbHZlKG5hbWUpO1xyXG5cclxuICAgICAgICAgICAgICAgIGxldCB4bWxodHRwID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XHJcbiAgICBcdFx0XHR4bWxodHRwLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgXHRcdFx0XHRpZih4bWxodHRwLnJlYWR5U3RhdGUgPT0gNCkge1xyXG4gICAgXHRcdFx0XHRcdGxldCByZXNwID0geG1saHR0cC5yZXNwb25zZVRleHQ7XHJcbiAgICBcdFx0XHRcdFx0aWYoeG1saHR0cC5zdGF0dXMgPT0gMjAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKHJlc3ApO1xyXG4gICAgXHRcdFx0XHRcdH0gZWxzZSB7XHJcbiAgICBcdFx0XHRcdFx0XHRyZWplY3QoYEVycm9yIHdoaWxlIGxvYWRpbmcgaHRtbCBmb3IgQ29tcG9uZW50ICR7bmFtZX1gKTtcclxuICAgIFx0XHRcdFx0XHR9XHJcbiAgICBcdFx0XHRcdH1cclxuICAgIFx0XHRcdH07XHJcblxyXG4gICAgXHRcdFx0eG1saHR0cC5vcGVuKCdHRVQnLCB1cmwsIHRydWUpO1xyXG4gICAgXHRcdFx0eG1saHR0cC5zZW5kKCk7XHJcblxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGxldCBpbnN0YW5jZSA9IG5ldyBIdG1sUHJvdmlkZXIoKTtcclxuXHJcbn1cclxuIiwibW9kdWxlIGhvLmNvbXBvbmVudHMge1xuXG5cdGltcG9ydCBQcm9taXNlID0gaG8ucHJvbWlzZS5Qcm9taXNlO1xuXG5cdC8qKlxuXHRcdEJhc2VjbGFzcyBmb3IgQXR0cmlidXRlcy5cblx0XHRVc2VkIEF0dHJpYnV0ZXMgbmVlZHMgdG8gYmUgc3BlY2lmaWVkIGJ5IENvbXBvbmVudCNhdHRyaWJ1dGVzIHByb3BlcnR5IHRvIGdldCBsb2FkZWQgcHJvcGVybHkuXG5cdCovXG5cdGV4cG9ydCBjbGFzcyBBdHRyaWJ1dGUge1xuXG5cdFx0cHJvdGVjdGVkIGVsZW1lbnQ6IEhUTUxFbGVtZW50O1xuXHRcdHByb3RlY3RlZCBjb21wb25lbnQ6IENvbXBvbmVudDtcblx0XHRwcm90ZWN0ZWQgdmFsdWU6IHN0cmluZztcblxuXHRcdGNvbnN0cnVjdG9yKGVsZW1lbnQ6IEhUTUxFbGVtZW50LCB2YWx1ZT86IHN0cmluZykge1xuXHRcdFx0dGhpcy5lbGVtZW50ID0gZWxlbWVudDtcblx0XHRcdHRoaXMuY29tcG9uZW50ID0gQ29tcG9uZW50LmdldENvbXBvbmVudChlbGVtZW50KTtcblx0XHRcdHRoaXMudmFsdWUgPSB2YWx1ZTtcblxuXHRcdFx0dGhpcy5pbml0KCk7XG5cdFx0fVxuXG5cdFx0cHJvdGVjdGVkIGluaXQoKTogdm9pZCB7fVxuXG5cdFx0Z2V0IG5hbWUoKSB7XG5cdFx0XHRyZXR1cm4gQXR0cmlidXRlLmdldE5hbWUodGhpcyk7XG5cdFx0fVxuXG5cblx0XHRwdWJsaWMgdXBkYXRlKCk6IHZvaWQge1xuXG5cdFx0fVxuXG5cblx0XHRzdGF0aWMgZ2V0TmFtZShjbGF6ejogdHlwZW9mIEF0dHJpYnV0ZSB8IEF0dHJpYnV0ZSk6IHN0cmluZyB7XG4gICAgICAgICAgICBpZihjbGF6eiBpbnN0YW5jZW9mIEF0dHJpYnV0ZSlcbiAgICAgICAgICAgICAgICByZXR1cm4gY2xhenouY29uc3RydWN0b3IudG9TdHJpbmcoKS5tYXRjaCgvXFx3Ky9nKVsxXTtcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICByZXR1cm4gY2xhenoudG9TdHJpbmcoKS5tYXRjaCgvXFx3Ky9nKVsxXTtcbiAgICAgICAgfVxuXHR9XG5cblx0ZXhwb3J0IGNsYXNzIFdhdGNoQXR0cmlidXRlIGV4dGVuZHMgQXR0cmlidXRlIHtcblxuXHRcdHByb3RlY3RlZCByOiBSZWdFeHAgPSAvIyguKz8pIy9nO1xuXG5cdFx0Y29uc3RydWN0b3IoZWxlbWVudDogSFRNTEVsZW1lbnQsIHZhbHVlPzogc3RyaW5nKSB7XG5cdFx0XHRzdXBlcihlbGVtZW50LCB2YWx1ZSk7XG5cblx0XHRcdGxldCBtOiBhbnlbXSA9IHRoaXMudmFsdWUubWF0Y2godGhpcy5yKSB8fCBbXTtcblx0XHRcdG0ubWFwKGZ1bmN0aW9uKHcpIHtcblx0XHRcdFx0dyA9IHcuc3Vic3RyKDEsIHcubGVuZ3RoLTIpO1xuXHRcdFx0XHR0aGlzLndhdGNoKHcpO1xuXHRcdFx0fS5iaW5kKHRoaXMpKTtcblx0XHRcdHRoaXMudmFsdWUgPSB0aGlzLnZhbHVlLnJlcGxhY2UoLyMvZywgJycpO1xuXHRcdH1cblxuXG5cdFx0cHJvdGVjdGVkIHdhdGNoKHBhdGg6IHN0cmluZyk6IHZvaWQge1xuXHRcdFx0bGV0IHBhdGhBcnIgPSBwYXRoLnNwbGl0KCcuJyk7XG5cdFx0XHRsZXQgcHJvcCA9IHBhdGhBcnIucG9wKCk7XG5cdFx0XHRsZXQgb2JqID0gdGhpcy5jb21wb25lbnQ7XG5cblx0XHRcdHBhdGhBcnIubWFwKChwYXJ0KSA9PiB7XG5cdFx0XHRcdG9iaiA9IG9ialtwYXJ0XTtcblx0XHRcdH0pO1xuXG5cdFx0XHRoby53YXRjaC53YXRjaChvYmosIHByb3AsIHRoaXMudXBkYXRlLmJpbmQodGhpcykpO1xuXHRcdH1cblxuXHRcdHByb3RlY3RlZCBldmFsKHBhdGg6IHN0cmluZyk6IGFueSB7XG5cdFx0XHRsZXQgbW9kZWwgPSB0aGlzLmNvbXBvbmVudDtcblx0XHRcdG1vZGVsID0gbmV3IEZ1bmN0aW9uKE9iamVjdC5rZXlzKG1vZGVsKS50b1N0cmluZygpLCBcInJldHVybiBcIiArIHBhdGgpXG5cdFx0XHRcdC5hcHBseShudWxsLCBPYmplY3Qua2V5cyhtb2RlbCkubWFwKChrKSA9PiB7cmV0dXJuIG1vZGVsW2tdfSkgKTtcblx0XHRcdHJldHVybiBtb2RlbDtcblx0XHR9XG5cblx0fVxufVxuIiwibW9kdWxlIGhvLmNvbXBvbmVudHMge1xyXG5cclxuICAgIGltcG9ydCBQcm9taXNlID0gaG8ucHJvbWlzZS5Qcm9taXNlO1xyXG4gICAgaW1wb3J0IEh0bWxQcm92aWRlciA9IGhvLmNvbXBvbmVudHMuaHRtbHByb3ZpZGVyLmluc3RhbmNlO1xyXG4gICAgaW1wb3J0IFJlbmRlcmVyID0gaG8uY29tcG9uZW50cy5yZW5kZXJlci5pbnN0YW5jZTtcclxuXHJcbiAgICBleHBvcnQgaW50ZXJmYWNlIENvbXBvbmVudEVsZW1lbnQgZXh0ZW5kcyBIVE1MRWxlbWVudCB7XHJcbiAgICAgICAgY29tcG9uZW50PzogQ29tcG9uZW50O1xyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBpbnRlcmZhY2UgSVByb3ByZXR5IHtcclxuICAgICAgICBuYW1lOiBzdHJpbmc7XHJcbiAgICAgICAgcmVxdWlyZWQ/OiBib29sZWFuO1xyXG4gICAgICAgIGRlZmF1bHQ/OiBhbnk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgICAgQmFzZWNsYXNzIGZvciBDb21wb25lbnRzXHJcbiAgICAgICAgaW1wb3J0YW50OiBkbyBpbml0aWFsaXphdGlvbiB3b3JrIGluIENvbXBvbmVudCNpbml0XHJcbiAgICAqL1xyXG4gICAgZXhwb3J0IGNsYXNzIENvbXBvbmVudCB7XHJcbiAgICAgICAgcHVibGljIGVsZW1lbnQ6IENvbXBvbmVudEVsZW1lbnQ7XHJcbiAgICAgICAgcHVibGljIG9yaWdpbmFsX2lubmVySFRNTDogc3RyaW5nO1xyXG4gICAgICAgIHB1YmxpYyBodG1sOiBzdHJpbmcgPSAnJztcclxuICAgICAgICBwdWJsaWMgc3R5bGU6IHN0cmluZyA9ICcnO1xyXG4gICAgICAgIHB1YmxpYyBwcm9wZXJ0aWVzOiBBcnJheTxzdHJpbmd8SVByb3ByZXR5PiA9IFtdO1xyXG4gICAgICAgIHB1YmxpYyBhdHRyaWJ1dGVzOiBBcnJheTxzdHJpbmc+ID0gW107XHJcbiAgICAgICAgcHVibGljIHJlcXVpcmVzOiBBcnJheTxzdHJpbmc+ID0gW107XHJcbiAgICAgICAgcHVibGljIGNoaWxkcmVuOiB7W2tleTogc3RyaW5nXTogYW55fSA9IHt9O1xyXG5cclxuICAgICAgICBjb25zdHJ1Y3RvcihlbGVtZW50OiBIVE1MRWxlbWVudCkge1xyXG4gICAgICAgICAgICAvLy0tLS0tLS0gaW5pdCBFbGVtZW5ldCBhbmQgRWxlbWVudHMnIG9yaWdpbmFsIGlubmVySFRNTFxyXG4gICAgICAgICAgICB0aGlzLmVsZW1lbnQgPSBlbGVtZW50O1xyXG4gICAgICAgICAgICB0aGlzLmVsZW1lbnQuY29tcG9uZW50ID0gdGhpcztcclxuICAgICAgICAgICAgdGhpcy5vcmlnaW5hbF9pbm5lckhUTUwgPSBlbGVtZW50LmlubmVySFRNTDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBnZXQgbmFtZSgpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICByZXR1cm4gQ29tcG9uZW50LmdldE5hbWUodGhpcyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgZ2V0TmFtZSgpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5uYW1lO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIGdldFBhcmVudCgpOiBDb21wb25lbnQge1xyXG4gICAgICAgICAgICByZXR1cm4gQ29tcG9uZW50LmdldENvbXBvbmVudCg8Q29tcG9uZW50RWxlbWVudD50aGlzLmVsZW1lbnQucGFyZW50Tm9kZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgX2luaXQoKTogUHJvbWlzZTxhbnksIGFueT4ge1xyXG4gICAgICAgICAgICBsZXQgcmVuZGVyID0gdGhpcy5yZW5kZXIuYmluZCh0aGlzKTtcclxuICAgICAgICAgICAgLy8tLS0tLS0tLSBpbml0IFByb3BlcnRpZXNcclxuICAgICAgICAgICAgdGhpcy5pbml0UHJvcGVydGllcygpO1xyXG5cclxuICAgICAgICAgICAgLy8tLS0tLS0tIGNhbGwgaW5pdCgpICYgbG9hZFJlcXVpcmVtZW50cygpIC0+IHRoZW4gcmVuZGVyXHJcbiAgICAgICAgICAgIGxldCByZWFkeSA9IFt0aGlzLmluaXRIVE1MKCksIFByb21pc2UuY3JlYXRlKHRoaXMuaW5pdCgpKSwgdGhpcy5sb2FkUmVxdWlyZW1lbnRzKCldO1xyXG5cclxuICAgICAgICAgICAgbGV0IHAgPSBuZXcgUHJvbWlzZTxhbnksIGFueT4oKTtcclxuXHJcbiAgICAgICAgICAgIFByb21pc2UuYWxsKHJlYWR5KVxyXG4gICAgICAgICAgICAudGhlbigoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBwLnJlc29sdmUoKTtcclxuICAgICAgICAgICAgICAgIHJlbmRlcigpO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAuY2F0Y2goKGVycikgPT4ge1xyXG4gICAgICAgICAgICAgICAgcC5yZWplY3QoZXJyKTtcclxuICAgICAgICAgICAgICAgIHRocm93IGVycjtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gcDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAgICBNZXRob2QgdGhhdCBnZXQgY2FsbGVkIGFmdGVyIGluaXRpYWxpemF0aW9uIG9mIGEgbmV3IGluc3RhbmNlLlxyXG4gICAgICAgICAgICBEbyBpbml0LXdvcmsgaGVyZS5cclxuICAgICAgICAgICAgTWF5IHJldHVybiBhIFByb21pc2UuXHJcbiAgICAgICAgKi9cclxuICAgICAgICBwdWJsaWMgaW5pdCgpOiBhbnkge31cclxuXHJcbiAgICAgICAgcHVibGljIHVwZGF0ZSgpOiB2b2lkIHtyZXR1cm4gdm9pZCAwO31cclxuXHJcbiAgICAgICAgcHVibGljIHJlbmRlcigpOiB2b2lkIHtcclxuICAgIFx0XHRSZW5kZXJlci5yZW5kZXIodGhpcyk7XHJcblxyXG4gICAgXHRcdGhvLmNvbXBvbmVudHMucmVnaXN0cnkuaW5zdGFuY2UuaW5pdEVsZW1lbnQodGhpcy5lbGVtZW50KVxyXG4gICAgICAgICAgICAudGhlbihmdW5jdGlvbigpIHtcclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLmluaXRDaGlsZHJlbigpO1xyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMuaW5pdFN0eWxlKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy5pbml0QXR0cmlidXRlcygpO1xyXG5cclxuICAgIFx0XHRcdHRoaXMudXBkYXRlKCk7XHJcblxyXG4gICAgICAgICAgICB9LmJpbmQodGhpcykpO1xyXG4gICAgXHR9O1xyXG5cclxuICAgICAgICBwcml2YXRlIGluaXRTdHlsZSgpOiB2b2lkIHtcclxuICAgICAgICAgICAgaWYodHlwZW9mIHRoaXMuc3R5bGUgPT09ICd1bmRlZmluZWQnKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICBpZih0aGlzLnN0eWxlID09PSBudWxsKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICBpZih0eXBlb2YgdGhpcy5zdHlsZSA9PT0gJ3N0cmluZycgJiYgdGhpcy5zdHlsZS5sZW5ndGggPT09IDApXHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICAgICAgICBzdHlsZXIuaW5zdGFuY2UuYXBwbHlTdHlsZSh0aGlzKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICogIEFzc3VyZSB0aGF0IHRoaXMgaW5zdGFuY2UgaGFzIGFuIHZhbGlkIGh0bWwgYXR0cmlidXRlIGFuZCBpZiBub3QgbG9hZCBhbmQgc2V0IGl0LlxyXG4gICAgICAgICovXHJcbiAgICAgICAgcHJpdmF0ZSBpbml0SFRNTCgpOiBQcm9taXNlPGFueSxhbnk+IHtcclxuICAgICAgICAgICAgbGV0IHAgPSBuZXcgUHJvbWlzZSgpO1xyXG4gICAgICAgICAgICBsZXQgc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgICAgICAgICBpZih0eXBlb2YgdGhpcy5odG1sID09PSAndW5kZWZpbmVkJykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5odG1sID0gJyc7XHJcbiAgICAgICAgICAgICAgICBwLnJlc29sdmUoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGlmKHRoaXMuaHRtbC5pbmRleE9mKFwiLmh0bWxcIiwgdGhpcy5odG1sLmxlbmd0aCAtIFwiLmh0bWxcIi5sZW5ndGgpICE9PSAtMSkge1xyXG4gICAgICAgICAgICAgICAgICAgIEh0bWxQcm92aWRlci5nZXRIVE1MKHRoaXMubmFtZSlcclxuICAgICAgICAgICAgICAgICAgICAudGhlbigoaHRtbCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLmh0bWwgPSBodG1sO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwLnJlc29sdmUoKTtcclxuICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgICAgIC5jYXRjaChwLnJlamVjdCk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHAucmVzb2x2ZSgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gcDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByaXZhdGUgaW5pdFByb3BlcnRpZXMoKTogdm9pZCB7XHJcbiAgICAgICAgICAgIHRoaXMucHJvcGVydGllcy5mb3JFYWNoKGZ1bmN0aW9uKHByb3ApIHtcclxuICAgICAgICAgICAgICAgIGlmKHR5cGVvZiBwcm9wID09PSAnb2JqZWN0Jykge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucHJvcGVydGllc1twcm9wLm5hbWVdID0gdGhpcy5lbGVtZW50W3Byb3AubmFtZV0gfHwgdGhpcy5lbGVtZW50LmdldEF0dHJpYnV0ZShwcm9wLm5hbWUpIHx8IHByb3AuZGVmYXVsdDtcclxuICAgICAgICAgICAgICAgICAgICBpZih0aGlzLnByb3BlcnRpZXNbcHJvcC5uYW1lXSA9PT0gdW5kZWZpbmVkICYmIHByb3AucmVxdWlyZWQgPT09IHRydWUpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IGBQcm9wZXJ0eSAke3Byb3AubmFtZX0gaXMgcmVxdWlyZWQgYnV0IG5vdCBwcm92aWRlZGA7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIGlmKHR5cGVvZiBwcm9wID09PSAnc3RyaW5nJylcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnByb3BlcnRpZXNbcHJvcF0gPSB0aGlzLmVsZW1lbnRbcHJvcF0gfHwgdGhpcy5lbGVtZW50LmdldEF0dHJpYnV0ZShwcm9wKTtcclxuICAgICAgICAgICAgfS5iaW5kKHRoaXMpKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByaXZhdGUgaW5pdENoaWxkcmVuKCk6IHZvaWQge1xyXG4gICAgICAgICAgICBsZXQgY2hpbGRzID0gdGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJyonKTtcclxuICAgIFx0XHRmb3IobGV0IGMgPSAwOyBjIDwgY2hpbGRzLmxlbmd0aDsgYysrKSB7XHJcbiAgICBcdFx0XHRsZXQgY2hpbGQ6IEVsZW1lbnQgPSA8RWxlbWVudD5jaGlsZHNbY107XHJcbiAgICBcdFx0XHRpZihjaGlsZC5pZCkge1xyXG4gICAgXHRcdFx0XHR0aGlzLmNoaWxkcmVuW2NoaWxkLmlkXSA9IGNoaWxkO1xyXG4gICAgXHRcdFx0fVxyXG4gICAgXHRcdFx0aWYoY2hpbGQudGFnTmFtZSlcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNoaWxkcmVuW2NoaWxkLnRhZ05hbWVdID0gdGhpcy5jaGlsZHJlbltjaGlsZC50YWdOYW1lXSB8fCBbXTtcclxuICAgICAgICAgICAgICAgICg8RWxlbWVudFtdPnRoaXMuY2hpbGRyZW5bY2hpbGQudGFnTmFtZV0pLnB1c2goY2hpbGQpO1xyXG4gICAgXHRcdH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByaXZhdGUgaW5pdEF0dHJpYnV0ZXMoKTogdm9pZCB7XHJcbiAgICAgICAgICAgIHRoaXMuYXR0cmlidXRlc1xyXG4gICAgICAgICAgICAuZm9yRWFjaCgoYSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgbGV0IGF0dHIgPSBoby5jb21wb25lbnRzLnJlZ2lzdHJ5Lmluc3RhbmNlLmdldEF0dHJpYnV0ZShhKTtcclxuICAgICAgICAgICAgICAgIEFycmF5LnByb3RvdHlwZS5mb3JFYWNoLmNhbGwodGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoYCpbJHthfV1gKSwgKGU6IEhUTUxFbGVtZW50KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHZhbCA9IGUuaGFzT3duUHJvcGVydHkoYSkgPyBlW2FdIDogZS5nZXRBdHRyaWJ1dGUoYSk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYodHlwZW9mIHZhbCA9PT0gJ3N0cmluZycgJiYgdmFsID09PSAnJylcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsID0gdm9pZCAwO1xyXG4gICAgICAgICAgICAgICAgICAgIG5ldyBhdHRyKGUsIHZhbCkudXBkYXRlKCk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIGxvYWRSZXF1aXJlbWVudHMoKSB7XHJcbiAgICBcdFx0bGV0IGNvbXBvbmVudHM6IGFueVtdID0gdGhpcy5yZXF1aXJlc1xyXG4gICAgICAgICAgICAuZmlsdGVyKChyZXEpID0+IHtcclxuICAgICAgICAgICAgICAgIHJldHVybiAhaG8uY29tcG9uZW50cy5yZWdpc3RyeS5pbnN0YW5jZS5oYXNDb21wb25lbnQocmVxKTtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLm1hcCgocmVxKSA9PiB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gaG8uY29tcG9uZW50cy5yZWdpc3RyeS5pbnN0YW5jZS5sb2FkQ29tcG9uZW50KHJlcSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuXHJcbiAgICAgICAgICAgIGxldCBhdHRyaWJ1dGVzOiBhbnlbXSA9IHRoaXMuYXR0cmlidXRlc1xyXG4gICAgICAgICAgICAuZmlsdGVyKChyZXEpID0+IHtcclxuICAgICAgICAgICAgICAgIHJldHVybiAhaG8uY29tcG9uZW50cy5yZWdpc3RyeS5pbnN0YW5jZS5oYXNBdHRyaWJ1dGUocmVxKTtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLm1hcCgocmVxKSA9PiB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gaG8uY29tcG9uZW50cy5yZWdpc3RyeS5pbnN0YW5jZS5sb2FkQXR0cmlidXRlKHJlcSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuXHJcbiAgICAgICAgICAgIGxldCBwcm9taXNlcyA9IGNvbXBvbmVudHMuY29uY2F0KGF0dHJpYnV0ZXMpO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIFByb21pc2UuYWxsKHByb21pc2VzKTtcclxuICAgIFx0fTtcclxuXHJcbiAgICAgICAgLypcclxuICAgICAgICBzdGF0aWMgcmVnaXN0ZXIoYzogdHlwZW9mIENvbXBvbmVudCk6IHZvaWQge1xyXG4gICAgICAgICAgICBoby5jb21wb25lbnRzLnJlZ2lzdHJ5Lmluc3RhbmNlLnJlZ2lzdGVyKGMpO1xyXG4gICAgICAgIH1cclxuICAgICAgICAqL1xyXG5cclxuICAgICAgICAvKlxyXG4gICAgICAgIHN0YXRpYyBydW4ob3B0PzogYW55KSB7XHJcbiAgICAgICAgICAgIGhvLmNvbXBvbmVudHMucmVnaXN0cnkuaW5zdGFuY2Uuc2V0T3B0aW9ucyhvcHQpO1xyXG4gICAgICAgICAgICBoby5jb21wb25lbnRzLnJlZ2lzdHJ5Lmluc3RhbmNlLnJ1bigpO1xyXG4gICAgICAgIH1cclxuICAgICAgICAqL1xyXG5cclxuICAgICAgICBzdGF0aWMgZ2V0Q29tcG9uZW50KGVsZW1lbnQ6IENvbXBvbmVudEVsZW1lbnQpOiBDb21wb25lbnQge1xyXG4gICAgICAgICAgICB3aGlsZSghZWxlbWVudC5jb21wb25lbnQpXHJcbiAgICBcdFx0XHRlbGVtZW50ID0gPENvbXBvbmVudEVsZW1lbnQ+ZWxlbWVudC5wYXJlbnROb2RlO1xyXG4gICAgXHRcdHJldHVybiBlbGVtZW50LmNvbXBvbmVudDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHN0YXRpYyBnZXROYW1lKGNsYXp6OiB0eXBlb2YgQ29tcG9uZW50KTogc3RyaW5nO1xyXG4gICAgICAgIHN0YXRpYyBnZXROYW1lKGNsYXp6OiBDb21wb25lbnQpOiBzdHJpbmc7XHJcbiAgICAgICAgc3RhdGljIGdldE5hbWUoY2xheno6ICh0eXBlb2YgQ29tcG9uZW50KSB8IChDb21wb25lbnQpKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgaWYoY2xhenogaW5zdGFuY2VvZiBDb21wb25lbnQpXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gY2xhenouY29uc3RydWN0b3IudG9TdHJpbmcoKS5tYXRjaCgvXFx3Ky9nKVsxXTtcclxuICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGNsYXp6LnRvU3RyaW5nKCkubWF0Y2goL1xcdysvZylbMV07XHJcbiAgICAgICAgfVxyXG5cclxuXHJcbiAgICB9XHJcbn1cclxuIiwibW9kdWxlIGhvLmNvbXBvbmVudHMucmVnaXN0cnkge1xyXG4gICAgaW1wb3J0IFByb21pc2UgPSBoby5wcm9taXNlLlByb21pc2U7XHJcblxyXG4gICAgZXhwb3J0IGxldCBtYXBwaW5nOiB7W2tleTpzdHJpbmddOnN0cmluZ30gPSB7fTtcclxuICAgIGV4cG9ydCBsZXQgdXNlRGlyID0gdHJ1ZTtcclxuXHJcbiAgICBleHBvcnQgY2xhc3MgUmVnaXN0cnkge1xyXG5cclxuICAgICAgICBwcml2YXRlIGNvbXBvbmVudHM6IEFycmF5PHR5cGVvZiBDb21wb25lbnQ+ID0gW107XHJcbiAgICAgICAgcHJpdmF0ZSBhdHRyaWJ1dGVzOiBBcnJheTx0eXBlb2YgQXR0cmlidXRlPiA9IFtdO1xyXG5cclxuICAgICAgICBwcml2YXRlIGNvbXBvbmVudExvYWRlciA9IG5ldyBoby5jbGFzc2xvYWRlci5DbGFzc0xvYWRlcih7XHJcbiAgICAgICAgICAgIHVybFRlbXBsYXRlOiAnY29tcG9uZW50cy8ke25hbWV9LmpzJyxcclxuICAgICAgICAgICAgdXNlRGlyXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHByaXZhdGUgYXR0cmlidXRlTG9hZGVyID0gbmV3IGhvLmNsYXNzbG9hZGVyLkNsYXNzTG9hZGVyKHtcclxuICAgICAgICAgICAgdXJsVGVtcGxhdGU6ICdhdHRyaWJ1dGVzLyR7bmFtZX0uanMnLFxyXG4gICAgICAgICAgICB1c2VEaXJcclxuICAgICAgICB9KTtcclxuXHJcblxyXG5cclxuICAgICAgICBwdWJsaWMgcmVnaXN0ZXIoY2E6IHR5cGVvZiBDb21wb25lbnQgfCB0eXBlb2YgQXR0cmlidXRlKTogdm9pZCB7XHJcbiAgICAgICAgICAgIGlmKGNhLnByb3RvdHlwZSBpbnN0YW5jZW9mIENvbXBvbmVudCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jb21wb25lbnRzLnB1c2goPHR5cGVvZiBDb21wb25lbnQ+Y2EpO1xyXG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuY3JlYXRlRWxlbWVudChDb21wb25lbnQuZ2V0TmFtZSg8dHlwZW9mIENvbXBvbmVudD5jYSkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYoY2EucHJvdG90eXBlIGluc3RhbmNlb2YgQXR0cmlidXRlKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmF0dHJpYnV0ZXMucHVzaCg8dHlwZW9mIEF0dHJpYnV0ZT5jYSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBydW4oKTogUHJvbWlzZTxhbnksIGFueT4ge1xyXG4gICAgICAgICAgICBsZXQgaW5pdENvbXBvbmVudDogKGM6IHR5cGVvZiBDb21wb25lbnQpPT5Qcm9taXNlPGFueSwgYW55PiA9IHRoaXMuaW5pdENvbXBvbmVudC5iaW5kKHRoaXMpO1xyXG4gICAgICAgICAgICBsZXQgcHJvbWlzZXM6IEFycmF5PFByb21pc2U8YW55LCBhbnk+PiA9IHRoaXMuY29tcG9uZW50cy5tYXAoKGMpPT57XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gaW5pdENvbXBvbmVudCg8YW55PmMpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBQcm9taXNlLmFsbChwcm9taXNlcyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgaW5pdENvbXBvbmVudChjb21wb25lbnQ6IHR5cGVvZiBDb21wb25lbnQsIGVsZW1lbnQ6SFRNTEVsZW1lbnR8RG9jdW1lbnQ9ZG9jdW1lbnQpOiBQcm9taXNlPGFueSwgYW55PiB7XHJcbiAgICAgICAgICAgIGxldCBwcm9taXNlczogQXJyYXk8UHJvbWlzZTxhbnksIGFueT4+ID0gQXJyYXkucHJvdG90eXBlLm1hcC5jYWxsKFxyXG4gICAgICAgICAgICAgICAgZWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKENvbXBvbmVudC5nZXROYW1lKGNvbXBvbmVudCkpLFxyXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24oZSk6IFByb21pc2U8YW55LCBhbnk+IHtcclxuXHQgICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBjb21wb25lbnQoZSkuX2luaXQoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHRcdFx0KTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBQcm9taXNlLmFsbChwcm9taXNlcyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgaW5pdEVsZW1lbnQoZWxlbWVudDogSFRNTEVsZW1lbnQpOiBQcm9taXNlPGFueSwgYW55PiB7XHJcbiAgICAgICAgICAgIGxldCBpbml0Q29tcG9uZW50OiAoYzogdHlwZW9mIENvbXBvbmVudCwgZWxlbWVudDogSFRNTEVsZW1lbnQpPT5Qcm9taXNlPGFueSwgYW55PiA9IHRoaXMuaW5pdENvbXBvbmVudC5iaW5kKHRoaXMpO1xyXG4gICAgICAgICAgICBsZXQgcHJvbWlzZXM6IEFycmF5PFByb21pc2U8YW55LCBhbnk+PiA9IEFycmF5LnByb3RvdHlwZS5tYXAuY2FsbChcclxuICAgICAgICAgICAgICAgIHRoaXMuY29tcG9uZW50cyxcclxuICAgICAgICAgICAgICAgIGNvbXBvbmVudCA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGluaXRDb21wb25lbnQoY29tcG9uZW50LCBlbGVtZW50KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgKTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBQcm9taXNlLmFsbChwcm9taXNlcyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgaGFzQ29tcG9uZW50KG5hbWU6IHN0cmluZyk6IGJvb2xlYW4ge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jb21wb25lbnRzXHJcbiAgICAgICAgICAgICAgICAuZmlsdGVyKChjb21wb25lbnQpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gQ29tcG9uZW50LmdldE5hbWUoY29tcG9uZW50KSA9PT0gbmFtZTtcclxuICAgICAgICAgICAgICAgIH0pLmxlbmd0aCA+IDA7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgaGFzQXR0cmlidXRlKG5hbWU6IHN0cmluZyk6IGJvb2xlYW4ge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5hdHRyaWJ1dGVzXHJcbiAgICAgICAgICAgICAgICAuZmlsdGVyKChhdHRyaWJ1dGUpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gQXR0cmlidXRlLmdldE5hbWUoYXR0cmlidXRlKSA9PT0gbmFtZTtcclxuICAgICAgICAgICAgICAgIH0pLmxlbmd0aCA+IDA7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgZ2V0QXR0cmlidXRlKG5hbWU6IHN0cmluZyk6IHR5cGVvZiBBdHRyaWJ1dGUge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5hdHRyaWJ1dGVzXHJcbiAgICAgICAgICAgIC5maWx0ZXIoKGF0dHJpYnV0ZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIEF0dHJpYnV0ZS5nZXROYW1lKGF0dHJpYnV0ZSkgPT09IG5hbWU7XHJcbiAgICAgICAgICAgIH0pWzBdO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIGxvYWRDb21wb25lbnQobmFtZTogc3RyaW5nKTogUHJvbWlzZTx0eXBlb2YgQ29tcG9uZW50LCBzdHJpbmc+IHtcclxuICAgICAgICAgICAgbGV0IHNlbGYgPSB0aGlzO1xyXG4gICAgICAgICAgICBsZXQgc3VwID0gdGhpcy5jb21wb25lbnRzLm1hcChjID0+IHtyZXR1cm4gQ29tcG9uZW50LmdldE5hbWUoYyl9KS5jb25jYXQoW1wiaG8uY29tcG9uZW50cy5Db21wb25lbnRcIl0pXHJcblxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jb21wb25lbnRMb2FkZXIubG9hZCh7XHJcbiAgICAgICAgICAgICAgICBuYW1lLFxyXG4gICAgICAgICAgICAgICAgdXJsOiBtYXBwaW5nW25hbWVdLFxyXG4gICAgICAgICAgICAgICAgc3VwZXI6IHN1cFxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAudGhlbihjbGFzc2VzID0+IHtcclxuICAgICAgICAgICAgICAgIGNsYXNzZXMubWFwKGMgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHNlbGYucmVnaXN0ZXIoPHR5cGVvZiBDb21wb25lbnQ+Yyk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBjbGFzc2VzLnBvcCgpO1xyXG4gICAgICAgICAgICB9KVxyXG5cclxuXHJcbiAgICAgICAgICAgIC8qXHJcbiAgICAgICAgICAgIGxldCBzZWxmID0gdGhpcztcclxuXHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmdldFBhcmVudE9mQ29tcG9uZW50KG5hbWUpXHJcbiAgICAgICAgICAgIC50aGVuKChwYXJlbnQpID0+IHtcclxuICAgICAgICAgICAgICAgIGlmKHNlbGYuaGFzQ29tcG9uZW50KHBhcmVudCkgfHwgcGFyZW50ID09PSAnaG8uY29tcG9uZW50cy5Db21wb25lbnQnKVxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICAgICAgZWxzZSByZXR1cm4gc2VsZi5sb2FkQ29tcG9uZW50KHBhcmVudCk7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC50aGVuKChwYXJlbnRUeXBlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gaG8uY29tcG9uZW50cy5jb21wb25lbnRwcm92aWRlci5pbnN0YW5jZS5nZXRDb21wb25lbnQobmFtZSlcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLnRoZW4oKGNvbXBvbmVudCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgc2VsZi5yZWdpc3Rlcihjb21wb25lbnQpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGNvbXBvbmVudDtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIC8vcmV0dXJuIHRoaXMub3B0aW9ucy5jb21wb25lbnRQcm92aWRlci5nZXRDb21wb25lbnQobmFtZSlcclxuICAgICAgICAgICAgKi9cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBsb2FkQXR0cmlidXRlKG5hbWU6IHN0cmluZyk6IFByb21pc2U8dHlwZW9mIEF0dHJpYnV0ZSwgc3RyaW5nPiB7XHJcblxyXG4gICAgICAgICAgICBsZXQgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgICAgIGxldCBiYXNlID0gW1wiaG8uY29tcG9uZW50cy5BdHRyaWJ1dGVcIiwgXCJoby5jb21wb25lbnRzLldhdGNoQXR0cmlidXRlXCJdO1xyXG4gICAgICAgICAgICBsZXQgc3VwID0gdGhpcy5hdHRyaWJ1dGVzLm1hcChhID0+IHtyZXR1cm4gQXR0cmlidXRlLmdldE5hbWUoYSl9KS5jb25jYXQoYmFzZSlcclxuXHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmF0dHJpYnV0ZUxvYWRlci5sb2FkKHtcclxuICAgICAgICAgICAgICAgIG5hbWUsXHJcbiAgICAgICAgICAgICAgICB1cmw6IG1hcHBpbmdbbmFtZV0sXHJcbiAgICAgICAgICAgICAgICBzdXBlcjogc3VwXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC50aGVuKGNsYXNzZXMgPT4ge1xyXG4gICAgICAgICAgICAgICAgY2xhc3Nlcy5tYXAoYyA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5yZWdpc3Rlcig8dHlwZW9mIEF0dHJpYnV0ZT5jKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGNsYXNzZXMucG9wKCk7XHJcbiAgICAgICAgICAgIH0pXHJcblxyXG5cclxuICAgICAgICAgICAgLypcclxuICAgICAgICAgICAgbGV0IHNlbGYgPSB0aGlzO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZ2V0UGFyZW50T2ZBdHRyaWJ1dGUobmFtZSlcclxuICAgICAgICAgICAgLnRoZW4oKHBhcmVudCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYoc2VsZi5oYXNBdHRyaWJ1dGUocGFyZW50KSB8fCBwYXJlbnQgPT09ICdoby5jb21wb25lbnRzLkF0dHJpYnV0ZScgfHwgcGFyZW50ID09PSAnaG8uY29tcG9uZW50cy5XYXRjaEF0dHJpYnV0ZScpXHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgICAgICBlbHNlIHJldHVybiBzZWxmLmxvYWRBdHRyaWJ1dGUocGFyZW50KTtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLnRoZW4oKHBhcmVudFR5cGUpID0+IHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBoby5jb21wb25lbnRzLmF0dHJpYnV0ZXByb3ZpZGVyLmluc3RhbmNlLmdldEF0dHJpYnV0ZShuYW1lKVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAudGhlbigoYXR0cmlidXRlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBzZWxmLnJlZ2lzdGVyKGF0dHJpYnV0ZSk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gYXR0cmlidXRlO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgKi9cclxuXHJcbiAgICAgICAgICAgIC8qXHJcbiAgICAgICAgICAgIGxldCBzZWxmID0gdGhpcztcclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlPHR5cGVvZiBBdHRyaWJ1dGUsIHN0cmluZz4oKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgaG8uY29tcG9uZW50cy5hdHRyaWJ1dGVwcm92aWRlci5pbnN0YW5jZS5nZXRBdHRyaWJ1dGUobmFtZSlcclxuICAgICAgICAgICAgICAgIC50aGVuKChhdHRyaWJ1dGUpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBzZWxmLnJlZ2lzdGVyKGF0dHJpYnV0ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShhdHRyaWJ1dGUpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAqL1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLypcclxuXHJcbiAgICAgICAgcHJvdGVjdGVkIGdldFBhcmVudE9mQ29tcG9uZW50KG5hbWU6IHN0cmluZyk6IFByb21pc2U8c3RyaW5nLCBhbnk+IHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZ2V0UGFyZW50T2ZDbGFzcyhoby5jb21wb25lbnRzLmNvbXBvbmVudHByb3ZpZGVyLmluc3RhbmNlLnJlc29sdmUobmFtZSkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJvdGVjdGVkIGdldFBhcmVudE9mQXR0cmlidXRlKG5hbWU6IHN0cmluZyk6IFByb21pc2U8c3RyaW5nLCBhbnk+IHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZ2V0UGFyZW50T2ZDbGFzcyhoby5jb21wb25lbnRzLmF0dHJpYnV0ZXByb3ZpZGVyLmluc3RhbmNlLnJlc29sdmUobmFtZSkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJvdGVjdGVkIGdldFBhcmVudE9mQ2xhc3MocGF0aDogc3RyaW5nKTogUHJvbWlzZTxzdHJpbmcsIGFueT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG5cclxuICAgICAgICAgICAgICAgIGxldCB4bWxodHRwID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XHJcbiAgICAgICAgICAgICAgICB4bWxodHRwLm9ucmVhZHlzdGF0ZWNoYW5nZSA9ICgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBpZih4bWxodHRwLnJlYWR5U3RhdGUgPT0gNCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgcmVzcCA9IHhtbGh0dHAucmVzcG9uc2VUZXh0O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZih4bWxodHRwLnN0YXR1cyA9PSAyMDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBtID0gcmVzcC5tYXRjaCgvfVxcKVxcKCguKilcXCk7Lyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZihtICE9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShtWzFdKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUobnVsbCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZWplY3QocmVzcCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgICAgICB4bWxodHRwLm9wZW4oJ0dFVCcsIHBhdGgpO1xyXG4gICAgICAgICAgICAgICAgeG1saHR0cC5zZW5kKCk7XHJcblxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgICovXHJcblxyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBsZXQgaW5zdGFuY2UgPSBuZXcgUmVnaXN0cnkoKTtcclxufVxyXG4iLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vLi4vLi4vYm93ZXJfY29tcG9uZW50cy9oby1wcm9taXNlL2Rpc3QvcHJvbWlzZS5kLnRzXCIvPlxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uLy4uLy4uL2Jvd2VyX2NvbXBvbmVudHMvaG8tY2xhc3Nsb2FkZXIvZGlzdC9jbGFzc2xvYWRlci5kLnRzXCIvPlxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uLy4uLy4uL2Jvd2VyX2NvbXBvbmVudHMvaG8td2F0Y2gvZGlzdC93YXRjaC5kLnRzXCIvPlxuXG5tb2R1bGUgaG8uY29tcG9uZW50cyB7XG5cdGV4cG9ydCBmdW5jdGlvbiBydW4oKTogaG8ucHJvbWlzZS5Qcm9taXNlPGFueSwgYW55PiB7XG5cdFx0cmV0dXJuIGhvLmNvbXBvbmVudHMucmVnaXN0cnkuaW5zdGFuY2UucnVuKCk7XG5cdH1cblxuXHRleHBvcnQgZnVuY3Rpb24gcmVnaXN0ZXIoYzogdHlwZW9mIENvbXBvbmVudCB8IHR5cGVvZiBBdHRyaWJ1dGUpOiB2b2lkIHtcblx0XHRoby5jb21wb25lbnRzLnJlZ2lzdHJ5Lmluc3RhbmNlLnJlZ2lzdGVyKGMpO1xuXHR9XG5cbn1cbiIsIm1vZHVsZSBoby5mbHV4IHtcclxuXHJcblx0ZXhwb3J0IGNsYXNzIENhbGxiYWNrSG9sZGVyIHtcclxuXHJcblx0XHRwcm90ZWN0ZWQgcHJlZml4OiBzdHJpbmcgPSAnSURfJztcclxuICAgIFx0cHJvdGVjdGVkIGxhc3RJRDogbnVtYmVyID0gMTtcclxuXHRcdHByb3RlY3RlZCBjYWxsYmFja3M6IHtba2V5OnN0cmluZ106RnVuY3Rpb259ID0ge307XHJcblxyXG5cdFx0cHVibGljIHJlZ2lzdGVyKGNhbGxiYWNrOiBGdW5jdGlvbiwgc2VsZj86IGFueSk6IHN0cmluZyB7XHJcbiAgICBcdFx0bGV0IGlkID0gdGhpcy5wcmVmaXggKyB0aGlzLmxhc3RJRCsrO1xyXG4gICAgXHRcdHRoaXMuY2FsbGJhY2tzW2lkXSA9IHNlbGYgPyBjYWxsYmFjay5iaW5kKHNlbGYpIDogY2FsbGJhY2s7XHJcbiAgICBcdFx0cmV0dXJuIGlkO1xyXG4gIFx0XHR9XHJcblxyXG4gIFx0XHRwdWJsaWMgdW5yZWdpc3RlcihpZCkge1xyXG4gICAgICBcdFx0aWYoIXRoaXMuY2FsbGJhY2tzW2lkXSlcclxuXHRcdFx0XHR0aHJvdyAnQ291bGQgbm90IHVucmVnaXN0ZXIgY2FsbGJhY2sgZm9yIGlkICcgKyBpZDtcclxuICAgIFx0XHRkZWxldGUgdGhpcy5jYWxsYmFja3NbaWRdO1xyXG4gIFx0XHR9O1xyXG5cdH1cclxufVxyXG4iLCJcclxubW9kdWxlIGhvLmZsdXgge1xyXG5cdGltcG9ydCBQcm9taXNlID0gaG8ucHJvbWlzZS5Qcm9taXNlO1xyXG5cclxuXHJcblx0ZXhwb3J0IGludGVyZmFjZSBJU3RhdGUge1xyXG5cdFx0bmFtZTogc3RyaW5nO1xyXG5cdFx0dXJsOiBzdHJpbmc7XHJcblx0XHRyZWRpcmVjdD86IHN0cmluZztcclxuXHRcdGJlZm9yZT86IChkYXRhOiBJUm91dGVEYXRhKT0+UHJvbWlzZTxhbnksIGFueT47XHJcblx0XHR2aWV3PzogQXJyYXk8SVZpZXdTdGF0ZT47XHJcblx0fVxyXG5cclxuXHRleHBvcnQgaW50ZXJmYWNlIElWaWV3U3RhdGUge1xyXG5cdCAgICBuYW1lOiBzdHJpbmc7XHJcblx0XHRodG1sOiBzdHJpbmc7XHJcblx0fVxyXG5cclxuXHRleHBvcnQgaW50ZXJmYWNlIElTdGF0ZXMge1xyXG5cdCAgICBzdGF0ZXM6IEFycmF5PElTdGF0ZT47XHJcblx0fVxyXG5cclxufVxyXG4iLCJtb2R1bGUgaG8uZmx1eC5hY3Rpb25zIHtcblx0ZXhwb3J0IGNsYXNzIEFjdGlvbiB7XG5cblx0XHRnZXQgbmFtZSgpOiBzdHJpbmcge1xuXHRcdCAgIHJldHVybiB0aGlzLmNvbnN0cnVjdG9yLnRvU3RyaW5nKCkubWF0Y2goL1xcdysvZylbMV07XG5cdCAgIH1cblx0ICAgXG5cdH1cbn1cbiIsIlxyXG5tb2R1bGUgaG8uZmx1eC5hY3Rpb25zIHtcclxuXHRpbXBvcnQgUHJvbWlzZSA9IGhvLnByb21pc2UuUHJvbWlzZTtcclxuXHJcblx0ZXhwb3J0IGxldCBtYXBwaW5nOiB7W2tleTpzdHJpbmddOnN0cmluZ30gPSB7fTtcclxuXHRleHBvcnQgbGV0IHVzZURpciA9IHRydWU7XHJcblxyXG5cdGV4cG9ydCBjbGFzcyBSZWdpc3RyeSB7XHJcblxyXG5cdFx0cHJpdmF0ZSBhY3Rpb25zOiB7W2tleTogc3RyaW5nXTogQWN0aW9ufSA9IHt9O1xyXG5cclxuXHRcdHByaXZhdGUgYWN0aW9uTG9hZGVyID0gbmV3IGhvLmNsYXNzbG9hZGVyLkNsYXNzTG9hZGVyKHtcclxuICAgICAgICAgICB1cmxUZW1wbGF0ZTogJ2FjdGlvbnMvJHtuYW1lfS5qcycsXHJcbiAgICAgICAgICAgdXNlRGlyXHJcbiAgICAgICB9KTtcclxuXHJcblx0XHRwdWJsaWMgcmVnaXN0ZXIoYWN0aW9uOiBBY3Rpb24pOiBBY3Rpb24ge1xyXG5cdFx0XHR0aGlzLmFjdGlvbnNbYWN0aW9uLm5hbWVdID0gYWN0aW9uO1xyXG5cdFx0XHRyZXR1cm4gYWN0aW9uO1xyXG5cdFx0fVxyXG5cclxuXHRcdHB1YmxpYyBnZXQoYWN0aW9uQ2xhc3M6IHN0cmluZyk6IFN0b3JlPGFueT5cclxuXHRcdHB1YmxpYyBnZXQ8VCBleHRlbmRzIEFjdGlvbj4oYWN0aW9uQ2xhc3M6IHtuZXcoKTpUfSk6IFRcclxuXHRcdHB1YmxpYyBnZXQ8VCBleHRlbmRzIEFjdGlvbj4oYWN0aW9uQ2xhc3M6IGFueSk6IFQge1xyXG5cdFx0XHRsZXQgbmFtZSA9IHZvaWQgMDtcclxuXHRcdFx0aWYodHlwZW9mIGFjdGlvbkNsYXNzID09PSAnc3RyaW5nJylcclxuXHRcdFx0XHRuYW1lID0gYWN0aW9uQ2xhc3M7XHJcblx0XHRcdGVsc2VcclxuXHRcdFx0XHRuYW1lID0gYWN0aW9uQ2xhc3MudG9TdHJpbmcoKS5tYXRjaCgvXFx3Ky9nKVsxXTtcclxuXHRcdFx0cmV0dXJuIDxUPnRoaXMuYWN0aW9uc1tuYW1lXTtcclxuXHRcdH1cclxuXHJcblx0XHRwdWJsaWMgbG9hZEFjdGlvbihuYW1lOiBzdHJpbmcpOiBQcm9taXNlPEFjdGlvbiwgc3RyaW5nPiB7XHJcblxyXG5cdFx0XHRsZXQgc2VsZiA9IHRoaXM7XHJcblxyXG5cdFx0XHRpZighIXRoaXMuYWN0aW9uc1tuYW1lXSlcclxuXHRcdFx0XHRyZXR1cm4gUHJvbWlzZS5jcmVhdGUodGhpcy5hY3Rpb25zW25hbWVdKTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmFjdGlvbkxvYWRlci5sb2FkKHtcclxuICAgICAgICAgICAgICAgIG5hbWUsXHJcblx0XHRcdFx0dXJsOiBtYXBwaW5nW25hbWVdLFxyXG4gICAgICAgICAgICAgICAgc3VwZXI6IFtcImhvLmZsdXguYWN0aW9uLkFjdGlvblwiXVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAudGhlbigoY2xhc3NlczogQXJyYXk8dHlwZW9mIEFjdGlvbj4pID0+IHtcclxuICAgICAgICAgICAgICAgIGNsYXNzZXMubWFwKGEgPT4ge1xyXG5cdFx0XHRcdFx0aWYoIXNlbGYuZ2V0KGEpKVxyXG5cdFx0XHRcdFx0XHRzZWxmLnJlZ2lzdGVyKG5ldyBhKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHNlbGYuZ2V0KGNsYXNzZXMucG9wKCkpO1xyXG4gICAgICAgICAgICB9KVxyXG5cclxuXHRcdH1cclxuXHJcblx0fVxyXG5cclxufVxyXG4iLCJcclxubW9kdWxlIGhvLmZsdXgucmVnaXN0cnkge1xyXG5cdGltcG9ydCBQcm9taXNlID0gaG8ucHJvbWlzZS5Qcm9taXNlO1xyXG5cclxuXHRleHBvcnQgbGV0IG1hcHBpbmc6IHtba2V5OnN0cmluZ106c3RyaW5nfSA9IHt9O1xyXG5cdGV4cG9ydCBsZXQgdXNlRGlyID0gdHJ1ZTtcclxuXHJcblx0ZXhwb3J0IGNsYXNzIFJlZ2lzdHJ5IHtcclxuXHJcblx0XHRwcml2YXRlIHN0b3Jlczoge1trZXk6IHN0cmluZ106IFN0b3JlPGFueT59ID0ge307XHJcblxyXG5cdFx0cHJpdmF0ZSBzdG9yZUxvYWRlciA9IG5ldyBoby5jbGFzc2xvYWRlci5DbGFzc0xvYWRlcih7XHJcbiAgICAgICAgICAgdXJsVGVtcGxhdGU6ICdzdG9yZXMvJHtuYW1lfS5qcycsXHJcbiAgICAgICAgICAgdXNlRGlyXHJcbiAgICAgICB9KTtcclxuXHJcblx0XHRwdWJsaWMgcmVnaXN0ZXIoc3RvcmU6IFN0b3JlPGFueT4pOiBTdG9yZTxhbnk+IHtcclxuXHRcdFx0dGhpcy5zdG9yZXNbc3RvcmUubmFtZV0gPSBzdG9yZTtcclxuXHRcdFx0cmV0dXJuIHN0b3JlO1xyXG5cdFx0fVxyXG5cclxuXHRcdHB1YmxpYyBnZXQoc3RvcmVDbGFzczogc3RyaW5nKTogU3RvcmU8YW55PlxyXG5cdFx0cHVibGljIGdldDxUIGV4dGVuZHMgU3RvcmU8YW55Pj4oc3RvcmVDbGFzczoge25ldygpOlR9KTogVFxyXG5cdFx0cHVibGljIGdldDxUIGV4dGVuZHMgU3RvcmU8YW55Pj4oc3RvcmVDbGFzczogYW55KTogVCB7XHJcblx0XHRcdGxldCBuYW1lID0gdm9pZCAwO1xyXG5cdFx0XHRpZih0eXBlb2Ygc3RvcmVDbGFzcyA9PT0gJ3N0cmluZycpXHJcblx0XHRcdFx0bmFtZSA9IHN0b3JlQ2xhc3M7XHJcblx0XHRcdGVsc2VcclxuXHRcdFx0XHRuYW1lID0gc3RvcmVDbGFzcy50b1N0cmluZygpLm1hdGNoKC9cXHcrL2cpWzFdO1xyXG5cdFx0XHRyZXR1cm4gPFQ+dGhpcy5zdG9yZXNbbmFtZV07XHJcblx0XHR9XHJcblxyXG5cdFx0cHVibGljIGxvYWRTdG9yZShuYW1lOiBzdHJpbmcsIGluaXQgPSB0cnVlKTogUHJvbWlzZTxTdG9yZTxhbnk+LCBzdHJpbmc+IHtcclxuXHJcblx0XHRcdGxldCBzZWxmID0gdGhpcztcclxuXHRcdFx0bGV0IGNsczogQXJyYXk8dHlwZW9mIFN0b3JlPiA9IFtdO1xyXG5cclxuXHRcdFx0aWYoISF0aGlzLnN0b3Jlc1tuYW1lXSlcclxuXHRcdFx0XHRyZXR1cm4gUHJvbWlzZS5jcmVhdGUodGhpcy5zdG9yZXNbbmFtZV0pO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc3RvcmVMb2FkZXIubG9hZCh7XHJcbiAgICAgICAgICAgICAgICBuYW1lLFxyXG5cdFx0XHRcdHVybDogbWFwcGluZ1tuYW1lXSxcclxuICAgICAgICAgICAgICAgIHN1cGVyOiBbXCJoby5mbHV4LlN0b3JlXCJdXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC50aGVuKChjbGFzc2VzOiBBcnJheTx0eXBlb2YgU3RvcmU+KSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjbHMgPSBjbGFzc2VzO1xyXG5cdFx0XHRcdGNsYXNzZXMgPSBjbGFzc2VzLmZpbHRlcihjID0+IHtcclxuXHRcdFx0XHRcdHJldHVybiAhc2VsZi5nZXQoYyk7XHJcblx0XHRcdFx0fSk7XHJcblxyXG5cdFx0XHRcdGxldCBwcm9taXNlcyA9ICBjbGFzc2VzLm1hcChjID0+IHtcclxuXHRcdFx0XHRcdGxldCByZXN1bHQ6IGFueSA9IHNlbGYucmVnaXN0ZXIobmV3IGMpO1xyXG5cdFx0XHRcdFx0aWYoaW5pdClcclxuXHRcdFx0XHRcdFx0cmVzdWx0ID0gcmVzdWx0LmluaXQoKTtcclxuXHRcdFx0XHRcdHJldHVybiBQcm9taXNlLmNyZWF0ZShyZXN1bHQpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFByb21pc2UuYWxsKHByb21pc2VzKTtcclxuICAgICAgICAgICAgfSlcclxuXHRcdFx0LnRoZW4ocCA9PiB7XHJcblx0XHRcdFx0cmV0dXJuIHNlbGYuZ2V0KGNscy5wb3AoKSk7XHJcblx0XHRcdH0pXHJcblxyXG5cdFx0fVxyXG5cclxuXHR9XHJcblxyXG59XHJcbiIsIlxyXG5tb2R1bGUgaG8uZmx1eC5zdGF0ZXByb3ZpZGVyIHtcclxuXHRpbXBvcnQgUHJvbWlzZSA9IGhvLnByb21pc2UuUHJvbWlzZTtcclxuXHJcbiAgICBleHBvcnQgaW50ZXJmYWNlIElTdGF0ZVByb3ZpZGVyIHtcclxuICAgICAgICB1c2VNaW46Ym9vbGVhbjtcclxuXHRcdHJlc29sdmUoKTogc3RyaW5nO1xyXG5cdFx0Z2V0U3RhdGVzKG5hbWU/OnN0cmluZyk6IFByb21pc2U8SVN0YXRlcywgc3RyaW5nPjtcclxuICAgIH1cclxuXHJcblx0Y2xhc3MgU3RhdGVQcm92aWRlciBpbXBsZW1lbnRzIElTdGF0ZVByb3ZpZGVyIHtcclxuXHJcbiAgICAgICAgdXNlTWluOiBib29sZWFuID0gZmFsc2U7XHJcblxyXG4gICAgICAgIHJlc29sdmUoKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMudXNlTWluID9cclxuICAgICAgICAgICAgICAgIGBzdGF0ZXMubWluLmpzYCA6XHJcbiAgICAgICAgICAgICAgICBgc3RhdGVzLmpzYDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGdldFN0YXRlcyhuYW1lID0gXCJTdGF0ZXNcIik6IFByb21pc2U8SVN0YXRlcywgc3RyaW5nPiB7XHJcblx0XHRcdHJldHVybiBuZXcgUHJvbWlzZTxJU3RhdGVzLCBhbnk+KChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuXHRcdFx0XHRsZXQgc3JjID0gdGhpcy5yZXNvbHZlKCk7XHJcbiAgICAgICAgICAgICAgICBsZXQgc2NyaXB0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc2NyaXB0Jyk7XHJcbiAgICAgICAgICAgICAgICBzY3JpcHQub25sb2FkID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShuZXcgd2luZG93W25hbWVdKTtcclxuICAgICAgICAgICAgICAgIH07XHJcblx0XHRcdFx0c2NyaXB0Lm9uZXJyb3IgPSAoZSkgPT4ge1xyXG5cdFx0XHRcdFx0cmVqZWN0KGUpO1xyXG5cdFx0XHRcdH07XHJcbiAgICAgICAgICAgICAgICBzY3JpcHQuc3JjID0gc3JjO1xyXG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2hlYWQnKVswXS5hcHBlbmRDaGlsZChzY3JpcHQpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgbGV0IGluc3RhbmNlOiBJU3RhdGVQcm92aWRlciA9IG5ldyBTdGF0ZVByb3ZpZGVyKCk7XHJcbn1cclxuIiwiXHJcbm1vZHVsZSBoby5mbHV4IHtcclxuXHJcblx0ZXhwb3J0IGNsYXNzIFN0b3JlPFQ+IGV4dGVuZHMgQ2FsbGJhY2tIb2xkZXIge1xyXG5cclxuXHRcdHByb3RlY3RlZCBkYXRhOiBUO1xyXG5cdFx0cHJpdmF0ZSBpZDogc3RyaW5nO1xyXG5cdFx0cHJpdmF0ZSBoYW5kbGVyczoge1trZXk6IHN0cmluZ106IEZ1bmN0aW9ufSA9IHt9O1xyXG5cdFx0cHJvdGVjdGVkIGFjdGlvbnM6IHN0cmluZ1tdID0gW107XHJcblxyXG5cdFx0Y29uc3RydWN0b3IoKSB7XHJcblx0XHRcdHN1cGVyKCk7XHJcblx0XHRcdHRoaXMuaWQgPSBoby5mbHV4LkRJU1BBVENIRVIucmVnaXN0ZXIodGhpcy5oYW5kbGUuYmluZCh0aGlzKSk7XHJcblx0XHRcdC8vaG8uZmx1eC5TVE9SRVMucmVnaXN0ZXIodGhpcyk7XHJcblx0XHR9XHJcblxyXG5cdFx0cHVibGljIGluaXQoKTogaG8ucHJvbWlzZS5Qcm9taXNlPGFueSwgYW55PiB7XHJcblx0XHRcdHJldHVybiBoby5wcm9taXNlLlByb21pc2UuYWxsKHRoaXMuYWN0aW9ucy5tYXAoYT0+e1xyXG5cdFx0XHRcdHJldHVybiBoby5mbHV4LkFDVElPTlMubG9hZEFjdGlvbihhKTtcclxuXHRcdFx0fSkpO1xyXG5cdFx0fVxyXG5cclxuXHRcdCBnZXQgbmFtZSgpOiBzdHJpbmcge1xyXG5cdFx0XHRyZXR1cm4gdGhpcy5jb25zdHJ1Y3Rvci50b1N0cmluZygpLm1hdGNoKC9cXHcrL2cpWzFdO1xyXG5cdFx0fVxyXG5cclxuXHRcdHB1YmxpYyByZWdpc3RlcihjYWxsYmFjazogKGRhdGE6VCk9PnZvaWQsIHNlbGY/OmFueSk6IHN0cmluZyB7XHJcblx0XHRcdHJldHVybiBzdXBlci5yZWdpc3RlcihjYWxsYmFjaywgc2VsZik7XHJcblx0XHR9XHJcblxyXG5cdFx0cHJvdGVjdGVkIG9uKHR5cGU6IHN0cmluZywgZnVuYzogRnVuY3Rpb24pOiB2b2lkIHtcclxuXHRcdFx0dGhpcy5oYW5kbGVyc1t0eXBlXSA9IGZ1bmM7XHJcblx0XHR9XHJcblxyXG5cdFx0cHJvdGVjdGVkIGhhbmRsZShhY3Rpb246IElBY3Rpb24pOiB2b2lkIHtcclxuXHRcdFx0aWYodHlwZW9mIHRoaXMuaGFuZGxlcnNbYWN0aW9uLnR5cGVdID09PSAnZnVuY3Rpb24nKVxyXG5cdFx0XHRcdHRoaXMuaGFuZGxlcnNbYWN0aW9uLnR5cGVdKGFjdGlvbi5kYXRhKTtcclxuXHRcdH07XHJcblxyXG5cclxuXHRcdHByb3RlY3RlZCBjaGFuZ2VkKCk6IHZvaWQge1xyXG5cdFx0XHRmb3IgKGxldCBpZCBpbiB0aGlzLmNhbGxiYWNrcykge1xyXG5cdFx0XHQgIGxldCBjYiA9IHRoaXMuY2FsbGJhY2tzW2lkXTtcclxuXHRcdFx0ICBpZihjYilcclxuXHRcdFx0ICBcdGNiKHRoaXMuZGF0YSk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblxyXG5cdH07XHJcblxyXG5cclxufVxyXG4iLCJcclxuXHJcbm1vZHVsZSBoby5mbHV4IHtcclxuXHJcblx0aW1wb3J0IFByb21pc2UgPSBoby5wcm9taXNlLlByb21pc2U7XHJcblxyXG5cclxuXHQvKiogRGF0YSB0aGF0IGEgUm91dGVyI2dvIHRha2VzICovXHJcblx0ZXhwb3J0IGludGVyZmFjZSBJUm91dGVEYXRhIHtcclxuXHQgICAgc3RhdGU6IHN0cmluZztcclxuXHRcdGFyZ3M6IGFueTtcclxuXHRcdGV4dGVybjogYm9vbGVhbjtcclxuXHR9XHJcblxyXG5cdC8qKiBEYXRhIHRoYXQgUm91dGVyI2NoYW5nZXMgZW1pdCB0byBpdHMgbGlzdGVuZXJzICovXHJcblx0ZXhwb3J0IGludGVyZmFjZSBJUm91dGVyRGF0YSB7XHJcblx0ICAgIHN0YXRlOiBJU3RhdGU7XHJcblx0XHRhcmdzOiBhbnk7XHJcblx0XHRleHRlcm46IGJvb2xlYW47XHJcblx0fVxyXG5cclxuXHRleHBvcnQgY2xhc3MgUm91dGVyIGV4dGVuZHMgU3RvcmU8SVJvdXRlckRhdGE+IHtcclxuXHJcblx0XHRwcml2YXRlIG1hcHBpbmc6QXJyYXk8SVN0YXRlPiA9IG51bGw7XHJcblxyXG5cdFx0cHVibGljIGluaXQoKTogUHJvbWlzZTxhbnksIGFueT4ge1xyXG5cdFx0XHR0aGlzLm9uKCdTVEFURScsIHRoaXMub25TdGF0ZUNoYW5nZVJlcXVlc3RlZC5iaW5kKHRoaXMpKTtcclxuXHJcblx0XHRcdGxldCBvbkhhc2hDaGFuZ2UgPSB0aGlzLm9uSGFzaENoYW5nZS5iaW5kKHRoaXMpO1xyXG5cclxuXHRcdFx0cmV0dXJuIHRoaXMuaW5pdFN0YXRlcygpXHJcblx0XHRcdC50aGVuKCgpID0+IHtcclxuXHRcdFx0XHR3aW5kb3cub25oYXNoY2hhbmdlID0gb25IYXNoQ2hhbmdlO1xyXG5cdFx0XHRcdG9uSGFzaENoYW5nZSgpO1xyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHJcblx0XHRwdWJsaWMgZ28oc3RhdGU6IHN0cmluZywgZGF0YT86IGFueSk6IHZvaWRcclxuXHRcdHB1YmxpYyBnbyhkYXRhOiBJUm91dGVEYXRhKTogdm9pZFxyXG5cdFx0cHVibGljIGdvKGRhdGE6IElSb3V0ZURhdGEgfCBzdHJpbmcsIGFyZ3M/OiBhbnkpOiB2b2lkIHtcclxuXHJcblx0XHRcdGxldCBfZGF0YTogSVJvdXRlRGF0YSA9IHtcclxuXHRcdFx0XHRzdGF0ZTogdW5kZWZpbmVkLFxyXG5cdFx0XHRcdGFyZ3M6IHVuZGVmaW5lZCxcclxuXHRcdFx0XHRleHRlcm46IGZhbHNlXHJcblx0XHRcdH07XHJcblxyXG5cdFx0XHRpZih0eXBlb2YgZGF0YSA9PT0gJ3N0cmluZycpIHtcclxuXHRcdFx0XHRfZGF0YS5zdGF0ZSA9IGRhdGE7XHJcblx0XHRcdFx0X2RhdGEuYXJncyA9IGFyZ3M7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0X2RhdGEuc3RhdGUgPSBkYXRhLnN0YXRlO1xyXG5cdFx0XHRcdF9kYXRhLmFyZ3MgPSBkYXRhLmFyZ3M7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGhvLmZsdXguRElTUEFUQ0hFUi5kaXNwYXRjaCh7XHJcblx0XHRcdFx0dHlwZTogJ1NUQVRFJyxcclxuXHRcdFx0XHRkYXRhOiBfZGF0YVxyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHJcblx0XHRwcml2YXRlIGluaXRTdGF0ZXMoKTogUHJvbWlzZTxhbnksIGFueT4ge1xyXG5cdFx0XHRyZXR1cm4gc3RhdGVwcm92aWRlci5pbnN0YW5jZS5nZXRTdGF0ZXMoKVxyXG5cdFx0XHQudGhlbihmdW5jdGlvbihpc3RhdGVzKSB7XHJcblx0XHRcdFx0dGhpcy5tYXBwaW5nID0gaXN0YXRlcy5zdGF0ZXM7XHJcblx0XHRcdH0uYmluZCh0aGlzKSk7XHJcblx0XHR9XHJcblxyXG5cdFx0cHJpdmF0ZSBnZXRTdGF0ZUZyb21OYW1lKG5hbWU6IHN0cmluZyk6IElTdGF0ZSB7XHJcblx0XHRcdHJldHVybiB0aGlzLm1hcHBpbmcuZmlsdGVyKChzKT0+e1xyXG5cdFx0XHRcdHJldHVybiBzLm5hbWUgPT09IG5hbWVcclxuXHRcdFx0fSlbMF07XHJcblx0XHR9XHJcblxyXG5cdFx0cHJvdGVjdGVkIG9uU3RhdGVDaGFuZ2VSZXF1ZXN0ZWQoZGF0YTogSVJvdXRlRGF0YSk6IHZvaWQge1xyXG5cdFx0XHQvL2dldCByZXF1ZXN0ZWQgc3RhdGVcclxuXHRcdFx0bGV0IHN0YXRlID0gdGhpcy5nZXRTdGF0ZUZyb21OYW1lKGRhdGEuc3RhdGUpO1xyXG5cdFx0XHRsZXQgdXJsID0gdGhpcy51cmxGcm9tU3RhdGUoc3RhdGUudXJsLCBkYXRhLmFyZ3MpO1xyXG5cclxuXHRcdFx0Ly9jdXJyZW50IHN0YXRlIGFuZCBhcmdzIGVxdWFscyByZXF1ZXN0ZWQgc3RhdGUgYW5kIGFyZ3MgLT4gcmV0dXJuXHJcblx0XHRcdGlmKFxyXG5cdFx0XHRcdHRoaXMuZGF0YSAmJlxyXG5cdFx0XHRcdHRoaXMuZGF0YS5zdGF0ZSAmJlxyXG5cdFx0XHRcdHRoaXMuZGF0YS5zdGF0ZS5uYW1lID09PSBkYXRhLnN0YXRlICYmXHJcblx0XHRcdFx0dGhpcy5lcXVhbHModGhpcy5kYXRhLmFyZ3MsIGRhdGEuYXJncykgJiZcclxuXHRcdFx0XHR1cmwgPT09IHdpbmRvdy5sb2NhdGlvbi5oYXNoLnN1YnN0cigxKVxyXG5cdFx0XHQpIHtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHJcblxyXG5cclxuXHRcdFx0Ly9yZXF1ZXN0ZWQgc3RhdGUgaGFzIGFuIHJlZGlyZWN0IHByb3BlcnR5IC0+IGNhbGwgcmVkaXJlY3Qgc3RhdGVcclxuXHRcdFx0aWYoISFzdGF0ZS5yZWRpcmVjdCkge1xyXG5cdFx0XHRcdHN0YXRlID0gdGhpcy5nZXRTdGF0ZUZyb21OYW1lKHN0YXRlLnJlZGlyZWN0KTtcclxuXHRcdFx0fVxyXG5cclxuXHJcblx0XHRcdGxldCBwcm9tID0gdHlwZW9mIHN0YXRlLmJlZm9yZSA9PT0gJ2Z1bmN0aW9uJyA/IHN0YXRlLmJlZm9yZShkYXRhKSA6IFByb21pc2UuY3JlYXRlKHVuZGVmaW5lZCk7XHJcblx0XHRcdHByb21cclxuXHRcdFx0LnRoZW4oZnVuY3Rpb24oKSB7XHJcblxyXG5cdFx0XHRcdC8vZG9lcyB0aGUgc3RhdGUgY2hhbmdlIHJlcXVlc3QgY29tZXMgZnJvbSBleHRlcm4gZS5nLiB1cmwgY2hhbmdlIGluIGJyb3dzZXIgd2luZG93ID9cclxuXHRcdFx0XHRsZXQgZXh0ZXJuID0gISEgZGF0YS5leHRlcm47XHJcblxyXG5cdFx0XHRcdHRoaXMuZGF0YSA9IHtcclxuXHRcdFx0XHRcdHN0YXRlOiBzdGF0ZSxcclxuXHRcdFx0XHRcdGFyZ3M6IGRhdGEuYXJncyxcclxuXHRcdFx0XHRcdGV4dGVybjogZXh0ZXJuLFxyXG5cdFx0XHRcdH07XHJcblxyXG5cdFx0XHRcdC8vLS0tLS0tLSBzZXQgdXJsIGZvciBicm93c2VyXHJcblx0XHRcdFx0dmFyIHVybCA9IHRoaXMudXJsRnJvbVN0YXRlKHN0YXRlLnVybCwgZGF0YS5hcmdzKTtcclxuXHRcdFx0XHR0aGlzLnNldFVybCh1cmwpO1xyXG5cclxuXHRcdFx0XHR0aGlzLmNoYW5nZWQoKTtcclxuXHJcblx0XHRcdH0uYmluZCh0aGlzKSxcclxuXHRcdFx0ZnVuY3Rpb24oZGF0YSkge1xyXG5cdFx0XHRcdHRoaXMub25TdGF0ZUNoYW5nZVJlcXVlc3RlZChkYXRhKTtcclxuXHRcdFx0fS5iaW5kKHRoaXMpKTtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0cHJpdmF0ZSBvbkhhc2hDaGFuZ2UoKTogdm9pZCB7XHJcblx0XHRcdGxldCBzID0gdGhpcy5zdGF0ZUZyb21Vcmwod2luZG93LmxvY2F0aW9uLmhhc2guc3Vic3RyKDEpKTtcclxuXHJcblx0XHRcdGhvLmZsdXguRElTUEFUQ0hFUi5kaXNwYXRjaCh7XHJcblx0XHRcdFx0dHlwZTogJ1NUQVRFJyxcclxuXHRcdFx0XHRkYXRhOiB7XHJcblx0XHRcdFx0XHRzdGF0ZTogcy5zdGF0ZSxcclxuXHRcdFx0XHRcdGFyZ3M6IHMuYXJncyxcclxuXHRcdFx0XHRcdGV4dGVybjogdHJ1ZSxcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cclxuXHRcdHByaXZhdGUgc2V0VXJsKHVybDogc3RyaW5nKTogdm9pZCB7XHJcblx0XHRcdGlmKHdpbmRvdy5sb2NhdGlvbi5oYXNoLnN1YnN0cigxKSA9PT0gdXJsKVxyXG5cdFx0XHRcdHJldHVybjtcclxuXHJcblx0XHRcdGxldCBsID0gd2luZG93Lm9uaGFzaGNoYW5nZTtcclxuXHRcdFx0d2luZG93Lm9uaGFzaGNoYW5nZSA9IG51bGw7XHJcblx0XHRcdHdpbmRvdy5sb2NhdGlvbi5oYXNoID0gdXJsO1xyXG5cdFx0XHR3aW5kb3cub25oYXNoY2hhbmdlID0gbDtcclxuXHRcdH1cclxuXHJcblx0XHRwcml2YXRlIHJlZ2V4RnJvbVVybCh1cmw6IHN0cmluZyk6IHN0cmluZyB7XHJcblx0XHRcdHZhciByZWdleCA9IC86KFtcXHddKykvO1xyXG5cdFx0XHR3aGlsZSh1cmwubWF0Y2gocmVnZXgpKSB7XHJcblx0XHRcdFx0dXJsID0gdXJsLnJlcGxhY2UocmVnZXgsIFwiKFteXFwvXSspXCIpO1xyXG5cdFx0XHR9XHJcblx0XHRcdHJldHVybiB1cmwrJyQnO1xyXG5cdFx0fVxyXG5cclxuXHRcdHByaXZhdGUgYXJnc0Zyb21VcmwocGF0dGVybjogc3RyaW5nLCB1cmw6IHN0cmluZyk6IGFueSB7XHJcblx0XHRcdGxldCByID0gdGhpcy5yZWdleEZyb21VcmwocGF0dGVybik7XHJcblx0XHRcdGxldCBuYW1lcyA9IHBhdHRlcm4ubWF0Y2gocikuc2xpY2UoMSk7XHJcblx0XHRcdGxldCB2YWx1ZXMgPSB1cmwubWF0Y2gocikuc2xpY2UoMSk7XHJcblxyXG5cdFx0XHRsZXQgYXJncyA9IHt9O1xyXG5cdFx0XHRuYW1lcy5mb3JFYWNoKGZ1bmN0aW9uKG5hbWUsIGkpIHtcclxuXHRcdFx0XHRhcmdzW25hbWUuc3Vic3RyKDEpXSA9IHZhbHVlc1tpXTtcclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0XHRyZXR1cm4gYXJncztcclxuXHRcdH1cclxuXHJcblx0XHRwcml2YXRlIHN0YXRlRnJvbVVybCh1cmw6IHN0cmluZyk6IElSb3V0ZURhdGEge1xyXG5cdFx0XHR2YXIgcyA9IHZvaWQgMDtcclxuXHRcdFx0dGhpcy5tYXBwaW5nLmZvckVhY2goKHN0YXRlOiBJU3RhdGUpID0+IHtcclxuXHRcdFx0XHRpZihzKVxyXG5cdFx0XHRcdFx0cmV0dXJuO1xyXG5cclxuXHRcdFx0XHR2YXIgciA9IHRoaXMucmVnZXhGcm9tVXJsKHN0YXRlLnVybCk7XHJcblx0XHRcdFx0aWYodXJsLm1hdGNoKHIpKSB7XHJcblx0XHRcdFx0XHR2YXIgYXJncyA9IHRoaXMuYXJnc0Zyb21Vcmwoc3RhdGUudXJsLCB1cmwpO1xyXG5cdFx0XHRcdFx0cyA9IHtcclxuXHRcdFx0XHRcdFx0XCJzdGF0ZVwiOiBzdGF0ZS5uYW1lLFxyXG5cdFx0XHRcdFx0XHRcImFyZ3NcIjogYXJncyxcclxuXHRcdFx0XHRcdFx0XCJleHRlcm5cIjogZmFsc2VcclxuXHRcdFx0XHRcdH07XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KTtcclxuXHJcblx0XHRcdGlmKCFzKVxyXG5cdFx0XHRcdHRocm93IFwiTm8gU3RhdGUgZm91bmQgZm9yIHVybCBcIit1cmw7XHJcblxyXG5cdFx0XHRyZXR1cm4gcztcclxuXHRcdH1cclxuXHJcblx0XHRwcml2YXRlIHVybEZyb21TdGF0ZSh1cmw6IHN0cmluZywgYXJnczogYW55KTogc3RyaW5nIHtcclxuXHRcdFx0bGV0IHJlZ2V4ID0gLzooW1xcd10rKS87XHJcblx0XHRcdHdoaWxlKHVybC5tYXRjaChyZWdleCkpIHtcclxuXHRcdFx0XHR1cmwgPSB1cmwucmVwbGFjZShyZWdleCwgZnVuY3Rpb24obSkge1xyXG5cdFx0XHRcdFx0cmV0dXJuIGFyZ3NbbS5zdWJzdHIoMSldO1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9XHJcblx0XHRcdHJldHVybiB1cmw7XHJcblx0XHR9XHJcblxyXG5cdFx0cHJpdmF0ZSBlcXVhbHMobzE6IGFueSwgbzI6IGFueSkgOiBib29sZWFuIHtcclxuXHRcdFx0cmV0dXJuIEpTT04uc3RyaW5naWZ5KG8xKSA9PT0gSlNPTi5zdHJpbmdpZnkobzIpO1xyXG5cdFx0fVxyXG5cclxuXHR9XHJcbn1cclxuIiwiXHJcbm1vZHVsZSBoby5mbHV4IHtcclxuXHJcblx0ZXhwb3J0IGludGVyZmFjZSBJQWN0aW9uIHtcclxuXHQgICAgdHlwZTpzdHJpbmc7XHJcblx0XHRkYXRhPzphbnk7XHJcblx0fVxyXG5cclxuXHRleHBvcnQgY2xhc3MgRGlzcGF0Y2hlciBleHRlbmRzIENhbGxiYWNrSG9sZGVyIHtcclxuXHJcbiAgICBcdHByaXZhdGUgaXNQZW5kaW5nOiB7W2tleTpzdHJpbmddOmJvb2xlYW59ID0ge307XHJcbiAgICBcdHByaXZhdGUgaXNIYW5kbGVkOiB7W2tleTpzdHJpbmddOmJvb2xlYW59ID0ge307XHJcbiAgICBcdHByaXZhdGUgaXNEaXNwYXRjaGluZzogYm9vbGVhbiA9IGZhbHNlO1xyXG4gICAgXHRwcml2YXRlIHBlbmRpbmdQYXlsb2FkOiBJQWN0aW9uID0gbnVsbDtcclxuXHJcblx0XHRwdWJsaWMgd2FpdEZvciguLi5pZHM6IEFycmF5PG51bWJlcj4pOiB2b2lkIHtcclxuXHRcdFx0aWYoIXRoaXMuaXNEaXNwYXRjaGluZylcclxuXHRcdCAgXHRcdHRocm93ICdEaXNwYXRjaGVyLndhaXRGb3IoLi4uKTogTXVzdCBiZSBpbnZva2VkIHdoaWxlIGRpc3BhdGNoaW5nLic7XHJcblxyXG5cdFx0XHRmb3IgKGxldCBpaSA9IDA7IGlpIDwgaWRzLmxlbmd0aDsgaWkrKykge1xyXG5cdFx0XHQgIGxldCBpZCA9IGlkc1tpaV07XHJcblxyXG5cdFx0XHQgIGlmICh0aGlzLmlzUGVuZGluZ1tpZF0pIHtcclxuXHRcdCAgICAgIFx0aWYoIXRoaXMuaXNIYW5kbGVkW2lkXSlcclxuXHRcdFx0ICAgICAgXHR0aHJvdyBgd2FpdEZvciguLi4pOiBDaXJjdWxhciBkZXBlbmRlbmN5IGRldGVjdGVkIHdoaWxlIHdhdGluZyBmb3IgJHtpZH1gO1xyXG5cdFx0XHRcdGNvbnRpbnVlO1xyXG5cdFx0XHQgIH1cclxuXHJcblx0XHRcdCAgaWYoIXRoaXMuY2FsbGJhY2tzW2lkXSlcclxuXHRcdFx0ICBcdHRocm93IGB3YWl0Rm9yKC4uLik6ICR7aWR9IGRvZXMgbm90IG1hcCB0byBhIHJlZ2lzdGVyZWQgY2FsbGJhY2suYDtcclxuXHJcblx0XHRcdCAgdGhpcy5pbnZva2VDYWxsYmFjayhpZCk7XHJcblx0XHRcdH1cclxuXHRcdH07XHJcblxyXG5cdFx0cHVibGljIGRpc3BhdGNoKGFjdGlvbjogSUFjdGlvbikge1xyXG5cdFx0XHRpZih0aGlzLmlzRGlzcGF0Y2hpbmcpXHJcblx0XHQgICAgXHR0aHJvdyAnQ2Fubm90IGRpc3BhdGNoIGluIHRoZSBtaWRkbGUgb2YgYSBkaXNwYXRjaC4nO1xyXG5cclxuXHRcdFx0dGhpcy5zdGFydERpc3BhdGNoaW5nKGFjdGlvbik7XHJcblxyXG5cdFx0ICAgIHRyeSB7XHJcblx0XHQgICAgICBmb3IgKGxldCBpZCBpbiB0aGlzLmNhbGxiYWNrcykge1xyXG5cdFx0ICAgICAgICBpZiAodGhpcy5pc1BlbmRpbmdbaWRdKSB7XHJcblx0XHQgICAgICAgICAgY29udGludWU7XHJcblx0XHQgICAgICAgIH1cclxuXHRcdCAgICAgICAgdGhpcy5pbnZva2VDYWxsYmFjayhpZCk7XHJcblx0XHQgICAgICB9XHJcblx0XHQgICAgfSBmaW5hbGx5IHtcclxuXHRcdCAgICAgIHRoaXMuc3RvcERpc3BhdGNoaW5nKCk7XHJcblx0XHQgICAgfVxyXG5cdFx0fTtcclxuXHJcblx0ICBcdHByaXZhdGUgaW52b2tlQ2FsbGJhY2soaWQ6IG51bWJlcik6IHZvaWQge1xyXG5cdCAgICBcdHRoaXMuaXNQZW5kaW5nW2lkXSA9IHRydWU7XHJcblx0ICAgIFx0dGhpcy5jYWxsYmFja3NbaWRdKHRoaXMucGVuZGluZ1BheWxvYWQpO1xyXG5cdCAgICBcdHRoaXMuaXNIYW5kbGVkW2lkXSA9IHRydWU7XHJcblx0ICBcdH1cclxuXHJcblx0ICBcdHByaXZhdGUgc3RhcnREaXNwYXRjaGluZyhwYXlsb2FkOiBJQWN0aW9uKTogdm9pZCB7XHJcblx0ICAgIFx0Zm9yIChsZXQgaWQgaW4gdGhpcy5jYWxsYmFja3MpIHtcclxuXHQgICAgICBcdFx0dGhpcy5pc1BlbmRpbmdbaWRdID0gZmFsc2U7XHJcblx0ICAgICAgXHRcdHRoaXMuaXNIYW5kbGVkW2lkXSA9IGZhbHNlO1xyXG5cdCAgICBcdH1cclxuXHQgICAgXHR0aGlzLnBlbmRpbmdQYXlsb2FkID0gcGF5bG9hZDtcclxuXHQgICAgXHR0aGlzLmlzRGlzcGF0Y2hpbmcgPSB0cnVlO1xyXG4gIFx0XHR9XHJcblxyXG5cdCAgXHRwcml2YXRlIHN0b3BEaXNwYXRjaGluZygpOiB2b2lkIHtcclxuXHQgICAgXHR0aGlzLnBlbmRpbmdQYXlsb2FkID0gbnVsbDtcclxuXHQgICAgXHR0aGlzLmlzRGlzcGF0Y2hpbmcgPSBmYWxzZTtcclxuXHQgIFx0fVxyXG5cdH1cclxufVxyXG4iLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vLi4vLi4vYm93ZXJfY29tcG9uZW50cy9oby1wcm9taXNlL2Rpc3QvcHJvbWlzZS5kLnRzXCIvPlxyXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vLi4vLi4vYm93ZXJfY29tcG9uZW50cy9oby1jbGFzc2xvYWRlci9kaXN0L2NsYXNzbG9hZGVyLmQudHNcIi8+XHJcblxyXG5tb2R1bGUgaG8uZmx1eCB7XHJcblx0aW1wb3J0IFByb21pc2UgPSBoby5wcm9taXNlLlByb21pc2U7XHJcblxyXG5cdGV4cG9ydCBsZXQgRElTUEFUQ0hFUjogRGlzcGF0Y2hlciA9IG5ldyBEaXNwYXRjaGVyKCk7XHJcblxyXG5cdGV4cG9ydCBsZXQgU1RPUkVTOiByZWdpc3RyeS5SZWdpc3RyeSA9IG5ldyByZWdpc3RyeS5SZWdpc3RyeSgpO1xyXG5cclxuXHRleHBvcnQgbGV0IEFDVElPTlM6IGFjdGlvbnMuUmVnaXN0cnkgPSBuZXcgYWN0aW9ucy5SZWdpc3RyeSgpO1xyXG5cclxuXHRleHBvcnQgbGV0IGRpcjogYm9vbGVhbiA9IGZhbHNlO1xyXG5cclxuXHJcblx0ZXhwb3J0IGZ1bmN0aW9uIHJ1bihyb3V0ZXI6YW55ID0gUm91dGVyKTogUHJvbWlzZTxhbnksIGFueT4ge1xyXG5cdFx0cmV0dXJuIG5ldyBQcm9taXNlPGFueSwgYW55PigocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcblx0XHRcdGlmKCEhU1RPUkVTLmdldChyb3V0ZXIpKVxyXG5cdFx0XHRcdHJlc29sdmUoU1RPUkVTLmdldChyb3V0ZXIpKVxyXG5cdFx0XHRlbHNlIGlmKHJvdXRlciA9PT0gUm91dGVyKVxyXG5cdFx0XHRcdHJlc29sdmUobmV3IFJvdXRlcigpKTtcclxuXHRcdFx0ZWxzZSBpZih0eXBlb2Ygcm91dGVyID09PSAnZnVuY3Rpb24nKVxyXG5cdFx0XHRcdHJlc29sdmUobmV3IHJvdXRlcigpKVxyXG5cdFx0XHRlbHNlIGlmKHR5cGVvZiByb3V0ZXIgPT09ICdzdHJpbmcnKSB7XHJcblx0XHRcdFx0U1RPUkVTLmxvYWRTdG9yZShyb3V0ZXIpXHJcblx0XHRcdFx0LnRoZW4ocyA9PiByZXNvbHZlKHMpKVxyXG5cdFx0XHR9XHJcblx0XHR9KVxyXG5cdFx0LnRoZW4ociA9PiB7XHJcblx0XHRcdHJldHVybiBTVE9SRVMucmVnaXN0ZXIocikuaW5pdCgpO1xyXG5cdFx0fSk7XHJcblxyXG5cdH1cclxufVxyXG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=