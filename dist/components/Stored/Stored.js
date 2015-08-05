var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Stored = (function (_super) {
    __extends(Stored, _super);
    function Stored() {
        _super.apply(this, arguments);
        this.stores = [];
    }
    Stored.prototype.init = function () {
        var promises = this.stores.map(function (s) {
            return ho.flux.STORES.loadStore(s);
        });
        return ho.promise.Promise.all(promises);
    };
    return Stored;
})(ho.components.Component);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbXBvbmVudHMvU3RvcmVkL1N0b3JlZC50cyJdLCJuYW1lcyI6WyJTdG9yZWQiLCJTdG9yZWQuY29uc3RydWN0b3IiLCJTdG9yZWQuaW5pdCJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUE7SUFBcUJBLDBCQUF1QkE7SUFBNUNBO1FBQXFCQyw4QkFBdUJBO1FBQ3BDQSxXQUFNQSxHQUFrQkEsRUFBRUEsQ0FBQ0E7SUFRbkNBLENBQUNBO0lBTkFELHFCQUFJQSxHQUFKQTtRQUNDRSxJQUFJQSxRQUFRQSxHQUFHQSxJQUFJQSxDQUFDQSxNQUFNQSxDQUFDQSxHQUFHQSxDQUFDQSxVQUFBQSxDQUFDQTtZQUMvQkEsTUFBTUEsQ0FBQ0EsRUFBRUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsU0FBU0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7UUFDcENBLENBQUNBLENBQUNBLENBQUNBO1FBQ0hBLE1BQU1BLENBQUNBLEVBQUVBLENBQUNBLE9BQU9BLENBQUNBLE9BQU9BLENBQUNBLEdBQUdBLENBQUNBLFFBQVFBLENBQUNBLENBQUNBO0lBQ3pDQSxDQUFDQTtJQUNGRixhQUFDQTtBQUFEQSxDQVRBLEFBU0NBLEVBVG9CLEVBQUUsQ0FBQyxVQUFVLENBQUMsU0FBUyxFQVMzQyIsImZpbGUiOiJjb21wb25lbnRzL1N0b3JlZC9TdG9yZWQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjbGFzcyBTdG9yZWQgZXh0ZW5kcyBoby5jb21wb25lbnRzLkNvbXBvbmVudCB7XG5cdHB1YmxpYyBzdG9yZXM6IEFycmF5PHN0cmluZz4gPSBbXTtcblxuXHRpbml0KCkge1xuXHRcdGxldCBwcm9taXNlcyA9IHRoaXMuc3RvcmVzLm1hcChzID0+IHtcblx0XHRcdHJldHVybiBoby5mbHV4LlNUT1JFUy5sb2FkU3RvcmUocyk7XG5cdFx0fSk7XG5cdFx0cmV0dXJuIGhvLnByb21pc2UuUHJvbWlzZS5hbGwocHJvbWlzZXMpO1xuXHR9XG59XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=