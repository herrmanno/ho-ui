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
        var componentprovider;
        (function (componentprovider) {
            var Promise = ho.promise.Promise;
            componentprovider.mapping = {};
            var ComponentProvider = (function () {
                function ComponentProvider() {
                    this.useMin = false;
                }
                ComponentProvider.prototype.resolve = function (name) {
                    if (ho.components.dir) {
                        name += '.' + name.split('.').pop();
                    }
                    name = name.split('.').join('/');
                    return this.useMin ?
                        "components/" + name + ".min.js" :
                        "components/" + name + ".js";
                };
                ComponentProvider.prototype.getComponent = function (name) {
                    var _this = this;
                    return new Promise(function (resolve, reject) {
                        var src = componentprovider.mapping[name] || _this.resolve(name);
                        var script = document.createElement('script');
                        script.onload = function () {
                            //Component.register(window[name]);
                            if (typeof this.get(name) === 'function')
                                resolve(this.get(name));
                            else
                                reject("Error while loading Component " + name);
                        }.bind(_this);
                        script.src = src;
                        document.getElementsByTagName('head')[0].appendChild(script);
                    });
                };
                ComponentProvider.prototype.get = function (name) {
                    var c = window;
                    name.split('.').forEach(function (part) {
                        c = c[part];
                    });
                    return c;
                };
                return ComponentProvider;
            })();
            componentprovider.ComponentProvider = ComponentProvider;
            componentprovider.instance = new ComponentProvider();
        })(componentprovider = components.componentprovider || (components.componentprovider = {}));
    })(components = ho.components || (ho.components = {}));
})(ho || (ho = {}));
/// <reference path="../../bower_components/ho-watch/dist/d.ts/watch.d.ts"/>
/// <reference path="../../bower_components/ho-promise/dist/promise.d.ts"/>
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
/// <reference path="./attribute.ts"/>
var ho;
(function (ho) {
    var components;
    (function (components) {
        var attributeprovider;
        (function (attributeprovider) {
            var Promise = ho.promise.Promise;
            attributeprovider.mapping = {};
            var AttributeProvider = (function () {
                function AttributeProvider() {
                    this.useMin = false;
                }
                AttributeProvider.prototype.resolve = function (name) {
                    if (ho.components.dir) {
                        name += '.' + name.split('.').pop();
                    }
                    name = name.split('.').join('/');
                    return this.useMin ?
                        "attributes/" + name + ".min.js" :
                        "attributes/" + name + ".js";
                };
                AttributeProvider.prototype.getAttribute = function (name) {
                    var _this = this;
                    return new Promise(function (resolve, reject) {
                        var src = attributeprovider.mapping[name] || _this.resolve(name);
                        var script = document.createElement('script');
                        script.onload = function () {
                            //Component.register(window[name]);
                            if (typeof window[name] === 'function')
                                resolve(window[name]);
                            else
                                reject("Error while loading Attribute " + name);
                        };
                        script.src = src;
                        document.getElementsByTagName('head')[0].appendChild(script);
                    });
                };
                return AttributeProvider;
            })();
            attributeprovider.AttributeProvider = AttributeProvider;
            attributeprovider.instance = new AttributeProvider();
        })(attributeprovider = components.attributeprovider || (components.attributeprovider = {}));
    })(components = ho.components || (ho.components = {}));
})(ho || (ho = {}));
/// <reference path="./componentsprovider.ts"/>
/// <reference path="./attributeprovider.ts"/>
var ho;
(function (ho) {
    var components;
    (function (components) {
        var registry;
        (function (registry) {
            var Promise = ho.promise.Promise;
            var Registry = (function () {
                function Registry() {
                    this.components = [];
                    this.attributes = [];
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
                    return this.getParentOfComponent(name)
                        .then(function (parent) {
                        if (self.hasComponent(parent) || parent === 'ho.components.Component')
                            return true;
                        else
                            return self.loadComponent(parent);
                    })
                        .then(function (parentType) {
                        return ho.components.componentprovider.instance.getComponent(name);
                    })
                        .then(function (component) {
                        self.register(component);
                        return component;
                    });
                    //return this.options.componentProvider.getComponent(name)
                };
                Registry.prototype.loadAttribute = function (name) {
                    var self = this;
                    return this.getParentOfAttribute(name)
                        .then(function (parent) {
                        if (self.hasAttribute(parent) || parent === 'ho.components.Attribute' || parent === 'ho.components.WatchAttribute')
                            return true;
                        else
                            return self.loadAttribute(parent);
                    })
                        .then(function (parentType) {
                        return ho.components.attributeprovider.instance.getAttribute(name);
                    })
                        .then(function (attribute) {
                        self.register(attribute);
                        return attribute;
                    });
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
                Registry.prototype.getParentOfComponent = function (name) {
                    return this.getParentOfClass(ho.components.componentprovider.instance.resolve(name));
                };
                Registry.prototype.getParentOfAttribute = function (name) {
                    return this.getParentOfClass(ho.components.attributeprovider.instance.resolve(name));
                };
                Registry.prototype.getParentOfClass = function (path) {
                    return new Promise(function (resolve, reject) {
                        var xmlhttp = new XMLHttpRequest();
                        xmlhttp.onreadystatechange = function () {
                            if (xmlhttp.readyState == 4) {
                                var resp = xmlhttp.responseText;
                                if (xmlhttp.status == 200) {
                                    var m = resp.match(/}\)\((.*)\);/);
                                    if (m !== null) {
                                        resolve(m[1]);
                                    }
                                    else {
                                        resolve(null);
                                    }
                                }
                                else {
                                    reject(resp);
                                }
                            }
                        };
                        xmlhttp.open('GET', path);
                        xmlhttp.send();
                    });
                };
                return Registry;
            })();
            registry.Registry = Registry;
            registry.instance = new Registry();
        })(registry = components.registry || (components.registry = {}));
    })(components = ho.components || (ho.components = {}));
})(ho || (ho = {}));
/// <reference path="./registry.ts"/>
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
        components.dir = false;
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
                    if (ho.components.dir) {
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
/// <reference path="./registry.ts"/>
/// <reference path="./temp"/>
var ho;
(function (ho) {
    var components;
    (function (components) {
        var renderer;
        (function (renderer) {
            var Registry = ho.components.registry.instance;
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
                            if (selfClosing && Registry.hasComponent(type)) {
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
/// <reference path="./main"/>
/// <reference path="./registry"/>
/// <reference path="./htmlprovider.ts"/>
/// <reference path="./renderer.ts"/>
/// <reference path="./attribute.ts"/>
/// <reference path="./styler.ts"/>
/// <reference path="../../bower_components/ho-promise/dist/promise.d.ts"/>
var ho;
(function (ho) {
    var components;
    (function (components_1) {
        var Registry = ho.components.registry.instance;
        var HtmlProvider = ho.components.htmlprovider.instance;
        var Renderer = ho.components.renderer.instance;
        var Promise = ho.promise.Promise;
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
                Registry.initElement(this.element)
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
                    var attr = Registry.getAttribute(a);
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
                    return !Registry.hasComponent(req);
                })
                    .map(function (req) {
                    return Registry.loadComponent(req);
                });
                var attributes = this.attributes
                    .filter(function (req) {
                    return !Registry.hasAttribute(req);
                })
                    .map(function (req) {
                    return Registry.loadAttribute(req);
                });
                var promises = components.concat(attributes);
                return Promise.all(promises);
            };
            ;
            /*
            static register(c: typeof Component): void {
                Registry.register(c);
            }
            */
            /*
            static run(opt?: any) {
                Registry.setOptions(opt);
                Registry.run();
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

var ho;
(function (ho) {
    var flux;
    (function (flux) {
        var storeprovider;
        (function (storeprovider) {
            var Promise = ho.promise.Promise;
            storeprovider.mapping = {};
            var StoreProvider = (function () {
                function StoreProvider() {
                    this.useMin = false;
                }
                StoreProvider.prototype.resolve = function (name) {
                    if (ho.flux.dir) {
                        name += '.' + name.split('.').pop();
                    }
                    name = name.split('.').join('/');
                    return this.useMin ?
                        "stores/" + name + ".min.js" :
                        "stores/" + name + ".js";
                };
                StoreProvider.prototype.getStore = function (name) {
                    var _this = this;
                    if (window[name] !== undefined && window[name].prototype instanceof flux.Store)
                        return Promise.create(window[name]);
                    return new Promise(function (resolve, reject) {
                        var src = storeprovider.mapping[name] || _this.resolve(name);
                        var script = document.createElement('script');
                        script.onload = function () {
                            if (typeof this.get(name) === 'function')
                                resolve(this.get(name));
                            else
                                reject("Error while loading Store " + name);
                        }.bind(_this);
                        script.src = src;
                        document.getElementsByTagName('head')[0].appendChild(script);
                    });
                };
                StoreProvider.prototype.get = function (name) {
                    var c = window;
                    name.split('.').forEach(function (part) {
                        c = c[part];
                    });
                    return c;
                };
                return StoreProvider;
            })();
            storeprovider.instance = new StoreProvider();
        })(storeprovider = flux.storeprovider || (flux.storeprovider = {}));
    })(flux = ho.flux || (ho.flux = {}));
})(ho || (ho = {}));

var ho;
(function (ho) {
    var flux;
    (function (flux) {
        var Promise = ho.promise.Promise;
        var Storeregistry = (function () {
            function Storeregistry() {
                this.stores = {};
            }
            Storeregistry.prototype.register = function (store) {
                this.stores[store.name] = store;
                return store;
            };
            Storeregistry.prototype.get = function (storeClass) {
                var name = storeClass.toString().match(/\w+/g)[1];
                return this.stores[name];
            };
            Storeregistry.prototype.loadStore = function (name) {
                var self = this;
                var ret = this.getParentOfStore(name)
                    .then(function (parent) {
                    if (self.stores[parent] instanceof flux.Store || parent === 'ho.flux.Store')
                        return true;
                    else
                        return self.loadStore(parent);
                })
                    .then(function (parentType) {
                    return ho.flux.storeprovider.instance.getStore(name);
                })
                    .then(function (storeClass) {
                    return self.register(new storeClass).init();
                })
                    .then(function () {
                    return self.stores[name];
                });
                return ret;
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
            Storeregistry.prototype.getParentOfStore = function (name) {
                return new Promise(function (resolve, reject) {
                    var xmlhttp = new XMLHttpRequest();
                    xmlhttp.onreadystatechange = function () {
                        if (xmlhttp.readyState == 4) {
                            var resp = xmlhttp.responseText;
                            if (xmlhttp.status == 200) {
                                var m = resp.match(/}\)\((.*)\);/);
                                if (m !== null) {
                                    resolve(m[1]);
                                }
                                else {
                                    resolve(null);
                                }
                            }
                            else {
                                reject(resp);
                            }
                        }
                    };
                    xmlhttp.open('GET', ho.flux.storeprovider.instance.resolve(name));
                    xmlhttp.send();
                });
            };
            return Storeregistry;
        })();
        flux.Storeregistry = Storeregistry;
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
            //private state:IState;
            //private args:any = null;
            function Router() {
                _super.call(this);
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
            Router.prototype.go = function (data) {
                ho.flux.DISPATCHER.dispatch({
                    type: 'STATE',
                    data: data
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
                //current state and args equals requested state and args -> return
                //if(this.state && this.state.name === data.state && this.equals(this.args, data.args))
                if (this.data && this.data.state && this.data.state.name === data.state && this.equals(this.data.args, data.args))
                    return;
                //get requested state
                var state = this.getStateFromName(data.state);
                //requested state has an redirect property -> call redirect state
                if (!!state.redirect) {
                    state = this.getStateFromName(state.redirect);
                }
                //TODO handler promises
                var prom = typeof state.before === 'function' ? state.before(data) : Promise.create(undefined);
                prom
                    .then(function () {
                    //does the state change request comes from extern e.g. url change in browser window ?
                    var extern = !!data.extern;
                    //------- set current state & arguments
                    //this.state = state;
                    //this.args = data.args;
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

var ho;
(function (ho) {
    var flux;
    (function (flux) {
        flux.DISPATCHER = new flux.Dispatcher();
        flux.STORES = new flux.Storeregistry();
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
                            .then(function (c) {
                            ho.components.registry.instance.register(c);
                        })
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
                    ho.components.componentprovider.mapping[c] = _this.map + 'components/' + c + '/' + c + '.js';
                });
                attributes.forEach(function (a) {
                    ho.components.attributeprovider.mapping[a] = _this.map + 'attributes/' + a + '/' + a + '.js';
                });
                stores.forEach(function (s) {
                    ho.flux.storeprovider.mapping[s] = _this.map + 'stores/' + s + '/' + s + '.js';
                });
            };
            Options.prototype.processDir = function () {
                ho.components.dir = this.dir;
            };
            Options.prototype.processMin = function () {
                ho.components.componentprovider.instance.useMin = this.min;
                ho.components.attributeprovider.instance.useMin = this.min;
                ho.flux.storeprovider.instance.useMin = this.min;
            };
            return Options;
        })();
    })(ui = ho.ui || (ho.ui = {}));
})(ho || (ho = {}));

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9zb3VyY2UvcHJvbWlzZS50cyIsIi9zb3VyY2Uvd2F0Y2gudHMiLCIvc291cmNlL2NvbXBvbmVudHNwcm92aWRlci50cyIsIi9zb3VyY2UvYXR0cmlidXRlLnRzIiwiL3NvdXJjZS9hdHRyaWJ1dGVwcm92aWRlci50cyIsIi9zb3VyY2UvcmVnaXN0cnkudHMiLCIvc291cmNlL21haW4udHMiLCIvc291cmNlL2h0bWxwcm92aWRlci50cyIsIi9zb3VyY2UvdGVtcC50cyIsIi9zb3VyY2UvcmVuZGVyZXIudHMiLCIvc291cmNlL3N0eWxlci50cyIsIi9zb3VyY2UvY29tcG9uZW50cy50cyIsIi9zb3VyY2Uvc3JjL3RzL2NhbGxiYWNraG9sZGVyLnRzIiwiL3NvdXJjZS9zcmMvdHMvc3RhdGUudHMiLCIvc291cmNlL3NyYy90cy9zdGF0ZXByb3ZpZGVyLnRzIiwiL3NvdXJjZS9zcmMvdHMvc3RvcmVwcm92aWRlci50cyIsIi9zb3VyY2Uvc3JjL3RzL3N0b3JlcmVnaXN0cnkudHMiLCIvc291cmNlL3NyYy90cy9zdG9yZS50cyIsIi9zb3VyY2Uvc3JjL3RzL3JvdXRlci50cyIsIi9zb3VyY2Uvc3JjL3RzL2Rpc3BhdGNoZXIudHMiLCIvc291cmNlL3NyYy90cy9mbHV4LnRzIiwiL3NvdXJjZS91aS50cyJdLCJuYW1lcyI6WyJobyIsImhvLnByb21pc2UiLCJoby5wcm9taXNlLlByb21pc2UiLCJoby5wcm9taXNlLlByb21pc2UuY29uc3RydWN0b3IiLCJoby5wcm9taXNlLlByb21pc2Uuc2V0IiwiaG8ucHJvbWlzZS5Qcm9taXNlLnJlc29sdmUiLCJoby5wcm9taXNlLlByb21pc2UuX3Jlc29sdmUiLCJoby5wcm9taXNlLlByb21pc2UucmVqZWN0IiwiaG8ucHJvbWlzZS5Qcm9taXNlLl9yZWplY3QiLCJoby5wcm9taXNlLlByb21pc2UudGhlbiIsImhvLnByb21pc2UuUHJvbWlzZS5jYXRjaCIsImhvLnByb21pc2UuUHJvbWlzZS5hbGwiLCJoby5wcm9taXNlLlByb21pc2UuY2hhaW4iLCJoby5wcm9taXNlLlByb21pc2UuY2hhaW4ubmV4dCIsImhvLnByb21pc2UuUHJvbWlzZS5jcmVhdGUiLCJoby53YXRjaCIsImhvLndhdGNoLndhdGNoIiwiaG8ud2F0Y2guV2F0Y2hlciIsImhvLndhdGNoLldhdGNoZXIuY29uc3RydWN0b3IiLCJoby53YXRjaC5XYXRjaGVyLndhdGNoIiwiaG8ud2F0Y2guV2F0Y2hlci5jb3B5IiwiaG8uY29tcG9uZW50cyIsImhvLmNvbXBvbmVudHMuY29tcG9uZW50cHJvdmlkZXIiLCJoby5jb21wb25lbnRzLmNvbXBvbmVudHByb3ZpZGVyLkNvbXBvbmVudFByb3ZpZGVyIiwiaG8uY29tcG9uZW50cy5jb21wb25lbnRwcm92aWRlci5Db21wb25lbnRQcm92aWRlci5jb25zdHJ1Y3RvciIsImhvLmNvbXBvbmVudHMuY29tcG9uZW50cHJvdmlkZXIuQ29tcG9uZW50UHJvdmlkZXIucmVzb2x2ZSIsImhvLmNvbXBvbmVudHMuY29tcG9uZW50cHJvdmlkZXIuQ29tcG9uZW50UHJvdmlkZXIuZ2V0Q29tcG9uZW50IiwiaG8uY29tcG9uZW50cy5jb21wb25lbnRwcm92aWRlci5Db21wb25lbnRQcm92aWRlci5nZXQiLCJoby5jb21wb25lbnRzLkF0dHJpYnV0ZSIsImhvLmNvbXBvbmVudHMuQXR0cmlidXRlLmNvbnN0cnVjdG9yIiwiaG8uY29tcG9uZW50cy5BdHRyaWJ1dGUuaW5pdCIsImhvLmNvbXBvbmVudHMuQXR0cmlidXRlLm5hbWUiLCJoby5jb21wb25lbnRzLkF0dHJpYnV0ZS51cGRhdGUiLCJoby5jb21wb25lbnRzLkF0dHJpYnV0ZS5nZXROYW1lIiwiaG8uY29tcG9uZW50cy5XYXRjaEF0dHJpYnV0ZSIsImhvLmNvbXBvbmVudHMuV2F0Y2hBdHRyaWJ1dGUuY29uc3RydWN0b3IiLCJoby5jb21wb25lbnRzLldhdGNoQXR0cmlidXRlLndhdGNoIiwiaG8uY29tcG9uZW50cy5XYXRjaEF0dHJpYnV0ZS5ldmFsIiwiaG8uY29tcG9uZW50cy5hdHRyaWJ1dGVwcm92aWRlciIsImhvLmNvbXBvbmVudHMuYXR0cmlidXRlcHJvdmlkZXIuQXR0cmlidXRlUHJvdmlkZXIiLCJoby5jb21wb25lbnRzLmF0dHJpYnV0ZXByb3ZpZGVyLkF0dHJpYnV0ZVByb3ZpZGVyLmNvbnN0cnVjdG9yIiwiaG8uY29tcG9uZW50cy5hdHRyaWJ1dGVwcm92aWRlci5BdHRyaWJ1dGVQcm92aWRlci5yZXNvbHZlIiwiaG8uY29tcG9uZW50cy5hdHRyaWJ1dGVwcm92aWRlci5BdHRyaWJ1dGVQcm92aWRlci5nZXRBdHRyaWJ1dGUiLCJoby5jb21wb25lbnRzLnJlZ2lzdHJ5IiwiaG8uY29tcG9uZW50cy5yZWdpc3RyeS5SZWdpc3RyeSIsImhvLmNvbXBvbmVudHMucmVnaXN0cnkuUmVnaXN0cnkuY29uc3RydWN0b3IiLCJoby5jb21wb25lbnRzLnJlZ2lzdHJ5LlJlZ2lzdHJ5LnJlZ2lzdGVyIiwiaG8uY29tcG9uZW50cy5yZWdpc3RyeS5SZWdpc3RyeS5ydW4iLCJoby5jb21wb25lbnRzLnJlZ2lzdHJ5LlJlZ2lzdHJ5LmluaXRDb21wb25lbnQiLCJoby5jb21wb25lbnRzLnJlZ2lzdHJ5LlJlZ2lzdHJ5LmluaXRFbGVtZW50IiwiaG8uY29tcG9uZW50cy5yZWdpc3RyeS5SZWdpc3RyeS5oYXNDb21wb25lbnQiLCJoby5jb21wb25lbnRzLnJlZ2lzdHJ5LlJlZ2lzdHJ5Lmhhc0F0dHJpYnV0ZSIsImhvLmNvbXBvbmVudHMucmVnaXN0cnkuUmVnaXN0cnkuZ2V0QXR0cmlidXRlIiwiaG8uY29tcG9uZW50cy5yZWdpc3RyeS5SZWdpc3RyeS5sb2FkQ29tcG9uZW50IiwiaG8uY29tcG9uZW50cy5yZWdpc3RyeS5SZWdpc3RyeS5sb2FkQXR0cmlidXRlIiwiaG8uY29tcG9uZW50cy5yZWdpc3RyeS5SZWdpc3RyeS5nZXRQYXJlbnRPZkNvbXBvbmVudCIsImhvLmNvbXBvbmVudHMucmVnaXN0cnkuUmVnaXN0cnkuZ2V0UGFyZW50T2ZBdHRyaWJ1dGUiLCJoby5jb21wb25lbnRzLnJlZ2lzdHJ5LlJlZ2lzdHJ5LmdldFBhcmVudE9mQ2xhc3MiLCJoby5jb21wb25lbnRzLnJ1biIsImhvLmNvbXBvbmVudHMucmVnaXN0ZXIiLCJoby5jb21wb25lbnRzLmh0bWxwcm92aWRlciIsImhvLmNvbXBvbmVudHMuaHRtbHByb3ZpZGVyLkh0bWxQcm92aWRlciIsImhvLmNvbXBvbmVudHMuaHRtbHByb3ZpZGVyLkh0bWxQcm92aWRlci5jb25zdHJ1Y3RvciIsImhvLmNvbXBvbmVudHMuaHRtbHByb3ZpZGVyLkh0bWxQcm92aWRlci5yZXNvbHZlIiwiaG8uY29tcG9uZW50cy5odG1scHJvdmlkZXIuSHRtbFByb3ZpZGVyLmdldEhUTUwiLCJoby5jb21wb25lbnRzLnRlbXAiLCJoby5jb21wb25lbnRzLnRlbXAuc2V0IiwiaG8uY29tcG9uZW50cy50ZW1wLmdldCIsImhvLmNvbXBvbmVudHMudGVtcC5jYWxsIiwiaG8uY29tcG9uZW50cy5yZW5kZXJlciIsImhvLmNvbXBvbmVudHMucmVuZGVyZXIuTm9kZSIsImhvLmNvbXBvbmVudHMucmVuZGVyZXIuTm9kZS5jb25zdHJ1Y3RvciIsImhvLmNvbXBvbmVudHMucmVuZGVyZXIuUmVuZGVyZXIiLCJoby5jb21wb25lbnRzLnJlbmRlcmVyLlJlbmRlcmVyLmNvbnN0cnVjdG9yIiwiaG8uY29tcG9uZW50cy5yZW5kZXJlci5SZW5kZXJlci5yZW5kZXIiLCJoby5jb21wb25lbnRzLnJlbmRlcmVyLlJlbmRlcmVyLnBhcnNlIiwiaG8uY29tcG9uZW50cy5yZW5kZXJlci5SZW5kZXJlci5yZW5kZXJSZXBlYXQiLCJoby5jb21wb25lbnRzLnJlbmRlcmVyLlJlbmRlcmVyLmRvbVRvU3RyaW5nIiwiaG8uY29tcG9uZW50cy5yZW5kZXJlci5SZW5kZXJlci5yZXBsIiwiaG8uY29tcG9uZW50cy5yZW5kZXJlci5SZW5kZXJlci5ldmFsdWF0ZSIsImhvLmNvbXBvbmVudHMucmVuZGVyZXIuUmVuZGVyZXIuZXZhbHVhdGVWYWx1ZSIsImhvLmNvbXBvbmVudHMucmVuZGVyZXIuUmVuZGVyZXIuZXZhbHVhdGVWYWx1ZUFuZE1vZGVsIiwiaG8uY29tcG9uZW50cy5yZW5kZXJlci5SZW5kZXJlci5ldmFsdWF0ZUV4cHJlc3Npb24iLCJoby5jb21wb25lbnRzLnJlbmRlcmVyLlJlbmRlcmVyLmV2YWx1YXRlRnVuY3Rpb24iLCJoby5jb21wb25lbnRzLnJlbmRlcmVyLlJlbmRlcmVyLmNvcHlOb2RlIiwiaG8uY29tcG9uZW50cy5yZW5kZXJlci5SZW5kZXJlci5pc1ZvaWQiLCJoby5jb21wb25lbnRzLnN0eWxlciIsImhvLmNvbXBvbmVudHMuc3R5bGVyLlN0eWxlciIsImhvLmNvbXBvbmVudHMuc3R5bGVyLlN0eWxlci5jb25zdHJ1Y3RvciIsImhvLmNvbXBvbmVudHMuc3R5bGVyLlN0eWxlci5hcHBseVN0eWxlIiwiaG8uY29tcG9uZW50cy5zdHlsZXIuU3R5bGVyLmFwcGx5U3R5bGVCbG9jayIsImhvLmNvbXBvbmVudHMuc3R5bGVyLlN0eWxlci5hcHBseVJ1bGUiLCJoby5jb21wb25lbnRzLnN0eWxlci5TdHlsZXIucGFyc2VTdHlsZSIsImhvLmNvbXBvbmVudHMuQ29tcG9uZW50IiwiaG8uY29tcG9uZW50cy5Db21wb25lbnQuY29uc3RydWN0b3IiLCJoby5jb21wb25lbnRzLkNvbXBvbmVudC5uYW1lIiwiaG8uY29tcG9uZW50cy5Db21wb25lbnQuZ2V0TmFtZSIsImhvLmNvbXBvbmVudHMuQ29tcG9uZW50LmdldFBhcmVudCIsImhvLmNvbXBvbmVudHMuQ29tcG9uZW50Ll9pbml0IiwiaG8uY29tcG9uZW50cy5Db21wb25lbnQuaW5pdCIsImhvLmNvbXBvbmVudHMuQ29tcG9uZW50LnVwZGF0ZSIsImhvLmNvbXBvbmVudHMuQ29tcG9uZW50LnJlbmRlciIsImhvLmNvbXBvbmVudHMuQ29tcG9uZW50LmluaXRTdHlsZSIsImhvLmNvbXBvbmVudHMuQ29tcG9uZW50LmluaXRIVE1MIiwiaG8uY29tcG9uZW50cy5Db21wb25lbnQuaW5pdFByb3BlcnRpZXMiLCJoby5jb21wb25lbnRzLkNvbXBvbmVudC5pbml0Q2hpbGRyZW4iLCJoby5jb21wb25lbnRzLkNvbXBvbmVudC5pbml0QXR0cmlidXRlcyIsImhvLmNvbXBvbmVudHMuQ29tcG9uZW50LmxvYWRSZXF1aXJlbWVudHMiLCJoby5jb21wb25lbnRzLkNvbXBvbmVudC5nZXRDb21wb25lbnQiLCJoby5mbHV4IiwiaG8uZmx1eC5DYWxsYmFja0hvbGRlciIsImhvLmZsdXguQ2FsbGJhY2tIb2xkZXIuY29uc3RydWN0b3IiLCJoby5mbHV4LkNhbGxiYWNrSG9sZGVyLnJlZ2lzdGVyIiwiaG8uZmx1eC5DYWxsYmFja0hvbGRlci51bnJlZ2lzdGVyIiwiaG8uZmx1eC5zdGF0ZXByb3ZpZGVyIiwiaG8uZmx1eC5zdGF0ZXByb3ZpZGVyLlN0YXRlUHJvdmlkZXIiLCJoby5mbHV4LnN0YXRlcHJvdmlkZXIuU3RhdGVQcm92aWRlci5jb25zdHJ1Y3RvciIsImhvLmZsdXguc3RhdGVwcm92aWRlci5TdGF0ZVByb3ZpZGVyLnJlc29sdmUiLCJoby5mbHV4LnN0YXRlcHJvdmlkZXIuU3RhdGVQcm92aWRlci5nZXRTdGF0ZXMiLCJoby5mbHV4LnN0b3JlcHJvdmlkZXIiLCJoby5mbHV4LnN0b3JlcHJvdmlkZXIuU3RvcmVQcm92aWRlciIsImhvLmZsdXguc3RvcmVwcm92aWRlci5TdG9yZVByb3ZpZGVyLmNvbnN0cnVjdG9yIiwiaG8uZmx1eC5zdG9yZXByb3ZpZGVyLlN0b3JlUHJvdmlkZXIucmVzb2x2ZSIsImhvLmZsdXguc3RvcmVwcm92aWRlci5TdG9yZVByb3ZpZGVyLmdldFN0b3JlIiwiaG8uZmx1eC5zdG9yZXByb3ZpZGVyLlN0b3JlUHJvdmlkZXIuZ2V0IiwiaG8uZmx1eC5TdG9yZXJlZ2lzdHJ5IiwiaG8uZmx1eC5TdG9yZXJlZ2lzdHJ5LmNvbnN0cnVjdG9yIiwiaG8uZmx1eC5TdG9yZXJlZ2lzdHJ5LnJlZ2lzdGVyIiwiaG8uZmx1eC5TdG9yZXJlZ2lzdHJ5LmdldCIsImhvLmZsdXguU3RvcmVyZWdpc3RyeS5sb2FkU3RvcmUiLCJoby5mbHV4LlN0b3JlcmVnaXN0cnkuZ2V0UGFyZW50T2ZTdG9yZSIsImhvLmZsdXguU3RvcmUiLCJoby5mbHV4LlN0b3JlLmNvbnN0cnVjdG9yIiwiaG8uZmx1eC5TdG9yZS5pbml0IiwiaG8uZmx1eC5TdG9yZS5uYW1lIiwiaG8uZmx1eC5TdG9yZS5yZWdpc3RlciIsImhvLmZsdXguU3RvcmUub24iLCJoby5mbHV4LlN0b3JlLmhhbmRsZSIsImhvLmZsdXguU3RvcmUuY2hhbmdlZCIsImhvLmZsdXguUm91dGVyIiwiaG8uZmx1eC5Sb3V0ZXIuY29uc3RydWN0b3IiLCJoby5mbHV4LlJvdXRlci5pbml0IiwiaG8uZmx1eC5Sb3V0ZXIuZ28iLCJoby5mbHV4LlJvdXRlci5pbml0U3RhdGVzIiwiaG8uZmx1eC5Sb3V0ZXIuZ2V0U3RhdGVGcm9tTmFtZSIsImhvLmZsdXguUm91dGVyLm9uU3RhdGVDaGFuZ2VSZXF1ZXN0ZWQiLCJoby5mbHV4LlJvdXRlci5vbkhhc2hDaGFuZ2UiLCJoby5mbHV4LlJvdXRlci5zZXRVcmwiLCJoby5mbHV4LlJvdXRlci5yZWdleEZyb21VcmwiLCJoby5mbHV4LlJvdXRlci5hcmdzRnJvbVVybCIsImhvLmZsdXguUm91dGVyLnN0YXRlRnJvbVVybCIsImhvLmZsdXguUm91dGVyLnVybEZyb21TdGF0ZSIsImhvLmZsdXguUm91dGVyLmVxdWFscyIsImhvLmZsdXguRGlzcGF0Y2hlciIsImhvLmZsdXguRGlzcGF0Y2hlci5jb25zdHJ1Y3RvciIsImhvLmZsdXguRGlzcGF0Y2hlci53YWl0Rm9yIiwiaG8uZmx1eC5EaXNwYXRjaGVyLmRpc3BhdGNoIiwiaG8uZmx1eC5EaXNwYXRjaGVyLmludm9rZUNhbGxiYWNrIiwiaG8uZmx1eC5EaXNwYXRjaGVyLnN0YXJ0RGlzcGF0Y2hpbmciLCJoby5mbHV4LkRpc3BhdGNoZXIuc3RvcERpc3BhdGNoaW5nIiwiaG8uZmx1eC5ydW4iLCJoby51aSIsImhvLnVpLnJ1biIsImhvLnVpLk9wdGlvbnMiLCJoby51aS5PcHRpb25zLmNvbnN0cnVjdG9yIiwiaG8udWkuT3B0aW9ucy5wcm9jZXNzIiwiaG8udWkuT3B0aW9ucy5wcm9jZXNzUm9vdCIsImhvLnVpLk9wdGlvbnMucHJvY2Vzc1JvdXRlciIsImhvLnVpLk9wdGlvbnMucHJvY2Vzc01hcCIsImhvLnVpLk9wdGlvbnMucHJvY2Vzc0RpciIsImhvLnVpLk9wdGlvbnMucHJvY2Vzc01pbiJdLCJtYXBwaW5ncyI6IkFBQUEsSUFBTyxFQUFFLENBK0tSO0FBL0tELFdBQU8sRUFBRTtJQUFDQSxJQUFBQSxPQUFPQSxDQStLaEJBO0lBL0tTQSxXQUFBQSxPQUFPQSxFQUFDQSxDQUFDQTtRQUVmQztZQUVJQyxpQkFBWUEsSUFBMkRBO2dCQWEvREMsU0FBSUEsR0FBUUEsU0FBU0EsQ0FBQ0E7Z0JBQ3RCQSxjQUFTQSxHQUFvQkEsU0FBU0EsQ0FBQ0E7Z0JBQ3ZDQSxhQUFRQSxHQUFvQkEsU0FBU0EsQ0FBQ0E7Z0JBRXZDQSxhQUFRQSxHQUFZQSxLQUFLQSxDQUFDQTtnQkFDMUJBLGFBQVFBLEdBQVlBLEtBQUtBLENBQUNBO2dCQUMxQkEsU0FBSUEsR0FBWUEsS0FBS0EsQ0FBQ0E7Z0JBRXJCQSxRQUFHQSxHQUFrQkEsU0FBU0EsQ0FBQ0E7Z0JBcEJuQ0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsT0FBT0EsSUFBSUEsS0FBS0EsVUFBVUEsQ0FBQ0E7b0JBQzNCQSxJQUFJQSxDQUFDQSxJQUFJQSxDQUNMQSxTQUFTQSxDQUFDQSxNQUFNQSxFQUNoQkEsVUFBU0EsR0FBTUE7d0JBQ1gsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQTtvQkFDckIsQ0FBQyxDQUFDQSxJQUFJQSxDQUFDQSxJQUFJQSxDQUFDQSxFQUNaQSxVQUFTQSxHQUFLQTt3QkFDVixJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO29CQUNyQixDQUFDLENBQUNBLElBQUlBLENBQUNBLElBQUlBLENBQUNBLENBQ2ZBLENBQUNBO1lBQ1ZBLENBQUNBO1lBWU9ELHFCQUFHQSxHQUFYQSxV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LENBQUNBOzRCQUM5QkEsV0FBV0EsR0FBR0EsSUFBSUEsQ0FBQ0E7NEJBQ25CQSxNQUFNQSxHQUFHQSxLQUFLQSxDQUFDQTt3QkFDaEJBLENBQUNBO3dCQUFDQSxJQUFJQSxDQUFDQSxDQUFDQTs0QkFDUEEsR0FBR0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsSUFBSUEsRUFBRUEsQ0FBQ0E7NEJBQ2xCQSxJQUFJQSxHQUFHQSxDQUFDQSxHQUFHQSxHQUFDQSxHQUFHQSxDQUFDQSxDQUFDQSxLQUFLQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTs0QkFDdkNBLE9BQU9BLEdBQUdBLEdBQUdBLENBQUNBLENBQUNBLENBQUNBLEtBQUtBLEdBQUdBLENBQUNBOzRCQUNWQSxNQUFNQSxHQUFHQSxJQUFJQSxDQUFDQSxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQTs0QkFDMUNBLFdBQVdBLEdBQUdBLE1BQU1BLElBQUlBLEdBQUdBLENBQUNBLEdBQUdBLENBQUNBLE1BQU1BLEdBQUNBLENBQUNBLENBQUNBLEtBQUtBLEdBQUdBLENBQUNBOzRCQUNsREEsTUFBTUEsR0FBR0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsS0FBS0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsTUFBTUEsQ0FBQ0EsQ0FBQ0E7NEJBRXBDQSxFQUFFQSxDQUFBQSxDQUFDQSxXQUFXQSxJQUFJQSxRQUFRQSxDQUFDQSxZQUFZQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtnQ0FDL0NBLFdBQVdBLEdBQUdBLEtBQUtBLENBQUNBO2dDQUNwQkEsR0FBR0EsR0FBR0EsR0FBR0EsQ0FBQ0EsTUFBTUEsQ0FBQ0EsQ0FBQ0EsRUFBRUEsR0FBR0EsQ0FBQ0EsTUFBTUEsR0FBQ0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsR0FBR0EsQ0FBQ0E7Z0NBRXhDQSxPQUFPQSxHQUFHQSxJQUFJQSxDQUFDQTs0QkFDaEJBLENBQUNBO3dCQUNGQSxDQUFDQTt3QkFFREEsSUFBSUEsR0FBR0EsSUFBSUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsTUFBTUEsR0FBR0EsQ0FBQ0EsSUFBSUEsS0FBS0EsTUFBTUEsR0FBR0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsQ0FBRUEsQ0FBQ0E7d0JBRTNEQSxFQUFFQSxDQUFBQSxDQUFDQSxPQUFPQSxDQUFDQSxDQUFDQSxDQUFDQTs0QkFDWkEsS0FBS0EsQ0FBQ0E7d0JBQ1BBLENBQUNBO3dCQUFDQSxJQUFJQSxDQUFDQSxDQUFDQTs0QkFDUEEsSUFBSUEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsRUFBQ0EsTUFBTUEsRUFBRUEsSUFBSUEsRUFBRUEsSUFBSUEsRUFBRUEsR0FBR0EsRUFBRUEsSUFBSUEsRUFBRUEsSUFBSUEsRUFBRUEsTUFBTUEsRUFBRUEsTUFBTUEsRUFBRUEsV0FBV0EsRUFBRUEsV0FBV0EsRUFBRUEsTUFBTUEsRUFBRUEsTUFBTUEsRUFBRUEsUUFBUUEsRUFBRUEsRUFBRUEsRUFBQ0EsQ0FBQ0EsQ0FBQ0E7NEJBRWxJQSxFQUFFQSxDQUFBQSxDQUFDQSxDQUFDQSxPQUFPQSxJQUFJQSxDQUFDQSxXQUFXQSxDQUFDQSxDQUFDQSxDQUFDQTtnQ0FDN0JBLElBQUlBLE1BQU1BLEdBQUdBLElBQUlBLENBQUNBLEtBQUtBLENBQUNBLElBQUlBLEVBQUVBLElBQUlBLENBQUNBLFFBQVFBLENBQUNBLElBQUlBLENBQUNBLFFBQVFBLENBQUNBLE1BQU1BLEdBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO2dDQUNyRUEsSUFBSUEsR0FBR0EsTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0E7Z0NBQ25CQSxJQUFJQSxDQUFDQSxRQUFRQSxDQUFDQSxHQUFHQSxFQUFFQSxDQUFDQTtnQ0FDcEJBLElBQUlBLENBQUNBLFFBQVFBLENBQUNBLElBQUlBLENBQUNBLE1BQU1BLENBQUNBLElBQUlBLENBQUNBLENBQUNBOzRCQUNqQ0EsQ0FBQ0E7d0JBQ0ZBLENBQUNB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QkEsSUFBSUEsSUFBSUEsR0FBR0EsRUFBRUEsQ0FBQ0E7b0JBQ0xBLElBQU1BLEdBQUdBLEdBQVFBLElBQUlBLENBQUNBO29CQUUvQkEsRUFBRUEsQ0FBQUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7d0JBQ2RBLElBQUlBLElBQUlBLElBQUlBLEtBQUtBLENBQUNBLE1BQU1BLENBQUNBLENBQUNBLElBQUlBLENBQUNBLEdBQUdBLENBQUNBLEVBQUVBLHNCQUFzQkE7d0JBQzNEQSxFQUFFQSxDQUFBQSxDQUFDQSxJQUFJQSxDQUFDQSxJQUFJQSxLQUFLQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQTs0QkFDekJBLEVBQUVBLENBQUFBLENBQUNBLElBQUlBLENBQUNBLFdBQVdBLElBQUlBLENBQUNBLElBQUlBLENBQUNBLE1BQU1BLENBQUNBLENBQUNBLENBQUNBO2dDQUNuQkEsSUFBSUEsSUFBSUEsR0FBR0EsR0FBR0EsSUFBSUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsQ0FBQ0EsRUFBRUEsRUFBRUEsSUFBSUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsR0FBR0EsR0FBR0EsQ0FBQ0E7Z0NBQzVEQSxJQUFJQSxJQUFJQSxJQUFJQSxHQUFDQSxJQUFJQSxDQUFDQSxJQUFJQSxHQUFDQSxLQUFLQSxDQUFDQTs0QkFDakNBLENBQUNBOzRCQUNEQSxJQUFJQTtnQ0FDQUEsSUFBSUEsSUFBSUEsR0FBR0EsR0FBR0EsSUFBSUEsQ0FBQ0EsSUFBSUEsR0FBR0EsR0FBR0EsQ0FBQ0E7d0JBQ3RDQSxDQUFDQTt3QkFDYkEsSUFBSUE7NEJBQUNBLElBQUlBLElBQUlBLElBQUlBLENBQUNBLElBQUlBLENBQUNBO29CQUN4QkEsQ0FBQ0E7b0JBRURBLEVBQUVBLENBQUFBLENBQUNBLElBQUlBLENBQUNBO3dCQUNQQSxJQUFJQSxJQUFJQSxJQUFJQSxDQUFDQTtvQkFFZEEsRUFBRUEsQ0FBQUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsTUFBTUEs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Q0FBQ0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsS0FBSUEsQ0FBQ0EsR0FBR0EsR0FBR0EsU0FBU0EsR0FBR0EsQ0FBQ0EsR0FBR0EsR0FBR0EsR0FBR0EsQ0FBQ0EsR0FBR0EsS0FBS0EsQ0FBQ0E7Z0JBQy9FQSxDQUFDQSxDQUFDQSxDQUFDQTtZQUNKQSxDQUFDQTtZQUVTTCw0QkFBVUEsR0FBcEJBO2dCQUNDTSxFQUFFQSxDQUFDQSxVQUFVQSxDQUFDQSxHQUFHQSxHQUFHQSxJQUFJQSxDQUFDQSxHQUFHQSxDQUFDQTtZQUM5QkEsQ0FBQ0E7WUFFU04sNEJBQVVBLEdBQXBCQTtnQkFDQ08sRUFBRUEsQ0FBQ0EsVUFBVUEsQ0FBQ0EsaUJBQWlCQSxDQUFDQSxRQUFRQSxDQUFDQSxNQUFNQSxHQUFHQSxJQUFJQSxDQUFDQSxHQUFHQSxDQUFDQTtnQkFDM0RBLEVBQUVBLENBQUNBLFVBQVVBLENBQUNBLGlCQUFpQkEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsTUFBTUEsR0FBR0EsSUFBSUEsQ0FBQ0EsR0FBR0EsQ0FBQ0E7Z0JBQzNEQSxFQUFFQSxDQUFDQSxJQUFJQSxDQUFDQSxhQUFhQSxDQUFDQSxRQUFRQSxDQUFDQSxNQUFNQSxHQUFHQSxJQUFJQSxDQUFDQSxHQUFHQSxDQUFDQTtZQUNsREEsQ0FBQ0E7WUFDRlAsY0FBQ0E7UUFBREEsQ0FuRkFGLEFBbUZDRSxJQUFBRjtJQUVGQSxDQUFDQSxFQXhIU2pLLEVBQUVBLEdBQUZBLEtBQUVBLEtBQUZBLEtBQUVBLFFBd0hYQTtBQUFEQSxDQUFDQSxFQXhITSxFQUFFLEtBQUYsRUFBRSxRQXdIUiIsImZpbGUiOiJoby1hbGwuanMiLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUgaG8ucHJvbWlzZSB7XHJcblxyXG4gICAgZXhwb3J0IGNsYXNzIFByb21pc2U8VCwgRT4ge1xyXG5cclxuICAgICAgICBjb25zdHJ1Y3RvcihmdW5jPzogKHJlc29sdmU6KGFyZzpUKT0+dm9pZCwgcmVqZWN0Oihhcmc6RSk9PnZvaWQpID0+IGFueSkge1xyXG4gICAgICAgICAgICBpZiAodHlwZW9mIGZ1bmMgPT09ICdmdW5jdGlvbicpXHJcbiAgICAgICAgICAgICAgICBmdW5jLmNhbGwoXHJcbiAgICAgICAgICAgICAgICAgICAgYXJndW1lbnRzLmNhbGxlZSxcclxuICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbihhcmc6IFQpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnJlc29sdmUoYXJnKVxyXG4gICAgICAgICAgICAgICAgICAgIH0uYmluZCh0aGlzKSxcclxuICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbihhcmc6RSl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucmVqZWN0KGFyZyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfS5iaW5kKHRoaXMpXHJcbiAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSBkYXRhOiBUfEUgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgcHJpdmF0ZSBvblJlc29sdmU6IChhcmcxOlQpID0+IGFueSA9IHVuZGVmaW5lZDtcclxuICAgICAgICBwcml2YXRlIG9uUmVqZWN0OiAoYXJnMTpFKSA9PiBhbnkgPSB1bmRlZmluZWQ7XHJcblxyXG4gICAgICAgIHB1YmxpYyByZXNvbHZlZDogYm9vbGVhbiA9IGZhbHNlO1xyXG4gICAgICAgIHB1YmxpYyByZWplY3RlZDogYm9vbGVhbiA9IGZhbHNlO1xyXG4gICAgICAgIHB1YmxpYyBkb25lOiBib29sZWFuID0gZmFsc2U7XHJcblxyXG4gICAgICAgIHByaXZhdGUgcmV0OiBQcm9taXNlPFQsIEU+ID0gdW5kZWZpbmVkO1xyXG5cclxuICAgICAgICBwcml2YXRlIHNldChkYXRhPzogVHxFKTogdm9pZCB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmRvbmUpXHJcbiAgICAgICAgICAgICAgICB0aHJvdyBcIlByb21pc2UgaXMgYWxyZWFkeSByZXNvbHZlZCAvIHJlamVjdGVkXCI7XHJcbiAgICAgICAgICAgIHRoaXMuZGF0YSA9IGRhdGE7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgcmVzb2x2ZShkYXRhPzogVCk6IHZvaWQge1xyXG4gICAgICAgICAgICB0aGlzLnNldChkYXRhKTtcclxuICAgICAgICAgICAgdGhpcy5yZXNvbHZlZCA9IHRoaXMuZG9uZSA9IHRydWU7XHJcbiAgICAgICAgICAgIGlmICh0eXBlb2YgdGhpcy5vblJlc29sdmUgPT09ICdmdW5jdGlvbicpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3Jlc29sdmUoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSBfcmVzb2x2ZSgpOiB2b2lkIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMucmV0ID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMucmV0ID0gbmV3IFByb21pc2U8VCxFPigpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB2YXIgdjogYW55ID0gdGhpcy5vblJlc29sdmUoPFQ+dGhpcy5kYXRhKTtcclxuXHJcbiAgICAgICAgICAgIGlmICh2ICYmIHYgaW5zdGFuY2VvZiBQcm9taXNlKSB7XHJcbiAgICAgICAgICAgICAgICB2LnRoZW4odGhpcy5yZXQucmVzb2x2ZS5iaW5kKHRoaXMucmV0KSwgdGhpcy5yZXQucmVqZWN0LmJpbmQodGhpcy5yZXQpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMucmV0LnJlc29sdmUodik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyByZWplY3QoZGF0YT86IEUpOiB2b2lkIHtcclxuICAgICAgICAgICAgdGhpcy5zZXQoZGF0YSk7XHJcbiAgICAgICAgICAgIHRoaXMucmVqZWN0ZWQgPSB0aGlzLmRvbmUgPSB0cnVlO1xyXG5cclxuICAgICAgICAgICAgaWYgKHR5cGVvZiB0aGlzLm9uUmVqZWN0ID09PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm9uUmVqZWN0KDxFPnRoaXMuZGF0YSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmICh0aGlzLnJldCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5yZXQucmVqZWN0KDxFPnRoaXMuZGF0YSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByaXZhdGUgX3JlamVjdCgpOiB2b2lkIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMucmV0ID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMucmV0ID0gbmV3IFByb21pc2U8VCxFPigpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB0aGlzLm9uUmVqZWN0KDxFPnRoaXMuZGF0YSk7XHJcbiAgICAgICAgICAgIHRoaXMucmV0LnJlamVjdCg8RT50aGlzLmRhdGEpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHRoZW4ocmVzOiAoYXJnMTpUKT0+YW55LCByZWo/OiAoYXJnMTpFKT0+YW55KTogUHJvbWlzZTxhbnksYW55PiB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnJldCA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnJldCA9IG5ldyBQcm9taXNlPFQsRT4oKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKHJlcyAmJiB0eXBlb2YgcmVzID09PSAnZnVuY3Rpb24nKVxyXG4gICAgICAgICAgICAgICAgdGhpcy5vblJlc29sdmUgPSByZXM7XHJcblxyXG4gICAgICAgICAgICBpZiAocmVqICYmIHR5cGVvZiByZWogPT09ICdmdW5jdGlvbicpXHJcbiAgICAgICAgICAgICAgICB0aGlzLm9uUmVqZWN0ID0gcmVqO1xyXG5cclxuICAgICAgICAgICAgaWYgKHRoaXMucmVzb2x2ZWQpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3Jlc29sdmUoKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKHRoaXMucmVqZWN0ZWQpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3JlamVjdCgpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5yZXQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgY2F0Y2goY2I6IChhcmcxOkUpPT5hbnkpOiB2b2lkIHtcclxuICAgICAgICAgICAgdGhpcy5vblJlamVjdCA9IGNiO1xyXG5cclxuICAgICAgICAgICAgaWYgKHRoaXMucmVqZWN0ZWQpXHJcbiAgICAgICAgICAgICAgICB0aGlzLl9yZWplY3QoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHN0YXRpYyBhbGwoYXJyOiBBcnJheTxQcm9taXNlPGFueSwgYW55Pj4pOiBQcm9taXNlPGFueSwgYW55PiB7XHJcbiAgICAgICAgICAgIHZhciBwID0gbmV3IFByb21pc2UoKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBkYXRhID0gW107XHJcblxyXG4gICAgICAgICAgICBpZiAoYXJyLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgICAgICAgICAgcC5yZXNvbHZlKCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBhcnIuZm9yRWFjaCgocHJvbSwgaW5kZXgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBwcm9tXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKGQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHAuZG9uZSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFbaW5kZXhdID0gZDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGFsbFJlc29sdmVkID0gYXJyLnJlZHVjZShmdW5jdGlvbihzdGF0ZSwgcDEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBzdGF0ZSAmJiBwMS5yZXNvbHZlZDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSwgdHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChhbGxSZXNvbHZlZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcC5yZXNvbHZlKGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5jYXRjaChmdW5jdGlvbihlcnIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcC5yZWplY3QoZXJyKTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gcDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHN0YXRpYyBjaGFpbihhcnI6IEFycmF5PFByb21pc2U8YW55LCBhbnk+Pik6IFByb21pc2U8YW55LCBhbnk+IHtcclxuICAgICAgICAgICAgdmFyIHA6IFByb21pc2U8YW55LCBhbnk+ID0gbmV3IFByb21pc2UoKTtcclxuICAgICAgICAgICAgdmFyIGRhdGE6IEFycmF5PGFueT4gPSBbXTtcclxuXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIG5leHQoKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAocC5kb25lKVxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgbjogUHJvbWlzZTxhbnksIGFueT4gPSBhcnIubGVuZ3RoID8gYXJyLnNoaWZ0KCkgOiBwO1xyXG4gICAgICAgICAgICAgICAgbi50aGVuKFxyXG4gICAgICAgICAgICAgICAgICAgIChyZXN1bHQpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YS5wdXNoKHJlc3VsdCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5leHQoKTtcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIChlcnIpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcC5yZWplY3QoZXJyKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgbmV4dCgpO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHA7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzdGF0aWMgY3JlYXRlKG9iajogYW55KTogUHJvbWlzZTxhbnksIGFueT4ge1xyXG4gICAgICAgICAgICBpZiAob2JqIGluc3RhbmNlb2YgUHJvbWlzZSlcclxuICAgICAgICAgICAgICAgIHJldHVybiBvYmo7XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdmFyIHAgPSBuZXcgUHJvbWlzZSgpO1xyXG4gICAgICAgICAgICAgICAgcC5yZXNvbHZlKG9iaik7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbn1cclxuIiwiaW50ZXJmYWNlIFdpbmRvdyB7XG5cdHdlYmtpdFJlcXVlc3RBbmltYXRpb25GcmFtZTogKGNhbGxiYWNrOiBGcmFtZVJlcXVlc3RDYWxsYmFjaykgPT4gbnVtYmVyO1xuXHRtb3pSZXF1ZXN0QW5pbWF0aW9uRnJhbWU6IChjYWxsYmFjazogRnJhbWVSZXF1ZXN0Q2FsbGJhY2spID0+IG51bWJlcjtcblx0b1JlcXVlc3RBbmltYXRpb25GcmFtZTogKGNhbGxiYWNrOiBGcmFtZVJlcXVlc3RDYWxsYmFjaykgPT4gbnVtYmVyO1xufVxuXG5tb2R1bGUgaG8ud2F0Y2gge1xuXG5cdGV4cG9ydCB0eXBlIEhhbmRsZXIgPSAob2JqOmFueSwgbmFtZTpzdHJpbmcsIG9sZFY6YW55LCBuZXdWOmFueSwgIHRpbWVzdGFtcD86IG51bWJlcik9PmFueTtcblxuXHRleHBvcnQgZnVuY3Rpb24gd2F0Y2gob2JqOiBhbnksIG5hbWU6IHN0cmluZywgaGFuZGxlcjogSGFuZGxlcik6IHZvaWQge1xuXHRcdG5ldyBXYXRjaGVyKG9iaiwgbmFtZSwgaGFuZGxlcik7XG5cdH1cblxuXHRjbGFzcyBXYXRjaGVyIHtcblxuXHRcdHByaXZhdGUgb2xkVmFsOmFueTtcblxuXHRcdGNvbnN0cnVjdG9yKHByaXZhdGUgb2JqOiBhbnksIHByaXZhdGUgbmFtZTogc3RyaW5nLCBwcml2YXRlIGhhbmRsZXI6IEhhbmRsZXIpIHtcblx0XHRcdHRoaXMub2xkVmFsID0gdGhpcy5jb3B5KG9ialtuYW1lXSk7XG5cblx0XHRcdHRoaXMud2F0Y2godGltZXN0YW1wID0+IHtcblx0XHRcdFx0aWYodGhpcy5vbGRWYWwgIT09IG9ialtuYW1lXSkge1xuXHRcdFx0XHRcdHRoaXMuaGFuZGxlci5jYWxsKG51bGwsIG9iaiwgbmFtZSwgdGhpcy5vbGRWYWwsIG9ialtuYW1lXSwgdGltZXN0YW1wKTtcblx0XHRcdFx0XHR0aGlzLm9sZFZhbCA9IHRoaXMuY29weShvYmpbbmFtZV0pO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHR9XG5cblx0XHRwcml2YXRlIHdhdGNoKGNiOiAodGltZVN0YW1wOm51bWJlcik9PmFueSk6IHZvaWQge1xuXHRcdFx0bGV0IGZuOiBGdW5jdGlvbiA9XG5cdFx0XHR3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lICAgICAgIHx8XG5cdCAgXHRcdHdpbmRvdy53ZWJraXRSZXF1ZXN0QW5pbWF0aW9uRnJhbWUgfHxcblx0ICBcdFx0d2luZG93Lm1velJlcXVlc3RBbmltYXRpb25GcmFtZSAgICB8fFxuXHQgIFx0XHR3aW5kb3cub1JlcXVlc3RBbmltYXRpb25GcmFtZSAgICAgIHx8XG5cdCAgXHRcdHdpbmRvdy5tc1JlcXVlc3RBbmltYXRpb25GcmFtZSAgICAgfHxcblx0ICBcdFx0ZnVuY3Rpb24oY2FsbGJhY2s6IEZ1bmN0aW9uKXtcblx0XHRcdFx0d2luZG93LnNldFRpbWVvdXQoY2FsbGJhY2ssIDEwMDAgLyA2MCk7XG5cdCAgXHRcdH07XG5cblx0XHRcdGxldCB3cmFwID0gKHRzOiBudW1iZXIpID0+IHtcblx0XHRcdFx0Y2IodHMpO1xuXHRcdFx0XHRmbih3cmFwKTtcblx0XHRcdH1cblxuXHRcdFx0Zm4od3JhcCk7XG5cdFx0fVxuXG5cdFx0cHJpdmF0ZSBjb3B5KHZhbDogYW55KTogYW55IHtcblx0XHRcdHJldHVybiBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KHZhbCkpO1xuXHRcdH1cblx0fVxuXG59XG4iLCJtb2R1bGUgaG8uY29tcG9uZW50cy5jb21wb25lbnRwcm92aWRlciB7XHJcbiAgICBpbXBvcnQgUHJvbWlzZSA9IGhvLnByb21pc2UuUHJvbWlzZTtcclxuXHJcbiAgICBleHBvcnQgbGV0IG1hcHBpbmc6IHtbbmFtZTpzdHJpbmddOnN0cmluZ30gPSB7fTtcclxuXHJcbiAgICBleHBvcnQgY2xhc3MgQ29tcG9uZW50UHJvdmlkZXIge1xyXG5cclxuICAgICAgICB1c2VNaW46IGJvb2xlYW4gPSBmYWxzZTtcclxuXHJcbiAgICAgICAgcmVzb2x2ZShuYW1lOiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICBpZihoby5jb21wb25lbnRzLmRpcikge1xyXG4gICAgICAgICAgICAgICAgbmFtZSArPSAnLicgKyBuYW1lLnNwbGl0KCcuJykucG9wKCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIG5hbWUgPSBuYW1lLnNwbGl0KCcuJykuam9pbignLycpO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMudXNlTWluID9cclxuICAgICAgICAgICAgICAgIGBjb21wb25lbnRzLyR7bmFtZX0ubWluLmpzYCA6XHJcbiAgICAgICAgICAgICAgICBgY29tcG9uZW50cy8ke25hbWV9LmpzYDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGdldENvbXBvbmVudChuYW1lOiBzdHJpbmcpOiBQcm9taXNlPHR5cGVvZiBDb21wb25lbnQsIHN0cmluZz4ge1xyXG4gICAgICAgICAgICByZXR1cm4gbmV3IFByb21pc2U8dHlwZW9mIENvbXBvbmVudCwgYW55PigocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgICAgICBsZXQgc3JjID0gbWFwcGluZ1tuYW1lXSB8fCB0aGlzLnJlc29sdmUobmFtZSk7XHJcbiAgICAgICAgICAgICAgICBsZXQgc2NyaXB0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc2NyaXB0Jyk7XHJcbiAgICAgICAgICAgICAgICBzY3JpcHQub25sb2FkID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy9Db21wb25lbnQucmVnaXN0ZXIod2luZG93W25hbWVdKTtcclxuICAgICAgICAgICAgICAgICAgICBpZih0eXBlb2YgdGhpcy5nZXQobmFtZSkgPT09ICdmdW5jdGlvbicpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUodGhpcy5nZXQobmFtZSkpO1xyXG4gICAgICAgICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVqZWN0KGBFcnJvciB3aGlsZSBsb2FkaW5nIENvbXBvbmVudCAke25hbWV9YClcclxuICAgICAgICAgICAgICAgIH0uYmluZCh0aGlzKTtcclxuICAgICAgICAgICAgICAgIHNjcmlwdC5zcmMgPSBzcmM7XHJcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnaGVhZCcpWzBdLmFwcGVuZENoaWxkKHNjcmlwdCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByaXZhdGUgZ2V0KG5hbWU6IHN0cmluZyk6IHR5cGVvZiBDb21wb25lbnQge1xyXG4gICAgICAgICAgICBsZXQgYzogYW55ID0gd2luZG93O1xyXG4gICAgICAgICAgICBuYW1lLnNwbGl0KCcuJykuZm9yRWFjaCgocGFydCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgYyA9IGNbcGFydF07XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICByZXR1cm4gPHR5cGVvZiBDb21wb25lbnQ+YztcclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBsZXQgaW5zdGFuY2UgPSBuZXcgQ29tcG9uZW50UHJvdmlkZXIoKTtcclxuXHJcbn1cclxuIiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uLy4uL2Jvd2VyX2NvbXBvbmVudHMvaG8td2F0Y2gvZGlzdC9kLnRzL3dhdGNoLmQudHNcIi8+XG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vLi4vYm93ZXJfY29tcG9uZW50cy9oby1wcm9taXNlL2Rpc3QvcHJvbWlzZS5kLnRzXCIvPlxuXG5tb2R1bGUgaG8uY29tcG9uZW50cyB7XG5cblx0aW1wb3J0IFByb21pc2UgPSBoby5wcm9taXNlLlByb21pc2U7XG5cblx0LyoqXG5cdFx0QmFzZWNsYXNzIGZvciBBdHRyaWJ1dGVzLlxuXHRcdFVzZWQgQXR0cmlidXRlcyBuZWVkcyB0byBiZSBzcGVjaWZpZWQgYnkgQ29tcG9uZW50I2F0dHJpYnV0ZXMgcHJvcGVydHkgdG8gZ2V0IGxvYWRlZCBwcm9wZXJseS5cblx0Ki9cblx0ZXhwb3J0IGNsYXNzIEF0dHJpYnV0ZSB7XG5cblx0XHRwcm90ZWN0ZWQgZWxlbWVudDogSFRNTEVsZW1lbnQ7XG5cdFx0cHJvdGVjdGVkIGNvbXBvbmVudDogQ29tcG9uZW50O1xuXHRcdHByb3RlY3RlZCB2YWx1ZTogc3RyaW5nO1xuXG5cdFx0Y29uc3RydWN0b3IoZWxlbWVudDogSFRNTEVsZW1lbnQsIHZhbHVlPzogc3RyaW5nKSB7XG5cdFx0XHR0aGlzLmVsZW1lbnQgPSBlbGVtZW50O1xuXHRcdFx0dGhpcy5jb21wb25lbnQgPSBDb21wb25lbnQuZ2V0Q29tcG9uZW50KGVsZW1lbnQpO1xuXHRcdFx0dGhpcy52YWx1ZSA9IHZhbHVlO1xuXG5cdFx0XHR0aGlzLmluaXQoKTtcblx0XHR9XG5cblx0XHRwcm90ZWN0ZWQgaW5pdCgpOiB2b2lkIHt9XG5cblx0XHRnZXQgbmFtZSgpIHtcblx0XHRcdHJldHVybiBBdHRyaWJ1dGUuZ2V0TmFtZSh0aGlzKTtcblx0XHR9XG5cblxuXHRcdHB1YmxpYyB1cGRhdGUoKTogdm9pZCB7XG5cblx0XHR9XG5cblxuXHRcdHN0YXRpYyBnZXROYW1lKGNsYXp6OiB0eXBlb2YgQXR0cmlidXRlIHwgQXR0cmlidXRlKTogc3RyaW5nIHtcbiAgICAgICAgICAgIGlmKGNsYXp6IGluc3RhbmNlb2YgQXR0cmlidXRlKVxuICAgICAgICAgICAgICAgIHJldHVybiBjbGF6ei5jb25zdHJ1Y3Rvci50b1N0cmluZygpLm1hdGNoKC9cXHcrL2cpWzFdO1xuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIHJldHVybiBjbGF6ei50b1N0cmluZygpLm1hdGNoKC9cXHcrL2cpWzFdO1xuICAgICAgICB9XG5cdH1cblxuXHRleHBvcnQgY2xhc3MgV2F0Y2hBdHRyaWJ1dGUgZXh0ZW5kcyBBdHRyaWJ1dGUge1xuXG5cdFx0cHJvdGVjdGVkIHI6IFJlZ0V4cCA9IC8jKC4rPykjL2c7XG5cblx0XHRjb25zdHJ1Y3RvcihlbGVtZW50OiBIVE1MRWxlbWVudCwgdmFsdWU/OiBzdHJpbmcpIHtcblx0XHRcdHN1cGVyKGVsZW1lbnQsIHZhbHVlKTtcblxuXHRcdFx0bGV0IG06IGFueVtdID0gdGhpcy52YWx1ZS5tYXRjaCh0aGlzLnIpIHx8IFtdO1xuXHRcdFx0bS5tYXAoZnVuY3Rpb24odykge1xuXHRcdFx0XHR3ID0gdy5zdWJzdHIoMSwgdy5sZW5ndGgtMik7XG5cdFx0XHRcdHRoaXMud2F0Y2godyk7XG5cdFx0XHR9LmJpbmQodGhpcykpO1xuXHRcdFx0dGhpcy52YWx1ZSA9IHRoaXMudmFsdWUucmVwbGFjZSgvIy9nLCAnJyk7XG5cdFx0fVxuXG5cblx0XHRwcm90ZWN0ZWQgd2F0Y2gocGF0aDogc3RyaW5nKTogdm9pZCB7XG5cdFx0XHRsZXQgcGF0aEFyciA9IHBhdGguc3BsaXQoJy4nKTtcblx0XHRcdGxldCBwcm9wID0gcGF0aEFyci5wb3AoKTtcblx0XHRcdGxldCBvYmogPSB0aGlzLmNvbXBvbmVudDtcblxuXHRcdFx0cGF0aEFyci5tYXAoKHBhcnQpID0+IHtcblx0XHRcdFx0b2JqID0gb2JqW3BhcnRdO1xuXHRcdFx0fSk7XG5cblx0XHRcdGhvLndhdGNoLndhdGNoKG9iaiwgcHJvcCwgdGhpcy51cGRhdGUuYmluZCh0aGlzKSk7XG5cdFx0fVxuXG5cdFx0cHJvdGVjdGVkIGV2YWwocGF0aDogc3RyaW5nKTogYW55IHtcblx0XHRcdGxldCBtb2RlbCA9IHRoaXMuY29tcG9uZW50O1xuXHRcdFx0bW9kZWwgPSBuZXcgRnVuY3Rpb24oT2JqZWN0LmtleXMobW9kZWwpLnRvU3RyaW5nKCksIFwicmV0dXJuIFwiICsgcGF0aClcblx0XHRcdFx0LmFwcGx5KG51bGwsIE9iamVjdC5rZXlzKG1vZGVsKS5tYXAoKGspID0+IHtyZXR1cm4gbW9kZWxba119KSApO1xuXHRcdFx0cmV0dXJuIG1vZGVsO1xuXHRcdH1cblxuXHR9XG59XG4iLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi9hdHRyaWJ1dGUudHNcIi8+XHJcblxyXG5tb2R1bGUgaG8uY29tcG9uZW50cy5hdHRyaWJ1dGVwcm92aWRlciB7XHJcbiAgICBpbXBvcnQgUHJvbWlzZSA9IGhvLnByb21pc2UuUHJvbWlzZTtcclxuXHJcbiAgICBleHBvcnQgbGV0IG1hcHBpbmc6IHtbbmFtZTpzdHJpbmddOnN0cmluZ30gPSB7fTtcclxuXHJcbiAgICBleHBvcnQgY2xhc3MgQXR0cmlidXRlUHJvdmlkZXIge1xyXG5cclxuICAgICAgICB1c2VNaW46IGJvb2xlYW4gPSBmYWxzZTtcclxuXHJcblxyXG4gICAgICAgIHJlc29sdmUobmFtZTogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgaWYoaG8uY29tcG9uZW50cy5kaXIpIHtcclxuICAgICAgICAgICAgICAgIG5hbWUgKz0gJy4nICsgbmFtZS5zcGxpdCgnLicpLnBvcCgpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBuYW1lID0gbmFtZS5zcGxpdCgnLicpLmpvaW4oJy8nKTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnVzZU1pbiA/XHJcbiAgICAgICAgICAgICAgICBgYXR0cmlidXRlcy8ke25hbWV9Lm1pbi5qc2AgOlxyXG4gICAgICAgICAgICAgICAgYGF0dHJpYnV0ZXMvJHtuYW1lfS5qc2A7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBnZXRBdHRyaWJ1dGUobmFtZTogc3RyaW5nKTogUHJvbWlzZTx0eXBlb2YgQXR0cmlidXRlLCBzdHJpbmc+IHtcclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlPHR5cGVvZiBBdHRyaWJ1dGUsIGFueT4oKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgbGV0IHNyYyA9IG1hcHBpbmdbbmFtZV0gfHwgdGhpcy5yZXNvbHZlKG5hbWUpO1xyXG4gICAgICAgICAgICAgICAgbGV0IHNjcmlwdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NjcmlwdCcpO1xyXG4gICAgICAgICAgICAgICAgc2NyaXB0Lm9ubG9hZCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vQ29tcG9uZW50LnJlZ2lzdGVyKHdpbmRvd1tuYW1lXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYodHlwZW9mIHdpbmRvd1tuYW1lXSA9PT0gJ2Z1bmN0aW9uJylcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSh3aW5kb3dbbmFtZV0pO1xyXG4gICAgICAgICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVqZWN0KGBFcnJvciB3aGlsZSBsb2FkaW5nIEF0dHJpYnV0ZSAke25hbWV9YClcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICBzY3JpcHQuc3JjID0gc3JjO1xyXG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2hlYWQnKVswXS5hcHBlbmRDaGlsZChzY3JpcHQpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgbGV0IGluc3RhbmNlID0gbmV3IEF0dHJpYnV0ZVByb3ZpZGVyKCk7XHJcblxyXG59XHJcbiIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuL2NvbXBvbmVudHNwcm92aWRlci50c1wiLz5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4vYXR0cmlidXRlcHJvdmlkZXIudHNcIi8+XHJcblxyXG5tb2R1bGUgaG8uY29tcG9uZW50cy5yZWdpc3RyeSB7XHJcbiAgICBpbXBvcnQgUHJvbWlzZSA9IGhvLnByb21pc2UuUHJvbWlzZTtcclxuXHJcbiAgICBleHBvcnQgY2xhc3MgUmVnaXN0cnkge1xyXG5cclxuICAgICAgICBwcml2YXRlIGNvbXBvbmVudHM6IEFycmF5PHR5cGVvZiBDb21wb25lbnQ+ID0gW107XHJcbiAgICAgICAgcHJpdmF0ZSBhdHRyaWJ1dGVzOiBBcnJheTx0eXBlb2YgQXR0cmlidXRlPiA9IFtdO1xyXG5cclxuXHJcbiAgICAgICAgcHVibGljIHJlZ2lzdGVyKGNhOiB0eXBlb2YgQ29tcG9uZW50IHwgdHlwZW9mIEF0dHJpYnV0ZSk6IHZvaWQge1xyXG4gICAgICAgICAgICBpZihjYS5wcm90b3R5cGUgaW5zdGFuY2VvZiBDb21wb25lbnQpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuY29tcG9uZW50cy5wdXNoKDx0eXBlb2YgQ29tcG9uZW50PmNhKTtcclxuICAgICAgICAgICAgICAgIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoQ29tcG9uZW50LmdldE5hbWUoPHR5cGVvZiBDb21wb25lbnQ+Y2EpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmKGNhLnByb3RvdHlwZSBpbnN0YW5jZW9mIEF0dHJpYnV0ZSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5hdHRyaWJ1dGVzLnB1c2goPHR5cGVvZiBBdHRyaWJ1dGU+Y2EpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgcnVuKCk6IFByb21pc2U8YW55LCBhbnk+IHtcclxuICAgICAgICAgICAgbGV0IGluaXRDb21wb25lbnQ6IChjOiB0eXBlb2YgQ29tcG9uZW50KT0+UHJvbWlzZTxhbnksIGFueT4gPSB0aGlzLmluaXRDb21wb25lbnQuYmluZCh0aGlzKTtcclxuICAgICAgICAgICAgbGV0IHByb21pc2VzOiBBcnJheTxQcm9taXNlPGFueSwgYW55Pj4gPSB0aGlzLmNvbXBvbmVudHMubWFwKChjKT0+e1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGluaXRDb21wb25lbnQoYyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIFByb21pc2UuYWxsKHByb21pc2VzKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBpbml0Q29tcG9uZW50KGNvbXBvbmVudDogdHlwZW9mIENvbXBvbmVudCwgZWxlbWVudDpIVE1MRWxlbWVudHxEb2N1bWVudD1kb2N1bWVudCk6IFByb21pc2U8YW55LCBhbnk+IHtcclxuICAgICAgICAgICAgbGV0IHByb21pc2VzOiBBcnJheTxQcm9taXNlPGFueSwgYW55Pj4gPSBBcnJheS5wcm90b3R5cGUubWFwLmNhbGwoXHJcbiAgICAgICAgICAgICAgICBlbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoQ29tcG9uZW50LmdldE5hbWUoY29tcG9uZW50KSksXHJcbiAgICAgICAgICAgICAgICBmdW5jdGlvbihlKTogUHJvbWlzZTxhbnksIGFueT4ge1xyXG5cdCAgICAgICAgICAgICAgICByZXR1cm4gbmV3IGNvbXBvbmVudChlKS5faW5pdCgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cdFx0XHQpO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIFByb21pc2UuYWxsKHByb21pc2VzKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBpbml0RWxlbWVudChlbGVtZW50OiBIVE1MRWxlbWVudCk6IFByb21pc2U8YW55LCBhbnk+IHtcclxuICAgICAgICAgICAgbGV0IGluaXRDb21wb25lbnQ6IChjOiB0eXBlb2YgQ29tcG9uZW50LCBlbGVtZW50OiBIVE1MRWxlbWVudCk9PlByb21pc2U8YW55LCBhbnk+ID0gdGhpcy5pbml0Q29tcG9uZW50LmJpbmQodGhpcyk7XHJcbiAgICAgICAgICAgIGxldCBwcm9taXNlczogQXJyYXk8UHJvbWlzZTxhbnksIGFueT4+ID0gQXJyYXkucHJvdG90eXBlLm1hcC5jYWxsKFxyXG4gICAgICAgICAgICAgICAgdGhpcy5jb21wb25lbnRzLFxyXG4gICAgICAgICAgICAgICAgY29tcG9uZW50ID0+IHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gaW5pdENvbXBvbmVudChjb21wb25lbnQsIGVsZW1lbnQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICApO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIFByb21pc2UuYWxsKHByb21pc2VzKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBoYXNDb21wb25lbnQobmFtZTogc3RyaW5nKTogYm9vbGVhbiB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNvbXBvbmVudHNcclxuICAgICAgICAgICAgICAgIC5maWx0ZXIoKGNvbXBvbmVudCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBDb21wb25lbnQuZ2V0TmFtZShjb21wb25lbnQpID09PSBuYW1lO1xyXG4gICAgICAgICAgICAgICAgfSkubGVuZ3RoID4gMDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBoYXNBdHRyaWJ1dGUobmFtZTogc3RyaW5nKTogYm9vbGVhbiB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmF0dHJpYnV0ZXNcclxuICAgICAgICAgICAgICAgIC5maWx0ZXIoKGF0dHJpYnV0ZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBBdHRyaWJ1dGUuZ2V0TmFtZShhdHRyaWJ1dGUpID09PSBuYW1lO1xyXG4gICAgICAgICAgICAgICAgfSkubGVuZ3RoID4gMDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBnZXRBdHRyaWJ1dGUobmFtZTogc3RyaW5nKTogdHlwZW9mIEF0dHJpYnV0ZSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmF0dHJpYnV0ZXNcclxuICAgICAgICAgICAgLmZpbHRlcigoYXR0cmlidXRlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gQXR0cmlidXRlLmdldE5hbWUoYXR0cmlidXRlKSA9PT0gbmFtZTtcclxuICAgICAgICAgICAgfSlbMF07XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgbG9hZENvbXBvbmVudChuYW1lOiBzdHJpbmcpOiBQcm9taXNlPHR5cGVvZiBDb21wb25lbnQsIHN0cmluZz4ge1xyXG4gICAgICAgICAgICBsZXQgc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5nZXRQYXJlbnRPZkNvbXBvbmVudChuYW1lKVxyXG4gICAgICAgICAgICAudGhlbigocGFyZW50KSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZihzZWxmLmhhc0NvbXBvbmVudChwYXJlbnQpIHx8IHBhcmVudCA9PT0gJ2hvLmNvbXBvbmVudHMuQ29tcG9uZW50JylcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIGVsc2UgcmV0dXJuIHNlbGYubG9hZENvbXBvbmVudChwYXJlbnQpO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAudGhlbigocGFyZW50VHlwZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGhvLmNvbXBvbmVudHMuY29tcG9uZW50cHJvdmlkZXIuaW5zdGFuY2UuZ2V0Q29tcG9uZW50KG5hbWUpXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC50aGVuKChjb21wb25lbnQpID0+IHtcclxuICAgICAgICAgICAgICAgIHNlbGYucmVnaXN0ZXIoY29tcG9uZW50KTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBjb21wb25lbnQ7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAvL3JldHVybiB0aGlzLm9wdGlvbnMuY29tcG9uZW50UHJvdmlkZXIuZ2V0Q29tcG9uZW50KG5hbWUpXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgbG9hZEF0dHJpYnV0ZShuYW1lOiBzdHJpbmcpOiBQcm9taXNlPHR5cGVvZiBBdHRyaWJ1dGUsIHN0cmluZz4ge1xyXG4gICAgICAgICAgICBsZXQgc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5nZXRQYXJlbnRPZkF0dHJpYnV0ZShuYW1lKVxyXG4gICAgICAgICAgICAudGhlbigocGFyZW50KSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZihzZWxmLmhhc0F0dHJpYnV0ZShwYXJlbnQpIHx8IHBhcmVudCA9PT0gJ2hvLmNvbXBvbmVudHMuQXR0cmlidXRlJyB8fCBwYXJlbnQgPT09ICdoby5jb21wb25lbnRzLldhdGNoQXR0cmlidXRlJylcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIGVsc2UgcmV0dXJuIHNlbGYubG9hZEF0dHJpYnV0ZShwYXJlbnQpO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAudGhlbigocGFyZW50VHlwZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGhvLmNvbXBvbmVudHMuYXR0cmlidXRlcHJvdmlkZXIuaW5zdGFuY2UuZ2V0QXR0cmlidXRlKG5hbWUpXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC50aGVuKChhdHRyaWJ1dGUpID0+IHtcclxuICAgICAgICAgICAgICAgIHNlbGYucmVnaXN0ZXIoYXR0cmlidXRlKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBhdHRyaWJ1dGU7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgLypcclxuICAgICAgICAgICAgbGV0IHNlbGYgPSB0aGlzO1xyXG4gICAgICAgICAgICByZXR1cm4gbmV3IFByb21pc2U8dHlwZW9mIEF0dHJpYnV0ZSwgc3RyaW5nPigocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgICAgICBoby5jb21wb25lbnRzLmF0dHJpYnV0ZXByb3ZpZGVyLmluc3RhbmNlLmdldEF0dHJpYnV0ZShuYW1lKVxyXG4gICAgICAgICAgICAgICAgLnRoZW4oKGF0dHJpYnV0ZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHNlbGYucmVnaXN0ZXIoYXR0cmlidXRlKTtcclxuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKGF0dHJpYnV0ZSk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICovXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcm90ZWN0ZWQgZ2V0UGFyZW50T2ZDb21wb25lbnQobmFtZTogc3RyaW5nKTogUHJvbWlzZTxzdHJpbmcsIGFueT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5nZXRQYXJlbnRPZkNsYXNzKGhvLmNvbXBvbmVudHMuY29tcG9uZW50cHJvdmlkZXIuaW5zdGFuY2UucmVzb2x2ZShuYW1lKSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcm90ZWN0ZWQgZ2V0UGFyZW50T2ZBdHRyaWJ1dGUobmFtZTogc3RyaW5nKTogUHJvbWlzZTxzdHJpbmcsIGFueT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5nZXRQYXJlbnRPZkNsYXNzKGhvLmNvbXBvbmVudHMuYXR0cmlidXRlcHJvdmlkZXIuaW5zdGFuY2UucmVzb2x2ZShuYW1lKSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcm90ZWN0ZWQgZ2V0UGFyZW50T2ZDbGFzcyhwYXRoOiBzdHJpbmcpOiBQcm9taXNlPHN0cmluZywgYW55PiB7XHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcblxyXG4gICAgICAgICAgICAgICAgbGV0IHhtbGh0dHAgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcclxuICAgICAgICAgICAgICAgIHhtbGh0dHAub25yZWFkeXN0YXRlY2hhbmdlID0gKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKHhtbGh0dHAucmVhZHlTdGF0ZSA9PSA0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCByZXNwID0geG1saHR0cC5yZXNwb25zZVRleHQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKHhtbGh0dHAuc3RhdHVzID09IDIwMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IG0gPSByZXNwLm1hdGNoKC99XFwpXFwoKC4qKVxcKTsvKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKG0gIT09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKG1bMV0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShudWxsKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlamVjdChyZXNwKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgICAgIHhtbGh0dHAub3BlbignR0VUJywgcGF0aCk7XHJcbiAgICAgICAgICAgICAgICB4bWxodHRwLnNlbmQoKTtcclxuXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGxldCBpbnN0YW5jZSA9IG5ldyBSZWdpc3RyeSgpO1xyXG59XHJcbiIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuL3JlZ2lzdHJ5LnRzXCIvPlxuXG5tb2R1bGUgaG8uY29tcG9uZW50cyB7XG5cdGV4cG9ydCBmdW5jdGlvbiBydW4oKTogaG8ucHJvbWlzZS5Qcm9taXNlPGFueSwgYW55PiB7XG5cdFx0cmV0dXJuIGhvLmNvbXBvbmVudHMucmVnaXN0cnkuaW5zdGFuY2UucnVuKCk7XG5cdH1cblxuXHRleHBvcnQgZnVuY3Rpb24gcmVnaXN0ZXIoYzogdHlwZW9mIENvbXBvbmVudCB8IHR5cGVvZiBBdHRyaWJ1dGUpOiB2b2lkIHtcblx0XHRoby5jb21wb25lbnRzLnJlZ2lzdHJ5Lmluc3RhbmNlLnJlZ2lzdGVyKGMpO1xuXHR9XG5cblx0ZXhwb3J0IGxldCBkaXI6IGJvb2xlYW4gPSBmYWxzZTtcbn1cbiIsIm1vZHVsZSBoby5jb21wb25lbnRzLmh0bWxwcm92aWRlciB7XHJcbiAgICBpbXBvcnQgUHJvbWlzZSA9IGhvLnByb21pc2UuUHJvbWlzZTtcclxuXHJcbiAgICBleHBvcnQgY2xhc3MgSHRtbFByb3ZpZGVyIHtcclxuXHJcbiAgICAgICAgcHJpdmF0ZSBjYWNoZToge1trYXk6c3RyaW5nXTpzdHJpbmd9ID0ge307XHJcblxyXG4gICAgICAgIHJlc29sdmUobmFtZTogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgaWYoaG8uY29tcG9uZW50cy5kaXIpIHtcclxuICAgICAgICAgICAgICAgIG5hbWUgKz0gJy4nICsgbmFtZS5zcGxpdCgnLicpLnBvcCgpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBuYW1lID0gbmFtZS5zcGxpdCgnLicpLmpvaW4oJy8nKTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBgY29tcG9uZW50cy8ke25hbWV9Lmh0bWxgO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZ2V0SFRNTChuYW1lOiBzdHJpbmcpOiBQcm9taXNlPHN0cmluZywgc3RyaW5nPiB7XHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYodHlwZW9mIHRoaXMuY2FjaGVbbmFtZV0gPT09ICdzdHJpbmcnKVxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiByZXNvbHZlKHRoaXMuY2FjaGVbbmFtZV0pO1xyXG5cclxuICAgICAgICAgICAgICAgIGxldCB1cmwgPSB0aGlzLnJlc29sdmUobmFtZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgbGV0IHhtbGh0dHAgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcclxuICAgIFx0XHRcdHhtbGh0dHAub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24oKSB7XHJcbiAgICBcdFx0XHRcdGlmKHhtbGh0dHAucmVhZHlTdGF0ZSA9PSA0KSB7XHJcbiAgICBcdFx0XHRcdFx0bGV0IHJlc3AgPSB4bWxodHRwLnJlc3BvbnNlVGV4dDtcclxuICAgIFx0XHRcdFx0XHRpZih4bWxodHRwLnN0YXR1cyA9PSAyMDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUocmVzcCk7XHJcbiAgICBcdFx0XHRcdFx0fSBlbHNlIHtcclxuICAgIFx0XHRcdFx0XHRcdHJlamVjdChgRXJyb3Igd2hpbGUgbG9hZGluZyBodG1sIGZvciBDb21wb25lbnQgJHtuYW1lfWApO1xyXG4gICAgXHRcdFx0XHRcdH1cclxuICAgIFx0XHRcdFx0fVxyXG4gICAgXHRcdFx0fTtcclxuXHJcbiAgICBcdFx0XHR4bWxodHRwLm9wZW4oJ0dFVCcsIHVybCwgdHJ1ZSk7XHJcbiAgICBcdFx0XHR4bWxodHRwLnNlbmQoKTtcclxuXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgbGV0IGluc3RhbmNlID0gbmV3IEh0bWxQcm92aWRlcigpO1xyXG5cclxufVxyXG4iLCJcbm1vZHVsZSBoby5jb21wb25lbnRzLnRlbXAge1xuXHRcdHZhciBjOiBudW1iZXIgPSAtMTtcblx0XHR2YXIgZGF0YTogYW55W10gPSBbXTtcblxuXHRcdGV4cG9ydCBmdW5jdGlvbiBzZXQoZDogYW55KTogbnVtYmVyIHtcblx0XHRcdGMrKztcblx0XHRcdGRhdGFbY10gPSBkO1xuXHRcdFx0cmV0dXJuIGM7XG5cdFx0fVxuXG5cdFx0ZXhwb3J0IGZ1bmN0aW9uIGdldChpOiBudW1iZXIpOiBhbnkge1xuXHRcdFx0cmV0dXJuIGRhdGFbaV07XG5cdFx0fVxuXG5cdFx0ZXhwb3J0IGZ1bmN0aW9uIGNhbGwoaTogbnVtYmVyLCAuLi5hcmdzKTogdm9pZCB7XG5cdFx0XHRkYXRhW2ldKC4uLmFyZ3MpO1xuXHRcdH1cbn1cbiIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuL3JlZ2lzdHJ5LnRzXCIvPlxyXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi90ZW1wXCIvPlxyXG5cclxubW9kdWxlIGhvLmNvbXBvbmVudHMucmVuZGVyZXIge1xyXG4gICAgaW1wb3J0IFJlZ2lzdHJ5ID0gaG8uY29tcG9uZW50cy5yZWdpc3RyeS5pbnN0YW5jZTtcclxuXHJcbiAgICBpbnRlcmZhY2UgTm9kZUh0bWwge1xyXG4gICAgICAgIHJvb3Q6IE5vZGU7XHJcbiAgICAgICAgaHRtbDogc3RyaW5nO1xyXG4gICAgfVxyXG5cclxuICAgIGNsYXNzIE5vZGUge1xyXG4gICAgICAgIGh0bWw6IHN0cmluZztcclxuICAgICAgICBwYXJlbnQ6IE5vZGU7XHJcbiAgICAgICAgY2hpbGRyZW46IEFycmF5PE5vZGU+ID0gW107XHJcbiAgICAgICAgdHlwZTogc3RyaW5nO1xyXG4gICAgICAgIHNlbGZDbG9zaW5nOiBib29sZWFuO1xyXG4gICAgICAgIGlzVm9pZDogYm9vbGVhbjtcclxuICAgICAgICByZXBlYXQ6IGJvb2xlYW47XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGNsYXNzIFJlbmRlcmVyIHtcclxuXHJcbiAgICAgICAgcHJpdmF0ZSByOiBhbnkgPSB7XHJcblx0XHRcdHRhZzogLzwoW14+XSo/KD86KD86KCd8XCIpW14nXCJdKj9cXDIpW14+XSo/KSopPi8sXHJcblx0XHRcdHJlcGVhdDogL3JlcGVhdD1bXCJ8J10uK1tcInwnXS8sXHJcblx0XHRcdHR5cGU6IC9bXFxzfC9dKiguKj8pW1xcc3xcXC98Pl0vLFxyXG5cdFx0XHR0ZXh0OiAvKD86LnxbXFxyXFxuXSkqP1teXCInXFxcXF08L20sXHJcblx0XHR9O1xyXG5cclxuICAgICAgICBwcml2YXRlIHZvaWRzID0gW1wiYXJlYVwiLCBcImJhc2VcIiwgXCJiclwiLCBcImNvbFwiLCBcImNvbW1hbmRcIiwgXCJlbWJlZFwiLCBcImhyXCIsIFwiaW1nXCIsIFwiaW5wdXRcIiwgXCJrZXlnZW5cIiwgXCJsaW5rXCIsIFwibWV0YVwiLCBcInBhcmFtXCIsIFwic291cmNlXCIsIFwidHJhY2tcIiwgXCJ3YnJcIl07XHJcblxyXG4gICAgICAgIHByaXZhdGUgY2FjaGU6IHtba2V5OnN0cmluZ106Tm9kZX0gPSB7fTtcclxuXHJcbiAgICAgICAgcHVibGljIHJlbmRlcihjb21wb25lbnQ6IENvbXBvbmVudCk6IHZvaWQge1xyXG4gICAgICAgICAgICBpZih0eXBlb2YgY29tcG9uZW50Lmh0bWwgPT09ICdib29sZWFuJyAmJiAhY29tcG9uZW50Lmh0bWwpXHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICAgICAgICBsZXQgbmFtZSA9IGNvbXBvbmVudC5uYW1lO1xyXG4gICAgICAgICAgICBsZXQgcm9vdCA9IHRoaXMuY2FjaGVbbmFtZV0gPSB0aGlzLmNhY2hlW25hbWVdIHx8IHRoaXMucGFyc2UoY29tcG9uZW50Lmh0bWwpLnJvb3Q7XHJcbiAgICAgICAgICAgIHJvb3QgPSB0aGlzLnJlbmRlclJlcGVhdCh0aGlzLmNvcHlOb2RlKHJvb3QpLCBjb21wb25lbnQpO1xyXG5cclxuICAgICAgICAgICAgbGV0IGh0bWwgPSB0aGlzLmRvbVRvU3RyaW5nKHJvb3QsIC0xKTtcclxuXHJcbiAgICAgICAgICAgIGNvbXBvbmVudC5lbGVtZW50LmlubmVySFRNTCA9IGh0bWw7XHJcblxyXG4gICAgICAgIH1cclxuXHJcblxyXG5cdFx0cHJpdmF0ZSBwYXJzZShodG1sOiBzdHJpbmcsIHJvb3Q9IG5ldyBOb2RlKCkpOiBOb2RlSHRtbCB7XHJcblxyXG5cdFx0XHR2YXIgbTtcclxuXHRcdFx0d2hpbGUoKG0gPSB0aGlzLnIudGFnLmV4ZWMoaHRtbCkpICE9PSBudWxsKSB7XHJcblx0XHRcdFx0dmFyIHRhZywgdHlwZSwgY2xvc2luZywgaXNWb2lkLCBzZWxmQ2xvc2luZywgcmVwZWF0LCB1bkNsb3NlO1xyXG5cdFx0XHRcdC8vLS0tLS0tLSBmb3VuZCBzb21lIHRleHQgYmVmb3JlIG5leHQgdGFnXHJcblx0XHRcdFx0aWYobS5pbmRleCAhPT0gMCkge1xyXG5cdFx0XHRcdFx0dGFnID0gaHRtbC5tYXRjaCh0aGlzLnIudGV4dClbMF07XHJcblx0XHRcdFx0XHR0YWcgPSB0YWcuc3Vic3RyKDAsIHRhZy5sZW5ndGgtMSk7XHJcblx0XHRcdFx0XHR0eXBlID0gJ1RFWFQnO1xyXG4gICAgICAgICAgICAgICAgICAgIGlzVm9pZCA9IGZhbHNlO1xyXG5cdFx0XHRcdFx0c2VsZkNsb3NpbmcgPSB0cnVlO1xyXG5cdFx0XHRcdFx0cmVwZWF0ID0gZmFsc2U7XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdHRhZyA9IG1bMV0udHJpbSgpO1xyXG5cdFx0XHRcdFx0dHlwZSA9ICh0YWcrJz4nKS5tYXRjaCh0aGlzLnIudHlwZSlbMV07XHJcblx0XHRcdFx0XHRjbG9zaW5nID0gdGFnWzBdID09PSAnLyc7XHJcbiAgICAgICAgICAgICAgICAgICAgaXNWb2lkID0gdGhpcy5pc1ZvaWQodHlwZSk7XHJcblx0XHRcdFx0XHRzZWxmQ2xvc2luZyA9IGlzVm9pZCB8fCB0YWdbdGFnLmxlbmd0aC0xXSA9PT0gJy8nO1xyXG5cdFx0XHRcdFx0cmVwZWF0ID0gISF0YWcubWF0Y2godGhpcy5yLnJlcGVhdCk7XHJcblxyXG5cdFx0XHRcdFx0aWYoc2VsZkNsb3NpbmcgJiYgUmVnaXN0cnkuaGFzQ29tcG9uZW50KHR5cGUpKSB7XHJcblx0XHRcdFx0XHRcdHNlbGZDbG9zaW5nID0gZmFsc2U7XHJcblx0XHRcdFx0XHRcdHRhZyA9IHRhZy5zdWJzdHIoMCwgdGFnLmxlbmd0aC0xKSArIFwiIFwiO1xyXG5cclxuXHRcdFx0XHRcdFx0dW5DbG9zZSA9IHRydWU7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRodG1sID0gaHRtbC5zbGljZSh0YWcubGVuZ3RoICsgKHR5cGUgPT09ICdURVhUJyA/IDAgOiAyKSApO1xyXG5cclxuXHRcdFx0XHRpZihjbG9zaW5nKSB7XHJcblx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0cm9vdC5jaGlsZHJlbi5wdXNoKHtwYXJlbnQ6IHJvb3QsIGh0bWw6IHRhZywgdHlwZTogdHlwZSwgaXNWb2lkOiBpc1ZvaWQsIHNlbGZDbG9zaW5nOiBzZWxmQ2xvc2luZywgcmVwZWF0OiByZXBlYXQsIGNoaWxkcmVuOiBbXX0pO1xyXG5cclxuXHRcdFx0XHRcdGlmKCF1bkNsb3NlICYmICFzZWxmQ2xvc2luZykge1xyXG5cdFx0XHRcdFx0XHR2YXIgcmVzdWx0ID0gdGhpcy5wYXJzZShodG1sLCByb290LmNoaWxkcmVuW3Jvb3QuY2hpbGRyZW4ubGVuZ3RoLTFdKTtcclxuXHRcdFx0XHRcdFx0aHRtbCA9IHJlc3VsdC5odG1sO1xyXG5cdFx0XHRcdFx0XHRyb290LmNoaWxkcmVuLnBvcCgpO1xyXG5cdFx0XHRcdFx0XHRyb290LmNoaWxkcmVuLnB1c2gocmVzdWx0LnJvb3QpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0bSA9IGh0bWwubWF0Y2godGhpcy5yLnRhZyk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHJldHVybiB7cm9vdDogcm9vdCwgaHRtbDogaHRtbH07XHJcblx0XHR9XHJcblxyXG5cdFx0cHJpdmF0ZSByZW5kZXJSZXBlYXQocm9vdCwgbW9kZWxzKTogTm9kZSB7XHJcblx0XHRcdG1vZGVscyA9IFtdLmNvbmNhdChtb2RlbHMpO1xyXG5cclxuXHRcdFx0Zm9yKHZhciBjID0gMDsgYyA8IHJvb3QuY2hpbGRyZW4ubGVuZ3RoOyBjKyspIHtcclxuXHRcdFx0XHR2YXIgY2hpbGQgPSByb290LmNoaWxkcmVuW2NdO1xyXG5cdFx0XHRcdGlmKGNoaWxkLnJlcGVhdCkge1xyXG5cdFx0XHRcdFx0dmFyIHJlZ2V4ID0gL3JlcGVhdD1bXCJ8J11cXHMqKFxcUyspXFxzK2FzXFxzKyhcXFMrPylbXCJ8J10vO1xyXG5cdFx0XHRcdFx0dmFyIG0gPSBjaGlsZC5odG1sLm1hdGNoKHJlZ2V4KS5zbGljZSgxKTtcclxuXHRcdFx0XHRcdHZhciBuYW1lID0gbVsxXTtcclxuXHRcdFx0XHRcdHZhciBpbmRleE5hbWU7XHJcblx0XHRcdFx0XHRpZihuYW1lLmluZGV4T2YoJywnKSA+IC0xKSB7XHJcblx0XHRcdFx0XHRcdHZhciBuYW1lcyA9IG5hbWUuc3BsaXQoJywnKTtcclxuXHRcdFx0XHRcdFx0bmFtZSA9IG5hbWVzWzBdLnRyaW0oKTtcclxuXHRcdFx0XHRcdFx0aW5kZXhOYW1lID0gbmFtZXNbMV0udHJpbSgpO1xyXG5cdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdHZhciBtb2RlbCA9IHRoaXMuZXZhbHVhdGUobW9kZWxzLCBtWzBdKTtcclxuXHJcblx0XHRcdFx0XHR2YXIgaG9sZGVyID0gW107XHJcblx0XHRcdFx0XHRtb2RlbC5mb3JFYWNoKGZ1bmN0aW9uKHZhbHVlLCBpbmRleCkge1xyXG5cdFx0XHRcdFx0XHR2YXIgbW9kZWwyID0ge307XHJcblx0XHRcdFx0XHRcdG1vZGVsMltuYW1lXSA9IHZhbHVlO1xyXG5cdFx0XHRcdFx0XHRtb2RlbDJbaW5kZXhOYW1lXSA9IGluZGV4O1xyXG5cclxuXHRcdFx0XHRcdFx0dmFyIG1vZGVsczIgPSBbXS5jb25jYXQobW9kZWxzKTtcclxuXHRcdFx0XHRcdFx0bW9kZWxzMi51bnNoaWZ0KG1vZGVsMik7XHJcblxyXG5cdFx0XHRcdFx0XHR2YXIgbm9kZSA9IHRoaXMuY29weU5vZGUoY2hpbGQpO1xyXG5cdFx0XHRcdFx0XHRub2RlLnJlcGVhdCA9IGZhbHNlO1xyXG5cdFx0XHRcdFx0XHRub2RlLmh0bWwgPSBub2RlLmh0bWwucmVwbGFjZSh0aGlzLnIucmVwZWF0LCAnJyk7XHJcblx0XHRcdFx0XHRcdG5vZGUuaHRtbCA9IHRoaXMucmVwbChub2RlLmh0bWwsIG1vZGVsczIpO1xyXG5cclxuXHRcdFx0XHRcdFx0bm9kZSA9IHRoaXMucmVuZGVyUmVwZWF0KG5vZGUsIG1vZGVsczIpO1xyXG5cclxuXHRcdFx0XHRcdFx0Ly9yb290LmNoaWxkcmVuLnNwbGljZShyb290LmNoaWxkcmVuLmluZGV4T2YoY2hpbGQpLCAwLCBub2RlKTtcclxuXHRcdFx0XHRcdFx0aG9sZGVyLnB1c2gobm9kZSk7XHJcblx0XHRcdFx0XHR9LmJpbmQodGhpcykpO1xyXG5cclxuXHRcdFx0XHRcdGhvbGRlci5mb3JFYWNoKGZ1bmN0aW9uKG4pIHtcclxuXHRcdFx0XHRcdFx0cm9vdC5jaGlsZHJlbi5zcGxpY2Uocm9vdC5jaGlsZHJlbi5pbmRleE9mKGNoaWxkKSwgMCwgbik7XHJcblx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHRcdHJvb3QuY2hpbGRyZW4uc3BsaWNlKHJvb3QuY2hpbGRyZW4uaW5kZXhPZihjaGlsZCksIDEpO1xyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRjaGlsZC5odG1sID0gdGhpcy5yZXBsKGNoaWxkLmh0bWwsIG1vZGVscyk7XHJcblx0XHRcdFx0XHRjaGlsZCA9IHRoaXMucmVuZGVyUmVwZWF0KGNoaWxkLCBtb2RlbHMpO1xyXG5cdFx0XHRcdFx0cm9vdC5jaGlsZHJlbltjXSA9IGNoaWxkO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0cmV0dXJuIHJvb3Q7XHJcblx0XHR9XHJcblxyXG5cdFx0cHJpdmF0ZSBkb21Ub1N0cmluZyhyb290OiBOb2RlLCBpbmRlbnQ6IG51bWJlcik6IHN0cmluZyB7XHJcblx0XHRcdGluZGVudCA9IGluZGVudCB8fCAwO1xyXG5cdFx0XHR2YXIgaHRtbCA9ICcnO1xyXG4gICAgICAgICAgICBjb25zdCB0YWI6IGFueSA9ICdcXHQnO1xyXG5cclxuXHRcdFx0aWYocm9vdC5odG1sKSB7XHJcblx0XHRcdFx0aHRtbCArPSBuZXcgQXJyYXkoaW5kZW50KS5qb2luKHRhYik7IC8vdGFiLnJlcGVhdChpbmRlbnQpOztcclxuXHRcdFx0XHRpZihyb290LnR5cGUgIT09ICdURVhUJykge1xyXG5cdFx0XHRcdFx0aWYocm9vdC5zZWxmQ2xvc2luZyAmJiAhcm9vdC5pc1ZvaWQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaHRtbCArPSAnPCcgKyByb290Lmh0bWwuc3Vic3RyKDAsIC0tcm9vdC5odG1sLmxlbmd0aCkgKyAnPic7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGh0bWwgKz0gJzwvJytyb290LnR5cGUrJz5cXG4nO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGh0bWwgKz0gJzwnICsgcm9vdC5odG1sICsgJz4nO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cdFx0XHRcdGVsc2UgaHRtbCArPSByb290Lmh0bWw7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGlmKGh0bWwpXHJcblx0XHRcdFx0aHRtbCArPSAnXFxuJztcclxuXHJcblx0XHRcdGlmKHJvb3QuY2hpbGRyZW4ubGVuZ3RoKSB7XHJcblx0XHRcdFx0aHRtbCArPSByb290LmNoaWxkcmVuLm1hcChmdW5jdGlvbihjKSB7XHJcblx0XHRcdFx0XHRyZXR1cm4gdGhpcy5kb21Ub1N0cmluZyhjLCBpbmRlbnQrKHJvb3QudHlwZSA/IDEgOiAyKSk7XHJcblx0XHRcdFx0fS5iaW5kKHRoaXMpKS5qb2luKCdcXG4nKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0aWYocm9vdC50eXBlICYmIHJvb3QudHlwZSAhPT0gJ1RFWFQnICYmICFyb290LnNlbGZDbG9zaW5nKSB7XHJcblx0XHRcdFx0aHRtbCArPSBuZXcgQXJyYXkoaW5kZW50KS5qb2luKHRhYik7IC8vdGFiLnJlcGVhdChpbmRlbnQpO1xyXG5cdFx0XHRcdGh0bWwgKz0gJzwvJytyb290LnR5cGUrJz5cXG4nO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRyZXR1cm4gaHRtbDtcclxuXHRcdH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSByZXBsKHN0cjogc3RyaW5nLCBtb2RlbHM6IGFueVtdKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgdmFyIHJlZ2V4RyA9IC97KC4rPyl9fT8vZztcclxuXHJcbiAgICAgICAgICAgIHZhciBtID0gc3RyLm1hdGNoKHJlZ2V4Ryk7XHJcbiAgICAgICAgICAgIGlmKCFtKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHN0cjtcclxuXHJcbiAgICAgICAgICAgIHdoaWxlKG0ubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgcGF0aCA9IG1bMF07XHJcbiAgICAgICAgICAgICAgICBwYXRoID0gcGF0aC5zdWJzdHIoMSwgcGF0aC5sZW5ndGgtMik7XHJcblxyXG4gICAgICAgICAgICAgICAgdmFyIHZhbHVlID0gdGhpcy5ldmFsdWF0ZShtb2RlbHMsIHBhdGgpO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmKHZhbHVlICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZih0eXBlb2YgdmFsdWUgPT09ICdmdW5jdGlvbicpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSBcImhvLmNvbXBvbmVudHMuQ29tcG9uZW50LmdldENvbXBvbmVudCh0aGlzKS5cIitwYXRoO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBzdHIgPSBzdHIucmVwbGFjZShtWzBdLCB2YWx1ZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgbSA9IG0uc2xpY2UoMSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiBzdHI7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIGV2YWx1YXRlKG1vZGVsczogYW55W10sIHBhdGg6IHN0cmluZyk6IGFueSB7XHJcbiAgICAgICAgICAgIGlmKHBhdGhbMF0gPT09ICd7JyAmJiBwYXRoWy0tcGF0aC5sZW5ndGhdID09PSAnfScpXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5ldmFsdWF0ZUV4cHJlc3Npb24obW9kZWxzLCBwYXRoLnN1YnN0cigxLCBwYXRoLmxlbmd0aC0yKSlcclxuICAgICAgICAgICAgZWxzZSBpZihwYXRoWzBdID09PSAnIycpXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5ldmFsdWF0ZUZ1bmN0aW9uKG1vZGVscywgcGF0aC5zdWJzdHIoMSkpO1xyXG4gICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5ldmFsdWF0ZVZhbHVlKG1vZGVscywgcGF0aCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIGV2YWx1YXRlVmFsdWUobW9kZWxzOiBhbnlbXSwgcGF0aDogc3RyaW5nKTogYW55IHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZXZhbHVhdGVWYWx1ZUFuZE1vZGVsKG1vZGVscywgcGF0aCkudmFsdWU7XHJcbiAgICAgICAgfVxyXG5cclxuXHRcdHByaXZhdGUgZXZhbHVhdGVWYWx1ZUFuZE1vZGVsKG1vZGVsczogYW55W10sIHBhdGg6IHN0cmluZyk6IHt2YWx1ZTogYW55LCBtb2RlbDogYW55fSB7XHJcblx0XHRcdGlmKG1vZGVscy5pbmRleE9mKHdpbmRvdykgPT0gLTEpXHJcbiAgICAgICAgICAgICAgICBtb2RlbHMucHVzaCh3aW5kb3cpO1xyXG5cclxuICAgICAgICAgICAgdmFyIG1pID0gMDtcclxuXHRcdFx0dmFyIG1vZGVsID0gdm9pZCAwO1xyXG5cdFx0XHR3aGlsZShtaSA8IG1vZGVscy5sZW5ndGggJiYgbW9kZWwgPT09IHVuZGVmaW5lZCkge1xyXG5cdFx0XHRcdG1vZGVsID0gbW9kZWxzW21pXTtcclxuXHRcdFx0XHR0cnkge1xyXG5cdFx0XHRcdFx0bW9kZWwgPSBuZXcgRnVuY3Rpb24oXCJtb2RlbFwiLCBcInJldHVybiBtb2RlbFsnXCIgKyBwYXRoLnNwbGl0KFwiLlwiKS5qb2luKFwiJ11bJ1wiKSArIFwiJ11cIikobW9kZWwpO1xyXG5cdFx0XHRcdH0gY2F0Y2goZSkge1xyXG5cdFx0XHRcdFx0bW9kZWwgPSB2b2lkIDA7XHJcblx0XHRcdFx0fSBmaW5hbGx5IHtcclxuICAgICAgICAgICAgICAgICAgICBtaSsrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRyZXR1cm4ge1widmFsdWVcIjogbW9kZWwsIFwibW9kZWxcIjogbW9kZWxzWy0tbWldfTtcclxuXHRcdH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSBldmFsdWF0ZUV4cHJlc3Npb24obW9kZWxzOiBhbnlbXSwgcGF0aDogc3RyaW5nKTogYW55IHtcclxuXHRcdFx0aWYobW9kZWxzLmluZGV4T2Yod2luZG93KSA9PSAtMSlcclxuICAgICAgICAgICAgICAgIG1vZGVscy5wdXNoKHdpbmRvdyk7XHJcblxyXG4gICAgICAgICAgICB2YXIgbWkgPSAwO1xyXG5cdFx0XHR2YXIgbW9kZWwgPSB2b2lkIDA7XHJcblx0XHRcdHdoaWxlKG1pIDwgbW9kZWxzLmxlbmd0aCAmJiBtb2RlbCA9PT0gdW5kZWZpbmVkKSB7XHJcblx0XHRcdFx0bW9kZWwgPSBtb2RlbHNbbWldO1xyXG5cdFx0XHRcdHRyeSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy93aXRoKG1vZGVsKSBtb2RlbCA9IGV2YWwocGF0aCk7XHJcbiAgICAgICAgICAgICAgICAgICAgbW9kZWwgPSBuZXcgRnVuY3Rpb24oT2JqZWN0LmtleXMobW9kZWwpLnRvU3RyaW5nKCksIFwicmV0dXJuIFwiICsgcGF0aClcclxuICAgICAgICAgICAgICAgICAgICAgICAgLmFwcGx5KG51bGwsIE9iamVjdC5rZXlzKG1vZGVsKS5tYXAoKGspID0+IHtyZXR1cm4gbW9kZWxba119KSApO1xyXG5cdFx0XHRcdH0gY2F0Y2goZSkge1xyXG5cdFx0XHRcdFx0bW9kZWwgPSB2b2lkIDA7XHJcblx0XHRcdFx0fSBmaW5hbGx5IHtcclxuICAgICAgICAgICAgICAgICAgICBtaSsrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRyZXR1cm4gbW9kZWw7XHJcblx0XHR9XHJcblxyXG4gICAgICAgIHByaXZhdGUgZXZhbHVhdGVGdW5jdGlvbihtb2RlbHM6IGFueVtdLCBwYXRoOiBzdHJpbmcpOiBhbnkge1xyXG4gICAgICAgICAgICBsZXQgZXhwID0gdGhpcy5ldmFsdWF0ZUV4cHJlc3Npb24uYmluZCh0aGlzLCBtb2RlbHMpO1xyXG5cdFx0XHR2YXIgW25hbWUsIGFyZ3NdID0gcGF0aC5zcGxpdCgnKCcpO1xyXG4gICAgICAgICAgICBhcmdzID0gYXJncy5zdWJzdHIoMCwgLS1hcmdzLmxlbmd0aCk7XHJcblxyXG4gICAgICAgICAgICBsZXQge3ZhbHVlLCBtb2RlbH0gPSB0aGlzLmV2YWx1YXRlVmFsdWVBbmRNb2RlbChtb2RlbHMsIG5hbWUpO1xyXG4gICAgICAgICAgICBsZXQgZnVuYzogRnVuY3Rpb24gPSB2YWx1ZTtcclxuICAgICAgICAgICAgbGV0IGFyZ0Fycjogc3RyaW5nW10gPSBhcmdzLnNwbGl0KCcuJykubWFwKChhcmcpID0+IHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBhcmcuaW5kZXhPZignIycpID09PSAwID9cclxuICAgICAgICAgICAgICAgICAgICBhcmcuc3Vic3RyKDEpIDpcclxuICAgICAgICAgICAgICAgICAgICBleHAoYXJnKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBmdW5jID0gZnVuYy5iaW5kKG1vZGVsLCAuLi5hcmdBcnIpO1xyXG5cclxuICAgICAgICAgICAgbGV0IGluZGV4ID0gaG8uY29tcG9uZW50cy50ZW1wLnNldChmdW5jKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBzdHIgPSBgaG8uY29tcG9uZW50cy50ZW1wLmNhbGwoJHtpbmRleH0pYDtcclxuICAgICAgICAgICAgcmV0dXJuIHN0cjtcclxuXHRcdH1cclxuXHJcblx0XHRwcml2YXRlIGNvcHlOb2RlKG5vZGU6IE5vZGUpOiBOb2RlIHtcclxuXHRcdFx0dmFyIGNvcHlOb2RlID0gdGhpcy5jb3B5Tm9kZS5iaW5kKHRoaXMpO1xyXG5cclxuICAgICAgICAgICAgdmFyIG4gPSA8Tm9kZT57XHJcblx0XHRcdFx0cGFyZW50OiBub2RlLnBhcmVudCxcclxuXHRcdFx0XHRodG1sOiBub2RlLmh0bWwsXHJcblx0XHRcdFx0dHlwZTogbm9kZS50eXBlLFxyXG5cdFx0XHRcdHNlbGZDbG9zaW5nOiBub2RlLnNlbGZDbG9zaW5nLFxyXG5cdFx0XHRcdHJlcGVhdDogbm9kZS5yZXBlYXQsXHJcblx0XHRcdFx0Y2hpbGRyZW46IG5vZGUuY2hpbGRyZW4ubWFwKGNvcHlOb2RlKVxyXG5cdFx0XHR9O1xyXG5cclxuXHRcdFx0cmV0dXJuIG47XHJcblx0XHR9XHJcblxyXG4gICAgICAgIHByaXZhdGUgaXNWb2lkKG5hbWU6IHN0cmluZyk6IGJvb2xlYW4ge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy52b2lkcy5pbmRleE9mKG5hbWUudG9Mb3dlckNhc2UoKSkgIT09IC0xO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGxldCBpbnN0YW5jZSA9IG5ldyBSZW5kZXJlcigpO1xyXG5cclxufVxyXG4iLCJtb2R1bGUgaG8uY29tcG9uZW50cy5zdHlsZXIge1xuXG5cdGV4cG9ydCBpbnRlcmZhY2UgSVN0eWxlciB7XG5cdFx0YXBwbHlTdHlsZShjb21wb25lbnQ6IENvbXBvbmVudCwgY3NzPzogc3RyaW5nKTogdm9pZFxuXHR9XG5cblx0aW50ZXJmYWNlIFN0eWxlQmxvY2sge1xuXHRcdHNlbGVjdG9yOiBzdHJpbmc7XG5cdFx0cnVsZXM6IEFycmF5PFN0eWxlUnVsZT47XG5cdH1cblxuXHRpbnRlcmZhY2UgU3R5bGVSdWxlIHtcblx0XHRwcm9wZXJ0eTogc3RyaW5nO1xuXHRcdHZhbHVlOiBzdHJpbmc7XG5cdH1cblxuXHRjbGFzcyBTdHlsZXIgaW1wbGVtZW50cyBJU3R5bGVyIHtcblx0XHRwdWJsaWMgYXBwbHlTdHlsZShjb21wb25lbnQ6IENvbXBvbmVudCwgY3NzID0gY29tcG9uZW50LnN0eWxlKTogdm9pZCB7XG5cdFx0XHRsZXQgc3R5bGUgPSB0aGlzLnBhcnNlU3R5bGUoY29tcG9uZW50LnN0eWxlKTtcblx0XHRcdHN0eWxlLmZvckVhY2gocyA9PiB7XG5cdFx0XHRcdHRoaXMuYXBwbHlTdHlsZUJsb2NrKGNvbXBvbmVudCwgcyk7XG5cdFx0XHR9KTtcblx0XHR9XG5cblx0XHRwcm90ZWN0ZWQgYXBwbHlTdHlsZUJsb2NrKGNvbXBvbmVudDogQ29tcG9uZW50LCBzdHlsZTogU3R5bGVCbG9jayk6IHZvaWQge1xuXHRcdFx0aWYoc3R5bGUuc2VsZWN0b3IudHJpbSgpLnRvTG93ZXJDYXNlKCkgPT09ICd0aGlzJykge1xuXHRcdFx0XHRzdHlsZS5ydWxlcy5mb3JFYWNoKHIgPT4ge1xuXHRcdFx0XHRcdHRoaXMuYXBwbHlSdWxlKGNvbXBvbmVudC5lbGVtZW50LCByKTtcblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0XHRlbHNlIHtcblx0XHRcdFx0QXJyYXkucHJvdG90eXBlLmZvckVhY2guY2FsbChjb21wb25lbnQuZWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKHN0eWxlLnNlbGVjdG9yKSwgZWwgPT4ge1xuXHRcdFx0XHRcdHN0eWxlLnJ1bGVzLmZvckVhY2gociA9PiB7XG5cdFx0XHRcdFx0XHR0aGlzLmFwcGx5UnVsZShlbCwgcik7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHByb3RlY3RlZCBhcHBseVJ1bGUoZWxlbWVudDogSFRNTEVsZW1lbnQsIHJ1bGU6IFN0eWxlUnVsZSk6IHZvaWQge1xuXHRcdFx0bGV0IHByb3AgPSBydWxlLnByb3BlcnR5LnJlcGxhY2UoLy0oXFx3KS9nLCAoXywgbGV0dGVyOiBzdHJpbmcpID0+IHtcblx0XHRcdFx0cmV0dXJuIGxldHRlci50b1VwcGVyQ2FzZSgpO1xuXHRcdFx0fSkudHJpbSgpO1xuXHRcdFx0ZWxlbWVudC5zdHlsZVtwcm9wXSA9IHJ1bGUudmFsdWU7XG5cdFx0fVxuXG5cdFx0cHJvdGVjdGVkIHBhcnNlU3R5bGUoY3NzOiBzdHJpbmcpOiBBcnJheTxTdHlsZUJsb2NrPiB7XG5cdFx0XHRsZXQgciA9IC8oLis/KVxccyp7KC4qPyl9L2dtO1xuXHRcdFx0bGV0IHIyID0gLyguKz8pXFxzPzooLis/KTsvZ207XG5cdFx0XHRjc3MgPSBjc3MucmVwbGFjZSgvXFxuL2csICcnKTtcblx0XHRcdGxldCBibG9ja3M6IFN0eWxlQmxvY2tbXSA9ICg8c3RyaW5nW10+Y3NzLm1hdGNoKHIpIHx8IFtdKVxuXHRcdFx0XHQubWFwKGIgPT4ge1xuXHRcdFx0XHRcdGlmKCFiLm1hdGNoKHIpKVxuXHRcdFx0XHRcdFx0cmV0dXJuIG51bGw7XG5cblx0XHRcdFx0XHRsZXQgW18sIHNlbGVjdG9yLCBfcnVsZXNdID0gci5leGVjKGIpO1xuXHRcdFx0XHRcdGxldCBydWxlczogU3R5bGVSdWxlW10gPSAoPHN0cmluZ1tdPl9ydWxlcy5tYXRjaChyMikgfHwgW10pXG5cdFx0XHRcdFx0XHQubWFwKHIgPT4ge1xuXHRcdFx0XHRcdFx0XHRpZighci5tYXRjaChyMikpXG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuIG51bGw7XG5cblx0XHRcdFx0XHRcdFx0bGV0IFtfLCBwcm9wZXJ0eSwgdmFsdWVdID0gcjIuZXhlYyhyKTtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIHtwcm9wZXJ0eSwgdmFsdWV9O1xuXHRcdFx0XHRcdFx0fSlcblx0XHRcdFx0XHRcdC5maWx0ZXIociA9PiB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiByICE9PSBudWxsO1xuXHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0cmV0dXJuIHtzZWxlY3RvciwgcnVsZXN9O1xuXHRcdFx0XHR9KVxuXHRcdFx0XHQuZmlsdGVyKGIgPT4ge1xuXHRcdFx0XHRcdHJldHVybiBiICE9PSBudWxsO1xuXHRcdFx0XHR9KTtcblxuXG5cdFx0XHRyZXR1cm4gYmxvY2tzO1xuXHRcdH1cblx0fVxuXG5cdGV4cG9ydCBsZXQgaW5zdGFuY2U6IElTdHlsZXIgPSBuZXcgU3R5bGVyKCk7XG59XG4iLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi9tYWluXCIvPlxyXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi9yZWdpc3RyeVwiLz5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4vaHRtbHByb3ZpZGVyLnRzXCIvPlxyXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi9yZW5kZXJlci50c1wiLz5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4vYXR0cmlidXRlLnRzXCIvPlxyXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi9zdHlsZXIudHNcIi8+XHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi8uLi9ib3dlcl9jb21wb25lbnRzL2hvLXByb21pc2UvZGlzdC9wcm9taXNlLmQudHNcIi8+XHJcblxyXG5tb2R1bGUgaG8uY29tcG9uZW50cyB7XHJcblxyXG4gICAgaW1wb3J0IFJlZ2lzdHJ5ID0gaG8uY29tcG9uZW50cy5yZWdpc3RyeS5pbnN0YW5jZTtcclxuICAgIGltcG9ydCBIdG1sUHJvdmlkZXIgPSBoby5jb21wb25lbnRzLmh0bWxwcm92aWRlci5pbnN0YW5jZTtcclxuICAgIGltcG9ydCBSZW5kZXJlciA9IGhvLmNvbXBvbmVudHMucmVuZGVyZXIuaW5zdGFuY2U7XHJcbiAgICBpbXBvcnQgUHJvbWlzZSA9IGhvLnByb21pc2UuUHJvbWlzZTtcclxuXHJcbiAgICBleHBvcnQgaW50ZXJmYWNlIENvbXBvbmVudEVsZW1lbnQgZXh0ZW5kcyBIVE1MRWxlbWVudCB7XHJcbiAgICAgICAgY29tcG9uZW50PzogQ29tcG9uZW50O1xyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBpbnRlcmZhY2UgSVByb3ByZXR5IHtcclxuICAgICAgICBuYW1lOiBzdHJpbmc7XHJcbiAgICAgICAgcmVxdWlyZWQ/OiBib29sZWFuO1xyXG4gICAgICAgIGRlZmF1bHQ/OiBhbnk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgICAgQmFzZWNsYXNzIGZvciBDb21wb25lbnRzXHJcbiAgICAgICAgaW1wb3J0YW50OiBkbyBpbml0aWFsaXphdGlvbiB3b3JrIGluIENvbXBvbmVudCNpbml0XHJcbiAgICAqL1xyXG4gICAgZXhwb3J0IGNsYXNzIENvbXBvbmVudCB7XHJcbiAgICAgICAgcHVibGljIGVsZW1lbnQ6IENvbXBvbmVudEVsZW1lbnQ7XHJcbiAgICAgICAgcHVibGljIG9yaWdpbmFsX2lubmVySFRNTDogc3RyaW5nO1xyXG4gICAgICAgIHB1YmxpYyBodG1sOiBzdHJpbmcgPSAnJztcclxuICAgICAgICBwdWJsaWMgc3R5bGU6IHN0cmluZyA9ICcnO1xyXG4gICAgICAgIHB1YmxpYyBwcm9wZXJ0aWVzOiBBcnJheTxzdHJpbmd8SVByb3ByZXR5PiA9IFtdO1xyXG4gICAgICAgIHB1YmxpYyBhdHRyaWJ1dGVzOiBBcnJheTxzdHJpbmc+ID0gW107XHJcbiAgICAgICAgcHVibGljIHJlcXVpcmVzOiBBcnJheTxzdHJpbmc+ID0gW107XHJcbiAgICAgICAgcHVibGljIGNoaWxkcmVuOiB7W2tleTogc3RyaW5nXTogYW55fSA9IHt9O1xyXG5cclxuICAgICAgICBjb25zdHJ1Y3RvcihlbGVtZW50OiBIVE1MRWxlbWVudCkge1xyXG4gICAgICAgICAgICAvLy0tLS0tLS0gaW5pdCBFbGVtZW5ldCBhbmQgRWxlbWVudHMnIG9yaWdpbmFsIGlubmVySFRNTFxyXG4gICAgICAgICAgICB0aGlzLmVsZW1lbnQgPSBlbGVtZW50O1xyXG4gICAgICAgICAgICB0aGlzLmVsZW1lbnQuY29tcG9uZW50ID0gdGhpcztcclxuICAgICAgICAgICAgdGhpcy5vcmlnaW5hbF9pbm5lckhUTUwgPSBlbGVtZW50LmlubmVySFRNTDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBnZXQgbmFtZSgpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICByZXR1cm4gQ29tcG9uZW50LmdldE5hbWUodGhpcyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgZ2V0TmFtZSgpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5uYW1lO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIGdldFBhcmVudCgpOiBDb21wb25lbnQge1xyXG4gICAgICAgICAgICByZXR1cm4gQ29tcG9uZW50LmdldENvbXBvbmVudCg8Q29tcG9uZW50RWxlbWVudD50aGlzLmVsZW1lbnQucGFyZW50Tm9kZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgX2luaXQoKTogUHJvbWlzZTxhbnksIGFueT4ge1xyXG4gICAgICAgICAgICBsZXQgcmVuZGVyID0gdGhpcy5yZW5kZXIuYmluZCh0aGlzKTtcclxuICAgICAgICAgICAgLy8tLS0tLS0tLSBpbml0IFByb3BlcnRpZXNcclxuICAgICAgICAgICAgdGhpcy5pbml0UHJvcGVydGllcygpO1xyXG5cclxuICAgICAgICAgICAgLy8tLS0tLS0tIGNhbGwgaW5pdCgpICYgbG9hZFJlcXVpcmVtZW50cygpIC0+IHRoZW4gcmVuZGVyXHJcbiAgICAgICAgICAgIGxldCByZWFkeSA9IFt0aGlzLmluaXRIVE1MKCksIFByb21pc2UuY3JlYXRlKHRoaXMuaW5pdCgpKSwgdGhpcy5sb2FkUmVxdWlyZW1lbnRzKCldO1xyXG5cclxuICAgICAgICAgICAgbGV0IHAgPSBuZXcgUHJvbWlzZTxhbnksIGFueT4oKTtcclxuXHJcbiAgICAgICAgICAgIFByb21pc2UuYWxsKHJlYWR5KVxyXG4gICAgICAgICAgICAudGhlbigoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBwLnJlc29sdmUoKTtcclxuICAgICAgICAgICAgICAgIHJlbmRlcigpO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAuY2F0Y2goKGVycikgPT4ge1xyXG4gICAgICAgICAgICAgICAgcC5yZWplY3QoZXJyKTtcclxuICAgICAgICAgICAgICAgIHRocm93IGVycjtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gcDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAgICBNZXRob2QgdGhhdCBnZXQgY2FsbGVkIGFmdGVyIGluaXRpYWxpemF0aW9uIG9mIGEgbmV3IGluc3RhbmNlLlxyXG4gICAgICAgICAgICBEbyBpbml0LXdvcmsgaGVyZS5cclxuICAgICAgICAgICAgTWF5IHJldHVybiBhIFByb21pc2UuXHJcbiAgICAgICAgKi9cclxuICAgICAgICBwdWJsaWMgaW5pdCgpOiBhbnkge31cclxuXHJcbiAgICAgICAgcHVibGljIHVwZGF0ZSgpOiB2b2lkIHtyZXR1cm4gdm9pZCAwO31cclxuXHJcbiAgICAgICAgcHVibGljIHJlbmRlcigpOiB2b2lkIHtcclxuICAgIFx0XHRSZW5kZXJlci5yZW5kZXIodGhpcyk7XHJcblxyXG4gICAgXHRcdFJlZ2lzdHJ5LmluaXRFbGVtZW50KHRoaXMuZWxlbWVudClcclxuICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy5pbml0Q2hpbGRyZW4oKTtcclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLmluaXRTdHlsZSgpO1xyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMuaW5pdEF0dHJpYnV0ZXMoKTtcclxuXHJcbiAgICBcdFx0XHR0aGlzLnVwZGF0ZSgpO1xyXG5cclxuICAgICAgICAgICAgfS5iaW5kKHRoaXMpKTtcclxuICAgIFx0fTtcclxuXHJcbiAgICAgICAgcHJpdmF0ZSBpbml0U3R5bGUoKTogdm9pZCB7XHJcbiAgICAgICAgICAgIGlmKHR5cGVvZiB0aGlzLnN0eWxlID09PSAndW5kZWZpbmVkJylcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgaWYodGhpcy5zdHlsZSA9PT0gbnVsbClcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgaWYodHlwZW9mIHRoaXMuc3R5bGUgPT09ICdzdHJpbmcnICYmIHRoaXMuc3R5bGUubGVuZ3RoID09PSAwKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgICAgICAgc3R5bGVyLmluc3RhbmNlLmFwcGx5U3R5bGUodGhpcyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAqICBBc3N1cmUgdGhhdCB0aGlzIGluc3RhbmNlIGhhcyBhbiB2YWxpZCBodG1sIGF0dHJpYnV0ZSBhbmQgaWYgbm90IGxvYWQgYW5kIHNldCBpdC5cclxuICAgICAgICAqL1xyXG4gICAgICAgIHByaXZhdGUgaW5pdEhUTUwoKTogUHJvbWlzZTxhbnksYW55PiB7XHJcbiAgICAgICAgICAgIGxldCBwID0gbmV3IFByb21pc2UoKTtcclxuICAgICAgICAgICAgbGV0IHNlbGYgPSB0aGlzO1xyXG5cclxuICAgICAgICAgICAgaWYodHlwZW9mIHRoaXMuaHRtbCA9PT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuaHRtbCA9ICcnO1xyXG4gICAgICAgICAgICAgICAgcC5yZXNvbHZlKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBpZih0aGlzLmh0bWwuaW5kZXhPZihcIi5odG1sXCIsIHRoaXMuaHRtbC5sZW5ndGggLSBcIi5odG1sXCIubGVuZ3RoKSAhPT0gLTEpIHtcclxuICAgICAgICAgICAgICAgICAgICBIdG1sUHJvdmlkZXIuZ2V0SFRNTCh0aGlzLm5hbWUpXHJcbiAgICAgICAgICAgICAgICAgICAgLnRoZW4oKGh0bWwpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5odG1sID0gaHRtbDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcC5yZXNvbHZlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICAuY2F0Y2gocC5yZWplY3QpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBwLnJlc29sdmUoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHA7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIGluaXRQcm9wZXJ0aWVzKCk6IHZvaWQge1xyXG4gICAgICAgICAgICB0aGlzLnByb3BlcnRpZXMuZm9yRWFjaChmdW5jdGlvbihwcm9wKSB7XHJcbiAgICAgICAgICAgICAgICBpZih0eXBlb2YgcHJvcCA9PT0gJ29iamVjdCcpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnByb3BlcnRpZXNbcHJvcC5uYW1lXSA9IHRoaXMuZWxlbWVudFtwcm9wLm5hbWVdIHx8IHRoaXMuZWxlbWVudC5nZXRBdHRyaWJ1dGUocHJvcC5uYW1lKSB8fCBwcm9wLmRlZmF1bHQ7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYodGhpcy5wcm9wZXJ0aWVzW3Byb3AubmFtZV0gPT09IHVuZGVmaW5lZCAmJiBwcm9wLnJlcXVpcmVkID09PSB0cnVlKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBgUHJvcGVydHkgJHtwcm9wLm5hbWV9IGlzIHJlcXVpcmVkIGJ1dCBub3QgcHJvdmlkZWRgO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSBpZih0eXBlb2YgcHJvcCA9PT0gJ3N0cmluZycpXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wcm9wZXJ0aWVzW3Byb3BdID0gdGhpcy5lbGVtZW50W3Byb3BdIHx8IHRoaXMuZWxlbWVudC5nZXRBdHRyaWJ1dGUocHJvcCk7XHJcbiAgICAgICAgICAgIH0uYmluZCh0aGlzKSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIGluaXRDaGlsZHJlbigpOiB2b2lkIHtcclxuICAgICAgICAgICAgbGV0IGNoaWxkcyA9IHRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKCcqJyk7XHJcbiAgICBcdFx0Zm9yKGxldCBjID0gMDsgYyA8IGNoaWxkcy5sZW5ndGg7IGMrKykge1xyXG4gICAgXHRcdFx0bGV0IGNoaWxkID0gY2hpbGRzW2NdO1xyXG4gICAgXHRcdFx0aWYoY2hpbGQuaWQpIHtcclxuICAgIFx0XHRcdFx0dGhpcy5jaGlsZHJlbltjaGlsZC5pZF0gPSBjaGlsZDtcclxuICAgIFx0XHRcdH1cclxuICAgIFx0XHRcdGlmKGNoaWxkLnRhZ05hbWUpXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jaGlsZHJlbltjaGlsZC50YWdOYW1lXSA9IHRoaXMuY2hpbGRyZW5bY2hpbGQudGFnTmFtZV0gfHwgW107XHJcbiAgICAgICAgICAgICAgICAoPEVsZW1lbnRbXT50aGlzLmNoaWxkcmVuW2NoaWxkLnRhZ05hbWVdKS5wdXNoKGNoaWxkKTtcclxuICAgIFx0XHR9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIGluaXRBdHRyaWJ1dGVzKCk6IHZvaWQge1xyXG4gICAgICAgICAgICB0aGlzLmF0dHJpYnV0ZXNcclxuICAgICAgICAgICAgLmZvckVhY2goKGEpID0+IHtcclxuICAgICAgICAgICAgICAgIGxldCBhdHRyID0gUmVnaXN0cnkuZ2V0QXR0cmlidXRlKGEpO1xyXG4gICAgICAgICAgICAgICAgQXJyYXkucHJvdG90eXBlLmZvckVhY2guY2FsbCh0aGlzLmVsZW1lbnQucXVlcnlTZWxlY3RvckFsbChgKlske2F9XWApLCAoZTogSFRNTEVsZW1lbnQpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgdmFsID0gZS5oYXNPd25Qcm9wZXJ0eShhKSA/IGVbYV0gOiBlLmdldEF0dHJpYnV0ZShhKTtcclxuICAgICAgICAgICAgICAgICAgICBpZih0eXBlb2YgdmFsID09PSAnc3RyaW5nJyAmJiB2YWwgPT09ICcnKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWwgPSB2b2lkIDA7XHJcbiAgICAgICAgICAgICAgICAgICAgbmV3IGF0dHIoZSwgdmFsKS51cGRhdGUoKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByaXZhdGUgbG9hZFJlcXVpcmVtZW50cygpIHtcclxuICAgIFx0XHRsZXQgY29tcG9uZW50czogYW55W10gPSB0aGlzLnJlcXVpcmVzXHJcbiAgICAgICAgICAgIC5maWx0ZXIoKHJlcSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuICFSZWdpc3RyeS5oYXNDb21wb25lbnQocmVxKTtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLm1hcCgocmVxKSA9PiB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gUmVnaXN0cnkubG9hZENvbXBvbmVudChyZXEpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcblxyXG4gICAgICAgICAgICBsZXQgYXR0cmlidXRlczogYW55W10gPSB0aGlzLmF0dHJpYnV0ZXNcclxuICAgICAgICAgICAgLmZpbHRlcigocmVxKSA9PiB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gIVJlZ2lzdHJ5Lmhhc0F0dHJpYnV0ZShyZXEpO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAubWFwKChyZXEpID0+IHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBSZWdpc3RyeS5sb2FkQXR0cmlidXRlKHJlcSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuXHJcbiAgICAgICAgICAgIGxldCBwcm9taXNlcyA9IGNvbXBvbmVudHMuY29uY2F0KGF0dHJpYnV0ZXMpO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIFByb21pc2UuYWxsKHByb21pc2VzKTtcclxuICAgIFx0fTtcclxuXHJcbiAgICAgICAgLypcclxuICAgICAgICBzdGF0aWMgcmVnaXN0ZXIoYzogdHlwZW9mIENvbXBvbmVudCk6IHZvaWQge1xyXG4gICAgICAgICAgICBSZWdpc3RyeS5yZWdpc3RlcihjKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgKi9cclxuXHJcbiAgICAgICAgLypcclxuICAgICAgICBzdGF0aWMgcnVuKG9wdD86IGFueSkge1xyXG4gICAgICAgICAgICBSZWdpc3RyeS5zZXRPcHRpb25zKG9wdCk7XHJcbiAgICAgICAgICAgIFJlZ2lzdHJ5LnJ1bigpO1xyXG4gICAgICAgIH1cclxuICAgICAgICAqL1xyXG5cclxuICAgICAgICBzdGF0aWMgZ2V0Q29tcG9uZW50KGVsZW1lbnQ6IENvbXBvbmVudEVsZW1lbnQpOiBDb21wb25lbnQge1xyXG4gICAgICAgICAgICB3aGlsZSghZWxlbWVudC5jb21wb25lbnQpXHJcbiAgICBcdFx0XHRlbGVtZW50ID0gPENvbXBvbmVudEVsZW1lbnQ+ZWxlbWVudC5wYXJlbnROb2RlO1xyXG4gICAgXHRcdHJldHVybiBlbGVtZW50LmNvbXBvbmVudDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHN0YXRpYyBnZXROYW1lKGNsYXp6OiB0eXBlb2YgQ29tcG9uZW50KTogc3RyaW5nO1xyXG4gICAgICAgIHN0YXRpYyBnZXROYW1lKGNsYXp6OiBDb21wb25lbnQpOiBzdHJpbmc7XHJcbiAgICAgICAgc3RhdGljIGdldE5hbWUoY2xheno6ICh0eXBlb2YgQ29tcG9uZW50KSB8IChDb21wb25lbnQpKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgaWYoY2xhenogaW5zdGFuY2VvZiBDb21wb25lbnQpXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gY2xhenouY29uc3RydWN0b3IudG9TdHJpbmcoKS5tYXRjaCgvXFx3Ky9nKVsxXTtcclxuICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGNsYXp6LnRvU3RyaW5nKCkubWF0Y2goL1xcdysvZylbMV07XHJcbiAgICAgICAgfVxyXG5cclxuXHJcbiAgICB9XHJcbn1cclxuIiwibW9kdWxlIGhvLmZsdXgge1xuXG5cdGV4cG9ydCBjbGFzcyBDYWxsYmFja0hvbGRlciB7XG5cblx0XHRwcm90ZWN0ZWQgcHJlZml4OiBzdHJpbmcgPSAnSURfJztcbiAgICBcdHByb3RlY3RlZCBsYXN0SUQ6IG51bWJlciA9IDE7XG5cdFx0cHJvdGVjdGVkIGNhbGxiYWNrczoge1trZXk6c3RyaW5nXTpGdW5jdGlvbn0gPSB7fTtcblxuXHRcdHB1YmxpYyByZWdpc3RlcihjYWxsYmFjazogRnVuY3Rpb24sIHNlbGY/OiBhbnkpOiBzdHJpbmcge1xuICAgIFx0XHRsZXQgaWQgPSB0aGlzLnByZWZpeCArIHRoaXMubGFzdElEKys7XG4gICAgXHRcdHRoaXMuY2FsbGJhY2tzW2lkXSA9IHNlbGYgPyBjYWxsYmFjay5iaW5kKHNlbGYpIDogY2FsbGJhY2s7XG4gICAgXHRcdHJldHVybiBpZDtcbiAgXHRcdH1cblxuICBcdFx0cHVibGljIHVucmVnaXN0ZXIoaWQpIHtcbiAgICAgIFx0XHRpZighdGhpcy5jYWxsYmFja3NbaWRdKVxuXHRcdFx0XHR0aHJvdyAnQ291bGQgbm90IHVucmVnaXN0ZXIgY2FsbGJhY2sgZm9yIGlkICcgKyBpZDtcbiAgICBcdFx0ZGVsZXRlIHRoaXMuY2FsbGJhY2tzW2lkXTtcbiAgXHRcdH07XG5cdH1cbn1cbiIsIlxubW9kdWxlIGhvLmZsdXgge1xuXHRpbXBvcnQgUHJvbWlzZSA9IGhvLnByb21pc2UuUHJvbWlzZTtcblxuXG5cdGV4cG9ydCBpbnRlcmZhY2UgSVN0YXRlIHtcblx0XHRuYW1lOiBzdHJpbmc7XG5cdFx0dXJsOiBzdHJpbmc7XG5cdFx0cmVkaXJlY3Q/OiBzdHJpbmc7XG5cdFx0YmVmb3JlPzogKGRhdGE6IElSb3V0ZURhdGEpPT5Qcm9taXNlPGFueSwgYW55Pjtcblx0XHR2aWV3PzogQXJyYXk8SVZpZXdTdGF0ZT47XG5cdH1cblxuXHRleHBvcnQgaW50ZXJmYWNlIElWaWV3U3RhdGUge1xuXHQgICAgbmFtZTogc3RyaW5nO1xuXHRcdGh0bWw6IHN0cmluZztcblx0fVxuXG5cdGV4cG9ydCBpbnRlcmZhY2UgSVN0YXRlcyB7XG5cdCAgICBzdGF0ZXM6IEFycmF5PElTdGF0ZT47XG5cdH1cblxufVxuIiwiXG5tb2R1bGUgaG8uZmx1eC5zdGF0ZXByb3ZpZGVyIHtcblx0aW1wb3J0IFByb21pc2UgPSBoby5wcm9taXNlLlByb21pc2U7XG5cbiAgICBleHBvcnQgaW50ZXJmYWNlIElTdGF0ZVByb3ZpZGVyIHtcbiAgICAgICAgdXNlTWluOmJvb2xlYW47XG5cdFx0cmVzb2x2ZSgpOiBzdHJpbmc7XG5cdFx0Z2V0U3RhdGVzKG5hbWU/OnN0cmluZyk6IFByb21pc2U8SVN0YXRlcywgc3RyaW5nPjtcbiAgICB9XG5cblx0Y2xhc3MgU3RhdGVQcm92aWRlciBpbXBsZW1lbnRzIElTdGF0ZVByb3ZpZGVyIHtcblxuICAgICAgICB1c2VNaW46IGJvb2xlYW4gPSBmYWxzZTtcblxuICAgICAgICByZXNvbHZlKCk6IHN0cmluZyB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy51c2VNaW4gP1xuICAgICAgICAgICAgICAgIGBzdGF0ZXMubWluLmpzYCA6XG4gICAgICAgICAgICAgICAgYHN0YXRlcy5qc2A7XG4gICAgICAgIH1cblxuICAgICAgICBnZXRTdGF0ZXMobmFtZSA9IFwiU3RhdGVzXCIpOiBQcm9taXNlPElTdGF0ZXMsIHN0cmluZz4ge1xuXHRcdFx0cmV0dXJuIG5ldyBQcm9taXNlPElTdGF0ZXMsIGFueT4oKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuXHRcdFx0XHRsZXQgc3JjID0gdGhpcy5yZXNvbHZlKCk7XG4gICAgICAgICAgICAgICAgbGV0IHNjcmlwdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NjcmlwdCcpO1xuICAgICAgICAgICAgICAgIHNjcmlwdC5vbmxvYWQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShuZXcgd2luZG93W25hbWVdKTtcbiAgICAgICAgICAgICAgICB9O1xuXHRcdFx0XHRzY3JpcHQub25lcnJvciA9IChlKSA9PiB7XG5cdFx0XHRcdFx0cmVqZWN0KGUpO1xuXHRcdFx0XHR9O1xuICAgICAgICAgICAgICAgIHNjcmlwdC5zcmMgPSBzcmM7XG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2hlYWQnKVswXS5hcHBlbmRDaGlsZChzY3JpcHQpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgZXhwb3J0IGxldCBpbnN0YW5jZTogSVN0YXRlUHJvdmlkZXIgPSBuZXcgU3RhdGVQcm92aWRlcigpO1xufVxuIiwiXG5tb2R1bGUgaG8uZmx1eC5zdG9yZXByb3ZpZGVyIHtcblx0aW1wb3J0IFByb21pc2UgPSBoby5wcm9taXNlLlByb21pc2U7XG5cbiAgICBleHBvcnQgaW50ZXJmYWNlIElTdG9yZVByb3ZpZGVyIHtcbiAgICAgICAgdXNlTWluOmJvb2xlYW47XG5cdFx0cmVzb2x2ZShuYW1lOnN0cmluZyk6IHN0cmluZztcblx0XHRnZXRTdG9yZShuYW1lOnN0cmluZyk6IFByb21pc2U8dHlwZW9mIFN0b3JlLCBzdHJpbmc+O1xuICAgIH1cblxuXHRleHBvcnQgbGV0IG1hcHBpbmc6IHtbbmFtZTpzdHJpbmddOnN0cmluZ30gPSB7fTtcblxuXHRjbGFzcyBTdG9yZVByb3ZpZGVyIGltcGxlbWVudHMgSVN0b3JlUHJvdmlkZXIge1xuXG4gICAgICAgIHVzZU1pbjogYm9vbGVhbiA9IGZhbHNlO1xuXG4gICAgICAgIHJlc29sdmUobmFtZTogc3RyaW5nKTogc3RyaW5nIHtcblxuXHRcdFx0aWYoaG8uZmx1eC5kaXIpIHtcbiAgICAgICAgICAgICAgICBuYW1lICs9ICcuJyArIG5hbWUuc3BsaXQoJy4nKS5wb3AoKTtcbiAgICAgICAgICAgIH1cblxuXHRcdFx0bmFtZSA9IG5hbWUuc3BsaXQoJy4nKS5qb2luKCcvJyk7XG5cblx0XHRcdHJldHVybiB0aGlzLnVzZU1pbiA/XG4gICAgICAgICAgICAgICAgYHN0b3Jlcy8ke25hbWV9Lm1pbi5qc2AgOlxuICAgICAgICAgICAgICAgIGBzdG9yZXMvJHtuYW1lfS5qc2A7XG4gICAgICAgIH1cblxuICAgICAgICBnZXRTdG9yZShuYW1lOiBzdHJpbmcpOiBQcm9taXNlPHR5cGVvZiBTdG9yZSwgc3RyaW5nPiB7XG4gICAgICAgICAgICBpZih3aW5kb3dbbmFtZV0gIT09IHVuZGVmaW5lZCAmJiB3aW5kb3dbbmFtZV0ucHJvdG90eXBlIGluc3RhbmNlb2YgU3RvcmUpXG5cdFx0XHRcdHJldHVybiBQcm9taXNlLmNyZWF0ZSh3aW5kb3dbbmFtZV0pO1xuXG5cdFx0XHRyZXR1cm4gbmV3IFByb21pc2U8dHlwZW9mIFN0b3JlLCBhbnk+KChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgICAgICBsZXQgc3JjID0gbWFwcGluZ1tuYW1lXSB8fCB0aGlzLnJlc29sdmUobmFtZSk7XG4gICAgICAgICAgICAgICAgbGV0IHNjcmlwdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NjcmlwdCcpO1xuICAgICAgICAgICAgICAgIHNjcmlwdC5vbmxvYWQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYodHlwZW9mIHRoaXMuZ2V0KG5hbWUpID09PSAnZnVuY3Rpb24nKVxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSh0aGlzLmdldChuYW1lKSk7XG4gICAgICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlamVjdChgRXJyb3Igd2hpbGUgbG9hZGluZyBTdG9yZSAke25hbWV9YClcbiAgICAgICAgICAgICAgICB9LmJpbmQodGhpcyk7XG4gICAgICAgICAgICAgICAgc2NyaXB0LnNyYyA9IHNyYztcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnaGVhZCcpWzBdLmFwcGVuZENoaWxkKHNjcmlwdCk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICB9XG5cblx0XHRwcml2YXRlIGdldChuYW1lOiBzdHJpbmcpOiB0eXBlb2YgU3RvcmUge1xuICAgICAgICAgICAgbGV0IGM6IGFueSA9IHdpbmRvdztcbiAgICAgICAgICAgIG5hbWUuc3BsaXQoJy4nKS5mb3JFYWNoKChwYXJ0KSA9PiB7XG4gICAgICAgICAgICAgICAgYyA9IGNbcGFydF07XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiA8dHlwZW9mIFN0b3JlPmM7XG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIGV4cG9ydCBsZXQgaW5zdGFuY2U6IElTdG9yZVByb3ZpZGVyID0gbmV3IFN0b3JlUHJvdmlkZXIoKTtcbn1cbiIsIlxubW9kdWxlIGhvLmZsdXgge1xuXHRpbXBvcnQgUHJvbWlzZSA9IGhvLnByb21pc2UuUHJvbWlzZTtcblxuXHRleHBvcnQgY2xhc3MgU3RvcmVyZWdpc3RyeSB7XG5cblx0XHRwcml2YXRlIHN0b3Jlczoge1trZXk6IHN0cmluZ106IFN0b3JlPGFueT59ID0ge307XG5cblx0XHRwdWJsaWMgcmVnaXN0ZXIoc3RvcmU6IFN0b3JlPGFueT4pOiBTdG9yZTxhbnk+IHtcblx0XHRcdHRoaXMuc3RvcmVzW3N0b3JlLm5hbWVdID0gc3RvcmU7XG5cdFx0XHRyZXR1cm4gc3RvcmU7XG5cdFx0fVxuXG5cdFx0cHVibGljIGdldDxUIGV4dGVuZHMgU3RvcmU8YW55Pj4oc3RvcmVDbGFzczoge25ldygpOlR9KTogVCB7XG5cdFx0XHRsZXQgbmFtZSA9IHN0b3JlQ2xhc3MudG9TdHJpbmcoKS5tYXRjaCgvXFx3Ky9nKVsxXTtcblx0XHRcdHJldHVybiA8VD50aGlzLnN0b3Jlc1tuYW1lXTtcblx0XHR9XG5cblx0XHRwdWJsaWMgbG9hZFN0b3JlKG5hbWU6IHN0cmluZyk6IFByb21pc2U8U3RvcmU8YW55Piwgc3RyaW5nPiB7XG5cblx0XHRcdGxldCBzZWxmID0gdGhpcztcblxuXHRcdCAgIFx0bGV0IHJldCA9IHRoaXMuZ2V0UGFyZW50T2ZTdG9yZShuYW1lKVxuXHRcdCAgIFx0LnRoZW4oKHBhcmVudCkgPT4ge1xuXHRcdFx0ICAgXHRpZihzZWxmLnN0b3Jlc1twYXJlbnRdIGluc3RhbmNlb2YgU3RvcmUgfHwgcGFyZW50ID09PSAnaG8uZmx1eC5TdG9yZScpXG5cdFx0XHRcdCAgIFx0cmV0dXJuIHRydWU7XG5cdCAgIFx0XHRcdGVsc2Vcblx0XHRcdCAgIFx0XHRyZXR1cm4gc2VsZi5sb2FkU3RvcmUocGFyZW50KTtcblx0XHQgICBcdH0pXG5cdFx0ICAgXHQudGhlbigocGFyZW50VHlwZSkgPT4ge1xuXHRcdFx0ICAgXHRyZXR1cm4gaG8uZmx1eC5zdG9yZXByb3ZpZGVyLmluc3RhbmNlLmdldFN0b3JlKG5hbWUpO1xuXHRcdCAgIFx0fSlcblx0XHQgICBcdC50aGVuKChzdG9yZUNsYXNzKSA9PiB7XG5cdFx0XHQgICBcdHJldHVybiBzZWxmLnJlZ2lzdGVyKG5ldyBzdG9yZUNsYXNzKS5pbml0KCk7XG5cdFx0ICAgXHR9KVxuXHRcdFx0LnRoZW4oKCk9Pntcblx0XHRcdCAgIFx0cmV0dXJuIHNlbGYuc3RvcmVzW25hbWVdO1xuXHRcdFx0fSk7XG5cblx0XHRcdHJldHVybiByZXQ7XG5cblx0XHRcdC8qXG5cdFx0XHRyZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG5cdFx0XHRcdGlmKHRoaXMuZ2V0KG5hbWUpIGluc3RhbmNlb2YgU3RvcmUpXG5cdFx0XHRcdFx0cmVzb2x2ZSh0aGlzLmdldChuYW1lKSlcblx0XHRcdFx0ZWxzZSB7XG5cblx0XHRcdFx0XHRzdG9yZXByb3ZpZGVyLmluc3RhbmNlLmdldFN0b3JlKG5hbWUpXG5cdFx0XHRcdFx0LnRoZW4oKHN0b3JlQ2xhc3MpID0+IHtcblx0XHRcdFx0XHRcdHRoaXMucmVnaXN0ZXIobmV3IHN0b3JlQ2xhc3MoKSk7XG5cdFx0XHRcdFx0XHRyZXNvbHZlKHRoaXMuZ2V0KG5hbWUpKTtcblx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdC5jYXRjaChyZWplY3QpO1xuXHRcdFx0XHR9XG5cblx0XHRcdH0uYmluZCh0aGlzKSk7XG5cdFx0XHQqL1xuXG5cdFx0XHQvKlxuXHRcdFx0aWYoU1RPUkVTW25hbWVdICE9PSB1bmRlZmluZWQgJiYgU1RPUkVTW25hbWVdIGluc3RhbmNlb2YgU3RvcmUpXG5cdFx0XHRcdHJldHVybiBQcm9taXNlLmNyZWF0ZShTVE9SRVNbbmFtZV0pO1xuXHRcdFx0ZWxzZSB7XG5cdFx0XHRcdHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG5cdFx0XHRcdFx0c3RvcmVwcm92aWRlci5pbnN0YW5jZS5nZXRTdG9yZShuYW1lKVxuXHRcdFx0XHRcdC50aGVuKChzKT0+e3Jlc29sdmUocyk7fSlcblx0XHRcdFx0XHQuY2F0Y2goKGUpPT57cmVqZWN0KGUpO30pO1xuXHRcdFx0XHR9KTtcblx0XHRcdH1cblx0XHRcdCovXG5cblx0XHR9XG5cblx0XHRwcm90ZWN0ZWQgZ2V0UGFyZW50T2ZTdG9yZShuYW1lOiBzdHJpbmcpOiBQcm9taXNlPHN0cmluZywgYW55PiB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuXG4gICAgICAgICAgICAgICAgbGV0IHhtbGh0dHAgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICAgICAgICAgICAgICB4bWxodHRwLm9ucmVhZHlzdGF0ZWNoYW5nZSA9ICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYoeG1saHR0cC5yZWFkeVN0YXRlID09IDQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCByZXNwID0geG1saHR0cC5yZXNwb25zZVRleHQ7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZih4bWxodHRwLnN0YXR1cyA9PSAyMDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgbSA9IHJlc3AubWF0Y2goL31cXClcXCgoLiopXFwpOy8pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKG0gIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShtWzFdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUobnVsbCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZWplY3QocmVzcCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICB4bWxodHRwLm9wZW4oJ0dFVCcsIGhvLmZsdXguc3RvcmVwcm92aWRlci5pbnN0YW5jZS5yZXNvbHZlKG5hbWUpKTtcbiAgICAgICAgICAgICAgICB4bWxodHRwLnNlbmQoKTtcblxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblx0fVxuXG59XG4iLCJcbm1vZHVsZSBoby5mbHV4IHtcblxuXHRleHBvcnQgY2xhc3MgU3RvcmU8VD4gZXh0ZW5kcyBDYWxsYmFja0hvbGRlciB7XG5cblx0XHRwcm90ZWN0ZWQgZGF0YTogVDtcblx0XHRwcml2YXRlIGlkOiBzdHJpbmc7XG5cdFx0cHJpdmF0ZSBoYW5kbGVyczoge1trZXk6IHN0cmluZ106IEZ1bmN0aW9ufSA9IHt9O1xuXG5cblx0XHRjb25zdHJ1Y3RvcigpIHtcblx0XHRcdHN1cGVyKCk7XG5cdFx0XHR0aGlzLmlkID0gaG8uZmx1eC5ESVNQQVRDSEVSLnJlZ2lzdGVyKHRoaXMuaGFuZGxlLmJpbmQodGhpcykpO1xuXHRcdFx0Ly9oby5mbHV4LlNUT1JFU1t0aGlzLm5hbWVdID0gdGhpcztcblx0XHRcdGhvLmZsdXguU1RPUkVTLnJlZ2lzdGVyKHRoaXMpO1xuXHRcdH1cblxuXHRcdHB1YmxpYyBpbml0KCk6IGFueSB7fVxuXG5cdFx0IGdldCBuYW1lKCk6IHN0cmluZyB7XG5cdFx0XHRyZXR1cm4gdGhpcy5jb25zdHJ1Y3Rvci50b1N0cmluZygpLm1hdGNoKC9cXHcrL2cpWzFdO1xuXHRcdH1cblxuXHRcdHB1YmxpYyByZWdpc3RlcihjYWxsYmFjazogKGRhdGE6VCk9PnZvaWQsIHNlbGY/OmFueSk6IHN0cmluZyB7XG5cdFx0XHRyZXR1cm4gc3VwZXIucmVnaXN0ZXIoY2FsbGJhY2ssIHNlbGYpO1xuXHRcdH1cblxuXHRcdHByb3RlY3RlZCBvbih0eXBlOiBzdHJpbmcsIGZ1bmM6IEZ1bmN0aW9uKTogdm9pZCB7XG5cdFx0XHR0aGlzLmhhbmRsZXJzW3R5cGVdID0gZnVuYztcblx0XHR9XG5cblx0XHRwcm90ZWN0ZWQgaGFuZGxlKGFjdGlvbjogSUFjdGlvbik6IHZvaWQge1xuXHRcdFx0aWYodHlwZW9mIHRoaXMuaGFuZGxlcnNbYWN0aW9uLnR5cGVdID09PSAnZnVuY3Rpb24nKVxuXHRcdFx0XHR0aGlzLmhhbmRsZXJzW2FjdGlvbi50eXBlXShhY3Rpb24uZGF0YSk7XG5cdFx0fTtcblxuXG5cdFx0cHJvdGVjdGVkIGNoYW5nZWQoKTogdm9pZCB7XG5cdFx0XHRmb3IgKGxldCBpZCBpbiB0aGlzLmNhbGxiYWNrcykge1xuXHRcdFx0ICBsZXQgY2IgPSB0aGlzLmNhbGxiYWNrc1tpZF07XG5cdFx0XHQgIGlmKGNiKVxuXHRcdFx0ICBcdGNiKHRoaXMuZGF0YSk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cblx0fTtcblxuXG59XG4iLCJcblxubW9kdWxlIGhvLmZsdXgge1xuXG5cdGltcG9ydCBQcm9taXNlID0gaG8ucHJvbWlzZS5Qcm9taXNlO1xuXG5cblx0LyoqIERhdGEgdGhhdCBhIFJvdXRlciNnbyB0YWtlcyAqL1xuXHRleHBvcnQgaW50ZXJmYWNlIElSb3V0ZURhdGEge1xuXHQgICAgc3RhdGU6IHN0cmluZztcblx0XHRhcmdzOiBhbnk7XG5cdFx0ZXh0ZXJuOiBib29sZWFuO1xuXHR9XG5cblx0LyoqIERhdGEgdGhhdCBSb3V0ZXIjY2hhbmdlcyBlbWl0IHRvIGl0cyBsaXN0ZW5lcnMgKi9cblx0ZXhwb3J0IGludGVyZmFjZSBJUm91dGVyRGF0YSB7XG5cdCAgICBzdGF0ZTogSVN0YXRlO1xuXHRcdGFyZ3M6IGFueTtcblx0XHRleHRlcm46IGJvb2xlYW47XG5cdH1cblxuXHRleHBvcnQgY2xhc3MgUm91dGVyIGV4dGVuZHMgU3RvcmU8SVJvdXRlckRhdGE+IHtcblxuXHRcdHByaXZhdGUgbWFwcGluZzpBcnJheTxJU3RhdGU+ID0gbnVsbDtcblx0XHQvL3ByaXZhdGUgc3RhdGU6SVN0YXRlO1xuXHRcdC8vcHJpdmF0ZSBhcmdzOmFueSA9IG51bGw7XG5cblx0XHRjb25zdHJ1Y3RvcigpIHtcblx0XHRcdHN1cGVyKCk7XG5cdFx0fVxuXG5cdFx0cHVibGljIGluaXQoKTogUHJvbWlzZTxhbnksIGFueT4ge1xuXHRcdFx0dGhpcy5vbignU1RBVEUnLCB0aGlzLm9uU3RhdGVDaGFuZ2VSZXF1ZXN0ZWQuYmluZCh0aGlzKSk7XG5cblx0XHRcdGxldCBvbkhhc2hDaGFuZ2UgPSB0aGlzLm9uSGFzaENoYW5nZS5iaW5kKHRoaXMpO1xuXG5cdFx0XHRyZXR1cm4gdGhpcy5pbml0U3RhdGVzKClcblx0XHRcdC50aGVuKCgpID0+IHtcblx0XHRcdFx0d2luZG93Lm9uaGFzaGNoYW5nZSA9IG9uSGFzaENoYW5nZTtcblx0XHRcdFx0b25IYXNoQ2hhbmdlKCk7XG5cdFx0XHR9KTtcblx0XHR9XG5cblxuXHRcdHB1YmxpYyBnbyhkYXRhOiBJUm91dGVEYXRhKTogdm9pZCB7XG5cdFx0XHRoby5mbHV4LkRJU1BBVENIRVIuZGlzcGF0Y2goe1xuXHRcdFx0XHR0eXBlOiAnU1RBVEUnLFxuXHRcdFx0XHRkYXRhOiBkYXRhXG5cdFx0XHR9KTtcblx0XHR9XG5cblx0XHRwcml2YXRlIGluaXRTdGF0ZXMoKTogUHJvbWlzZTxhbnksIGFueT4ge1xuXHRcdFx0cmV0dXJuIHN0YXRlcHJvdmlkZXIuaW5zdGFuY2UuZ2V0U3RhdGVzKClcblx0XHRcdC50aGVuKGZ1bmN0aW9uKGlzdGF0ZXMpIHtcblx0XHRcdFx0dGhpcy5tYXBwaW5nID0gaXN0YXRlcy5zdGF0ZXM7XG5cdFx0XHR9LmJpbmQodGhpcykpO1xuXHRcdH1cblxuXHRcdHByaXZhdGUgZ2V0U3RhdGVGcm9tTmFtZShuYW1lOiBzdHJpbmcpOiBJU3RhdGUge1xuXHRcdFx0cmV0dXJuIHRoaXMubWFwcGluZy5maWx0ZXIoKHMpPT57XG5cdFx0XHRcdHJldHVybiBzLm5hbWUgPT09IG5hbWVcblx0XHRcdH0pWzBdO1xuXHRcdH1cblxuXHRcdHByb3RlY3RlZCBvblN0YXRlQ2hhbmdlUmVxdWVzdGVkKGRhdGE6IElSb3V0ZURhdGEpOiB2b2lkIHtcblx0XHRcdC8vY3VycmVudCBzdGF0ZSBhbmQgYXJncyBlcXVhbHMgcmVxdWVzdGVkIHN0YXRlIGFuZCBhcmdzIC0+IHJldHVyblxuXHRcdFx0Ly9pZih0aGlzLnN0YXRlICYmIHRoaXMuc3RhdGUubmFtZSA9PT0gZGF0YS5zdGF0ZSAmJiB0aGlzLmVxdWFscyh0aGlzLmFyZ3MsIGRhdGEuYXJncykpXG5cdFx0XHRpZih0aGlzLmRhdGEgJiYgdGhpcy5kYXRhLnN0YXRlICYmIHRoaXMuZGF0YS5zdGF0ZS5uYW1lID09PSBkYXRhLnN0YXRlICYmIHRoaXMuZXF1YWxzKHRoaXMuZGF0YS5hcmdzLCBkYXRhLmFyZ3MpKVxuXHRcdFx0XHRyZXR1cm47XG5cblx0XHRcdC8vZ2V0IHJlcXVlc3RlZCBzdGF0ZVxuXHRcdFx0bGV0IHN0YXRlID0gdGhpcy5nZXRTdGF0ZUZyb21OYW1lKGRhdGEuc3RhdGUpO1xuXG5cblx0XHRcdC8vcmVxdWVzdGVkIHN0YXRlIGhhcyBhbiByZWRpcmVjdCBwcm9wZXJ0eSAtPiBjYWxsIHJlZGlyZWN0IHN0YXRlXG5cdFx0XHRpZighIXN0YXRlLnJlZGlyZWN0KSB7XG5cdFx0XHRcdHN0YXRlID0gdGhpcy5nZXRTdGF0ZUZyb21OYW1lKHN0YXRlLnJlZGlyZWN0KTtcblx0XHRcdH1cblxuXG5cdFx0XHQvL1RPRE8gaGFuZGxlciBwcm9taXNlc1xuXHRcdFx0bGV0IHByb20gPSB0eXBlb2Ygc3RhdGUuYmVmb3JlID09PSAnZnVuY3Rpb24nID8gc3RhdGUuYmVmb3JlKGRhdGEpIDogUHJvbWlzZS5jcmVhdGUodW5kZWZpbmVkKTtcblx0XHRcdHByb21cblx0XHRcdC50aGVuKGZ1bmN0aW9uKCkge1xuXG5cdFx0XHRcdC8vZG9lcyB0aGUgc3RhdGUgY2hhbmdlIHJlcXVlc3QgY29tZXMgZnJvbSBleHRlcm4gZS5nLiB1cmwgY2hhbmdlIGluIGJyb3dzZXIgd2luZG93ID9cblx0XHRcdFx0bGV0IGV4dGVybiA9ICEhIGRhdGEuZXh0ZXJuO1xuXG5cdFx0XHRcdC8vLS0tLS0tLSBzZXQgY3VycmVudCBzdGF0ZSAmIGFyZ3VtZW50c1xuXHRcdFx0XHQvL3RoaXMuc3RhdGUgPSBzdGF0ZTtcblx0XHRcdFx0Ly90aGlzLmFyZ3MgPSBkYXRhLmFyZ3M7XG5cblx0XHRcdFx0dGhpcy5kYXRhID0ge1xuXHRcdFx0XHRcdHN0YXRlOiBzdGF0ZSxcblx0XHRcdFx0XHRhcmdzOiBkYXRhLmFyZ3MsXG5cdFx0XHRcdFx0ZXh0ZXJuOiBleHRlcm4sXG5cdFx0XHRcdH07XG5cblx0XHRcdFx0Ly8tLS0tLS0tIHNldCB1cmwgZm9yIGJyb3dzZXJcblx0XHRcdFx0dmFyIHVybCA9IHRoaXMudXJsRnJvbVN0YXRlKHN0YXRlLnVybCwgZGF0YS5hcmdzKTtcblx0XHRcdFx0dGhpcy5zZXRVcmwodXJsKTtcblxuXHRcdFx0XHR0aGlzLmNoYW5nZWQoKTtcblxuXHRcdFx0fS5iaW5kKHRoaXMpLFxuXHRcdFx0ZnVuY3Rpb24oZGF0YSkge1xuXHRcdFx0XHR0aGlzLm9uU3RhdGVDaGFuZ2VSZXF1ZXN0ZWQoZGF0YSk7XG5cdFx0XHR9LmJpbmQodGhpcykpO1xuXG5cdFx0fVxuXG5cdFx0cHJpdmF0ZSBvbkhhc2hDaGFuZ2UoKTogdm9pZCB7XG5cdFx0XHRsZXQgcyA9IHRoaXMuc3RhdGVGcm9tVXJsKHdpbmRvdy5sb2NhdGlvbi5oYXNoLnN1YnN0cigxKSk7XG5cblx0XHRcdGhvLmZsdXguRElTUEFUQ0hFUi5kaXNwYXRjaCh7XG5cdFx0XHRcdHR5cGU6ICdTVEFURScsXG5cdFx0XHRcdGRhdGE6IHtcblx0XHRcdFx0XHRzdGF0ZTogcy5zdGF0ZSxcblx0XHRcdFx0XHRhcmdzOiBzLmFyZ3MsXG5cdFx0XHRcdFx0ZXh0ZXJuOiB0cnVlLFxuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHR9XG5cblx0XHRwcml2YXRlIHNldFVybCh1cmw6IHN0cmluZyk6IHZvaWQge1xuXHRcdFx0aWYod2luZG93LmxvY2F0aW9uLmhhc2guc3Vic3RyKDEpID09PSB1cmwpXG5cdFx0XHRcdHJldHVybjtcblxuXHRcdFx0bGV0IGwgPSB3aW5kb3cub25oYXNoY2hhbmdlO1xuXHRcdFx0d2luZG93Lm9uaGFzaGNoYW5nZSA9IG51bGw7XG5cdFx0XHR3aW5kb3cubG9jYXRpb24uaGFzaCA9IHVybDtcblx0XHRcdHdpbmRvdy5vbmhhc2hjaGFuZ2UgPSBsO1xuXHRcdH1cblxuXHRcdHByaXZhdGUgcmVnZXhGcm9tVXJsKHVybDogc3RyaW5nKTogc3RyaW5nIHtcblx0XHRcdHZhciByZWdleCA9IC86KFtcXHddKykvO1xuXHRcdFx0d2hpbGUodXJsLm1hdGNoKHJlZ2V4KSkge1xuXHRcdFx0XHR1cmwgPSB1cmwucmVwbGFjZShyZWdleCwgXCIoW15cXC9dKylcIik7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gdXJsKyckJztcblx0XHR9XG5cblx0XHRwcml2YXRlIGFyZ3NGcm9tVXJsKHBhdHRlcm46IHN0cmluZywgdXJsOiBzdHJpbmcpOiBhbnkge1xuXHRcdFx0bGV0IHIgPSB0aGlzLnJlZ2V4RnJvbVVybChwYXR0ZXJuKTtcblx0XHRcdGxldCBuYW1lcyA9IHBhdHRlcm4ubWF0Y2gocikuc2xpY2UoMSk7XG5cdFx0XHRsZXQgdmFsdWVzID0gdXJsLm1hdGNoKHIpLnNsaWNlKDEpO1xuXG5cdFx0XHRsZXQgYXJncyA9IHt9O1xuXHRcdFx0bmFtZXMuZm9yRWFjaChmdW5jdGlvbihuYW1lLCBpKSB7XG5cdFx0XHRcdGFyZ3NbbmFtZS5zdWJzdHIoMSldID0gdmFsdWVzW2ldO1xuXHRcdFx0fSk7XG5cblx0XHRcdHJldHVybiBhcmdzO1xuXHRcdH1cblxuXHRcdHByaXZhdGUgc3RhdGVGcm9tVXJsKHVybDogc3RyaW5nKTogSVJvdXRlRGF0YSB7XG5cdFx0XHR2YXIgcyA9IHZvaWQgMDtcblx0XHRcdHRoaXMubWFwcGluZy5mb3JFYWNoKChzdGF0ZTogSVN0YXRlKSA9PiB7XG5cdFx0XHRcdGlmKHMpXG5cdFx0XHRcdFx0cmV0dXJuO1xuXG5cdFx0XHRcdHZhciByID0gdGhpcy5yZWdleEZyb21Vcmwoc3RhdGUudXJsKTtcblx0XHRcdFx0aWYodXJsLm1hdGNoKHIpKSB7XG5cdFx0XHRcdFx0dmFyIGFyZ3MgPSB0aGlzLmFyZ3NGcm9tVXJsKHN0YXRlLnVybCwgdXJsKTtcblx0XHRcdFx0XHRzID0ge1xuXHRcdFx0XHRcdFx0XCJzdGF0ZVwiOiBzdGF0ZS5uYW1lLFxuXHRcdFx0XHRcdFx0XCJhcmdzXCI6IGFyZ3MsXG5cdFx0XHRcdFx0XHRcImV4dGVyblwiOiBmYWxzZVxuXHRcdFx0XHRcdH07XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXG5cdFx0XHRpZighcylcblx0XHRcdFx0dGhyb3cgXCJObyBTdGF0ZSBmb3VuZCBmb3IgdXJsIFwiK3VybDtcblxuXHRcdFx0cmV0dXJuIHM7XG5cdFx0fVxuXG5cdFx0cHJpdmF0ZSB1cmxGcm9tU3RhdGUodXJsOiBzdHJpbmcsIGFyZ3M6IGFueSk6IHN0cmluZyB7XG5cdFx0XHRsZXQgcmVnZXggPSAvOihbXFx3XSspLztcblx0XHRcdHdoaWxlKHVybC5tYXRjaChyZWdleCkpIHtcblx0XHRcdFx0dXJsID0gdXJsLnJlcGxhY2UocmVnZXgsIGZ1bmN0aW9uKG0pIHtcblx0XHRcdFx0XHRyZXR1cm4gYXJnc1ttLnN1YnN0cigxKV07XG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIHVybDtcblx0XHR9XG5cblx0XHRwcml2YXRlIGVxdWFscyhvMTogYW55LCBvMjogYW55KSA6IGJvb2xlYW4ge1xuXHRcdFx0cmV0dXJuIEpTT04uc3RyaW5naWZ5KG8xKSA9PT0gSlNPTi5zdHJpbmdpZnkobzIpO1xuXHRcdH1cblxuXHR9XG59XG4iLCJcbm1vZHVsZSBoby5mbHV4IHtcblxuXHRleHBvcnQgaW50ZXJmYWNlIElBY3Rpb24ge1xuXHQgICAgdHlwZTpzdHJpbmc7XG5cdFx0ZGF0YT86YW55O1xuXHR9XG5cblx0ZXhwb3J0IGNsYXNzIERpc3BhdGNoZXIgZXh0ZW5kcyBDYWxsYmFja0hvbGRlciB7XG5cbiAgICBcdHByaXZhdGUgaXNQZW5kaW5nOiB7W2tleTpzdHJpbmddOmJvb2xlYW59ID0ge307XG4gICAgXHRwcml2YXRlIGlzSGFuZGxlZDoge1trZXk6c3RyaW5nXTpib29sZWFufSA9IHt9O1xuICAgIFx0cHJpdmF0ZSBpc0Rpc3BhdGNoaW5nOiBib29sZWFuID0gZmFsc2U7XG4gICAgXHRwcml2YXRlIHBlbmRpbmdQYXlsb2FkOiBJQWN0aW9uID0gbnVsbDtcblxuXHRcdHB1YmxpYyB3YWl0Rm9yKC4uLmlkczogQXJyYXk8bnVtYmVyPik6IHZvaWQge1xuXHRcdFx0aWYoIXRoaXMuaXNEaXNwYXRjaGluZylcblx0XHQgIFx0XHR0aHJvdyAnRGlzcGF0Y2hlci53YWl0Rm9yKC4uLik6IE11c3QgYmUgaW52b2tlZCB3aGlsZSBkaXNwYXRjaGluZy4nO1xuXG5cdFx0XHRmb3IgKGxldCBpaSA9IDA7IGlpIDwgaWRzLmxlbmd0aDsgaWkrKykge1xuXHRcdFx0ICBsZXQgaWQgPSBpZHNbaWldO1xuXG5cdFx0XHQgIGlmICh0aGlzLmlzUGVuZGluZ1tpZF0pIHtcblx0XHQgICAgICBcdGlmKCF0aGlzLmlzSGFuZGxlZFtpZF0pXG5cdFx0XHQgICAgICBcdHRocm93IGB3YWl0Rm9yKC4uLik6IENpcmN1bGFyIGRlcGVuZGVuY3kgZGV0ZWN0ZWQgd2hpbGUgd2F0aW5nIGZvciAke2lkfWA7XG5cdFx0XHRcdGNvbnRpbnVlO1xuXHRcdFx0ICB9XG5cblx0XHRcdCAgaWYoIXRoaXMuY2FsbGJhY2tzW2lkXSlcblx0XHRcdCAgXHR0aHJvdyBgd2FpdEZvciguLi4pOiAke2lkfSBkb2VzIG5vdCBtYXAgdG8gYSByZWdpc3RlcmVkIGNhbGxiYWNrLmA7XG5cblx0XHRcdCAgdGhpcy5pbnZva2VDYWxsYmFjayhpZCk7XG5cdFx0XHR9XG5cdFx0fTtcblxuXHRcdHB1YmxpYyBkaXNwYXRjaChhY3Rpb246IElBY3Rpb24pIHtcblx0XHRcdGlmKHRoaXMuaXNEaXNwYXRjaGluZylcblx0XHQgICAgXHR0aHJvdyAnQ2Fubm90IGRpc3BhdGNoIGluIHRoZSBtaWRkbGUgb2YgYSBkaXNwYXRjaC4nO1xuXG5cdFx0XHR0aGlzLnN0YXJ0RGlzcGF0Y2hpbmcoYWN0aW9uKTtcblxuXHRcdCAgICB0cnkge1xuXHRcdCAgICAgIGZvciAobGV0IGlkIGluIHRoaXMuY2FsbGJhY2tzKSB7XG5cdFx0ICAgICAgICBpZiAodGhpcy5pc1BlbmRpbmdbaWRdKSB7XG5cdFx0ICAgICAgICAgIGNvbnRpbnVlO1xuXHRcdCAgICAgICAgfVxuXHRcdCAgICAgICAgdGhpcy5pbnZva2VDYWxsYmFjayhpZCk7XG5cdFx0ICAgICAgfVxuXHRcdCAgICB9IGZpbmFsbHkge1xuXHRcdCAgICAgIHRoaXMuc3RvcERpc3BhdGNoaW5nKCk7XG5cdFx0ICAgIH1cblx0XHR9O1xuXG5cdCAgXHRwcml2YXRlIGludm9rZUNhbGxiYWNrKGlkOiBudW1iZXIpOiB2b2lkIHtcblx0ICAgIFx0dGhpcy5pc1BlbmRpbmdbaWRdID0gdHJ1ZTtcblx0ICAgIFx0dGhpcy5jYWxsYmFja3NbaWRdKHRoaXMucGVuZGluZ1BheWxvYWQpO1xuXHQgICAgXHR0aGlzLmlzSGFuZGxlZFtpZF0gPSB0cnVlO1xuXHQgIFx0fVxuXG5cdCAgXHRwcml2YXRlIHN0YXJ0RGlzcGF0Y2hpbmcocGF5bG9hZDogSUFjdGlvbik6IHZvaWQge1xuXHQgICAgXHRmb3IgKGxldCBpZCBpbiB0aGlzLmNhbGxiYWNrcykge1xuXHQgICAgICBcdFx0dGhpcy5pc1BlbmRpbmdbaWRdID0gZmFsc2U7XG5cdCAgICAgIFx0XHR0aGlzLmlzSGFuZGxlZFtpZF0gPSBmYWxzZTtcblx0ICAgIFx0fVxuXHQgICAgXHR0aGlzLnBlbmRpbmdQYXlsb2FkID0gcGF5bG9hZDtcblx0ICAgIFx0dGhpcy5pc0Rpc3BhdGNoaW5nID0gdHJ1ZTtcbiAgXHRcdH1cblxuXHQgIFx0cHJpdmF0ZSBzdG9wRGlzcGF0Y2hpbmcoKTogdm9pZCB7XG5cdCAgICBcdHRoaXMucGVuZGluZ1BheWxvYWQgPSBudWxsO1xuXHQgICAgXHR0aGlzLmlzRGlzcGF0Y2hpbmcgPSBmYWxzZTtcblx0ICBcdH1cblx0fVxufVxuIiwibW9kdWxlIGhvLmZsdXgge1xuXHRpbXBvcnQgUHJvbWlzZSA9IGhvLnByb21pc2UuUHJvbWlzZTtcblxuXHRleHBvcnQgbGV0IERJU1BBVENIRVI6IERpc3BhdGNoZXIgPSBuZXcgRGlzcGF0Y2hlcigpO1xuXG5cdGV4cG9ydCBsZXQgU1RPUkVTOiBTdG9yZXJlZ2lzdHJ5ID0gbmV3IFN0b3JlcmVnaXN0cnkoKTtcblxuXHRleHBvcnQgbGV0IGRpcjogYm9vbGVhbiA9IGZhbHNlO1xuXG5cdC8vaWYoaG8uZmx1eC5TVE9SRVMuZ2V0KFJvdXRlcikgPT09IHVuZGVmaW5lZClcblx0Ly9cdG5ldyBSb3V0ZXIoKTtcblxuXHRleHBvcnQgZnVuY3Rpb24gcnVuKCk6IFByb21pc2U8YW55LCBhbnk+IHtcblx0XHQvL3JldHVybiAoPFJvdXRlcj5oby5mbHV4LlNUT1JFU1snUm91dGVyJ10pLmluaXQoKTtcblx0XHRyZXR1cm4gU1RPUkVTLmdldChSb3V0ZXIpLmluaXQoKTtcblx0fVxufVxuIiwibW9kdWxlIGhvLnVpIHtcblxuXHRleHBvcnQgZnVuY3Rpb24gcnVuKG9wdGlvbnM6SU9wdGlvbnM9bmV3IE9wdGlvbnMoKSk6IGhvLnByb21pc2UuUHJvbWlzZTxhbnksIGFueT4ge1xuXHRcdG9wdGlvbnMgPSBuZXcgT3B0aW9ucyhvcHRpb25zKTtcblxuXHRcdGxldCBwID0gb3B0aW9ucy5wcm9jZXNzKClcblx0XHQudGhlbihoby5jb21wb25lbnRzLnJ1bilcblx0XHQudGhlbihoby5mbHV4LnJ1bik7XG5cblx0XHRyZXR1cm4gcDtcblx0fVxuXG5cdGxldCBjb21wb25lbnRzID0gW1xuXHRcdFwiU3RvcmVkXCIsXG5cdFx0XCJWaWV3XCIsXG5cdF07XG5cblx0bGV0IGF0dHJpYnV0ZXMgPSBbXG5cdFx0XCJCaW5kXCIsXG5cdFx0XCJCaW5kQmlcIixcblx0XTtcblxuXHRsZXQgc3RvcmVzID0gW1xuXG5cdF07XG5cblx0ZXhwb3J0IGludGVyZmFjZSBJT3B0aW9ucyB7XG5cdFx0cm9vdDogc3RyaW5nIHwgdHlwZW9mIGhvLmNvbXBvbmVudHMuQ29tcG9uZW50OyAvL1Jvb3QgY29tcG9uZW50IHRvIHJlZ2lzdGVyO1xuXHRcdHJvdXRlcjogc3RyaW5nIHwgdHlwZW9mIGhvLmZsdXguUm91dGVyOyAvL2FsdGVybmF0aXZlIHJvdXRlciBjbGFzc1xuXHRcdG1hcDogc3RyaW5nIHwgYm9vbGVhbjsgLy8gaWYgc2V0LCBtYXAgYWxsIGhvLnVpIGNvbXBvbmVudHMgaW4gdGhlIGNvbXBvbmVudHByb3ZpZGVyIHRvIHRoZSBnaXZlbiB1cmxcblx0XHRkaXI6IGJvb2xlYW47IC8vIHNldCB1c2VkaXIgaW4gaG8uY29tcG9uZW50c1xuXHRcdG1pbjogYm9vbGVhbjtcblx0XHRwcm9jZXNzOiAoKT0+aG8ucHJvbWlzZS5Qcm9taXNlPGFueSwgYW55Pjtcblx0fVxuXG5cdGNsYXNzIE9wdGlvbnMgaW1wbGVtZW50cyBJT3B0aW9ucyB7XG5cdFx0cm9vdDogc3RyaW5nIHwgdHlwZW9mIGhvLmNvbXBvbmVudHMuQ29tcG9uZW50ID0gXCJBcHBcIlxuXHRcdHJvdXRlcjogc3RyaW5nIHwgdHlwZW9mIGhvLmZsdXguUm91dGVyID0gaG8uZmx1eC5Sb3V0ZXI7XG5cdFx0bWFwOiBzdHJpbmcgfCBib29sZWFuID0gdHJ1ZTtcblx0XHRtYXBEZWZhdWx0ID0gXCJib3dlcl9jb21wb25lbnRzL2hvLXVpL2Rpc3QvXCI7XG5cdFx0ZGlyID0gdHJ1ZTtcblx0XHRtaW4gPSBmYWxzZTtcblxuXHRcdGNvbnN0cnVjdG9yKG9wdDogSU9wdGlvbnMgPSA8SU9wdGlvbnM+e30pIHtcblx0XHRcdGZvcih2YXIga2V5IGluIG9wdCkge1xuXHRcdFx0XHR0aGlzW2tleV0gPSBvcHRba2V5XTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRwcm9jZXNzKCk6IGhvLnByb21pc2UuUHJvbWlzZTxhbnksIGFueT57XG5cdFx0XHRyZXR1cm4gaG8ucHJvbWlzZS5Qcm9taXNlLmNyZWF0ZSh0aGlzLnByb2Nlc3NEaXIoKSlcblx0XHRcdC50aGVuKHRoaXMucHJvY2Vzc01pbi5iaW5kKHRoaXMpKVxuXHRcdFx0LnRoZW4odGhpcy5wcm9jZXNzTWFwLmJpbmQodGhpcykpXG5cdFx0XHQudGhlbih0aGlzLnByb2Nlc3NSb3V0ZXIuYmluZCh0aGlzKSlcblx0XHRcdC50aGVuKHRoaXMucHJvY2Vzc1Jvb3QuYmluZCh0aGlzKSlcblx0XHR9XG5cblx0XHRwcm90ZWN0ZWQgcHJvY2Vzc1Jvb3QoKSB7XG5cdFx0XHRyZXR1cm4gbmV3IGhvLnByb21pc2UuUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG5cdFx0XHRcdGlmKHR5cGVvZiB0aGlzLnJvb3QgPT09ICdzdHJpbmcnKSB7XG5cdFx0XHRcdFx0aG8uY29tcG9uZW50cy5yZWdpc3RyeS5pbnN0YW5jZS5sb2FkQ29tcG9uZW50KDxzdHJpbmc+dGhpcy5yb290KVxuXHRcdFx0XHRcdC50aGVuKGMgPT4ge1xuXHRcdFx0XHRcdFx0aG8uY29tcG9uZW50cy5yZWdpc3RyeS5pbnN0YW5jZS5yZWdpc3RlcihjKTtcblx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdC50aGVuKHJlc29sdmUpXG5cdFx0XHRcdFx0LmNhdGNoKHJlamVjdCk7XG5cblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRoby5jb21wb25lbnRzLnJlZ2lzdHJ5Lmluc3RhbmNlLnJlZ2lzdGVyKDx0eXBlb2YgaG8uY29tcG9uZW50cy5Db21wb25lbnQ+dGhpcy5yb290KVxuXHRcdFx0XHRcdHJlc29sdmUobnVsbCk7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdH1cblxuXHRcdHByb3RlY3RlZCBwcm9jZXNzUm91dGVyKCk6IGhvLnByb21pc2UuUHJvbWlzZTxhbnksIGFueT4ge1xuXHRcdFx0cmV0dXJuIG5ldyBoby5wcm9taXNlLlByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuXHRcdFx0XHRpZih0eXBlb2YgdGhpcy5yb3V0ZXIgPT09ICdzdHJpbmcnKSB7XG5cdFx0XHRcdFx0aG8uZmx1eC5TVE9SRVMubG9hZFN0b3JlKDxzdHJpbmc+dGhpcy5yb3V0ZXIpXG5cdFx0XHRcdFx0LnRoZW4ocmVzb2x2ZSlcblx0XHRcdFx0XHQuY2F0Y2gocmVqZWN0KTtcblxuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHJlc29sdmUobmV3ICg8dHlwZW9mIGhvLmZsdXguUm91dGVyPnRoaXMucm91dGVyKSgpKTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cblx0XHR9XG5cblx0XHRwcm90ZWN0ZWQgcHJvY2Vzc01hcCgpOiB2b2lkIHtcblx0XHRcdGlmKHR5cGVvZiB0aGlzLm1hcCA9PT0gJ2Jvb2xlYW4nKSB7XG5cdFx0XHRcdGlmKCF0aGlzLm1hcClcblx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHR0aGlzLm1hcCA9IHRoaXMubWFwRGVmYXVsdDtcblx0XHRcdH1cblxuXHRcdFx0Y29tcG9uZW50cy5mb3JFYWNoKGMgPT4ge1xuXHRcdFx0XHRoby5jb21wb25lbnRzLmNvbXBvbmVudHByb3ZpZGVyLm1hcHBpbmdbY10gPSB0aGlzLm1hcCArICdjb21wb25lbnRzLycgKyBjICsgJy8nICsgYyArICcuanMnO1xuXHRcdFx0fSk7XG5cblx0XHRcdGF0dHJpYnV0ZXMuZm9yRWFjaChhID0+IHtcblx0XHRcdFx0aG8uY29tcG9uZW50cy5hdHRyaWJ1dGVwcm92aWRlci5tYXBwaW5nW2FdID0gdGhpcy5tYXAgKyAnYXR0cmlidXRlcy8nICsgYSArICcvJyArIGEgKyAnLmpzJztcblx0XHRcdH0pO1xuXG5cdFx0XHRzdG9yZXMuZm9yRWFjaChzID0+IHtcblx0XHRcdFx0aG8uZmx1eC5zdG9yZXByb3ZpZGVyLm1hcHBpbmdbc10gPSB0aGlzLm1hcCArICdzdG9yZXMvJyArIHMgKyAnLycgKyBzICsgJy5qcyc7XG5cdFx0XHR9KTtcblx0XHR9XG5cblx0XHRwcm90ZWN0ZWQgcHJvY2Vzc0RpcigpOiB2b2lkIHtcblx0XHRcdGhvLmNvbXBvbmVudHMuZGlyID0gdGhpcy5kaXI7XG5cdFx0fVxuXG5cdFx0cHJvdGVjdGVkIHByb2Nlc3NNaW4oKTogdm9pZCB7XG5cdFx0XHRoby5jb21wb25lbnRzLmNvbXBvbmVudHByb3ZpZGVyLmluc3RhbmNlLnVzZU1pbiA9IHRoaXMubWluO1xuXHRcdFx0aG8uY29tcG9uZW50cy5hdHRyaWJ1dGVwcm92aWRlci5pbnN0YW5jZS51c2VNaW4gPSB0aGlzLm1pbjtcblx0XHRcdGhvLmZsdXguc3RvcmVwcm92aWRlci5pbnN0YW5jZS51c2VNaW4gPSB0aGlzLm1pbjtcblx0XHR9XG5cdH1cblxufVxuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9