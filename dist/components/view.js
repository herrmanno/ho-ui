/// <reference path="../../../bower_components/ho-promise/dist/d.ts/promise.d.ts"/>
/// <reference path="../../../bower_components/ho-components/dist/d.ts/components.d.ts"/>
/// <reference path="../../../bower_components/ho-flux/dist/d.ts/flux.d.ts"/>
/// <reference path="../../../bower_components/ho-flux/dist/d.ts/store.d.ts"/>
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbXBvbmVudHMvdmlldy50cyJdLCJuYW1lcyI6WyJobyIsImhvLnVpIiwiaG8udWkuY29tcG9uZW50cyIsImhvLnVpLmNvbXBvbmVudHMuVmlldyIsImhvLnVpLmNvbXBvbmVudHMuVmlldy5jb25zdHJ1Y3RvciIsImhvLnVpLmNvbXBvbmVudHMuVmlldy5pbml0IiwiaG8udWkuY29tcG9uZW50cy5WaWV3LnZpZXduYW1lIiwiaG8udWkuY29tcG9uZW50cy5WaWV3LnN0YXRlX2NoYW5nZWQiLCJoby51aS5jb21wb25lbnRzLlZpZXcuZ2V0SHRtbCIsImhvLnVpLmNvbXBvbmVudHMuVmlldy5sb2FkRHluYW1pY1JlcXVpcmVtZW50cyJdLCJtYXBwaW5ncyI6IkFBQUEsbUZBQW1GO0FBQ25GLHlGQUF5RjtBQUN6Riw2RUFBNkU7QUFDN0UsOEVBQThFOzs7Ozs7O0FBRTlFLElBQU8sRUFBRSxDQW9GUjtBQXBGRCxXQUFPLEVBQUU7SUFBQ0EsSUFBQUEsRUFBRUEsQ0FvRlhBO0lBcEZTQSxXQUFBQSxFQUFFQTtRQUFDQyxJQUFBQSxVQUFVQSxDQW9GdEJBO1FBcEZZQSxXQUFBQSxVQUFVQSxFQUFDQSxDQUFDQTtZQUV4QkMsSUFBT0EsU0FBU0EsR0FBR0EsRUFBRUEsQ0FBQ0EsVUFBVUEsQ0FBQ0EsU0FBU0EsQ0FBQUE7WUFDMUNBLElBQU9BLElBQUlBLEdBQUdBLEVBQUVBLENBQUNBLElBQUlBLENBQUNBO1lBQ3RCQSxJQUFPQSxPQUFPQSxHQUFHQSxFQUFFQSxDQUFDQSxPQUFPQSxDQUFDQSxPQUFPQSxDQUFDQTtZQUVwQ0E7Z0JBQTBCQyx3QkFBU0E7Z0JBQW5DQTtvQkFBMEJDLDhCQUFTQTtvQkFFbENBLFNBQUlBLEdBQUdBLEVBQUVBLENBQUNBO29CQUVWQSxlQUFVQSxHQUFHQTt3QkFDWkEsRUFBRUEsSUFBSUEsRUFBRUEsVUFBVUEsRUFBRUEsUUFBUUEsRUFBRUEsSUFBSUEsRUFBRUE7cUJBQ3BDQSxDQUFDQTtnQkF1RUhBLENBQUNBO2dCQXJFQUQs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Q0E7Z0JBQ2pDQSxDQUFDQTtnQkFDRk4sV0FBQ0E7WUFBREEsQ0E3RUFELEFBNkVDQyxFQTdFeUJELFNBQVNBLEVBNkVsQ0E7WUE3RVlBLGVBQUlBLE9BNkVoQkEsQ0FBQUE7UUFDRkEsQ0FBQ0EsRUFwRllELFVBQVVBLEdBQVZBLGFBQVVBLEtBQVZBLGFBQVVBLFFBb0Z0QkE7SUFBREEsQ0FBQ0EsRUFwRlNELEVBQUVBLEdBQUZBLEtBQUVBLEtBQUZBLEtBQUVBLFFBb0ZYQTtBQUFEQSxDQUFDQSxFQXBGTSxFQUFFLEtBQUYsRUFBRSxRQW9GUiIsImZpbGUiOiJjb21wb25lbnRzL3ZpZXcuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vLi4vLi4vYm93ZXJfY29tcG9uZW50cy9oby1wcm9taXNlL2Rpc3QvZC50cy9wcm9taXNlLmQudHNcIi8+XG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vLi4vLi4vYm93ZXJfY29tcG9uZW50cy9oby1jb21wb25lbnRzL2Rpc3QvZC50cy9jb21wb25lbnRzLmQudHNcIi8+XG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vLi4vLi4vYm93ZXJfY29tcG9uZW50cy9oby1mbHV4L2Rpc3QvZC50cy9mbHV4LmQudHNcIi8+XG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vLi4vLi4vYm93ZXJfY29tcG9uZW50cy9oby1mbHV4L2Rpc3QvZC50cy9zdG9yZS5kLnRzXCIvPlxuXG5tb2R1bGUgaG8udWkuY29tcG9uZW50cyB7XG5cblx0aW1wb3J0IENvbXBvbmVudCA9IGhvLmNvbXBvbmVudHMuQ29tcG9uZW50XG5cdGltcG9ydCBGbHV4ID0gaG8uZmx1eDtcblx0aW1wb3J0IFByb21pc2UgPSBoby5wcm9taXNlLlByb21pc2U7XG5cblx0ZXhwb3J0IGNsYXNzIFZpZXcgZXh0ZW5kcyBDb21wb25lbnQge1xuXG5cdFx0aHRtbCA9IFwiXCI7XG5cblx0XHRwcm9wZXJ0aWVzID0gW1xuXHRcdFx0eyBuYW1lOiAndmlld25hbWUnLCByZXF1aXJlZDogdHJ1ZSB9XG5cdFx0XTtcblxuXHRcdGluaXQoKSB7XG5cdFx0XHRGbHV4LlNUT1JFUy5nZXQoRmx1eC5Sb3V0ZXIpLnJlZ2lzdGVyKHRoaXMuc3RhdGVfY2hhbmdlZCwgdGhpcyk7XG5cdFx0fVxuXG5cdFx0Z2V0IHZpZXduYW1lKCkge1xuXHRcdFx0cmV0dXJuIHRoaXMucHJvcGVydGllc1sndmlld25hbWUnXTtcblx0XHR9XG5cbiAgXHRcdHByb3RlY3RlZCBzdGF0ZV9jaGFuZ2VkKGRhdGE6IGhvLmZsdXguSVJvdXRlckRhdGEpOiB2b2lkIHtcblx0XHQgICAgbGV0IGh0bWwgPSBkYXRhLnN0YXRlLnZpZXcuZmlsdGVyKCh2KSA9PiB7XG5cdCAgICAgIFx0XHRyZXR1cm4gdi5uYW1lID09PSB0aGlzLnZpZXduYW1lO1xuXHRcdCAgICB9KVswXS5odG1sO1xuXG5cdFx0ICAgIHRoaXMuZ2V0SHRtbChodG1sKVxuXHQgICAgICBcdFx0LnRoZW4oZnVuY3Rpb24oaCkge1xuXHRcdCAgICAgIFx0aHRtbCA9IGg7XG5cdFx0ICAgICAgXHRyZXR1cm4gdGhpcy5sb2FkRHluYW1pY1JlcXVpcmVtZW50cyhodG1sKTtcblx0XHQgICAgfS5iaW5kKHRoaXMpKVxuXHRcdCAgICAgIFx0LnRoZW4oZnVuY3Rpb24oKSB7XG5cdFx0ICAgICAgXHR0aGlzLmh0bWwgPSBmYWxzZTtcblx0XHQgICAgICBcdHRoaXMuZWxlbWVudC5pbm5lckhUTUwgPSBodG1sO1xuXHRcdCAgICAgIFx0dGhpcy5yZW5kZXIoKTtcblx0XHQgICAgfS5iaW5kKHRoaXMpKTtcblx0XHR9XG5cbiAgXHRcdHByb3RlY3RlZCBnZXRIdG1sKGh0bWw6IHN0cmluZyk6IFByb21pc2U8c3RyaW5nLCBzdHJpbmc+IHtcblx0XHRcdGlmICh0eXBlb2YgaHRtbCA9PT0gJ3VuZGVmaW5lZCcpXG5cdFx0ICAgICAgXHRyZXR1cm4gaG8ucHJvbWlzZS5Qcm9taXNlLmNyZWF0ZShudWxsKTtcblx0XHQgICAgZWxzZSBpZiAoaHRtbC5zbGljZSgtNSkgIT09ICcuaHRtbCcpXG5cdFx0ICAgICAgXHRyZXR1cm4gaG8ucHJvbWlzZS5Qcm9taXNlLmNyZWF0ZShodG1sKTtcblx0XHQgICAgZWxzZSByZXR1cm4gbmV3IGhvLnByb21pc2UuUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG5cblx0XHQgICAgICBcdGxldCB4bWxodHRwID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG5cdFx0ICAgICAgXHR4bWxodHRwLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uKCkge1xuXHRcdCAgICAgICAgXHRpZiAoeG1saHR0cC5yZWFkeVN0YXRlID09IDQpIHtcblx0XHRcdCAgICAgICAgICBcdHZhciByZXNwID0geG1saHR0cC5yZXNwb25zZVRleHQ7XG5cdFx0XHQgICAgICAgICAgXHRpZiAoeG1saHR0cC5zdGF0dXMgPT0gMjAwKSB7XG5cdFx0XHQgICAgICAgICAgICBcdHJlc29sdmUocmVzcCk7XG5cdFx0XHQgICAgICAgICAgXHR9IGVsc2Uge1xuXHRcdFx0ICAgICAgICAgICAgXHRyZWplY3QocmVzcCk7XG5cdFx0XHQgICAgICAgICAgXHR9XG5cdFx0ICAgICAgICBcdH1cblx0XHQgICAgICBcdH07XG5cblx0XHQgICAgICBcdHhtbGh0dHAub3BlbignR0VUJywgaHRtbCwgdHJ1ZSk7XG5cdFx0ICAgICAgXHR4bWxodHRwLnNlbmQoKTtcblxuICAgIFx0XHR9KTtcblx0XHR9XG5cblx0XHRwcm90ZWN0ZWQgbG9hZER5bmFtaWNSZXF1aXJlbWVudHMoaHRtbDogc3RyaW5nKTogUHJvbWlzZTxzdHJpbmcsIHN0cmluZz4ge1xuXHRcdCAgICBsZXQgcmVxdWlyZW1lbnRzID0gaHRtbC5tYXRjaCgvPCEtLVxccypyZXF1aXJlcz89XCIoLispXCIvKTtcblx0XHQgICAgaWYgKHJlcXVpcmVtZW50cyAhPT0gbnVsbClcblx0XHQgICAgICBcdHJlcXVpcmVtZW50cyA9IHJlcXVpcmVtZW50c1sxXS5zcGxpdChcIixcIikubWFwKChyKSA9PiB7IHJldHVybiByLnRyaW0oKSB9KTtcblx0XHQgICAgZWxzZVxuXHRcdCAgICAgIFx0cmVxdWlyZW1lbnRzID0gW107XG5cblx0XHQgICAgbGV0IFJlZ2lzdHJ5ID0gaG8uY29tcG9uZW50cy5yZWdpc3RyeS5pbnN0YW5jZTtcblxuXHRcdCAgICBsZXQgcHJvbWlzZXMgPSByZXF1aXJlbWVudHNcblx0ICAgICAgXHQuZmlsdGVyKChyZXEpID0+IHtcblx0XHQgICAgICBcdHJldHVybiAhUmVnaXN0cnkuaGFzQ29tcG9uZW50KHJlcSk7XG5cdFx0ICAgIH0pXG5cdFx0ICAgIC5tYXAoKHJlcSkgPT4ge1xuXHRcdCAgICBcdHJldHVybiBSZWdpc3RyeS5sb2FkQ29tcG9uZW50KHJlcSk7XG5cdFx0ICAgIH0pO1xuXG5cdFx0ICAgIHJldHVybiBQcm9taXNlLmFsbChwcm9taXNlcyk7XG5cdFx0fVxuXHR9XG59XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=