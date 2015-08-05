/// <reference path="~../../../../../bower_components/ho-promise/dist/promise.d.ts"/>
/// <reference path="../../../bower_components/ho-components/dist/components.d.ts"/>
/// <reference path="../../../bower_components/ho-flux/dist/flux.d.ts"/>
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
                    var html = data.state.view.filter(function (v) {
                        return v.name === _this.viewname;
                    })[0].html;
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
                return View;
            })(Component);
            components.View = View;
        })(components = ui.components || (ui.components = {}));
    })(ui = ho.ui || (ho.ui = {}));
})(ho || (ho = {}));

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbXBvbmVudHMvdmlldy50cyJdLCJuYW1lcyI6WyJobyIsImhvLnVpIiwiaG8udWkuY29tcG9uZW50cyIsImhvLnVpLmNvbXBvbmVudHMuVmlldyIsImhvLnVpLmNvbXBvbmVudHMuVmlldy5jb25zdHJ1Y3RvciIsImhvLnVpLmNvbXBvbmVudHMuVmlldy5pbml0IiwiaG8udWkuY29tcG9uZW50cy5WaWV3LnZpZXduYW1lIiwiaG8udWkuY29tcG9uZW50cy5WaWV3LnN0YXRlX2NoYW5nZWQiLCJoby51aS5jb21wb25lbnRzLlZpZXcuZ2V0SHRtbCIsImhvLnVpLmNvbXBvbmVudHMuVmlldy5sb2FkRHluYW1pY1JlcXVpcmVtZW50cyJdLCJtYXBwaW5ncyI6IkFBQUEscUZBQXFGO0FBQ3JGLG9GQUFvRjtBQUNwRix3RUFBd0U7Ozs7Ozs7QUFFeEUsSUFBTyxFQUFFLENBb0ZSO0FBcEZELFdBQU8sRUFBRTtJQUFDQSxJQUFBQSxFQUFFQSxDQW9GWEE7SUFwRlNBLFdBQUFBLEVBQUVBO1FBQUNDLElBQUFBLFVBQVVBLENBb0Z0QkE7UUFwRllBLFdBQUFBLFVBQVVBLEVBQUNBLENBQUNBO1lBRXhCQyxJQUFPQSxTQUFTQSxHQUFHQSxFQUFFQSxDQUFDQSxVQUFVQSxDQUFDQSxTQUFTQSxDQUFBQTtZQUMxQ0EsSUFBT0EsSUFBSUEsR0FBR0EsRUFBRUEsQ0FBQ0EsSUFBSUEsQ0FBQ0E7WUFDdEJBLElBQU9BLE9BQU9BLEdBQUdBLEVBQUVBLENBQUNBLE9BQU9BLENBQUNBLE9BQU9BLENBQUNBO1lBRXBDQTtnQkFBMEJDLHdCQUFTQTtnQkFBbkNBO29CQUEwQkMsOEJBQVNBO29CQUVsQ0EsU0FBSUEsR0FBR0EsRUFBRUEsQ0FBQ0E7b0JBRVZBLGVBQVVBLEdBQUdBO3dCQUNaQSxFQUFFQSxJQUFJQSxFQUFFQSxVQUFVQSxFQUFFQSxRQUFRQSxFQUFFQSxJQUFJQSxFQUFFQTtxQkFDcENBLENBQUNBO2dCQXVFSEEsQ0FBQ0E7Z0JBckVBRCxtQkFBSUEsR0FBSkE7b0JBQ0NFLElBQUlBLENBQUNBLE1BQU1BLENBQUNBLEdBQUdBLENBQUNBLElBQUlBLENBQUNBLE1BQU1BLENBQUNBLENBQUNBLFFBQVFBLENBQUNBLElBQUlBLENBQUNBLGFBQWFBLEVBQUVBLElBQUlBLENBQUNBLENBQUNBO2dCQUNqRUEsQ0FBQ0E7Z0JBRURGLHNCQUFJQSwwQkFBUUE7eUJBQVpBO3dCQUNDRyxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQSxVQUFVQSxDQUFDQSxVQUFVQSxDQUFDQSxDQUFDQTtvQkFDcENBLENBQUNBOzs7bUJBQUFIO2dCQUVXQSw0QkFBYUEsR0FBdkJBLFVBQXdCQSxJQUF5QkE7b0JBQWpESSxpQkFlREE7b0JBZEdBLElBQUlBLElBQUlBLEdBQUdBLElBQUlBLENBQUNBLEtBQUtBLENBQUNBLElBQUlBLENBQUNBLE1BQU1BLENBQUNBLFVBQUNBLENBQUNBO3dCQUNqQ0EsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsSUFBSUEsS0FBS0EsS0FBSUEsQ0FBQ0EsUUFBUUEsQ0FBQ0E7b0JBQ25DQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQTtvQkFFWEEsSUFBSUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsSUFBSUEsQ0FBQ0E7eUJBQ2RBLElBQUlBLENBQUNBLFVBQVNBLENBQUNBO3dCQUNoQixJQUFJLEdBQUcsQ0FBQyxDQUFDO3dCQUNULE1BQU0sQ0FBQyxJQUFJLENBQUMsdUJBQXVCLENBQUMsSUFBSSxDQUFDLENBQUM7b0JBQzdDLENBQUMsQ0FBQ0EsSUFBSUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0E7eUJBQ1RBLElBQUlBLENBQUNBO3dCQUNOLElBQUksQ0FBQyxJQUFJLEdBQUcsS0FBSyxDQUFDO3dCQUNsQixJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUM7d0JBQzlCLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztvQkFDakIsQ0FBQyxDQUFDQSxJQUFJQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQSxDQUFDQTtnQkFDbEJBLENBQUNBO2dCQUVXSixzQkFBT0EsR0FBakJBLFVBQWtCQSxJQUFZQTtvQkFDL0JLLEVBQUVBLENBQUNBLENBQUNBLE9BQU9BLElBQUlBLEtBQUtBLFdBQVdBLENBQUNBO3dCQUMxQkEsTUFBTUEsQ0FBQ0EsRUFBRUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsT0FBT0EsQ0FBQ0EsTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0E7b0JBQzFDQSxJQUFJQSxDQUFDQSxFQUFFQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxLQUFLQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxLQUFLQSxPQUFPQSxDQUFDQTt3QkFDakNBLE1BQU1BLENBQUNBLEVBQUVBLENBQUNBLE9BQU9BLENBQUNBLE9BQU9BLENBQUNBLE1BQU1BLENBQUNBLElBQUlBLENBQUNBLENBQUNBO29CQUMxQ0EsSUFBSUE7d0JBQUNBLE1BQU1BLENBQUNBLElBQUlBLEVBQUVBLENBQUNBLE9BQU9BLENBQUNBLE9BQU9BLENBQUNBLFVBQUNBLE9BQU9BLEVBQUVBLE1BQU1BOzRCQUVoREEsSUFBSUEsT0FBT0EsR0FBR0EsSUFBSUEsY0FBY0EsRUFBRUEsQ0FBQ0E7NEJBQ25DQSxPQUFPQSxDQUFDQSxrQkFBa0JBLEdBQUdBO2dDQUMzQixFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBVSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7b0NBQzNCLElBQUksSUFBSSxHQUFHLE9BQU8sQ0FBQyxZQUFZLENBQUM7b0NBQ2hDLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxNQUFNLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQzt3Q0FDMUIsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO29DQUNoQixDQUFDO29DQUFDLElBQUksQ0FBQyxDQUFDO3dDQUNOLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztvQ0FDZixDQUFDO2dDQUNKLENBQUM7NEJBQ0gsQ0FBQyxDQUFDQTs0QkFFRkEsT0FBT0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsS0FBS0EsRUFBRUEsSUFBSUEsRUFBRUEsSUFBSUEsQ0FBQ0EsQ0FBQ0E7NEJBQ2hDQSxPQUFPQSxDQUFDQSxJQUFJQSxFQUFFQSxDQUFDQTt3QkFFbEJBLENBQUNBLENBQUNBLENBQUNBO2dCQUNQQSxDQUFDQTtnQkFFU0wsc0NBQXVCQSxHQUFqQ0EsVUFBa0NBLElBQVlBO29CQUMxQ00sSUFBSUEsWUFBWUEsR0FBR0EsSUFBSUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EseUJBQXlCQSxDQUFDQSxDQUFDQTtvQkFDekRBLEVBQUVBLENBQUNBLENBQUNBLFlBQVlBLEtBQUtBLElBQUlBLENBQUNBO3dCQUN2QkEsWUFBWUEsR0FBR0EsWUFBWUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsS0FBS0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsVUFBQ0EsQ0FBQ0EsSUFBT0EsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsSUFBSUEsRUFBRUEsQ0FBQUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7b0JBQzdFQSxJQUFJQTt3QkFDREEsWUFBWUEsR0FBR0EsRUFBRUEsQ0FBQ0E7b0JBRXJCQSxJQUFJQSxRQUFRQSxHQUFHQSxFQUFFQSxDQUFDQSxVQUFVQSxDQUFDQSxRQUFRQSxDQUFDQSxRQUFRQSxDQUFDQTtvQkFFL0NBLElBQUlBLFFBQVFBLEdBQUdBLFlBQVlBO3lCQUN4QkEsTUFBTUEsQ0FBQ0EsVUFBQ0EsR0FBR0E7d0JBQ1hBLE1BQU1BLENBQUNBLENBQUNBLFFBQVFBLENBQUNBLFlBQVlBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBO29CQUN0Q0EsQ0FBQ0EsQ0FBQ0E7eUJBQ0RBLEdBQUdBLENBQUNBLFVBQUNBLEdBQUdBO3dCQUNSQSxNQUFNQSxDQUFDQSxRQUFRQSxDQUFDQSxhQUFhQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQTtvQkFDcENBLENBQUNBLENBQUNBLENBQUNBO29CQUVIQSxNQUFNQSxDQUFDQSxPQUFPQSxDQUFDQSxHQUFHQSxDQUFDQSxRQUFRQSxDQUFDQSxDQUFDQTtnQkFDakNBLENBQUNBO2dCQUNGTixXQUFDQTtZQUFEQSxDQTdFQUQsQUE2RUNDLEVBN0V5QkQsU0FBU0EsRUE2RWxDQTtZQTdFWUEsZUFBSUEsT0E2RWhCQSxDQUFBQTtRQUNGQSxDQUFDQSxFQXBGWUQsVUFBVUEsR0FBVkEsYUFBVUEsS0FBVkEsYUFBVUEsUUFvRnRCQTtJQUFEQSxDQUFDQSxFQXBGU0QsRUFBRUEsR0FBRkEsS0FBRUEsS0FBRkEsS0FBRUEsUUFvRlhBO0FBQURBLENBQUNBLEVBcEZNLEVBQUUsS0FBRixFQUFFLFFBb0ZSIiwiZmlsZSI6ImNvbXBvbmVudHMvdmlldy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJ+Li4vLi4vLi4vLi4vLi4vYm93ZXJfY29tcG9uZW50cy9oby1wcm9taXNlL2Rpc3QvcHJvbWlzZS5kLnRzXCIvPlxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uLy4uLy4uL2Jvd2VyX2NvbXBvbmVudHMvaG8tY29tcG9uZW50cy9kaXN0L2NvbXBvbmVudHMuZC50c1wiLz5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi8uLi8uLi9ib3dlcl9jb21wb25lbnRzL2hvLWZsdXgvZGlzdC9mbHV4LmQudHNcIi8+XG5cbm1vZHVsZSBoby51aS5jb21wb25lbnRzIHtcblxuXHRpbXBvcnQgQ29tcG9uZW50ID0gaG8uY29tcG9uZW50cy5Db21wb25lbnRcblx0aW1wb3J0IEZsdXggPSBoby5mbHV4O1xuXHRpbXBvcnQgUHJvbWlzZSA9IGhvLnByb21pc2UuUHJvbWlzZTtcblxuXHRleHBvcnQgY2xhc3MgVmlldyBleHRlbmRzIENvbXBvbmVudCB7XG5cblx0XHRodG1sID0gXCJcIjtcblxuXHRcdHByb3BlcnRpZXMgPSBbXG5cdFx0XHR7IG5hbWU6ICd2aWV3bmFtZScsIHJlcXVpcmVkOiB0cnVlIH1cblx0XHRdO1xuXG5cdFx0aW5pdCgpIHtcblx0XHRcdEZsdXguU1RPUkVTLmdldChGbHV4LlJvdXRlcikucmVnaXN0ZXIodGhpcy5zdGF0ZV9jaGFuZ2VkLCB0aGlzKTtcblx0XHR9XG5cblx0XHRnZXQgdmlld25hbWUoKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5wcm9wZXJ0aWVzWyd2aWV3bmFtZSddO1xuXHRcdH1cblxuICBcdFx0cHJvdGVjdGVkIHN0YXRlX2NoYW5nZWQoZGF0YTogaG8uZmx1eC5JUm91dGVyRGF0YSk6IHZvaWQge1xuXHRcdCAgICBsZXQgaHRtbCA9IGRhdGEuc3RhdGUudmlldy5maWx0ZXIoKHYpID0+IHtcblx0ICAgICAgXHRcdHJldHVybiB2Lm5hbWUgPT09IHRoaXMudmlld25hbWU7XG5cdFx0ICAgIH0pWzBdLmh0bWw7XG5cblx0XHQgICAgdGhpcy5nZXRIdG1sKGh0bWwpXG5cdCAgICAgIFx0XHQudGhlbihmdW5jdGlvbihoKSB7XG5cdFx0ICAgICAgXHRodG1sID0gaDtcblx0XHQgICAgICBcdHJldHVybiB0aGlzLmxvYWREeW5hbWljUmVxdWlyZW1lbnRzKGh0bWwpO1xuXHRcdCAgICB9LmJpbmQodGhpcykpXG5cdFx0ICAgICAgXHQudGhlbihmdW5jdGlvbigpIHtcblx0XHQgICAgICBcdHRoaXMuaHRtbCA9IGZhbHNlO1xuXHRcdCAgICAgIFx0dGhpcy5lbGVtZW50LmlubmVySFRNTCA9IGh0bWw7XG5cdFx0ICAgICAgXHR0aGlzLnJlbmRlcigpO1xuXHRcdCAgICB9LmJpbmQodGhpcykpO1xuXHRcdH1cblxuICBcdFx0cHJvdGVjdGVkIGdldEh0bWwoaHRtbDogc3RyaW5nKTogUHJvbWlzZTxzdHJpbmcsIHN0cmluZz4ge1xuXHRcdFx0aWYgKHR5cGVvZiBodG1sID09PSAndW5kZWZpbmVkJylcblx0XHQgICAgICBcdHJldHVybiBoby5wcm9taXNlLlByb21pc2UuY3JlYXRlKG51bGwpO1xuXHRcdCAgICBlbHNlIGlmIChodG1sLnNsaWNlKC01KSAhPT0gJy5odG1sJylcblx0XHQgICAgICBcdHJldHVybiBoby5wcm9taXNlLlByb21pc2UuY3JlYXRlKGh0bWwpO1xuXHRcdCAgICBlbHNlIHJldHVybiBuZXcgaG8ucHJvbWlzZS5Qcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcblxuXHRcdCAgICAgIFx0bGV0IHhtbGh0dHAgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcblx0XHQgICAgICBcdHhtbGh0dHAub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24oKSB7XG5cdFx0ICAgICAgICBcdGlmICh4bWxodHRwLnJlYWR5U3RhdGUgPT0gNCkge1xuXHRcdFx0ICAgICAgICAgIFx0dmFyIHJlc3AgPSB4bWxodHRwLnJlc3BvbnNlVGV4dDtcblx0XHRcdCAgICAgICAgICBcdGlmICh4bWxodHRwLnN0YXR1cyA9PSAyMDApIHtcblx0XHRcdCAgICAgICAgICAgIFx0cmVzb2x2ZShyZXNwKTtcblx0XHRcdCAgICAgICAgICBcdH0gZWxzZSB7XG5cdFx0XHQgICAgICAgICAgICBcdHJlamVjdChyZXNwKTtcblx0XHRcdCAgICAgICAgICBcdH1cblx0XHQgICAgICAgIFx0fVxuXHRcdCAgICAgIFx0fTtcblxuXHRcdCAgICAgIFx0eG1saHR0cC5vcGVuKCdHRVQnLCBodG1sLCB0cnVlKTtcblx0XHQgICAgICBcdHhtbGh0dHAuc2VuZCgpO1xuXG4gICAgXHRcdH0pO1xuXHRcdH1cblxuXHRcdHByb3RlY3RlZCBsb2FkRHluYW1pY1JlcXVpcmVtZW50cyhodG1sOiBzdHJpbmcpOiBQcm9taXNlPHN0cmluZywgc3RyaW5nPiB7XG5cdFx0ICAgIGxldCByZXF1aXJlbWVudHMgPSBodG1sLm1hdGNoKC88IS0tXFxzKnJlcXVpcmVzPz1cIiguKylcIi8pO1xuXHRcdCAgICBpZiAocmVxdWlyZW1lbnRzICE9PSBudWxsKVxuXHRcdCAgICAgIFx0cmVxdWlyZW1lbnRzID0gcmVxdWlyZW1lbnRzWzFdLnNwbGl0KFwiLFwiKS5tYXAoKHIpID0+IHsgcmV0dXJuIHIudHJpbSgpIH0pO1xuXHRcdCAgICBlbHNlXG5cdFx0ICAgICAgXHRyZXF1aXJlbWVudHMgPSBbXTtcblxuXHRcdCAgICBsZXQgUmVnaXN0cnkgPSBoby5jb21wb25lbnRzLnJlZ2lzdHJ5Lmluc3RhbmNlO1xuXG5cdFx0ICAgIGxldCBwcm9taXNlcyA9IHJlcXVpcmVtZW50c1xuXHQgICAgICBcdC5maWx0ZXIoKHJlcSkgPT4ge1xuXHRcdCAgICAgIFx0cmV0dXJuICFSZWdpc3RyeS5oYXNDb21wb25lbnQocmVxKTtcblx0XHQgICAgfSlcblx0XHQgICAgLm1hcCgocmVxKSA9PiB7XG5cdFx0ICAgIFx0cmV0dXJuIFJlZ2lzdHJ5LmxvYWRDb21wb25lbnQocmVxKTtcblx0XHQgICAgfSk7XG5cblx0XHQgICAgcmV0dXJuIFByb21pc2UuYWxsKHByb21pc2VzKTtcblx0XHR9XG5cdH1cbn1cbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==