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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInByb21pc2UudHMiXSwibmFtZXMiOlsiaG8iLCJoby5wcm9taXNlIiwiaG8ucHJvbWlzZS5Qcm9taXNlIiwiaG8ucHJvbWlzZS5Qcm9taXNlLmNvbnN0cnVjdG9yIiwiaG8ucHJvbWlzZS5Qcm9taXNlLnNldCIsImhvLnByb21pc2UuUHJvbWlzZS5yZXNvbHZlIiwiaG8ucHJvbWlzZS5Qcm9taXNlLl9yZXNvbHZlIiwiaG8ucHJvbWlzZS5Qcm9taXNlLnJlamVjdCIsImhvLnByb21pc2UuUHJvbWlzZS5fcmVqZWN0IiwiaG8ucHJvbWlzZS5Qcm9taXNlLnRoZW4iLCJoby5wcm9taXNlLlByb21pc2UuY2F0Y2giLCJoby5wcm9taXNlLlByb21pc2UuYWxsIiwiaG8ucHJvbWlzZS5Qcm9taXNlLmNoYWluIiwiaG8ucHJvbWlzZS5Qcm9taXNlLmNoYWluLm5leHQiLCJoby5wcm9taXNlLlByb21pc2UuY3JlYXRlIl0sIm1hcHBpbmdzIjoiQUFBQSxJQUFPLEVBQUUsQ0ErS1I7QUEvS0QsV0FBTyxFQUFFO0lBQUNBLElBQUFBLE9BQU9BLENBK0toQkE7SUEvS1NBLFdBQUFBLE9BQU9BLEVBQUNBLENBQUNBO1FBRWZDO1lBRUlDLGlCQUFZQSxJQUEyREE7Z0JBYS9EQyxTQUFJQSxHQUFRQSxTQUFTQSxDQUFDQTtnQkFDdEJBLGNBQVNBLEdBQW9CQSxTQUFTQSxDQUFDQTtnQkFDdkNBLGFBQVFBLEdBQW9CQSxTQUFTQSxDQUFDQTtnQkFFdkNBLGFBQVFBLEdBQVlBLEtBQUtBLENBQUNBO2dCQUMxQkEsYUFBUUEsR0FBWUEsS0FBS0EsQ0FBQ0E7Z0JBQzFCQSxTQUFJQSxHQUFZQSxLQUFLQSxDQUFDQTtnQkFFckJBLFFBQUdBLEdBQWtCQSxTQUFTQSxDQUFDQTtnQkFwQm5DQSxFQUFFQSxDQUFDQSxDQUFDQSxPQUFPQSxJQUFJQSxLQUFLQSxVQUFVQSxDQUFDQTtvQkFDM0JBLElBQUlBLENBQUNBLElBQUlBLENBQ0xBLFNBQVNBLENBQUNBLE1BQU1BLEVBQ2hCQSxV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QUFDQSxHQUFHQSxZQUFZQSxPQUFPQSxDQUFDQTtvQkFDdkJBLE1BQU1BLENBQUNBLEdBQUdBLENBQUNBO2dCQUNmQSxJQUFJQSxDQUFDQSxDQUFDQTtvQkFDRkEsSUFBSUEsQ0FBQ0EsR0FBR0EsSUFBSUEsT0FBT0EsRUFBRUEsQ0FBQ0E7b0JBQ3RCQSxDQUFDQSxDQUFDQSxPQUFPQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQTtvQkFDZkEsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7Z0JBQ2JBLENBQUNBO1lBQ0xBLENBQUNBO1lBQ0xaLGNBQUNBO1FBQURBLENBM0tBRCxBQTJLQ0MsSUFBQUQ7UUEzS1lBLGVBQU9BLFVBMktuQkEsQ0FBQUE7SUFFTEEsQ0FBQ0EsRUEvS1NELE9BQU9BLEdBQVBBLFVBQU9BLEtBQVBBLFVBQU9BLFFBK0toQkE7QUFBREEsQ0FBQ0EsRUEvS00sRUFBRSxLQUFGLEVBQUUsUUErS1IiLCJmaWxlIjoicHJvbWlzZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZSBoby5wcm9taXNlIHtcclxuXHJcbiAgICBleHBvcnQgY2xhc3MgUHJvbWlzZTxULCBFPiB7XHJcblxyXG4gICAgICAgIGNvbnN0cnVjdG9yKGZ1bmM/OiAocmVzb2x2ZTooYXJnOlQpPT52b2lkLCByZWplY3Q6KGFyZzpFKT0+dm9pZCkgPT4gYW55KSB7XHJcbiAgICAgICAgICAgIGlmICh0eXBlb2YgZnVuYyA9PT0gJ2Z1bmN0aW9uJylcclxuICAgICAgICAgICAgICAgIGZ1bmMuY2FsbChcclxuICAgICAgICAgICAgICAgICAgICBhcmd1bWVudHMuY2FsbGVlLFxyXG4gICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uKGFyZzogVCl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucmVzb2x2ZShhcmcpXHJcbiAgICAgICAgICAgICAgICAgICAgfS5iaW5kKHRoaXMpLFxyXG4gICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uKGFyZzpFKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5yZWplY3QoYXJnKTtcclxuICAgICAgICAgICAgICAgICAgICB9LmJpbmQodGhpcylcclxuICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIGRhdGE6IFR8RSA9IHVuZGVmaW5lZDtcclxuICAgICAgICBwcml2YXRlIG9uUmVzb2x2ZTogKGFyZzE6VCkgPT4gYW55ID0gdW5kZWZpbmVkO1xyXG4gICAgICAgIHByaXZhdGUgb25SZWplY3Q6IChhcmcxOkUpID0+IGFueSA9IHVuZGVmaW5lZDtcclxuXHJcbiAgICAgICAgcHVibGljIHJlc29sdmVkOiBib29sZWFuID0gZmFsc2U7XHJcbiAgICAgICAgcHVibGljIHJlamVjdGVkOiBib29sZWFuID0gZmFsc2U7XHJcbiAgICAgICAgcHVibGljIGRvbmU6IGJvb2xlYW4gPSBmYWxzZTtcclxuXHJcbiAgICAgICAgcHJpdmF0ZSByZXQ6IFByb21pc2U8VCwgRT4gPSB1bmRlZmluZWQ7XHJcblxyXG4gICAgICAgIHByaXZhdGUgc2V0KGRhdGE/OiBUfEUpOiB2b2lkIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuZG9uZSlcclxuICAgICAgICAgICAgICAgIHRocm93IFwiUHJvbWlzZSBpcyBhbHJlYWR5IHJlc29sdmVkIC8gcmVqZWN0ZWRcIjtcclxuICAgICAgICAgICAgdGhpcy5kYXRhID0gZGF0YTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyByZXNvbHZlKGRhdGE/OiBUKTogdm9pZCB7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0KGRhdGEpO1xyXG4gICAgICAgICAgICB0aGlzLnJlc29sdmVkID0gdGhpcy5kb25lID0gdHJ1ZTtcclxuICAgICAgICAgICAgaWYgKHR5cGVvZiB0aGlzLm9uUmVzb2x2ZSA9PT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fcmVzb2x2ZSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIF9yZXNvbHZlKCk6IHZvaWQge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5yZXQgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5yZXQgPSBuZXcgUHJvbWlzZTxULEU+KCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHZhciB2OiBhbnkgPSB0aGlzLm9uUmVzb2x2ZSg8VD50aGlzLmRhdGEpO1xyXG5cclxuICAgICAgICAgICAgaWYgKHYgJiYgdiBpbnN0YW5jZW9mIFByb21pc2UpIHtcclxuICAgICAgICAgICAgICAgIHYudGhlbih0aGlzLnJldC5yZXNvbHZlLmJpbmQodGhpcy5yZXQpLCB0aGlzLnJldC5yZWplY3QuYmluZCh0aGlzLnJldCkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5yZXQucmVzb2x2ZSh2KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHJlamVjdChkYXRhPzogRSk6IHZvaWQge1xyXG4gICAgICAgICAgICB0aGlzLnNldChkYXRhKTtcclxuICAgICAgICAgICAgdGhpcy5yZWplY3RlZCA9IHRoaXMuZG9uZSA9IHRydWU7XHJcblxyXG4gICAgICAgICAgICBpZiAodHlwZW9mIHRoaXMub25SZWplY3QgPT09ICdmdW5jdGlvbicpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMub25SZWplY3QoPEU+dGhpcy5kYXRhKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKHRoaXMucmV0KSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnJldC5yZWplY3QoPEU+dGhpcy5kYXRhKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSBfcmVqZWN0KCk6IHZvaWQge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5yZXQgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5yZXQgPSBuZXcgUHJvbWlzZTxULEU+KCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHRoaXMub25SZWplY3QoPEU+dGhpcy5kYXRhKTtcclxuICAgICAgICAgICAgdGhpcy5yZXQucmVqZWN0KDxFPnRoaXMuZGF0YSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgdGhlbihyZXM6IChhcmcxOlQpPT5hbnksIHJlaj86IChhcmcxOkUpPT5hbnkpOiBQcm9taXNlPGFueSxhbnk+IHtcclxuICAgICAgICAgICAgaWYgKHRoaXMucmV0ID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMucmV0ID0gbmV3IFByb21pc2U8VCxFPigpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAocmVzICYmIHR5cGVvZiByZXMgPT09ICdmdW5jdGlvbicpXHJcbiAgICAgICAgICAgICAgICB0aGlzLm9uUmVzb2x2ZSA9IHJlcztcclxuXHJcbiAgICAgICAgICAgIGlmIChyZWogJiYgdHlwZW9mIHJlaiA9PT0gJ2Z1bmN0aW9uJylcclxuICAgICAgICAgICAgICAgIHRoaXMub25SZWplY3QgPSByZWo7XHJcblxyXG4gICAgICAgICAgICBpZiAodGhpcy5yZXNvbHZlZCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fcmVzb2x2ZSgpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAodGhpcy5yZWplY3RlZCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fcmVqZWN0KCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnJldDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBjYXRjaChjYjogKGFyZzE6RSk9PmFueSk6IHZvaWQge1xyXG4gICAgICAgICAgICB0aGlzLm9uUmVqZWN0ID0gY2I7XHJcblxyXG4gICAgICAgICAgICBpZiAodGhpcy5yZWplY3RlZClcclxuICAgICAgICAgICAgICAgIHRoaXMuX3JlamVjdCgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc3RhdGljIGFsbChhcnI6IEFycmF5PFByb21pc2U8YW55LCBhbnk+Pik6IFByb21pc2U8YW55LCBhbnk+IHtcclxuICAgICAgICAgICAgdmFyIHAgPSBuZXcgUHJvbWlzZSgpO1xyXG5cclxuICAgICAgICAgICAgdmFyIGRhdGEgPSBbXTtcclxuXHJcbiAgICAgICAgICAgIGlmIChhcnIubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgICBwLnJlc29sdmUoKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGFyci5mb3JFYWNoKChwcm9tLCBpbmRleCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHByb21cclxuICAgICAgICAgICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24oZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocC5kb25lKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YVtpbmRleF0gPSBkO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgYWxsUmVzb2x2ZWQgPSBhcnIucmVkdWNlKGZ1bmN0aW9uKHN0YXRlLCBwMSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHN0YXRlICYmIHAxLnJlc29sdmVkO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LCB0cnVlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGFsbFJlc29sdmVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwLnJlc29sdmUoZGF0YSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgLmNhdGNoKGZ1bmN0aW9uKGVycikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwLnJlamVjdChlcnIpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiBwO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc3RhdGljIGNoYWluKGFycjogQXJyYXk8UHJvbWlzZTxhbnksIGFueT4+KTogUHJvbWlzZTxhbnksIGFueT4ge1xyXG4gICAgICAgICAgICB2YXIgcDogUHJvbWlzZTxhbnksIGFueT4gPSBuZXcgUHJvbWlzZSgpO1xyXG4gICAgICAgICAgICB2YXIgZGF0YTogQXJyYXk8YW55PiA9IFtdO1xyXG5cclxuICAgICAgICAgICAgZnVuY3Rpb24gbmV4dCgpIHtcclxuICAgICAgICAgICAgICAgIGlmIChwLmRvbmUpXHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgICAgICAgICAgIHZhciBuOiBQcm9taXNlPGFueSwgYW55PiA9IGFyci5sZW5ndGggPyBhcnIuc2hpZnQoKSA6IHA7XHJcbiAgICAgICAgICAgICAgICBuLnRoZW4oXHJcbiAgICAgICAgICAgICAgICAgICAgKHJlc3VsdCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhLnB1c2gocmVzdWx0KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmV4dCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgKGVycikgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwLnJlamVjdChlcnIpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBuZXh0KCk7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gcDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHN0YXRpYyBjcmVhdGUob2JqOiBhbnkpOiBQcm9taXNlPGFueSwgYW55PiB7XHJcbiAgICAgICAgICAgIGlmIChvYmogaW5zdGFuY2VvZiBQcm9taXNlKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG9iajtcclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgcCA9IG5ldyBQcm9taXNlKCk7XHJcbiAgICAgICAgICAgICAgICBwLnJlc29sdmUob2JqKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBwO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxufVxyXG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndhdGNoLnRzIl0sIm5hbWVzIjpbImhvIiwiaG8ud2F0Y2giLCJoby53YXRjaC53YXRjaCIsImhvLndhdGNoLldhdGNoZXIiLCJoby53YXRjaC5XYXRjaGVyLmNvbnN0cnVjdG9yIiwiaG8ud2F0Y2guV2F0Y2hlci53YXRjaCIsImhvLndhdGNoLldhdGNoZXIuY29weSJdLCJtYXBwaW5ncyI6IkFBTUEsSUFBTyxFQUFFLENBK0NSO0FBL0NELFdBQU8sRUFBRTtJQUFDQSxJQUFBQSxLQUFLQSxDQStDZEE7SUEvQ1NBLFdBQUFBLE9BQUtBLEVBQUNBLENBQUNBO1FBSWhCQyxlQUFzQkEsR0FBUUEsRUFBRUEsSUFBWUEsRUFBRUEsT0FBZ0JBO1lBQzdEQyxJQUFJQSxPQUFPQSxDQUFDQSxHQUFHQSxFQUFFQSxJQUFJQSxFQUFFQSxPQUFPQSxDQUFDQSxDQUFDQTtRQUNqQ0EsQ0FBQ0E7UUFGZUQsYUFBS0EsUUFFcEJBLENBQUFBO1FBRURBO1lBSUNFLGlCQUFvQkEsR0FBUUEsRUFBVUEsSUFBWUEsRUFBVUEsT0FBZ0JBO2dCQUo3RUMsaUJBcUNDQTtnQkFqQ29CQSxRQUFHQSxHQUFIQSxHQUFHQSxDQUFLQTtnQkFBVUEsU0FBSUEsR0FBSkEsSUFBSUEsQ0FBUUE7Z0JBQVVBLFlBQU9BLEdBQVBBLE9BQU9BLENBQVNBO2dCQUMzRUEsSUFBSUEsQ0FBQ0EsTUFBTUEsR0FBR0EsSUFBSUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7Z0JBRW5DQSxJQUFJQSxDQUFDQSxLQUFLQSxDQUFDQSxVQUFBQSxTQUFTQTtvQkFDbkJBLEVBQUVBLENBQUFBLENBQUNBLEtBQUlBLENBQUNBLE1BQU1BLEtBQUtBLEdBQUdBLENBQUNBLElBQUlBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO3dCQUM5QkEsS0FBSUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsSUFBSUEsRUFBRUEsR0FBR0EsRUFBRUEsSUFBSUEsRUFBRUEsS0FBSUEsQ0FBQ0EsTUFBTUEsRUFBRUEsR0FBR0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsRUFBRUEsU0FBU0EsQ0FBQ0EsQ0FBQ0E7d0JBQ3RFQSxLQUFJQSxDQUFDQSxNQUFNQSxHQUFHQSxLQUFJQSxDQUFDQSxJQUFJQSxDQUFDQSxHQUFHQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQSxDQUFDQTtvQkFDcENBLENBQUNBO2dCQUNGQSxDQUFDQSxDQUFDQSxDQUFDQTtZQUNKQSxDQUFDQTtZQUVPRCx1QkFBS0EsR0FBYkEsVUFBY0EsRUFBMkJBO2dCQUN4Q0UsSUFBSUEsRUFBRUEsR0FDTkEsTUFBTUEsQ0FBQ0EscUJBQXFCQTtvQkFDMUJBLE1BQU1BLENBQUNBLDJCQUEyQkE7b0JBQ2xDQSxNQUFNQSxDQUFDQSx3QkFBd0JBO29CQUMvQkEsTUFBTUEsQ0FBQ0Esc0JBQXNCQTtvQkFDN0JBLE1BQU1BLENBQUNBLHVCQUF1QkE7b0JBQzlCQSxVQUFTQSxRQUFrQkE7d0JBQzVCLE1BQU0sQ0FBQyxVQUFVLENBQUMsUUFBUSxFQUFFLElBQUksR0FBRyxFQUFFLENBQUMsQ0FBQztvQkFDdEMsQ0FBQyxDQUFDQTtnQkFFSkEsSUFBSUEsSUFBSUEsR0FBR0EsVUFBQ0EsRUFBVUE7b0JBQ3JCQSxFQUFFQSxDQUFDQSxFQUFFQSxDQUFDQSxDQUFDQTtvQkFDUEEsRUFBRUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0E7Z0JBQ1ZBLENBQUNBLENBQUFBO2dCQUVEQSxFQUFFQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQTtZQUNWQSxDQUFDQTtZQUVPRixzQkFBSUEsR0FBWkEsVUFBYUEsR0FBUUE7Z0JBQ3BCRyxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQSxLQUFLQSxDQUFDQSxJQUFJQSxDQUFDQSxTQUFTQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQSxDQUFDQTtZQUN4Q0EsQ0FBQ0E7WUFDRkgsY0FBQ0E7UUFBREEsQ0FyQ0FGLEFBcUNDRSxJQUFBRjtJQUVGQSxDQUFDQSxFQS9DU0QsS0FBS0EsR0FBTEEsUUFBS0EsS0FBTEEsUUFBS0EsUUErQ2RBO0FBQURBLENBQUNBLEVBL0NNLEVBQUUsS0FBRixFQUFFLFFBK0NSIiwiZmlsZSI6IndhdGNoLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW50ZXJmYWNlIFdpbmRvdyB7XG5cdHdlYmtpdFJlcXVlc3RBbmltYXRpb25GcmFtZTogKGNhbGxiYWNrOiBGcmFtZVJlcXVlc3RDYWxsYmFjaykgPT4gbnVtYmVyO1xuXHRtb3pSZXF1ZXN0QW5pbWF0aW9uRnJhbWU6IChjYWxsYmFjazogRnJhbWVSZXF1ZXN0Q2FsbGJhY2spID0+IG51bWJlcjtcblx0b1JlcXVlc3RBbmltYXRpb25GcmFtZTogKGNhbGxiYWNrOiBGcmFtZVJlcXVlc3RDYWxsYmFjaykgPT4gbnVtYmVyO1xufVxuXG5tb2R1bGUgaG8ud2F0Y2gge1xuXG5cdGV4cG9ydCB0eXBlIEhhbmRsZXIgPSAob2JqOmFueSwgbmFtZTpzdHJpbmcsIG9sZFY6YW55LCBuZXdWOmFueSwgIHRpbWVzdGFtcD86IG51bWJlcik9PmFueTtcblxuXHRleHBvcnQgZnVuY3Rpb24gd2F0Y2gob2JqOiBhbnksIG5hbWU6IHN0cmluZywgaGFuZGxlcjogSGFuZGxlcik6IHZvaWQge1xuXHRcdG5ldyBXYXRjaGVyKG9iaiwgbmFtZSwgaGFuZGxlcik7XG5cdH1cblxuXHRjbGFzcyBXYXRjaGVyIHtcblxuXHRcdHByaXZhdGUgb2xkVmFsOmFueTtcblxuXHRcdGNvbnN0cnVjdG9yKHByaXZhdGUgb2JqOiBhbnksIHByaXZhdGUgbmFtZTogc3RyaW5nLCBwcml2YXRlIGhhbmRsZXI6IEhhbmRsZXIpIHtcblx0XHRcdHRoaXMub2xkVmFsID0gdGhpcy5jb3B5KG9ialtuYW1lXSk7XG5cblx0XHRcdHRoaXMud2F0Y2godGltZXN0YW1wID0+IHtcblx0XHRcdFx0aWYodGhpcy5vbGRWYWwgIT09IG9ialtuYW1lXSkge1xuXHRcdFx0XHRcdHRoaXMuaGFuZGxlci5jYWxsKG51bGwsIG9iaiwgbmFtZSwgdGhpcy5vbGRWYWwsIG9ialtuYW1lXSwgdGltZXN0YW1wKTtcblx0XHRcdFx0XHR0aGlzLm9sZFZhbCA9IHRoaXMuY29weShvYmpbbmFtZV0pO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHR9XG5cblx0XHRwcml2YXRlIHdhdGNoKGNiOiAodGltZVN0YW1wOm51bWJlcik9PmFueSk6IHZvaWQge1xuXHRcdFx0bGV0IGZuOiBGdW5jdGlvbiA9XG5cdFx0XHR3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lICAgICAgIHx8XG5cdCAgXHRcdHdpbmRvdy53ZWJraXRSZXF1ZXN0QW5pbWF0aW9uRnJhbWUgfHxcblx0ICBcdFx0d2luZG93Lm1velJlcXVlc3RBbmltYXRpb25GcmFtZSAgICB8fFxuXHQgIFx0XHR3aW5kb3cub1JlcXVlc3RBbmltYXRpb25GcmFtZSAgICAgIHx8XG5cdCAgXHRcdHdpbmRvdy5tc1JlcXVlc3RBbmltYXRpb25GcmFtZSAgICAgfHxcblx0ICBcdFx0ZnVuY3Rpb24oY2FsbGJhY2s6IEZ1bmN0aW9uKXtcblx0XHRcdFx0d2luZG93LnNldFRpbWVvdXQoY2FsbGJhY2ssIDEwMDAgLyA2MCk7XG5cdCAgXHRcdH07XG5cblx0XHRcdGxldCB3cmFwID0gKHRzOiBudW1iZXIpID0+IHtcblx0XHRcdFx0Y2IodHMpO1xuXHRcdFx0XHRmbih3cmFwKTtcblx0XHRcdH1cblxuXHRcdFx0Zm4od3JhcCk7XG5cdFx0fVxuXG5cdFx0cHJpdmF0ZSBjb3B5KHZhbDogYW55KTogYW55IHtcblx0XHRcdHJldHVybiBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KHZhbCkpO1xuXHRcdH1cblx0fVxuXG59XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
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
/// <reference path="../../bower_components/ho-promise/dist/d.ts/promise.d.ts"/>
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
            var AttributeProvider = (function () {
                function AttributeProvider() {
                    this.useMin = false;
                }
                AttributeProvider.prototype.resolve = function (name) {
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
                    var _this = this;
                    this.components.forEach(function (component) {
                        _this.initComponent(component, element);
                    });
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
                Registry.prototype.getParentOfComponent = function (name) {
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
                        xmlhttp.open('GET', ho.components.componentprovider.instance.resolve(name));
                        xmlhttp.send();
                    });
                };
                Registry.prototype.loadAttribute = function (name) {
                    var self = this;
                    return new Promise(function (resolve, reject) {
                        ho.components.attributeprovider.instance.getAttribute(name)
                            .then(function (attribute) {
                            self.register(attribute);
                            resolve(attribute);
                        });
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
                        var tag, type, closing, selfClosing, repeat, unClose;
                        //------- found some text before next tag
                        if (m.index !== 0) {
                            tag = html.match(this.r.text)[0];
                            tag = tag.substr(0, tag.length - 1);
                            type = 'TEXT';
                            selfClosing = true;
                            repeat = false;
                        }
                        else {
                            tag = m[1].trim();
                            type = (tag + '>').match(this.r.type)[1];
                            closing = tag[0] === '/';
                            selfClosing = tag[tag.length - 1] === '/';
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
                            root.children.push({ parent: root, html: tag, type: type, selfClosing: selfClosing, repeat: repeat, children: [] });
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
                        if (root.type !== 'TEXT')
                            html += '<' + root.html + '>';
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
                return Renderer;
            })();
            renderer.Renderer = Renderer;
            renderer.instance = new Renderer();
        })(renderer = components.renderer || (components.renderer = {}));
    })(components = ho.components || (ho.components = {}));
})(ho || (ho = {}));
/// <reference path="./main"/>
/// <reference path="./registry"/>
/// <reference path="./htmlprovider.ts"/>
/// <reference path="./renderer.ts"/>
/// <reference path="./attribute.ts"/>
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
                Registry.initElement(this.element);
                this.initChildren();
                this.initAttributes();
                this.update();
            };
            ;
            /**
            *  Assure that this instance has an valid html attribute and if not load and set it.
            */
            Component.prototype.initHTML = function () {
                var p = new Promise();
                var self = this;
                if (typeof this.html === 'boolean')
                    p.resolve();
                if (typeof this.html === 'string')
                    p.resolve();
                if (typeof this.html === 'undefined') {
                    //let name = Component.getName(this);
                    HtmlProvider.getHTML(this.name)
                        .then(function (html) {
                        self.html = html;
                        p.resolve();
                    })
                        .catch(p.reject);
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbXBvbmVudHNwcm92aWRlci50cyIsImF0dHJpYnV0ZS50cyIsImF0dHJpYnV0ZXByb3ZpZGVyLnRzIiwicmVnaXN0cnkudHMiLCJtYWluLnRzIiwiaHRtbHByb3ZpZGVyLnRzIiwidGVtcC50cyIsInJlbmRlcmVyLnRzIiwiY29tcG9uZW50cy50cyJdLCJuYW1lcyI6WyJobyIsImhvLmNvbXBvbmVudHMiLCJoby5jb21wb25lbnRzLmNvbXBvbmVudHByb3ZpZGVyIiwiaG8uY29tcG9uZW50cy5jb21wb25lbnRwcm92aWRlci5Db21wb25lbnRQcm92aWRlciIsImhvLmNvbXBvbmVudHMuY29tcG9uZW50cHJvdmlkZXIuQ29tcG9uZW50UHJvdmlkZXIuY29uc3RydWN0b3IiLCJoby5jb21wb25lbnRzLmNvbXBvbmVudHByb3ZpZGVyLkNvbXBvbmVudFByb3ZpZGVyLnJlc29sdmUiLCJoby5jb21wb25lbnRzLmNvbXBvbmVudHByb3ZpZGVyLkNvbXBvbmVudFByb3ZpZGVyLmdldENvbXBvbmVudCIsImhvLmNvbXBvbmVudHMuY29tcG9uZW50cHJvdmlkZXIuQ29tcG9uZW50UHJvdmlkZXIuZ2V0IiwiaG8uY29tcG9uZW50cy5BdHRyaWJ1dGUiLCJoby5jb21wb25lbnRzLkF0dHJpYnV0ZS5jb25zdHJ1Y3RvciIsImhvLmNvbXBvbmVudHMuQXR0cmlidXRlLmluaXQiLCJoby5jb21wb25lbnRzLkF0dHJpYnV0ZS5uYW1lIiwiaG8uY29tcG9uZW50cy5BdHRyaWJ1dGUudXBkYXRlIiwiaG8uY29tcG9uZW50cy5BdHRyaWJ1dGUuZ2V0TmFtZSIsImhvLmNvbXBvbmVudHMuV2F0Y2hBdHRyaWJ1dGUiLCJoby5jb21wb25lbnRzLldhdGNoQXR0cmlidXRlLmNvbnN0cnVjdG9yIiwiaG8uY29tcG9uZW50cy5XYXRjaEF0dHJpYnV0ZS53YXRjaCIsImhvLmNvbXBvbmVudHMuV2F0Y2hBdHRyaWJ1dGUuZXZhbCIsImhvLmNvbXBvbmVudHMuYXR0cmlidXRlcHJvdmlkZXIiLCJoby5jb21wb25lbnRzLmF0dHJpYnV0ZXByb3ZpZGVyLkF0dHJpYnV0ZVByb3ZpZGVyIiwiaG8uY29tcG9uZW50cy5hdHRyaWJ1dGVwcm92aWRlci5BdHRyaWJ1dGVQcm92aWRlci5jb25zdHJ1Y3RvciIsImhvLmNvbXBvbmVudHMuYXR0cmlidXRlcHJvdmlkZXIuQXR0cmlidXRlUHJvdmlkZXIucmVzb2x2ZSIsImhvLmNvbXBvbmVudHMuYXR0cmlidXRlcHJvdmlkZXIuQXR0cmlidXRlUHJvdmlkZXIuZ2V0QXR0cmlidXRlIiwiaG8uY29tcG9uZW50cy5yZWdpc3RyeSIsImhvLmNvbXBvbmVudHMucmVnaXN0cnkuUmVnaXN0cnkiLCJoby5jb21wb25lbnRzLnJlZ2lzdHJ5LlJlZ2lzdHJ5LmNvbnN0cnVjdG9yIiwiaG8uY29tcG9uZW50cy5yZWdpc3RyeS5SZWdpc3RyeS5yZWdpc3RlciIsImhvLmNvbXBvbmVudHMucmVnaXN0cnkuUmVnaXN0cnkucnVuIiwiaG8uY29tcG9uZW50cy5yZWdpc3RyeS5SZWdpc3RyeS5pbml0Q29tcG9uZW50IiwiaG8uY29tcG9uZW50cy5yZWdpc3RyeS5SZWdpc3RyeS5pbml0RWxlbWVudCIsImhvLmNvbXBvbmVudHMucmVnaXN0cnkuUmVnaXN0cnkuaGFzQ29tcG9uZW50IiwiaG8uY29tcG9uZW50cy5yZWdpc3RyeS5SZWdpc3RyeS5oYXNBdHRyaWJ1dGUiLCJoby5jb21wb25lbnRzLnJlZ2lzdHJ5LlJlZ2lzdHJ5LmdldEF0dHJpYnV0ZSIsImhvLmNvbXBvbmVudHMucmVnaXN0cnkuUmVnaXN0cnkubG9hZENvbXBvbmVudCIsImhvLmNvbXBvbmVudHMucmVnaXN0cnkuUmVnaXN0cnkuZ2V0UGFyZW50T2ZDb21wb25lbnQiLCJoby5jb21wb25lbnRzLnJlZ2lzdHJ5LlJlZ2lzdHJ5LmxvYWRBdHRyaWJ1dGUiLCJoby5jb21wb25lbnRzLnJ1biIsImhvLmNvbXBvbmVudHMucmVnaXN0ZXIiLCJoby5jb21wb25lbnRzLmh0bWxwcm92aWRlciIsImhvLmNvbXBvbmVudHMuaHRtbHByb3ZpZGVyLkh0bWxQcm92aWRlciIsImhvLmNvbXBvbmVudHMuaHRtbHByb3ZpZGVyLkh0bWxQcm92aWRlci5jb25zdHJ1Y3RvciIsImhvLmNvbXBvbmVudHMuaHRtbHByb3ZpZGVyLkh0bWxQcm92aWRlci5yZXNvbHZlIiwiaG8uY29tcG9uZW50cy5odG1scHJvdmlkZXIuSHRtbFByb3ZpZGVyLmdldEhUTUwiLCJoby5jb21wb25lbnRzLnRlbXAiLCJoby5jb21wb25lbnRzLnRlbXAuc2V0IiwiaG8uY29tcG9uZW50cy50ZW1wLmdldCIsImhvLmNvbXBvbmVudHMudGVtcC5jYWxsIiwiaG8uY29tcG9uZW50cy5yZW5kZXJlciIsImhvLmNvbXBvbmVudHMucmVuZGVyZXIuTm9kZSIsImhvLmNvbXBvbmVudHMucmVuZGVyZXIuTm9kZS5jb25zdHJ1Y3RvciIsImhvLmNvbXBvbmVudHMucmVuZGVyZXIuUmVuZGVyZXIiLCJoby5jb21wb25lbnRzLnJlbmRlcmVyLlJlbmRlcmVyLmNvbnN0cnVjdG9yIiwiaG8uY29tcG9uZW50cy5yZW5kZXJlci5SZW5kZXJlci5yZW5kZXIiLCJoby5jb21wb25lbnRzLnJlbmRlcmVyLlJlbmRlcmVyLnBhcnNlIiwiaG8uY29tcG9uZW50cy5yZW5kZXJlci5SZW5kZXJlci5yZW5kZXJSZXBlYXQiLCJoby5jb21wb25lbnRzLnJlbmRlcmVyLlJlbmRlcmVyLmRvbVRvU3RyaW5nIiwiaG8uY29tcG9uZW50cy5yZW5kZXJlci5SZW5kZXJlci5yZXBsIiwiaG8uY29tcG9uZW50cy5yZW5kZXJlci5SZW5kZXJlci5ldmFsdWF0ZSIsImhvLmNvbXBvbmVudHMucmVuZGVyZXIuUmVuZGVyZXIuZXZhbHVhdGVWYWx1ZSIsImhvLmNvbXBvbmVudHMucmVuZGVyZXIuUmVuZGVyZXIuZXZhbHVhdGVWYWx1ZUFuZE1vZGVsIiwiaG8uY29tcG9uZW50cy5yZW5kZXJlci5SZW5kZXJlci5ldmFsdWF0ZUV4cHJlc3Npb24iLCJoby5jb21wb25lbnRzLnJlbmRlcmVyLlJlbmRlcmVyLmV2YWx1YXRlRnVuY3Rpb24iLCJoby5jb21wb25lbnRzLnJlbmRlcmVyLlJlbmRlcmVyLmNvcHlOb2RlIiwiaG8uY29tcG9uZW50cy5Db21wb25lbnQiLCJoby5jb21wb25lbnRzLkNvbXBvbmVudC5jb25zdHJ1Y3RvciIsImhvLmNvbXBvbmVudHMuQ29tcG9uZW50Lm5hbWUiLCJoby5jb21wb25lbnRzLkNvbXBvbmVudC5nZXROYW1lIiwiaG8uY29tcG9uZW50cy5Db21wb25lbnQuZ2V0UGFyZW50IiwiaG8uY29tcG9uZW50cy5Db21wb25lbnQuX2luaXQiLCJoby5jb21wb25lbnRzLkNvbXBvbmVudC5pbml0IiwiaG8uY29tcG9uZW50cy5Db21wb25lbnQudXBkYXRlIiwiaG8uY29tcG9uZW50cy5Db21wb25lbnQucmVuZGVyIiwiaG8uY29tcG9uZW50cy5Db21wb25lbnQuaW5pdEhUTUwiLCJoby5jb21wb25lbnRzLkNvbXBvbmVudC5pbml0UHJvcGVydGllcyIsImhvLmNvbXBvbmVudHMuQ29tcG9uZW50LmluaXRDaGlsZHJlbiIsImhvLmNvbXBvbmVudHMuQ29tcG9uZW50LmluaXRBdHRyaWJ1dGVzIiwiaG8uY29tcG9uZW50cy5Db21wb25lbnQubG9hZFJlcXVpcmVtZW50cyIsImhvLmNvbXBvbmVudHMuQ29tcG9uZW50LmdldENvbXBvbmVudCJdLCJtYXBwaW5ncyI6IkFBQUEsSUFBTyxFQUFFLENBNkNSO0FBN0NELFdBQU8sRUFBRTtJQUFDQSxJQUFBQSxVQUFVQSxDQTZDbkJBO0lBN0NTQSxXQUFBQSxVQUFVQTtRQUFDQyxJQUFBQSxpQkFBaUJBLENBNkNyQ0E7UUE3Q29CQSxXQUFBQSxpQkFBaUJBLEVBQUNBLENBQUNBO1lBQ3BDQyxJQUFPQSxPQUFPQSxHQUFHQSxFQUFFQSxDQUFDQSxPQUFPQSxDQUFDQSxPQUFPQSxDQUFDQTtZQUV6QkEseUJBQU9BLEdBQTJCQSxFQUFFQSxDQUFDQTtZQUVoREE7Z0JBQUFDO29CQUVJQyxXQUFNQSxHQUFZQSxLQUFLQSxDQUFDQTtnQkFr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QUdBLENBQUNBLElBQUlBLENBQUNBLElBQUlBLENBQUNBLENBQUNBLEtBQUtBLElBQUlBLEVBQUVBLENBQUNBO3dCQUM1Q0EsSUFBSUEsR0FBR0EsRUFBRUEsSUFBSUEsRUFBRUEsT0FBT0EsRUFBRUEsV0FBV0EsRUFBRUEsTUFBTUEsRUFBRUEsT0FBT0EsQ0FBQ0E7d0JBQ3JEQSxBQUNBQSx5Q0FEeUNBO3dCQUN6Q0EsRUFBRUEsQ0FBQUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsS0FBS0EsS0FBS0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7NEJBQ2xCQSxHQUFHQSxHQUFHQSxJQUFJQSxDQUFDQSxLQUFLQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTs0QkFDakNBLEdBQUdBLEdBQUdBLEdBQUdBLENBQUNBLE1BQU1BLENBQUNBLENBQUNBLEVBQUVBLEdBQUdBLENBQUNBLE1BQU1BLEdBQUNBLENBQUNBLENBQUNBLENBQUNBOzRCQUNsQ0EsSUFBSUEsR0FBR0EsTUFBTUEsQ0FBQ0E7NEJBQ2RBLFdBQVdBLEdBQUdBLElBQUlBLENBQUNBOzRCQUNuQkEsTUFBTUEsR0FBR0EsS0FBS0EsQ0FBQ0E7d0JBQ2hCQSxDQUFDQTt3QkFBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0E7NEJBQ1BBLEdBQUdBLEdBQUdBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLElBQUlBLEVBQUVBLENBQUNBOzRCQUNsQkEsSUFBSUEsR0FBR0EsQ0FBQ0EsR0FBR0EsR0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsS0FBS0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7NEJBQ3ZDQSxPQUFPQSxHQUFHQSxHQUFHQSxDQUFDQSxDQUFDQSxDQUFDQSxLQUFLQSxHQUFHQSxDQUFDQTs0QkFDekJBLFdBQVdBLEdBQUdBLEdBQUdBLENBQUNBLEdBQUdBLENBQUNBLE1BQU1BLEdBQUNBLENBQUNBLENBQUNBLEtBQUtBLEdBQUdBLENBQUNBOzRCQUN4Q0EsTUFBTUEsR0FBR0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsS0FBS0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsTUFBTUEsQ0FBQ0EsQ0FBQ0E7NEJBRXBDQSxFQUFFQSxDQUFBQSxDQUFDQSxXQUFXQSxJQUFJQSxRQUFRQSxDQUFDQSxZQUFZQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtnQ0FDL0NBLFdBQVdBLEdBQUdBLEtBQUtBLENBQUNBO2dDQUNwQkEsR0FBR0EsR0FBR0EsR0FBR0EsQ0FBQ0EsTUFBTUEsQ0FBQ0EsQ0FBQ0EsRUFBRUEsR0FBR0EsQ0FBQ0EsTUFBTUEsR0FBQ0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsR0FBR0EsQ0FBQ0E7Z0NBRXhDQSxPQUFPQSxHQUFHQSxJQUFJQSxDQUFDQTs0QkFDaEJBLENBQUNBO3dCQUNGQSxDQUFDQTt3QkFFREEsSUFBSUEsR0FBR0EsSUFBSUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsTUFBTUEsR0FBR0EsQ0FBQ0EsSUFBSUEsS0FBS0EsTUFBTUEsR0FBR0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsQ0FBRUEsQ0FBQ0E7d0JBRTNEQSxFQUFFQSxDQUFBQSxDQUFDQSxPQUFPQSxDQUFDQSxDQUFDQSxDQUFDQTs0QkFDWkEsS0FBS0EsQ0FBQ0E7d0JBQ1BBLENBQUNBO3dCQUFDQSxJQUFJQSxDQUFDQSxDQUFDQTs0QkFDUEEsSUFBSUEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsRUFBQ0EsTUFBTUEsRUFBRUEsSUFBSUEsRUFBRUEsSUFBSUEsRUFBRUEsR0FBR0EsRUFBRUEsSUFBSUEsRUFBRUEsSUFBSUEsRUFBRUEsV0FBV0EsRUFBRUEsV0FBV0EsRUFBRUEsTUFBTUEsRUFBRUEsTUFBTUEsRUFBRUEsUUFBUUEsRUFBRUEsRUFBRUEsRUFBQ0EsQ0FBQ0EsQ0FBQ0E7NEJBRWxIQSxFQUFFQSxDQUFBQSxDQUFDQSxDQUFDQSxPQUFPQSxJQUFJQSxDQUFDQSxXQUFXQSxDQUFDQSxDQUFDQSxDQUFDQTtnQ0FDN0JBLElBQUlBLE1BQU1BLEdBQUdBLElBQUlBLENBQUNBLEtBQUtBLENBQUNBLElBQUlBLEVBQUVBLElBQUlBLENBQUNBLFFBQVFBLENBQUNBLElBQUlBLENBQUNBLFFBQVFBLENBQUNBLE1BQU1BLEdBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO2dDQUNyRUEsSUFBSUEsR0FBR0EsTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0E7Z0NBQ25CQSxJQUFJQSxDQUFDQSxRQUFRQSxDQUFDQSxHQUFHQSxFQUFFQSxDQUFDQTtnQ0FDcEJBLElBQUlBLENBQUNBLFFBQVFBLENBQUNBLElBQUlBLENBQUNBLE1BQU1BLENBQUNBLElBQUlBLENBQUNBLENBQUNBOzRCQUNqQ0EsQ0FBQ0E7d0JBQ0ZBLENBQUNBO3dCQUVEQSxDQUFDQSxHQUFHQSxJQUFJQSxDQUFDQSxLQUFLQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQTtvQkFDNUJBLENBQUNBO29CQUVEQSxNQUFNQSxDQUFDQSxFQUFDQSxJQUFJQSxFQUFFQSxJQUFJQSxFQUFFQSxJQUFJQSxFQUFFQSxJQUFJQSxFQUFDQSxDQUFDQTtnQkFDakNBLENBQUNBO2dCQUVPSCwrQkFBWUEsR0FBcEJBLFVBQXFCQSxJQUFJQSxFQUFFQSxNQUFNQTtvQkFDaENJLE1BQU1BLEdBQUdBLEVBQUVBLENBQUNBLE1BQU1BLENBQUNBLE1BQU1BLENBQUNBLENBQUNBO29CQUUzQkEsR0FBR0EsQ0FBQUEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsR0FBR0EsSUFBSUEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsTUFBTUEsRUFBRUEsQ0FBQ0EsRUFBRUEsRUFBRUEsQ0FBQ0E7d0JBQzlDQSxJQUFJQSxLQUFLQSxHQUFHQSxJQUFJQSxDQUFDQSxRQUFRQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTt3QkFDN0JBLEVBQUVBLENBQUFBLENBQUNBLEtBQUtBLENBQUNBLE1BQU1BLENBQUNBLENBQUNBLENBQUNBOzRCQUNqQkEsSUFBSUEsS0FBS0EsR0FBR0EseUNBQXlDQSxDQUFDQTs0QkFDdERBLElBQUlBLENBQUNBLEdBQUdBLEtBQUtBLENBQUNBLElBQUlBLENBQUNBLEtBQUtBLENBQUNBLEtBQUtBLENBQUNBLENBQUNBLEtBQUtBLENBQUNBLENBQUNBLENBQUNBLENBQUNBOzRCQUN6Q0EsSUFBSUEsSUFBSUEsR0FBR0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7NEJBQ2hCQSxJQUFJQSxTQUFTQSxDQUFDQTs0QkFDZEEsRUFBRUEsQ0FBQUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7Z0NBQzNCQSxJQUFJQSxLQUFLQSxHQUFHQSxJQUFJQSxDQUFDQSxLQUFLQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQTtnQ0FDNUJBLElBQUlBLEdBQUdBLEtBQUtBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLElBQUlBLEVBQUVBLENBQUNBO2dDQUN2QkEsU0FBU0EsR0FBR0EsS0FBS0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsSUFBSUEsRUFBRUEsQ0FBQ0E7NEJBQzdCQSxDQUFDQTs0QkFFREEsSUFBSUEsS0FBS0EsR0FBR0EsSUFBSUEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsTUFBTUEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7NEJBRXhDQSxJQUFJQSxNQUFNQSxHQUFHQSxFQUFFQSxDQUFDQTs0QkFDaEJBLEtBQUtBLENBQUNBLE9BQU9BLENBQUNBLFVBQVNBLEtBQUtBLEVBQUVBLEtBQUtBO2dDQUNsQyxJQUFJLE1BQU0sR0FBRyxFQUFFLENBQUM7Z0NBQ2hCLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxLQUFLLENBQUM7Z0NBQ3JCLE1BQU0sQ0FBQyxTQUFTLENBQUMsR0FBRyxLQUFLLENBQUM7Z0NBRTFC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WUFFRWI7Ozs7Y0FJRUE7WUFFRkE7Ozs7O2NBS0VBO1lBRUtBLHNCQUFZQSxHQUFuQkEsVUFBb0JBLE9BQXlCQTtnQkFDekNjLE9BQU1BLENBQUNBLE9BQU9BLENBQUNBLFNBQVNBO29CQUM3QkEsT0FBT0EsR0FBcUJBLE9BQU9BLENBQUNBLFVBQVVBLENBQUNBO2dCQUNoREEsTUFBTUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsU0FBU0EsQ0FBQ0E7WUFDdkJBLENBQUNBO1lBSU1kLGlCQUFPQSxHQUFkQSxVQUFlQSxLQUF1Q0E7Z0JBQ2xERyxFQUFFQSxDQUFBQSxDQUFDQSxLQUFLQSxZQUFZQSxTQUFTQSxDQUFDQTtvQkFDMUJBLE1BQU1BLENBQUNBLEtBQUtBLENBQUNBLFdBQVdBLENBQUNBLFFBQVFBLEVBQUVBLENBQUNBLEtBQUtBLENBQUNBLE1BQU1BLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO2dCQUN6REEsSUFBSUE7b0JBQ0FBLE1BQU1BLENBQUNBLEtBQUtBLENBQUNBLFFBQVFBLEVBQUVBLENBQUNBLEtBQUtBLENBQUNBLE1BQU1BLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO1lBQ2pEQSxDQUFDQTtZQUdMSCxnQkFBQ0E7UUFBREEsQ0EzTEE5RCxBQTJMQzhELElBQUE5RDtRQTNMWUEsc0JBQVNBLFlBMkxyQkEsQ0FBQUE7SUFDTEEsQ0FBQ0EsRUFqTlNELFVBQVVBLEdBQVZBLGFBQVVBLEtBQVZBLGFBQVVBLFFBaU5uQkE7QUFBREEsQ0FBQ0EsRUFqTk0sRUFBRSxLQUFGLEVBQUUsUUFpTlIiLCJmaWxlIjoiY29tcG9uZW50cy5qcyIsInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZSBoby5jb21wb25lbnRzLmNvbXBvbmVudHByb3ZpZGVyIHtcclxuICAgIGltcG9ydCBQcm9taXNlID0gaG8ucHJvbWlzZS5Qcm9taXNlO1xyXG5cclxuICAgIGV4cG9ydCBsZXQgbWFwcGluZzoge1tuYW1lOnN0cmluZ106c3RyaW5nfSA9IHt9O1xyXG5cclxuICAgIGV4cG9ydCBjbGFzcyBDb21wb25lbnRQcm92aWRlciB7XHJcblxyXG4gICAgICAgIHVzZU1pbjogYm9vbGVhbiA9IGZhbHNlO1xyXG5cclxuICAgICAgICByZXNvbHZlKG5hbWU6IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIG5hbWUgPSBuYW1lLnNwbGl0KCcuJykuam9pbignLycpO1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy51c2VNaW4gP1xyXG4gICAgICAgICAgICAgICAgYGNvbXBvbmVudHMvJHtuYW1lfS5taW4uanNgIDpcclxuICAgICAgICAgICAgICAgIGBjb21wb25lbnRzLyR7bmFtZX0uanNgO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZ2V0Q29tcG9uZW50KG5hbWU6IHN0cmluZyk6IFByb21pc2U8dHlwZW9mIENvbXBvbmVudCwgc3RyaW5nPiB7XHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgUHJvbWlzZTx0eXBlb2YgQ29tcG9uZW50LCBhbnk+KChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICAgICAgICAgIGxldCBzcmMgPSBtYXBwaW5nW25hbWVdIHx8IHRoaXMucmVzb2x2ZShuYW1lKTtcclxuICAgICAgICAgICAgICAgIGxldCBzY3JpcHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzY3JpcHQnKTtcclxuICAgICAgICAgICAgICAgIHNjcmlwdC5vbmxvYWQgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICAvL0NvbXBvbmVudC5yZWdpc3Rlcih3aW5kb3dbbmFtZV0pO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKHR5cGVvZiB0aGlzLmdldChuYW1lKSA9PT0gJ2Z1bmN0aW9uJylcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSh0aGlzLmdldChuYW1lKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZWplY3QoYEVycm9yIHdoaWxlIGxvYWRpbmcgQ29tcG9uZW50ICR7bmFtZX1gKVxyXG4gICAgICAgICAgICAgICAgfS5iaW5kKHRoaXMpO1xyXG4gICAgICAgICAgICAgICAgc2NyaXB0LnNyYyA9IHNyYztcclxuICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdoZWFkJylbMF0uYXBwZW5kQ2hpbGQoc2NyaXB0KTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSBnZXQobmFtZTogc3RyaW5nKTogdHlwZW9mIENvbXBvbmVudCB7XHJcbiAgICAgICAgICAgIGxldCBjOiBhbnkgPSB3aW5kb3c7XHJcbiAgICAgICAgICAgIG5hbWUuc3BsaXQoJy4nKS5mb3JFYWNoKChwYXJ0KSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjID0gY1twYXJ0XTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHJldHVybiA8dHlwZW9mIENvbXBvbmVudD5jO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGxldCBpbnN0YW5jZSA9IG5ldyBDb21wb25lbnRQcm92aWRlcigpO1xyXG5cclxufVxyXG4iLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vLi4vYm93ZXJfY29tcG9uZW50cy9oby13YXRjaC9kaXN0L2QudHMvd2F0Y2guZC50c1wiLz5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi8uLi9ib3dlcl9jb21wb25lbnRzL2hvLXByb21pc2UvZGlzdC9kLnRzL3Byb21pc2UuZC50c1wiLz5cblxubW9kdWxlIGhvLmNvbXBvbmVudHMge1xuXG5cdGltcG9ydCBQcm9taXNlID0gaG8ucHJvbWlzZS5Qcm9taXNlO1xuXG5cdC8qKlxuXHRcdEJhc2VjbGFzcyBmb3IgQXR0cmlidXRlcy5cblx0XHRVc2VkIEF0dHJpYnV0ZXMgbmVlZHMgdG8gYmUgc3BlY2lmaWVkIGJ5IENvbXBvbmVudCNhdHRyaWJ1dGVzIHByb3BlcnR5IHRvIGdldCBsb2FkZWQgcHJvcGVybHkuXG5cdCovXG5cdGV4cG9ydCBjbGFzcyBBdHRyaWJ1dGUge1xuXG5cdFx0cHJvdGVjdGVkIGVsZW1lbnQ6IEhUTUxFbGVtZW50O1xuXHRcdHByb3RlY3RlZCBjb21wb25lbnQ6IENvbXBvbmVudDtcblx0XHRwcm90ZWN0ZWQgdmFsdWU6IHN0cmluZztcblxuXHRcdGNvbnN0cnVjdG9yKGVsZW1lbnQ6IEhUTUxFbGVtZW50LCB2YWx1ZT86IHN0cmluZykge1xuXHRcdFx0dGhpcy5lbGVtZW50ID0gZWxlbWVudDtcblx0XHRcdHRoaXMuY29tcG9uZW50ID0gQ29tcG9uZW50LmdldENvbXBvbmVudChlbGVtZW50KTtcblx0XHRcdHRoaXMudmFsdWUgPSB2YWx1ZTtcblxuXHRcdFx0dGhpcy5pbml0KCk7XG5cdFx0fVxuXG5cdFx0cHJvdGVjdGVkIGluaXQoKTogdm9pZCB7fVxuXG5cdFx0Z2V0IG5hbWUoKSB7XG5cdFx0XHRyZXR1cm4gQXR0cmlidXRlLmdldE5hbWUodGhpcyk7XG5cdFx0fVxuXG5cblx0XHRwdWJsaWMgdXBkYXRlKCk6IHZvaWQge1xuXG5cdFx0fVxuXG5cblx0XHRzdGF0aWMgZ2V0TmFtZShjbGF6ejogdHlwZW9mIEF0dHJpYnV0ZSB8IEF0dHJpYnV0ZSk6IHN0cmluZyB7XG4gICAgICAgICAgICBpZihjbGF6eiBpbnN0YW5jZW9mIEF0dHJpYnV0ZSlcbiAgICAgICAgICAgICAgICByZXR1cm4gY2xhenouY29uc3RydWN0b3IudG9TdHJpbmcoKS5tYXRjaCgvXFx3Ky9nKVsxXTtcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICByZXR1cm4gY2xhenoudG9TdHJpbmcoKS5tYXRjaCgvXFx3Ky9nKVsxXTtcbiAgICAgICAgfVxuXHR9XG5cblx0ZXhwb3J0IGNsYXNzIFdhdGNoQXR0cmlidXRlIGV4dGVuZHMgQXR0cmlidXRlIHtcblxuXHRcdHByb3RlY3RlZCByOiBSZWdFeHAgPSAvIyguKz8pIy9nO1xuXG5cdFx0Y29uc3RydWN0b3IoZWxlbWVudDogSFRNTEVsZW1lbnQsIHZhbHVlPzogc3RyaW5nKSB7XG5cdFx0XHRzdXBlcihlbGVtZW50LCB2YWx1ZSk7XG5cblx0XHRcdGxldCBtOiBhbnlbXSA9IHRoaXMudmFsdWUubWF0Y2godGhpcy5yKSB8fCBbXTtcblx0XHRcdG0ubWFwKGZ1bmN0aW9uKHcpIHtcblx0XHRcdFx0dyA9IHcuc3Vic3RyKDEsIHcubGVuZ3RoLTIpO1xuXHRcdFx0XHR0aGlzLndhdGNoKHcpO1xuXHRcdFx0fS5iaW5kKHRoaXMpKTtcblx0XHRcdHRoaXMudmFsdWUgPSB0aGlzLnZhbHVlLnJlcGxhY2UoLyMvZywgJycpO1xuXHRcdH1cblxuXG5cdFx0cHJvdGVjdGVkIHdhdGNoKHBhdGg6IHN0cmluZyk6IHZvaWQge1xuXHRcdFx0bGV0IHBhdGhBcnIgPSBwYXRoLnNwbGl0KCcuJyk7XG5cdFx0XHRsZXQgcHJvcCA9IHBhdGhBcnIucG9wKCk7XG5cdFx0XHRsZXQgb2JqID0gdGhpcy5jb21wb25lbnQ7XG5cblx0XHRcdHBhdGhBcnIubWFwKChwYXJ0KSA9PiB7XG5cdFx0XHRcdG9iaiA9IG9ialtwYXJ0XTtcblx0XHRcdH0pO1xuXG5cdFx0XHRoby53YXRjaC53YXRjaChvYmosIHByb3AsIHRoaXMudXBkYXRlLmJpbmQodGhpcykpO1xuXHRcdH1cblxuXHRcdHByb3RlY3RlZCBldmFsKHBhdGg6IHN0cmluZyk6IGFueSB7XG5cdFx0XHRsZXQgbW9kZWwgPSB0aGlzLmNvbXBvbmVudDtcblx0XHRcdG1vZGVsID0gbmV3IEZ1bmN0aW9uKE9iamVjdC5rZXlzKG1vZGVsKS50b1N0cmluZygpLCBcInJldHVybiBcIiArIHBhdGgpXG5cdFx0XHRcdC5hcHBseShudWxsLCBPYmplY3Qua2V5cyhtb2RlbCkubWFwKChrKSA9PiB7cmV0dXJuIG1vZGVsW2tdfSkgKTtcblx0XHRcdHJldHVybiBtb2RlbDtcblx0XHR9XG5cblx0fVxufVxuIiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4vYXR0cmlidXRlLnRzXCIvPlxyXG5cclxubW9kdWxlIGhvLmNvbXBvbmVudHMuYXR0cmlidXRlcHJvdmlkZXIge1xyXG4gICAgaW1wb3J0IFByb21pc2UgPSBoby5wcm9taXNlLlByb21pc2U7XHJcblxyXG4gICAgZXhwb3J0IGNsYXNzIEF0dHJpYnV0ZVByb3ZpZGVyIHtcclxuXHJcbiAgICAgICAgdXNlTWluOiBib29sZWFuID0gZmFsc2U7XHJcblxyXG4gICAgICAgIHJlc29sdmUobmFtZTogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMudXNlTWluID9cclxuICAgICAgICAgICAgICAgIGBhdHRyaWJ1dGVzLyR7bmFtZX0ubWluLmpzYCA6XHJcbiAgICAgICAgICAgICAgICBgYXR0cmlidXRlcy8ke25hbWV9LmpzYDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGdldEF0dHJpYnV0ZShuYW1lOiBzdHJpbmcpOiBQcm9taXNlPHR5cGVvZiBBdHRyaWJ1dGUsIHN0cmluZz4ge1xyXG4gICAgICAgICAgICByZXR1cm4gbmV3IFByb21pc2U8dHlwZW9mIEF0dHJpYnV0ZSwgYW55PigocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgICAgICBsZXQgc3JjID0gdGhpcy5yZXNvbHZlKG5hbWUpO1xyXG4gICAgICAgICAgICAgICAgbGV0IHNjcmlwdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NjcmlwdCcpO1xyXG4gICAgICAgICAgICAgICAgc2NyaXB0Lm9ubG9hZCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vQ29tcG9uZW50LnJlZ2lzdGVyKHdpbmRvd1tuYW1lXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYodHlwZW9mIHdpbmRvd1tuYW1lXSA9PT0gJ2Z1bmN0aW9uJylcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSh3aW5kb3dbbmFtZV0pO1xyXG4gICAgICAgICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVqZWN0KGBFcnJvciB3aGlsZSBsb2FkaW5nIEF0dHJpYnV0ZSAke25hbWV9YClcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICBzY3JpcHQuc3JjID0gc3JjO1xyXG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2hlYWQnKVswXS5hcHBlbmRDaGlsZChzY3JpcHQpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgbGV0IGluc3RhbmNlID0gbmV3IEF0dHJpYnV0ZVByb3ZpZGVyKCk7XHJcblxyXG59XHJcbiIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuL2NvbXBvbmVudHNwcm92aWRlci50c1wiLz5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4vYXR0cmlidXRlcHJvdmlkZXIudHNcIi8+XHJcblxyXG5tb2R1bGUgaG8uY29tcG9uZW50cy5yZWdpc3RyeSB7XHJcbiAgICBpbXBvcnQgUHJvbWlzZSA9IGhvLnByb21pc2UuUHJvbWlzZTtcclxuXHJcbiAgICBleHBvcnQgY2xhc3MgUmVnaXN0cnkge1xyXG5cclxuICAgICAgICBwcml2YXRlIGNvbXBvbmVudHM6IEFycmF5PHR5cGVvZiBDb21wb25lbnQ+ID0gW107XHJcbiAgICAgICAgcHJpdmF0ZSBhdHRyaWJ1dGVzOiBBcnJheTx0eXBlb2YgQXR0cmlidXRlPiA9IFtdO1xyXG5cclxuXHJcbiAgICAgICAgcHVibGljIHJlZ2lzdGVyKGNhOiB0eXBlb2YgQ29tcG9uZW50IHwgdHlwZW9mIEF0dHJpYnV0ZSk6IHZvaWQge1xyXG4gICAgICAgICAgICBpZihjYS5wcm90b3R5cGUgaW5zdGFuY2VvZiBDb21wb25lbnQpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuY29tcG9uZW50cy5wdXNoKDx0eXBlb2YgQ29tcG9uZW50PmNhKTtcclxuICAgICAgICAgICAgICAgIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoQ29tcG9uZW50LmdldE5hbWUoPHR5cGVvZiBDb21wb25lbnQ+Y2EpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmKGNhLnByb3RvdHlwZSBpbnN0YW5jZW9mIEF0dHJpYnV0ZSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5hdHRyaWJ1dGVzLnB1c2goPHR5cGVvZiBBdHRyaWJ1dGU+Y2EpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgcnVuKCk6IFByb21pc2U8YW55LCBhbnk+IHtcclxuICAgICAgICAgICAgbGV0IGluaXRDb21wb25lbnQ6IChjOiB0eXBlb2YgQ29tcG9uZW50KT0+UHJvbWlzZTxhbnksIGFueT4gPSB0aGlzLmluaXRDb21wb25lbnQuYmluZCh0aGlzKTtcclxuICAgICAgICAgICAgbGV0IHByb21pc2VzOiBBcnJheTxQcm9taXNlPGFueSwgYW55Pj4gPSB0aGlzLmNvbXBvbmVudHMubWFwKChjKT0+e1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGluaXRDb21wb25lbnQoYyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIFByb21pc2UuYWxsKHByb21pc2VzKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBpbml0Q29tcG9uZW50KGNvbXBvbmVudDogdHlwZW9mIENvbXBvbmVudCwgZWxlbWVudDpIVE1MRWxlbWVudHxEb2N1bWVudD1kb2N1bWVudCk6IFByb21pc2U8YW55LCBhbnk+IHtcclxuICAgICAgICAgICAgbGV0IHByb21pc2VzOiBBcnJheTxQcm9taXNlPGFueSwgYW55Pj4gPSBBcnJheS5wcm90b3R5cGUubWFwLmNhbGwoXHJcbiAgICAgICAgICAgICAgICBlbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoQ29tcG9uZW50LmdldE5hbWUoY29tcG9uZW50KSksXHJcbiAgICAgICAgICAgICAgICBmdW5jdGlvbihlKTogUHJvbWlzZTxhbnksIGFueT4ge1xyXG5cdCAgICAgICAgICAgICAgICByZXR1cm4gbmV3IGNvbXBvbmVudChlKS5faW5pdCgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cdFx0XHQpO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIFByb21pc2UuYWxsKHByb21pc2VzKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBpbml0RWxlbWVudChlbGVtZW50OiBIVE1MRWxlbWVudCk6IHZvaWQge1xyXG4gICAgICAgICAgICB0aGlzLmNvbXBvbmVudHMuZm9yRWFjaCgoY29tcG9uZW50KSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmluaXRDb21wb25lbnQoY29tcG9uZW50LCBlbGVtZW50KTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgaGFzQ29tcG9uZW50KG5hbWU6IHN0cmluZyk6IGJvb2xlYW4ge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jb21wb25lbnRzXHJcbiAgICAgICAgICAgICAgICAuZmlsdGVyKChjb21wb25lbnQpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gQ29tcG9uZW50LmdldE5hbWUoY29tcG9uZW50KSA9PT0gbmFtZTtcclxuICAgICAgICAgICAgICAgIH0pLmxlbmd0aCA+IDA7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgaGFzQXR0cmlidXRlKG5hbWU6IHN0cmluZyk6IGJvb2xlYW4ge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5hdHRyaWJ1dGVzXHJcbiAgICAgICAgICAgICAgICAuZmlsdGVyKChhdHRyaWJ1dGUpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gQXR0cmlidXRlLmdldE5hbWUoYXR0cmlidXRlKSA9PT0gbmFtZTtcclxuICAgICAgICAgICAgICAgIH0pLmxlbmd0aCA+IDA7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgZ2V0QXR0cmlidXRlKG5hbWU6IHN0cmluZyk6IHR5cGVvZiBBdHRyaWJ1dGUge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5hdHRyaWJ1dGVzXHJcbiAgICAgICAgICAgIC5maWx0ZXIoKGF0dHJpYnV0ZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIEF0dHJpYnV0ZS5nZXROYW1lKGF0dHJpYnV0ZSkgPT09IG5hbWU7XHJcbiAgICAgICAgICAgIH0pWzBdO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIGxvYWRDb21wb25lbnQobmFtZTogc3RyaW5nKTogUHJvbWlzZTx0eXBlb2YgQ29tcG9uZW50LCBzdHJpbmc+IHtcclxuICAgICAgICAgICAgbGV0IHNlbGYgPSB0aGlzO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZ2V0UGFyZW50T2ZDb21wb25lbnQobmFtZSlcclxuICAgICAgICAgICAgLnRoZW4oKHBhcmVudCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYoc2VsZi5oYXNDb21wb25lbnQocGFyZW50KSB8fCBwYXJlbnQgPT09ICdoby5jb21wb25lbnRzLkNvbXBvbmVudCcpXHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgICAgICBlbHNlIHJldHVybiBzZWxmLmxvYWRDb21wb25lbnQocGFyZW50KTtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLnRoZW4oKHBhcmVudFR5cGUpID0+IHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBoby5jb21wb25lbnRzLmNvbXBvbmVudHByb3ZpZGVyLmluc3RhbmNlLmdldENvbXBvbmVudChuYW1lKVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAudGhlbigoY29tcG9uZW50KSA9PiB7XHJcbiAgICAgICAgICAgICAgICBzZWxmLnJlZ2lzdGVyKGNvbXBvbmVudCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gY29tcG9uZW50O1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgLy9yZXR1cm4gdGhpcy5vcHRpb25zLmNvbXBvbmVudFByb3ZpZGVyLmdldENvbXBvbmVudChuYW1lKVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJvdGVjdGVkIGdldFBhcmVudE9mQ29tcG9uZW50KG5hbWU6IHN0cmluZyk6IFByb21pc2U8c3RyaW5nLCBhbnk+IHtcclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuXHJcbiAgICAgICAgICAgICAgICBsZXQgeG1saHR0cCA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xyXG4gICAgICAgICAgICAgICAgeG1saHR0cC5vbnJlYWR5c3RhdGVjaGFuZ2UgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYoeG1saHR0cC5yZWFkeVN0YXRlID09IDQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHJlc3AgPSB4bWxodHRwLnJlc3BvbnNlVGV4dDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYoeG1saHR0cC5zdGF0dXMgPT0gMjAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgbSA9IHJlc3AubWF0Y2goL31cXClcXCgoLiopXFwpOy8pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYobSAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUobVsxXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKG51bGwpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVqZWN0KHJlc3ApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAgICAgeG1saHR0cC5vcGVuKCdHRVQnLCBoby5jb21wb25lbnRzLmNvbXBvbmVudHByb3ZpZGVyLmluc3RhbmNlLnJlc29sdmUobmFtZSkpO1xyXG4gICAgICAgICAgICAgICAgeG1saHR0cC5zZW5kKCk7XHJcblxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBsb2FkQXR0cmlidXRlKG5hbWU6IHN0cmluZyk6IFByb21pc2U8dHlwZW9mIEF0dHJpYnV0ZSwgc3RyaW5nPiB7XHJcbiAgICAgICAgICAgIGxldCBzZWxmID0gdGhpcztcclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlPHR5cGVvZiBBdHRyaWJ1dGUsIHN0cmluZz4oKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgaG8uY29tcG9uZW50cy5hdHRyaWJ1dGVwcm92aWRlci5pbnN0YW5jZS5nZXRBdHRyaWJ1dGUobmFtZSlcclxuICAgICAgICAgICAgICAgIC50aGVuKChhdHRyaWJ1dGUpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBzZWxmLnJlZ2lzdGVyKGF0dHJpYnV0ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShhdHRyaWJ1dGUpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGxldCBpbnN0YW5jZSA9IG5ldyBSZWdpc3RyeSgpO1xyXG59XHJcbiIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuL3JlZ2lzdHJ5LnRzXCIvPlxuXG5tb2R1bGUgaG8uY29tcG9uZW50cyB7XG5cdGV4cG9ydCBmdW5jdGlvbiBydW4oKTogaG8ucHJvbWlzZS5Qcm9taXNlPGFueSwgYW55PiB7XG5cdFx0cmV0dXJuIGhvLmNvbXBvbmVudHMucmVnaXN0cnkuaW5zdGFuY2UucnVuKCk7XG5cdH1cblxuXHRleHBvcnQgZnVuY3Rpb24gcmVnaXN0ZXIoYzogdHlwZW9mIENvbXBvbmVudCB8IHR5cGVvZiBBdHRyaWJ1dGUpOiB2b2lkIHtcblx0XHRoby5jb21wb25lbnRzLnJlZ2lzdHJ5Lmluc3RhbmNlLnJlZ2lzdGVyKGMpO1xuXHR9XG59XG4iLCJtb2R1bGUgaG8uY29tcG9uZW50cy5odG1scHJvdmlkZXIge1xyXG4gICAgaW1wb3J0IFByb21pc2UgPSBoby5wcm9taXNlLlByb21pc2U7XHJcblxyXG4gICAgZXhwb3J0IGNsYXNzIEh0bWxQcm92aWRlciB7XHJcblxyXG4gICAgICAgIHByaXZhdGUgY2FjaGU6IHtba2F5OnN0cmluZ106c3RyaW5nfSA9IHt9O1xyXG5cclxuICAgICAgICByZXNvbHZlKG5hbWU6IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIHJldHVybiBgY29tcG9uZW50cy8ke25hbWV9Lmh0bWxgO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZ2V0SFRNTChuYW1lOiBzdHJpbmcpOiBQcm9taXNlPHN0cmluZywgc3RyaW5nPiB7XHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYodHlwZW9mIHRoaXMuY2FjaGVbbmFtZV0gPT09ICdzdHJpbmcnKVxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiByZXNvbHZlKHRoaXMuY2FjaGVbbmFtZV0pO1xyXG5cclxuICAgICAgICAgICAgICAgIGxldCB1cmwgPSB0aGlzLnJlc29sdmUobmFtZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgbGV0IHhtbGh0dHAgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcclxuICAgIFx0XHRcdHhtbGh0dHAub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24oKSB7XHJcbiAgICBcdFx0XHRcdGlmKHhtbGh0dHAucmVhZHlTdGF0ZSA9PSA0KSB7XHJcbiAgICBcdFx0XHRcdFx0bGV0IHJlc3AgPSB4bWxodHRwLnJlc3BvbnNlVGV4dDtcclxuICAgIFx0XHRcdFx0XHRpZih4bWxodHRwLnN0YXR1cyA9PSAyMDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUocmVzcCk7XHJcbiAgICBcdFx0XHRcdFx0fSBlbHNlIHtcclxuICAgIFx0XHRcdFx0XHRcdHJlamVjdChgRXJyb3Igd2hpbGUgbG9hZGluZyBodG1sIGZvciBDb21wb25lbnQgJHtuYW1lfWApO1xyXG4gICAgXHRcdFx0XHRcdH1cclxuICAgIFx0XHRcdFx0fVxyXG4gICAgXHRcdFx0fTtcclxuXHJcbiAgICBcdFx0XHR4bWxodHRwLm9wZW4oJ0dFVCcsIHVybCwgdHJ1ZSk7XHJcbiAgICBcdFx0XHR4bWxodHRwLnNlbmQoKTtcclxuXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgbGV0IGluc3RhbmNlID0gbmV3IEh0bWxQcm92aWRlcigpO1xyXG5cclxufVxyXG4iLCJcbm1vZHVsZSBoby5jb21wb25lbnRzLnRlbXAge1xuXHRcdHZhciBjOiBudW1iZXIgPSAtMTtcblx0XHR2YXIgZGF0YTogYW55W10gPSBbXTtcblxuXHRcdGV4cG9ydCBmdW5jdGlvbiBzZXQoZDogYW55KTogbnVtYmVyIHtcblx0XHRcdGMrKztcblx0XHRcdGRhdGFbY10gPSBkO1xuXHRcdFx0cmV0dXJuIGM7XG5cdFx0fVxuXG5cdFx0ZXhwb3J0IGZ1bmN0aW9uIGdldChpOiBudW1iZXIpOiBhbnkge1xuXHRcdFx0cmV0dXJuIGRhdGFbaV07XG5cdFx0fVxuXG5cdFx0ZXhwb3J0IGZ1bmN0aW9uIGNhbGwoaTogbnVtYmVyLCAuLi5hcmdzKTogdm9pZCB7XG5cdFx0XHRkYXRhW2ldKC4uLmFyZ3MpO1xuXHRcdH1cbn1cbiIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuL3JlZ2lzdHJ5LnRzXCIvPlxyXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi90ZW1wXCIvPlxyXG5cclxubW9kdWxlIGhvLmNvbXBvbmVudHMucmVuZGVyZXIge1xyXG4gICAgaW1wb3J0IFJlZ2lzdHJ5ID0gaG8uY29tcG9uZW50cy5yZWdpc3RyeS5pbnN0YW5jZTtcclxuXHJcbiAgICBpbnRlcmZhY2UgTm9kZUh0bWwge1xyXG4gICAgICAgIHJvb3Q6IE5vZGU7XHJcbiAgICAgICAgaHRtbDogc3RyaW5nO1xyXG4gICAgfVxyXG5cclxuICAgIGNsYXNzIE5vZGUge1xyXG4gICAgICAgIGh0bWw6IHN0cmluZztcclxuICAgICAgICBwYXJlbnQ6IE5vZGU7XHJcbiAgICAgICAgY2hpbGRyZW46IEFycmF5PE5vZGU+ID0gW107XHJcbiAgICAgICAgdHlwZTogc3RyaW5nO1xyXG4gICAgICAgIHNlbGZDbG9zaW5nOiBib29sZWFuO1xyXG4gICAgICAgIHJlcGVhdDogYm9vbGVhbjtcclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgY2xhc3MgUmVuZGVyZXIge1xyXG5cclxuICAgICAgICBwcml2YXRlIHI6IGFueSA9IHtcclxuXHRcdFx0dGFnOiAvPChbXj5dKj8oPzooPzooJ3xcIilbXidcIl0qP1xcMilbXj5dKj8pKik+LyxcclxuXHRcdFx0cmVwZWF0OiAvcmVwZWF0PVtcInwnXS4rW1wifCddLyxcclxuXHRcdFx0dHlwZTogL1tcXHN8L10qKC4qPylbXFxzfFxcL3w+XS8sXHJcblx0XHRcdHRleHQ6IC8oPzoufFtcXHJcXG5dKSo/W15cIidcXFxcXTwvbSxcclxuXHRcdH07XHJcblxyXG4gICAgICAgIHByaXZhdGUgY2FjaGU6IHtba2V5OnN0cmluZ106Tm9kZX0gPSB7fTtcclxuXHJcbiAgICAgICAgcHVibGljIHJlbmRlcihjb21wb25lbnQ6IENvbXBvbmVudCk6IHZvaWQge1xyXG4gICAgICAgICAgICBpZih0eXBlb2YgY29tcG9uZW50Lmh0bWwgPT09ICdib29sZWFuJyAmJiAhY29tcG9uZW50Lmh0bWwpXHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICAgICAgICBsZXQgbmFtZSA9IGNvbXBvbmVudC5uYW1lO1xyXG4gICAgICAgICAgICBsZXQgcm9vdCA9IHRoaXMuY2FjaGVbbmFtZV0gPSB0aGlzLmNhY2hlW25hbWVdIHx8IHRoaXMucGFyc2UoY29tcG9uZW50Lmh0bWwpLnJvb3Q7XHJcbiAgICAgICAgICAgIHJvb3QgPSB0aGlzLnJlbmRlclJlcGVhdCh0aGlzLmNvcHlOb2RlKHJvb3QpLCBjb21wb25lbnQpO1xyXG5cclxuICAgICAgICAgICAgbGV0IGh0bWwgPSB0aGlzLmRvbVRvU3RyaW5nKHJvb3QsIC0xKTtcclxuXHJcbiAgICAgICAgICAgIGNvbXBvbmVudC5lbGVtZW50LmlubmVySFRNTCA9IGh0bWw7XHJcblxyXG4gICAgICAgIH1cclxuXHJcblxyXG5cdFx0cHJpdmF0ZSBwYXJzZShodG1sOiBzdHJpbmcsIHJvb3Q9IG5ldyBOb2RlKCkpOiBOb2RlSHRtbCB7XHJcblxyXG5cdFx0XHR2YXIgbTtcclxuXHRcdFx0d2hpbGUoKG0gPSB0aGlzLnIudGFnLmV4ZWMoaHRtbCkpICE9PSBudWxsKSB7XHJcblx0XHRcdFx0dmFyIHRhZywgdHlwZSwgY2xvc2luZywgc2VsZkNsb3NpbmcsIHJlcGVhdCwgdW5DbG9zZTtcclxuXHRcdFx0XHQvLy0tLS0tLS0gZm91bmQgc29tZSB0ZXh0IGJlZm9yZSBuZXh0IHRhZ1xyXG5cdFx0XHRcdGlmKG0uaW5kZXggIT09IDApIHtcclxuXHRcdFx0XHRcdHRhZyA9IGh0bWwubWF0Y2godGhpcy5yLnRleHQpWzBdO1xyXG5cdFx0XHRcdFx0dGFnID0gdGFnLnN1YnN0cigwLCB0YWcubGVuZ3RoLTEpO1xyXG5cdFx0XHRcdFx0dHlwZSA9ICdURVhUJztcclxuXHRcdFx0XHRcdHNlbGZDbG9zaW5nID0gdHJ1ZTtcclxuXHRcdFx0XHRcdHJlcGVhdCA9IGZhbHNlO1xyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHR0YWcgPSBtWzFdLnRyaW0oKTtcclxuXHRcdFx0XHRcdHR5cGUgPSAodGFnKyc+JykubWF0Y2godGhpcy5yLnR5cGUpWzFdO1xyXG5cdFx0XHRcdFx0Y2xvc2luZyA9IHRhZ1swXSA9PT0gJy8nO1xyXG5cdFx0XHRcdFx0c2VsZkNsb3NpbmcgPSB0YWdbdGFnLmxlbmd0aC0xXSA9PT0gJy8nO1xyXG5cdFx0XHRcdFx0cmVwZWF0ID0gISF0YWcubWF0Y2godGhpcy5yLnJlcGVhdCk7XHJcblxyXG5cdFx0XHRcdFx0aWYoc2VsZkNsb3NpbmcgJiYgUmVnaXN0cnkuaGFzQ29tcG9uZW50KHR5cGUpKSB7XHJcblx0XHRcdFx0XHRcdHNlbGZDbG9zaW5nID0gZmFsc2U7XHJcblx0XHRcdFx0XHRcdHRhZyA9IHRhZy5zdWJzdHIoMCwgdGFnLmxlbmd0aC0xKSArIFwiIFwiO1xyXG5cclxuXHRcdFx0XHRcdFx0dW5DbG9zZSA9IHRydWU7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRodG1sID0gaHRtbC5zbGljZSh0YWcubGVuZ3RoICsgKHR5cGUgPT09ICdURVhUJyA/IDAgOiAyKSApO1xyXG5cclxuXHRcdFx0XHRpZihjbG9zaW5nKSB7XHJcblx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0cm9vdC5jaGlsZHJlbi5wdXNoKHtwYXJlbnQ6IHJvb3QsIGh0bWw6IHRhZywgdHlwZTogdHlwZSwgc2VsZkNsb3Npbmc6IHNlbGZDbG9zaW5nLCByZXBlYXQ6IHJlcGVhdCwgY2hpbGRyZW46IFtdfSk7XHJcblxyXG5cdFx0XHRcdFx0aWYoIXVuQ2xvc2UgJiYgIXNlbGZDbG9zaW5nKSB7XHJcblx0XHRcdFx0XHRcdHZhciByZXN1bHQgPSB0aGlzLnBhcnNlKGh0bWwsIHJvb3QuY2hpbGRyZW5bcm9vdC5jaGlsZHJlbi5sZW5ndGgtMV0pO1xyXG5cdFx0XHRcdFx0XHRodG1sID0gcmVzdWx0Lmh0bWw7XHJcblx0XHRcdFx0XHRcdHJvb3QuY2hpbGRyZW4ucG9wKCk7XHJcblx0XHRcdFx0XHRcdHJvb3QuY2hpbGRyZW4ucHVzaChyZXN1bHQucm9vdCk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRtID0gaHRtbC5tYXRjaCh0aGlzLnIudGFnKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0cmV0dXJuIHtyb290OiByb290LCBodG1sOiBodG1sfTtcclxuXHRcdH1cclxuXHJcblx0XHRwcml2YXRlIHJlbmRlclJlcGVhdChyb290LCBtb2RlbHMpOiBOb2RlIHtcclxuXHRcdFx0bW9kZWxzID0gW10uY29uY2F0KG1vZGVscyk7XHJcblxyXG5cdFx0XHRmb3IodmFyIGMgPSAwOyBjIDwgcm9vdC5jaGlsZHJlbi5sZW5ndGg7IGMrKykge1xyXG5cdFx0XHRcdHZhciBjaGlsZCA9IHJvb3QuY2hpbGRyZW5bY107XHJcblx0XHRcdFx0aWYoY2hpbGQucmVwZWF0KSB7XHJcblx0XHRcdFx0XHR2YXIgcmVnZXggPSAvcmVwZWF0PVtcInwnXVxccyooXFxTKylcXHMrYXNcXHMrKFxcUys/KVtcInwnXS87XHJcblx0XHRcdFx0XHR2YXIgbSA9IGNoaWxkLmh0bWwubWF0Y2gocmVnZXgpLnNsaWNlKDEpO1xyXG5cdFx0XHRcdFx0dmFyIG5hbWUgPSBtWzFdO1xyXG5cdFx0XHRcdFx0dmFyIGluZGV4TmFtZTtcclxuXHRcdFx0XHRcdGlmKG5hbWUuaW5kZXhPZignLCcpID4gLTEpIHtcclxuXHRcdFx0XHRcdFx0dmFyIG5hbWVzID0gbmFtZS5zcGxpdCgnLCcpO1xyXG5cdFx0XHRcdFx0XHRuYW1lID0gbmFtZXNbMF0udHJpbSgpO1xyXG5cdFx0XHRcdFx0XHRpbmRleE5hbWUgPSBuYW1lc1sxXS50cmltKCk7XHJcblx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0dmFyIG1vZGVsID0gdGhpcy5ldmFsdWF0ZShtb2RlbHMsIG1bMF0pO1xyXG5cclxuXHRcdFx0XHRcdHZhciBob2xkZXIgPSBbXTtcclxuXHRcdFx0XHRcdG1vZGVsLmZvckVhY2goZnVuY3Rpb24odmFsdWUsIGluZGV4KSB7XHJcblx0XHRcdFx0XHRcdHZhciBtb2RlbDIgPSB7fTtcclxuXHRcdFx0XHRcdFx0bW9kZWwyW25hbWVdID0gdmFsdWU7XHJcblx0XHRcdFx0XHRcdG1vZGVsMltpbmRleE5hbWVdID0gaW5kZXg7XHJcblxyXG5cdFx0XHRcdFx0XHR2YXIgbW9kZWxzMiA9IFtdLmNvbmNhdChtb2RlbHMpO1xyXG5cdFx0XHRcdFx0XHRtb2RlbHMyLnVuc2hpZnQobW9kZWwyKTtcclxuXHJcblx0XHRcdFx0XHRcdHZhciBub2RlID0gdGhpcy5jb3B5Tm9kZShjaGlsZCk7XHJcblx0XHRcdFx0XHRcdG5vZGUucmVwZWF0ID0gZmFsc2U7XHJcblx0XHRcdFx0XHRcdG5vZGUuaHRtbCA9IG5vZGUuaHRtbC5yZXBsYWNlKHRoaXMuci5yZXBlYXQsICcnKTtcclxuXHRcdFx0XHRcdFx0bm9kZS5odG1sID0gdGhpcy5yZXBsKG5vZGUuaHRtbCwgbW9kZWxzMik7XHJcblxyXG5cdFx0XHRcdFx0XHRub2RlID0gdGhpcy5yZW5kZXJSZXBlYXQobm9kZSwgbW9kZWxzMik7XHJcblxyXG5cdFx0XHRcdFx0XHQvL3Jvb3QuY2hpbGRyZW4uc3BsaWNlKHJvb3QuY2hpbGRyZW4uaW5kZXhPZihjaGlsZCksIDAsIG5vZGUpO1xyXG5cdFx0XHRcdFx0XHRob2xkZXIucHVzaChub2RlKTtcclxuXHRcdFx0XHRcdH0uYmluZCh0aGlzKSk7XHJcblxyXG5cdFx0XHRcdFx0aG9sZGVyLmZvckVhY2goZnVuY3Rpb24obikge1xyXG5cdFx0XHRcdFx0XHRyb290LmNoaWxkcmVuLnNwbGljZShyb290LmNoaWxkcmVuLmluZGV4T2YoY2hpbGQpLCAwLCBuKTtcclxuXHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0cm9vdC5jaGlsZHJlbi5zcGxpY2Uocm9vdC5jaGlsZHJlbi5pbmRleE9mKGNoaWxkKSwgMSk7XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdGNoaWxkLmh0bWwgPSB0aGlzLnJlcGwoY2hpbGQuaHRtbCwgbW9kZWxzKTtcclxuXHRcdFx0XHRcdGNoaWxkID0gdGhpcy5yZW5kZXJSZXBlYXQoY2hpbGQsIG1vZGVscyk7XHJcblx0XHRcdFx0XHRyb290LmNoaWxkcmVuW2NdID0gY2hpbGQ7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRyZXR1cm4gcm9vdDtcclxuXHRcdH1cclxuXHJcblx0XHRwcml2YXRlIGRvbVRvU3RyaW5nKHJvb3QsIGluZGVudCk6IHN0cmluZyB7XHJcblx0XHRcdGluZGVudCA9IGluZGVudCB8fCAwO1xyXG5cdFx0XHR2YXIgaHRtbCA9ICcnO1xyXG4gICAgICAgICAgICBjb25zdCB0YWI6IGFueSA9ICdcXHQnO1xyXG5cclxuXHRcdFx0aWYocm9vdC5odG1sKSB7XHJcblx0XHRcdFx0aHRtbCArPSBuZXcgQXJyYXkoaW5kZW50KS5qb2luKHRhYik7IC8vdGFiLnJlcGVhdChpbmRlbnQpOztcclxuXHRcdFx0XHRpZihyb290LnR5cGUgIT09ICdURVhUJylcclxuXHRcdFx0XHRcdGh0bWwgKz0gJzwnICsgcm9vdC5odG1sICsgJz4nO1xyXG5cdFx0XHRcdGVsc2UgaHRtbCArPSByb290Lmh0bWw7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGlmKGh0bWwpXHJcblx0XHRcdFx0aHRtbCArPSAnXFxuJztcclxuXHJcblx0XHRcdGlmKHJvb3QuY2hpbGRyZW4ubGVuZ3RoKSB7XHJcblx0XHRcdFx0aHRtbCArPSByb290LmNoaWxkcmVuLm1hcChmdW5jdGlvbihjKSB7XHJcblx0XHRcdFx0XHRyZXR1cm4gdGhpcy5kb21Ub1N0cmluZyhjLCBpbmRlbnQrKHJvb3QudHlwZSA/IDEgOiAyKSk7XHJcblx0XHRcdFx0fS5iaW5kKHRoaXMpKS5qb2luKCdcXG4nKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0aWYocm9vdC50eXBlICYmIHJvb3QudHlwZSAhPT0gJ1RFWFQnICYmICFyb290LnNlbGZDbG9zaW5nKSB7XHJcblx0XHRcdFx0aHRtbCArPSBuZXcgQXJyYXkoaW5kZW50KS5qb2luKHRhYik7IC8vdGFiLnJlcGVhdChpbmRlbnQpO1xyXG5cdFx0XHRcdGh0bWwgKz0gJzwvJytyb290LnR5cGUrJz5cXG4nO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRyZXR1cm4gaHRtbDtcclxuXHRcdH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSByZXBsKHN0cjogc3RyaW5nLCBtb2RlbHM6IGFueVtdKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgdmFyIHJlZ2V4RyA9IC97KC4rPyl9fT8vZztcclxuXHJcbiAgICAgICAgICAgIHZhciBtID0gc3RyLm1hdGNoKHJlZ2V4Ryk7XHJcbiAgICAgICAgICAgIGlmKCFtKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHN0cjtcclxuXHJcbiAgICAgICAgICAgIHdoaWxlKG0ubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgcGF0aCA9IG1bMF07XHJcbiAgICAgICAgICAgICAgICBwYXRoID0gcGF0aC5zdWJzdHIoMSwgcGF0aC5sZW5ndGgtMik7XHJcblxyXG4gICAgICAgICAgICAgICAgdmFyIHZhbHVlID0gdGhpcy5ldmFsdWF0ZShtb2RlbHMsIHBhdGgpO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmKHZhbHVlICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZih0eXBlb2YgdmFsdWUgPT09ICdmdW5jdGlvbicpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSBcImhvLmNvbXBvbmVudHMuQ29tcG9uZW50LmdldENvbXBvbmVudCh0aGlzKS5cIitwYXRoO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBzdHIgPSBzdHIucmVwbGFjZShtWzBdLCB2YWx1ZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgbSA9IG0uc2xpY2UoMSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiBzdHI7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIGV2YWx1YXRlKG1vZGVsczogYW55W10sIHBhdGg6IHN0cmluZyk6IGFueSB7XHJcbiAgICAgICAgICAgIGlmKHBhdGhbMF0gPT09ICd7JyAmJiBwYXRoWy0tcGF0aC5sZW5ndGhdID09PSAnfScpXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5ldmFsdWF0ZUV4cHJlc3Npb24obW9kZWxzLCBwYXRoLnN1YnN0cigxLCBwYXRoLmxlbmd0aC0yKSlcclxuICAgICAgICAgICAgZWxzZSBpZihwYXRoWzBdID09PSAnIycpXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5ldmFsdWF0ZUZ1bmN0aW9uKG1vZGVscywgcGF0aC5zdWJzdHIoMSkpO1xyXG4gICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5ldmFsdWF0ZVZhbHVlKG1vZGVscywgcGF0aCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIGV2YWx1YXRlVmFsdWUobW9kZWxzOiBhbnlbXSwgcGF0aDogc3RyaW5nKTogYW55IHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZXZhbHVhdGVWYWx1ZUFuZE1vZGVsKG1vZGVscywgcGF0aCkudmFsdWU7XHJcbiAgICAgICAgfVxyXG5cclxuXHRcdHByaXZhdGUgZXZhbHVhdGVWYWx1ZUFuZE1vZGVsKG1vZGVsczogYW55W10sIHBhdGg6IHN0cmluZyk6IHt2YWx1ZTogYW55LCBtb2RlbDogYW55fSB7XHJcblx0XHRcdGlmKG1vZGVscy5pbmRleE9mKHdpbmRvdykgPT0gLTEpXHJcbiAgICAgICAgICAgICAgICBtb2RlbHMucHVzaCh3aW5kb3cpO1xyXG5cclxuICAgICAgICAgICAgdmFyIG1pID0gMDtcclxuXHRcdFx0dmFyIG1vZGVsID0gdm9pZCAwO1xyXG5cdFx0XHR3aGlsZShtaSA8IG1vZGVscy5sZW5ndGggJiYgbW9kZWwgPT09IHVuZGVmaW5lZCkge1xyXG5cdFx0XHRcdG1vZGVsID0gbW9kZWxzW21pXTtcclxuXHRcdFx0XHR0cnkge1xyXG5cdFx0XHRcdFx0bW9kZWwgPSBuZXcgRnVuY3Rpb24oXCJtb2RlbFwiLCBcInJldHVybiBtb2RlbFsnXCIgKyBwYXRoLnNwbGl0KFwiLlwiKS5qb2luKFwiJ11bJ1wiKSArIFwiJ11cIikobW9kZWwpO1xyXG5cdFx0XHRcdH0gY2F0Y2goZSkge1xyXG5cdFx0XHRcdFx0bW9kZWwgPSB2b2lkIDA7XHJcblx0XHRcdFx0fSBmaW5hbGx5IHtcclxuICAgICAgICAgICAgICAgICAgICBtaSsrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRyZXR1cm4ge1widmFsdWVcIjogbW9kZWwsIFwibW9kZWxcIjogbW9kZWxzWy0tbWldfTtcclxuXHRcdH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSBldmFsdWF0ZUV4cHJlc3Npb24obW9kZWxzOiBhbnlbXSwgcGF0aDogc3RyaW5nKTogYW55IHtcclxuXHRcdFx0aWYobW9kZWxzLmluZGV4T2Yod2luZG93KSA9PSAtMSlcclxuICAgICAgICAgICAgICAgIG1vZGVscy5wdXNoKHdpbmRvdyk7XHJcblxyXG4gICAgICAgICAgICB2YXIgbWkgPSAwO1xyXG5cdFx0XHR2YXIgbW9kZWwgPSB2b2lkIDA7XHJcblx0XHRcdHdoaWxlKG1pIDwgbW9kZWxzLmxlbmd0aCAmJiBtb2RlbCA9PT0gdW5kZWZpbmVkKSB7XHJcblx0XHRcdFx0bW9kZWwgPSBtb2RlbHNbbWldO1xyXG5cdFx0XHRcdHRyeSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy93aXRoKG1vZGVsKSBtb2RlbCA9IGV2YWwocGF0aCk7XHJcbiAgICAgICAgICAgICAgICAgICAgbW9kZWwgPSBuZXcgRnVuY3Rpb24oT2JqZWN0LmtleXMobW9kZWwpLnRvU3RyaW5nKCksIFwicmV0dXJuIFwiICsgcGF0aClcclxuICAgICAgICAgICAgICAgICAgICAgICAgLmFwcGx5KG51bGwsIE9iamVjdC5rZXlzKG1vZGVsKS5tYXAoKGspID0+IHtyZXR1cm4gbW9kZWxba119KSApO1xyXG5cdFx0XHRcdH0gY2F0Y2goZSkge1xyXG5cdFx0XHRcdFx0bW9kZWwgPSB2b2lkIDA7XHJcblx0XHRcdFx0fSBmaW5hbGx5IHtcclxuICAgICAgICAgICAgICAgICAgICBtaSsrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRyZXR1cm4gbW9kZWw7XHJcblx0XHR9XHJcblxyXG4gICAgICAgIHByaXZhdGUgZXZhbHVhdGVGdW5jdGlvbihtb2RlbHM6IGFueVtdLCBwYXRoOiBzdHJpbmcpOiBhbnkge1xyXG4gICAgICAgICAgICBsZXQgZXhwID0gdGhpcy5ldmFsdWF0ZUV4cHJlc3Npb24uYmluZCh0aGlzLCBtb2RlbHMpO1xyXG5cdFx0XHR2YXIgW25hbWUsIGFyZ3NdID0gcGF0aC5zcGxpdCgnKCcpO1xyXG4gICAgICAgICAgICBhcmdzID0gYXJncy5zdWJzdHIoMCwgLS1hcmdzLmxlbmd0aCk7XHJcblxyXG4gICAgICAgICAgICBsZXQge3ZhbHVlLCBtb2RlbH0gPSB0aGlzLmV2YWx1YXRlVmFsdWVBbmRNb2RlbChtb2RlbHMsIG5hbWUpO1xyXG4gICAgICAgICAgICBsZXQgZnVuYzogRnVuY3Rpb24gPSB2YWx1ZTtcclxuICAgICAgICAgICAgbGV0IGFyZ0Fycjogc3RyaW5nW10gPSBhcmdzLnNwbGl0KCcuJykubWFwKChhcmcpID0+IHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBhcmcuaW5kZXhPZignIycpID09PSAwID9cclxuICAgICAgICAgICAgICAgICAgICBhcmcuc3Vic3RyKDEpIDpcclxuICAgICAgICAgICAgICAgICAgICBleHAoYXJnKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBmdW5jID0gZnVuYy5iaW5kKG1vZGVsLCAuLi5hcmdBcnIpO1xyXG5cclxuICAgICAgICAgICAgbGV0IGluZGV4ID0gaG8uY29tcG9uZW50cy50ZW1wLnNldChmdW5jKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBzdHIgPSBgaG8uY29tcG9uZW50cy50ZW1wLmNhbGwoJHtpbmRleH0pYDtcclxuICAgICAgICAgICAgcmV0dXJuIHN0cjtcclxuXHRcdH1cclxuXHJcblx0XHRwcml2YXRlIGNvcHlOb2RlKG5vZGU6IE5vZGUpOiBOb2RlIHtcclxuXHRcdFx0dmFyIGNvcHlOb2RlID0gdGhpcy5jb3B5Tm9kZS5iaW5kKHRoaXMpO1xyXG5cclxuICAgICAgICAgICAgdmFyIG4gPSA8Tm9kZT57XHJcblx0XHRcdFx0cGFyZW50OiBub2RlLnBhcmVudCxcclxuXHRcdFx0XHRodG1sOiBub2RlLmh0bWwsXHJcblx0XHRcdFx0dHlwZTogbm9kZS50eXBlLFxyXG5cdFx0XHRcdHNlbGZDbG9zaW5nOiBub2RlLnNlbGZDbG9zaW5nLFxyXG5cdFx0XHRcdHJlcGVhdDogbm9kZS5yZXBlYXQsXHJcblx0XHRcdFx0Y2hpbGRyZW46IG5vZGUuY2hpbGRyZW4ubWFwKGNvcHlOb2RlKVxyXG5cdFx0XHR9O1xyXG5cclxuXHRcdFx0cmV0dXJuIG47XHJcblx0XHR9XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBsZXQgaW5zdGFuY2UgPSBuZXcgUmVuZGVyZXIoKTtcclxuXHJcbn1cclxuIiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4vbWFpblwiLz5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4vcmVnaXN0cnlcIi8+XHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuL2h0bWxwcm92aWRlci50c1wiLz5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4vcmVuZGVyZXIudHNcIi8+XHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuL2F0dHJpYnV0ZS50c1wiLz5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uLy4uL2Jvd2VyX2NvbXBvbmVudHMvaG8tcHJvbWlzZS9kaXN0L3Byb21pc2UuZC50c1wiLz5cclxuXHJcbm1vZHVsZSBoby5jb21wb25lbnRzIHtcclxuXHJcbiAgICBpbXBvcnQgUmVnaXN0cnkgPSBoby5jb21wb25lbnRzLnJlZ2lzdHJ5Lmluc3RhbmNlO1xyXG4gICAgaW1wb3J0IEh0bWxQcm92aWRlciA9IGhvLmNvbXBvbmVudHMuaHRtbHByb3ZpZGVyLmluc3RhbmNlO1xyXG4gICAgaW1wb3J0IFJlbmRlcmVyID0gaG8uY29tcG9uZW50cy5yZW5kZXJlci5pbnN0YW5jZTtcclxuICAgIGltcG9ydCBQcm9taXNlID0gaG8ucHJvbWlzZS5Qcm9taXNlO1xyXG5cclxuICAgIGV4cG9ydCBpbnRlcmZhY2UgQ29tcG9uZW50RWxlbWVudCBleHRlbmRzIEhUTUxFbGVtZW50IHtcclxuICAgICAgICBjb21wb25lbnQ/OiBDb21wb25lbnQ7XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGludGVyZmFjZSBJUHJvcHJldHkge1xyXG4gICAgICAgIG5hbWU6IHN0cmluZztcclxuICAgICAgICByZXF1aXJlZD86IGJvb2xlYW47XHJcbiAgICAgICAgZGVmYXVsdD86IGFueTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAgICBCYXNlY2xhc3MgZm9yIENvbXBvbmVudHNcclxuICAgICAgICBpbXBvcnRhbnQ6IGRvIGluaXRpYWxpemF0aW9uIHdvcmsgaW4gQ29tcG9uZW50I2luaXRcclxuICAgICovXHJcbiAgICBleHBvcnQgY2xhc3MgQ29tcG9uZW50IHtcclxuICAgICAgICBlbGVtZW50OiBDb21wb25lbnRFbGVtZW50O1xyXG4gICAgICAgIG9yaWdpbmFsX2lubmVySFRNTDogc3RyaW5nO1xyXG4gICAgICAgIGh0bWw6IHN0cmluZztcclxuICAgICAgICBwcm9wZXJ0aWVzOiBBcnJheTxzdHJpbmd8SVByb3ByZXR5PiA9IFtdO1xyXG4gICAgICAgIGF0dHJpYnV0ZXM6IEFycmF5PHN0cmluZz4gPSBbXTtcclxuICAgICAgICByZXF1aXJlczogQXJyYXk8c3RyaW5nPiA9IFtdO1xyXG4gICAgICAgIGNoaWxkcmVuOiB7W2tleTogc3RyaW5nXTogYW55fSA9IHt9O1xyXG5cclxuICAgICAgICBjb25zdHJ1Y3RvcihlbGVtZW50OiBIVE1MRWxlbWVudCkge1xyXG4gICAgICAgICAgICAvLy0tLS0tLS0gaW5pdCBFbGVtZW5ldCBhbmQgRWxlbWVudHMnIG9yaWdpbmFsIGlubmVySFRNTFxyXG4gICAgICAgICAgICB0aGlzLmVsZW1lbnQgPSBlbGVtZW50O1xyXG4gICAgICAgICAgICB0aGlzLmVsZW1lbnQuY29tcG9uZW50ID0gdGhpcztcclxuICAgICAgICAgICAgdGhpcy5vcmlnaW5hbF9pbm5lckhUTUwgPSBlbGVtZW50LmlubmVySFRNTDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBnZXQgbmFtZSgpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICByZXR1cm4gQ29tcG9uZW50LmdldE5hbWUodGhpcyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgZ2V0TmFtZSgpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5uYW1lO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIGdldFBhcmVudCgpOiBDb21wb25lbnQge1xyXG4gICAgICAgICAgICByZXR1cm4gQ29tcG9uZW50LmdldENvbXBvbmVudCg8Q29tcG9uZW50RWxlbWVudD50aGlzLmVsZW1lbnQucGFyZW50Tm9kZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgX2luaXQoKTogUHJvbWlzZTxhbnksIGFueT4ge1xyXG4gICAgICAgICAgICBsZXQgcmVuZGVyID0gdGhpcy5yZW5kZXIuYmluZCh0aGlzKTtcclxuICAgICAgICAgICAgLy8tLS0tLS0tLSBpbml0IFByb3BlcnRpZXNcclxuICAgICAgICAgICAgdGhpcy5pbml0UHJvcGVydGllcygpO1xyXG5cclxuICAgICAgICAgICAgLy8tLS0tLS0tIGNhbGwgaW5pdCgpICYgbG9hZFJlcXVpcmVtZW50cygpIC0+IHRoZW4gcmVuZGVyXHJcbiAgICAgICAgICAgIGxldCByZWFkeSA9IFt0aGlzLmluaXRIVE1MKCksIFByb21pc2UuY3JlYXRlKHRoaXMuaW5pdCgpKSwgdGhpcy5sb2FkUmVxdWlyZW1lbnRzKCldO1xyXG5cclxuICAgICAgICAgICAgbGV0IHAgPSBuZXcgUHJvbWlzZTxhbnksIGFueT4oKTtcclxuXHJcbiAgICAgICAgICAgIFByb21pc2UuYWxsKHJlYWR5KVxyXG4gICAgICAgICAgICAudGhlbigoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBwLnJlc29sdmUoKTtcclxuICAgICAgICAgICAgICAgIHJlbmRlcigpO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAuY2F0Y2goKGVycikgPT4ge1xyXG4gICAgICAgICAgICAgICAgcC5yZWplY3QoZXJyKTtcclxuICAgICAgICAgICAgICAgIHRocm93IGVycjtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gcDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAgICBNZXRob2QgdGhhdCBnZXQgY2FsbGVkIGFmdGVyIGluaXRpYWxpemF0aW9uIG9mIGEgbmV3IGluc3RhbmNlLlxyXG4gICAgICAgICAgICBEbyBpbml0LXdvcmsgaGVyZS5cclxuICAgICAgICAgICAgTWF5IHJldHVybiBhIFByb21pc2UuXHJcbiAgICAgICAgKi9cclxuICAgICAgICBwdWJsaWMgaW5pdCgpOiBhbnkge31cclxuXHJcbiAgICAgICAgcHVibGljIHVwZGF0ZSgpOiB2b2lkIHtyZXR1cm4gdm9pZCAwO31cclxuXHJcbiAgICAgICAgcHVibGljIHJlbmRlcigpOiB2b2lkIHtcclxuICAgIFx0XHRSZW5kZXJlci5yZW5kZXIodGhpcyk7XHJcblxyXG4gICAgXHRcdFJlZ2lzdHJ5LmluaXRFbGVtZW50KHRoaXMuZWxlbWVudCk7XHJcblxyXG4gICAgXHRcdHRoaXMuaW5pdENoaWxkcmVuKCk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLmluaXRBdHRyaWJ1dGVzKCk7XHJcblxyXG5cdFx0XHR0aGlzLnVwZGF0ZSgpO1xyXG4gICAgXHR9O1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAqICBBc3N1cmUgdGhhdCB0aGlzIGluc3RhbmNlIGhhcyBhbiB2YWxpZCBodG1sIGF0dHJpYnV0ZSBhbmQgaWYgbm90IGxvYWQgYW5kIHNldCBpdC5cclxuICAgICAgICAqL1xyXG4gICAgICAgIHByaXZhdGUgaW5pdEhUTUwoKTogUHJvbWlzZTxhbnksYW55PiB7XHJcbiAgICAgICAgICAgIGxldCBwID0gbmV3IFByb21pc2UoKTtcclxuICAgICAgICAgICAgbGV0IHNlbGYgPSB0aGlzO1xyXG5cclxuICAgICAgICAgICAgaWYodHlwZW9mIHRoaXMuaHRtbCA9PT0gJ2Jvb2xlYW4nKVxyXG4gICAgICAgICAgICAgICAgcC5yZXNvbHZlKCk7XHJcbiAgICAgICAgICAgIGlmKHR5cGVvZiB0aGlzLmh0bWwgPT09ICdzdHJpbmcnKVxyXG4gICAgICAgICAgICAgICAgcC5yZXNvbHZlKCk7XHJcbiAgICAgICAgICAgIGlmKHR5cGVvZiB0aGlzLmh0bWwgPT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgICAgICAgICAgICAvL2xldCBuYW1lID0gQ29tcG9uZW50LmdldE5hbWUodGhpcyk7XHJcbiAgICAgICAgICAgICAgICBIdG1sUHJvdmlkZXIuZ2V0SFRNTCh0aGlzLm5hbWUpXHJcbiAgICAgICAgICAgICAgICAudGhlbigoaHRtbCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHNlbGYuaHRtbCA9IGh0bWw7XHJcbiAgICAgICAgICAgICAgICAgICAgcC5yZXNvbHZlKCk7XHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgLmNhdGNoKHAucmVqZWN0KTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHA7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIGluaXRQcm9wZXJ0aWVzKCk6IHZvaWQge1xyXG4gICAgICAgICAgICB0aGlzLnByb3BlcnRpZXMuZm9yRWFjaChmdW5jdGlvbihwcm9wKSB7XHJcbiAgICAgICAgICAgICAgICBpZih0eXBlb2YgcHJvcCA9PT0gJ29iamVjdCcpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnByb3BlcnRpZXNbcHJvcC5uYW1lXSA9IHRoaXMuZWxlbWVudFtwcm9wLm5hbWVdIHx8IHRoaXMuZWxlbWVudC5nZXRBdHRyaWJ1dGUocHJvcC5uYW1lKSB8fCBwcm9wLmRlZmF1bHQ7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYodGhpcy5wcm9wZXJ0aWVzW3Byb3AubmFtZV0gPT09IHVuZGVmaW5lZCAmJiBwcm9wLnJlcXVpcmVkID09PSB0cnVlKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBgUHJvcGVydHkgJHtwcm9wLm5hbWV9IGlzIHJlcXVpcmVkIGJ1dCBub3QgcHJvdmlkZWRgO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSBpZih0eXBlb2YgcHJvcCA9PT0gJ3N0cmluZycpXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wcm9wZXJ0aWVzW3Byb3BdID0gdGhpcy5lbGVtZW50W3Byb3BdIHx8IHRoaXMuZWxlbWVudC5nZXRBdHRyaWJ1dGUocHJvcCk7XHJcbiAgICAgICAgICAgIH0uYmluZCh0aGlzKSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIGluaXRDaGlsZHJlbigpOiB2b2lkIHtcclxuICAgICAgICAgICAgbGV0IGNoaWxkcyA9IHRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKCcqJyk7XHJcbiAgICBcdFx0Zm9yKGxldCBjID0gMDsgYyA8IGNoaWxkcy5sZW5ndGg7IGMrKykge1xyXG4gICAgXHRcdFx0bGV0IGNoaWxkID0gY2hpbGRzW2NdO1xyXG4gICAgXHRcdFx0aWYoY2hpbGQuaWQpIHtcclxuICAgIFx0XHRcdFx0dGhpcy5jaGlsZHJlbltjaGlsZC5pZF0gPSBjaGlsZDtcclxuICAgIFx0XHRcdH1cclxuICAgIFx0XHRcdGlmKGNoaWxkLnRhZ05hbWUpXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jaGlsZHJlbltjaGlsZC50YWdOYW1lXSA9IHRoaXMuY2hpbGRyZW5bY2hpbGQudGFnTmFtZV0gfHwgW107XHJcbiAgICAgICAgICAgICAgICAoPEVsZW1lbnRbXT50aGlzLmNoaWxkcmVuW2NoaWxkLnRhZ05hbWVdKS5wdXNoKGNoaWxkKTtcclxuICAgIFx0XHR9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIGluaXRBdHRyaWJ1dGVzKCk6IHZvaWQge1xyXG4gICAgICAgICAgICB0aGlzLmF0dHJpYnV0ZXNcclxuICAgICAgICAgICAgLmZvckVhY2goKGEpID0+IHtcclxuICAgICAgICAgICAgICAgIGxldCBhdHRyID0gUmVnaXN0cnkuZ2V0QXR0cmlidXRlKGEpO1xyXG4gICAgICAgICAgICAgICAgQXJyYXkucHJvdG90eXBlLmZvckVhY2guY2FsbCh0aGlzLmVsZW1lbnQucXVlcnlTZWxlY3RvckFsbChgKlske2F9XWApLCAoZTogSFRNTEVsZW1lbnQpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgdmFsID0gZS5oYXNPd25Qcm9wZXJ0eShhKSA/IGVbYV0gOiBlLmdldEF0dHJpYnV0ZShhKTtcclxuICAgICAgICAgICAgICAgICAgICBpZih0eXBlb2YgdmFsID09PSAnc3RyaW5nJyAmJiB2YWwgPT09ICcnKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWwgPSB2b2lkIDA7XHJcbiAgICAgICAgICAgICAgICAgICAgbmV3IGF0dHIoZSwgdmFsKS51cGRhdGUoKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByaXZhdGUgbG9hZFJlcXVpcmVtZW50cygpIHtcclxuICAgIFx0XHRsZXQgY29tcG9uZW50czogYW55W10gPSB0aGlzLnJlcXVpcmVzXHJcbiAgICAgICAgICAgIC5maWx0ZXIoKHJlcSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuICFSZWdpc3RyeS5oYXNDb21wb25lbnQocmVxKTtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLm1hcCgocmVxKSA9PiB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gUmVnaXN0cnkubG9hZENvbXBvbmVudChyZXEpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcblxyXG4gICAgICAgICAgICBsZXQgYXR0cmlidXRlczogYW55W10gPSB0aGlzLmF0dHJpYnV0ZXNcclxuICAgICAgICAgICAgLmZpbHRlcigocmVxKSA9PiB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gIVJlZ2lzdHJ5Lmhhc0F0dHJpYnV0ZShyZXEpO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAubWFwKChyZXEpID0+IHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBSZWdpc3RyeS5sb2FkQXR0cmlidXRlKHJlcSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuXHJcbiAgICAgICAgICAgIGxldCBwcm9taXNlcyA9IGNvbXBvbmVudHMuY29uY2F0KGF0dHJpYnV0ZXMpO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIFByb21pc2UuYWxsKHByb21pc2VzKTtcclxuICAgIFx0fTtcclxuXHJcbiAgICAgICAgLypcclxuICAgICAgICBzdGF0aWMgcmVnaXN0ZXIoYzogdHlwZW9mIENvbXBvbmVudCk6IHZvaWQge1xyXG4gICAgICAgICAgICBSZWdpc3RyeS5yZWdpc3RlcihjKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgKi9cclxuXHJcbiAgICAgICAgLypcclxuICAgICAgICBzdGF0aWMgcnVuKG9wdD86IGFueSkge1xyXG4gICAgICAgICAgICBSZWdpc3RyeS5zZXRPcHRpb25zKG9wdCk7XHJcbiAgICAgICAgICAgIFJlZ2lzdHJ5LnJ1bigpO1xyXG4gICAgICAgIH1cclxuICAgICAgICAqL1xyXG5cclxuICAgICAgICBzdGF0aWMgZ2V0Q29tcG9uZW50KGVsZW1lbnQ6IENvbXBvbmVudEVsZW1lbnQpOiBDb21wb25lbnQge1xyXG4gICAgICAgICAgICB3aGlsZSghZWxlbWVudC5jb21wb25lbnQpXHJcbiAgICBcdFx0XHRlbGVtZW50ID0gPENvbXBvbmVudEVsZW1lbnQ+ZWxlbWVudC5wYXJlbnROb2RlO1xyXG4gICAgXHRcdHJldHVybiBlbGVtZW50LmNvbXBvbmVudDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHN0YXRpYyBnZXROYW1lKGNsYXp6OiB0eXBlb2YgQ29tcG9uZW50KTogc3RyaW5nO1xyXG4gICAgICAgIHN0YXRpYyBnZXROYW1lKGNsYXp6OiBDb21wb25lbnQpOiBzdHJpbmc7XHJcbiAgICAgICAgc3RhdGljIGdldE5hbWUoY2xheno6ICh0eXBlb2YgQ29tcG9uZW50KSB8IChDb21wb25lbnQpKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgaWYoY2xhenogaW5zdGFuY2VvZiBDb21wb25lbnQpXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gY2xhenouY29uc3RydWN0b3IudG9TdHJpbmcoKS5tYXRjaCgvXFx3Ky9nKVsxXTtcclxuICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGNsYXp6LnRvU3RyaW5nKCkubWF0Y2goL1xcdysvZylbMV07XHJcbiAgICAgICAgfVxyXG5cclxuXHJcbiAgICB9XHJcbn1cclxuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
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
/// <reference path="./callbackholder.ts"/>
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
/// <reference path="../../bower_components/ho-promise/dist/d.ts/promise.d.ts"/>
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
/// <reference path="../../bower_components/ho-promise/dist/d.ts/promise.d.ts"/>
/// <reference path="./storeprovider.ts"/>
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
/// <reference path="./callbackholder.ts"/>
/// <reference path="./storeregistry.ts"/>
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
/// <reference path="../../bower_components/ho-promise/dist/d.ts/promise.d.ts"/>
/// <reference path="../../bower_components/ho-promise/dist/d.ts/promise.d.ts"/>
/// <reference path="./state.ts"/>
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
/// <reference path="./store"/>
/// <reference path="./dispatcher.ts"/>
/// <reference path="./state.ts"/>
/// <reference path="./stateprovider.ts"/>
/// <reference path="../../bower_components/ho-promise/dist/d.ts/promise.d.ts"/>
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
                        extern: extern
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
                        extern: true
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
/// <reference path="./dispatcher.ts"/>
/// <reference path="./router.ts"/>
/// <reference path="./storeregistry.ts"/>
var ho;
(function (ho) {
    var flux;
    (function (flux) {
        flux.DISPATCHER = new flux.Dispatcher();
        //export let STORES: {[key:string]:Store<any>} = {};
        flux.STORES = new flux.Storeregistry();
        //if(typeof ho.flux.STORES['Router'] === 'undefined')
        if (ho.flux.STORES.get(flux.Router) === undefined)
            new flux.Router();
        function run() {
            //return (<Router>ho.flux.STORES['Router']).init();
            return flux.STORES.get(flux.Router).init();
        }
        flux.run = run;
    })(flux = ho.flux || (ho.flux = {}));
})(ho || (ho = {}));

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNhbGxiYWNraG9sZGVyLnRzIiwiZGlzcGF0Y2hlci50cyIsInN0b3JlcHJvdmlkZXIudHMiLCJzdG9yZXJlZ2lzdHJ5LnRzIiwic3RvcmUudHMiLCJzdGF0ZS50cyIsInN0YXRlcHJvdmlkZXIudHMiLCJyb3V0ZXIudHMiLCJmbHV4LnRzIl0sIm5hbWVzIjpbImhvIiwiaG8uZmx1eCIsImhvLmZsdXguQ2FsbGJhY2tIb2xkZXIiLCJoby5mbHV4LkNhbGxiYWNrSG9sZGVyLmNvbnN0cnVjdG9yIiwiaG8uZmx1eC5DYWxsYmFja0hvbGRlci5yZWdpc3RlciIsImhvLmZsdXguQ2FsbGJhY2tIb2xkZXIudW5yZWdpc3RlciIsImhvLmZsdXguRGlzcGF0Y2hlciIsImhvLmZsdXguRGlzcGF0Y2hlci5jb25zdHJ1Y3RvciIsImhvLmZsdXguRGlzcGF0Y2hlci53YWl0Rm9yIiwiaG8uZmx1eC5EaXNwYXRjaGVyLmRpc3BhdGNoIiwiaG8uZmx1eC5EaXNwYXRjaGVyLmludm9rZUNhbGxiYWNrIiwiaG8uZmx1eC5EaXNwYXRjaGVyLnN0YXJ0RGlzcGF0Y2hpbmciLCJoby5mbHV4LkRpc3BhdGNoZXIuc3RvcERpc3BhdGNoaW5nIiwiaG8uZmx1eC5zdG9yZXByb3ZpZGVyIiwiaG8uZmx1eC5zdG9yZXByb3ZpZGVyLlN0b3JlUHJvdmlkZXIiLCJoby5mbHV4LnN0b3JlcHJvdmlkZXIuU3RvcmVQcm92aWRlci5jb25zdHJ1Y3RvciIsImhvLmZsdXguc3RvcmVwcm92aWRlci5TdG9yZVByb3ZpZGVyLnJlc29sdmUiLCJoby5mbHV4LnN0b3JlcHJvdmlkZXIuU3RvcmVQcm92aWRlci5nZXRTdG9yZSIsImhvLmZsdXguc3RvcmVwcm92aWRlci5TdG9yZVByb3ZpZGVyLmdldCIsImhvLmZsdXguU3RvcmVyZWdpc3RyeSIsImhvLmZsdXguU3RvcmVyZWdpc3RyeS5jb25zdHJ1Y3RvciIsImhvLmZsdXguU3RvcmVyZWdpc3RyeS5yZWdpc3RlciIsImhvLmZsdXguU3RvcmVyZWdpc3RyeS5nZXQiLCJoby5mbHV4LlN0b3JlcmVnaXN0cnkubG9hZFN0b3JlIiwiaG8uZmx1eC5TdG9yZXJlZ2lzdHJ5LmdldFBhcmVudE9mU3RvcmUiLCJoby5mbHV4LlN0b3JlIiwiaG8uZmx1eC5TdG9yZS5jb25zdHJ1Y3RvciIsImhvLmZsdXguU3RvcmUuaW5pdCIsImhvLmZsdXguU3RvcmUubmFtZSIsImhvLmZsdXguU3RvcmUucmVnaXN0ZXIiLCJoby5mbHV4LlN0b3JlLm9uIiwiaG8uZmx1eC5TdG9yZS5oYW5kbGUiLCJoby5mbHV4LlN0b3JlLmNoYW5nZWQiLCJoby5mbHV4LnN0YXRlcHJvdmlkZXIiLCJoby5mbHV4LnN0YXRlcHJvdmlkZXIuU3RhdGVQcm92aWRlciIsImhvLmZsdXguc3RhdGVwcm92aWRlci5TdGF0ZVByb3ZpZGVyLmNvbnN0cnVjdG9yIiwiaG8uZmx1eC5zdGF0ZXByb3ZpZGVyLlN0YXRlUHJvdmlkZXIucmVzb2x2ZSIsImhvLmZsdXguc3RhdGVwcm92aWRlci5TdGF0ZVByb3ZpZGVyLmdldFN0YXRlcyIsImhvLmZsdXguUm91dGVyIiwiaG8uZmx1eC5Sb3V0ZXIuY29uc3RydWN0b3IiLCJoby5mbHV4LlJvdXRlci5pbml0IiwiaG8uZmx1eC5Sb3V0ZXIuZ28iLCJoby5mbHV4LlJvdXRlci5pbml0U3RhdGVzIiwiaG8uZmx1eC5Sb3V0ZXIuZ2V0U3RhdGVGcm9tTmFtZSIsImhvLmZsdXguUm91dGVyLm9uU3RhdGVDaGFuZ2VSZXF1ZXN0ZWQiLCJoby5mbHV4LlJvdXRlci5vbkhhc2hDaGFuZ2UiLCJoby5mbHV4LlJvdXRlci5zZXRVcmwiLCJoby5mbHV4LlJvdXRlci5yZWdleEZyb21VcmwiLCJoby5mbHV4LlJvdXRlci5hcmdzRnJvbVVybCIsImhvLmZsdXguUm91dGVyLnN0YXRlRnJvbVVybCIsImhvLmZsdXguUm91dGVyLnVybEZyb21TdGF0ZSIsImhvLmZsdXguUm91dGVyLmVxdWFscyIsImhvLmZsdXgucnVuIl0sIm1hcHBpbmdzIjoiQUFBQSxJQUFPLEVBQUUsQ0Fv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UUFBR0EsTUFHbEJBLENBQUFBO0lBQ0ZBLENBQUNBLEVBZlNELElBQUlBLEdBQUpBLE9BQUlBLEtBQUpBLE9BQUlBLFFBZWJBO0FBQURBLENBQUNBLEVBZk0sRUFBRSxLQUFGLEVBQUUsUUFlUiIsImZpbGUiOiJmbHV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlIGhvLmZsdXgge1xuXG5cdGV4cG9ydCBjbGFzcyBDYWxsYmFja0hvbGRlciB7XG5cblx0XHRwcm90ZWN0ZWQgcHJlZml4OiBzdHJpbmcgPSAnSURfJztcbiAgICBcdHByb3RlY3RlZCBsYXN0SUQ6IG51bWJlciA9IDE7XG5cdFx0cHJvdGVjdGVkIGNhbGxiYWNrczoge1trZXk6c3RyaW5nXTpGdW5jdGlvbn0gPSB7fTtcblxuXHRcdHB1YmxpYyByZWdpc3RlcihjYWxsYmFjazogRnVuY3Rpb24sIHNlbGY/OiBhbnkpOiBzdHJpbmcge1xuICAgIFx0XHRsZXQgaWQgPSB0aGlzLnByZWZpeCArIHRoaXMubGFzdElEKys7XG4gICAgXHRcdHRoaXMuY2FsbGJhY2tzW2lkXSA9IHNlbGYgPyBjYWxsYmFjay5iaW5kKHNlbGYpIDogY2FsbGJhY2s7XG4gICAgXHRcdHJldHVybiBpZDtcbiAgXHRcdH1cblxuICBcdFx0cHVibGljIHVucmVnaXN0ZXIoaWQpIHtcbiAgICAgIFx0XHRpZighdGhpcy5jYWxsYmFja3NbaWRdKVxuXHRcdFx0XHR0aHJvdyAnQ291bGQgbm90IHVucmVnaXN0ZXIgY2FsbGJhY2sgZm9yIGlkICcgKyBpZDtcbiAgICBcdFx0ZGVsZXRlIHRoaXMuY2FsbGJhY2tzW2lkXTtcbiAgXHRcdH07XG5cdH1cbn1cbiIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuL2NhbGxiYWNraG9sZGVyLnRzXCIvPlxuXG5tb2R1bGUgaG8uZmx1eCB7XG5cblx0ZXhwb3J0IGludGVyZmFjZSBJQWN0aW9uIHtcblx0ICAgIHR5cGU6c3RyaW5nO1xuXHRcdGRhdGE/OmFueTtcblx0fVxuXG5cdGV4cG9ydCBjbGFzcyBEaXNwYXRjaGVyIGV4dGVuZHMgQ2FsbGJhY2tIb2xkZXIge1xuXG4gICAgXHRwcml2YXRlIGlzUGVuZGluZzoge1trZXk6c3RyaW5nXTpib29sZWFufSA9IHt9O1xuICAgIFx0cHJpdmF0ZSBpc0hhbmRsZWQ6IHtba2V5OnN0cmluZ106Ym9vbGVhbn0gPSB7fTtcbiAgICBcdHByaXZhdGUgaXNEaXNwYXRjaGluZzogYm9vbGVhbiA9IGZhbHNlO1xuICAgIFx0cHJpdmF0ZSBwZW5kaW5nUGF5bG9hZDogSUFjdGlvbiA9IG51bGw7XG5cblx0XHRwdWJsaWMgd2FpdEZvciguLi5pZHM6IEFycmF5PG51bWJlcj4pOiB2b2lkIHtcblx0XHRcdGlmKCF0aGlzLmlzRGlzcGF0Y2hpbmcpXG5cdFx0ICBcdFx0dGhyb3cgJ0Rpc3BhdGNoZXIud2FpdEZvciguLi4pOiBNdXN0IGJlIGludm9rZWQgd2hpbGUgZGlzcGF0Y2hpbmcuJztcblxuXHRcdFx0Zm9yIChsZXQgaWkgPSAwOyBpaSA8IGlkcy5sZW5ndGg7IGlpKyspIHtcblx0XHRcdCAgbGV0IGlkID0gaWRzW2lpXTtcblxuXHRcdFx0ICBpZiAodGhpcy5pc1BlbmRpbmdbaWRdKSB7XG5cdFx0ICAgICAgXHRpZighdGhpcy5pc0hhbmRsZWRbaWRdKVxuXHRcdFx0ICAgICAgXHR0aHJvdyBgd2FpdEZvciguLi4pOiBDaXJjdWxhciBkZXBlbmRlbmN5IGRldGVjdGVkIHdoaWxlIHdhdGluZyBmb3IgJHtpZH1gO1xuXHRcdFx0XHRjb250aW51ZTtcblx0XHRcdCAgfVxuXG5cdFx0XHQgIGlmKCF0aGlzLmNhbGxiYWNrc1tpZF0pXG5cdFx0XHQgIFx0dGhyb3cgYHdhaXRGb3IoLi4uKTogJHtpZH0gZG9lcyBub3QgbWFwIHRvIGEgcmVnaXN0ZXJlZCBjYWxsYmFjay5gO1xuXG5cdFx0XHQgIHRoaXMuaW52b2tlQ2FsbGJhY2soaWQpO1xuXHRcdFx0fVxuXHRcdH07XG5cblx0XHRwdWJsaWMgZGlzcGF0Y2goYWN0aW9uOiBJQWN0aW9uKSB7XG5cdFx0XHRpZih0aGlzLmlzRGlzcGF0Y2hpbmcpXG5cdFx0ICAgIFx0dGhyb3cgJ0Nhbm5vdCBkaXNwYXRjaCBpbiB0aGUgbWlkZGxlIG9mIGEgZGlzcGF0Y2guJztcblxuXHRcdFx0dGhpcy5zdGFydERpc3BhdGNoaW5nKGFjdGlvbik7XG5cblx0XHQgICAgdHJ5IHtcblx0XHQgICAgICBmb3IgKGxldCBpZCBpbiB0aGlzLmNhbGxiYWNrcykge1xuXHRcdCAgICAgICAgaWYgKHRoaXMuaXNQZW5kaW5nW2lkXSkge1xuXHRcdCAgICAgICAgICBjb250aW51ZTtcblx0XHQgICAgICAgIH1cblx0XHQgICAgICAgIHRoaXMuaW52b2tlQ2FsbGJhY2soaWQpO1xuXHRcdCAgICAgIH1cblx0XHQgICAgfSBmaW5hbGx5IHtcblx0XHQgICAgICB0aGlzLnN0b3BEaXNwYXRjaGluZygpO1xuXHRcdCAgICB9XG5cdFx0fTtcblxuXHQgIFx0cHJpdmF0ZSBpbnZva2VDYWxsYmFjayhpZDogbnVtYmVyKTogdm9pZCB7XG5cdCAgICBcdHRoaXMuaXNQZW5kaW5nW2lkXSA9IHRydWU7XG5cdCAgICBcdHRoaXMuY2FsbGJhY2tzW2lkXSh0aGlzLnBlbmRpbmdQYXlsb2FkKTtcblx0ICAgIFx0dGhpcy5pc0hhbmRsZWRbaWRdID0gdHJ1ZTtcblx0ICBcdH1cblxuXHQgIFx0cHJpdmF0ZSBzdGFydERpc3BhdGNoaW5nKHBheWxvYWQ6IElBY3Rpb24pOiB2b2lkIHtcblx0ICAgIFx0Zm9yIChsZXQgaWQgaW4gdGhpcy5jYWxsYmFja3MpIHtcblx0ICAgICAgXHRcdHRoaXMuaXNQZW5kaW5nW2lkXSA9IGZhbHNlO1xuXHQgICAgICBcdFx0dGhpcy5pc0hhbmRsZWRbaWRdID0gZmFsc2U7XG5cdCAgICBcdH1cblx0ICAgIFx0dGhpcy5wZW5kaW5nUGF5bG9hZCA9IHBheWxvYWQ7XG5cdCAgICBcdHRoaXMuaXNEaXNwYXRjaGluZyA9IHRydWU7XG4gIFx0XHR9XG5cblx0ICBcdHByaXZhdGUgc3RvcERpc3BhdGNoaW5nKCk6IHZvaWQge1xuXHQgICAgXHR0aGlzLnBlbmRpbmdQYXlsb2FkID0gbnVsbDtcblx0ICAgIFx0dGhpcy5pc0Rpc3BhdGNoaW5nID0gZmFsc2U7XG5cdCAgXHR9XG5cdH1cbn1cbiIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi8uLi9ib3dlcl9jb21wb25lbnRzL2hvLXByb21pc2UvZGlzdC9kLnRzL3Byb21pc2UuZC50c1wiLz5cblxubW9kdWxlIGhvLmZsdXguc3RvcmVwcm92aWRlciB7XG5cdGltcG9ydCBQcm9taXNlID0gaG8ucHJvbWlzZS5Qcm9taXNlO1xuXG4gICAgZXhwb3J0IGludGVyZmFjZSBJU3RvcmVQcm92aWRlciB7XG4gICAgICAgIHVzZU1pbjpib29sZWFuO1xuXHRcdHJlc29sdmUobmFtZTpzdHJpbmcpOiBzdHJpbmc7XG5cdFx0Z2V0U3RvcmUobmFtZTpzdHJpbmcpOiBQcm9taXNlPHR5cGVvZiBTdG9yZSwgc3RyaW5nPjtcbiAgICB9XG5cblx0ZXhwb3J0IGxldCBtYXBwaW5nOiB7W25hbWU6c3RyaW5nXTpzdHJpbmd9ID0ge307XG5cblx0Y2xhc3MgU3RvcmVQcm92aWRlciBpbXBsZW1lbnRzIElTdG9yZVByb3ZpZGVyIHtcblxuICAgICAgICB1c2VNaW46IGJvb2xlYW4gPSBmYWxzZTtcblxuICAgICAgICByZXNvbHZlKG5hbWU6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgICAgICAgICBuYW1lID0gbmFtZS5zcGxpdCgnLicpLmpvaW4oJy8nKTtcblx0XHRcdHJldHVybiB0aGlzLnVzZU1pbiA/XG4gICAgICAgICAgICAgICAgYHN0b3Jlcy8ke25hbWV9Lm1pbi5qc2AgOlxuICAgICAgICAgICAgICAgIGBzdG9yZXMvJHtuYW1lfS5qc2A7XG4gICAgICAgIH1cblxuICAgICAgICBnZXRTdG9yZShuYW1lOiBzdHJpbmcpOiBQcm9taXNlPHR5cGVvZiBTdG9yZSwgc3RyaW5nPiB7XG4gICAgICAgICAgICBpZih3aW5kb3dbbmFtZV0gIT09IHVuZGVmaW5lZCAmJiB3aW5kb3dbbmFtZV0ucHJvdG90eXBlIGluc3RhbmNlb2YgU3RvcmUpXG5cdFx0XHRcdHJldHVybiBQcm9taXNlLmNyZWF0ZSh3aW5kb3dbbmFtZV0pO1xuXG5cdFx0XHRyZXR1cm4gbmV3IFByb21pc2U8dHlwZW9mIFN0b3JlLCBhbnk+KChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgICAgICBsZXQgc3JjID0gbWFwcGluZ1tuYW1lXSB8fCB0aGlzLnJlc29sdmUobmFtZSk7XG4gICAgICAgICAgICAgICAgbGV0IHNjcmlwdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NjcmlwdCcpO1xuICAgICAgICAgICAgICAgIHNjcmlwdC5vbmxvYWQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYodHlwZW9mIHRoaXMuZ2V0KG5hbWUpID09PSAnZnVuY3Rpb24nKVxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSh0aGlzLmdldChuYW1lKSk7XG4gICAgICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlamVjdChgRXJyb3Igd2hpbGUgbG9hZGluZyBTdG9yZSAke25hbWV9YClcbiAgICAgICAgICAgICAgICB9LmJpbmQodGhpcyk7XG4gICAgICAgICAgICAgICAgc2NyaXB0LnNyYyA9IHNyYztcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnaGVhZCcpWzBdLmFwcGVuZENoaWxkKHNjcmlwdCk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICB9XG5cblx0XHRwcml2YXRlIGdldChuYW1lOiBzdHJpbmcpOiB0eXBlb2YgU3RvcmUge1xuICAgICAgICAgICAgbGV0IGM6IGFueSA9IHdpbmRvdztcbiAgICAgICAgICAgIG5hbWUuc3BsaXQoJy4nKS5mb3JFYWNoKChwYXJ0KSA9PiB7XG4gICAgICAgICAgICAgICAgYyA9IGNbcGFydF07XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiA8dHlwZW9mIFN0b3JlPmM7XG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIGV4cG9ydCBsZXQgaW5zdGFuY2U6IElTdG9yZVByb3ZpZGVyID0gbmV3IFN0b3JlUHJvdmlkZXIoKTtcbn1cbiIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi8uLi9ib3dlcl9jb21wb25lbnRzL2hvLXByb21pc2UvZGlzdC9kLnRzL3Byb21pc2UuZC50c1wiLz5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuL3N0b3JlcHJvdmlkZXIudHNcIi8+XG5cbm1vZHVsZSBoby5mbHV4IHtcblx0aW1wb3J0IFByb21pc2UgPSBoby5wcm9taXNlLlByb21pc2U7XG5cblx0ZXhwb3J0IGNsYXNzIFN0b3JlcmVnaXN0cnkge1xuXG5cdFx0cHJpdmF0ZSBzdG9yZXM6IHtba2V5OiBzdHJpbmddOiBTdG9yZTxhbnk+fSA9IHt9O1xuXG5cdFx0cHVibGljIHJlZ2lzdGVyKHN0b3JlOiBTdG9yZTxhbnk+KTogU3RvcmU8YW55PiB7XG5cdFx0XHR0aGlzLnN0b3Jlc1tzdG9yZS5uYW1lXSA9IHN0b3JlO1xuXHRcdFx0cmV0dXJuIHN0b3JlO1xuXHRcdH1cblxuXHRcdHB1YmxpYyBnZXQ8VCBleHRlbmRzIFN0b3JlPGFueT4+KHN0b3JlQ2xhc3M6IHtuZXcoKTpUfSk6IFQge1xuXHRcdFx0bGV0IG5hbWUgPSBzdG9yZUNsYXNzLnRvU3RyaW5nKCkubWF0Y2goL1xcdysvZylbMV07XG5cdFx0XHRyZXR1cm4gPFQ+dGhpcy5zdG9yZXNbbmFtZV07XG5cdFx0fVxuXG5cdFx0cHVibGljIGxvYWRTdG9yZShuYW1lOiBzdHJpbmcpOiBQcm9taXNlPFN0b3JlPGFueT4sIHN0cmluZz4ge1xuXG5cdFx0XHRsZXQgc2VsZiA9IHRoaXM7XG5cblx0XHQgICBcdGxldCByZXQgPSB0aGlzLmdldFBhcmVudE9mU3RvcmUobmFtZSlcblx0XHQgICBcdC50aGVuKChwYXJlbnQpID0+IHtcblx0XHRcdCAgIFx0aWYoc2VsZi5zdG9yZXNbcGFyZW50XSBpbnN0YW5jZW9mIFN0b3JlIHx8IHBhcmVudCA9PT0gJ2hvLmZsdXguU3RvcmUnKVxuXHRcdFx0XHQgICBcdHJldHVybiB0cnVlO1xuXHQgICBcdFx0XHRlbHNlXG5cdFx0XHQgICBcdFx0cmV0dXJuIHNlbGYubG9hZFN0b3JlKHBhcmVudCk7XG5cdFx0ICAgXHR9KVxuXHRcdCAgIFx0LnRoZW4oKHBhcmVudFR5cGUpID0+IHtcblx0XHRcdCAgIFx0cmV0dXJuIGhvLmZsdXguc3RvcmVwcm92aWRlci5pbnN0YW5jZS5nZXRTdG9yZShuYW1lKTtcblx0XHQgICBcdH0pXG5cdFx0ICAgXHQudGhlbigoc3RvcmVDbGFzcykgPT4ge1xuXHRcdFx0ICAgXHRyZXR1cm4gc2VsZi5yZWdpc3RlcihuZXcgc3RvcmVDbGFzcykuaW5pdCgpO1xuXHRcdCAgIFx0fSlcblx0XHRcdC50aGVuKCgpPT57XG5cdFx0XHQgICBcdHJldHVybiBzZWxmLnN0b3Jlc1tuYW1lXTtcblx0XHRcdH0pO1xuXG5cdFx0XHRyZXR1cm4gcmV0O1xuXG5cdFx0XHQvKlxuXHRcdFx0cmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuXHRcdFx0XHRpZih0aGlzLmdldChuYW1lKSBpbnN0YW5jZW9mIFN0b3JlKVxuXHRcdFx0XHRcdHJlc29sdmUodGhpcy5nZXQobmFtZSkpXG5cdFx0XHRcdGVsc2Uge1xuXG5cdFx0XHRcdFx0c3RvcmVwcm92aWRlci5pbnN0YW5jZS5nZXRTdG9yZShuYW1lKVxuXHRcdFx0XHRcdC50aGVuKChzdG9yZUNsYXNzKSA9PiB7XG5cdFx0XHRcdFx0XHR0aGlzLnJlZ2lzdGVyKG5ldyBzdG9yZUNsYXNzKCkpO1xuXHRcdFx0XHRcdFx0cmVzb2x2ZSh0aGlzLmdldChuYW1lKSk7XG5cdFx0XHRcdFx0fSlcblx0XHRcdFx0XHQuY2F0Y2gocmVqZWN0KTtcblx0XHRcdFx0fVxuXG5cdFx0XHR9LmJpbmQodGhpcykpO1xuXHRcdFx0Ki9cblxuXHRcdFx0Lypcblx0XHRcdGlmKFNUT1JFU1tuYW1lXSAhPT0gdW5kZWZpbmVkICYmIFNUT1JFU1tuYW1lXSBpbnN0YW5jZW9mIFN0b3JlKVxuXHRcdFx0XHRyZXR1cm4gUHJvbWlzZS5jcmVhdGUoU1RPUkVTW25hbWVdKTtcblx0XHRcdGVsc2Uge1xuXHRcdFx0XHRyZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuXHRcdFx0XHRcdHN0b3JlcHJvdmlkZXIuaW5zdGFuY2UuZ2V0U3RvcmUobmFtZSlcblx0XHRcdFx0XHQudGhlbigocyk9PntyZXNvbHZlKHMpO30pXG5cdFx0XHRcdFx0LmNhdGNoKChlKT0+e3JlamVjdChlKTt9KTtcblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0XHQqL1xuXG5cdFx0fVxuXG5cdFx0cHJvdGVjdGVkIGdldFBhcmVudE9mU3RvcmUobmFtZTogc3RyaW5nKTogUHJvbWlzZTxzdHJpbmcsIGFueT4ge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcblxuICAgICAgICAgICAgICAgIGxldCB4bWxodHRwID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgICAgICAgICAgICAgeG1saHR0cC5vbnJlYWR5c3RhdGVjaGFuZ2UgPSAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmKHhtbGh0dHAucmVhZHlTdGF0ZSA9PSA0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgcmVzcCA9IHhtbGh0dHAucmVzcG9uc2VUZXh0O1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYoeG1saHR0cC5zdGF0dXMgPT0gMjAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IG0gPSByZXNwLm1hdGNoKC99XFwpXFwoKC4qKVxcKTsvKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZihtICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUobVsxXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKG51bGwpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVqZWN0KHJlc3ApO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgeG1saHR0cC5vcGVuKCdHRVQnLCBoby5mbHV4LnN0b3JlcHJvdmlkZXIuaW5zdGFuY2UucmVzb2x2ZShuYW1lKSk7XG4gICAgICAgICAgICAgICAgeG1saHR0cC5zZW5kKCk7XG5cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cdH1cblxufVxuIiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4vY2FsbGJhY2tob2xkZXIudHNcIi8+XG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi9zdG9yZXJlZ2lzdHJ5LnRzXCIvPlxuXG5tb2R1bGUgaG8uZmx1eCB7XG5cblx0ZXhwb3J0IGNsYXNzIFN0b3JlPFQ+IGV4dGVuZHMgQ2FsbGJhY2tIb2xkZXIge1xuXG5cdFx0cHJvdGVjdGVkIGRhdGE6IFQ7XG5cdFx0cHJpdmF0ZSBpZDogc3RyaW5nO1xuXHRcdHByaXZhdGUgaGFuZGxlcnM6IHtba2V5OiBzdHJpbmddOiBGdW5jdGlvbn0gPSB7fTtcblxuXG5cdFx0Y29uc3RydWN0b3IoKSB7XG5cdFx0XHRzdXBlcigpO1xuXHRcdFx0dGhpcy5pZCA9IGhvLmZsdXguRElTUEFUQ0hFUi5yZWdpc3Rlcih0aGlzLmhhbmRsZS5iaW5kKHRoaXMpKTtcblx0XHRcdC8vaG8uZmx1eC5TVE9SRVNbdGhpcy5uYW1lXSA9IHRoaXM7XG5cdFx0XHRoby5mbHV4LlNUT1JFUy5yZWdpc3Rlcih0aGlzKTtcblx0XHR9XG5cblx0XHRwdWJsaWMgaW5pdCgpOiBhbnkge31cblxuXHRcdCBnZXQgbmFtZSgpOiBzdHJpbmcge1xuXHRcdFx0cmV0dXJuIHRoaXMuY29uc3RydWN0b3IudG9TdHJpbmcoKS5tYXRjaCgvXFx3Ky9nKVsxXTtcblx0XHR9XG5cblx0XHRwdWJsaWMgcmVnaXN0ZXIoY2FsbGJhY2s6IChkYXRhOlQpPT52b2lkLCBzZWxmPzphbnkpOiBzdHJpbmcge1xuXHRcdFx0cmV0dXJuIHN1cGVyLnJlZ2lzdGVyKGNhbGxiYWNrLCBzZWxmKTtcblx0XHR9XG5cblx0XHRwcm90ZWN0ZWQgb24odHlwZTogc3RyaW5nLCBmdW5jOiBGdW5jdGlvbik6IHZvaWQge1xuXHRcdFx0dGhpcy5oYW5kbGVyc1t0eXBlXSA9IGZ1bmM7XG5cdFx0fVxuXG5cdFx0cHJvdGVjdGVkIGhhbmRsZShhY3Rpb246IElBY3Rpb24pOiB2b2lkIHtcblx0XHRcdGlmKHR5cGVvZiB0aGlzLmhhbmRsZXJzW2FjdGlvbi50eXBlXSA9PT0gJ2Z1bmN0aW9uJylcblx0XHRcdFx0dGhpcy5oYW5kbGVyc1thY3Rpb24udHlwZV0oYWN0aW9uLmRhdGEpO1xuXHRcdH07XG5cblxuXHRcdHByb3RlY3RlZCBjaGFuZ2VkKCk6IHZvaWQge1xuXHRcdFx0Zm9yIChsZXQgaWQgaW4gdGhpcy5jYWxsYmFja3MpIHtcblx0XHRcdCAgbGV0IGNiID0gdGhpcy5jYWxsYmFja3NbaWRdO1xuXHRcdFx0ICBpZihjYilcblx0XHRcdCAgXHRjYih0aGlzLmRhdGEpO1xuXHRcdFx0fVxuXHRcdH1cblxuXG5cdH07XG5cblxufVxuIiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uLy4uL2Jvd2VyX2NvbXBvbmVudHMvaG8tcHJvbWlzZS9kaXN0L2QudHMvcHJvbWlzZS5kLnRzXCIvPlxuXG5tb2R1bGUgaG8uZmx1eCB7XG5cdGltcG9ydCBQcm9taXNlID0gaG8ucHJvbWlzZS5Qcm9taXNlO1xuXG5cblx0ZXhwb3J0IGludGVyZmFjZSBJU3RhdGUge1xuXHRcdG5hbWU6IHN0cmluZztcblx0XHR1cmw6IHN0cmluZztcblx0XHRyZWRpcmVjdD86IHN0cmluZztcblx0XHRiZWZvcmU/OiAoZGF0YTogSVJvdXRlRGF0YSk9PlByb21pc2U8YW55LCBhbnk+O1xuXHRcdHZpZXc/OiBBcnJheTxJVmlld1N0YXRlPjtcblx0fVxuXG5cdGV4cG9ydCBpbnRlcmZhY2UgSVZpZXdTdGF0ZSB7XG5cdCAgICBuYW1lOiBzdHJpbmc7XG5cdFx0aHRtbDogc3RyaW5nO1xuXHR9XG5cblx0ZXhwb3J0IGludGVyZmFjZSBJU3RhdGVzIHtcblx0ICAgIHN0YXRlczogQXJyYXk8SVN0YXRlPjtcblx0fVxuXG59XG4iLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vLi4vYm93ZXJfY29tcG9uZW50cy9oby1wcm9taXNlL2Rpc3QvZC50cy9wcm9taXNlLmQudHNcIi8+XG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi9zdGF0ZS50c1wiLz5cblxubW9kdWxlIGhvLmZsdXguc3RhdGVwcm92aWRlciB7XG5cdGltcG9ydCBQcm9taXNlID0gaG8ucHJvbWlzZS5Qcm9taXNlO1xuXG4gICAgZXhwb3J0IGludGVyZmFjZSBJU3RhdGVQcm92aWRlciB7XG4gICAgICAgIHVzZU1pbjpib29sZWFuO1xuXHRcdHJlc29sdmUoKTogc3RyaW5nO1xuXHRcdGdldFN0YXRlcyhuYW1lPzpzdHJpbmcpOiBQcm9taXNlPElTdGF0ZXMsIHN0cmluZz47XG4gICAgfVxuXG5cdGNsYXNzIFN0YXRlUHJvdmlkZXIgaW1wbGVtZW50cyBJU3RhdGVQcm92aWRlciB7XG5cbiAgICAgICAgdXNlTWluOiBib29sZWFuID0gZmFsc2U7XG5cbiAgICAgICAgcmVzb2x2ZSgpOiBzdHJpbmcge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMudXNlTWluID9cbiAgICAgICAgICAgICAgICBgc3RhdGVzLm1pbi5qc2AgOlxuICAgICAgICAgICAgICAgIGBzdGF0ZXMuanNgO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0U3RhdGVzKG5hbWUgPSBcIlN0YXRlc1wiKTogUHJvbWlzZTxJU3RhdGVzLCBzdHJpbmc+IHtcblx0XHRcdHJldHVybiBuZXcgUHJvbWlzZTxJU3RhdGVzLCBhbnk+KChyZXNvbHZlLCByZWplY3QpID0+IHtcblx0XHRcdFx0bGV0IHNyYyA9IHRoaXMucmVzb2x2ZSgpO1xuICAgICAgICAgICAgICAgIGxldCBzY3JpcHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzY3JpcHQnKTtcbiAgICAgICAgICAgICAgICBzY3JpcHQub25sb2FkID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUobmV3IHdpbmRvd1tuYW1lXSk7XG4gICAgICAgICAgICAgICAgfTtcblx0XHRcdFx0c2NyaXB0Lm9uZXJyb3IgPSAoZSkgPT4ge1xuXHRcdFx0XHRcdHJlamVjdChlKTtcblx0XHRcdFx0fTtcbiAgICAgICAgICAgICAgICBzY3JpcHQuc3JjID0gc3JjO1xuICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdoZWFkJylbMF0uYXBwZW5kQ2hpbGQoc2NyaXB0KTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIGV4cG9ydCBsZXQgaW5zdGFuY2U6IElTdGF0ZVByb3ZpZGVyID0gbmV3IFN0YXRlUHJvdmlkZXIoKTtcbn1cbiIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuL3N0b3JlXCIvPlxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4vZGlzcGF0Y2hlci50c1wiLz5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuL3N0YXRlLnRzXCIvPlxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4vc3RhdGVwcm92aWRlci50c1wiLz5cblxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uLy4uL2Jvd2VyX2NvbXBvbmVudHMvaG8tcHJvbWlzZS9kaXN0L2QudHMvcHJvbWlzZS5kLnRzXCIvPlxuXG5cbm1vZHVsZSBoby5mbHV4IHtcblxuXHRpbXBvcnQgUHJvbWlzZSA9IGhvLnByb21pc2UuUHJvbWlzZTtcblxuXG5cdC8qKiBEYXRhIHRoYXQgYSBSb3V0ZXIjZ28gdGFrZXMgKi9cblx0ZXhwb3J0IGludGVyZmFjZSBJUm91dGVEYXRhIHtcblx0ICAgIHN0YXRlOiBzdHJpbmc7XG5cdFx0YXJnczogYW55O1xuXHRcdGV4dGVybjogYm9vbGVhbjtcblx0fVxuXG5cdC8qKiBEYXRhIHRoYXQgUm91dGVyI2NoYW5nZXMgZW1pdCB0byBpdHMgbGlzdGVuZXJzICovXG5cdGV4cG9ydCBpbnRlcmZhY2UgSVJvdXRlckRhdGEge1xuXHQgICAgc3RhdGU6IElTdGF0ZTtcblx0XHRhcmdzOiBhbnk7XG5cdFx0ZXh0ZXJuOiBib29sZWFuO1xuXHR9XG5cblx0ZXhwb3J0IGNsYXNzIFJvdXRlciBleHRlbmRzIFN0b3JlPElSb3V0ZXJEYXRhPiB7XG5cblx0XHRwcml2YXRlIG1hcHBpbmc6QXJyYXk8SVN0YXRlPiA9IG51bGw7XG5cdFx0Ly9wcml2YXRlIHN0YXRlOklTdGF0ZTtcblx0XHQvL3ByaXZhdGUgYXJnczphbnkgPSBudWxsO1xuXG5cdFx0Y29uc3RydWN0b3IoKSB7XG5cdFx0XHRzdXBlcigpO1xuXHRcdH1cblxuXHRcdHB1YmxpYyBpbml0KCk6IFByb21pc2U8YW55LCBhbnk+IHtcblx0XHRcdHRoaXMub24oJ1NUQVRFJywgdGhpcy5vblN0YXRlQ2hhbmdlUmVxdWVzdGVkLmJpbmQodGhpcykpO1xuXG5cdFx0XHRsZXQgb25IYXNoQ2hhbmdlID0gdGhpcy5vbkhhc2hDaGFuZ2UuYmluZCh0aGlzKTtcblxuXHRcdFx0cmV0dXJuIHRoaXMuaW5pdFN0YXRlcygpXG5cdFx0XHQudGhlbigoKSA9PiB7XG5cdFx0XHRcdHdpbmRvdy5vbmhhc2hjaGFuZ2UgPSBvbkhhc2hDaGFuZ2U7XG5cdFx0XHRcdG9uSGFzaENoYW5nZSgpO1xuXHRcdFx0fSk7XG5cdFx0fVxuXG5cblx0XHRwdWJsaWMgZ28oZGF0YTogSVJvdXRlRGF0YSk6IHZvaWQge1xuXHRcdFx0aG8uZmx1eC5ESVNQQVRDSEVSLmRpc3BhdGNoKHtcblx0XHRcdFx0dHlwZTogJ1NUQVRFJyxcblx0XHRcdFx0ZGF0YTogZGF0YVxuXHRcdFx0fSk7XG5cdFx0fVxuXG5cdFx0cHJpdmF0ZSBpbml0U3RhdGVzKCk6IFByb21pc2U8YW55LCBhbnk+IHtcblx0XHRcdHJldHVybiBzdGF0ZXByb3ZpZGVyLmluc3RhbmNlLmdldFN0YXRlcygpXG5cdFx0XHQudGhlbihmdW5jdGlvbihpc3RhdGVzKSB7XG5cdFx0XHRcdHRoaXMubWFwcGluZyA9IGlzdGF0ZXMuc3RhdGVzO1xuXHRcdFx0fS5iaW5kKHRoaXMpKTtcblx0XHR9XG5cblx0XHRwcml2YXRlIGdldFN0YXRlRnJvbU5hbWUobmFtZTogc3RyaW5nKTogSVN0YXRlIHtcblx0XHRcdHJldHVybiB0aGlzLm1hcHBpbmcuZmlsdGVyKChzKT0+e1xuXHRcdFx0XHRyZXR1cm4gcy5uYW1lID09PSBuYW1lXG5cdFx0XHR9KVswXTtcblx0XHR9XG5cblx0XHRwcm90ZWN0ZWQgb25TdGF0ZUNoYW5nZVJlcXVlc3RlZChkYXRhOiBJUm91dGVEYXRhKTogdm9pZCB7XG5cdFx0XHQvL2N1cnJlbnQgc3RhdGUgYW5kIGFyZ3MgZXF1YWxzIHJlcXVlc3RlZCBzdGF0ZSBhbmQgYXJncyAtPiByZXR1cm5cblx0XHRcdC8vaWYodGhpcy5zdGF0ZSAmJiB0aGlzLnN0YXRlLm5hbWUgPT09IGRhdGEuc3RhdGUgJiYgdGhpcy5lcXVhbHModGhpcy5hcmdzLCBkYXRhLmFyZ3MpKVxuXHRcdFx0aWYodGhpcy5kYXRhICYmIHRoaXMuZGF0YS5zdGF0ZSAmJiB0aGlzLmRhdGEuc3RhdGUubmFtZSA9PT0gZGF0YS5zdGF0ZSAmJiB0aGlzLmVxdWFscyh0aGlzLmRhdGEuYXJncywgZGF0YS5hcmdzKSlcblx0XHRcdFx0cmV0dXJuO1xuXG5cdFx0XHQvL2dldCByZXF1ZXN0ZWQgc3RhdGVcblx0XHRcdGxldCBzdGF0ZSA9IHRoaXMuZ2V0U3RhdGVGcm9tTmFtZShkYXRhLnN0YXRlKTtcblxuXG5cdFx0XHQvL3JlcXVlc3RlZCBzdGF0ZSBoYXMgYW4gcmVkaXJlY3QgcHJvcGVydHkgLT4gY2FsbCByZWRpcmVjdCBzdGF0ZVxuXHRcdFx0aWYoISFzdGF0ZS5yZWRpcmVjdCkge1xuXHRcdFx0XHRzdGF0ZSA9IHRoaXMuZ2V0U3RhdGVGcm9tTmFtZShzdGF0ZS5yZWRpcmVjdCk7XG5cdFx0XHR9XG5cblxuXHRcdFx0Ly9UT0RPIGhhbmRsZXIgcHJvbWlzZXNcblx0XHRcdGxldCBwcm9tID0gdHlwZW9mIHN0YXRlLmJlZm9yZSA9PT0gJ2Z1bmN0aW9uJyA/IHN0YXRlLmJlZm9yZShkYXRhKSA6IFByb21pc2UuY3JlYXRlKHVuZGVmaW5lZCk7XG5cdFx0XHRwcm9tXG5cdFx0XHQudGhlbihmdW5jdGlvbigpIHtcblxuXHRcdFx0XHQvL2RvZXMgdGhlIHN0YXRlIGNoYW5nZSByZXF1ZXN0IGNvbWVzIGZyb20gZXh0ZXJuIGUuZy4gdXJsIGNoYW5nZSBpbiBicm93c2VyIHdpbmRvdyA/XG5cdFx0XHRcdGxldCBleHRlcm4gPSAhISBkYXRhLmV4dGVybjtcblxuXHRcdFx0XHQvLy0tLS0tLS0gc2V0IGN1cnJlbnQgc3RhdGUgJiBhcmd1bWVudHNcblx0XHRcdFx0Ly90aGlzLnN0YXRlID0gc3RhdGU7XG5cdFx0XHRcdC8vdGhpcy5hcmdzID0gZGF0YS5hcmdzO1xuXG5cdFx0XHRcdHRoaXMuZGF0YSA9IHtcblx0XHRcdFx0XHRzdGF0ZTogc3RhdGUsXG5cdFx0XHRcdFx0YXJnczogZGF0YS5hcmdzLFxuXHRcdFx0XHRcdGV4dGVybjogZXh0ZXJuLFxuXHRcdFx0XHR9O1xuXG5cdFx0XHRcdC8vLS0tLS0tLSBzZXQgdXJsIGZvciBicm93c2VyXG5cdFx0XHRcdHZhciB1cmwgPSB0aGlzLnVybEZyb21TdGF0ZShzdGF0ZS51cmwsIGRhdGEuYXJncyk7XG5cdFx0XHRcdHRoaXMuc2V0VXJsKHVybCk7XG5cblx0XHRcdFx0dGhpcy5jaGFuZ2VkKCk7XG5cblx0XHRcdH0uYmluZCh0aGlzKSxcblx0XHRcdGZ1bmN0aW9uKGRhdGEpIHtcblx0XHRcdFx0dGhpcy5vblN0YXRlQ2hhbmdlUmVxdWVzdGVkKGRhdGEpO1xuXHRcdFx0fS5iaW5kKHRoaXMpKTtcblxuXHRcdH1cblxuXHRcdHByaXZhdGUgb25IYXNoQ2hhbmdlKCk6IHZvaWQge1xuXHRcdFx0bGV0IHMgPSB0aGlzLnN0YXRlRnJvbVVybCh3aW5kb3cubG9jYXRpb24uaGFzaC5zdWJzdHIoMSkpO1xuXG5cdFx0XHRoby5mbHV4LkRJU1BBVENIRVIuZGlzcGF0Y2goe1xuXHRcdFx0XHR0eXBlOiAnU1RBVEUnLFxuXHRcdFx0XHRkYXRhOiB7XG5cdFx0XHRcdFx0c3RhdGU6IHMuc3RhdGUsXG5cdFx0XHRcdFx0YXJnczogcy5hcmdzLFxuXHRcdFx0XHRcdGV4dGVybjogdHJ1ZSxcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0fVxuXG5cdFx0cHJpdmF0ZSBzZXRVcmwodXJsOiBzdHJpbmcpOiB2b2lkIHtcblx0XHRcdGlmKHdpbmRvdy5sb2NhdGlvbi5oYXNoLnN1YnN0cigxKSA9PT0gdXJsKVxuXHRcdFx0XHRyZXR1cm47XG5cblx0XHRcdGxldCBsID0gd2luZG93Lm9uaGFzaGNoYW5nZTtcblx0XHRcdHdpbmRvdy5vbmhhc2hjaGFuZ2UgPSBudWxsO1xuXHRcdFx0d2luZG93LmxvY2F0aW9uLmhhc2ggPSB1cmw7XG5cdFx0XHR3aW5kb3cub25oYXNoY2hhbmdlID0gbDtcblx0XHR9XG5cblx0XHRwcml2YXRlIHJlZ2V4RnJvbVVybCh1cmw6IHN0cmluZyk6IHN0cmluZyB7XG5cdFx0XHR2YXIgcmVnZXggPSAvOihbXFx3XSspLztcblx0XHRcdHdoaWxlKHVybC5tYXRjaChyZWdleCkpIHtcblx0XHRcdFx0dXJsID0gdXJsLnJlcGxhY2UocmVnZXgsIFwiKFteXFwvXSspXCIpO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIHVybCsnJCc7XG5cdFx0fVxuXG5cdFx0cHJpdmF0ZSBhcmdzRnJvbVVybChwYXR0ZXJuOiBzdHJpbmcsIHVybDogc3RyaW5nKTogYW55IHtcblx0XHRcdGxldCByID0gdGhpcy5yZWdleEZyb21VcmwocGF0dGVybik7XG5cdFx0XHRsZXQgbmFtZXMgPSBwYXR0ZXJuLm1hdGNoKHIpLnNsaWNlKDEpO1xuXHRcdFx0bGV0IHZhbHVlcyA9IHVybC5tYXRjaChyKS5zbGljZSgxKTtcblxuXHRcdFx0bGV0IGFyZ3MgPSB7fTtcblx0XHRcdG5hbWVzLmZvckVhY2goZnVuY3Rpb24obmFtZSwgaSkge1xuXHRcdFx0XHRhcmdzW25hbWUuc3Vic3RyKDEpXSA9IHZhbHVlc1tpXTtcblx0XHRcdH0pO1xuXG5cdFx0XHRyZXR1cm4gYXJncztcblx0XHR9XG5cblx0XHRwcml2YXRlIHN0YXRlRnJvbVVybCh1cmw6IHN0cmluZyk6IElSb3V0ZURhdGEge1xuXHRcdFx0dmFyIHMgPSB2b2lkIDA7XG5cdFx0XHR0aGlzLm1hcHBpbmcuZm9yRWFjaCgoc3RhdGU6IElTdGF0ZSkgPT4ge1xuXHRcdFx0XHRpZihzKVxuXHRcdFx0XHRcdHJldHVybjtcblxuXHRcdFx0XHR2YXIgciA9IHRoaXMucmVnZXhGcm9tVXJsKHN0YXRlLnVybCk7XG5cdFx0XHRcdGlmKHVybC5tYXRjaChyKSkge1xuXHRcdFx0XHRcdHZhciBhcmdzID0gdGhpcy5hcmdzRnJvbVVybChzdGF0ZS51cmwsIHVybCk7XG5cdFx0XHRcdFx0cyA9IHtcblx0XHRcdFx0XHRcdFwic3RhdGVcIjogc3RhdGUubmFtZSxcblx0XHRcdFx0XHRcdFwiYXJnc1wiOiBhcmdzLFxuXHRcdFx0XHRcdFx0XCJleHRlcm5cIjogZmFsc2Vcblx0XHRcdFx0XHR9O1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblxuXHRcdFx0aWYoIXMpXG5cdFx0XHRcdHRocm93IFwiTm8gU3RhdGUgZm91bmQgZm9yIHVybCBcIit1cmw7XG5cblx0XHRcdHJldHVybiBzO1xuXHRcdH1cblxuXHRcdHByaXZhdGUgdXJsRnJvbVN0YXRlKHVybDogc3RyaW5nLCBhcmdzOiBhbnkpOiBzdHJpbmcge1xuXHRcdFx0bGV0IHJlZ2V4ID0gLzooW1xcd10rKS87XG5cdFx0XHR3aGlsZSh1cmwubWF0Y2gocmVnZXgpKSB7XG5cdFx0XHRcdHVybCA9IHVybC5yZXBsYWNlKHJlZ2V4LCBmdW5jdGlvbihtKSB7XG5cdFx0XHRcdFx0cmV0dXJuIGFyZ3NbbS5zdWJzdHIoMSldO1xuXHRcdFx0XHR9KTtcblx0XHRcdH1cblx0XHRcdHJldHVybiB1cmw7XG5cdFx0fVxuXG5cdFx0cHJpdmF0ZSBlcXVhbHMobzE6IGFueSwgbzI6IGFueSkgOiBib29sZWFuIHtcblx0XHRcdHJldHVybiBKU09OLnN0cmluZ2lmeShvMSkgPT09IEpTT04uc3RyaW5naWZ5KG8yKTtcblx0XHR9XG5cblx0fVxufVxuIiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4vZGlzcGF0Y2hlci50c1wiLz5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuL3JvdXRlci50c1wiLz5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuL3N0b3JlcmVnaXN0cnkudHNcIi8+XG5cbm1vZHVsZSBoby5mbHV4IHtcblx0aW1wb3J0IFByb21pc2UgPSBoby5wcm9taXNlLlByb21pc2U7XG5cblx0ZXhwb3J0IGxldCBESVNQQVRDSEVSOiBEaXNwYXRjaGVyID0gbmV3IERpc3BhdGNoZXIoKTtcblx0Ly9leHBvcnQgbGV0IFNUT1JFUzoge1trZXk6c3RyaW5nXTpTdG9yZTxhbnk+fSA9IHt9O1xuXHRleHBvcnQgbGV0IFNUT1JFUzogU3RvcmVyZWdpc3RyeSA9IG5ldyBTdG9yZXJlZ2lzdHJ5KCk7XG5cblx0Ly9pZih0eXBlb2YgaG8uZmx1eC5TVE9SRVNbJ1JvdXRlciddID09PSAndW5kZWZpbmVkJylcblx0aWYoaG8uZmx1eC5TVE9SRVMuZ2V0KFJvdXRlcikgPT09IHVuZGVmaW5lZClcblx0XHRuZXcgUm91dGVyKCk7XG5cblx0ZXhwb3J0IGZ1bmN0aW9uIHJ1bigpOiBQcm9taXNlPGFueSwgYW55PiB7XG5cdFx0Ly9yZXR1cm4gKDxSb3V0ZXI+aG8uZmx1eC5TVE9SRVNbJ1JvdXRlciddKS5pbml0KCk7XG5cdFx0cmV0dXJuIFNUT1JFUy5nZXQoUm91dGVyKS5pbml0KCk7XG5cdH1cbn1cbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
var ho;
(function (ho) {
    var ui;
    (function (ui) {
        function run(options) {
            if (options === void 0) { options = {}; }
        }
        ui.run = run;
    })(ui = ho.ui || (ho.ui = {}));
})(ho || (ho = {}));

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInVpLnRzIl0sIm5hbWVzIjpbImhvIiwiaG8udWkiLCJoby51aS5ydW4iXSwibWFwcGluZ3MiOiJBQUFBLElBQU8sRUFBRSxDQUVSO0FBRkQsV0FBTyxFQUFFO0lBQUNBLElBQUFBLEVBQUVBLENBRVhBO0lBRlNBLFdBQUFBLEVBQUVBLEVBQUNBLENBQUNBO1FBQ2JDLGFBQW9CQSxPQUFVQTtZQUFWQyx1QkFBVUEsR0FBVkEsWUFBVUE7UUFBR0EsQ0FBQ0E7UUFBbEJELE1BQUdBLE1BQWVBLENBQUFBO0lBQ25DQSxDQUFDQSxFQUZTRCxFQUFFQSxHQUFGQSxLQUFFQSxLQUFGQSxLQUFFQSxRQUVYQTtBQUFEQSxDQUFDQSxFQUZNLEVBQUUsS0FBRixFQUFFLFFBRVIiLCJmaWxlIjoidWkuanMiLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUgaG8udWkge1xuXHRleHBvcnQgZnVuY3Rpb24gcnVuKG9wdGlvbnM9e30pIHt9XG59XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=