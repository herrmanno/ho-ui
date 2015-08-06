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
                    if (!!componentprovider.mapping[name])
                        return componentprovider.mapping[name];
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
                        var src = _this.resolve(name);
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
                    if (!!attributeprovider.mapping[name])
                        return attributeprovider.mapping[name];
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
                        var src = _this.resolve(name);
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
                    if (!!storeprovider.mapping[name])
                        return storeprovider.mapping[name];
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
                        var src = _this.resolve(name);
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9zb3VyY2UvcHJvbWlzZS50cyIsIi9zb3VyY2Uvd2F0Y2gudHMiLCIvc291cmNlL2NvbXBvbmVudHNwcm92aWRlci50cyIsIi9zb3VyY2UvYXR0cmlidXRlLnRzIiwiL3NvdXJjZS9hdHRyaWJ1dGVwcm92aWRlci50cyIsIi9zb3VyY2UvcmVnaXN0cnkudHMiLCIvc291cmNlL21haW4udHMiLCIvc291cmNlL2h0bWxwcm92aWRlci50cyIsIi9zb3VyY2UvdGVtcC50cyIsIi9zb3VyY2UvcmVuZGVyZXIudHMiLCIvc291cmNlL3N0eWxlci50cyIsIi9zb3VyY2UvY29tcG9uZW50cy50cyIsIi9zb3VyY2Uvc3JjL3RzL2NhbGxiYWNraG9sZGVyLnRzIiwiL3NvdXJjZS9zcmMvdHMvc3RhdGUudHMiLCIvc291cmNlL3NyYy90cy9zdGF0ZXByb3ZpZGVyLnRzIiwiL3NvdXJjZS9zcmMvdHMvc3RvcmVwcm92aWRlci50cyIsIi9zb3VyY2Uvc3JjL3RzL3N0b3JlcmVnaXN0cnkudHMiLCIvc291cmNlL3NyYy90cy9zdG9yZS50cyIsIi9zb3VyY2Uvc3JjL3RzL3JvdXRlci50cyIsIi9zb3VyY2Uvc3JjL3RzL2Rpc3BhdGNoZXIudHMiLCIvc291cmNlL3NyYy90cy9mbHV4LnRzIiwiL3NvdXJjZS91aS50cyJdLCJuYW1lcyI6WyJobyIsImhvLnByb21pc2UiLCJoby5wcm9taXNlLlByb21pc2UiLCJoby5wcm9taXNlLlByb21pc2UuY29uc3RydWN0b3IiLCJoby5wcm9taXNlLlByb21pc2Uuc2V0IiwiaG8ucHJvbWlzZS5Qcm9taXNlLnJlc29sdmUiLCJoby5wcm9taXNlLlByb21pc2UuX3Jlc29sdmUiLCJoby5wcm9taXNlLlByb21pc2UucmVqZWN0IiwiaG8ucHJvbWlzZS5Qcm9taXNlLl9yZWplY3QiLCJoby5wcm9taXNlLlByb21pc2UudGhlbiIsImhvLnByb21pc2UuUHJvbWlzZS5jYXRjaCIsImhvLnByb21pc2UuUHJvbWlzZS5hbGwiLCJoby5wcm9taXNlLlByb21pc2UuY2hhaW4iLCJoby5wcm9taXNlLlByb21pc2UuY2hhaW4ubmV4dCIsImhvLnByb21pc2UuUHJvbWlzZS5jcmVhdGUiLCJoby53YXRjaCIsImhvLndhdGNoLndhdGNoIiwiaG8ud2F0Y2guV2F0Y2hlciIsImhvLndhdGNoLldhdGNoZXIuY29uc3RydWN0b3IiLCJoby53YXRjaC5XYXRjaGVyLndhdGNoIiwiaG8ud2F0Y2guV2F0Y2hlci5jb3B5IiwiaG8uY29tcG9uZW50cyIsImhvLmNvbXBvbmVudHMuY29tcG9uZW50cHJvdmlkZXIiLCJoby5jb21wb25lbnRzLmNvbXBvbmVudHByb3ZpZGVyLkNvbXBvbmVudFByb3ZpZGVyIiwiaG8uY29tcG9uZW50cy5jb21wb25lbnRwcm92aWRlci5Db21wb25lbnRQcm92aWRlci5jb25zdHJ1Y3RvciIsImhvLmNvbXBvbmVudHMuY29tcG9uZW50cHJvdmlkZXIuQ29tcG9uZW50UHJvdmlkZXIucmVzb2x2ZSIsImhvLmNvbXBvbmVudHMuY29tcG9uZW50cHJvdmlkZXIuQ29tcG9uZW50UHJvdmlkZXIuZ2V0Q29tcG9uZW50IiwiaG8uY29tcG9uZW50cy5jb21wb25lbnRwcm92aWRlci5Db21wb25lbnRQcm92aWRlci5nZXQiLCJoby5jb21wb25lbnRzLkF0dHJpYnV0ZSIsImhvLmNvbXBvbmVudHMuQXR0cmlidXRlLmNvbnN0cnVjdG9yIiwiaG8uY29tcG9uZW50cy5BdHRyaWJ1dGUuaW5pdCIsImhvLmNvbXBvbmVudHMuQXR0cmlidXRlLm5hbWUiLCJoby5jb21wb25lbnRzLkF0dHJpYnV0ZS51cGRhdGUiLCJoby5jb21wb25lbnRzLkF0dHJpYnV0ZS5nZXROYW1lIiwiaG8uY29tcG9uZW50cy5XYXRjaEF0dHJpYnV0ZSIsImhvLmNvbXBvbmVudHMuV2F0Y2hBdHRyaWJ1dGUuY29uc3RydWN0b3IiLCJoby5jb21wb25lbnRzLldhdGNoQXR0cmlidXRlLndhdGNoIiwiaG8uY29tcG9uZW50cy5XYXRjaEF0dHJpYnV0ZS5ldmFsIiwiaG8uY29tcG9uZW50cy5hdHRyaWJ1dGVwcm92aWRlciIsImhvLmNvbXBvbmVudHMuYXR0cmlidXRlcHJvdmlkZXIuQXR0cmlidXRlUHJvdmlkZXIiLCJoby5jb21wb25lbnRzLmF0dHJpYnV0ZXByb3ZpZGVyLkF0dHJpYnV0ZVByb3ZpZGVyLmNvbnN0cnVjdG9yIiwiaG8uY29tcG9uZW50cy5hdHRyaWJ1dGVwcm92aWRlci5BdHRyaWJ1dGVQcm92aWRlci5yZXNvbHZlIiwiaG8uY29tcG9uZW50cy5hdHRyaWJ1dGVwcm92aWRlci5BdHRyaWJ1dGVQcm92aWRlci5nZXRBdHRyaWJ1dGUiLCJoby5jb21wb25lbnRzLnJlZ2lzdHJ5IiwiaG8uY29tcG9uZW50cy5yZWdpc3RyeS5SZWdpc3RyeSIsImhvLmNvbXBvbmVudHMucmVnaXN0cnkuUmVnaXN0cnkuY29uc3RydWN0b3IiLCJoby5jb21wb25lbnRzLnJlZ2lzdHJ5LlJlZ2lzdHJ5LnJlZ2lzdGVyIiwiaG8uY29tcG9uZW50cy5yZWdpc3RyeS5SZWdpc3RyeS5ydW4iLCJoby5jb21wb25lbnRzLnJlZ2lzdHJ5LlJlZ2lzdHJ5LmluaXRDb21wb25lbnQiLCJoby5jb21wb25lbnRzLnJlZ2lzdHJ5LlJlZ2lzdHJ5LmluaXRFbGVtZW50IiwiaG8uY29tcG9uZW50cy5yZWdpc3RyeS5SZWdpc3RyeS5oYXNDb21wb25lbnQiLCJoby5jb21wb25lbnRzLnJlZ2lzdHJ5LlJlZ2lzdHJ5Lmhhc0F0dHJpYnV0ZSIsImhvLmNvbXBvbmVudHMucmVnaXN0cnkuUmVnaXN0cnkuZ2V0QXR0cmlidXRlIiwiaG8uY29tcG9uZW50cy5yZWdpc3RyeS5SZWdpc3RyeS5sb2FkQ29tcG9uZW50IiwiaG8uY29tcG9uZW50cy5yZWdpc3RyeS5SZWdpc3RyeS5sb2FkQXR0cmlidXRlIiwiaG8uY29tcG9uZW50cy5yZWdpc3RyeS5SZWdpc3RyeS5nZXRQYXJlbnRPZkNvbXBvbmVudCIsImhvLmNvbXBvbmVudHMucmVnaXN0cnkuUmVnaXN0cnkuZ2V0UGFyZW50T2ZBdHRyaWJ1dGUiLCJoby5jb21wb25lbnRzLnJlZ2lzdHJ5LlJlZ2lzdHJ5LmdldFBhcmVudE9mQ2xhc3MiLCJoby5jb21wb25lbnRzLnJ1biIsImhvLmNvbXBvbmVudHMucmVnaXN0ZXIiLCJoby5jb21wb25lbnRzLmh0bWxwcm92aWRlciIsImhvLmNvbXBvbmVudHMuaHRtbHByb3ZpZGVyLkh0bWxQcm92aWRlciIsImhvLmNvbXBvbmVudHMuaHRtbHByb3ZpZGVyLkh0bWxQcm92aWRlci5jb25zdHJ1Y3RvciIsImhvLmNvbXBvbmVudHMuaHRtbHByb3ZpZGVyLkh0bWxQcm92aWRlci5yZXNvbHZlIiwiaG8uY29tcG9uZW50cy5odG1scHJvdmlkZXIuSHRtbFByb3ZpZGVyLmdldEhUTUwiLCJoby5jb21wb25lbnRzLnRlbXAiLCJoby5jb21wb25lbnRzLnRlbXAuc2V0IiwiaG8uY29tcG9uZW50cy50ZW1wLmdldCIsImhvLmNvbXBvbmVudHMudGVtcC5jYWxsIiwiaG8uY29tcG9uZW50cy5yZW5kZXJlciIsImhvLmNvbXBvbmVudHMucmVuZGVyZXIuTm9kZSIsImhvLmNvbXBvbmVudHMucmVuZGVyZXIuTm9kZS5jb25zdHJ1Y3RvciIsImhvLmNvbXBvbmVudHMucmVuZGVyZXIuUmVuZGVyZXIiLCJoby5jb21wb25lbnRzLnJlbmRlcmVyLlJlbmRlcmVyLmNvbnN0cnVjdG9yIiwiaG8uY29tcG9uZW50cy5yZW5kZXJlci5SZW5kZXJlci5yZW5kZXIiLCJoby5jb21wb25lbnRzLnJlbmRlcmVyLlJlbmRlcmVyLnBhcnNlIiwiaG8uY29tcG9uZW50cy5yZW5kZXJlci5SZW5kZXJlci5yZW5kZXJSZXBlYXQiLCJoby5jb21wb25lbnRzLnJlbmRlcmVyLlJlbmRlcmVyLmRvbVRvU3RyaW5nIiwiaG8uY29tcG9uZW50cy5yZW5kZXJlci5SZW5kZXJlci5yZXBsIiwiaG8uY29tcG9uZW50cy5yZW5kZXJlci5SZW5kZXJlci5ldmFsdWF0ZSIsImhvLmNvbXBvbmVudHMucmVuZGVyZXIuUmVuZGVyZXIuZXZhbHVhdGVWYWx1ZSIsImhvLmNvbXBvbmVudHMucmVuZGVyZXIuUmVuZGVyZXIuZXZhbHVhdGVWYWx1ZUFuZE1vZGVsIiwiaG8uY29tcG9uZW50cy5yZW5kZXJlci5SZW5kZXJlci5ldmFsdWF0ZUV4cHJlc3Npb24iLCJoby5jb21wb25lbnRzLnJlbmRlcmVyLlJlbmRlcmVyLmV2YWx1YXRlRnVuY3Rpb24iLCJoby5jb21wb25lbnRzLnJlbmRlcmVyLlJlbmRlcmVyLmNvcHlOb2RlIiwiaG8uY29tcG9uZW50cy5yZW5kZXJlci5SZW5kZXJlci5pc1ZvaWQiLCJoby5jb21wb25lbnRzLnN0eWxlciIsImhvLmNvbXBvbmVudHMuc3R5bGVyLlN0eWxlciIsImhvLmNvbXBvbmVudHMuc3R5bGVyLlN0eWxlci5jb25zdHJ1Y3RvciIsImhvLmNvbXBvbmVudHMuc3R5bGVyLlN0eWxlci5hcHBseVN0eWxlIiwiaG8uY29tcG9uZW50cy5zdHlsZXIuU3R5bGVyLmFwcGx5U3R5bGVCbG9jayIsImhvLmNvbXBvbmVudHMuc3R5bGVyLlN0eWxlci5hcHBseVJ1bGUiLCJoby5jb21wb25lbnRzLnN0eWxlci5TdHlsZXIucGFyc2VTdHlsZSIsImhvLmNvbXBvbmVudHMuQ29tcG9uZW50IiwiaG8uY29tcG9uZW50cy5Db21wb25lbnQuY29uc3RydWN0b3IiLCJoby5jb21wb25lbnRzLkNvbXBvbmVudC5uYW1lIiwiaG8uY29tcG9uZW50cy5Db21wb25lbnQuZ2V0TmFtZSIsImhvLmNvbXBvbmVudHMuQ29tcG9uZW50LmdldFBhcmVudCIsImhvLmNvbXBvbmVudHMuQ29tcG9uZW50Ll9pbml0IiwiaG8uY29tcG9uZW50cy5Db21wb25lbnQuaW5pdCIsImhvLmNvbXBvbmVudHMuQ29tcG9uZW50LnVwZGF0ZSIsImhvLmNvbXBvbmVudHMuQ29tcG9uZW50LnJlbmRlciIsImhvLmNvbXBvbmVudHMuQ29tcG9uZW50LmluaXRTdHlsZSIsImhvLmNvbXBvbmVudHMuQ29tcG9uZW50LmluaXRIVE1MIiwiaG8uY29tcG9uZW50cy5Db21wb25lbnQuaW5pdFByb3BlcnRpZXMiLCJoby5jb21wb25lbnRzLkNvbXBvbmVudC5pbml0Q2hpbGRyZW4iLCJoby5jb21wb25lbnRzLkNvbXBvbmVudC5pbml0QXR0cmlidXRlcyIsImhvLmNvbXBvbmVudHMuQ29tcG9uZW50LmxvYWRSZXF1aXJlbWVudHMiLCJoby5jb21wb25lbnRzLkNvbXBvbmVudC5nZXRDb21wb25lbnQiLCJoby5mbHV4IiwiaG8uZmx1eC5DYWxsYmFja0hvbGRlciIsImhvLmZsdXguQ2FsbGJhY2tIb2xkZXIuY29uc3RydWN0b3IiLCJoby5mbHV4LkNhbGxiYWNrSG9sZGVyLnJlZ2lzdGVyIiwiaG8uZmx1eC5DYWxsYmFja0hvbGRlci51bnJlZ2lzdGVyIiwiaG8uZmx1eC5zdGF0ZXByb3ZpZGVyIiwiaG8uZmx1eC5zdGF0ZXByb3ZpZGVyLlN0YXRlUHJvdmlkZXIiLCJoby5mbHV4LnN0YXRlcHJvdmlkZXIuU3RhdGVQcm92aWRlci5jb25zdHJ1Y3RvciIsImhvLmZsdXguc3RhdGVwcm92aWRlci5TdGF0ZVByb3ZpZGVyLnJlc29sdmUiLCJoby5mbHV4LnN0YXRlcHJvdmlkZXIuU3RhdGVQcm92aWRlci5nZXRTdGF0ZXMiLCJoby5mbHV4LnN0b3JlcHJvdmlkZXIiLCJoby5mbHV4LnN0b3JlcHJvdmlkZXIuU3RvcmVQcm92aWRlciIsImhvLmZsdXguc3RvcmVwcm92aWRlci5TdG9yZVByb3ZpZGVyLmNvbnN0cnVjdG9yIiwiaG8uZmx1eC5zdG9yZXByb3ZpZGVyLlN0b3JlUHJvdmlkZXIucmVzb2x2ZSIsImhvLmZsdXguc3RvcmVwcm92aWRlci5TdG9yZVByb3ZpZGVyLmdldFN0b3JlIiwiaG8uZmx1eC5zdG9yZXByb3ZpZGVyLlN0b3JlUHJvdmlkZXIuZ2V0IiwiaG8uZmx1eC5TdG9yZXJlZ2lzdHJ5IiwiaG8uZmx1eC5TdG9yZXJlZ2lzdHJ5LmNvbnN0cnVjdG9yIiwiaG8uZmx1eC5TdG9yZXJlZ2lzdHJ5LnJlZ2lzdGVyIiwiaG8uZmx1eC5TdG9yZXJlZ2lzdHJ5LmdldCIsImhvLmZsdXguU3RvcmVyZWdpc3RyeS5sb2FkU3RvcmUiLCJoby5mbHV4LlN0b3JlcmVnaXN0cnkuZ2V0UGFyZW50T2ZTdG9yZSIsImhvLmZsdXguU3RvcmUiLCJoby5mbHV4LlN0b3JlLmNvbnN0cnVjdG9yIiwiaG8uZmx1eC5TdG9yZS5pbml0IiwiaG8uZmx1eC5TdG9yZS5uYW1lIiwiaG8uZmx1eC5TdG9yZS5yZWdpc3RlciIsImhvLmZsdXguU3RvcmUub24iLCJoby5mbHV4LlN0b3JlLmhhbmRsZSIsImhvLmZsdXguU3RvcmUuY2hhbmdlZCIsImhvLmZsdXguUm91dGVyIiwiaG8uZmx1eC5Sb3V0ZXIuY29uc3RydWN0b3IiLCJoby5mbHV4LlJvdXRlci5pbml0IiwiaG8uZmx1eC5Sb3V0ZXIuZ28iLCJoby5mbHV4LlJvdXRlci5pbml0U3RhdGVzIiwiaG8uZmx1eC5Sb3V0ZXIuZ2V0U3RhdGVGcm9tTmFtZSIsImhvLmZsdXguUm91dGVyLm9uU3RhdGVDaGFuZ2VSZXF1ZXN0ZWQiLCJoby5mbHV4LlJvdXRlci5vbkhhc2hDaGFuZ2UiLCJoby5mbHV4LlJvdXRlci5zZXRVcmwiLCJoby5mbHV4LlJvdXRlci5yZWdleEZyb21VcmwiLCJoby5mbHV4LlJvdXRlci5hcmdzRnJvbVVybCIsImhvLmZsdXguUm91dGVyLnN0YXRlRnJvbVVybCIsImhvLmZsdXguUm91dGVyLnVybEZyb21TdGF0ZSIsImhvLmZsdXguUm91dGVyLmVxdWFscyIsImhvLmZsdXguRGlzcGF0Y2hlciIsImhvLmZsdXguRGlzcGF0Y2hlci5jb25zdHJ1Y3RvciIsImhvLmZsdXguRGlzcGF0Y2hlci53YWl0Rm9yIiwiaG8uZmx1eC5EaXNwYXRjaGVyLmRpc3BhdGNoIiwiaG8uZmx1eC5EaXNwYXRjaGVyLmludm9rZUNhbGxiYWNrIiwiaG8uZmx1eC5EaXNwYXRjaGVyLnN0YXJ0RGlzcGF0Y2hpbmciLCJoby5mbHV4LkRpc3BhdGNoZXIuc3RvcERpc3BhdGNoaW5nIiwiaG8uZmx1eC5ydW4iLCJoby51aSIsImhvLnVpLnJ1biIsImhvLnVpLk9wdGlvbnMiLCJoby51aS5PcHRpb25zLmNvbnN0cnVjdG9yIiwiaG8udWkuT3B0aW9ucy5wcm9jZXNzIiwiaG8udWkuT3B0aW9ucy5wcm9jZXNzUm9vdCIsImhvLnVpLk9wdGlvbnMucHJvY2Vzc1JvdXRlciIsImhvLnVpLk9wdGlvbnMucHJvY2Vzc01hcCIsImhvLnVpLk9wdGlvbnMucHJvY2Vzc0RpciIsImhvLnVpLk9wdGlvbnMucHJvY2Vzc01pbiJdLCJtYXBwaW5ncyI6IkFBQUEsSUFBTyxFQUFFLENBK0tSO0FBL0tELFdBQU8sRUFBRTtJQUFDQSxJQUFBQSxPQUFPQSxDQStLaEJBO0lBL0tTQSxXQUFBQSxPQUFPQSxFQUFDQSxDQUFDQTtRQUVmQztZQUVJQyxpQkFBWUEsSUFBMkRBO2dCQWEvREMsU0FBSUEsR0FBUUEsU0FBU0EsQ0FBQ0E7Z0JBQ3RCQSxjQUFTQSxHQUFvQkEsU0FBU0EsQ0FBQ0E7Z0JBQ3ZDQSxhQUFRQSxHQUFvQkEsU0FBU0EsQ0FBQ0E7Z0JBRXZDQSxhQUFRQSxHQUFZQSxLQUFLQSxDQUFDQTtnQkFDMUJBLGFBQVFBLEdBQVlBLEtBQUtBLENBQUNBO2dCQUMxQkEsU0FBSUEsR0FBWUEsS0FBS0EsQ0FBQ0E7Z0JBRXJCQSxRQUFHQSxHQUFrQkEsU0FBU0EsQ0FBQ0E7Z0JBcEJuQ0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsT0FBT0EsSUFBSUEsS0FBS0EsVUFBVUEsQ0FBQ0E7b0JBQzNCQSxJQUFJQSxDQUFDQSxJQUFJQSxDQUNMQSxTQUFTQSxDQUFDQSxNQUFNQSxFQUNoQkEsVUFBU0EsR0FBTUE7d0JBQ1gsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQTtvQkFDckIsQ0FBQyxDQUFDQSxJQUFJQSxDQUFDQSxJQUFJQSxDQUFDQSxFQUNaQSxVQUFTQSxHQUFLQTt3QkFDVixJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO29CQUNyQixDQUFDLENBQUNBLElBQUlBLENBQUNBLElBQUlBLENBQUNBLENBQ2ZBLENBQUNBO1lBQ1ZBLENBQUNBO1lBWU9ELHFCQUFHQSxHQUFYQSxVQUFZQSxJQUFVQTtnQkFDbEJFLEVBQUVBLENBQUNBLENBQUNBLElBQUlBLENBQUNBLElBQUlBLENBQUNBO29CQUNWQSxNQUFNQSx3Q0FBd0NBLENBQUNBO2dCQUNuREEsSUFBSUEsQ0FBQ0EsSUFBSUEsR0FBR0EsSUFBSUEsQ0FBQ0E7WUFDckJBLENBQUNBO1lBRU1GLHlCQUFPQSxHQUFkQSxVQUFlQSxJQUFRQTtnQkFDbkJHLElBQUlBLENBQUNBLEdBQUdBLENBQUNBLElBQUlBLENBQUNBLENBQUNBO2dCQUNmQSxJQUFJQSxDQUFDQSxRQUFRQSxHQUFHQSxJQUFJQSxDQUFDQSxJQUFJQSxHQUFHQSxJQUFJQSxDQUFDQTtnQkFDakNBLEVBQUVBLENBQUNBLENBQUNBLE9BQU9BLElBQUlBLENBQUNBLFNBQVNBLEtBQUtBLFVBQVVBLENBQUNBLENBQUNBLENBQUNBO29CQUN2Q0EsSUFBSUEsQ0FBQ0EsUUFBUUEsRUFBRUEsQ0FBQ0E7Z0JBQ3BCQSxDQUFDQTtZQUNMQSxDQUFDQTtZQUVPSCwwQkFBUUEsR0FBaEJBO2dCQUNJSSxFQUFFQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxHQUFHQSxLQUFLQSxTQUFTQSxDQUFDQSxDQUFDQSxDQUFDQTtvQkFDekJBLElBQUlBLENBQUNBLEdBQUdBLEdBQUdBLElBQUlBLE9BQU9BLEVBQU9BLENBQUNBO2dCQUNsQ0EsQ0FBQ0E7Z0JBRURBLElBQUlBLENBQUNBLEdBQVFBLElBQUlBLENBQUNBLFNBQVNBLENBQUlBLElBQUlBLENBQUNBLElBQUlBLENBQUNBLENBQUNBO2dCQUUxQ0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsWUFBWUEsT0FBT0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7b0JBQzVCQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxJQUFJQSxDQUFDQSxHQUFHQSxDQUFDQSxPQUFPQSxDQUFDQSxJQUFJQSxDQUFDQSxJQUFJQSxDQUFDQSxHQUFHQSxDQUFDQSxFQUFFQSxJQUFJQSxDQUFDQSxHQUFHQSxDQUFDQSxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQSxJQUFJQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQSxDQUFDQTtnQkFDNUVBLENBQUNBO2dCQUNEQSxJQUFJQSxDQUFDQSxDQUFDQTtvQkFDRkEsSUFBSUEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsT0FBT0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7Z0JBQ3hCQSxDQUFDQTtZQUNMQSxDQUFDQTtZQUVNSix3QkFBTUEsR0FBYkEsVUFBY0EsSUFBUUE7Z0JBQ2xCSyxJQUFJQSxDQUFDQSxHQUFHQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQTtnQkFDZkEsSUFBSUEsQ0FBQ0EsUUFBUUEsR0FBR0EsSUFBSUEsQ0FBQ0EsSUFBSUEsR0FBR0EsSUFBSUEsQ0FBQ0E7Z0JBRWpDQSxFQUFFQSxDQUFDQSxDQUFDQSxPQUFPQSxJQUFJQSxDQUFDQSxRQUFRQSxLQUFLQSxVQUFVQSxDQUFDQSxDQUFDQSxDQUFDQTtvQkFDdENBLElBQUlBLENBQUNBLFFBQVFBLENBQUlBLElBQUlBLENBQUNBLElBQUlBLENBQUNBLENBQUNBO2dCQUNoQ0EsQ0FBQ0E7Z0JBRURBLEVBQUVBLENBQUNBLENBQUNBLElBQUlBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBLENBQUNBO29CQUNYQSxJQUFJQSxDQUFDQSxHQUFHQSxDQUFDQSxNQUFNQSxDQUFJQSxJQUFJQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQTtnQkFDbENBLENBQUNBO1lBQ0xBLENBQUNBO1lBRU9MLHlCQUFPQSxHQUFmQTtnQkFDSU0sRUFBRUEsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsR0FBR0EsS0FBS0EsU0FBU0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7b0JBQ3pCQSxJQUFJQSxDQUFDQSxHQUFHQSxHQUFHQSxJQUFJQSxPQUFPQSxFQUFPQSxDQUFDQTtnQkFDbENBLENBQUNBO2dCQUVEQSxJQUFJQSxDQUFDQSxRQUFRQSxDQUFJQSxJQUFJQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQTtnQkFDNUJBLElBQUlBLENBQUNBLEdBQUdBLENBQUNBLE1BQU1BLENBQUlBLElBQUlBLENBQUNBLElBQUlBLENBQUNBLENBQUNBO1lBQ2xDQSxDQUFDQTtZQUVNTixzQkFBSUEsR0FBWEEsVUFBWUEsR0FBa0JBLEVBQUVBLEdBQW1CQTtnQkFDL0NPLEVBQUVBLENBQUNBLENBQUNBLElBQUlBLENBQUNBLEdBQUdBLEtBQUtBLFNBQVNBLENBQUNBLENBQUNBLENBQUNBO29CQUN6QkEsSUFBSUEsQ0FBQ0EsR0FBR0EsR0FBR0EsSUFBSUEsT0FBT0EsRUFBT0EsQ0FBQ0E7Z0JBQ2xDQSxDQUFDQTtnQkFFREEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsR0FBR0EsSUFBSUEsT0FBT0EsR0FBR0EsS0FBS0EsVUFBVUEsQ0FBQ0E7b0JBQ2pDQSxJQUFJQSxDQUFDQSxTQUFTQSxHQUFHQSxHQUFHQSxDQUFDQTtnQkFFekJBLEVBQUVBLENBQUNBLENBQUNBLEdBQUdBLElBQUlBLE9BQU9BLEdBQUdBLEtBQUtBLFVBQVVBLENBQUNBO29CQUNqQ0EsSUFBSUEsQ0FBQ0EsUUFBUUEsR0FBR0EsR0FBR0EsQ0FBQ0E7Z0JBRXhCQSxFQUFFQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxRQUFRQSxDQUFDQSxDQUFDQSxDQUFDQTtvQkFDaEJBLElBQUlBLENBQUNBLFFBQVFBLEVBQUVBLENBQUNBO2dCQUNwQkEsQ0FBQ0E7Z0JBRURBLEVBQUVBLENBQUNBLENBQUNBLElBQUlBLENBQUNBLFFBQVFBLENBQUNBLENBQUNBLENBQUNBO29CQUNoQkEsSUFBSUEsQ0FBQ0EsT0FBT0EsRUFBRUEsQ0FBQ0E7Z0JBQ25CQSxDQUFDQTtnQkFFREEsTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsR0FBR0EsQ0FBQ0E7WUFDcEJBLENBQUNBO1lBRU1QLHVCQUFLQSxHQUFaQSxVQUFhQSxFQUFpQkE7Z0JBQzFCUSxJQUFJQSxDQUFDQSxRQUFRQSxHQUFHQSxFQUFFQSxDQUFDQTtnQkFFbkJBLEVBQUVBLENBQUNBLENBQUNBLElBQUlBLENBQUNBLFFBQVFBLENBQUNBO29CQUNkQSxJQUFJQSxDQUFDQSxPQUFPQSxFQUFFQSxDQUFDQTtZQUN2QkEsQ0FBQ0E7WUFFTVIsV0FBR0EsR0FBVkEsVUFBV0EsR0FBNkJBO2dCQUNwQ1MsSUFBSUEsQ0FBQ0EsR0FBR0EsSUFBSUEsT0FBT0EsRUFBRUEsQ0FBQ0E7Z0JBRXRCQSxJQUFJQSxJQUFJQSxHQUFHQSxFQUFFQSxDQUFDQTtnQkFFZEEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsTUFBTUEsS0FBS0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7b0JBQ25CQSxDQUFDQSxDQUFDQSxPQUFPQSxFQUFFQSxDQUFDQTtnQkFDaEJBLENBQUNBO2dCQUFDQSxJQUFJQSxDQUFDQSxDQUFDQTtvQkFDSkEsR0FBR0EsQ0FBQ0EsT0FBT0EsQ0FBQ0EsVUFBQ0EsSUFBSUEsRUFBRUEsS0FBS0E7d0JBQ3BCQSxJQUFJQTs2QkFDQ0EsSUFBSUEsQ0FBQ0EsVUFBU0EsQ0FBQ0E7NEJBQ2hCLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7Z0NBQ1AsTUFBTSxDQUFDOzRCQUVYLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7NEJBQ2hCLElBQUksV0FBVyxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUMsVUFBUyxLQUFLLEVBQUUsRUFBRTtnQ0FDM0MsTUFBTSxDQUFDLEtBQUssSUFBSSxFQUFFLENBQUMsUUFBUSxDQUFDOzRCQUNoQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7NEJBQ1QsRUFBRSxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQztnQ0FDZCxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDOzRCQUNwQixDQUFDO3dCQUVMLENBQUMsQ0FBQ0E7NkJBQ0dBLEtBQUtBLENBQUNBLFVBQVNBLEdBQUdBOzRCQUNuQixDQUFDLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO3dCQUNsQixDQUFDLENBQUNBLENBQUNBO29CQUNQQSxDQUFDQSxDQUFDQSxDQUFDQTtnQkFDUEEsQ0FBQ0E7Z0JBRURBLE1BQU1BLENBQUNBLENBQUNBLENBQUNBO1lBQ2JBLENBQUNBO1lBRU1ULGFBQUtBLEdBQVpBLFVBQWFBLEdBQTZCQTtnQkFDdENVLElBQUlBLENBQUNBLEdBQXNCQSxJQUFJQSxPQUFPQSxFQUFFQSxDQUFDQTtnQkFDekNBLElBQUlBLElBQUlBLEdBQWVBLEVBQUVBLENBQUNBO2dCQUUxQkE7b0JBQ0lDLEVBQUVBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLElBQUlBLENBQUNBO3dCQUNQQSxNQUFNQSxDQUFDQTtvQkFFWEEsSUFBSUEsQ0FBQ0EsR0FBc0JBLEdBQUdBLENBQUNBLE1BQU1BLEdBQUdBLEdBQUdBLENBQUNBLEtBQUtBLEVBQUVBLEdBQUdBLENBQUNBLENBQUNBO29CQUN4REEsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FDRkEsVUFBQ0EsTUFBTUE7d0JBQ0hBLElBQUlBLENBQUNBLElBQUlBLENBQUNBLE1BQU1BLENBQUNBLENBQUNBO3dCQUNsQkEsSUFBSUEsRUFBRUEsQ0FBQ0E7b0JBQ1hBLENBQUNBLEVBQ0RBLFVBQUNBLEdBQUdBO3dCQUNBQSxDQUFDQSxDQUFDQSxNQUFNQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQTtvQkFDbEJBLENBQUNBLENBQ0FBLENBQUNBO2dCQUNWQSxDQUFDQTtnQkFFREQsSUFBSUEsRUFBRUEsQ0FBQ0E7Z0JBRVBBLE1BQU1BLENBQUNBLENBQUNBLENBQUNBO1lBQ2JBLENBQUNBO1lBRU1WLGNBQU1BLEdBQWJBLFVBQWNBLEdBQVFBO2dCQUNsQlksRUFBRUEsQ0FBQ0EsQ0FBQ0EsR0FBR0EsWUFBWUEsT0FBT0EsQ0FBQ0E7b0JBQ3ZCQSxNQUFNQSxDQUFDQSxHQUFHQSxDQUFDQTtnQkFDZkEsSUFBSUEsQ0FBQ0EsQ0FBQ0E7b0JBQ0ZBLElBQUlBLENBQUNBLEdBQUdBLElBQUlBLE9BQU9BLEVBQUVBLENBQUNBO29CQUN0QkEsQ0FBQ0EsQ0FBQ0EsT0FBT0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0E7b0JBQ2ZBLE1BQU1BLENBQUNBLENBQUNBLENBQUNBO2dCQUNiQSxDQUFDQTtZQUNMQSxDQUFDQTtZQUNMWixjQUFDQTtRQUFEQSxDQTNLQUQsQUEyS0NDLElBQUFEO1FBM0tZQSxlQUFPQSxVQTJLbkJBLENBQUFBO0lBRUxBLENBQUNBLEVBL0tTRCxPQUFPQSxHQUFQQSxVQUFPQSxLQUFQQSxVQUFPQSxRQStLaEJBO0FBQURBLENBQUNBLEVBL0tNLEVBQUUsS0FBRixFQUFFLFFBK0tSO0FDektELElBQU8sRUFBRSxDQStDUjtBQS9DRCxXQUFPLEVBQUU7SUFBQ0EsSUFBQUEsS0FBS0EsQ0ErQ2RBO0lBL0NTQSxXQUFBQSxPQUFLQSxFQUFDQSxDQUFDQTtRQUloQmUsZUFBc0JBLEdBQVFBLEVBQUVBLElBQVlBLEVBQUVBLE9BQWdCQTtZQUM3REMsSUFBSUEsT0FBT0EsQ0FBQ0EsR0FBR0EsRUFBRUEsSUFBSUEsRUFBRUEsT0FBT0EsQ0FBQ0EsQ0FBQ0E7UUFDakNBLENBQUNBO1FBRmVELGFBQUtBLFFBRXBCQSxDQUFBQTtRQUVEQTtZQUlDRSxpQkFBb0JBLEdBQVFBLEVBQVVBLElBQVlBLEVBQVVBLE9BQWdCQTtnQkFKN0VDLGlCQXFDQ0E7Z0JBakNvQkEsUUFBR0EsR0FBSEEsR0FBR0EsQ0FBS0E7Z0JBQVVBLFNBQUlBLEdBQUpBLElBQUlBLENBQVFBO2dCQUFVQSxZQUFPQSxHQUFQQSxPQUFPQSxDQUFTQTtnQkFDM0VBLElBQUlBLENBQUNBLE1BQU1BLEdBQUdBLElBQUlBLENBQUNBLElBQUlBLENBQUNBLEdBQUdBLENBQUNBLElBQUlBLENBQUNBLENBQUNBLENBQUNBO2dCQUVuQ0EsSUFBSUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsVUFBQUEsU0FBU0E7b0JBQ25CQSxFQUFFQSxDQUFBQSxDQUFDQSxLQUFJQSxDQUFDQSxNQUFNQSxLQUFLQSxHQUFHQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTt3QkFDOUJBLEtBQUlBLENBQUNBLE9BQU9BLENBQUNBLElBQUlBLENBQUNBLElBQUlBLEVBQUVBLEdBQUdBLEVBQUVBLElBQUlBLEVBQUVBLEtBQUlBLENBQUNBLE1BQU1BLEVBQUVBLEdBQUdBLENBQUNBLElBQUlBLENBQUNBLEVBQUVBLFNBQVNBLENBQUNBLENBQUNBO3dCQUN0RUEsS0FBSUEsQ0FBQ0EsTUFBTUEsR0FBR0EsS0FBSUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7b0JBQ3BDQSxDQUFDQTtnQkFDRkEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFDSkEsQ0FBQ0E7WUFFT0QsdUJBQUtBLEdBQWJBLFVBQWNBLEVBQTJCQTtnQkFDeENFLElBQUlBLEVBQUVBLEdBQ05BLE1BQU1BLENBQUNBLHFCQUFxQkE7b0JBQzFCQSxNQUFNQSxDQUFDQSwyQkFBMkJBO29CQUNsQ0EsTUFBTUEsQ0FBQ0Esd0JBQXdCQTtvQkFDL0JBLE1BQU1BLENBQUNBLHNCQUFzQkE7b0JBQzdCQSxNQUFNQSxDQUFDQSx1QkFBdUJBO29CQUM5QkEsVUFBU0EsUUFBa0JBO3dCQUM1QixNQUFNLENBQUMsVUFBVSxDQUFDLFFBQVEsRUFBRSxJQUFJLEdBQUcsRUFBRSxDQUFDLENBQUM7b0JBQ3RDLENBQUMsQ0FBQ0E7Z0JBRUpBLElBQUlBLElBQUlBLEdBQUdBLFVBQUNBLEVBQVVBO29CQUNyQkEsRUFBRUEsQ0FBQ0EsRUFBRUEsQ0FBQ0EsQ0FBQ0E7b0JBQ1BBLEVBQUVBLENBQUNBLElBQUlBLENBQUNBLENBQUNBO2dCQUNWQSxDQUFDQSxDQUFBQTtnQkFFREEsRUFBRUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0E7WUFDVkEsQ0FBQ0E7WUFFT0Ysc0JBQUlBLEdBQVpBLFVBQWFBLEdBQVFBO2dCQUNwQkcsTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsU0FBU0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFDeENBLENBQUNBO1lBQ0ZILGNBQUNBO1FBQURBLENBckNBRixBQXFDQ0UsSUFBQUY7SUFFRkEsQ0FBQ0EsRUEvQ1NmLEtBQUtBLEdBQUxBLFFBQUtBLEtBQUxBLFFBQUtBLFFBK0NkQTtBQUFEQSxDQUFDQSxFQS9DTSxFQUFFLEtBQUYsRUFBRSxRQStDUjtBQ3JERCxJQUFPLEVBQUUsQ0FxRFI7QUFyREQsV0FBTyxFQUFFO0lBQUNBLElBQUFBLFVBQVVBLENBcURuQkE7SUFyRFNBLFdBQUFBLFVBQVVBO1FBQUNxQixJQUFBQSxpQkFBaUJBLENBcURyQ0E7UUFyRG9CQSxXQUFBQSxpQkFBaUJBLEVBQUNBLENBQUNBO1lBQ3BDQyxJQUFPQSxPQUFPQSxHQUFHQSxFQUFFQSxDQUFDQSxPQUFPQSxDQUFDQSxPQUFPQSxDQUFDQTtZQUV6QkEseUJBQU9BLEdBQTJCQSxFQUFFQSxDQUFDQTtZQUVoREE7Z0JBQUFDO29CQUVJQyxXQUFNQSxHQUFZQSxLQUFLQSxDQUFDQTtnQkEwQzVCQSxDQUFDQTtnQkF4Q0dELG1DQUFPQSxHQUFQQSxVQUFRQSxJQUFZQTtvQkFDaEJFLEVBQUVBLENBQUFBLENBQUNBLENBQUNBLENBQUNBLHlCQUFPQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQTt3QkFDZkEsTUFBTUEsQ0FBQ0EseUJBQU9BLENBQUNBLElBQUlBLENBQUNBLENBQUNBO29CQUV6QkEsRUFBRUEsQ0FBQUEsQ0FBQ0EsRUFBRUEsQ0FBQ0EsVUFBVUEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7d0JBQ25CQSxJQUFJQSxJQUFJQSxHQUFHQSxHQUFHQSxJQUFJQSxDQUFDQSxLQUFLQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQSxHQUFHQSxFQUFFQSxDQUFDQTtvQkFDeENBLENBQUNBO29CQUVEQSxJQUFJQSxHQUFHQSxJQUFJQSxDQUFDQSxLQUFLQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQTtvQkFFakNBLE1BQU1BLENBQUNBLElBQUlBLENBQUNBLE1BQU1BO3dCQUNkQSxnQkFBY0EsSUFBSUEsWUFBU0E7d0JBQzNCQSxnQkFBY0EsSUFBSUEsUUFBS0EsQ0FBQ0E7Z0JBQ2hDQSxDQUFDQTtnQkFFREYsd0NBQVlBLEdBQVpBLFVBQWFBLElBQVlBO29CQUF6QkcsaUJBZUNBO29CQWRHQSxNQUFNQSxDQUFDQSxJQUFJQSxPQUFPQSxDQUF3QkEsVUFBQ0EsT0FBT0EsRUFBRUEsTUFBTUE7d0JBQ3REQSxJQUFJQSxHQUFHQSxHQUFHQSxLQUFJQSxDQUFDQSxPQUFPQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQTt3QkFDN0JBLElBQUlBLE1BQU1BLEdBQUdBLFFBQVFBLENBQUNBLGFBQWFBLENBQUNBLFFBQVFBLENBQUNBLENBQUNBO3dCQUM5Q0EsTUFBTUEsQ0FBQ0EsTUFBTUEsR0FBR0E7NEJBQ1osQUFDQSxtQ0FEbUM7NEJBQ25DLEVBQUUsQ0FBQSxDQUFDLE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxVQUFVLENBQUM7Z0NBQ3BDLE9BQU8sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7NEJBQzVCLElBQUk7Z0NBQ0EsTUFBTSxDQUFDLG1DQUFpQyxJQUFNLENBQUMsQ0FBQTt3QkFDdkQsQ0FBQyxDQUFDQSxJQUFJQSxDQUFDQSxLQUFJQSxDQUFDQSxDQUFDQTt3QkFDYkEsTUFBTUEsQ0FBQ0EsR0FBR0EsR0FBR0EsR0FBR0EsQ0FBQ0E7d0JBQ2pCQSxRQUFRQSxDQUFDQSxvQkFBb0JBLENBQUNBLE1BQU1BLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLFdBQVdBLENBQUNBLE1BQU1BLENBQUNBLENBQUNBO29CQUNqRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7Z0JBRVBBLENBQUNBO2dCQUVPSCwrQkFBR0EsR0FBWEEsVUFBWUEsSUFBWUE7b0JBQ3BCSSxJQUFJQSxDQUFDQSxHQUFRQSxNQUFNQSxDQUFDQTtvQkFDcEJBLElBQUlBLENBQUNBLEtBQUtBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBLE9BQU9BLENBQUNBLFVBQUNBLElBQUlBO3dCQUN6QkEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0E7b0JBQ2hCQSxDQUFDQSxDQUFDQSxDQUFDQTtvQkFDSEEsTUFBTUEsQ0FBbUJBLENBQUNBLENBQUNBO2dCQUMvQkEsQ0FBQ0E7Z0JBRUxKLHdCQUFDQTtZQUFEQSxDQTVDQUQsQUE0Q0NDLElBQUFEO1lBNUNZQSxtQ0FBaUJBLG9CQTRDN0JBLENBQUFBO1lBRVVBLDBCQUFRQSxHQUFHQSxJQUFJQSxpQkFBaUJBLEVBQUVBLENBQUNBO1FBRWxEQSxDQUFDQSxFQXJEb0JELGlCQUFpQkEsR0FBakJBLDRCQUFpQkEsS0FBakJBLDRCQUFpQkEsUUFxRHJDQTtJQUFEQSxDQUFDQSxFQXJEU3JCLFVBQVVBLEdBQVZBLGFBQVVBLEtBQVZBLGFBQVVBLFFBcURuQkE7QUFBREEsQ0FBQ0EsRUFyRE0sRUFBRSxLQUFGLEVBQUUsUUFxRFI7QUNyREQsNEVBQTRFO0FBQzVFLDJFQUEyRTs7Ozs7OztBQUUzRSxJQUFPLEVBQUUsQ0E4RVI7QUE5RUQsV0FBTyxFQUFFO0lBQUNBLElBQUFBLFVBQVVBLENBOEVuQkE7SUE5RVNBLFdBQUFBLFVBQVVBLEVBQUNBLENBQUNBO1FBSXJCcUIsQUFJQUE7OztVQURFQTs7WUFPRE8sbUJBQVlBLE9BQW9CQSxFQUFFQSxLQUFjQTtnQkFDL0NDLElBQUlBLENBQUNBLE9BQU9BLEdBQUdBLE9BQU9BLENBQUNBO2dCQUN2QkEsSUFBSUEsQ0FBQ0EsU0FBU0EsR0FBR0Esb0JBQVNBLENBQUNBLFlBQVlBLENBQUNBLE9BQU9BLENBQUNBLENBQUNBO2dCQUNqREEsSUFBSUEsQ0FBQ0EsS0FBS0EsR0FBR0EsS0FBS0EsQ0FBQ0E7Z0JBRW5CQSxJQUFJQSxDQUFDQSxJQUFJQSxFQUFFQSxDQUFDQTtZQUNiQSxDQUFDQTtZQUVTRCx3QkFBSUEsR0FBZEEsY0FBd0JFLENBQUNBO1lBRXpCRixzQkFBSUEsMkJBQUlBO3FCQUFSQTtvQkFDQ0csTUFBTUEsQ0FBQ0EsU0FBU0EsQ0FBQ0EsT0FBT0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0E7Z0JBQ2hDQSxDQUFDQTs7O2VBQUFIO1lBR01BLDBCQUFNQSxHQUFiQTtZQUVBSSxDQUFDQTtZQUdNSixpQkFBT0EsR0FBZEEsVUFBZUEsS0FBbUNBO2dCQUN4Q0ssRUFBRUEsQ0FBQUEsQ0FBQ0EsS0FBS0EsWUFBWUEsU0FBU0EsQ0FBQ0E7b0JBQzFCQSxNQUFNQSxDQUFDQSxLQUFLQSxDQUFDQSxXQUFXQSxDQUFDQSxRQUFRQSxFQUFFQSxDQUFDQSxLQUFLQSxDQUFDQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtnQkFDekRBLElBQUlBO29CQUNBQSxNQUFNQSxDQUFDQSxLQUFLQSxDQUFDQSxRQUFRQSxFQUFFQSxDQUFDQSxLQUFLQSxDQUFDQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtZQUNqREEsQ0FBQ0E7WUFDUkwsZ0JBQUNBO1FBQURBLENBaENBUCxBQWdDQ08sSUFBQVA7UUFoQ1lBLG9CQUFTQSxZQWdDckJBLENBQUFBO1FBRURBO1lBQW9DYSxrQ0FBU0E7WUFJNUNBLHdCQUFZQSxPQUFvQkEsRUFBRUEsS0FBY0E7Z0JBQy9DQyxrQkFBTUEsT0FBT0EsRUFBRUEsS0FBS0EsQ0FBQ0EsQ0FBQ0E7Z0JBSGJBLE1BQUNBLEdBQVdBLFVBQVVBLENBQUNBO2dCQUtoQ0EsSUFBSUEsQ0FBQ0EsR0FBVUEsSUFBSUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsS0FBS0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsSUFBSUEsRUFBRUEsQ0FBQ0E7Z0JBQzlDQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxVQUFTQSxDQUFDQTtvQkFDZixDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLE1BQU0sR0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDNUIsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDZixDQUFDLENBQUNBLElBQUlBLENBQUNBLElBQUlBLENBQUNBLENBQUNBLENBQUNBO2dCQUNkQSxJQUFJQSxDQUFDQSxLQUFLQSxHQUFHQSxJQUFJQSxDQUFDQSxLQUFLQSxDQUFDQSxPQUFPQSxDQUFDQSxJQUFJQSxFQUFFQSxFQUFFQSxDQUFDQSxDQUFDQTtZQUMzQ0EsQ0FBQ0E7WUFHU0QsOEJBQUtBLEdBQWZBLFVBQWdCQSxJQUFZQTtnQkFDM0JFLElBQUlBLE9BQU9BLEdBQUdBLElBQUlBLENBQUNBLEtBQUtBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBO2dCQUM5QkEsSUFBSUEsSUFBSUEsR0FBR0EsT0FBT0EsQ0FBQ0EsR0FBR0EsRUFBRUEsQ0FBQ0E7Z0JBQ3pCQSxJQUFJQSxHQUFHQSxHQUFHQSxJQUFJQSxDQUFDQSxTQUFTQSxDQUFDQTtnQkFFekJBLE9BQU9BLENBQUNBLEdBQUdBLENBQUNBLFVBQUNBLElBQUlBO29CQUNoQkEsR0FBR0EsR0FBR0EsR0FBR0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0E7Z0JBQ2pCQSxDQUFDQSxDQUFDQSxDQUFDQTtnQkFFSEEsRUFBRUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsS0FBS0EsQ0FBQ0EsR0FBR0EsRUFBRUEsSUFBSUEsRUFBRUEsSUFBSUEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFDbkRBLENBQUNBO1lBRVNGLDZCQUFJQSxHQUFkQSxVQUFlQSxJQUFZQTtnQkFDMUJHLElBQUlBLEtBQUtBLEdBQUdBLElBQUlBLENBQUNBLFNBQVNBLENBQUNBO2dCQUMzQkEsS0FBS0EsR0FBR0EsSUFBSUEsUUFBUUEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsQ0FBQ0EsUUFBUUEsRUFBRUEsRUFBRUEsU0FBU0EsR0FBR0EsSUFBSUEsQ0FBQ0E7cUJBQ25FQSxLQUFLQSxDQUFDQSxJQUFJQSxFQUFFQSxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQSxLQUFLQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxVQUFDQSxDQUFDQSxJQUFNQSxNQUFNQSxDQUFDQSxLQUFLQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFBQSxDQUFBQSxDQUFDQSxDQUFDQSxDQUFFQSxDQUFDQTtnQkFDakVBLE1BQU1BLENBQUNBLEtBQUtBLENBQUNBO1lBQ2RBLENBQUNBO1lBRUZILHFCQUFDQTtRQUFEQSxDQW5DQWIsQUFtQ0NhLEVBbkNtQ2IsU0FBU0EsRUFtQzVDQTtRQW5DWUEseUJBQWNBLGlCQW1DMUJBLENBQUFBO0lBQ0ZBLENBQUNBLEVBOUVTckIsVUFBVUEsR0FBVkEsYUFBVUEsS0FBVkEsYUFBVUEsUUE4RW5CQTtBQUFEQSxDQUFDQSxFQTlFTSxFQUFFLEtBQUYsRUFBRSxRQThFUjtBQ2pGRCxzQ0FBc0M7QUFFdEMsSUFBTyxFQUFFLENBOENSO0FBOUNELFdBQU8sRUFBRTtJQUFDQSxJQUFBQSxVQUFVQSxDQThDbkJBO0lBOUNTQSxXQUFBQSxVQUFVQTtRQUFDcUIsSUFBQUEsaUJBQWlCQSxDQThDckNBO1FBOUNvQkEsV0FBQUEsaUJBQWlCQSxFQUFDQSxDQUFDQTtZQUNwQ2lCLElBQU9BLE9BQU9BLEdBQUdBLEVBQUVBLENBQUNBLE9BQU9BLENBQUNBLE9BQU9BLENBQUNBO1lBRXpCQSx5QkFBT0EsR0FBMkJBLEVBQUVBLENBQUNBO1lBRWhEQTtnQkFBQUM7b0JBRUlDLFdBQU1BLEdBQVlBLEtBQUtBLENBQUNBO2dCQW1DNUJBLENBQUNBO2dCQWhDR0QsbUNBQU9BLEdBQVBBLFVBQVFBLElBQVlBO29CQUNoQkUsRUFBRUEsQ0FBQUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EseUJBQU9BLENBQUNBLElBQUlBLENBQUNBLENBQUNBO3dCQUNmQSxNQUFNQSxDQUFDQSx5QkFBT0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0E7b0JBRXpCQSxFQUFFQSxDQUFBQSxDQUFDQSxFQUFFQSxDQUFDQSxVQUFVQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQSxDQUFDQTt3QkFDbkJBLElBQUlBLElBQUlBLEdBQUdBLEdBQUdBLElBQUlBLENBQUNBLEtBQUtBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBLEdBQUdBLEVBQUVBLENBQUNBO29CQUN4Q0EsQ0FBQ0E7b0JBRURBLElBQUlBLEdBQUdBLElBQUlBLENBQUNBLEtBQUtBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBLElBQUlBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBO29CQUVqQ0EsTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsTUFBTUE7d0JBQ2RBLGdCQUFjQSxJQUFJQSxZQUFTQTt3QkFDM0JBLGdCQUFjQSxJQUFJQSxRQUFLQSxDQUFDQTtnQkFDaENBLENBQUNBO2dCQUVERix3Q0FBWUEsR0FBWkEsVUFBYUEsSUFBWUE7b0JBQXpCRyxpQkFlQ0E7b0JBZEdBLE1BQU1BLENBQUNBLElBQUlBLE9BQU9BLENBQXdCQSxVQUFDQSxPQUFPQSxFQUFFQSxNQUFNQTt3QkFDdERBLElBQUlBLEdBQUdBLEdBQUdBLEtBQUlBLENBQUNBLE9BQU9BLENBQUNBLElBQUlBLENBQUNBLENBQUNBO3dCQUM3QkEsSUFBSUEsTUFBTUEsR0FBR0EsUUFBUUEsQ0FBQ0EsYUFBYUEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsQ0FBQ0E7d0JBQzlDQSxNQUFNQSxDQUFDQSxNQUFNQSxHQUFHQTs0QkFDWixBQUNBLG1DQURtQzs0QkFDbkMsRUFBRSxDQUFBLENBQUMsT0FBTyxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssVUFBVSxDQUFDO2dDQUNsQyxPQUFPLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7NEJBQzFCLElBQUk7Z0NBQ0EsTUFBTSxDQUFDLG1DQUFpQyxJQUFNLENBQUMsQ0FBQTt3QkFDdkQsQ0FBQyxDQUFDQTt3QkFDRkEsTUFBTUEsQ0FBQ0EsR0FBR0EsR0FBR0EsR0FBR0EsQ0FBQ0E7d0JBQ2pCQSxRQUFRQSxDQUFDQSxvQkFBb0JBLENBQUNBLE1BQU1BLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLFdBQVdBLENBQUNBLE1BQU1BLENBQUNBLENBQUNBO29CQUNqRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7Z0JBRVBBLENBQUNBO2dCQUVMSCx3QkFBQ0E7WUFBREEsQ0FyQ0FELEFBcUNDQyxJQUFBRDtZQXJDWUEsbUNBQWlCQSxvQkFxQzdCQSxDQUFBQTtZQUVVQSwwQkFBUUEsR0FBR0EsSUFBSUEsaUJBQWlCQSxFQUFFQSxDQUFDQTtRQUVsREEsQ0FBQ0EsRUE5Q29CakIsaUJBQWlCQSxHQUFqQkEsNEJBQWlCQSxLQUFqQkEsNEJBQWlCQSxRQThDckNBO0lBQURBLENBQUNBLEVBOUNTckIsVUFBVUEsR0FBVkEsYUFBVUEsS0FBVkEsYUFBVUEsUUE4Q25CQTtBQUFEQSxDQUFDQSxFQTlDTSxFQUFFLEtBQUYsRUFBRSxRQThDUjtBQ2hERCwrQ0FBK0M7QUFDL0MsOENBQThDO0FBRTlDLElBQU8sRUFBRSxDQStKUjtBQS9KRCxXQUFPLEVBQUU7SUFBQ0EsSUFBQUEsVUFBVUEsQ0ErSm5CQTtJQS9KU0EsV0FBQUEsVUFBVUE7UUFBQ3FCLElBQUFBLFFBQVFBLENBK0o1QkE7UUEvSm9CQSxXQUFBQSxRQUFRQSxFQUFDQSxDQUFDQTtZQUMzQnNCLElBQU9BLE9BQU9BLEdBQUdBLEVBQUVBLENBQUNBLE9BQU9BLENBQUNBLE9BQU9BLENBQUNBO1lBRXBDQTtnQkFBQUM7b0JBRVlDLGVBQVVBLEdBQTRCQSxFQUFFQSxDQUFDQTtvQkFDekNBLGVBQVVBLEdBQTRCQSxFQUFFQSxDQUFDQTtnQkFzSnJEQSxDQUFDQTtnQkFuSlVELDJCQUFRQSxHQUFmQSxVQUFnQkEsRUFBdUNBO29CQUNuREUsRUFBRUEsQ0FBQUEsQ0FBQ0EsRUFBRUEsQ0FBQ0EsU0FBU0EsWUFBWUEsb0JBQVNBLENBQUNBLENBQUNBLENBQUNBO3dCQUNuQ0EsSUFBSUEsQ0FBQ0EsVUFBVUEsQ0FBQ0EsSUFBSUEsQ0FBbUJBLEVBQUVBLENBQUNBLENBQUNBO3dCQUMzQ0EsUUFBUUEsQ0FBQ0EsYUFBYUEsQ0FBQ0Esb0JBQVNBLENBQUNBLE9BQU9BLENBQW1CQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQTtvQkFDcEVBLENBQUNBO29CQUNEQSxJQUFJQSxDQUFDQSxFQUFFQSxDQUFBQSxDQUFDQSxFQUFFQSxDQUFDQSxTQUFTQSxZQUFZQSxvQkFBU0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7d0JBQ3hDQSxJQUFJQSxDQUFDQSxVQUFVQSxDQUFDQSxJQUFJQSxDQUFtQkEsRUFBRUEsQ0FBQ0EsQ0FBQ0E7b0JBQy9DQSxDQUFDQTtnQkFDTEEsQ0FBQ0E7Z0JBRU1GLHNCQUFHQSxHQUFWQTtvQkFDSUcsSUFBSUEsYUFBYUEsR0FBNkNBLElBQUlBLENBQUNBLGFBQWFBLENBQUNBLElBQUlBLENBQUNBLElBQUlBLENBQUNBLENBQUNBO29CQUM1RkEsSUFBSUEsUUFBUUEsR0FBNkJBLElBQUlBLENBQUNBLFVBQVVBLENBQUNBLEdBQUdBLENBQUNBLFVBQUNBLENBQUNBO3dCQUMzREEsTUFBTUEsQ0FBQ0EsYUFBYUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7b0JBQzVCQSxDQUFDQSxDQUFDQSxDQUFDQTtvQkFFSEEsTUFBTUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsUUFBUUEsQ0FBQ0EsQ0FBQ0E7Z0JBQ2pDQSxDQUFDQTtnQkFFTUgsZ0NBQWFBLEdBQXBCQSxVQUFxQkEsU0FBMkJBLEVBQUVBLE9BQXFDQTtvQkFBckNJLHVCQUFxQ0EsR0FBckNBLGtCQUFxQ0E7b0JBQ25GQSxJQUFJQSxRQUFRQSxHQUE2QkEsS0FBS0EsQ0FBQ0EsU0FBU0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsSUFBSUEsQ0FDN0RBLE9BQU9BLENBQUNBLGdCQUFnQkEsQ0FBQ0Esb0JBQVNBLENBQUNBLE9BQU9BLENBQUNBLFNBQVNBLENBQUNBLENBQUNBLEVBQ3REQSxVQUFTQSxDQUFDQTt3QkFDVCxNQUFNLENBQUMsSUFBSSxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUM7b0JBQ2pDLENBQUMsQ0FDYkEsQ0FBQ0E7b0JBRU9BLE1BQU1BLENBQUNBLE9BQU9BLENBQUNBLEdBQUdBLENBQUNBLFFBQVFBLENBQUNBLENBQUNBO2dCQUNqQ0EsQ0FBQ0E7Z0JBRU1KLDhCQUFXQSxHQUFsQkEsVUFBbUJBLE9BQW9CQTtvQkFDbkNLLElBQUlBLGFBQWFBLEdBQW1FQSxJQUFJQSxDQUFDQSxhQUFhQSxDQUFDQSxJQUFJQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQTtvQkFDbEhBLElBQUlBLFFBQVFBLEdBQTZCQSxLQUFLQSxDQUFDQSxTQUFTQSxDQUFDQSxHQUFHQSxDQUFDQSxJQUFJQSxDQUM3REEsSUFBSUEsQ0FBQ0EsVUFBVUEsRUFDZkEsVUFBQUEsU0FBU0E7d0JBQ0xBLE1BQU1BLENBQUNBLGFBQWFBLENBQUNBLFNBQVNBLEVBQUVBLE9BQU9BLENBQUNBLENBQUNBO29CQUM3Q0EsQ0FBQ0EsQ0FDSkEsQ0FBQ0E7b0JBRUZBLE1BQU1BLENBQUNBLE9BQU9BLENBQUNBLEdBQUdBLENBQUNBLFFBQVFBLENBQUNBLENBQUNBO2dCQUNqQ0EsQ0FBQ0E7Z0JBRU1MLCtCQUFZQSxHQUFuQkEsVUFBb0JBLElBQVlBO29CQUM1Qk0sTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsVUFBVUE7eUJBQ2pCQSxNQUFNQSxDQUFDQSxVQUFDQSxTQUFTQTt3QkFDZEEsTUFBTUEsQ0FBQ0Esb0JBQVNBLENBQUNBLE9BQU9BLENBQUNBLFNBQVNBLENBQUNBLEtBQUtBLElBQUlBLENBQUNBO29CQUNqREEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsTUFBTUEsR0FBR0EsQ0FBQ0EsQ0FBQ0E7Z0JBQ3RCQSxDQUFDQTtnQkFFTU4sK0JBQVlBLEdBQW5CQSxVQUFvQkEsSUFBWUE7b0JBQzVCTyxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQSxVQUFVQTt5QkFDakJBLE1BQU1BLENBQUNBLFVBQUNBLFNBQVNBO3dCQUNkQSxNQUFNQSxDQUFDQSxvQkFBU0EsQ0FBQ0EsT0FBT0EsQ0FBQ0EsU0FBU0EsQ0FBQ0EsS0FBS0EsSUFBSUEsQ0FBQ0E7b0JBQ2pEQSxDQUFDQSxDQUFDQSxDQUFDQSxNQUFNQSxHQUFHQSxDQUFDQSxDQUFDQTtnQkFDdEJBLENBQUNBO2dCQUVNUCwrQkFBWUEsR0FBbkJBLFVBQW9CQSxJQUFZQTtvQkFDNUJRLE1BQU1BLENBQUNBLElBQUlBLENBQUNBLFVBQVVBO3lCQUNyQkEsTUFBTUEsQ0FBQ0EsVUFBQ0EsU0FBU0E7d0JBQ2RBLE1BQU1BLENBQUNBLG9CQUFTQSxDQUFDQSxPQUFPQSxDQUFDQSxTQUFTQSxDQUFDQSxLQUFLQSxJQUFJQSxDQUFDQTtvQkFDakRBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO2dCQUNWQSxDQUFDQTtnQkFFTVIsZ0NBQWFBLEdBQXBCQSxVQUFxQkEsSUFBWUE7b0JBQzdCUyxJQUFJQSxJQUFJQSxHQUFHQSxJQUFJQSxDQUFDQTtvQkFFaEJBLE1BQU1BLENBQUNBLElBQUlBLENBQUNBLG9CQUFvQkEsQ0FBQ0EsSUFBSUEsQ0FBQ0E7eUJBQ3JDQSxJQUFJQSxDQUFDQSxVQUFDQSxNQUFNQTt3QkFDVEEsRUFBRUEsQ0FBQUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsWUFBWUEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsSUFBSUEsTUFBTUEsS0FBS0EseUJBQXlCQSxDQUFDQTs0QkFDakVBLE1BQU1BLENBQUNBLElBQUlBLENBQUNBO3dCQUNoQkEsSUFBSUE7NEJBQUNBLE1BQU1BLENBQUNBLElBQUlBLENBQUNBLGFBQWFBLENBQUNBLE1BQU1BLENBQUNBLENBQUNBO29CQUMzQ0EsQ0FBQ0EsQ0FBQ0E7eUJBQ0RBLElBQUlBLENBQUNBLFVBQUNBLFVBQVVBO3dCQUNiQSxNQUFNQSxDQUFDQSxFQUFFQSxDQUFDQSxVQUFVQSxDQUFDQSxpQkFBaUJBLENBQUNBLFFBQVFBLENBQUNBLFlBQVlBLENBQUNBLElBQUlBLENBQUNBLENBQUFBO29CQUN0RUEsQ0FBQ0EsQ0FBQ0E7eUJBQ0RBLElBQUlBLENBQUNBLFVBQUNBLFNBQVNBO3dCQUNaQSxJQUFJQSxDQUFDQSxRQUFRQSxDQUFDQSxTQUFTQSxDQUFDQSxDQUFDQTt3QkFDekJBLE1BQU1BLENBQUNBLFNBQVNBLENBQUNBO29CQUNyQkEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7b0JBQ0hBLDBEQUEwREE7Z0JBQzlEQSxDQUFDQTtnQkFFTVQsZ0NBQWFBLEdBQXBCQSxVQUFxQkEsSUFBWUE7b0JBQzdCVSxJQUFJQSxJQUFJQSxHQUFHQSxJQUFJQSxDQUFDQTtvQkFFaEJBLE1BQU1BLENBQUNBLElBQUlBLENBQUNBLG9CQUFvQkEsQ0FBQ0EsSUFBSUEsQ0FBQ0E7eUJBQ3JDQSxJQUFJQSxDQUFDQSxVQUFDQSxNQUFNQTt3QkFDVEEsRUFBRUEsQ0FBQUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsWUFBWUEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsSUFBSUEsTUFBTUEsS0FBS0EseUJBQXlCQSxJQUFJQSxNQUFNQSxLQUFLQSw4QkFBOEJBLENBQUNBOzRCQUM5R0EsTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0E7d0JBQ2hCQSxJQUFJQTs0QkFBQ0EsTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsYUFBYUEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsQ0FBQ0E7b0JBQzNDQSxDQUFDQSxDQUFDQTt5QkFDREEsSUFBSUEsQ0FBQ0EsVUFBQ0EsVUFBVUE7d0JBQ2JBLE1BQU1BLENBQUNBLEVBQUVBLENBQUNBLFVBQVVBLENBQUNBLGlCQUFpQkEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsWUFBWUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQUE7b0JBQ3RFQSxDQUFDQSxDQUFDQTt5QkFDREEsSUFBSUEsQ0FBQ0EsVUFBQ0EsU0FBU0E7d0JBQ1pBLElBQUlBLENBQUNBLFFBQVFBLENBQUNBLFNBQVNBLENBQUNBLENBQUNBO3dCQUN6QkEsTUFBTUEsQ0FBQ0EsU0FBU0EsQ0FBQ0E7b0JBQ3JCQSxDQUFDQSxDQUFDQSxDQUFDQTtvQkFFSEE7Ozs7Ozs7OztzQkFTRUE7Z0JBQ05BLENBQUNBO2dCQUVTVix1Q0FBb0JBLEdBQTlCQSxVQUErQkEsSUFBWUE7b0JBQ3ZDVyxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQSxnQkFBZ0JBLENBQUNBLEVBQUVBLENBQUNBLFVBQVVBLENBQUNBLGlCQUFpQkEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7Z0JBQ3pGQSxDQUFDQTtnQkFFU1gsdUNBQW9CQSxHQUE5QkEsVUFBK0JBLElBQVlBO29CQUN2Q1ksTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsZ0JBQWdCQSxDQUFDQSxFQUFFQSxDQUFDQSxVQUFVQSxDQUFDQSxpQkFBaUJBLENBQUNBLFFBQVFBLENBQUNBLE9BQU9BLENBQUNBLElBQUlBLENBQUNBLENBQUNBLENBQUNBO2dCQUN6RkEsQ0FBQ0E7Z0JBRVNaLG1DQUFnQkEsR0FBMUJBLFVBQTJCQSxJQUFZQTtvQkFDbkNhLE1BQU1BLENBQUNBLElBQUlBLE9BQU9BLENBQUNBLFVBQUNBLE9BQU9BLEVBQUVBLE1BQU1BO3dCQUUvQkEsSUFBSUEsT0FBT0EsR0FBR0EsSUFBSUEsY0FBY0EsRUFBRUEsQ0FBQ0E7d0JBQ25DQSxPQUFPQSxDQUFDQSxrQkFBa0JBLEdBQUdBOzRCQUN6QkEsRUFBRUEsQ0FBQUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsVUFBVUEsSUFBSUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7Z0NBQ3pCQSxJQUFJQSxJQUFJQSxHQUFHQSxPQUFPQSxDQUFDQSxZQUFZQSxDQUFDQTtnQ0FDaENBLEVBQUVBLENBQUFBLENBQUNBLE9BQU9BLENBQUNBLE1BQU1BLElBQUlBLEdBQUdBLENBQUNBLENBQUNBLENBQUNBO29DQUN2QkEsSUFBSUEsQ0FBQ0EsR0FBR0EsSUFBSUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsY0FBY0EsQ0FBQ0EsQ0FBQ0E7b0NBQ25DQSxFQUFFQSxDQUFBQSxDQUFDQSxDQUFDQSxLQUFLQSxJQUFJQSxDQUFDQSxDQUFDQSxDQUFDQTt3Q0FDWkEsT0FBT0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7b0NBQ2xCQSxDQUFDQTtvQ0FDREEsSUFBSUEsQ0FBQ0EsQ0FBQ0E7d0NBQ0ZBLE9BQU9BLENBQUNBLElBQUlBLENBQUNBLENBQUNBO29DQUNsQkEsQ0FBQ0E7Z0NBQ0xBLENBQUNBO2dDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQTtvQ0FDSkEsTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0E7Z0NBQ2pCQSxDQUFDQTs0QkFFTEEsQ0FBQ0E7d0JBQ0xBLENBQUNBLENBQUNBO3dCQUVGQSxPQUFPQSxDQUFDQSxJQUFJQSxDQUFDQSxLQUFLQSxFQUFFQSxJQUFJQSxDQUFDQSxDQUFDQTt3QkFDMUJBLE9BQU9BLENBQUNBLElBQUlBLEVBQUVBLENBQUNBO29CQUVuQkEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7Z0JBQ1BBLENBQUNBO2dCQUVMYixlQUFDQTtZQUFEQSxDQXpKQUQsQUF5SkNDLElBQUFEO1lBekpZQSxpQkFBUUEsV0F5SnBCQSxDQUFBQTtZQUVVQSxpQkFBUUEsR0FBR0EsSUFBSUEsUUFBUUEsRUFBRUEsQ0FBQ0E7UUFDekNBLENBQUNBLEVBL0pvQnRCLFFBQVFBLEdBQVJBLG1CQUFRQSxLQUFSQSxtQkFBUUEsUUErSjVCQTtJQUFEQSxDQUFDQSxFQS9KU3JCLFVBQVVBLEdBQVZBLGFBQVVBLEtBQVZBLGFBQVVBLFFBK0puQkE7QUFBREEsQ0FBQ0EsRUEvSk0sRUFBRSxLQUFGLEVBQUUsUUErSlI7QUNsS0QscUNBQXFDO0FBRXJDLElBQU8sRUFBRSxDQVVSO0FBVkQsV0FBTyxFQUFFO0lBQUNBLElBQUFBLFVBQVVBLENBVW5CQTtJQVZTQSxXQUFBQSxVQUFVQSxFQUFDQSxDQUFDQTtRQUNyQnFCO1lBQ0NxQyxNQUFNQSxDQUFDQSxFQUFFQSxDQUFDQSxVQUFVQSxDQUFDQSxRQUFRQSxDQUFDQSxRQUFRQSxDQUFDQSxHQUFHQSxFQUFFQSxDQUFDQTtRQUM5Q0EsQ0FBQ0E7UUFGZXJDLGNBQUdBLE1BRWxCQSxDQUFBQTtRQUVEQSxrQkFBeUJBLENBQXNDQTtZQUM5RHNDLEVBQUVBLENBQUNBLFVBQVVBLENBQUNBLFFBQVFBLENBQUNBLFFBQVFBLENBQUNBLFFBQVFBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO1FBQzdDQSxDQUFDQTtRQUZldEMsbUJBQVFBLFdBRXZCQSxDQUFBQTtRQUVVQSxjQUFHQSxHQUFZQSxLQUFLQSxDQUFDQTtJQUNqQ0EsQ0FBQ0EsRUFWU3JCLFVBQVVBLEdBQVZBLGFBQVVBLEtBQVZBLGFBQVVBLFFBVW5CQTtBQUFEQSxDQUFDQSxFQVZNLEVBQUUsS0FBRixFQUFFLFFBVVI7QUNaRCxJQUFPLEVBQUUsQ0E4Q1I7QUE5Q0QsV0FBTyxFQUFFO0lBQUNBLElBQUFBLFVBQVVBLENBOENuQkE7SUE5Q1NBLFdBQUFBLFVBQVVBO1FBQUNxQixJQUFBQSxZQUFZQSxDQThDaENBO1FBOUNvQkEsV0FBQUEsWUFBWUEsRUFBQ0EsQ0FBQ0E7WUFDL0J1QyxJQUFPQSxPQUFPQSxHQUFHQSxFQUFFQSxDQUFDQSxPQUFPQSxDQUFDQSxPQUFPQSxDQUFDQTtZQUVwQ0E7Z0JBQUFDO29CQUVZQyxVQUFLQSxHQUEwQkEsRUFBRUEsQ0FBQ0E7Z0JBcUM5Q0EsQ0FBQ0E7Z0JBbkNHRCw4QkFBT0EsR0FBUEEsVUFBUUEsSUFBWUE7b0JBQ2hCRSxFQUFFQSxDQUFBQSxDQUFDQSxFQUFFQSxDQUFDQSxVQUFVQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQSxDQUFDQTt3QkFDbkJBLElBQUlBLElBQUlBLEdBQUdBLEdBQUdBLElBQUlBLENBQUNBLEtBQUtBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBLEdBQUdBLEVBQUVBLENBQUNBO29CQUN4Q0EsQ0FBQ0E7b0JBRURBLElBQUlBLEdBQUdBLElBQUlBLENBQUNBLEtBQUtBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBLElBQUlBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBO29CQUVqQ0EsTUFBTUEsQ0FBQ0EsZ0JBQWNBLElBQUlBLFVBQU9BLENBQUNBO2dCQUNyQ0EsQ0FBQ0E7Z0JBRURGLDhCQUFPQSxHQUFQQSxVQUFRQSxJQUFZQTtvQkFBcEJHLGlCQXdCQ0E7b0JBdkJHQSxNQUFNQSxDQUFDQSxJQUFJQSxPQUFPQSxDQUFDQSxVQUFDQSxPQUFPQSxFQUFFQSxNQUFNQTt3QkFFL0JBLEVBQUVBLENBQUFBLENBQUNBLE9BQU9BLEtBQUlBLENBQUNBLEtBQUtBLENBQUNBLElBQUlBLENBQUNBLEtBQUtBLFFBQVFBLENBQUNBOzRCQUNwQ0EsTUFBTUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsS0FBSUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7d0JBRXJDQSxJQUFJQSxHQUFHQSxHQUFHQSxLQUFJQSxDQUFDQSxPQUFPQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQTt3QkFFN0JBLElBQUlBLE9BQU9BLEdBQUdBLElBQUlBLGNBQWNBLEVBQUVBLENBQUNBO3dCQUM1Q0EsT0FBT0EsQ0FBQ0Esa0JBQWtCQSxHQUFHQTs0QkFDNUIsRUFBRSxDQUFBLENBQUMsT0FBTyxDQUFDLFVBQVUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO2dDQUM1QixJQUFJLElBQUksR0FBRyxPQUFPLENBQUMsWUFBWSxDQUFDO2dDQUNoQyxFQUFFLENBQUEsQ0FBQyxPQUFPLENBQUMsTUFBTSxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUM7b0NBQ1IsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO2dDQUNqQyxDQUFDO2dDQUFDLElBQUksQ0FBQyxDQUFDO29DQUNQLE1BQU0sQ0FBQyw0Q0FBMEMsSUFBTSxDQUFDLENBQUM7Z0NBQzFELENBQUM7NEJBQ0YsQ0FBQzt3QkFDRixDQUFDLENBQUNBO3dCQUVGQSxPQUFPQSxDQUFDQSxJQUFJQSxDQUFDQSxLQUFLQSxFQUFFQSxHQUFHQSxFQUFFQSxJQUFJQSxDQUFDQSxDQUFDQTt3QkFDL0JBLE9BQU9BLENBQUNBLElBQUlBLEVBQUVBLENBQUNBO29CQUVWQSxDQUFDQSxDQUFDQSxDQUFDQTtnQkFDUEEsQ0FBQ0E7Z0JBQ0xILG1CQUFDQTtZQUFEQSxDQXZDQUQsQUF1Q0NDLElBQUFEO1lBdkNZQSx5QkFBWUEsZUF1Q3hCQSxDQUFBQTtZQUVVQSxxQkFBUUEsR0FBR0EsSUFBSUEsWUFBWUEsRUFBRUEsQ0FBQ0E7UUFFN0NBLENBQUNBLEVBOUNvQnZDLFlBQVlBLEdBQVpBLHVCQUFZQSxLQUFaQSx1QkFBWUEsUUE4Q2hDQTtJQUFEQSxDQUFDQSxFQTlDU3JCLFVBQVVBLEdBQVZBLGFBQVVBLEtBQVZBLGFBQVVBLFFBOENuQkE7QUFBREEsQ0FBQ0EsRUE5Q00sRUFBRSxLQUFGLEVBQUUsUUE4Q1I7QUM3Q0QsSUFBTyxFQUFFLENBaUJSO0FBakJELFdBQU8sRUFBRTtJQUFDQSxJQUFBQSxVQUFVQSxDQWlCbkJBO0lBakJTQSxXQUFBQSxVQUFVQTtRQUFDcUIsSUFBQUEsSUFBSUEsQ0FpQnhCQTtRQWpCb0JBLFdBQUFBLElBQUlBLEVBQUNBLENBQUNBO1lBQ3pCNEMsSUFBSUEsQ0FBQ0EsR0FBV0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFDbkJBLElBQUlBLElBQUlBLEdBQVVBLEVBQUVBLENBQUNBO1lBRXJCQSxhQUFvQkEsQ0FBTUE7Z0JBQ3pCQyxDQUFDQSxFQUFFQSxDQUFDQTtnQkFDSkEsSUFBSUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0E7Z0JBQ1pBLE1BQU1BLENBQUNBLENBQUNBLENBQUNBO1lBQ1ZBLENBQUNBO1lBSmVELFFBQUdBLE1BSWxCQSxDQUFBQTtZQUVEQSxhQUFvQkEsQ0FBU0E7Z0JBQzVCRSxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtZQUNoQkEsQ0FBQ0E7WUFGZUYsUUFBR0EsTUFFbEJBLENBQUFBO1lBRURBLGNBQXFCQSxDQUFTQTtnQkFBRUcsY0FBT0E7cUJBQVBBLFdBQU9BLENBQVBBLHNCQUFPQSxDQUFQQSxJQUFPQTtvQkFBUEEsNkJBQU9BOztnQkFDdENBLElBQUlBLENBQUNBLENBQUNBLFFBQU5BLElBQUlBLEVBQU9BLElBQUlBLENBQUNBLENBQUNBO1lBQ2xCQSxDQUFDQTtZQUZlSCxTQUFJQSxPQUVuQkEsQ0FBQUE7UUFDSEEsQ0FBQ0EsRUFqQm9CNUMsSUFBSUEsR0FBSkEsZUFBSUEsS0FBSkEsZUFBSUEsUUFpQnhCQTtJQUFEQSxDQUFDQSxFQWpCU3JCLFVBQVVBLEdBQVZBLGFBQVVBLEtBQVZBLGFBQVVBLFFBaUJuQkE7QUFBREEsQ0FBQ0EsRUFqQk0sRUFBRSxLQUFGLEVBQUUsUUFpQlI7QUNsQkQscUNBQXFDO0FBQ3JDLDhCQUE4QjtBQUU5QixJQUFPLEVBQUUsQ0FvVFI7QUFwVEQsV0FBTyxFQUFFO0lBQUNBLElBQUFBLFVBQVVBLENBb1RuQkE7SUFwVFNBLFdBQUFBLFVBQVVBO1FBQUNxQixJQUFBQSxRQUFRQSxDQW9UNUJBO1FBcFRvQkEsV0FBQUEsUUFBUUEsRUFBQ0EsQ0FBQ0E7WUFDM0JnRCxJQUFPQSxRQUFRQSxHQUFHQSxFQUFFQSxDQUFDQSxVQUFVQSxDQUFDQSxRQUFRQSxDQUFDQSxRQUFRQSxDQUFDQTtZQU9sREE7Z0JBQUFDO29CQUdJQyxhQUFRQSxHQUFnQkEsRUFBRUEsQ0FBQ0E7Z0JBSy9CQSxDQUFDQTtnQkFBREQsV0FBQ0E7WUFBREEsQ0FSQUQsQUFRQ0MsSUFBQUQ7WUFFREE7Z0JBQUFHO29CQUVZQyxNQUFDQSxHQUFRQTt3QkFDdEJBLEdBQUdBLEVBQUVBLHlDQUF5Q0E7d0JBQzlDQSxNQUFNQSxFQUFFQSxxQkFBcUJBO3dCQUM3QkEsSUFBSUEsRUFBRUEsdUJBQXVCQTt3QkFDN0JBLElBQUlBLEVBQUVBLHlCQUF5QkE7cUJBQy9CQSxDQUFDQTtvQkFFWUEsVUFBS0EsR0FBR0EsQ0FBQ0EsTUFBTUEsRUFBRUEsTUFBTUEsRUFBRUEsSUFBSUEsRUFBRUEsS0FBS0EsRUFBRUEsU0FBU0EsRUFBRUEsT0FBT0EsRUFBRUEsSUFBSUEsRUFBRUEsS0FBS0EsRUFBRUEsT0FBT0EsRUFBRUEsUUFBUUEsRUFBRUEsTUFBTUEsRUFBRUEsTUFBTUEsRUFBRUEsT0FBT0EsRUFBRUEsUUFBUUEsRUFBRUEsT0FBT0EsRUFBRUEsS0FBS0EsQ0FBQ0EsQ0FBQ0E7b0JBRTdJQSxVQUFLQSxHQUF3QkEsRUFBRUEsQ0FBQ0E7Z0JBbVI1Q0EsQ0FBQ0E7Z0JBalJVRCx5QkFBTUEsR0FBYkEsVUFBY0EsU0FBb0JBO29CQUM5QkUsRUFBRUEsQ0FBQUEsQ0FBQ0EsT0FBT0EsU0FBU0EsQ0FBQ0EsSUFBSUEsS0FBS0EsU0FBU0EsSUFBSUEsQ0FBQ0EsU0FBU0EsQ0FBQ0EsSUFBSUEsQ0FBQ0E7d0JBQ3REQSxNQUFNQSxDQUFDQTtvQkFFWEEsSUFBSUEsSUFBSUEsR0FBR0EsU0FBU0EsQ0FBQ0EsSUFBSUEsQ0FBQ0E7b0JBQzFCQSxJQUFJQSxJQUFJQSxHQUFHQSxJQUFJQSxDQUFDQSxLQUFLQSxDQUFDQSxJQUFJQSxDQUFDQSxHQUFHQSxJQUFJQSxDQUFDQSxLQUFLQSxDQUFDQSxJQUFJQSxDQUFDQSxJQUFJQSxJQUFJQSxDQUFDQSxLQUFLQSxDQUFDQSxTQUFTQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQTtvQkFDbEZBLElBQUlBLEdBQUdBLElBQUlBLENBQUNBLFlBQVlBLENBQUNBLElBQUlBLENBQUNBLFFBQVFBLENBQUNBLElBQUlBLENBQUNBLEVBQUVBLFNBQVNBLENBQUNBLENBQUNBO29CQUV6REEsSUFBSUEsSUFBSUEsR0FBR0EsSUFBSUEsQ0FBQ0EsV0FBV0EsQ0FBQ0EsSUFBSUEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7b0JBRXRDQSxTQUFTQSxDQUFDQSxPQUFPQSxDQUFDQSxTQUFTQSxHQUFHQSxJQUFJQSxDQUFDQTtnQkFFdkNBLENBQUNBO2dCQUdDRix3QkFBS0EsR0FBYkEsVUFBY0EsSUFBWUEsRUFBRUEsSUFBZ0JBO29CQUFoQkcsb0JBQWdCQSxHQUFoQkEsV0FBVUEsSUFBSUEsRUFBRUE7b0JBRTNDQSxJQUFJQSxDQUFDQSxDQUFDQTtvQkFDTkEsT0FBTUEsQ0FBQ0EsQ0FBQ0EsR0FBR0EsSUFBSUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0EsS0FBS0EsSUFBSUEsRUFBRUEsQ0FBQ0E7d0JBQzVDQSxJQUFJQSxHQUFHQSxFQUFFQSxJQUFJQSxFQUFFQSxPQUFPQSxFQUFFQSxNQUFNQSxFQUFFQSxXQUFXQSxFQUFFQSxNQUFNQSxFQUFFQSxPQUFPQSxDQUFDQTt3QkFDN0RBLEFBQ0FBLHlDQUR5Q0E7d0JBQ3pDQSxFQUFFQSxDQUFBQSxDQUFDQSxDQUFDQSxDQUFDQSxLQUFLQSxLQUFLQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTs0QkFDbEJBLEdBQUdBLEdBQUdBLElBQUlBLENBQUNBLEtBQUtBLENBQUNBLElBQUlBLENBQUNBLENBQUNBLENBQUNBLElBQUlBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBOzRCQUNqQ0EsR0FBR0EsR0FBR0EsR0FBR0EsQ0FBQ0EsTUFBTUEsQ0FBQ0EsQ0FBQ0EsRUFBRUEsR0FBR0EsQ0FBQ0EsTUFBTUEsR0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7NEJBQ2xDQSxJQUFJQSxHQUFHQSxNQUFNQSxDQUFDQTs0QkFDQ0EsTUFBTUEsR0FBR0EsS0FBS0EsQ0FBQ0E7NEJBQzlCQSxXQUFXQSxHQUFHQSxJQUFJQSxDQUFDQTs0QkFDbkJBLE1BQU1BLEdBQUdBLEtBQUtBLENBQUNBO3dCQUNoQkEsQ0FBQ0E7d0JBQUNBLElBQUlBLENBQUNBLENBQUNBOzRCQUNQQSxHQUFHQSxHQUFHQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxJQUFJQSxFQUFFQSxDQUFDQTs0QkFDbEJBLElBQUlBLEdBQUdBLENBQUNBLEdBQUdBLEdBQUNBLEdBQUdBLENBQUNBLENBQUNBLEtBQUtBLENBQUNBLElBQUlBLENBQUNBLENBQUNBLENBQUNBLElBQUlBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBOzRCQUN2Q0EsT0FBT0EsR0FBR0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsS0FBS0EsR0FBR0EsQ0FBQ0E7NEJBQ1ZBLE1BQU1BLEdBQUdBLElBQUlBLENBQUNBLE1BQU1BLENBQUNBLElBQUlBLENBQUNBLENBQUNBOzRCQUMxQ0EsV0FBV0EsR0FBR0EsTUFBTUEsSUFBSUEsR0FBR0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsTUFBTUEsR0FBQ0EsQ0FBQ0EsQ0FBQ0EsS0FBS0EsR0FBR0EsQ0FBQ0E7NEJBQ2xEQSxNQUFNQSxHQUFHQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxLQUFLQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQSxDQUFDQSxNQUFNQSxDQUFDQSxDQUFDQTs0QkFFcENBLEVBQUVBLENBQUFBLENBQUNBLFdBQVdBLElBQUlBLFFBQVFBLENBQUNBLFlBQVlBLENBQUNBLElBQUlBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO2dDQUMvQ0EsV0FBV0EsR0FBR0EsS0FBS0EsQ0FBQ0E7Z0NBQ3BCQSxHQUFHQSxHQUFHQSxHQUFHQSxDQUFDQSxNQUFNQSxDQUFDQSxDQUFDQSxFQUFFQSxHQUFHQSxDQUFDQSxNQUFNQSxHQUFDQSxDQUFDQSxDQUFDQSxHQUFHQSxHQUFHQSxDQUFDQTtnQ0FFeENBLE9BQU9BLEdBQUdBLElBQUlBLENBQUNBOzRCQUNoQkEsQ0FBQ0E7d0JBQ0ZBLENBQUNBO3dCQUVEQSxJQUFJQSxHQUFHQSxJQUFJQSxDQUFDQSxLQUFLQSxDQUFDQSxHQUFHQSxDQUFDQSxNQUFNQSxHQUFHQSxDQUFDQSxJQUFJQSxLQUFLQSxNQUFNQSxHQUFHQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQSxDQUFFQSxDQUFDQTt3QkFFM0RBLEVBQUVBLENBQUFBLENBQUNBLE9BQU9BLENBQUNBLENBQUNBLENBQUNBOzRCQUNaQSxLQUFLQSxDQUFDQTt3QkFDUEEsQ0FBQ0E7d0JBQUNBLElBQUlBLENBQUNBLENBQUNBOzRCQUNQQSxJQUFJQSxDQUFDQSxRQUFRQSxDQUFDQSxJQUFJQSxDQUFDQSxFQUFDQSxNQUFNQSxFQUFFQSxJQUFJQSxFQUFFQSxJQUFJQSxFQUFFQSxHQUFHQSxFQUFFQSxJQUFJQSxFQUFFQSxJQUFJQSxFQUFFQSxNQUFNQSxFQUFFQSxNQUFNQSxFQUFFQSxXQUFXQSxFQUFFQSxXQUFXQSxFQUFFQSxNQUFNQSxFQUFFQSxNQUFNQSxFQUFFQSxRQUFRQSxFQUFFQSxFQUFFQSxFQUFDQSxDQUFDQSxDQUFDQTs0QkFFbElBLEVBQUVBLENBQUFBLENBQUNBLENBQUNBLE9BQU9BLElBQUlBLENBQUNBLFdBQVdBLENBQUNBLENBQUNBLENBQUNBO2dDQUM3QkEsSUFBSUEsTUFBTUEsR0FBR0EsSUFBSUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsSUFBSUEsRUFBRUEsSUFBSUEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsTUFBTUEsR0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7Z0NBQ3JFQSxJQUFJQSxHQUFH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QUtBLENBQUNBO2dCQUM3RkEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7Z0JBRUhBLE1BQU1BLENBQUNBLE9BQU9BLENBQUNBLFVBQUFBLENBQUNBO29CQUNmQSxFQUFFQSxDQUFDQSxJQUFJQSxDQUFDQSxhQUFhQSxDQUFDQSxPQUFPQSxDQUFDQSxDQUFDQSxDQUFDQSxHQUFHQSxLQUFJQSxDQUFDQSxHQUFHQSxHQUFHQSxTQUFTQSxHQUFHQSxDQUFDQSxHQUFHQSxHQUFHQSxHQUFHQSxDQUFDQSxHQUFHQSxLQUFLQSxDQUFDQTtnQkFDL0VBLENBQUNBLENBQUNBLENBQUNBO1lBQ0pBLENBQUNBO1lBRVNMLDRCQUFVQSxHQUFwQkE7Z0JBQ0NNLEVBQUVBLENBQUNBLFVBQVVBLENBQUNBLEdBQUdBLEdBQUdBLElBQUlBLENBQUNBLEdBQUdBLENBQUNBO1lBQzlCQSxDQUFDQTtZQUVTTiw0QkFBVUEsR0FBcEJBO2dCQUNDTyxFQUFFQSxDQUFDQSxVQUFVQSxDQUFDQSxpQkFBaUJBLENBQUNBLFFBQVFBLENBQUNBLE1BQU1BLEdBQUdBLElBQUlBLENBQUNBLEdBQUdBLENBQUNBO2dCQUMzREEsRUFBRUEsQ0FBQ0EsVUFBVUEsQ0FBQ0EsaUJBQWlCQSxDQUFDQSxRQUFRQSxDQUFDQSxNQUFNQSxHQUFHQSxJQUFJQSxDQUFDQSxHQUFHQSxDQUFDQTtnQkFDM0RBLEVBQUVBLENBQUNBLElBQUlBLENBQUNBLGFBQWFBLENBQUNBLFFBQVFBLENBQUNBLE1BQU1BLEdBQUdBLElBQUlBLENBQUNBLEdBQUdBLENBQUNBO1lBQ2xEQSxDQUFDQTtZQUNGUCxjQUFDQTtRQUFEQSxDQWhGQUYsQUFnRkNFLElBQUFGO0lBRUZBLENBQUNBLEVBckhTakssRUFBRUEsR0FBRkEsS0FBRUEsS0FBRkEsS0FBRUEsUUFxSFhBO0FBQURBLENBQUNBLEVBckhNLEVBQUUsS0FBRixFQUFFLFFBcUhSIiwiZmlsZSI6ImhvLWFsbC5qcyIsInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZSBoby5wcm9taXNlIHtcclxuXHJcbiAgICBleHBvcnQgY2xhc3MgUHJvbWlzZTxULCBFPiB7XHJcblxyXG4gICAgICAgIGNvbnN0cnVjdG9yKGZ1bmM/OiAocmVzb2x2ZTooYXJnOlQpPT52b2lkLCByZWplY3Q6KGFyZzpFKT0+dm9pZCkgPT4gYW55KSB7XHJcbiAgICAgICAgICAgIGlmICh0eXBlb2YgZnVuYyA9PT0gJ2Z1bmN0aW9uJylcclxuICAgICAgICAgICAgICAgIGZ1bmMuY2FsbChcclxuICAgICAgICAgICAgICAgICAgICBhcmd1bWVudHMuY2FsbGVlLFxyXG4gICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uKGFyZzogVCl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucmVzb2x2ZShhcmcpXHJcbiAgICAgICAgICAgICAgICAgICAgfS5iaW5kKHRoaXMpLFxyXG4gICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uKGFyZzpFKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5yZWplY3QoYXJnKTtcclxuICAgICAgICAgICAgICAgICAgICB9LmJpbmQodGhpcylcclxuICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIGRhdGE6IFR8RSA9IHVuZGVmaW5lZDtcclxuICAgICAgICBwcml2YXRlIG9uUmVzb2x2ZTogKGFyZzE6VCkgPT4gYW55ID0gdW5kZWZpbmVkO1xyXG4gICAgICAgIHByaXZhdGUgb25SZWplY3Q6IChhcmcxOkUpID0+IGFueSA9IHVuZGVmaW5lZDtcclxuXHJcbiAgICAgICAgcHVibGljIHJlc29sdmVkOiBib29sZWFuID0gZmFsc2U7XHJcbiAgICAgICAgcHVibGljIHJlamVjdGVkOiBib29sZWFuID0gZmFsc2U7XHJcbiAgICAgICAgcHVibGljIGRvbmU6IGJvb2xlYW4gPSBmYWxzZTtcclxuXHJcbiAgICAgICAgcHJpdmF0ZSByZXQ6IFByb21pc2U8VCwgRT4gPSB1bmRlZmluZWQ7XHJcblxyXG4gICAgICAgIHByaXZhdGUgc2V0KGRhdGE/OiBUfEUpOiB2b2lkIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuZG9uZSlcclxuICAgICAgICAgICAgICAgIHRocm93IFwiUHJvbWlzZSBpcyBhbHJlYWR5IHJlc29sdmVkIC8gcmVqZWN0ZWRcIjtcclxuICAgICAgICAgICAgdGhpcy5kYXRhID0gZGF0YTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyByZXNvbHZlKGRhdGE/OiBUKTogdm9pZCB7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0KGRhdGEpO1xyXG4gICAgICAgICAgICB0aGlzLnJlc29sdmVkID0gdGhpcy5kb25lID0gdHJ1ZTtcclxuICAgICAgICAgICAgaWYgKHR5cGVvZiB0aGlzLm9uUmVzb2x2ZSA9PT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fcmVzb2x2ZSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIF9yZXNvbHZlKCk6IHZvaWQge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5yZXQgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5yZXQgPSBuZXcgUHJvbWlzZTxULEU+KCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHZhciB2OiBhbnkgPSB0aGlzLm9uUmVzb2x2ZSg8VD50aGlzLmRhdGEpO1xyXG5cclxuICAgICAgICAgICAgaWYgKHYgJiYgdiBpbnN0YW5jZW9mIFByb21pc2UpIHtcclxuICAgICAgICAgICAgICAgIHYudGhlbih0aGlzLnJldC5yZXNvbHZlLmJpbmQodGhpcy5yZXQpLCB0aGlzLnJldC5yZWplY3QuYmluZCh0aGlzLnJldCkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5yZXQucmVzb2x2ZSh2KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHJlamVjdChkYXRhPzogRSk6IHZvaWQge1xyXG4gICAgICAgICAgICB0aGlzLnNldChkYXRhKTtcclxuICAgICAgICAgICAgdGhpcy5yZWplY3RlZCA9IHRoaXMuZG9uZSA9IHRydWU7XHJcblxyXG4gICAgICAgICAgICBpZiAodHlwZW9mIHRoaXMub25SZWplY3QgPT09ICdmdW5jdGlvbicpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMub25SZWplY3QoPEU+dGhpcy5kYXRhKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKHRoaXMucmV0KSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnJldC5yZWplY3QoPEU+dGhpcy5kYXRhKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSBfcmVqZWN0KCk6IHZvaWQge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5yZXQgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5yZXQgPSBuZXcgUHJvbWlzZTxULEU+KCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHRoaXMub25SZWplY3QoPEU+dGhpcy5kYXRhKTtcclxuICAgICAgICAgICAgdGhpcy5yZXQucmVqZWN0KDxFPnRoaXMuZGF0YSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgdGhlbihyZXM6IChhcmcxOlQpPT5hbnksIHJlaj86IChhcmcxOkUpPT5hbnkpOiBQcm9taXNlPGFueSxhbnk+IHtcclxuICAgICAgICAgICAgaWYgKHRoaXMucmV0ID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMucmV0ID0gbmV3IFByb21pc2U8VCxFPigpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAocmVzICYmIHR5cGVvZiByZXMgPT09ICdmdW5jdGlvbicpXHJcbiAgICAgICAgICAgICAgICB0aGlzLm9uUmVzb2x2ZSA9IHJlcztcclxuXHJcbiAgICAgICAgICAgIGlmIChyZWogJiYgdHlwZW9mIHJlaiA9PT0gJ2Z1bmN0aW9uJylcclxuICAgICAgICAgICAgICAgIHRoaXMub25SZWplY3QgPSByZWo7XHJcblxyXG4gICAgICAgICAgICBpZiAodGhpcy5yZXNvbHZlZCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fcmVzb2x2ZSgpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAodGhpcy5yZWplY3RlZCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fcmVqZWN0KCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnJldDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBjYXRjaChjYjogKGFyZzE6RSk9PmFueSk6IHZvaWQge1xyXG4gICAgICAgICAgICB0aGlzLm9uUmVqZWN0ID0gY2I7XHJcblxyXG4gICAgICAgICAgICBpZiAodGhpcy5yZWplY3RlZClcclxuICAgICAgICAgICAgICAgIHRoaXMuX3JlamVjdCgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc3RhdGljIGFsbChhcnI6IEFycmF5PFByb21pc2U8YW55LCBhbnk+Pik6IFByb21pc2U8YW55LCBhbnk+IHtcclxuICAgICAgICAgICAgdmFyIHAgPSBuZXcgUHJvbWlzZSgpO1xyXG5cclxuICAgICAgICAgICAgdmFyIGRhdGEgPSBbXTtcclxuXHJcbiAgICAgICAgICAgIGlmIChhcnIubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgICBwLnJlc29sdmUoKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGFyci5mb3JFYWNoKChwcm9tLCBpbmRleCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHByb21cclxuICAgICAgICAgICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24oZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocC5kb25lKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YVtpbmRleF0gPSBkO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgYWxsUmVzb2x2ZWQgPSBhcnIucmVkdWNlKGZ1bmN0aW9uKHN0YXRlLCBwMSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHN0YXRlICYmIHAxLnJlc29sdmVkO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LCB0cnVlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGFsbFJlc29sdmVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwLnJlc29sdmUoZGF0YSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgLmNhdGNoKGZ1bmN0aW9uKGVycikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwLnJlamVjdChlcnIpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiBwO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc3RhdGljIGNoYWluKGFycjogQXJyYXk8UHJvbWlzZTxhbnksIGFueT4+KTogUHJvbWlzZTxhbnksIGFueT4ge1xyXG4gICAgICAgICAgICB2YXIgcDogUHJvbWlzZTxhbnksIGFueT4gPSBuZXcgUHJvbWlzZSgpO1xyXG4gICAgICAgICAgICB2YXIgZGF0YTogQXJyYXk8YW55PiA9IFtdO1xyXG5cclxuICAgICAgICAgICAgZnVuY3Rpb24gbmV4dCgpIHtcclxuICAgICAgICAgICAgICAgIGlmIChwLmRvbmUpXHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgICAgICAgICAgIHZhciBuOiBQcm9taXNlPGFueSwgYW55PiA9IGFyci5sZW5ndGggPyBhcnIuc2hpZnQoKSA6IHA7XHJcbiAgICAgICAgICAgICAgICBuLnRoZW4oXHJcbiAgICAgICAgICAgICAgICAgICAgKHJlc3VsdCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhLnB1c2gocmVzdWx0KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmV4dCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgKGVycikgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwLnJlamVjdChlcnIpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBuZXh0KCk7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gcDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHN0YXRpYyBjcmVhdGUob2JqOiBhbnkpOiBQcm9taXNlPGFueSwgYW55PiB7XHJcbiAgICAgICAgICAgIGlmIChvYmogaW5zdGFuY2VvZiBQcm9taXNlKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG9iajtcclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgcCA9IG5ldyBQcm9taXNlKCk7XHJcbiAgICAgICAgICAgICAgICBwLnJlc29sdmUob2JqKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBwO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxufVxyXG4iLCJpbnRlcmZhY2UgV2luZG93IHtcblx0d2Via2l0UmVxdWVzdEFuaW1hdGlvbkZyYW1lOiAoY2FsbGJhY2s6IEZyYW1lUmVxdWVzdENhbGxiYWNrKSA9PiBudW1iZXI7XG5cdG1velJlcXVlc3RBbmltYXRpb25GcmFtZTogKGNhbGxiYWNrOiBGcmFtZVJlcXVlc3RDYWxsYmFjaykgPT4gbnVtYmVyO1xuXHRvUmVxdWVzdEFuaW1hdGlvbkZyYW1lOiAoY2FsbGJhY2s6IEZyYW1lUmVxdWVzdENhbGxiYWNrKSA9PiBudW1iZXI7XG59XG5cbm1vZHVsZSBoby53YXRjaCB7XG5cblx0ZXhwb3J0IHR5cGUgSGFuZGxlciA9IChvYmo6YW55LCBuYW1lOnN0cmluZywgb2xkVjphbnksIG5ld1Y6YW55LCAgdGltZXN0YW1wPzogbnVtYmVyKT0+YW55O1xuXG5cdGV4cG9ydCBmdW5jdGlvbiB3YXRjaChvYmo6IGFueSwgbmFtZTogc3RyaW5nLCBoYW5kbGVyOiBIYW5kbGVyKTogdm9pZCB7XG5cdFx0bmV3IFdhdGNoZXIob2JqLCBuYW1lLCBoYW5kbGVyKTtcblx0fVxuXG5cdGNsYXNzIFdhdGNoZXIge1xuXG5cdFx0cHJpdmF0ZSBvbGRWYWw6YW55O1xuXG5cdFx0Y29uc3RydWN0b3IocHJpdmF0ZSBvYmo6IGFueSwgcHJpdmF0ZSBuYW1lOiBzdHJpbmcsIHByaXZhdGUgaGFuZGxlcjogSGFuZGxlcikge1xuXHRcdFx0dGhpcy5vbGRWYWwgPSB0aGlzLmNvcHkob2JqW25hbWVdKTtcblxuXHRcdFx0dGhpcy53YXRjaCh0aW1lc3RhbXAgPT4ge1xuXHRcdFx0XHRpZih0aGlzLm9sZFZhbCAhPT0gb2JqW25hbWVdKSB7XG5cdFx0XHRcdFx0dGhpcy5oYW5kbGVyLmNhbGwobnVsbCwgb2JqLCBuYW1lLCB0aGlzLm9sZFZhbCwgb2JqW25hbWVdLCB0aW1lc3RhbXApO1xuXHRcdFx0XHRcdHRoaXMub2xkVmFsID0gdGhpcy5jb3B5KG9ialtuYW1lXSk7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdH1cblxuXHRcdHByaXZhdGUgd2F0Y2goY2I6ICh0aW1lU3RhbXA6bnVtYmVyKT0+YW55KTogdm9pZCB7XG5cdFx0XHRsZXQgZm46IEZ1bmN0aW9uID1cblx0XHRcdHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUgICAgICAgfHxcblx0ICBcdFx0d2luZG93LndlYmtpdFJlcXVlc3RBbmltYXRpb25GcmFtZSB8fFxuXHQgIFx0XHR3aW5kb3cubW96UmVxdWVzdEFuaW1hdGlvbkZyYW1lICAgIHx8XG5cdCAgXHRcdHdpbmRvdy5vUmVxdWVzdEFuaW1hdGlvbkZyYW1lICAgICAgfHxcblx0ICBcdFx0d2luZG93Lm1zUmVxdWVzdEFuaW1hdGlvbkZyYW1lICAgICB8fFxuXHQgIFx0XHRmdW5jdGlvbihjYWxsYmFjazogRnVuY3Rpb24pe1xuXHRcdFx0XHR3aW5kb3cuc2V0VGltZW91dChjYWxsYmFjaywgMTAwMCAvIDYwKTtcblx0ICBcdFx0fTtcblxuXHRcdFx0bGV0IHdyYXAgPSAodHM6IG51bWJlcikgPT4ge1xuXHRcdFx0XHRjYih0cyk7XG5cdFx0XHRcdGZuKHdyYXApO1xuXHRcdFx0fVxuXG5cdFx0XHRmbih3cmFwKTtcblx0XHR9XG5cblx0XHRwcml2YXRlIGNvcHkodmFsOiBhbnkpOiBhbnkge1xuXHRcdFx0cmV0dXJuIEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkodmFsKSk7XG5cdFx0fVxuXHR9XG5cbn1cbiIsIm1vZHVsZSBoby5jb21wb25lbnRzLmNvbXBvbmVudHByb3ZpZGVyIHtcclxuICAgIGltcG9ydCBQcm9taXNlID0gaG8ucHJvbWlzZS5Qcm9taXNlO1xyXG5cclxuICAgIGV4cG9ydCBsZXQgbWFwcGluZzoge1tuYW1lOnN0cmluZ106c3RyaW5nfSA9IHt9O1xyXG5cclxuICAgIGV4cG9ydCBjbGFzcyBDb21wb25lbnRQcm92aWRlciB7XHJcblxyXG4gICAgICAgIHVzZU1pbjogYm9vbGVhbiA9IGZhbHNlO1xyXG5cclxuICAgICAgICByZXNvbHZlKG5hbWU6IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIGlmKCEhbWFwcGluZ1tuYW1lXSlcclxuICAgICAgICAgICAgICAgIHJldHVybiBtYXBwaW5nW25hbWVdO1xyXG5cclxuICAgICAgICAgICAgaWYoaG8uY29tcG9uZW50cy5kaXIpIHtcclxuICAgICAgICAgICAgICAgIG5hbWUgKz0gJy4nICsgbmFtZS5zcGxpdCgnLicpLnBvcCgpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBuYW1lID0gbmFtZS5zcGxpdCgnLicpLmpvaW4oJy8nKTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnVzZU1pbiA/XHJcbiAgICAgICAgICAgICAgICBgY29tcG9uZW50cy8ke25hbWV9Lm1pbi5qc2AgOlxyXG4gICAgICAgICAgICAgICAgYGNvbXBvbmVudHMvJHtuYW1lfS5qc2A7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBnZXRDb21wb25lbnQobmFtZTogc3RyaW5nKTogUHJvbWlzZTx0eXBlb2YgQ29tcG9uZW50LCBzdHJpbmc+IHtcclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlPHR5cGVvZiBDb21wb25lbnQsIGFueT4oKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgbGV0IHNyYyA9IHRoaXMucmVzb2x2ZShuYW1lKTtcclxuICAgICAgICAgICAgICAgIGxldCBzY3JpcHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzY3JpcHQnKTtcclxuICAgICAgICAgICAgICAgIHNjcmlwdC5vbmxvYWQgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICAvL0NvbXBvbmVudC5yZWdpc3Rlcih3aW5kb3dbbmFtZV0pO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKHR5cGVvZiB0aGlzLmdldChuYW1lKSA9PT0gJ2Z1bmN0aW9uJylcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSh0aGlzLmdldChuYW1lKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZWplY3QoYEVycm9yIHdoaWxlIGxvYWRpbmcgQ29tcG9uZW50ICR7bmFtZX1gKVxyXG4gICAgICAgICAgICAgICAgfS5iaW5kKHRoaXMpO1xyXG4gICAgICAgICAgICAgICAgc2NyaXB0LnNyYyA9IHNyYztcclxuICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdoZWFkJylbMF0uYXBwZW5kQ2hpbGQoc2NyaXB0KTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSBnZXQobmFtZTogc3RyaW5nKTogdHlwZW9mIENvbXBvbmVudCB7XHJcbiAgICAgICAgICAgIGxldCBjOiBhbnkgPSB3aW5kb3c7XHJcbiAgICAgICAgICAgIG5hbWUuc3BsaXQoJy4nKS5mb3JFYWNoKChwYXJ0KSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjID0gY1twYXJ0XTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHJldHVybiA8dHlwZW9mIENvbXBvbmVudD5jO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGxldCBpbnN0YW5jZSA9IG5ldyBDb21wb25lbnRQcm92aWRlcigpO1xyXG5cclxufVxyXG4iLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vLi4vYm93ZXJfY29tcG9uZW50cy9oby13YXRjaC9kaXN0L2QudHMvd2F0Y2guZC50c1wiLz5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi8uLi9ib3dlcl9jb21wb25lbnRzL2hvLXByb21pc2UvZGlzdC9wcm9taXNlLmQudHNcIi8+XG5cbm1vZHVsZSBoby5jb21wb25lbnRzIHtcblxuXHRpbXBvcnQgUHJvbWlzZSA9IGhvLnByb21pc2UuUHJvbWlzZTtcblxuXHQvKipcblx0XHRCYXNlY2xhc3MgZm9yIEF0dHJpYnV0ZXMuXG5cdFx0VXNlZCBBdHRyaWJ1dGVzIG5lZWRzIHRvIGJlIHNwZWNpZmllZCBieSBDb21wb25lbnQjYXR0cmlidXRlcyBwcm9wZXJ0eSB0byBnZXQgbG9hZGVkIHByb3Blcmx5LlxuXHQqL1xuXHRleHBvcnQgY2xhc3MgQXR0cmlidXRlIHtcblxuXHRcdHByb3RlY3RlZCBlbGVtZW50OiBIVE1MRWxlbWVudDtcblx0XHRwcm90ZWN0ZWQgY29tcG9uZW50OiBDb21wb25lbnQ7XG5cdFx0cHJvdGVjdGVkIHZhbHVlOiBzdHJpbmc7XG5cblx0XHRjb25zdHJ1Y3RvcihlbGVtZW50OiBIVE1MRWxlbWVudCwgdmFsdWU/OiBzdHJpbmcpIHtcblx0XHRcdHRoaXMuZWxlbWVudCA9IGVsZW1lbnQ7XG5cdFx0XHR0aGlzLmNvbXBvbmVudCA9IENvbXBvbmVudC5nZXRDb21wb25lbnQoZWxlbWVudCk7XG5cdFx0XHR0aGlzLnZhbHVlID0gdmFsdWU7XG5cblx0XHRcdHRoaXMuaW5pdCgpO1xuXHRcdH1cblxuXHRcdHByb3RlY3RlZCBpbml0KCk6IHZvaWQge31cblxuXHRcdGdldCBuYW1lKCkge1xuXHRcdFx0cmV0dXJuIEF0dHJpYnV0ZS5nZXROYW1lKHRoaXMpO1xuXHRcdH1cblxuXG5cdFx0cHVibGljIHVwZGF0ZSgpOiB2b2lkIHtcblxuXHRcdH1cblxuXG5cdFx0c3RhdGljIGdldE5hbWUoY2xheno6IHR5cGVvZiBBdHRyaWJ1dGUgfCBBdHRyaWJ1dGUpOiBzdHJpbmcge1xuICAgICAgICAgICAgaWYoY2xhenogaW5zdGFuY2VvZiBBdHRyaWJ1dGUpXG4gICAgICAgICAgICAgICAgcmV0dXJuIGNsYXp6LmNvbnN0cnVjdG9yLnRvU3RyaW5nKCkubWF0Y2goL1xcdysvZylbMV07XG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgcmV0dXJuIGNsYXp6LnRvU3RyaW5nKCkubWF0Y2goL1xcdysvZylbMV07XG4gICAgICAgIH1cblx0fVxuXG5cdGV4cG9ydCBjbGFzcyBXYXRjaEF0dHJpYnV0ZSBleHRlbmRzIEF0dHJpYnV0ZSB7XG5cblx0XHRwcm90ZWN0ZWQgcjogUmVnRXhwID0gLyMoLis/KSMvZztcblxuXHRcdGNvbnN0cnVjdG9yKGVsZW1lbnQ6IEhUTUxFbGVtZW50LCB2YWx1ZT86IHN0cmluZykge1xuXHRcdFx0c3VwZXIoZWxlbWVudCwgdmFsdWUpO1xuXG5cdFx0XHRsZXQgbTogYW55W10gPSB0aGlzLnZhbHVlLm1hdGNoKHRoaXMucikgfHwgW107XG5cdFx0XHRtLm1hcChmdW5jdGlvbih3KSB7XG5cdFx0XHRcdHcgPSB3LnN1YnN0cigxLCB3Lmxlbmd0aC0yKTtcblx0XHRcdFx0dGhpcy53YXRjaCh3KTtcblx0XHRcdH0uYmluZCh0aGlzKSk7XG5cdFx0XHR0aGlzLnZhbHVlID0gdGhpcy52YWx1ZS5yZXBsYWNlKC8jL2csICcnKTtcblx0XHR9XG5cblxuXHRcdHByb3RlY3RlZCB3YXRjaChwYXRoOiBzdHJpbmcpOiB2b2lkIHtcblx0XHRcdGxldCBwYXRoQXJyID0gcGF0aC5zcGxpdCgnLicpO1xuXHRcdFx0bGV0IHByb3AgPSBwYXRoQXJyLnBvcCgpO1xuXHRcdFx0bGV0IG9iaiA9IHRoaXMuY29tcG9uZW50O1xuXG5cdFx0XHRwYXRoQXJyLm1hcCgocGFydCkgPT4ge1xuXHRcdFx0XHRvYmogPSBvYmpbcGFydF07XG5cdFx0XHR9KTtcblxuXHRcdFx0aG8ud2F0Y2gud2F0Y2gob2JqLCBwcm9wLCB0aGlzLnVwZGF0ZS5iaW5kKHRoaXMpKTtcblx0XHR9XG5cblx0XHRwcm90ZWN0ZWQgZXZhbChwYXRoOiBzdHJpbmcpOiBhbnkge1xuXHRcdFx0bGV0IG1vZGVsID0gdGhpcy5jb21wb25lbnQ7XG5cdFx0XHRtb2RlbCA9IG5ldyBGdW5jdGlvbihPYmplY3Qua2V5cyhtb2RlbCkudG9TdHJpbmcoKSwgXCJyZXR1cm4gXCIgKyBwYXRoKVxuXHRcdFx0XHQuYXBwbHkobnVsbCwgT2JqZWN0LmtleXMobW9kZWwpLm1hcCgoaykgPT4ge3JldHVybiBtb2RlbFtrXX0pICk7XG5cdFx0XHRyZXR1cm4gbW9kZWw7XG5cdFx0fVxuXG5cdH1cbn1cbiIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuL2F0dHJpYnV0ZS50c1wiLz5cclxuXHJcbm1vZHVsZSBoby5jb21wb25lbnRzLmF0dHJpYnV0ZXByb3ZpZGVyIHtcclxuICAgIGltcG9ydCBQcm9taXNlID0gaG8ucHJvbWlzZS5Qcm9taXNlO1xyXG5cclxuICAgIGV4cG9ydCBsZXQgbWFwcGluZzoge1tuYW1lOnN0cmluZ106c3RyaW5nfSA9IHt9O1xyXG5cclxuICAgIGV4cG9ydCBjbGFzcyBBdHRyaWJ1dGVQcm92aWRlciB7XHJcblxyXG4gICAgICAgIHVzZU1pbjogYm9vbGVhbiA9IGZhbHNlO1xyXG5cclxuXHJcbiAgICAgICAgcmVzb2x2ZShuYW1lOiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICBpZighIW1hcHBpbmdbbmFtZV0pXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbWFwcGluZ1tuYW1lXTtcclxuXHJcbiAgICAgICAgICAgIGlmKGhvLmNvbXBvbmVudHMuZGlyKSB7XHJcbiAgICAgICAgICAgICAgICBuYW1lICs9ICcuJyArIG5hbWUuc3BsaXQoJy4nKS5wb3AoKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgbmFtZSA9IG5hbWUuc3BsaXQoJy4nKS5qb2luKCcvJyk7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy51c2VNaW4gP1xyXG4gICAgICAgICAgICAgICAgYGF0dHJpYnV0ZXMvJHtuYW1lfS5taW4uanNgIDpcclxuICAgICAgICAgICAgICAgIGBhdHRyaWJ1dGVzLyR7bmFtZX0uanNgO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZ2V0QXR0cmlidXRlKG5hbWU6IHN0cmluZyk6IFByb21pc2U8dHlwZW9mIEF0dHJpYnV0ZSwgc3RyaW5nPiB7XHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgUHJvbWlzZTx0eXBlb2YgQXR0cmlidXRlLCBhbnk+KChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICAgICAgICAgIGxldCBzcmMgPSB0aGlzLnJlc29sdmUobmFtZSk7XHJcbiAgICAgICAgICAgICAgICBsZXQgc2NyaXB0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc2NyaXB0Jyk7XHJcbiAgICAgICAgICAgICAgICBzY3JpcHQub25sb2FkID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy9Db21wb25lbnQucmVnaXN0ZXIod2luZG93W25hbWVdKTtcclxuICAgICAgICAgICAgICAgICAgICBpZih0eXBlb2Ygd2luZG93W25hbWVdID09PSAnZnVuY3Rpb24nKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKHdpbmRvd1tuYW1lXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZWplY3QoYEVycm9yIHdoaWxlIGxvYWRpbmcgQXR0cmlidXRlICR7bmFtZX1gKVxyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgIHNjcmlwdC5zcmMgPSBzcmM7XHJcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnaGVhZCcpWzBdLmFwcGVuZENoaWxkKHNjcmlwdCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBsZXQgaW5zdGFuY2UgPSBuZXcgQXR0cmlidXRlUHJvdmlkZXIoKTtcclxuXHJcbn1cclxuIiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4vY29tcG9uZW50c3Byb3ZpZGVyLnRzXCIvPlxyXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi9hdHRyaWJ1dGVwcm92aWRlci50c1wiLz5cclxuXHJcbm1vZHVsZSBoby5jb21wb25lbnRzLnJlZ2lzdHJ5IHtcclxuICAgIGltcG9ydCBQcm9taXNlID0gaG8ucHJvbWlzZS5Qcm9taXNlO1xyXG5cclxuICAgIGV4cG9ydCBjbGFzcyBSZWdpc3RyeSB7XHJcblxyXG4gICAgICAgIHByaXZhdGUgY29tcG9uZW50czogQXJyYXk8dHlwZW9mIENvbXBvbmVudD4gPSBbXTtcclxuICAgICAgICBwcml2YXRlIGF0dHJpYnV0ZXM6IEFycmF5PHR5cGVvZiBBdHRyaWJ1dGU+ID0gW107XHJcblxyXG5cclxuICAgICAgICBwdWJsaWMgcmVnaXN0ZXIoY2E6IHR5cGVvZiBDb21wb25lbnQgfCB0eXBlb2YgQXR0cmlidXRlKTogdm9pZCB7XHJcbiAgICAgICAgICAgIGlmKGNhLnByb3RvdHlwZSBpbnN0YW5jZW9mIENvbXBvbmVudCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jb21wb25lbnRzLnB1c2goPHR5cGVvZiBDb21wb25lbnQ+Y2EpO1xyXG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuY3JlYXRlRWxlbWVudChDb21wb25lbnQuZ2V0TmFtZSg8dHlwZW9mIENvbXBvbmVudD5jYSkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYoY2EucHJvdG90eXBlIGluc3RhbmNlb2YgQXR0cmlidXRlKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmF0dHJpYnV0ZXMucHVzaCg8dHlwZW9mIEF0dHJpYnV0ZT5jYSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBydW4oKTogUHJvbWlzZTxhbnksIGFueT4ge1xyXG4gICAgICAgICAgICBsZXQgaW5pdENvbXBvbmVudDogKGM6IHR5cGVvZiBDb21wb25lbnQpPT5Qcm9taXNlPGFueSwgYW55PiA9IHRoaXMuaW5pdENvbXBvbmVudC5iaW5kKHRoaXMpO1xyXG4gICAgICAgICAgICBsZXQgcHJvbWlzZXM6IEFycmF5PFByb21pc2U8YW55LCBhbnk+PiA9IHRoaXMuY29tcG9uZW50cy5tYXAoKGMpPT57XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gaW5pdENvbXBvbmVudChjKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5hbGwocHJvbWlzZXMpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIGluaXRDb21wb25lbnQoY29tcG9uZW50OiB0eXBlb2YgQ29tcG9uZW50LCBlbGVtZW50OkhUTUxFbGVtZW50fERvY3VtZW50PWRvY3VtZW50KTogUHJvbWlzZTxhbnksIGFueT4ge1xyXG4gICAgICAgICAgICBsZXQgcHJvbWlzZXM6IEFycmF5PFByb21pc2U8YW55LCBhbnk+PiA9IEFycmF5LnByb3RvdHlwZS5tYXAuY2FsbChcclxuICAgICAgICAgICAgICAgIGVsZW1lbnQucXVlcnlTZWxlY3RvckFsbChDb21wb25lbnQuZ2V0TmFtZShjb21wb25lbnQpKSxcclxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uKGUpOiBQcm9taXNlPGFueSwgYW55PiB7XHJcblx0ICAgICAgICAgICAgICAgIHJldHVybiBuZXcgY29tcG9uZW50KGUpLl9pbml0KCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblx0XHRcdCk7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5hbGwocHJvbWlzZXMpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIGluaXRFbGVtZW50KGVsZW1lbnQ6IEhUTUxFbGVtZW50KTogUHJvbWlzZTxhbnksIGFueT4ge1xyXG4gICAgICAgICAgICBsZXQgaW5pdENvbXBvbmVudDogKGM6IHR5cGVvZiBDb21wb25lbnQsIGVsZW1lbnQ6IEhUTUxFbGVtZW50KT0+UHJvbWlzZTxhbnksIGFueT4gPSB0aGlzLmluaXRDb21wb25lbnQuYmluZCh0aGlzKTtcclxuICAgICAgICAgICAgbGV0IHByb21pc2VzOiBBcnJheTxQcm9taXNlPGFueSwgYW55Pj4gPSBBcnJheS5wcm90b3R5cGUubWFwLmNhbGwoXHJcbiAgICAgICAgICAgICAgICB0aGlzLmNvbXBvbmVudHMsXHJcbiAgICAgICAgICAgICAgICBjb21wb25lbnQgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBpbml0Q29tcG9uZW50KGNvbXBvbmVudCwgZWxlbWVudCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICk7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5hbGwocHJvbWlzZXMpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIGhhc0NvbXBvbmVudChuYW1lOiBzdHJpbmcpOiBib29sZWFuIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY29tcG9uZW50c1xyXG4gICAgICAgICAgICAgICAgLmZpbHRlcigoY29tcG9uZW50KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIENvbXBvbmVudC5nZXROYW1lKGNvbXBvbmVudCkgPT09IG5hbWU7XHJcbiAgICAgICAgICAgICAgICB9KS5sZW5ndGggPiAwO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIGhhc0F0dHJpYnV0ZShuYW1lOiBzdHJpbmcpOiBib29sZWFuIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuYXR0cmlidXRlc1xyXG4gICAgICAgICAgICAgICAgLmZpbHRlcigoYXR0cmlidXRlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIEF0dHJpYnV0ZS5nZXROYW1lKGF0dHJpYnV0ZSkgPT09IG5hbWU7XHJcbiAgICAgICAgICAgICAgICB9KS5sZW5ndGggPiAwO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIGdldEF0dHJpYnV0ZShuYW1lOiBzdHJpbmcpOiB0eXBlb2YgQXR0cmlidXRlIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuYXR0cmlidXRlc1xyXG4gICAgICAgICAgICAuZmlsdGVyKChhdHRyaWJ1dGUpID0+IHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBBdHRyaWJ1dGUuZ2V0TmFtZShhdHRyaWJ1dGUpID09PSBuYW1lO1xyXG4gICAgICAgICAgICB9KVswXTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBsb2FkQ29tcG9uZW50KG5hbWU6IHN0cmluZyk6IFByb21pc2U8dHlwZW9mIENvbXBvbmVudCwgc3RyaW5nPiB7XHJcbiAgICAgICAgICAgIGxldCBzZWxmID0gdGhpcztcclxuXHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmdldFBhcmVudE9mQ29tcG9uZW50KG5hbWUpXHJcbiAgICAgICAgICAgIC50aGVuKChwYXJlbnQpID0+IHtcclxuICAgICAgICAgICAgICAgIGlmKHNlbGYuaGFzQ29tcG9uZW50KHBhcmVudCkgfHwgcGFyZW50ID09PSAnaG8uY29tcG9uZW50cy5Db21wb25lbnQnKVxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICAgICAgZWxzZSByZXR1cm4gc2VsZi5sb2FkQ29tcG9uZW50KHBhcmVudCk7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC50aGVuKChwYXJlbnRUeXBlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gaG8uY29tcG9uZW50cy5jb21wb25lbnRwcm92aWRlci5pbnN0YW5jZS5nZXRDb21wb25lbnQobmFtZSlcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLnRoZW4oKGNvbXBvbmVudCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgc2VsZi5yZWdpc3Rlcihjb21wb25lbnQpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGNvbXBvbmVudDtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIC8vcmV0dXJuIHRoaXMub3B0aW9ucy5jb21wb25lbnRQcm92aWRlci5nZXRDb21wb25lbnQobmFtZSlcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBsb2FkQXR0cmlidXRlKG5hbWU6IHN0cmluZyk6IFByb21pc2U8dHlwZW9mIEF0dHJpYnV0ZSwgc3RyaW5nPiB7XHJcbiAgICAgICAgICAgIGxldCBzZWxmID0gdGhpcztcclxuXHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmdldFBhcmVudE9mQXR0cmlidXRlKG5hbWUpXHJcbiAgICAgICAgICAgIC50aGVuKChwYXJlbnQpID0+IHtcclxuICAgICAgICAgICAgICAgIGlmKHNlbGYuaGFzQXR0cmlidXRlKHBhcmVudCkgfHwgcGFyZW50ID09PSAnaG8uY29tcG9uZW50cy5BdHRyaWJ1dGUnIHx8IHBhcmVudCA9PT0gJ2hvLmNvbXBvbmVudHMuV2F0Y2hBdHRyaWJ1dGUnKVxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICAgICAgZWxzZSByZXR1cm4gc2VsZi5sb2FkQXR0cmlidXRlKHBhcmVudCk7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC50aGVuKChwYXJlbnRUeXBlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gaG8uY29tcG9uZW50cy5hdHRyaWJ1dGVwcm92aWRlci5pbnN0YW5jZS5nZXRBdHRyaWJ1dGUobmFtZSlcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLnRoZW4oKGF0dHJpYnV0ZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgc2VsZi5yZWdpc3RlcihhdHRyaWJ1dGUpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGF0dHJpYnV0ZTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICBsZXQgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgUHJvbWlzZTx0eXBlb2YgQXR0cmlidXRlLCBzdHJpbmc+KChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICAgICAgICAgIGhvLmNvbXBvbmVudHMuYXR0cmlidXRlcHJvdmlkZXIuaW5zdGFuY2UuZ2V0QXR0cmlidXRlKG5hbWUpXHJcbiAgICAgICAgICAgICAgICAudGhlbigoYXR0cmlidXRlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5yZWdpc3RlcihhdHRyaWJ1dGUpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoYXR0cmlidXRlKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgKi9cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByb3RlY3RlZCBnZXRQYXJlbnRPZkNvbXBvbmVudChuYW1lOiBzdHJpbmcpOiBQcm9taXNlPHN0cmluZywgYW55PiB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmdldFBhcmVudE9mQ2xhc3MoaG8uY29tcG9uZW50cy5jb21wb25lbnRwcm92aWRlci5pbnN0YW5jZS5yZXNvbHZlKG5hbWUpKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByb3RlY3RlZCBnZXRQYXJlbnRPZkF0dHJpYnV0ZShuYW1lOiBzdHJpbmcpOiBQcm9taXNlPHN0cmluZywgYW55PiB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmdldFBhcmVudE9mQ2xhc3MoaG8uY29tcG9uZW50cy5hdHRyaWJ1dGVwcm92aWRlci5pbnN0YW5jZS5yZXNvbHZlKG5hbWUpKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByb3RlY3RlZCBnZXRQYXJlbnRPZkNsYXNzKHBhdGg6IHN0cmluZyk6IFByb21pc2U8c3RyaW5nLCBhbnk+IHtcclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuXHJcbiAgICAgICAgICAgICAgICBsZXQgeG1saHR0cCA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xyXG4gICAgICAgICAgICAgICAgeG1saHR0cC5vbnJlYWR5c3RhdGVjaGFuZ2UgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYoeG1saHR0cC5yZWFkeVN0YXRlID09IDQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHJlc3AgPSB4bWxodHRwLnJlc3BvbnNlVGV4dDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYoeG1saHR0cC5zdGF0dXMgPT0gMjAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgbSA9IHJlc3AubWF0Y2goL31cXClcXCgoLiopXFwpOy8pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYobSAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUobVsxXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKG51bGwpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVqZWN0KHJlc3ApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAgICAgeG1saHR0cC5vcGVuKCdHRVQnLCBwYXRoKTtcclxuICAgICAgICAgICAgICAgIHhtbGh0dHAuc2VuZCgpO1xyXG5cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgbGV0IGluc3RhbmNlID0gbmV3IFJlZ2lzdHJ5KCk7XHJcbn1cclxuIiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4vcmVnaXN0cnkudHNcIi8+XG5cbm1vZHVsZSBoby5jb21wb25lbnRzIHtcblx0ZXhwb3J0IGZ1bmN0aW9uIHJ1bigpOiBoby5wcm9taXNlLlByb21pc2U8YW55LCBhbnk+IHtcblx0XHRyZXR1cm4gaG8uY29tcG9uZW50cy5yZWdpc3RyeS5pbnN0YW5jZS5ydW4oKTtcblx0fVxuXG5cdGV4cG9ydCBmdW5jdGlvbiByZWdpc3RlcihjOiB0eXBlb2YgQ29tcG9uZW50IHwgdHlwZW9mIEF0dHJpYnV0ZSk6IHZvaWQge1xuXHRcdGhvLmNvbXBvbmVudHMucmVnaXN0cnkuaW5zdGFuY2UucmVnaXN0ZXIoYyk7XG5cdH1cblxuXHRleHBvcnQgbGV0IGRpcjogYm9vbGVhbiA9IGZhbHNlO1xufVxuIiwibW9kdWxlIGhvLmNvbXBvbmVudHMuaHRtbHByb3ZpZGVyIHtcclxuICAgIGltcG9ydCBQcm9taXNlID0gaG8ucHJvbWlzZS5Qcm9taXNlO1xyXG5cclxuICAgIGV4cG9ydCBjbGFzcyBIdG1sUHJvdmlkZXIge1xyXG5cclxuICAgICAgICBwcml2YXRlIGNhY2hlOiB7W2theTpzdHJpbmddOnN0cmluZ30gPSB7fTtcclxuXHJcbiAgICAgICAgcmVzb2x2ZShuYW1lOiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICBpZihoby5jb21wb25lbnRzLmRpcikge1xyXG4gICAgICAgICAgICAgICAgbmFtZSArPSAnLicgKyBuYW1lLnNwbGl0KCcuJykucG9wKCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIG5hbWUgPSBuYW1lLnNwbGl0KCcuJykuam9pbignLycpO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGBjb21wb25lbnRzLyR7bmFtZX0uaHRtbGA7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBnZXRIVE1MKG5hbWU6IHN0cmluZyk6IFByb21pc2U8c3RyaW5nLCBzdHJpbmc+IHtcclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuXHJcbiAgICAgICAgICAgICAgICBpZih0eXBlb2YgdGhpcy5jYWNoZVtuYW1lXSA9PT0gJ3N0cmluZycpXHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlc29sdmUodGhpcy5jYWNoZVtuYW1lXSk7XHJcblxyXG4gICAgICAgICAgICAgICAgbGV0IHVybCA9IHRoaXMucmVzb2x2ZShuYW1lKTtcclxuXHJcbiAgICAgICAgICAgICAgICBsZXQgeG1saHR0cCA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xyXG4gICAgXHRcdFx0eG1saHR0cC5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbigpIHtcclxuICAgIFx0XHRcdFx0aWYoeG1saHR0cC5yZWFkeVN0YXRlID09IDQpIHtcclxuICAgIFx0XHRcdFx0XHRsZXQgcmVzcCA9IHhtbGh0dHAucmVzcG9uc2VUZXh0O1xyXG4gICAgXHRcdFx0XHRcdGlmKHhtbGh0dHAuc3RhdHVzID09IDIwMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShyZXNwKTtcclxuICAgIFx0XHRcdFx0XHR9IGVsc2Uge1xyXG4gICAgXHRcdFx0XHRcdFx0cmVqZWN0KGBFcnJvciB3aGlsZSBsb2FkaW5nIGh0bWwgZm9yIENvbXBvbmVudCAke25hbWV9YCk7XHJcbiAgICBcdFx0XHRcdFx0fVxyXG4gICAgXHRcdFx0XHR9XHJcbiAgICBcdFx0XHR9O1xyXG5cclxuICAgIFx0XHRcdHhtbGh0dHAub3BlbignR0VUJywgdXJsLCB0cnVlKTtcclxuICAgIFx0XHRcdHhtbGh0dHAuc2VuZCgpO1xyXG5cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBsZXQgaW5zdGFuY2UgPSBuZXcgSHRtbFByb3ZpZGVyKCk7XHJcblxyXG59XHJcbiIsIlxubW9kdWxlIGhvLmNvbXBvbmVudHMudGVtcCB7XG5cdFx0dmFyIGM6IG51bWJlciA9IC0xO1xuXHRcdHZhciBkYXRhOiBhbnlbXSA9IFtdO1xuXG5cdFx0ZXhwb3J0IGZ1bmN0aW9uIHNldChkOiBhbnkpOiBudW1iZXIge1xuXHRcdFx0YysrO1xuXHRcdFx0ZGF0YVtjXSA9IGQ7XG5cdFx0XHRyZXR1cm4gYztcblx0XHR9XG5cblx0XHRleHBvcnQgZnVuY3Rpb24gZ2V0KGk6IG51bWJlcik6IGFueSB7XG5cdFx0XHRyZXR1cm4gZGF0YVtpXTtcblx0XHR9XG5cblx0XHRleHBvcnQgZnVuY3Rpb24gY2FsbChpOiBudW1iZXIsIC4uLmFyZ3MpOiB2b2lkIHtcblx0XHRcdGRhdGFbaV0oLi4uYXJncyk7XG5cdFx0fVxufVxuIiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4vcmVnaXN0cnkudHNcIi8+XHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuL3RlbXBcIi8+XHJcblxyXG5tb2R1bGUgaG8uY29tcG9uZW50cy5yZW5kZXJlciB7XHJcbiAgICBpbXBvcnQgUmVnaXN0cnkgPSBoby5jb21wb25lbnRzLnJlZ2lzdHJ5Lmluc3RhbmNlO1xyXG5cclxuICAgIGludGVyZmFjZSBOb2RlSHRtbCB7XHJcbiAgICAgICAgcm9vdDogTm9kZTtcclxuICAgICAgICBodG1sOiBzdHJpbmc7XHJcbiAgICB9XHJcblxyXG4gICAgY2xhc3MgTm9kZSB7XHJcbiAgICAgICAgaHRtbDogc3RyaW5nO1xyXG4gICAgICAgIHBhcmVudDogTm9kZTtcclxuICAgICAgICBjaGlsZHJlbjogQXJyYXk8Tm9kZT4gPSBbXTtcclxuICAgICAgICB0eXBlOiBzdHJpbmc7XHJcbiAgICAgICAgc2VsZkNsb3Npbmc6IGJvb2xlYW47XHJcbiAgICAgICAgaXNWb2lkOiBib29sZWFuO1xyXG4gICAgICAgIHJlcGVhdDogYm9vbGVhbjtcclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgY2xhc3MgUmVuZGVyZXIge1xyXG5cclxuICAgICAgICBwcml2YXRlIHI6IGFueSA9IHtcclxuXHRcdFx0dGFnOiAvPChbXj5dKj8oPzooPzooJ3xcIilbXidcIl0qP1xcMilbXj5dKj8pKik+LyxcclxuXHRcdFx0cmVwZWF0OiAvcmVwZWF0PVtcInwnXS4rW1wifCddLyxcclxuXHRcdFx0dHlwZTogL1tcXHN8L10qKC4qPylbXFxzfFxcL3w+XS8sXHJcblx0XHRcdHRleHQ6IC8oPzoufFtcXHJcXG5dKSo/W15cIidcXFxcXTwvbSxcclxuXHRcdH07XHJcblxyXG4gICAgICAgIHByaXZhdGUgdm9pZHMgPSBbXCJhcmVhXCIsIFwiYmFzZVwiLCBcImJyXCIsIFwiY29sXCIsIFwiY29tbWFuZFwiLCBcImVtYmVkXCIsIFwiaHJcIiwgXCJpbWdcIiwgXCJpbnB1dFwiLCBcImtleWdlblwiLCBcImxpbmtcIiwgXCJtZXRhXCIsIFwicGFyYW1cIiwgXCJzb3VyY2VcIiwgXCJ0cmFja1wiLCBcIndiclwiXTtcclxuXHJcbiAgICAgICAgcHJpdmF0ZSBjYWNoZToge1trZXk6c3RyaW5nXTpOb2RlfSA9IHt9O1xyXG5cclxuICAgICAgICBwdWJsaWMgcmVuZGVyKGNvbXBvbmVudDogQ29tcG9uZW50KTogdm9pZCB7XHJcbiAgICAgICAgICAgIGlmKHR5cGVvZiBjb21wb25lbnQuaHRtbCA9PT0gJ2Jvb2xlYW4nICYmICFjb21wb25lbnQuaHRtbClcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgICAgICAgIGxldCBuYW1lID0gY29tcG9uZW50Lm5hbWU7XHJcbiAgICAgICAgICAgIGxldCByb290ID0gdGhpcy5jYWNoZVtuYW1lXSA9IHRoaXMuY2FjaGVbbmFtZV0gfHwgdGhpcy5wYXJzZShjb21wb25lbnQuaHRtbCkucm9vdDtcclxuICAgICAgICAgICAgcm9vdCA9IHRoaXMucmVuZGVyUmVwZWF0KHRoaXMuY29weU5vZGUocm9vdCksIGNvbXBvbmVudCk7XHJcblxyXG4gICAgICAgICAgICBsZXQgaHRtbCA9IHRoaXMuZG9tVG9TdHJpbmcocm9vdCwgLTEpO1xyXG5cclxuICAgICAgICAgICAgY29tcG9uZW50LmVsZW1lbnQuaW5uZXJIVE1MID0gaHRtbDtcclxuXHJcbiAgICAgICAgfVxyXG5cclxuXHJcblx0XHRwcml2YXRlIHBhcnNlKGh0bWw6IHN0cmluZywgcm9vdD0gbmV3IE5vZGUoKSk6IE5vZGVIdG1sIHtcclxuXHJcblx0XHRcdHZhciBtO1xyXG5cdFx0XHR3aGlsZSgobSA9IHRoaXMuci50YWcuZXhlYyhodG1sKSkgIT09IG51bGwpIHtcclxuXHRcdFx0XHR2YXIgdGFnLCB0eXBlLCBjbG9zaW5nLCBpc1ZvaWQsIHNlbGZDbG9zaW5nLCByZXBlYXQsIHVuQ2xvc2U7XHJcblx0XHRcdFx0Ly8tLS0tLS0tIGZvdW5kIHNvbWUgdGV4dCBiZWZvcmUgbmV4dCB0YWdcclxuXHRcdFx0XHRpZihtLmluZGV4ICE9PSAwKSB7XHJcblx0XHRcdFx0XHR0YWcgPSBodG1sLm1hdGNoKHRoaXMuci50ZXh0KVswXTtcclxuXHRcdFx0XHRcdHRhZyA9IHRhZy5zdWJzdHIoMCwgdGFnLmxlbmd0aC0xKTtcclxuXHRcdFx0XHRcdHR5cGUgPSAnVEVYVCc7XHJcbiAgICAgICAgICAgICAgICAgICAgaXNWb2lkID0gZmFsc2U7XHJcblx0XHRcdFx0XHRzZWxmQ2xvc2luZyA9IHRydWU7XHJcblx0XHRcdFx0XHRyZXBlYXQgPSBmYWxzZTtcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0dGFnID0gbVsxXS50cmltKCk7XHJcblx0XHRcdFx0XHR0eXBlID0gKHRhZysnPicpLm1hdGNoKHRoaXMuci50eXBlKVsxXTtcclxuXHRcdFx0XHRcdGNsb3NpbmcgPSB0YWdbMF0gPT09ICcvJztcclxuICAgICAgICAgICAgICAgICAgICBpc1ZvaWQgPSB0aGlzLmlzVm9pZCh0eXBlKTtcclxuXHRcdFx0XHRcdHNlbGZDbG9zaW5nID0gaXNWb2lkIHx8IHRhZ1t0YWcubGVuZ3RoLTFdID09PSAnLyc7XHJcblx0XHRcdFx0XHRyZXBlYXQgPSAhIXRhZy5tYXRjaCh0aGlzLnIucmVwZWF0KTtcclxuXHJcblx0XHRcdFx0XHRpZihzZWxmQ2xvc2luZyAmJiBSZWdpc3RyeS5oYXNDb21wb25lbnQodHlwZSkpIHtcclxuXHRcdFx0XHRcdFx0c2VsZkNsb3NpbmcgPSBmYWxzZTtcclxuXHRcdFx0XHRcdFx0dGFnID0gdGFnLnN1YnN0cigwLCB0YWcubGVuZ3RoLTEpICsgXCIgXCI7XHJcblxyXG5cdFx0XHRcdFx0XHR1bkNsb3NlID0gdHJ1ZTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdGh0bWwgPSBodG1sLnNsaWNlKHRhZy5sZW5ndGggKyAodHlwZSA9PT0gJ1RFWFQnID8gMCA6IDIpICk7XHJcblxyXG5cdFx0XHRcdGlmKGNsb3NpbmcpIHtcclxuXHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRyb290LmNoaWxkcmVuLnB1c2goe3BhcmVudDogcm9vdCwgaHRtbDogdGFnLCB0eXBlOiB0eXBlLCBpc1ZvaWQ6IGlzVm9pZCwgc2VsZkNsb3Npbmc6IHNlbGZDbG9zaW5nLCByZXBlYXQ6IHJlcGVhdCwgY2hpbGRyZW46IFtdfSk7XHJcblxyXG5cdFx0XHRcdFx0aWYoIXVuQ2xvc2UgJiYgIXNlbGZDbG9zaW5nKSB7XHJcblx0XHRcdFx0XHRcdHZhciByZXN1bHQgPSB0aGlzLnBhcnNlKGh0bWwsIHJvb3QuY2hpbGRyZW5bcm9vdC5jaGlsZHJlbi5sZW5ndGgtMV0pO1xyXG5cdFx0XHRcdFx0XHRodG1sID0gcmVzdWx0Lmh0bWw7XHJcblx0XHRcdFx0XHRcdHJvb3QuY2hpbGRyZW4ucG9wKCk7XHJcblx0XHRcdFx0XHRcdHJvb3QuY2hpbGRyZW4ucHVzaChyZXN1bHQucm9vdCk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRtID0gaHRtbC5tYXRjaCh0aGlzLnIudGFnKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0cmV0dXJuIHtyb290OiByb290LCBodG1sOiBodG1sfTtcclxuXHRcdH1cclxuXHJcblx0XHRwcml2YXRlIHJlbmRlclJlcGVhdChyb290LCBtb2RlbHMpOiBOb2RlIHtcclxuXHRcdFx0bW9kZWxzID0gW10uY29uY2F0KG1vZGVscyk7XHJcblxyXG5cdFx0XHRmb3IodmFyIGMgPSAwOyBjIDwgcm9vdC5jaGlsZHJlbi5sZW5ndGg7IGMrKykge1xyXG5cdFx0XHRcdHZhciBjaGlsZCA9IHJvb3QuY2hpbGRyZW5bY107XHJcblx0XHRcdFx0aWYoY2hpbGQucmVwZWF0KSB7XHJcblx0XHRcdFx0XHR2YXIgcmVnZXggPSAvcmVwZWF0PVtcInwnXVxccyooXFxTKylcXHMrYXNcXHMrKFxcUys/KVtcInwnXS87XHJcblx0XHRcdFx0XHR2YXIgbSA9IGNoaWxkLmh0bWwubWF0Y2gocmVnZXgpLnNsaWNlKDEpO1xyXG5cdFx0XHRcdFx0dmFyIG5hbWUgPSBtWzFdO1xyXG5cdFx0XHRcdFx0dmFyIGluZGV4TmFtZTtcclxuXHRcdFx0XHRcdGlmKG5hbWUuaW5kZXhPZignLCcpID4gLTEpIHtcclxuXHRcdFx0XHRcdFx0dmFyIG5hbWVzID0gbmFtZS5zcGxpdCgnLCcpO1xyXG5cdFx0XHRcdFx0XHRuYW1lID0gbmFtZXNbMF0udHJpbSgpO1xyXG5cdFx0XHRcdFx0XHRpbmRleE5hbWUgPSBuYW1lc1sxXS50cmltKCk7XHJcblx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0dmFyIG1vZGVsID0gdGhpcy5ldmFsdWF0ZShtb2RlbHMsIG1bMF0pO1xyXG5cclxuXHRcdFx0XHRcdHZhciBob2xkZXIgPSBbXTtcclxuXHRcdFx0XHRcdG1vZGVsLmZvckVhY2goZnVuY3Rpb24odmFsdWUsIGluZGV4KSB7XHJcblx0XHRcdFx0XHRcdHZhciBtb2RlbDIgPSB7fTtcclxuXHRcdFx0XHRcdFx0bW9kZWwyW25hbWVdID0gdmFsdWU7XHJcblx0XHRcdFx0XHRcdG1vZGVsMltpbmRleE5hbWVdID0gaW5kZXg7XHJcblxyXG5cdFx0XHRcdFx0XHR2YXIgbW9kZWxzMiA9IFtdLmNvbmNhdChtb2RlbHMpO1xyXG5cdFx0XHRcdFx0XHRtb2RlbHMyLnVuc2hpZnQobW9kZWwyKTtcclxuXHJcblx0XHRcdFx0XHRcdHZhciBub2RlID0gdGhpcy5jb3B5Tm9kZShjaGlsZCk7XHJcblx0XHRcdFx0XHRcdG5vZGUucmVwZWF0ID0gZmFsc2U7XHJcblx0XHRcdFx0XHRcdG5vZGUuaHRtbCA9IG5vZGUuaHRtbC5yZXBsYWNlKHRoaXMuci5yZXBlYXQsICcnKTtcclxuXHRcdFx0XHRcdFx0bm9kZS5odG1sID0gdGhpcy5yZXBsKG5vZGUuaHRtbCwgbW9kZWxzMik7XHJcblxyXG5cdFx0XHRcdFx0XHRub2RlID0gdGhpcy5yZW5kZXJSZXBlYXQobm9kZSwgbW9kZWxzMik7XHJcblxyXG5cdFx0XHRcdFx0XHQvL3Jvb3QuY2hpbGRyZW4uc3BsaWNlKHJvb3QuY2hpbGRyZW4uaW5kZXhPZihjaGlsZCksIDAsIG5vZGUpO1xyXG5cdFx0XHRcdFx0XHRob2xkZXIucHVzaChub2RlKTtcclxuXHRcdFx0XHRcdH0uYmluZCh0aGlzKSk7XHJcblxyXG5cdFx0XHRcdFx0aG9sZGVyLmZvckVhY2goZnVuY3Rpb24obikge1xyXG5cdFx0XHRcdFx0XHRyb290LmNoaWxkcmVuLnNwbGljZShyb290LmNoaWxkcmVuLmluZGV4T2YoY2hpbGQpLCAwLCBuKTtcclxuXHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0cm9vdC5jaGlsZHJlbi5zcGxpY2Uocm9vdC5jaGlsZHJlbi5pbmRleE9mKGNoaWxkKSwgMSk7XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdGNoaWxkLmh0bWwgPSB0aGlzLnJlcGwoY2hpbGQuaHRtbCwgbW9kZWxzKTtcclxuXHRcdFx0XHRcdGNoaWxkID0gdGhpcy5yZW5kZXJSZXBlYXQoY2hpbGQsIG1vZGVscyk7XHJcblx0XHRcdFx0XHRyb290LmNoaWxkcmVuW2NdID0gY2hpbGQ7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRyZXR1cm4gcm9vdDtcclxuXHRcdH1cclxuXHJcblx0XHRwcml2YXRlIGRvbVRvU3RyaW5nKHJvb3Q6IE5vZGUsIGluZGVudDogbnVtYmVyKTogc3RyaW5nIHtcclxuXHRcdFx0aW5kZW50ID0gaW5kZW50IHx8IDA7XHJcblx0XHRcdHZhciBodG1sID0gJyc7XHJcbiAgICAgICAgICAgIGNvbnN0IHRhYjogYW55ID0gJ1xcdCc7XHJcblxyXG5cdFx0XHRpZihyb290Lmh0bWwpIHtcclxuXHRcdFx0XHRodG1sICs9IG5ldyBBcnJheShpbmRlbnQpLmpvaW4odGFiKTsgLy90YWIucmVwZWF0KGluZGVudCk7O1xyXG5cdFx0XHRcdGlmKHJvb3QudHlwZSAhPT0gJ1RFWFQnKSB7XHJcblx0XHRcdFx0XHRpZihyb290LnNlbGZDbG9zaW5nICYmICFyb290LmlzVm9pZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBodG1sICs9ICc8JyArIHJvb3QuaHRtbC5zdWJzdHIoMCwgLS1yb290Lmh0bWwubGVuZ3RoKSArICc+JztcclxuICAgICAgICAgICAgICAgICAgICAgICAgaHRtbCArPSAnPC8nK3Jvb3QudHlwZSsnPlxcbic7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgICAgICAgICAgaHRtbCArPSAnPCcgKyByb290Lmh0bWwgKyAnPic7XHJcbiAgICAgICAgICAgICAgICB9XHJcblx0XHRcdFx0ZWxzZSBodG1sICs9IHJvb3QuaHRtbDtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0aWYoaHRtbClcclxuXHRcdFx0XHRodG1sICs9ICdcXG4nO1xyXG5cclxuXHRcdFx0aWYocm9vdC5jaGlsZHJlbi5sZW5ndGgpIHtcclxuXHRcdFx0XHRodG1sICs9IHJvb3QuY2hpbGRyZW4ubWFwKGZ1bmN0aW9uKGMpIHtcclxuXHRcdFx0XHRcdHJldHVybiB0aGlzLmRvbVRvU3RyaW5nKGMsIGluZGVudCsocm9vdC50eXBlID8gMSA6IDIpKTtcclxuXHRcdFx0XHR9LmJpbmQodGhpcykpLmpvaW4oJ1xcbicpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRpZihyb290LnR5cGUgJiYgcm9vdC50eXBlICE9PSAnVEVYVCcgJiYgIXJvb3Quc2VsZkNsb3NpbmcpIHtcclxuXHRcdFx0XHRodG1sICs9IG5ldyBBcnJheShpbmRlbnQpLmpvaW4odGFiKTsgLy90YWIucmVwZWF0KGluZGVudCk7XHJcblx0XHRcdFx0aHRtbCArPSAnPC8nK3Jvb3QudHlwZSsnPlxcbic7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHJldHVybiBodG1sO1xyXG5cdFx0fVxyXG5cclxuICAgICAgICBwcml2YXRlIHJlcGwoc3RyOiBzdHJpbmcsIG1vZGVsczogYW55W10pOiBzdHJpbmcge1xyXG4gICAgICAgICAgICB2YXIgcmVnZXhHID0gL3soLis/KX19Py9nO1xyXG5cclxuICAgICAgICAgICAgdmFyIG0gPSBzdHIubWF0Y2gocmVnZXhHKTtcclxuICAgICAgICAgICAgaWYoIW0pXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gc3RyO1xyXG5cclxuICAgICAgICAgICAgd2hpbGUobS5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgIHZhciBwYXRoID0gbVswXTtcclxuICAgICAgICAgICAgICAgIHBhdGggPSBwYXRoLnN1YnN0cigxLCBwYXRoLmxlbmd0aC0yKTtcclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgdmFsdWUgPSB0aGlzLmV2YWx1YXRlKG1vZGVscywgcGF0aCk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYodmFsdWUgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKHR5cGVvZiB2YWx1ZSA9PT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IFwiaG8uY29tcG9uZW50cy5Db21wb25lbnQuZ2V0Q29tcG9uZW50KHRoaXMpLlwiK3BhdGg7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIHN0ciA9IHN0ci5yZXBsYWNlKG1bMF0sIHZhbHVlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBtID0gbS5zbGljZSgxKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHN0cjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByaXZhdGUgZXZhbHVhdGUobW9kZWxzOiBhbnlbXSwgcGF0aDogc3RyaW5nKTogYW55IHtcclxuICAgICAgICAgICAgaWYocGF0aFswXSA9PT0gJ3snICYmIHBhdGhbLS1wYXRoLmxlbmd0aF0gPT09ICd9JylcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmV2YWx1YXRlRXhwcmVzc2lvbihtb2RlbHMsIHBhdGguc3Vic3RyKDEsIHBhdGgubGVuZ3RoLTIpKVxyXG4gICAgICAgICAgICBlbHNlIGlmKHBhdGhbMF0gPT09ICcjJylcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmV2YWx1YXRlRnVuY3Rpb24obW9kZWxzLCBwYXRoLnN1YnN0cigxKSk7XHJcbiAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmV2YWx1YXRlVmFsdWUobW9kZWxzLCBwYXRoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByaXZhdGUgZXZhbHVhdGVWYWx1ZShtb2RlbHM6IGFueVtdLCBwYXRoOiBzdHJpbmcpOiBhbnkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5ldmFsdWF0ZVZhbHVlQW5kTW9kZWwobW9kZWxzLCBwYXRoKS52YWx1ZTtcclxuICAgICAgICB9XHJcblxyXG5cdFx0cHJpdmF0ZSBldmFsdWF0ZVZhbHVlQW5kTW9kZWwobW9kZWxzOiBhbnlbXSwgcGF0aDogc3RyaW5nKToge3ZhbHVlOiBhbnksIG1vZGVsOiBhbnl9IHtcclxuXHRcdFx0aWYobW9kZWxzLmluZGV4T2Yod2luZG93KSA9PSAtMSlcclxuICAgICAgICAgICAgICAgIG1vZGVscy5wdXNoKHdpbmRvdyk7XHJcblxyXG4gICAgICAgICAgICB2YXIgbWkgPSAwO1xyXG5cdFx0XHR2YXIgbW9kZWwgPSB2b2lkIDA7XHJcblx0XHRcdHdoaWxlKG1pIDwgbW9kZWxzLmxlbmd0aCAmJiBtb2RlbCA9PT0gdW5kZWZpbmVkKSB7XHJcblx0XHRcdFx0bW9kZWwgPSBtb2RlbHNbbWldO1xyXG5cdFx0XHRcdHRyeSB7XHJcblx0XHRcdFx0XHRtb2RlbCA9IG5ldyBGdW5jdGlvbihcIm1vZGVsXCIsIFwicmV0dXJuIG1vZGVsWydcIiArIHBhdGguc3BsaXQoXCIuXCIpLmpvaW4oXCInXVsnXCIpICsgXCInXVwiKShtb2RlbCk7XHJcblx0XHRcdFx0fSBjYXRjaChlKSB7XHJcblx0XHRcdFx0XHRtb2RlbCA9IHZvaWQgMDtcclxuXHRcdFx0XHR9IGZpbmFsbHkge1xyXG4gICAgICAgICAgICAgICAgICAgIG1pKys7XHJcbiAgICAgICAgICAgICAgICB9XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHJldHVybiB7XCJ2YWx1ZVwiOiBtb2RlbCwgXCJtb2RlbFwiOiBtb2RlbHNbLS1taV19O1xyXG5cdFx0fVxyXG5cclxuICAgICAgICBwcml2YXRlIGV2YWx1YXRlRXhwcmVzc2lvbihtb2RlbHM6IGFueVtdLCBwYXRoOiBzdHJpbmcpOiBhbnkge1xyXG5cdFx0XHRpZihtb2RlbHMuaW5kZXhPZih3aW5kb3cpID09IC0xKVxyXG4gICAgICAgICAgICAgICAgbW9kZWxzLnB1c2god2luZG93KTtcclxuXHJcbiAgICAgICAgICAgIHZhciBtaSA9IDA7XHJcblx0XHRcdHZhciBtb2RlbCA9IHZvaWQgMDtcclxuXHRcdFx0d2hpbGUobWkgPCBtb2RlbHMubGVuZ3RoICYmIG1vZGVsID09PSB1bmRlZmluZWQpIHtcclxuXHRcdFx0XHRtb2RlbCA9IG1vZGVsc1ttaV07XHJcblx0XHRcdFx0dHJ5IHtcclxuICAgICAgICAgICAgICAgICAgICAvL3dpdGgobW9kZWwpIG1vZGVsID0gZXZhbChwYXRoKTtcclxuICAgICAgICAgICAgICAgICAgICBtb2RlbCA9IG5ldyBGdW5jdGlvbihPYmplY3Qua2V5cyhtb2RlbCkudG9TdHJpbmcoKSwgXCJyZXR1cm4gXCIgKyBwYXRoKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAuYXBwbHkobnVsbCwgT2JqZWN0LmtleXMobW9kZWwpLm1hcCgoaykgPT4ge3JldHVybiBtb2RlbFtrXX0pICk7XHJcblx0XHRcdFx0fSBjYXRjaChlKSB7XHJcblx0XHRcdFx0XHRtb2RlbCA9IHZvaWQgMDtcclxuXHRcdFx0XHR9IGZpbmFsbHkge1xyXG4gICAgICAgICAgICAgICAgICAgIG1pKys7XHJcbiAgICAgICAgICAgICAgICB9XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHJldHVybiBtb2RlbDtcclxuXHRcdH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSBldmFsdWF0ZUZ1bmN0aW9uKG1vZGVsczogYW55W10sIHBhdGg6IHN0cmluZyk6IGFueSB7XHJcbiAgICAgICAgICAgIGxldCBleHAgPSB0aGlzLmV2YWx1YXRlRXhwcmVzc2lvbi5iaW5kKHRoaXMsIG1vZGVscyk7XHJcblx0XHRcdHZhciBbbmFtZSwgYXJnc10gPSBwYXRoLnNwbGl0KCcoJyk7XHJcbiAgICAgICAgICAgIGFyZ3MgPSBhcmdzLnN1YnN0cigwLCAtLWFyZ3MubGVuZ3RoKTtcclxuXHJcbiAgICAgICAgICAgIGxldCB7dmFsdWUsIG1vZGVsfSA9IHRoaXMuZXZhbHVhdGVWYWx1ZUFuZE1vZGVsKG1vZGVscywgbmFtZSk7XHJcbiAgICAgICAgICAgIGxldCBmdW5jOiBGdW5jdGlvbiA9IHZhbHVlO1xyXG4gICAgICAgICAgICBsZXQgYXJnQXJyOiBzdHJpbmdbXSA9IGFyZ3Muc3BsaXQoJy4nKS5tYXAoKGFyZykgPT4ge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGFyZy5pbmRleE9mKCcjJykgPT09IDAgP1xyXG4gICAgICAgICAgICAgICAgICAgIGFyZy5zdWJzdHIoMSkgOlxyXG4gICAgICAgICAgICAgICAgICAgIGV4cChhcmcpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGZ1bmMgPSBmdW5jLmJpbmQobW9kZWwsIC4uLmFyZ0Fycik7XHJcblxyXG4gICAgICAgICAgICBsZXQgaW5kZXggPSBoby5jb21wb25lbnRzLnRlbXAuc2V0KGZ1bmMpO1xyXG5cclxuICAgICAgICAgICAgdmFyIHN0ciA9IGBoby5jb21wb25lbnRzLnRlbXAuY2FsbCgke2luZGV4fSlgO1xyXG4gICAgICAgICAgICByZXR1cm4gc3RyO1xyXG5cdFx0fVxyXG5cclxuXHRcdHByaXZhdGUgY29weU5vZGUobm9kZTogTm9kZSk6IE5vZGUge1xyXG5cdFx0XHR2YXIgY29weU5vZGUgPSB0aGlzLmNvcHlOb2RlLmJpbmQodGhpcyk7XHJcblxyXG4gICAgICAgICAgICB2YXIgbiA9IDxOb2RlPntcclxuXHRcdFx0XHRwYXJlbnQ6IG5vZGUucGFyZW50LFxyXG5cdFx0XHRcdGh0bWw6IG5vZGUuaHRtbCxcclxuXHRcdFx0XHR0eXBlOiBub2RlLnR5cGUsXHJcblx0XHRcdFx0c2VsZkNsb3Npbmc6IG5vZGUuc2VsZkNsb3NpbmcsXHJcblx0XHRcdFx0cmVwZWF0OiBub2RlLnJlcGVhdCxcclxuXHRcdFx0XHRjaGlsZHJlbjogbm9kZS5jaGlsZHJlbi5tYXAoY29weU5vZGUpXHJcblx0XHRcdH07XHJcblxyXG5cdFx0XHRyZXR1cm4gbjtcclxuXHRcdH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSBpc1ZvaWQobmFtZTogc3RyaW5nKTogYm9vbGVhbiB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnZvaWRzLmluZGV4T2YobmFtZS50b0xvd2VyQ2FzZSgpKSAhPT0gLTE7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgbGV0IGluc3RhbmNlID0gbmV3IFJlbmRlcmVyKCk7XHJcblxyXG59XHJcbiIsIm1vZHVsZSBoby5jb21wb25lbnRzLnN0eWxlciB7XG5cblx0ZXhwb3J0IGludGVyZmFjZSBJU3R5bGVyIHtcblx0XHRhcHBseVN0eWxlKGNvbXBvbmVudDogQ29tcG9uZW50LCBjc3M/OiBzdHJpbmcpOiB2b2lkXG5cdH1cblxuXHRpbnRlcmZhY2UgU3R5bGVCbG9jayB7XG5cdFx0c2VsZWN0b3I6IHN0cmluZztcblx0XHRydWxlczogQXJyYXk8U3R5bGVSdWxlPjtcblx0fVxuXG5cdGludGVyZmFjZSBTdHlsZVJ1bGUge1xuXHRcdHByb3BlcnR5OiBzdHJpbmc7XG5cdFx0dmFsdWU6IHN0cmluZztcblx0fVxuXG5cdGNsYXNzIFN0eWxlciBpbXBsZW1lbnRzIElTdHlsZXIge1xuXHRcdHB1YmxpYyBhcHBseVN0eWxlKGNvbXBvbmVudDogQ29tcG9uZW50LCBjc3MgPSBjb21wb25lbnQuc3R5bGUpOiB2b2lkIHtcblx0XHRcdGxldCBzdHlsZSA9IHRoaXMucGFyc2VTdHlsZShjb21wb25lbnQuc3R5bGUpO1xuXHRcdFx0c3R5bGUuZm9yRWFjaChzID0+IHtcblx0XHRcdFx0dGhpcy5hcHBseVN0eWxlQmxvY2soY29tcG9uZW50LCBzKTtcblx0XHRcdH0pO1xuXHRcdH1cblxuXHRcdHByb3RlY3RlZCBhcHBseVN0eWxlQmxvY2soY29tcG9uZW50OiBDb21wb25lbnQsIHN0eWxlOiBTdHlsZUJsb2NrKTogdm9pZCB7XG5cdFx0XHRpZihzdHlsZS5zZWxlY3Rvci50cmltKCkudG9Mb3dlckNhc2UoKSA9PT0gJ3RoaXMnKSB7XG5cdFx0XHRcdHN0eWxlLnJ1bGVzLmZvckVhY2gociA9PiB7XG5cdFx0XHRcdFx0dGhpcy5hcHBseVJ1bGUoY29tcG9uZW50LmVsZW1lbnQsIHIpO1xuXHRcdFx0XHR9KTtcblx0XHRcdH1cblx0XHRcdGVsc2Uge1xuXHRcdFx0XHRBcnJheS5wcm90b3R5cGUuZm9yRWFjaC5jYWxsKGNvbXBvbmVudC5lbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoc3R5bGUuc2VsZWN0b3IpLCBlbCA9PiB7XG5cdFx0XHRcdFx0c3R5bGUucnVsZXMuZm9yRWFjaChyID0+IHtcblx0XHRcdFx0XHRcdHRoaXMuYXBwbHlSdWxlKGVsLCByKTtcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0cHJvdGVjdGVkIGFwcGx5UnVsZShlbGVtZW50OiBIVE1MRWxlbWVudCwgcnVsZTogU3R5bGVSdWxlKTogdm9pZCB7XG5cdFx0XHRsZXQgcHJvcCA9IHJ1bGUucHJvcGVydHkucmVwbGFjZSgvLShcXHcpL2csIChfLCBsZXR0ZXI6IHN0cmluZykgPT4ge1xuXHRcdFx0XHRyZXR1cm4gbGV0dGVyLnRvVXBwZXJDYXNlKCk7XG5cdFx0XHR9KS50cmltKCk7XG5cdFx0XHRlbGVtZW50LnN0eWxlW3Byb3BdID0gcnVsZS52YWx1ZTtcblx0XHR9XG5cblx0XHRwcm90ZWN0ZWQgcGFyc2VTdHlsZShjc3M6IHN0cmluZyk6IEFycmF5PFN0eWxlQmxvY2s+IHtcblx0XHRcdGxldCByID0gLyguKz8pXFxzKnsoLio/KX0vZ207XG5cdFx0XHRsZXQgcjIgPSAvKC4rPylcXHM/OiguKz8pOy9nbTtcblx0XHRcdGNzcyA9IGNzcy5yZXBsYWNlKC9cXG4vZywgJycpO1xuXHRcdFx0bGV0IGJsb2NrczogU3R5bGVCbG9ja1tdID0gKDxzdHJpbmdbXT5jc3MubWF0Y2gocikgfHwgW10pXG5cdFx0XHRcdC5tYXAoYiA9PiB7XG5cdFx0XHRcdFx0aWYoIWIubWF0Y2gocikpXG5cdFx0XHRcdFx0XHRyZXR1cm4gbnVsbDtcblxuXHRcdFx0XHRcdGxldCBbXywgc2VsZWN0b3IsIF9ydWxlc10gPSByLmV4ZWMoYik7XG5cdFx0XHRcdFx0bGV0IHJ1bGVzOiBTdHlsZVJ1bGVbXSA9ICg8c3RyaW5nW10+X3J1bGVzLm1hdGNoKHIyKSB8fCBbXSlcblx0XHRcdFx0XHRcdC5tYXAociA9PiB7XG5cdFx0XHRcdFx0XHRcdGlmKCFyLm1hdGNoKHIyKSlcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gbnVsbDtcblxuXHRcdFx0XHRcdFx0XHRsZXQgW18sIHByb3BlcnR5LCB2YWx1ZV0gPSByMi5leGVjKHIpO1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4ge3Byb3BlcnR5LCB2YWx1ZX07XG5cdFx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdFx0LmZpbHRlcihyID0+IHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIHIgIT09IG51bGw7XG5cdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRyZXR1cm4ge3NlbGVjdG9yLCBydWxlc307XG5cdFx0XHRcdH0pXG5cdFx0XHRcdC5maWx0ZXIoYiA9PiB7XG5cdFx0XHRcdFx0cmV0dXJuIGIgIT09IG51bGw7XG5cdFx0XHRcdH0pO1xuXG5cblx0XHRcdHJldHVybiBibG9ja3M7XG5cdFx0fVxuXHR9XG5cblx0ZXhwb3J0IGxldCBpbnN0YW5jZTogSVN0eWxlciA9IG5ldyBTdHlsZXIoKTtcbn1cbiIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuL21haW5cIi8+XHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuL3JlZ2lzdHJ5XCIvPlxyXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi9odG1scHJvdmlkZXIudHNcIi8+XHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuL3JlbmRlcmVyLnRzXCIvPlxyXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi9hdHRyaWJ1dGUudHNcIi8+XHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuL3N0eWxlci50c1wiLz5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uLy4uL2Jvd2VyX2NvbXBvbmVudHMvaG8tcHJvbWlzZS9kaXN0L3Byb21pc2UuZC50c1wiLz5cclxuXHJcbm1vZHVsZSBoby5jb21wb25lbnRzIHtcclxuXHJcbiAgICBpbXBvcnQgUmVnaXN0cnkgPSBoby5jb21wb25lbnRzLnJlZ2lzdHJ5Lmluc3RhbmNlO1xyXG4gICAgaW1wb3J0IEh0bWxQcm92aWRlciA9IGhvLmNvbXBvbmVudHMuaHRtbHByb3ZpZGVyLmluc3RhbmNlO1xyXG4gICAgaW1wb3J0IFJlbmRlcmVyID0gaG8uY29tcG9uZW50cy5yZW5kZXJlci5pbnN0YW5jZTtcclxuICAgIGltcG9ydCBQcm9taXNlID0gaG8ucHJvbWlzZS5Qcm9taXNlO1xyXG5cclxuICAgIGV4cG9ydCBpbnRlcmZhY2UgQ29tcG9uZW50RWxlbWVudCBleHRlbmRzIEhUTUxFbGVtZW50IHtcclxuICAgICAgICBjb21wb25lbnQ/OiBDb21wb25lbnQ7XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGludGVyZmFjZSBJUHJvcHJldHkge1xyXG4gICAgICAgIG5hbWU6IHN0cmluZztcclxuICAgICAgICByZXF1aXJlZD86IGJvb2xlYW47XHJcbiAgICAgICAgZGVmYXVsdD86IGFueTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAgICBCYXNlY2xhc3MgZm9yIENvbXBvbmVudHNcclxuICAgICAgICBpbXBvcnRhbnQ6IGRvIGluaXRpYWxpemF0aW9uIHdvcmsgaW4gQ29tcG9uZW50I2luaXRcclxuICAgICovXHJcbiAgICBleHBvcnQgY2xhc3MgQ29tcG9uZW50IHtcclxuICAgICAgICBwdWJsaWMgZWxlbWVudDogQ29tcG9uZW50RWxlbWVudDtcclxuICAgICAgICBwdWJsaWMgb3JpZ2luYWxfaW5uZXJIVE1MOiBzdHJpbmc7XHJcbiAgICAgICAgcHVibGljIGh0bWw6IHN0cmluZyA9ICcnO1xyXG4gICAgICAgIHB1YmxpYyBzdHlsZTogc3RyaW5nID0gJyc7XHJcbiAgICAgICAgcHVibGljIHByb3BlcnRpZXM6IEFycmF5PHN0cmluZ3xJUHJvcHJldHk+ID0gW107XHJcbiAgICAgICAgcHVibGljIGF0dHJpYnV0ZXM6IEFycmF5PHN0cmluZz4gPSBbXTtcclxuICAgICAgICBwdWJsaWMgcmVxdWlyZXM6IEFycmF5PHN0cmluZz4gPSBbXTtcclxuICAgICAgICBwdWJsaWMgY2hpbGRyZW46IHtba2V5OiBzdHJpbmddOiBhbnl9ID0ge307XHJcblxyXG4gICAgICAgIGNvbnN0cnVjdG9yKGVsZW1lbnQ6IEhUTUxFbGVtZW50KSB7XHJcbiAgICAgICAgICAgIC8vLS0tLS0tLSBpbml0IEVsZW1lbmV0IGFuZCBFbGVtZW50cycgb3JpZ2luYWwgaW5uZXJIVE1MXHJcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudCA9IGVsZW1lbnQ7XHJcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudC5jb21wb25lbnQgPSB0aGlzO1xyXG4gICAgICAgICAgICB0aGlzLm9yaWdpbmFsX2lubmVySFRNTCA9IGVsZW1lbnQuaW5uZXJIVE1MO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIGdldCBuYW1lKCk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIHJldHVybiBDb21wb25lbnQuZ2V0TmFtZSh0aGlzKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBnZXROYW1lKCk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLm5hbWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgZ2V0UGFyZW50KCk6IENvbXBvbmVudCB7XHJcbiAgICAgICAgICAgIHJldHVybiBDb21wb25lbnQuZ2V0Q29tcG9uZW50KDxDb21wb25lbnRFbGVtZW50PnRoaXMuZWxlbWVudC5wYXJlbnROb2RlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBfaW5pdCgpOiBQcm9taXNlPGFueSwgYW55PiB7XHJcbiAgICAgICAgICAgIGxldCByZW5kZXIgPSB0aGlzLnJlbmRlci5iaW5kKHRoaXMpO1xyXG4gICAgICAgICAgICAvLy0tLS0tLS0tIGluaXQgUHJvcGVydGllc1xyXG4gICAgICAgICAgICB0aGlzLmluaXRQcm9wZXJ0aWVzKCk7XHJcblxyXG4gICAgICAgICAgICAvLy0tLS0tLS0gY2FsbCBpbml0KCkgJiBsb2FkUmVxdWlyZW1lbnRzKCkgLT4gdGhlbiByZW5kZXJcclxuICAgICAgICAgICAgbGV0IHJlYWR5ID0gW3RoaXMuaW5pdEhUTUwoKSwgUHJvbWlzZS5jcmVhdGUodGhpcy5pbml0KCkpLCB0aGlzLmxvYWRSZXF1aXJlbWVudHMoKV07XHJcblxyXG4gICAgICAgICAgICBsZXQgcCA9IG5ldyBQcm9taXNlPGFueSwgYW55PigpO1xyXG5cclxuICAgICAgICAgICAgUHJvbWlzZS5hbGwocmVhZHkpXHJcbiAgICAgICAgICAgIC50aGVuKCgpID0+IHtcclxuICAgICAgICAgICAgICAgIHAucmVzb2x2ZSgpO1xyXG4gICAgICAgICAgICAgICAgcmVuZGVyKCk7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5jYXRjaCgoZXJyKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBwLnJlamVjdChlcnIpO1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgZXJyO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBwO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICAgIE1ldGhvZCB0aGF0IGdldCBjYWxsZWQgYWZ0ZXIgaW5pdGlhbGl6YXRpb24gb2YgYSBuZXcgaW5zdGFuY2UuXHJcbiAgICAgICAgICAgIERvIGluaXQtd29yayBoZXJlLlxyXG4gICAgICAgICAgICBNYXkgcmV0dXJuIGEgUHJvbWlzZS5cclxuICAgICAgICAqL1xyXG4gICAgICAgIHB1YmxpYyBpbml0KCk6IGFueSB7fVxyXG5cclxuICAgICAgICBwdWJsaWMgdXBkYXRlKCk6IHZvaWQge3JldHVybiB2b2lkIDA7fVxyXG5cclxuICAgICAgICBwdWJsaWMgcmVuZGVyKCk6IHZvaWQge1xyXG4gICAgXHRcdFJlbmRlcmVyLnJlbmRlcih0aGlzKTtcclxuXHJcbiAgICBcdFx0UmVnaXN0cnkuaW5pdEVsZW1lbnQodGhpcy5lbGVtZW50KVxyXG4gICAgICAgICAgICAudGhlbihmdW5jdGlvbigpIHtcclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLmluaXRDaGlsZHJlbigpO1xyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMuaW5pdFN0eWxlKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy5pbml0QXR0cmlidXRlcygpO1xyXG5cclxuICAgIFx0XHRcdHRoaXMudXBkYXRlKCk7XHJcblxyXG4gICAgICAgICAgICB9LmJpbmQodGhpcykpO1xyXG4gICAgXHR9O1xyXG5cclxuICAgICAgICBwcml2YXRlIGluaXRTdHlsZSgpOiB2b2lkIHtcclxuICAgICAgICAgICAgaWYodHlwZW9mIHRoaXMuc3R5bGUgPT09ICd1bmRlZmluZWQnKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICBpZih0aGlzLnN0eWxlID09PSBudWxsKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICBpZih0eXBlb2YgdGhpcy5zdHlsZSA9PT0gJ3N0cmluZycgJiYgdGhpcy5zdHlsZS5sZW5ndGggPT09IDApXHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICAgICAgICBzdHlsZXIuaW5zdGFuY2UuYXBwbHlTdHlsZSh0aGlzKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICogIEFzc3VyZSB0aGF0IHRoaXMgaW5zdGFuY2UgaGFzIGFuIHZhbGlkIGh0bWwgYXR0cmlidXRlIGFuZCBpZiBub3QgbG9hZCBhbmQgc2V0IGl0LlxyXG4gICAgICAgICovXHJcbiAgICAgICAgcHJpdmF0ZSBpbml0SFRNTCgpOiBQcm9taXNlPGFueSxhbnk+IHtcclxuICAgICAgICAgICAgbGV0IHAgPSBuZXcgUHJvbWlzZSgpO1xyXG4gICAgICAgICAgICBsZXQgc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgICAgICAgICBpZih0eXBlb2YgdGhpcy5odG1sID09PSAndW5kZWZpbmVkJykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5odG1sID0gJyc7XHJcbiAgICAgICAgICAgICAgICBwLnJlc29sdmUoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGlmKHRoaXMuaHRtbC5pbmRleE9mKFwiLmh0bWxcIiwgdGhpcy5odG1sLmxlbmd0aCAtIFwiLmh0bWxcIi5sZW5ndGgpICE9PSAtMSkge1xyXG4gICAgICAgICAgICAgICAgICAgIEh0bWxQcm92aWRlci5nZXRIVE1MKHRoaXMubmFtZSlcclxuICAgICAgICAgICAgICAgICAgICAudGhlbigoaHRtbCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLmh0bWwgPSBodG1sO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwLnJlc29sdmUoKTtcclxuICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgICAgIC5jYXRjaChwLnJlamVjdCk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHAucmVzb2x2ZSgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gcDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByaXZhdGUgaW5pdFByb3BlcnRpZXMoKTogdm9pZCB7XHJcbiAgICAgICAgICAgIHRoaXMucHJvcGVydGllcy5mb3JFYWNoKGZ1bmN0aW9uKHByb3ApIHtcclxuICAgICAgICAgICAgICAgIGlmKHR5cGVvZiBwcm9wID09PSAnb2JqZWN0Jykge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucHJvcGVydGllc1twcm9wLm5hbWVdID0gdGhpcy5lbGVtZW50W3Byb3AubmFtZV0gfHwgdGhpcy5lbGVtZW50LmdldEF0dHJpYnV0ZShwcm9wLm5hbWUpIHx8IHByb3AuZGVmYXVsdDtcclxuICAgICAgICAgICAgICAgICAgICBpZih0aGlzLnByb3BlcnRpZXNbcHJvcC5uYW1lXSA9PT0gdW5kZWZpbmVkICYmIHByb3AucmVxdWlyZWQgPT09IHRydWUpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IGBQcm9wZXJ0eSAke3Byb3AubmFtZX0gaXMgcmVxdWlyZWQgYnV0IG5vdCBwcm92aWRlZGA7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIGlmKHR5cGVvZiBwcm9wID09PSAnc3RyaW5nJylcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnByb3BlcnRpZXNbcHJvcF0gPSB0aGlzLmVsZW1lbnRbcHJvcF0gfHwgdGhpcy5lbGVtZW50LmdldEF0dHJpYnV0ZShwcm9wKTtcclxuICAgICAgICAgICAgfS5iaW5kKHRoaXMpKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByaXZhdGUgaW5pdENoaWxkcmVuKCk6IHZvaWQge1xyXG4gICAgICAgICAgICBsZXQgY2hpbGRzID0gdGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJyonKTtcclxuICAgIFx0XHRmb3IobGV0IGMgPSAwOyBjIDwgY2hpbGRzLmxlbmd0aDsgYysrKSB7XHJcbiAgICBcdFx0XHRsZXQgY2hpbGQgPSBjaGlsZHNbY107XHJcbiAgICBcdFx0XHRpZihjaGlsZC5pZCkge1xyXG4gICAgXHRcdFx0XHR0aGlzLmNoaWxkcmVuW2NoaWxkLmlkXSA9IGNoaWxkO1xyXG4gICAgXHRcdFx0fVxyXG4gICAgXHRcdFx0aWYoY2hpbGQudGFnTmFtZSlcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNoaWxkcmVuW2NoaWxkLnRhZ05hbWVdID0gdGhpcy5jaGlsZHJlbltjaGlsZC50YWdOYW1lXSB8fCBbXTtcclxuICAgICAgICAgICAgICAgICg8RWxlbWVudFtdPnRoaXMuY2hpbGRyZW5bY2hpbGQudGFnTmFtZV0pLnB1c2goY2hpbGQpO1xyXG4gICAgXHRcdH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByaXZhdGUgaW5pdEF0dHJpYnV0ZXMoKTogdm9pZCB7XHJcbiAgICAgICAgICAgIHRoaXMuYXR0cmlidXRlc1xyXG4gICAgICAgICAgICAuZm9yRWFjaCgoYSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgbGV0IGF0dHIgPSBSZWdpc3RyeS5nZXRBdHRyaWJ1dGUoYSk7XHJcbiAgICAgICAgICAgICAgICBBcnJheS5wcm90b3R5cGUuZm9yRWFjaC5jYWxsKHRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKGAqWyR7YX1dYCksIChlOiBIVE1MRWxlbWVudCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCB2YWwgPSBlLmhhc093blByb3BlcnR5KGEpID8gZVthXSA6IGUuZ2V0QXR0cmlidXRlKGEpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKHR5cGVvZiB2YWwgPT09ICdzdHJpbmcnICYmIHZhbCA9PT0gJycpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbCA9IHZvaWQgMDtcclxuICAgICAgICAgICAgICAgICAgICBuZXcgYXR0cihlLCB2YWwpLnVwZGF0ZSgpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSBsb2FkUmVxdWlyZW1lbnRzKCkge1xyXG4gICAgXHRcdGxldCBjb21wb25lbnRzOiBhbnlbXSA9IHRoaXMucmVxdWlyZXNcclxuICAgICAgICAgICAgLmZpbHRlcigocmVxKSA9PiB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gIVJlZ2lzdHJ5Lmhhc0NvbXBvbmVudChyZXEpO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAubWFwKChyZXEpID0+IHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBSZWdpc3RyeS5sb2FkQ29tcG9uZW50KHJlcSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuXHJcbiAgICAgICAgICAgIGxldCBhdHRyaWJ1dGVzOiBhbnlbXSA9IHRoaXMuYXR0cmlidXRlc1xyXG4gICAgICAgICAgICAuZmlsdGVyKChyZXEpID0+IHtcclxuICAgICAgICAgICAgICAgIHJldHVybiAhUmVnaXN0cnkuaGFzQXR0cmlidXRlKHJlcSk7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5tYXAoKHJlcSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFJlZ2lzdHJ5LmxvYWRBdHRyaWJ1dGUocmVxKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG5cclxuICAgICAgICAgICAgbGV0IHByb21pc2VzID0gY29tcG9uZW50cy5jb25jYXQoYXR0cmlidXRlcyk7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5hbGwocHJvbWlzZXMpO1xyXG4gICAgXHR9O1xyXG5cclxuICAgICAgICAvKlxyXG4gICAgICAgIHN0YXRpYyByZWdpc3RlcihjOiB0eXBlb2YgQ29tcG9uZW50KTogdm9pZCB7XHJcbiAgICAgICAgICAgIFJlZ2lzdHJ5LnJlZ2lzdGVyKGMpO1xyXG4gICAgICAgIH1cclxuICAgICAgICAqL1xyXG5cclxuICAgICAgICAvKlxyXG4gICAgICAgIHN0YXRpYyBydW4ob3B0PzogYW55KSB7XHJcbiAgICAgICAgICAgIFJlZ2lzdHJ5LnNldE9wdGlvbnMob3B0KTtcclxuICAgICAgICAgICAgUmVnaXN0cnkucnVuKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgICovXHJcblxyXG4gICAgICAgIHN0YXRpYyBnZXRDb21wb25lbnQoZWxlbWVudDogQ29tcG9uZW50RWxlbWVudCk6IENvbXBvbmVudCB7XHJcbiAgICAgICAgICAgIHdoaWxlKCFlbGVtZW50LmNvbXBvbmVudClcclxuICAgIFx0XHRcdGVsZW1lbnQgPSA8Q29tcG9uZW50RWxlbWVudD5lbGVtZW50LnBhcmVudE5vZGU7XHJcbiAgICBcdFx0cmV0dXJuIGVsZW1lbnQuY29tcG9uZW50O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc3RhdGljIGdldE5hbWUoY2xheno6IHR5cGVvZiBDb21wb25lbnQpOiBzdHJpbmc7XHJcbiAgICAgICAgc3RhdGljIGdldE5hbWUoY2xheno6IENvbXBvbmVudCk6IHN0cmluZztcclxuICAgICAgICBzdGF0aWMgZ2V0TmFtZShjbGF6ejogKHR5cGVvZiBDb21wb25lbnQpIHwgKENvbXBvbmVudCkpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICBpZihjbGF6eiBpbnN0YW5jZW9mIENvbXBvbmVudClcclxuICAgICAgICAgICAgICAgIHJldHVybiBjbGF6ei5jb25zdHJ1Y3Rvci50b1N0cmluZygpLm1hdGNoKC9cXHcrL2cpWzFdO1xyXG4gICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gY2xhenoudG9TdHJpbmcoKS5tYXRjaCgvXFx3Ky9nKVsxXTtcclxuICAgICAgICB9XHJcblxyXG5cclxuICAgIH1cclxufVxyXG4iLCJtb2R1bGUgaG8uZmx1eCB7XG5cblx0ZXhwb3J0IGNsYXNzIENhbGxiYWNrSG9sZGVyIHtcblxuXHRcdHByb3RlY3RlZCBwcmVmaXg6IHN0cmluZyA9ICdJRF8nO1xuICAgIFx0cHJvdGVjdGVkIGxhc3RJRDogbnVtYmVyID0gMTtcblx0XHRwcm90ZWN0ZWQgY2FsbGJhY2tzOiB7W2tleTpzdHJpbmddOkZ1bmN0aW9ufSA9IHt9O1xuXG5cdFx0cHVibGljIHJlZ2lzdGVyKGNhbGxiYWNrOiBGdW5jdGlvbiwgc2VsZj86IGFueSk6IHN0cmluZyB7XG4gICAgXHRcdGxldCBpZCA9IHRoaXMucHJlZml4ICsgdGhpcy5sYXN0SUQrKztcbiAgICBcdFx0dGhpcy5jYWxsYmFja3NbaWRdID0gc2VsZiA/IGNhbGxiYWNrLmJpbmQoc2VsZikgOiBjYWxsYmFjaztcbiAgICBcdFx0cmV0dXJuIGlkO1xuICBcdFx0fVxuXG4gIFx0XHRwdWJsaWMgdW5yZWdpc3RlcihpZCkge1xuICAgICAgXHRcdGlmKCF0aGlzLmNhbGxiYWNrc1tpZF0pXG5cdFx0XHRcdHRocm93ICdDb3VsZCBub3QgdW5yZWdpc3RlciBjYWxsYmFjayBmb3IgaWQgJyArIGlkO1xuICAgIFx0XHRkZWxldGUgdGhpcy5jYWxsYmFja3NbaWRdO1xuICBcdFx0fTtcblx0fVxufVxuIiwiXG5tb2R1bGUgaG8uZmx1eCB7XG5cdGltcG9ydCBQcm9taXNlID0gaG8ucHJvbWlzZS5Qcm9taXNlO1xuXG5cblx0ZXhwb3J0IGludGVyZmFjZSBJU3RhdGUge1xuXHRcdG5hbWU6IHN0cmluZztcblx0XHR1cmw6IHN0cmluZztcblx0XHRyZWRpcmVjdD86IHN0cmluZztcblx0XHRiZWZvcmU/OiAoZGF0YTogSVJvdXRlRGF0YSk9PlByb21pc2U8YW55LCBhbnk+O1xuXHRcdHZpZXc/OiBBcnJheTxJVmlld1N0YXRlPjtcblx0fVxuXG5cdGV4cG9ydCBpbnRlcmZhY2UgSVZpZXdTdGF0ZSB7XG5cdCAgICBuYW1lOiBzdHJpbmc7XG5cdFx0aHRtbDogc3RyaW5nO1xuXHR9XG5cblx0ZXhwb3J0IGludGVyZmFjZSBJU3RhdGVzIHtcblx0ICAgIHN0YXRlczogQXJyYXk8SVN0YXRlPjtcblx0fVxuXG59XG4iLCJcbm1vZHVsZSBoby5mbHV4LnN0YXRlcHJvdmlkZXIge1xuXHRpbXBvcnQgUHJvbWlzZSA9IGhvLnByb21pc2UuUHJvbWlzZTtcblxuICAgIGV4cG9ydCBpbnRlcmZhY2UgSVN0YXRlUHJvdmlkZXIge1xuICAgICAgICB1c2VNaW46Ym9vbGVhbjtcblx0XHRyZXNvbHZlKCk6IHN0cmluZztcblx0XHRnZXRTdGF0ZXMobmFtZT86c3RyaW5nKTogUHJvbWlzZTxJU3RhdGVzLCBzdHJpbmc+O1xuICAgIH1cblxuXHRjbGFzcyBTdGF0ZVByb3ZpZGVyIGltcGxlbWVudHMgSVN0YXRlUHJvdmlkZXIge1xuXG4gICAgICAgIHVzZU1pbjogYm9vbGVhbiA9IGZhbHNlO1xuXG4gICAgICAgIHJlc29sdmUoKTogc3RyaW5nIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnVzZU1pbiA/XG4gICAgICAgICAgICAgICAgYHN0YXRlcy5taW4uanNgIDpcbiAgICAgICAgICAgICAgICBgc3RhdGVzLmpzYDtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldFN0YXRlcyhuYW1lID0gXCJTdGF0ZXNcIik6IFByb21pc2U8SVN0YXRlcywgc3RyaW5nPiB7XG5cdFx0XHRyZXR1cm4gbmV3IFByb21pc2U8SVN0YXRlcywgYW55PigocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG5cdFx0XHRcdGxldCBzcmMgPSB0aGlzLnJlc29sdmUoKTtcbiAgICAgICAgICAgICAgICBsZXQgc2NyaXB0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc2NyaXB0Jyk7XG4gICAgICAgICAgICAgICAgc2NyaXB0Lm9ubG9hZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKG5ldyB3aW5kb3dbbmFtZV0pO1xuICAgICAgICAgICAgICAgIH07XG5cdFx0XHRcdHNjcmlwdC5vbmVycm9yID0gKGUpID0+IHtcblx0XHRcdFx0XHRyZWplY3QoZSk7XG5cdFx0XHRcdH07XG4gICAgICAgICAgICAgICAgc2NyaXB0LnNyYyA9IHNyYztcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnaGVhZCcpWzBdLmFwcGVuZENoaWxkKHNjcmlwdCk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICBleHBvcnQgbGV0IGluc3RhbmNlOiBJU3RhdGVQcm92aWRlciA9IG5ldyBTdGF0ZVByb3ZpZGVyKCk7XG59XG4iLCJcbm1vZHVsZSBoby5mbHV4LnN0b3JlcHJvdmlkZXIge1xuXHRpbXBvcnQgUHJvbWlzZSA9IGhvLnByb21pc2UuUHJvbWlzZTtcblxuICAgIGV4cG9ydCBpbnRlcmZhY2UgSVN0b3JlUHJvdmlkZXIge1xuICAgICAgICB1c2VNaW46Ym9vbGVhbjtcblx0XHRyZXNvbHZlKG5hbWU6c3RyaW5nKTogc3RyaW5nO1xuXHRcdGdldFN0b3JlKG5hbWU6c3RyaW5nKTogUHJvbWlzZTx0eXBlb2YgU3RvcmUsIHN0cmluZz47XG4gICAgfVxuXG5cdGV4cG9ydCBsZXQgbWFwcGluZzoge1tuYW1lOnN0cmluZ106c3RyaW5nfSA9IHt9O1xuXG5cdGNsYXNzIFN0b3JlUHJvdmlkZXIgaW1wbGVtZW50cyBJU3RvcmVQcm92aWRlciB7XG5cbiAgICAgICAgdXNlTWluOiBib29sZWFuID0gZmFsc2U7XG5cbiAgICAgICAgcmVzb2x2ZShuYW1lOiBzdHJpbmcpOiBzdHJpbmcge1xuXG5cdFx0XHRpZighIW1hcHBpbmdbbmFtZV0pXG4gICAgICAgICAgICAgICAgcmV0dXJuIG1hcHBpbmdbbmFtZV07XG5cblx0XHRcdGlmKGhvLmZsdXguZGlyKSB7XG4gICAgICAgICAgICAgICAgbmFtZSArPSAnLicgKyBuYW1lLnNwbGl0KCcuJykucG9wKCk7XG4gICAgICAgICAgICB9XG5cblx0XHRcdG5hbWUgPSBuYW1lLnNwbGl0KCcuJykuam9pbignLycpO1xuXG5cdFx0XHRyZXR1cm4gdGhpcy51c2VNaW4gP1xuICAgICAgICAgICAgICAgIGBzdG9yZXMvJHtuYW1lfS5taW4uanNgIDpcbiAgICAgICAgICAgICAgICBgc3RvcmVzLyR7bmFtZX0uanNgO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0U3RvcmUobmFtZTogc3RyaW5nKTogUHJvbWlzZTx0eXBlb2YgU3RvcmUsIHN0cmluZz4ge1xuICAgICAgICAgICAgaWYod2luZG93W25hbWVdICE9PSB1bmRlZmluZWQgJiYgd2luZG93W25hbWVdLnByb3RvdHlwZSBpbnN0YW5jZW9mIFN0b3JlKVxuXHRcdFx0XHRyZXR1cm4gUHJvbWlzZS5jcmVhdGUod2luZG93W25hbWVdKTtcblxuXHRcdFx0cmV0dXJuIG5ldyBQcm9taXNlPHR5cGVvZiBTdG9yZSwgYW55PigocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICAgICAgbGV0IHNyYyA9IHRoaXMucmVzb2x2ZShuYW1lKTtcbiAgICAgICAgICAgICAgICBsZXQgc2NyaXB0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc2NyaXB0Jyk7XG4gICAgICAgICAgICAgICAgc2NyaXB0Lm9ubG9hZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICBpZih0eXBlb2YgdGhpcy5nZXQobmFtZSkgPT09ICdmdW5jdGlvbicpXG4gICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKHRoaXMuZ2V0KG5hbWUpKTtcbiAgICAgICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICAgICAgcmVqZWN0KGBFcnJvciB3aGlsZSBsb2FkaW5nIFN0b3JlICR7bmFtZX1gKVxuICAgICAgICAgICAgICAgIH0uYmluZCh0aGlzKTtcbiAgICAgICAgICAgICAgICBzY3JpcHQuc3JjID0gc3JjO1xuICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdoZWFkJylbMF0uYXBwZW5kQ2hpbGQoc2NyaXB0KTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIH1cblxuXHRcdHByaXZhdGUgZ2V0KG5hbWU6IHN0cmluZyk6IHR5cGVvZiBTdG9yZSB7XG4gICAgICAgICAgICBsZXQgYzogYW55ID0gd2luZG93O1xuICAgICAgICAgICAgbmFtZS5zcGxpdCgnLicpLmZvckVhY2goKHBhcnQpID0+IHtcbiAgICAgICAgICAgICAgICBjID0gY1twYXJ0XTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIDx0eXBlb2YgU3RvcmU+YztcbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgZXhwb3J0IGxldCBpbnN0YW5jZTogSVN0b3JlUHJvdmlkZXIgPSBuZXcgU3RvcmVQcm92aWRlcigpO1xufVxuIiwiXG5tb2R1bGUgaG8uZmx1eCB7XG5cdGltcG9ydCBQcm9taXNlID0gaG8ucHJvbWlzZS5Qcm9taXNlO1xuXG5cdGV4cG9ydCBjbGFzcyBTdG9yZXJlZ2lzdHJ5IHtcblxuXHRcdHByaXZhdGUgc3RvcmVzOiB7W2tleTogc3RyaW5nXTogU3RvcmU8YW55Pn0gPSB7fTtcblxuXHRcdHB1YmxpYyByZWdpc3RlcihzdG9yZTogU3RvcmU8YW55Pik6IFN0b3JlPGFueT4ge1xuXHRcdFx0dGhpcy5zdG9yZXNbc3RvcmUubmFtZV0gPSBzdG9yZTtcblx0XHRcdHJldHVybiBzdG9yZTtcblx0XHR9XG5cblx0XHRwdWJsaWMgZ2V0PFQgZXh0ZW5kcyBTdG9yZTxhbnk+PihzdG9yZUNsYXNzOiB7bmV3KCk6VH0pOiBUIHtcblx0XHRcdGxldCBuYW1lID0gc3RvcmVDbGFzcy50b1N0cmluZygpLm1hdGNoKC9cXHcrL2cpWzFdO1xuXHRcdFx0cmV0dXJuIDxUPnRoaXMuc3RvcmVzW25hbWVdO1xuXHRcdH1cblxuXHRcdHB1YmxpYyBsb2FkU3RvcmUobmFtZTogc3RyaW5nKTogUHJvbWlzZTxTdG9yZTxhbnk+LCBzdHJpbmc+IHtcblxuXHRcdFx0bGV0IHNlbGYgPSB0aGlzO1xuXG5cdFx0ICAgXHRsZXQgcmV0ID0gdGhpcy5nZXRQYXJlbnRPZlN0b3JlKG5hbWUpXG5cdFx0ICAgXHQudGhlbigocGFyZW50KSA9PiB7XG5cdFx0XHQgICBcdGlmKHNlbGYuc3RvcmVzW3BhcmVudF0gaW5zdGFuY2VvZiBTdG9yZSB8fCBwYXJlbnQgPT09ICdoby5mbHV4LlN0b3JlJylcblx0XHRcdFx0ICAgXHRyZXR1cm4gdHJ1ZTtcblx0ICAgXHRcdFx0ZWxzZVxuXHRcdFx0ICAgXHRcdHJldHVybiBzZWxmLmxvYWRTdG9yZShwYXJlbnQpO1xuXHRcdCAgIFx0fSlcblx0XHQgICBcdC50aGVuKChwYXJlbnRUeXBlKSA9PiB7XG5cdFx0XHQgICBcdHJldHVybiBoby5mbHV4LnN0b3JlcHJvdmlkZXIuaW5zdGFuY2UuZ2V0U3RvcmUobmFtZSk7XG5cdFx0ICAgXHR9KVxuXHRcdCAgIFx0LnRoZW4oKHN0b3JlQ2xhc3MpID0+IHtcblx0XHRcdCAgIFx0cmV0dXJuIHNlbGYucmVnaXN0ZXIobmV3IHN0b3JlQ2xhc3MpLmluaXQoKTtcblx0XHQgICBcdH0pXG5cdFx0XHQudGhlbigoKT0+e1xuXHRcdFx0ICAgXHRyZXR1cm4gc2VsZi5zdG9yZXNbbmFtZV07XG5cdFx0XHR9KTtcblxuXHRcdFx0cmV0dXJuIHJldDtcblxuXHRcdFx0Lypcblx0XHRcdHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcblx0XHRcdFx0aWYodGhpcy5nZXQobmFtZSkgaW5zdGFuY2VvZiBTdG9yZSlcblx0XHRcdFx0XHRyZXNvbHZlKHRoaXMuZ2V0KG5hbWUpKVxuXHRcdFx0XHRlbHNlIHtcblxuXHRcdFx0XHRcdHN0b3JlcHJvdmlkZXIuaW5zdGFuY2UuZ2V0U3RvcmUobmFtZSlcblx0XHRcdFx0XHQudGhlbigoc3RvcmVDbGFzcykgPT4ge1xuXHRcdFx0XHRcdFx0dGhpcy5yZWdpc3RlcihuZXcgc3RvcmVDbGFzcygpKTtcblx0XHRcdFx0XHRcdHJlc29sdmUodGhpcy5nZXQobmFtZSkpO1xuXHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0LmNhdGNoKHJlamVjdCk7XG5cdFx0XHRcdH1cblxuXHRcdFx0fS5iaW5kKHRoaXMpKTtcblx0XHRcdCovXG5cblx0XHRcdC8qXG5cdFx0XHRpZihTVE9SRVNbbmFtZV0gIT09IHVuZGVmaW5lZCAmJiBTVE9SRVNbbmFtZV0gaW5zdGFuY2VvZiBTdG9yZSlcblx0XHRcdFx0cmV0dXJuIFByb21pc2UuY3JlYXRlKFNUT1JFU1tuYW1lXSk7XG5cdFx0XHRlbHNlIHtcblx0XHRcdFx0cmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcblx0XHRcdFx0XHRzdG9yZXByb3ZpZGVyLmluc3RhbmNlLmdldFN0b3JlKG5hbWUpXG5cdFx0XHRcdFx0LnRoZW4oKHMpPT57cmVzb2x2ZShzKTt9KVxuXHRcdFx0XHRcdC5jYXRjaCgoZSk9PntyZWplY3QoZSk7fSk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXHRcdFx0Ki9cblxuXHRcdH1cblxuXHRcdHByb3RlY3RlZCBnZXRQYXJlbnRPZlN0b3JlKG5hbWU6IHN0cmluZyk6IFByb21pc2U8c3RyaW5nLCBhbnk+IHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG5cbiAgICAgICAgICAgICAgICBsZXQgeG1saHR0cCA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICAgICAgICAgICAgICAgIHhtbGh0dHAub25yZWFkeXN0YXRlY2hhbmdlID0gKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZih4bWxodHRwLnJlYWR5U3RhdGUgPT0gNCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHJlc3AgPSB4bWxodHRwLnJlc3BvbnNlVGV4dDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKHhtbGh0dHAuc3RhdHVzID09IDIwMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBtID0gcmVzcC5tYXRjaCgvfVxcKVxcKCguKilcXCk7Lyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYobSAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKG1bMV0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShudWxsKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlamVjdChyZXNwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgIHhtbGh0dHAub3BlbignR0VUJywgaG8uZmx1eC5zdG9yZXByb3ZpZGVyLmluc3RhbmNlLnJlc29sdmUobmFtZSkpO1xuICAgICAgICAgICAgICAgIHhtbGh0dHAuc2VuZCgpO1xuXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXHR9XG5cbn1cbiIsIlxubW9kdWxlIGhvLmZsdXgge1xuXG5cdGV4cG9ydCBjbGFzcyBTdG9yZTxUPiBleHRlbmRzIENhbGxiYWNrSG9sZGVyIHtcblxuXHRcdHByb3RlY3RlZCBkYXRhOiBUO1xuXHRcdHByaXZhdGUgaWQ6IHN0cmluZztcblx0XHRwcml2YXRlIGhhbmRsZXJzOiB7W2tleTogc3RyaW5nXTogRnVuY3Rpb259ID0ge307XG5cblxuXHRcdGNvbnN0cnVjdG9yKCkge1xuXHRcdFx0c3VwZXIoKTtcblx0XHRcdHRoaXMuaWQgPSBoby5mbHV4LkRJU1BBVENIRVIucmVnaXN0ZXIodGhpcy5oYW5kbGUuYmluZCh0aGlzKSk7XG5cdFx0XHQvL2hvLmZsdXguU1RPUkVTW3RoaXMubmFtZV0gPSB0aGlzO1xuXHRcdFx0aG8uZmx1eC5TVE9SRVMucmVnaXN0ZXIodGhpcyk7XG5cdFx0fVxuXG5cdFx0cHVibGljIGluaXQoKTogYW55IHt9XG5cblx0XHQgZ2V0IG5hbWUoKTogc3RyaW5nIHtcblx0XHRcdHJldHVybiB0aGlzLmNvbnN0cnVjdG9yLnRvU3RyaW5nKCkubWF0Y2goL1xcdysvZylbMV07XG5cdFx0fVxuXG5cdFx0cHVibGljIHJlZ2lzdGVyKGNhbGxiYWNrOiAoZGF0YTpUKT0+dm9pZCwgc2VsZj86YW55KTogc3RyaW5nIHtcblx0XHRcdHJldHVybiBzdXBlci5yZWdpc3RlcihjYWxsYmFjaywgc2VsZik7XG5cdFx0fVxuXG5cdFx0cHJvdGVjdGVkIG9uKHR5cGU6IHN0cmluZywgZnVuYzogRnVuY3Rpb24pOiB2b2lkIHtcblx0XHRcdHRoaXMuaGFuZGxlcnNbdHlwZV0gPSBmdW5jO1xuXHRcdH1cblxuXHRcdHByb3RlY3RlZCBoYW5kbGUoYWN0aW9uOiBJQWN0aW9uKTogdm9pZCB7XG5cdFx0XHRpZih0eXBlb2YgdGhpcy5oYW5kbGVyc1thY3Rpb24udHlwZV0gPT09ICdmdW5jdGlvbicpXG5cdFx0XHRcdHRoaXMuaGFuZGxlcnNbYWN0aW9uLnR5cGVdKGFjdGlvbi5kYXRhKTtcblx0XHR9O1xuXG5cblx0XHRwcm90ZWN0ZWQgY2hhbmdlZCgpOiB2b2lkIHtcblx0XHRcdGZvciAobGV0IGlkIGluIHRoaXMuY2FsbGJhY2tzKSB7XG5cdFx0XHQgIGxldCBjYiA9IHRoaXMuY2FsbGJhY2tzW2lkXTtcblx0XHRcdCAgaWYoY2IpXG5cdFx0XHQgIFx0Y2IodGhpcy5kYXRhKTtcblx0XHRcdH1cblx0XHR9XG5cblxuXHR9O1xuXG5cbn1cbiIsIlxuXG5tb2R1bGUgaG8uZmx1eCB7XG5cblx0aW1wb3J0IFByb21pc2UgPSBoby5wcm9taXNlLlByb21pc2U7XG5cblxuXHQvKiogRGF0YSB0aGF0IGEgUm91dGVyI2dvIHRha2VzICovXG5cdGV4cG9ydCBpbnRlcmZhY2UgSVJvdXRlRGF0YSB7XG5cdCAgICBzdGF0ZTogc3RyaW5nO1xuXHRcdGFyZ3M6IGFueTtcblx0XHRleHRlcm46IGJvb2xlYW47XG5cdH1cblxuXHQvKiogRGF0YSB0aGF0IFJvdXRlciNjaGFuZ2VzIGVtaXQgdG8gaXRzIGxpc3RlbmVycyAqL1xuXHRleHBvcnQgaW50ZXJmYWNlIElSb3V0ZXJEYXRhIHtcblx0ICAgIHN0YXRlOiBJU3RhdGU7XG5cdFx0YXJnczogYW55O1xuXHRcdGV4dGVybjogYm9vbGVhbjtcblx0fVxuXG5cdGV4cG9ydCBjbGFzcyBSb3V0ZXIgZXh0ZW5kcyBTdG9yZTxJUm91dGVyRGF0YT4ge1xuXG5cdFx0cHJpdmF0ZSBtYXBwaW5nOkFycmF5PElTdGF0ZT4gPSBudWxsO1xuXHRcdC8vcHJpdmF0ZSBzdGF0ZTpJU3RhdGU7XG5cdFx0Ly9wcml2YXRlIGFyZ3M6YW55ID0gbnVsbDtcblxuXHRcdGNvbnN0cnVjdG9yKCkge1xuXHRcdFx0c3VwZXIoKTtcblx0XHR9XG5cblx0XHRwdWJsaWMgaW5pdCgpOiBQcm9taXNlPGFueSwgYW55PiB7XG5cdFx0XHR0aGlzLm9uKCdTVEFURScsIHRoaXMub25TdGF0ZUNoYW5nZVJlcXVlc3RlZC5iaW5kKHRoaXMpKTtcblxuXHRcdFx0bGV0IG9uSGFzaENoYW5nZSA9IHRoaXMub25IYXNoQ2hhbmdlLmJpbmQodGhpcyk7XG5cblx0XHRcdHJldHVybiB0aGlzLmluaXRTdGF0ZXMoKVxuXHRcdFx0LnRoZW4oKCkgPT4ge1xuXHRcdFx0XHR3aW5kb3cub25oYXNoY2hhbmdlID0gb25IYXNoQ2hhbmdlO1xuXHRcdFx0XHRvbkhhc2hDaGFuZ2UoKTtcblx0XHRcdH0pO1xuXHRcdH1cblxuXG5cdFx0cHVibGljIGdvKGRhdGE6IElSb3V0ZURhdGEpOiB2b2lkIHtcblx0XHRcdGhvLmZsdXguRElTUEFUQ0hFUi5kaXNwYXRjaCh7XG5cdFx0XHRcdHR5cGU6ICdTVEFURScsXG5cdFx0XHRcdGRhdGE6IGRhdGFcblx0XHRcdH0pO1xuXHRcdH1cblxuXHRcdHByaXZhdGUgaW5pdFN0YXRlcygpOiBQcm9taXNlPGFueSwgYW55PiB7XG5cdFx0XHRyZXR1cm4gc3RhdGVwcm92aWRlci5pbnN0YW5jZS5nZXRTdGF0ZXMoKVxuXHRcdFx0LnRoZW4oZnVuY3Rpb24oaXN0YXRlcykge1xuXHRcdFx0XHR0aGlzLm1hcHBpbmcgPSBpc3RhdGVzLnN0YXRlcztcblx0XHRcdH0uYmluZCh0aGlzKSk7XG5cdFx0fVxuXG5cdFx0cHJpdmF0ZSBnZXRTdGF0ZUZyb21OYW1lKG5hbWU6IHN0cmluZyk6IElTdGF0ZSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5tYXBwaW5nLmZpbHRlcigocyk9Pntcblx0XHRcdFx0cmV0dXJuIHMubmFtZSA9PT0gbmFtZVxuXHRcdFx0fSlbMF07XG5cdFx0fVxuXG5cdFx0cHJvdGVjdGVkIG9uU3RhdGVDaGFuZ2VSZXF1ZXN0ZWQoZGF0YTogSVJvdXRlRGF0YSk6IHZvaWQge1xuXHRcdFx0Ly9jdXJyZW50IHN0YXRlIGFuZCBhcmdzIGVxdWFscyByZXF1ZXN0ZWQgc3RhdGUgYW5kIGFyZ3MgLT4gcmV0dXJuXG5cdFx0XHQvL2lmKHRoaXMuc3RhdGUgJiYgdGhpcy5zdGF0ZS5uYW1lID09PSBkYXRhLnN0YXRlICYmIHRoaXMuZXF1YWxzKHRoaXMuYXJncywgZGF0YS5hcmdzKSlcblx0XHRcdGlmKHRoaXMuZGF0YSAmJiB0aGlzLmRhdGEuc3RhdGUgJiYgdGhpcy5kYXRhLnN0YXRlLm5hbWUgPT09IGRhdGEuc3RhdGUgJiYgdGhpcy5lcXVhbHModGhpcy5kYXRhLmFyZ3MsIGRhdGEuYXJncykpXG5cdFx0XHRcdHJldHVybjtcblxuXHRcdFx0Ly9nZXQgcmVxdWVzdGVkIHN0YXRlXG5cdFx0XHRsZXQgc3RhdGUgPSB0aGlzLmdldFN0YXRlRnJvbU5hbWUoZGF0YS5zdGF0ZSk7XG5cblxuXHRcdFx0Ly9yZXF1ZXN0ZWQgc3RhdGUgaGFzIGFuIHJlZGlyZWN0IHByb3BlcnR5IC0+IGNhbGwgcmVkaXJlY3Qgc3RhdGVcblx0XHRcdGlmKCEhc3RhdGUucmVkaXJlY3QpIHtcblx0XHRcdFx0c3RhdGUgPSB0aGlzLmdldFN0YXRlRnJvbU5hbWUoc3RhdGUucmVkaXJlY3QpO1xuXHRcdFx0fVxuXG5cblx0XHRcdC8vVE9ETyBoYW5kbGVyIHByb21pc2VzXG5cdFx0XHRsZXQgcHJvbSA9IHR5cGVvZiBzdGF0ZS5iZWZvcmUgPT09ICdmdW5jdGlvbicgPyBzdGF0ZS5iZWZvcmUoZGF0YSkgOiBQcm9taXNlLmNyZWF0ZSh1bmRlZmluZWQpO1xuXHRcdFx0cHJvbVxuXHRcdFx0LnRoZW4oZnVuY3Rpb24oKSB7XG5cblx0XHRcdFx0Ly9kb2VzIHRoZSBzdGF0ZSBjaGFuZ2UgcmVxdWVzdCBjb21lcyBmcm9tIGV4dGVybiBlLmcuIHVybCBjaGFuZ2UgaW4gYnJvd3NlciB3aW5kb3cgP1xuXHRcdFx0XHRsZXQgZXh0ZXJuID0gISEgZGF0YS5leHRlcm47XG5cblx0XHRcdFx0Ly8tLS0tLS0tIHNldCBjdXJyZW50IHN0YXRlICYgYXJndW1lbnRzXG5cdFx0XHRcdC8vdGhpcy5zdGF0ZSA9IHN0YXRlO1xuXHRcdFx0XHQvL3RoaXMuYXJncyA9IGRhdGEuYXJncztcblxuXHRcdFx0XHR0aGlzLmRhdGEgPSB7XG5cdFx0XHRcdFx0c3RhdGU6IHN0YXRlLFxuXHRcdFx0XHRcdGFyZ3M6IGRhdGEuYXJncyxcblx0XHRcdFx0XHRleHRlcm46IGV4dGVybixcblx0XHRcdFx0fTtcblxuXHRcdFx0XHQvLy0tLS0tLS0gc2V0IHVybCBmb3IgYnJvd3NlclxuXHRcdFx0XHR2YXIgdXJsID0gdGhpcy51cmxGcm9tU3RhdGUoc3RhdGUudXJsLCBkYXRhLmFyZ3MpO1xuXHRcdFx0XHR0aGlzLnNldFVybCh1cmwpO1xuXG5cdFx0XHRcdHRoaXMuY2hhbmdlZCgpO1xuXG5cdFx0XHR9LmJpbmQodGhpcyksXG5cdFx0XHRmdW5jdGlvbihkYXRhKSB7XG5cdFx0XHRcdHRoaXMub25TdGF0ZUNoYW5nZVJlcXVlc3RlZChkYXRhKTtcblx0XHRcdH0uYmluZCh0aGlzKSk7XG5cblx0XHR9XG5cblx0XHRwcml2YXRlIG9uSGFzaENoYW5nZSgpOiB2b2lkIHtcblx0XHRcdGxldCBzID0gdGhpcy5zdGF0ZUZyb21Vcmwod2luZG93LmxvY2F0aW9uLmhhc2guc3Vic3RyKDEpKTtcblxuXHRcdFx0aG8uZmx1eC5ESVNQQVRDSEVSLmRpc3BhdGNoKHtcblx0XHRcdFx0dHlwZTogJ1NUQVRFJyxcblx0XHRcdFx0ZGF0YToge1xuXHRcdFx0XHRcdHN0YXRlOiBzLnN0YXRlLFxuXHRcdFx0XHRcdGFyZ3M6IHMuYXJncyxcblx0XHRcdFx0XHRleHRlcm46IHRydWUsXG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdH1cblxuXHRcdHByaXZhdGUgc2V0VXJsKHVybDogc3RyaW5nKTogdm9pZCB7XG5cdFx0XHRpZih3aW5kb3cubG9jYXRpb24uaGFzaC5zdWJzdHIoMSkgPT09IHVybClcblx0XHRcdFx0cmV0dXJuO1xuXG5cdFx0XHRsZXQgbCA9IHdpbmRvdy5vbmhhc2hjaGFuZ2U7XG5cdFx0XHR3aW5kb3cub25oYXNoY2hhbmdlID0gbnVsbDtcblx0XHRcdHdpbmRvdy5sb2NhdGlvbi5oYXNoID0gdXJsO1xuXHRcdFx0d2luZG93Lm9uaGFzaGNoYW5nZSA9IGw7XG5cdFx0fVxuXG5cdFx0cHJpdmF0ZSByZWdleEZyb21VcmwodXJsOiBzdHJpbmcpOiBzdHJpbmcge1xuXHRcdFx0dmFyIHJlZ2V4ID0gLzooW1xcd10rKS87XG5cdFx0XHR3aGlsZSh1cmwubWF0Y2gocmVnZXgpKSB7XG5cdFx0XHRcdHVybCA9IHVybC5yZXBsYWNlKHJlZ2V4LCBcIihbXlxcL10rKVwiKTtcblx0XHRcdH1cblx0XHRcdHJldHVybiB1cmwrJyQnO1xuXHRcdH1cblxuXHRcdHByaXZhdGUgYXJnc0Zyb21VcmwocGF0dGVybjogc3RyaW5nLCB1cmw6IHN0cmluZyk6IGFueSB7XG5cdFx0XHRsZXQgciA9IHRoaXMucmVnZXhGcm9tVXJsKHBhdHRlcm4pO1xuXHRcdFx0bGV0IG5hbWVzID0gcGF0dGVybi5tYXRjaChyKS5zbGljZSgxKTtcblx0XHRcdGxldCB2YWx1ZXMgPSB1cmwubWF0Y2gocikuc2xpY2UoMSk7XG5cblx0XHRcdGxldCBhcmdzID0ge307XG5cdFx0XHRuYW1lcy5mb3JFYWNoKGZ1bmN0aW9uKG5hbWUsIGkpIHtcblx0XHRcdFx0YXJnc1tuYW1lLnN1YnN0cigxKV0gPSB2YWx1ZXNbaV07XG5cdFx0XHR9KTtcblxuXHRcdFx0cmV0dXJuIGFyZ3M7XG5cdFx0fVxuXG5cdFx0cHJpdmF0ZSBzdGF0ZUZyb21VcmwodXJsOiBzdHJpbmcpOiBJUm91dGVEYXRhIHtcblx0XHRcdHZhciBzID0gdm9pZCAwO1xuXHRcdFx0dGhpcy5tYXBwaW5nLmZvckVhY2goKHN0YXRlOiBJU3RhdGUpID0+IHtcblx0XHRcdFx0aWYocylcblx0XHRcdFx0XHRyZXR1cm47XG5cblx0XHRcdFx0dmFyIHIgPSB0aGlzLnJlZ2V4RnJvbVVybChzdGF0ZS51cmwpO1xuXHRcdFx0XHRpZih1cmwubWF0Y2gocikpIHtcblx0XHRcdFx0XHR2YXIgYXJncyA9IHRoaXMuYXJnc0Zyb21Vcmwoc3RhdGUudXJsLCB1cmwpO1xuXHRcdFx0XHRcdHMgPSB7XG5cdFx0XHRcdFx0XHRcInN0YXRlXCI6IHN0YXRlLm5hbWUsXG5cdFx0XHRcdFx0XHRcImFyZ3NcIjogYXJncyxcblx0XHRcdFx0XHRcdFwiZXh0ZXJuXCI6IGZhbHNlXG5cdFx0XHRcdFx0fTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cblx0XHRcdGlmKCFzKVxuXHRcdFx0XHR0aHJvdyBcIk5vIFN0YXRlIGZvdW5kIGZvciB1cmwgXCIrdXJsO1xuXG5cdFx0XHRyZXR1cm4gcztcblx0XHR9XG5cblx0XHRwcml2YXRlIHVybEZyb21TdGF0ZSh1cmw6IHN0cmluZywgYXJnczogYW55KTogc3RyaW5nIHtcblx0XHRcdGxldCByZWdleCA9IC86KFtcXHddKykvO1xuXHRcdFx0d2hpbGUodXJsLm1hdGNoKHJlZ2V4KSkge1xuXHRcdFx0XHR1cmwgPSB1cmwucmVwbGFjZShyZWdleCwgZnVuY3Rpb24obSkge1xuXHRcdFx0XHRcdHJldHVybiBhcmdzW20uc3Vic3RyKDEpXTtcblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gdXJsO1xuXHRcdH1cblxuXHRcdHByaXZhdGUgZXF1YWxzKG8xOiBhbnksIG8yOiBhbnkpIDogYm9vbGVhbiB7XG5cdFx0XHRyZXR1cm4gSlNPTi5zdHJpbmdpZnkobzEpID09PSBKU09OLnN0cmluZ2lmeShvMik7XG5cdFx0fVxuXG5cdH1cbn1cbiIsIlxubW9kdWxlIGhvLmZsdXgge1xuXG5cdGV4cG9ydCBpbnRlcmZhY2UgSUFjdGlvbiB7XG5cdCAgICB0eXBlOnN0cmluZztcblx0XHRkYXRhPzphbnk7XG5cdH1cblxuXHRleHBvcnQgY2xhc3MgRGlzcGF0Y2hlciBleHRlbmRzIENhbGxiYWNrSG9sZGVyIHtcblxuICAgIFx0cHJpdmF0ZSBpc1BlbmRpbmc6IHtba2V5OnN0cmluZ106Ym9vbGVhbn0gPSB7fTtcbiAgICBcdHByaXZhdGUgaXNIYW5kbGVkOiB7W2tleTpzdHJpbmddOmJvb2xlYW59ID0ge307XG4gICAgXHRwcml2YXRlIGlzRGlzcGF0Y2hpbmc6IGJvb2xlYW4gPSBmYWxzZTtcbiAgICBcdHByaXZhdGUgcGVuZGluZ1BheWxvYWQ6IElBY3Rpb24gPSBudWxsO1xuXG5cdFx0cHVibGljIHdhaXRGb3IoLi4uaWRzOiBBcnJheTxudW1iZXI+KTogdm9pZCB7XG5cdFx0XHRpZighdGhpcy5pc0Rpc3BhdGNoaW5nKVxuXHRcdCAgXHRcdHRocm93ICdEaXNwYXRjaGVyLndhaXRGb3IoLi4uKTogTXVzdCBiZSBpbnZva2VkIHdoaWxlIGRpc3BhdGNoaW5nLic7XG5cblx0XHRcdGZvciAobGV0IGlpID0gMDsgaWkgPCBpZHMubGVuZ3RoOyBpaSsrKSB7XG5cdFx0XHQgIGxldCBpZCA9IGlkc1tpaV07XG5cblx0XHRcdCAgaWYgKHRoaXMuaXNQZW5kaW5nW2lkXSkge1xuXHRcdCAgICAgIFx0aWYoIXRoaXMuaXNIYW5kbGVkW2lkXSlcblx0XHRcdCAgICAgIFx0dGhyb3cgYHdhaXRGb3IoLi4uKTogQ2lyY3VsYXIgZGVwZW5kZW5jeSBkZXRlY3RlZCB3aGlsZSB3YXRpbmcgZm9yICR7aWR9YDtcblx0XHRcdFx0Y29udGludWU7XG5cdFx0XHQgIH1cblxuXHRcdFx0ICBpZighdGhpcy5jYWxsYmFja3NbaWRdKVxuXHRcdFx0ICBcdHRocm93IGB3YWl0Rm9yKC4uLik6ICR7aWR9IGRvZXMgbm90IG1hcCB0byBhIHJlZ2lzdGVyZWQgY2FsbGJhY2suYDtcblxuXHRcdFx0ICB0aGlzLmludm9rZUNhbGxiYWNrKGlkKTtcblx0XHRcdH1cblx0XHR9O1xuXG5cdFx0cHVibGljIGRpc3BhdGNoKGFjdGlvbjogSUFjdGlvbikge1xuXHRcdFx0aWYodGhpcy5pc0Rpc3BhdGNoaW5nKVxuXHRcdCAgICBcdHRocm93ICdDYW5ub3QgZGlzcGF0Y2ggaW4gdGhlIG1pZGRsZSBvZiBhIGRpc3BhdGNoLic7XG5cblx0XHRcdHRoaXMuc3RhcnREaXNwYXRjaGluZyhhY3Rpb24pO1xuXG5cdFx0ICAgIHRyeSB7XG5cdFx0ICAgICAgZm9yIChsZXQgaWQgaW4gdGhpcy5jYWxsYmFja3MpIHtcblx0XHQgICAgICAgIGlmICh0aGlzLmlzUGVuZGluZ1tpZF0pIHtcblx0XHQgICAgICAgICAgY29udGludWU7XG5cdFx0ICAgICAgICB9XG5cdFx0ICAgICAgICB0aGlzLmludm9rZUNhbGxiYWNrKGlkKTtcblx0XHQgICAgICB9XG5cdFx0ICAgIH0gZmluYWxseSB7XG5cdFx0ICAgICAgdGhpcy5zdG9wRGlzcGF0Y2hpbmcoKTtcblx0XHQgICAgfVxuXHRcdH07XG5cblx0ICBcdHByaXZhdGUgaW52b2tlQ2FsbGJhY2soaWQ6IG51bWJlcik6IHZvaWQge1xuXHQgICAgXHR0aGlzLmlzUGVuZGluZ1tpZF0gPSB0cnVlO1xuXHQgICAgXHR0aGlzLmNhbGxiYWNrc1tpZF0odGhpcy5wZW5kaW5nUGF5bG9hZCk7XG5cdCAgICBcdHRoaXMuaXNIYW5kbGVkW2lkXSA9IHRydWU7XG5cdCAgXHR9XG5cblx0ICBcdHByaXZhdGUgc3RhcnREaXNwYXRjaGluZyhwYXlsb2FkOiBJQWN0aW9uKTogdm9pZCB7XG5cdCAgICBcdGZvciAobGV0IGlkIGluIHRoaXMuY2FsbGJhY2tzKSB7XG5cdCAgICAgIFx0XHR0aGlzLmlzUGVuZGluZ1tpZF0gPSBmYWxzZTtcblx0ICAgICAgXHRcdHRoaXMuaXNIYW5kbGVkW2lkXSA9IGZhbHNlO1xuXHQgICAgXHR9XG5cdCAgICBcdHRoaXMucGVuZGluZ1BheWxvYWQgPSBwYXlsb2FkO1xuXHQgICAgXHR0aGlzLmlzRGlzcGF0Y2hpbmcgPSB0cnVlO1xuICBcdFx0fVxuXG5cdCAgXHRwcml2YXRlIHN0b3BEaXNwYXRjaGluZygpOiB2b2lkIHtcblx0ICAgIFx0dGhpcy5wZW5kaW5nUGF5bG9hZCA9IG51bGw7XG5cdCAgICBcdHRoaXMuaXNEaXNwYXRjaGluZyA9IGZhbHNlO1xuXHQgIFx0fVxuXHR9XG59XG4iLCJtb2R1bGUgaG8uZmx1eCB7XG5cdGltcG9ydCBQcm9taXNlID0gaG8ucHJvbWlzZS5Qcm9taXNlO1xuXG5cdGV4cG9ydCBsZXQgRElTUEFUQ0hFUjogRGlzcGF0Y2hlciA9IG5ldyBEaXNwYXRjaGVyKCk7XG5cblx0ZXhwb3J0IGxldCBTVE9SRVM6IFN0b3JlcmVnaXN0cnkgPSBuZXcgU3RvcmVyZWdpc3RyeSgpO1xuXG5cdGV4cG9ydCBsZXQgZGlyOiBib29sZWFuID0gZmFsc2U7XG5cblx0Ly9pZihoby5mbHV4LlNUT1JFUy5nZXQoUm91dGVyKSA9PT0gdW5kZWZpbmVkKVxuXHQvL1x0bmV3IFJvdXRlcigpO1xuXG5cdGV4cG9ydCBmdW5jdGlvbiBydW4oKTogUHJvbWlzZTxhbnksIGFueT4ge1xuXHRcdC8vcmV0dXJuICg8Um91dGVyPmhvLmZsdXguU1RPUkVTWydSb3V0ZXInXSkuaW5pdCgpO1xuXHRcdHJldHVybiBTVE9SRVMuZ2V0KFJvdXRlcikuaW5pdCgpO1xuXHR9XG59XG4iLCJtb2R1bGUgaG8udWkge1xuXG5cdGV4cG9ydCBmdW5jdGlvbiBydW4ob3B0aW9uczpJT3B0aW9ucz1uZXcgT3B0aW9ucygpKTogaG8ucHJvbWlzZS5Qcm9taXNlPGFueSwgYW55PiB7XG5cdFx0b3B0aW9ucyA9IG5ldyBPcHRpb25zKG9wdGlvbnMpO1xuXG5cdFx0bGV0IHAgPSBvcHRpb25zLnByb2Nlc3MoKVxuXHRcdC50aGVuKGhvLmNvbXBvbmVudHMucnVuKVxuXHRcdC50aGVuKGhvLmZsdXgucnVuKTtcblxuXHRcdHJldHVybiBwO1xuXHR9XG5cblx0bGV0IGNvbXBvbmVudHMgPSBbXG5cdFx0XCJTdG9yZWRcIixcblx0XHRcIlZpZXdcIixcblx0XTtcblxuXHRsZXQgYXR0cmlidXRlcyA9IFtcblx0XHRcIkJpbmRcIixcblx0XHRcIkJpbmRCaVwiLFxuXHRdO1xuXG5cdGxldCBzdG9yZXMgPSBbXG5cblx0XTtcblxuXHRleHBvcnQgaW50ZXJmYWNlIElPcHRpb25zIHtcblx0XHRyb290OiBzdHJpbmcgfCB0eXBlb2YgaG8uY29tcG9uZW50cy5Db21wb25lbnQ7IC8vUm9vdCBjb21wb25lbnQgdG8gcmVnaXN0ZXI7XG5cdFx0cm91dGVyOiBzdHJpbmcgfCB0eXBlb2YgaG8uZmx1eC5Sb3V0ZXI7IC8vYWx0ZXJuYXRpdmUgcm91dGVyIGNsYXNzXG5cdFx0bWFwOiBzdHJpbmcgfCBib29sZWFuOyAvLyBpZiBzZXQsIG1hcCBhbGwgaG8udWkgY29tcG9uZW50cyBpbiB0aGUgY29tcG9uZW50cHJvdmlkZXIgdG8gdGhlIGdpdmVuIHVybFxuXHRcdGRpcjogYm9vbGVhbjsgLy8gc2V0IHVzZWRpciBpbiBoby5jb21wb25lbnRzXG5cdFx0bWluOiBib29sZWFuO1xuXHRcdHByb2Nlc3M6ICgpPT5oby5wcm9taXNlLlByb21pc2U8YW55LCBhbnk+O1xuXHR9XG5cblx0Y2xhc3MgT3B0aW9ucyBpbXBsZW1lbnRzIElPcHRpb25zIHtcblx0XHRyb290OiBzdHJpbmcgfCB0eXBlb2YgaG8uY29tcG9uZW50cy5Db21wb25lbnQgPSBcIkFwcFwiXG5cdFx0cm91dGVyOiBzdHJpbmcgfCB0eXBlb2YgaG8uZmx1eC5Sb3V0ZXIgPSBoby5mbHV4LlJvdXRlcjtcblx0XHRtYXA6IHN0cmluZyB8IGJvb2xlYW4gPSB0cnVlO1xuXHRcdG1hcERlZmF1bHQgPSBcImJvd2VyX2NvbXBvbmVudHMvaG8tdWkvZGlzdC9cIjtcblx0XHRkaXIgPSB0cnVlO1xuXHRcdG1pbiA9IGZhbHNlO1xuXG5cdFx0Y29uc3RydWN0b3Iob3B0OiBJT3B0aW9ucyA9IDxJT3B0aW9ucz57fSkge1xuXHRcdFx0Zm9yKHZhciBrZXkgaW4gb3B0KSB7XG5cdFx0XHRcdHRoaXNba2V5XSA9IG9wdFtrZXldO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHByb2Nlc3MoKTogaG8ucHJvbWlzZS5Qcm9taXNlPGFueSwgYW55Pntcblx0XHRcdHJldHVybiBoby5wcm9taXNlLlByb21pc2UuY3JlYXRlKHRoaXMucHJvY2Vzc0RpcigpKVxuXHRcdFx0LnRoZW4odGhpcy5wcm9jZXNzTWluLmJpbmQodGhpcykpXG5cdFx0XHQudGhlbih0aGlzLnByb2Nlc3NNYXAuYmluZCh0aGlzKSlcblx0XHRcdC50aGVuKHRoaXMucHJvY2Vzc1JvdXRlci5iaW5kKHRoaXMpKVxuXHRcdFx0LnRoZW4odGhpcy5wcm9jZXNzUm9vdC5iaW5kKHRoaXMpKVxuXHRcdH1cblxuXHRcdHByb3RlY3RlZCBwcm9jZXNzUm9vdCgpIHtcblx0XHRcdHJldHVybiBuZXcgaG8ucHJvbWlzZS5Qcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcblx0XHRcdFx0aWYodHlwZW9mIHRoaXMucm9vdCA9PT0gJ3N0cmluZycpIHtcblx0XHRcdFx0XHRoby5jb21wb25lbnRzLnJlZ2lzdHJ5Lmluc3RhbmNlLmxvYWRDb21wb25lbnQoPHN0cmluZz50aGlzLnJvb3QpXG5cdFx0XHRcdFx0LnRoZW4ocmVzb2x2ZSlcblx0XHRcdFx0XHQuY2F0Y2gocmVqZWN0KTtcblxuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdGhvLmNvbXBvbmVudHMucmVnaXN0cnkuaW5zdGFuY2UucmVnaXN0ZXIoPHR5cGVvZiBoby5jb21wb25lbnRzLkNvbXBvbmVudD50aGlzLnJvb3QpXG5cdFx0XHRcdFx0cmVzb2x2ZShudWxsKTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0fVxuXG5cdFx0cHJvdGVjdGVkIHByb2Nlc3NSb3V0ZXIoKTogaG8ucHJvbWlzZS5Qcm9taXNlPGFueSwgYW55PiB7XG5cdFx0XHRyZXR1cm4gbmV3IGhvLnByb21pc2UuUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG5cdFx0XHRcdGlmKHR5cGVvZiB0aGlzLnJvdXRlciA9PT0gJ3N0cmluZycpIHtcblx0XHRcdFx0XHRoby5mbHV4LlNUT1JFUy5sb2FkU3RvcmUoPHN0cmluZz50aGlzLnJvdXRlcilcblx0XHRcdFx0XHQudGhlbihyZXNvbHZlKVxuXHRcdFx0XHRcdC5jYXRjaChyZWplY3QpO1xuXG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0cmVzb2x2ZShuZXcgKDx0eXBlb2YgaG8uZmx1eC5Sb3V0ZXI+dGhpcy5yb3V0ZXIpKCkpO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblxuXHRcdH1cblxuXHRcdHByb3RlY3RlZCBwcm9jZXNzTWFwKCk6IHZvaWQge1xuXHRcdFx0aWYodHlwZW9mIHRoaXMubWFwID09PSAnYm9vbGVhbicpIHtcblx0XHRcdFx0aWYoIXRoaXMubWFwKVxuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdHRoaXMubWFwID0gdGhpcy5tYXBEZWZhdWx0O1xuXHRcdFx0fVxuXG5cdFx0XHRjb21wb25lbnRzLmZvckVhY2goYyA9PiB7XG5cdFx0XHRcdGhvLmNvbXBvbmVudHMuY29tcG9uZW50cHJvdmlkZXIubWFwcGluZ1tjXSA9IHRoaXMubWFwICsgJ2NvbXBvbmVudHMvJyArIGMgKyAnLycgKyBjICsgJy5qcyc7XG5cdFx0XHR9KTtcblxuXHRcdFx0YXR0cmlidXRlcy5mb3JFYWNoKGEgPT4ge1xuXHRcdFx0XHRoby5jb21wb25lbnRzLmF0dHJpYnV0ZXByb3ZpZGVyLm1hcHBpbmdbYV0gPSB0aGlzLm1hcCArICdhdHRyaWJ1dGVzLycgKyBhICsgJy8nICsgYSArICcuanMnO1xuXHRcdFx0fSk7XG5cblx0XHRcdHN0b3Jlcy5mb3JFYWNoKHMgPT4ge1xuXHRcdFx0XHRoby5mbHV4LnN0b3JlcHJvdmlkZXIubWFwcGluZ1tzXSA9IHRoaXMubWFwICsgJ3N0b3Jlcy8nICsgcyArICcvJyArIHMgKyAnLmpzJztcblx0XHRcdH0pO1xuXHRcdH1cblxuXHRcdHByb3RlY3RlZCBwcm9jZXNzRGlyKCk6IHZvaWQge1xuXHRcdFx0aG8uY29tcG9uZW50cy5kaXIgPSB0aGlzLmRpcjtcblx0XHR9XG5cblx0XHRwcm90ZWN0ZWQgcHJvY2Vzc01pbigpOiB2b2lkIHtcblx0XHRcdGhvLmNvbXBvbmVudHMuY29tcG9uZW50cHJvdmlkZXIuaW5zdGFuY2UudXNlTWluID0gdGhpcy5taW47XG5cdFx0XHRoby5jb21wb25lbnRzLmF0dHJpYnV0ZXByb3ZpZGVyLmluc3RhbmNlLnVzZU1pbiA9IHRoaXMubWluO1xuXHRcdFx0aG8uZmx1eC5zdG9yZXByb3ZpZGVyLmluc3RhbmNlLnVzZU1pbiA9IHRoaXMubWluO1xuXHRcdH1cblx0fVxuXG59XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=