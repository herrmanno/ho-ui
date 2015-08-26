var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Disable = (function (_super) {
    __extends(Disable, _super);
    function Disable() {
        _super.apply(this, arguments);
    }
    Disable.prototype.update = function () {
        var disabled = this.eval(this.value);
        this.element.disabled = disabled;
    };
    return Disable;
})(ho.components.WatchAttribute);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImF0dHJpYnV0ZXMvZGlzYWJsZS9kaXNhYmxlLnRzIl0sIm5hbWVzIjpbIkRpc2FibGUiLCJEaXNhYmxlLmNvbnN0cnVjdG9yIiwiRGlzYWJsZS51cGRhdGUiXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBO0lBQXNCQSwyQkFBNEJBO0lBQWxEQTtRQUFzQkMsOEJBQTRCQTtJQU1sREEsQ0FBQ0E7SUFKQUQsd0JBQU1BLEdBQU5BO1FBQ0NFLElBQUlBLFFBQVFBLEdBQUdBLElBQUlBLENBQUNBLElBQUlBLENBQUNBLElBQUlBLENBQUNBLEtBQUtBLENBQUNBLENBQUNBO1FBQy9CQSxJQUFJQSxDQUFDQSxPQUFRQSxDQUFDQSxRQUFRQSxHQUFHQSxRQUFRQSxDQUFDQTtJQUN6Q0EsQ0FBQ0E7SUFDRkYsY0FBQ0E7QUFBREEsQ0FOQSxBQU1DQSxFQU5xQixFQUFFLENBQUMsVUFBVSxDQUFDLGNBQWMsRUFNakQiLCJmaWxlIjoiYXR0cmlidXRlcy9kaXNhYmxlL2Rpc2FibGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjbGFzcyBEaXNhYmxlIGV4dGVuZHMgaG8uY29tcG9uZW50cy5XYXRjaEF0dHJpYnV0ZSB7XG5cblx0dXBkYXRlKCkge1xuXHRcdGxldCBkaXNhYmxlZCA9IHRoaXMuZXZhbCh0aGlzLnZhbHVlKTtcblx0XHQoPGFueT50aGlzLmVsZW1lbnQpLmRpc2FibGVkID0gZGlzYWJsZWQ7XG5cdH1cbn1cbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==