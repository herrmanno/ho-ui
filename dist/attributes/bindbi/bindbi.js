/// <reference path="../bind/bind.ts"/>
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var BindBi = (function (_super) {
    __extends(BindBi, _super);
    function BindBi() {
        _super.apply(this, arguments);
    }
    BindBi.prototype.bindInput = function () {
        _super.prototype.bindInput.call(this);
        this.bindOther();
    };
    BindBi.prototype.bindSelect = function () {
        _super.prototype.bindSelect.call(this);
        this.bindOther();
    };
    BindBi.prototype.bindTextarea = function () {
        _super.prototype.bindTextarea.call(this);
        this.bindOther();
    };
    BindBi.prototype.bindOther = function () {
        this.watch(this.value);
    };
    BindBi.prototype.update = function () {
        var val = this.eval(this.value);
        if (this.element.hasAttribute('value'))
            this.element.value = val;
        else
            this.element.innerHTML = val;
    };
    return BindBi;
})(Bind);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImF0dHJpYnV0ZXMvYmluZGJpL2JpbmRiaS50cyJdLCJuYW1lcyI6WyJCaW5kQmkiLCJCaW5kQmkuY29uc3RydWN0b3IiLCJCaW5kQmkuYmluZElucHV0IiwiQmluZEJpLmJpbmRTZWxlY3QiLCJCaW5kQmkuYmluZFRleHRhcmVhIiwiQmluZEJpLmJpbmRPdGhlciIsIkJpbmRCaS51cGRhdGUiXSwibWFwcGluZ3MiOiJBQUFBLHVDQUF1Qzs7Ozs7OztBQUV2QztJQUFxQkEsMEJBQUlBO0lBQXpCQTtRQUFxQkMsOEJBQUlBO0lBK0J6QkEsQ0FBQ0E7SUE1QlVELDBCQUFTQSxHQUFuQkE7UUFDQ0UsZ0JBQUtBLENBQUNBLFNBQVNBLFdBQUVBLENBQUNBO1FBQ2xCQSxJQUFJQSxDQUFDQSxTQUFTQSxFQUFFQSxDQUFDQTtJQUNsQkEsQ0FBQ0E7SUFFU0YsMkJBQVVBLEdBQXBCQTtRQUNDRyxnQkFBS0EsQ0FBQ0EsVUFBVUEsV0FBRUEsQ0FBQ0E7UUFDbkJBLElBQUlBLENBQUNBLFNBQVNBLEVBQUVBLENBQUNBO0lBQ2xCQSxDQUFDQTtJQUVTSCw2QkFBWUEsR0FBdEJBO1FBQ0NJLGdCQUFLQSxDQUFDQSxZQUFZQSxXQUFFQSxDQUFDQTtRQUNyQkEsSUFBSUEsQ0FBQ0EsU0FBU0EsRUFBRUEsQ0FBQ0E7SUFDbEJBLENBQUNBO0lBRVNKLDBCQUFTQSxHQUFuQkE7UUFDQ0ssSUFBSUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsQ0FBQ0E7SUFDeEJBLENBQUNBO0lBRU1MLHVCQUFNQSxHQUFiQTtRQUNDTSxJQUFJQSxHQUFHQSxHQUFHQSxJQUFJQSxDQUFDQSxJQUFJQSxDQUFDQSxJQUFJQSxDQUFDQSxLQUFLQSxDQUFDQSxDQUFDQTtRQUVoQ0EsRUFBRUEsQ0FBQUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsWUFBWUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsQ0FBQ0E7WUFDL0JBLElBQUlBLENBQUNBLE9BQVFBLENBQUNBLEtBQUtBLEdBQUdBLEdBQUdBLENBQUNBO1FBQ2pDQSxJQUFJQTtZQUNIQSxJQUFJQSxDQUFDQSxPQUFPQSxDQUFDQSxTQUFTQSxHQUFHQSxHQUFHQSxDQUFDQTtJQUMvQkEsQ0FBQ0E7SUFFRk4sYUFBQ0E7QUFBREEsQ0EvQkEsQUErQkNBLEVBL0JvQixJQUFJLEVBK0J4QiIsImZpbGUiOiJhdHRyaWJ1dGVzL2JpbmRiaS9iaW5kYmkuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vYmluZC9iaW5kLnRzXCIvPlxuXG5jbGFzcyBCaW5kQmkgZXh0ZW5kcyBCaW5kIHtcblxuXG5cdHByb3RlY3RlZCBiaW5kSW5wdXQoKSB7XG5cdFx0c3VwZXIuYmluZElucHV0KCk7XG5cdFx0dGhpcy5iaW5kT3RoZXIoKTtcblx0fVxuXG5cdHByb3RlY3RlZCBiaW5kU2VsZWN0KCkge1xuXHRcdHN1cGVyLmJpbmRTZWxlY3QoKTtcblx0XHR0aGlzLmJpbmRPdGhlcigpO1xuXHR9XG5cblx0cHJvdGVjdGVkIGJpbmRUZXh0YXJlYSgpIHtcblx0XHRzdXBlci5iaW5kVGV4dGFyZWEoKTtcblx0XHR0aGlzLmJpbmRPdGhlcigpO1xuXHR9XG5cblx0cHJvdGVjdGVkIGJpbmRPdGhlcigpIHtcblx0XHR0aGlzLndhdGNoKHRoaXMudmFsdWUpO1xuXHR9XG5cblx0cHVibGljIHVwZGF0ZSgpIHtcblx0XHRsZXQgdmFsID0gdGhpcy5ldmFsKHRoaXMudmFsdWUpO1xuXHRcdFxuXHRcdGlmKHRoaXMuZWxlbWVudC5oYXNBdHRyaWJ1dGUoJ3ZhbHVlJykpXG5cdFx0XHQoPGFueT50aGlzLmVsZW1lbnQpLnZhbHVlID0gdmFsO1xuXHRcdGVsc2Vcblx0XHRcdHRoaXMuZWxlbWVudC5pbm5lckhUTUwgPSB2YWw7XG5cdH1cblxufVxuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9