/// <reference path="../../../../bower_components/ho-promise/dist/promise.d.ts"/>
/// <reference path="../../../../bower_components/ho-components/dist/components.d.ts"/>
/// <reference path="../../../../bower_components/ho-flux/dist/flux.d.ts"/>
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var ho;
(function (ho) {
    var ui;
    (function (ui) {
        var components;
        (function (components) {
            var Component = ho.components.Component;
            var Flux = ho.flux;
            var Promise = ho.promise.Promise;
            var View = (function (_super) {
                __extends(View, _super);
                function View() {
                    _super.apply(this, arguments);
                    this.html = "";
                    this.properties = [
                        { name: 'viewname', required: true }
                    ];
                }
                View.prototype.init = function () {
                    Flux.STORES.get(Flux.Router).register(this.state_changed, this);
                };
                Object.defineProperty(View.prototype, "viewname", {
                    get: function () {
                        return this.properties['viewname'];
                    },
                    enumerable: true,
                    configurable: true
                });
                View.prototype.state_changed = function (data) {
                    var _this = this;
                    var html;
                    var state = data.state.view.filter(function (v) {
                        return v.name === _this.viewname;
                    })[0];
                    if (state && state.html)
                        html = state.html;
                    else
                        return;
                    this.getHtml(html)
                        .then(function (h) {
                        html = h;
                        return this.loadDynamicRequirements(html);
                    }.bind(this))
                        .then(function () {
                        this.html = false;
                        this.element.innerHTML = html;
                        this.render();
                    }.bind(this));
                };
                View.prototype.getHtml = function (html) {
                    if (typeof html === 'undefined')
                        return ho.promise.Promise.create(null);
                    else if (html.slice(-5) !== '.html')
                        return ho.promise.Promise.create(html);
                    else
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
                            xmlhttp.open('GET', html, true);
                            xmlhttp.send();
                        });
                };
                View.prototype.loadDynamicRequirements = function (html) {
                    return Promise.all([this.loadDynamicComponents(html), this.loadDynamicAttributes(html)]);
                };
                View.prototype.loadDynamicComponents = function (html) {
                    var requirements = html.match(/<!--\s*requires?="(.+)"/);
                    if (requirements !== null)
                        requirements = requirements[1].split(",").map(function (r) { return r.trim(); });
                    else
                        requirements = [];
                    var Registry = ho.components.registry.instance;
                    var promises = requirements
                        .filter(function (req) {
                        return !Registry.hasComponent(req);
                    })
                        .map(function (req) {
                        return Registry.loadComponent(req);
                    });
                    return Promise.all(promises);
                };
                View.prototype.loadDynamicAttributes = function (html) {
                    var attributes = html.match(/<!--\s*attributes?="(.+)"/);
                    if (attributes !== null)
                        attributes = attributes[1].split(",").map(function (a) { return a.trim(); });
                    else
                        attributes = [];
                    var Registry = ho.components.registry.instance;
                    var promises = attributes
                        .filter(function (attr) {
                        return !Registry.hasAttribute(attr);
                    })
                        .map(function (attr) {
                        return Registry.loadAttribute(attr);
                    });
                    return Promise.all(promises);
                };
                return View;
            })(Component);
            components.View = View;
        })(components = ui.components || (ui.components = {}));
    })(ui = ho.ui || (ho.ui = {}));
})(ho || (ho = {}));

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbXBvbmVudHMvVmlldy92aWV3LnRzIl0sIm5hbWVzIjpbImhvIiwiaG8udWkiLCJoby51aS5jb21wb25lbnRzIiwiaG8udWkuY29tcG9uZW50cy5WaWV3IiwiaG8udWkuY29tcG9uZW50cy5WaWV3LmNvbnN0cnVjdG9yIiwiaG8udWkuY29tcG9uZW50cy5WaWV3LmluaXQiLCJoby51aS5jb21wb25lbnRzLlZpZXcudmlld25hbWUiLCJoby51aS5jb21wb25lbnRzLlZpZXcuc3RhdGVfY2hhbmdlZCIsImhvLnVpLmNvbXBvbmVudHMuVmlldy5nZXRIdG1sIiwiaG8udWkuY29tcG9uZW50cy5WaWV3LmxvYWREeW5hbWljUmVxdWlyZW1lbnRzIiwiaG8udWkuY29tcG9uZW50cy5WaWV3LmxvYWREeW5hbWljQ29tcG9uZW50cyIsImhvLnVpLmNvbXBvbmVudHMuVmlldy5sb2FkRHluYW1pY0F0dHJpYnV0ZXMiXSwibWFwcGluZ3MiOiJBQUFBLGlGQUFpRjtBQUNqRix1RkFBdUY7QUFDdkYsMkVBQTJFOzs7Ozs7O0FBRTNFLElBQU8sRUFBRSxDQWlIUjtBQWpIRCxXQUFPLEVBQUU7SUFBQ0EsSUFBQUEsRUFBRUEsQ0FpSFhBO0lBakhTQSxXQUFBQSxFQUFFQTtRQUFDQyxJQUFBQSxVQUFVQSxDQWlIdEJBO1FBakhZQSxXQUFBQSxVQUFVQSxFQUFDQSxDQUFDQTtZQUV4QkMsSUFBT0EsU0FBU0EsR0FBR0EsRUFBRUEsQ0FBQ0EsVUFBVUEsQ0FBQ0EsU0FBU0EsQ0FBQUE7WUFDMUNBLElBQU9BLElBQUlBLEdBQUdBLEVBQUVBLENBQUNBLElBQUlBLENBQUNBO1lBQ3RCQSxJQUFPQSxPQUFPQSxHQUFHQSxFQUFFQSxDQUFDQSxPQUFPQSxDQUFDQSxPQUFPQSxDQUFDQTtZQUVwQ0E7Z0JBQTBCQyx3QkFBU0E7Z0JBQW5DQTtvQkFBMEJDLDhCQUFTQTtvQkFFbENBLFNBQUlBLEdBQUdBLEVBQUVBLENBQUNBO29CQUVWQSxlQUFVQSxHQUFHQTt3QkFDWkEsRUFBRUEsSUFBSUEsRUFBRUEsVUFBVUEsRUFBRUEsUUFBUUEsRUFBRUEsSUFBSUEsRUFBRUE7cUJBQ3BDQSxDQUFDQTtnQkFvR0hBLENBQUNBO2dCQWxHQUQsbUJBQUlBLEdBQUpBO29CQUNDRSxJQUFJQSxDQUFDQSxNQUFNQSxDQUFDQSxHQUFHQSxDQUFDQSxJQUFJQSxDQUFDQSxNQUFNQSxDQUFDQSxDQUFDQSxRQUFRQSxDQUFDQSxJQUFJQSxDQUFDQSxhQUFhQSxFQUFFQSxJQUFJQSxDQUFDQSxDQUFDQTtnQkFDakVBLENBQUNBO2dCQUVERixzQkFBSUEsMEJBQVFBO3lCQUFaQTt3QkFDQ0csTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsVUFBVUEsQ0FBQ0EsVUFBVUEsQ0FBQ0EsQ0FBQ0E7b0JBQ3BDQSxDQUFDQTs7O21CQUFBSDtnQkFFV0EsNEJBQWFBLEdBQXZCQSxVQUF3QkEsSUFBeUJBO29CQUFqREksaUJBb0JEQTtvQkFuQkdBLElBQUlBLElBQVlBLENBQUNBO29CQUNwQkEsSUFBSUEsS0FBS0EsR0FBR0EsSUFBSUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsVUFBQ0EsQ0FBQ0E7d0JBQy9CQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQSxJQUFJQSxLQUFLQSxLQUFJQSxDQUFDQSxRQUFRQSxDQUFDQTtvQkFDbkNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO29CQUNUQSxFQUFFQSxDQUFBQSxDQUFDQSxLQUFLQSxJQUFJQSxLQUFLQSxDQUFDQSxJQUFJQSxDQUFDQTt3QkFDdEJBLElBQUlBLEdBQUdBLEtBQUtBLENBQUNBLElBQUlBLENBQUNBO29CQUNuQkEsSUFBSUE7d0JBQ0hBLE1BQU1BLENBQUNBO29CQUVMQSxJQUFJQSxDQUFDQSxPQUFPQSxDQUFDQSxJQUFJQSxDQUFDQTt5QkFDZkEsSUFBSUEsQ0FBQ0EsVUFBU0EsQ0FBQ0E7d0JBQ2YsSUFBSSxHQUFHLENBQUMsQ0FBQzt3QkFDVCxNQUFNLENBQUMsSUFBSSxDQUFDLHVCQUF1QixDQUFDLElBQUksQ0FBQyxDQUFDO29CQUM3QyxDQUFDLENBQUNBLElBQUlBLENBQUNBLElBQUlBLENBQUNBLENBQUNBO3lCQUNWQSxJQUFJQSxDQUFDQTt3QkFDTCxJQUFJLENBQUMsSUFBSSxHQUFHLEtBQUssQ0FBQzt3QkFDbEIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDO3dCQUM5QixJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7b0JBQ2pCLENBQUMsQ0FBQ0EsSUFBSUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7Z0JBQ2xCQSxDQUFDQTtnQkFFV0osc0JBQU9BLEdBQWpCQSxVQUFrQkEsSUFBWUE7b0JBQy9CSyxFQUFFQSxDQUFDQSxDQUFDQSxPQUFPQSxJQUFJQSxLQUFLQSxXQUFXQSxDQUFDQTt3QkFDMUJBLE1BQU1BLENBQUNBLEVBQUVBLENBQUNBLE9BQU9BLENBQUNBLE9BQU9BLENBQUNBLE1BQU1BLENBQUNBLElBQUlBLENBQUNBLENBQUNBO29CQUMxQ0EsSUFBSUEsQ0FBQ0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsS0FBS0EsT0FBT0EsQ0FBQ0E7d0JBQ2pDQSxNQUFNQSxDQUFDQSxFQUFFQSxDQUFDQSxPQUFPQSxDQUFDQSxPQUFPQSxDQUFDQSxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQTtvQkFDMUNBLElBQUlBO3dCQUFDQSxNQUFNQSxDQUFDQSxJQUFJQSxFQUFFQSxDQUFDQSxPQUFPQSxDQUFDQSxPQUFPQSxDQUFDQSxVQUFDQSxPQUFPQSxFQUFFQSxNQUFNQTs0QkFFaERBLElBQUlBLE9BQU9BLEdBQUdBLElBQUlBLGNBQWNBLEVBQUVBLENBQUNBOzRCQUNuQ0EsT0FBT0EsQ0FBQ0Esa0JBQWtCQSxHQUFHQTtnQ0FDM0IsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQVUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO29DQUMzQixJQUFJLElBQUksR0FBRyxPQUFPLENBQUMsWUFBWSxDQUFDO29DQUNoQyxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsTUFBTSxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUM7d0NBQzFCLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztvQ0FDaEIsQ0FBQztvQ0FBQyxJQUFJLENBQUMsQ0FBQzt3Q0FDTixNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7b0NBQ2YsQ0FBQztnQ0FDSixDQUFDOzRCQUNILENBQUMsQ0FBQ0E7NEJBRUZBLE9BQU9BLENBQUNBLElBQUlBLENBQUNBLEtBQUtBLEVBQUVBLElBQUlBLEVBQUVBLElBQUlBLENBQUNBLENBQUNBOzRCQUNoQ0EsT0FBT0EsQ0FBQ0EsSUFBSUEsRUFBRUEsQ0FBQ0E7d0JBRWxCQSxDQUFDQSxDQUFDQSxDQUFDQTtnQkFDUEEsQ0FBQ0E7Z0JBRVNMLHNDQUF1QkEsR0FBakNBLFVBQWtDQSxJQUFZQTtvQkFDN0NNLE1BQU1BLENBQUNBLE9BQU9BLENBQUNBLEdBQUdBLENBQUNBLENBQUNBLElBQUlBLENBQUNBLHFCQUFxQkEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsRUFBRUEsSUFBSUEsQ0FBQ0EscUJBQXFCQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtnQkFDMUZBLENBQUNBO2dCQUVTTixvQ0FBcUJBLEdBQS9CQSxVQUFnQ0EsSUFBWUE7b0JBQ3hDTyxJQUFJQSxZQUFZQSxHQUFHQSxJQUFJQSxDQUFDQSxLQUFLQSxDQUFDQSx5QkFBeUJBLENBQUNBLENBQUNBO29CQUN6REEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsWUFBWUEsS0FBS0EsSUFBSUEsQ0FBQ0E7d0JBQ3ZCQSxZQUFZQSxHQUFHQSxZQUFZQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxLQUFLQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxVQUFDQSxDQUFDQSxJQUFPQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQSxJQUFJQSxFQUFFQSxDQUFBQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtvQkFDN0VBLElBQUlBO3dCQUNEQSxZQUFZQSxHQUFHQSxFQUFFQSxDQUFDQTtvQkFFckJBLElBQUlBLFFBQVFBLEdBQUdBLEVBQUVBLENBQUNBLFVBQVVBLENBQUNBLFFBQVFBLENBQUNBLFFBQVFBLENBQUNBO29CQUUvQ0EsSUFBSUEsUUFBUUEsR0FBR0EsWUFBWUE7eUJBQ3hCQSxNQUFNQSxDQUFDQSxVQUFDQSxHQUFHQTt3QkFDWEEsTUFBTUEsQ0FBQ0EsQ0FBQ0EsUUFBUUEsQ0FBQ0EsWUFBWUEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0E7b0JBQ3RDQSxDQUFDQSxDQUFDQTt5QkFDREEsR0FBR0EsQ0FBQ0EsVUFBQ0EsR0FBR0E7d0JBQ1JBLE1BQU1BLENBQUNBLFFBQVFBLENBQUNBLGFBQWFBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBO29CQUNwQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7b0JBRUhBLE1BQU1BLENBQUNBLE9BQU9BLENBQUNBLEdBQUdBLENBQUNBLFFBQVFBLENBQUNBLENBQUNBO2dCQUNqQ0EsQ0FBQ0E7Z0JBRVNQLG9DQUFxQkEsR0FBL0JBLFVBQWdDQSxJQUFZQTtvQkFDeENRLElBQUlBLFVBQVVBLEdBQUdBLElBQUlBLENBQUNBLEtBQUtBLENBQUNBLDJCQUEyQkEsQ0FBQ0EsQ0FBQ0E7b0JBQ3pEQSxFQUFFQSxDQUFDQSxDQUFDQSxVQUFVQSxLQUFLQSxJQUFJQSxDQUFDQTt3QkFDckJBLFVBQVVBLEdBQUdBLFVBQVVBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLEtBQUtBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBLEdBQUdBLENBQUNBLFVBQUNBLENBQUNBLElBQU9BLE1BQU1BLENBQUNBLENBQUNBLENBQUNBLElBQUlBLEVBQUVBLENBQUFBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO29CQUN6RUEsSUFBSUE7d0JBQ0RBLFVBQVVBLEdBQUdBLEVBQUVBLENBQUNBO29CQUVuQkEsSUFBSUEsUUFBUUEsR0FBR0EsRUFBRUEsQ0FBQ0EsVUFBVUEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsUUFBUUEsQ0FBQ0E7b0JBRS9DQSxJQUFJQSxRQUFRQSxHQUFHQSxVQUFVQTt5QkFDdEJBLE1BQU1BLENBQUNBLFVBQUNBLElBQUlBO3dCQUNaQSxNQUFNQSxDQUFDQSxDQUFDQSxRQUFRQSxDQUFDQSxZQUFZQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQTtvQkFDdkNBLENBQUNBLENBQUNBO3lCQUNEQSxHQUFHQSxDQUFDQSxVQUFDQSxJQUFJQTt3QkFDVEEsTUFBTUEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsYUFBYUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0E7b0JBQ3JDQSxDQUFDQSxDQUFDQSxDQUFDQTtvQkFFSEEsTUFBTUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsUUFBUUEsQ0FBQ0EsQ0FBQ0E7Z0JBQ2pDQSxDQUFDQTtnQkFDRlIsV0FBQ0E7WUFBREEsQ0ExR0FELEFBMEdDQyxFQTFHeUJELFNBQVNBLEVBMEdsQ0E7WUExR1lBLGVBQUlBLE9BMEdoQkEsQ0FBQUE7UUFDRkEsQ0FBQ0EsRUFqSFlELFVBQVVBLEdBQVZBLGFBQVVBLEtBQVZBLGFBQVVBLFFBaUh0QkE7SUFBREEsQ0FBQ0EsRUFqSFNELEVBQUVBLEdBQUZBLEtBQUVBLEtBQUZBLEtBQUVBLFFBaUhYQTtBQUFEQSxDQUFDQSxFQWpITSxFQUFFLEtBQUYsRUFBRSxRQWlIUiIsImZpbGUiOiJjb21wb25lbnRzL1ZpZXcvdmlldy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi8uLi8uLi8uLi9ib3dlcl9jb21wb25lbnRzL2hvLXByb21pc2UvZGlzdC9wcm9taXNlLmQudHNcIi8+XG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vLi4vLi4vLi4vYm93ZXJfY29tcG9uZW50cy9oby1jb21wb25lbnRzL2Rpc3QvY29tcG9uZW50cy5kLnRzXCIvPlxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uLy4uLy4uLy4uL2Jvd2VyX2NvbXBvbmVudHMvaG8tZmx1eC9kaXN0L2ZsdXguZC50c1wiLz5cblxubW9kdWxlIGhvLnVpLmNvbXBvbmVudHMge1xuXG5cdGltcG9ydCBDb21wb25lbnQgPSBoby5jb21wb25lbnRzLkNvbXBvbmVudFxuXHRpbXBvcnQgRmx1eCA9IGhvLmZsdXg7XG5cdGltcG9ydCBQcm9taXNlID0gaG8ucHJvbWlzZS5Qcm9taXNlO1xuXG5cdGV4cG9ydCBjbGFzcyBWaWV3IGV4dGVuZHMgQ29tcG9uZW50IHtcblxuXHRcdGh0bWwgPSBcIlwiO1xuXG5cdFx0cHJvcGVydGllcyA9IFtcblx0XHRcdHsgbmFtZTogJ3ZpZXduYW1lJywgcmVxdWlyZWQ6IHRydWUgfVxuXHRcdF07XG5cblx0XHRpbml0KCkge1xuXHRcdFx0Rmx1eC5TVE9SRVMuZ2V0KEZsdXguUm91dGVyKS5yZWdpc3Rlcih0aGlzLnN0YXRlX2NoYW5nZWQsIHRoaXMpO1xuXHRcdH1cblxuXHRcdGdldCB2aWV3bmFtZSgpIHtcblx0XHRcdHJldHVybiB0aGlzLnByb3BlcnRpZXNbJ3ZpZXduYW1lJ107XG5cdFx0fVxuXG4gIFx0XHRwcm90ZWN0ZWQgc3RhdGVfY2hhbmdlZChkYXRhOiBoby5mbHV4LklSb3V0ZXJEYXRhKTogdm9pZCB7XG5cdFx0ICAgIGxldCBodG1sOiBzdHJpbmc7XG5cdFx0XHRsZXQgc3RhdGUgPSBkYXRhLnN0YXRlLnZpZXcuZmlsdGVyKCh2KSA9PiB7XG5cdCAgICAgIFx0XHRyZXR1cm4gdi5uYW1lID09PSB0aGlzLnZpZXduYW1lO1xuXHRcdCAgICB9KVswXTtcblx0XHRcdGlmKHN0YXRlICYmIHN0YXRlLmh0bWwpXG5cdFx0XHRcdGh0bWwgPSBzdGF0ZS5odG1sO1xuXHRcdFx0ZWxzZVxuXHRcdFx0XHRyZXR1cm47XG5cblx0XHQgICAgdGhpcy5nZXRIdG1sKGh0bWwpXG4gICAgICBcdFx0LnRoZW4oZnVuY3Rpb24oaCkge1xuXHRcdCAgICAgIFx0aHRtbCA9IGg7XG5cdFx0ICAgICAgXHRyZXR1cm4gdGhpcy5sb2FkRHluYW1pY1JlcXVpcmVtZW50cyhodG1sKTtcblx0XHQgICAgfS5iaW5kKHRoaXMpKVxuXHQgICAgICBcdC50aGVuKGZ1bmN0aW9uKCkge1xuXHRcdCAgICAgIFx0dGhpcy5odG1sID0gZmFsc2U7XG5cdFx0ICAgICAgXHR0aGlzLmVsZW1lbnQuaW5uZXJIVE1MID0gaHRtbDtcblx0XHQgICAgICBcdHRoaXMucmVuZGVyKCk7XG5cdFx0ICAgIH0uYmluZCh0aGlzKSk7XG5cdFx0fVxuXG4gIFx0XHRwcm90ZWN0ZWQgZ2V0SHRtbChodG1sOiBzdHJpbmcpOiBQcm9taXNlPHN0cmluZywgc3RyaW5nPiB7XG5cdFx0XHRpZiAodHlwZW9mIGh0bWwgPT09ICd1bmRlZmluZWQnKVxuXHRcdCAgICAgIFx0cmV0dXJuIGhvLnByb21pc2UuUHJvbWlzZS5jcmVhdGUobnVsbCk7XG5cdFx0ICAgIGVsc2UgaWYgKGh0bWwuc2xpY2UoLTUpICE9PSAnLmh0bWwnKVxuXHRcdCAgICAgIFx0cmV0dXJuIGhvLnByb21pc2UuUHJvbWlzZS5jcmVhdGUoaHRtbCk7XG5cdFx0ICAgIGVsc2UgcmV0dXJuIG5ldyBoby5wcm9taXNlLlByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuXG5cdFx0ICAgICAgXHRsZXQgeG1saHR0cCA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuXHRcdCAgICAgIFx0eG1saHR0cC5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbigpIHtcblx0XHQgICAgICAgIFx0aWYgKHhtbGh0dHAucmVhZHlTdGF0ZSA9PSA0KSB7XG5cdFx0XHQgICAgICAgICAgXHR2YXIgcmVzcCA9IHhtbGh0dHAucmVzcG9uc2VUZXh0O1xuXHRcdFx0ICAgICAgICAgIFx0aWYgKHhtbGh0dHAuc3RhdHVzID09IDIwMCkge1xuXHRcdFx0ICAgICAgICAgICAgXHRyZXNvbHZlKHJlc3ApO1xuXHRcdFx0ICAgICAgICAgIFx0fSBlbHNlIHtcblx0XHRcdCAgICAgICAgICAgIFx0cmVqZWN0KHJlc3ApO1xuXHRcdFx0ICAgICAgICAgIFx0fVxuXHRcdCAgICAgICAgXHR9XG5cdFx0ICAgICAgXHR9O1xuXG5cdFx0ICAgICAgXHR4bWxodHRwLm9wZW4oJ0dFVCcsIGh0bWwsIHRydWUpO1xuXHRcdCAgICAgIFx0eG1saHR0cC5zZW5kKCk7XG5cbiAgICBcdFx0fSk7XG5cdFx0fVxuXG5cdFx0cHJvdGVjdGVkIGxvYWREeW5hbWljUmVxdWlyZW1lbnRzKGh0bWw6IHN0cmluZyk6IFByb21pc2U8YW55LCBhbnk+IHtcblx0XHRcdHJldHVybiBQcm9taXNlLmFsbChbdGhpcy5sb2FkRHluYW1pY0NvbXBvbmVudHMoaHRtbCksIHRoaXMubG9hZER5bmFtaWNBdHRyaWJ1dGVzKGh0bWwpXSk7XG5cdFx0fVxuXG5cdFx0cHJvdGVjdGVkIGxvYWREeW5hbWljQ29tcG9uZW50cyhodG1sOiBzdHJpbmcpOiBQcm9taXNlPHN0cmluZywgc3RyaW5nPiB7XG5cdFx0ICAgIGxldCByZXF1aXJlbWVudHMgPSBodG1sLm1hdGNoKC88IS0tXFxzKnJlcXVpcmVzPz1cIiguKylcIi8pO1xuXHRcdCAgICBpZiAocmVxdWlyZW1lbnRzICE9PSBudWxsKVxuXHRcdCAgICAgIFx0cmVxdWlyZW1lbnRzID0gcmVxdWlyZW1lbnRzWzFdLnNwbGl0KFwiLFwiKS5tYXAoKHIpID0+IHsgcmV0dXJuIHIudHJpbSgpIH0pO1xuXHRcdCAgICBlbHNlXG5cdFx0ICAgICAgXHRyZXF1aXJlbWVudHMgPSBbXTtcblxuXHRcdCAgICBsZXQgUmVnaXN0cnkgPSBoby5jb21wb25lbnRzLnJlZ2lzdHJ5Lmluc3RhbmNlO1xuXG5cdFx0ICAgIGxldCBwcm9taXNlcyA9IHJlcXVpcmVtZW50c1xuXHQgICAgICBcdC5maWx0ZXIoKHJlcSkgPT4ge1xuXHRcdCAgICAgIFx0cmV0dXJuICFSZWdpc3RyeS5oYXNDb21wb25lbnQocmVxKTtcblx0XHQgICAgfSlcblx0XHQgICAgLm1hcCgocmVxKSA9PiB7XG5cdFx0ICAgIFx0cmV0dXJuIFJlZ2lzdHJ5LmxvYWRDb21wb25lbnQocmVxKTtcblx0XHQgICAgfSk7XG5cblx0XHQgICAgcmV0dXJuIFByb21pc2UuYWxsKHByb21pc2VzKTtcblx0XHR9XG5cblx0XHRwcm90ZWN0ZWQgbG9hZER5bmFtaWNBdHRyaWJ1dGVzKGh0bWw6IHN0cmluZyk6IFByb21pc2U8c3RyaW5nLCBzdHJpbmc+IHtcblx0XHQgICAgbGV0IGF0dHJpYnV0ZXMgPSBodG1sLm1hdGNoKC88IS0tXFxzKmF0dHJpYnV0ZXM/PVwiKC4rKVwiLyk7XG5cdFx0ICAgIGlmIChhdHRyaWJ1dGVzICE9PSBudWxsKVxuXHRcdCAgICAgIFx0YXR0cmlidXRlcyA9IGF0dHJpYnV0ZXNbMV0uc3BsaXQoXCIsXCIpLm1hcCgoYSkgPT4geyByZXR1cm4gYS50cmltKCkgfSk7XG5cdFx0ICAgIGVsc2Vcblx0XHQgICAgICBcdGF0dHJpYnV0ZXMgPSBbXTtcblxuXHRcdCAgICBsZXQgUmVnaXN0cnkgPSBoby5jb21wb25lbnRzLnJlZ2lzdHJ5Lmluc3RhbmNlO1xuXG5cdFx0ICAgIGxldCBwcm9taXNlcyA9IGF0dHJpYnV0ZXNcblx0ICAgICAgXHQuZmlsdGVyKChhdHRyKSA9PiB7XG5cdFx0ICAgICAgXHRyZXR1cm4gIVJlZ2lzdHJ5Lmhhc0F0dHJpYnV0ZShhdHRyKTtcblx0XHQgICAgfSlcblx0XHQgICAgLm1hcCgoYXR0cikgPT4ge1xuXHRcdCAgICBcdHJldHVybiBSZWdpc3RyeS5sb2FkQXR0cmlidXRlKGF0dHIpO1xuXHRcdCAgICB9KTtcblxuXHRcdCAgICByZXR1cm4gUHJvbWlzZS5hbGwocHJvbWlzZXMpO1xuXHRcdH1cblx0fVxufVxuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9