/// <reference path="../../../../bower_components/ho-components/dist/components.d.ts"/>
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Bind = (function (_super) {
    __extends(Bind, _super);
    function Bind() {
        _super.apply(this, arguments);
    }
    Bind.prototype.init = function () {
        switch (this.element.tagName.toUpperCase()) {
            case 'INPUT':
                this.bindInput();
                break;
            case 'SELECT':
                this.bindSelect();
                break;
            case 'TEXTAREA':
                this.bindTextarea();
                break;
            default:
                this.bindOther();
        }
    };
    Bind.prototype.bindInput = function () {
        var _this = this;
        this.element.onkeyup = function (e) {
            _this.eval(_this.value + " = '" + _this.element.value + "'");
        };
    };
    Bind.prototype.bindSelect = function () {
        var _this = this;
        this.element.onchange = function (e) {
            _this.eval(_this.value + " = '" + _this.element.value + "'");
        };
    };
    Bind.prototype.bindTextarea = function () {
        var _this = this;
        this.element.onkeyup = function (e) {
            _this.eval(_this.value + " = '" + _this.element.value + "'");
        };
    };
    Bind.prototype.bindOther = function () {
        throw "Bind: unsupported element " + this.element.tagName;
    };
    return Bind;
})(ho.components.WatchAttribute);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImF0dHJpYnV0ZXMvYmluZC9iaW5kLnRzIl0sIm5hbWVzIjpbIkJpbmQiLCJCaW5kLmNvbnN0cnVjdG9yIiwiQmluZC5pbml0IiwiQmluZC5iaW5kSW5wdXQiLCJCaW5kLmJpbmRTZWxlY3QiLCJCaW5kLmJpbmRUZXh0YXJlYSIsIkJpbmQuYmluZE90aGVyIl0sIm1hcHBpbmdzIjoiQUFBQSx1RkFBdUY7Ozs7Ozs7QUFFdkY7SUFBbUJBLHdCQUE0QkE7SUFBL0NBO1FBQW1CQyw4QkFBNEJBO0lBd0MvQ0EsQ0FBQ0E7SUF0Q0FELG1CQUFJQSxHQUFKQTtRQUNDRSxNQUFNQSxDQUFBQSxDQUFDQSxJQUFJQSxDQUFDQSxPQUFPQSxDQUFDQSxPQUFPQSxDQUFDQSxXQUFXQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQTtZQUMzQ0EsS0FBS0EsT0FBT0E7Z0JBQ1hBLElBQUlBLENBQUNBLFNBQVNBLEVBQUVBLENBQUNBO2dCQUNqQkEsS0FBS0EsQ0FBQ0E7WUFDUEEsS0FBS0EsUUFBUUE7Z0JBQ1pBLElBQUlBLENBQUNBLFVBQVVBLEVBQUVBLENBQUNBO2dCQUNsQkEsS0FBS0EsQ0FBQ0E7WUFDUEEsS0FBS0EsVUFBVUE7Z0JBQ2RBLElBQUlBLENBQUNBLFlBQVlBLEVBQUVBLENBQUNBO2dCQUNwQkEsS0FBS0EsQ0FBQ0E7WUFDUEE7Z0JBQ0NBLElBQUlBLENBQUNBLFNBQVNBLEVBQUVBLENBQUNBO1FBQ25CQSxDQUFDQTtJQUNGQSxDQUFDQTtJQUVTRix3QkFBU0EsR0FBbkJBO1FBQUFHLGlCQUlDQTtRQUhBQSxJQUFJQSxDQUFDQSxPQUFPQSxDQUFDQSxPQUFPQSxHQUFHQSxVQUFBQSxDQUFDQTtZQUN2QkEsS0FBSUEsQ0FBQ0EsSUFBSUEsQ0FBSUEsS0FBSUEsQ0FBQ0EsS0FBS0EsWUFBMEJBLEtBQUlBLENBQUNBLE9BQVFBLENBQUNBLEtBQUtBLE1BQUdBLENBQUNBLENBQUNBO1FBQzFFQSxDQUFDQSxDQUFBQTtJQUNGQSxDQUFDQTtJQUVTSCx5QkFBVUEsR0FBcEJBO1FBQUFJLGlCQUlDQTtRQUhBQSxJQUFJQSxDQUFDQSxPQUFPQSxDQUFDQSxRQUFRQSxHQUFHQSxVQUFBQSxDQUFDQTtZQUN4QkEsS0FBSUEsQ0FBQ0EsSUFBSUEsQ0FBSUEsS0FBSUEsQ0FBQ0EsS0FBS0EsWUFBMkJBLEtBQUlBLENBQUNBLE9BQVFBLENBQUNBLEtBQUtBLE1BQUdBLENBQUNBLENBQUNBO1FBQzNFQSxDQUFDQSxDQUFBQTtJQUNGQSxDQUFDQTtJQUVTSiwyQkFBWUEsR0FBdEJBO1FBQUFLLGlCQUlDQTtRQUhBQSxJQUFJQSxDQUFDQSxPQUFPQSxDQUFDQSxPQUFPQSxHQUFHQSxVQUFBQSxDQUFDQTtZQUN2QkEsS0FBSUEsQ0FBQ0EsSUFBSUEsQ0FBSUEsS0FBSUEsQ0FBQ0EsS0FBS0EsWUFBMEJBLEtBQUlBLENBQUNBLE9BQVFBLENBQUNBLEtBQUtBLE1BQUdBLENBQUNBLENBQUNBO1FBQzFFQSxDQUFDQSxDQUFBQTtJQUNGQSxDQUFDQTtJQUVTTCx3QkFBU0EsR0FBbkJBO1FBQ0NNLE1BQU1BLCtCQUE2QkEsSUFBSUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsT0FBU0EsQ0FBQ0E7SUFDM0RBLENBQUNBO0lBRUZOLFdBQUNBO0FBQURBLENBeENBLEFBd0NDQSxFQXhDa0IsRUFBRSxDQUFDLFVBQVUsQ0FBQyxjQUFjLEVBd0M5QyIsImZpbGUiOiJhdHRyaWJ1dGVzL2JpbmQvYmluZC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi8uLi8uLi8uLi9ib3dlcl9jb21wb25lbnRzL2hvLWNvbXBvbmVudHMvZGlzdC9jb21wb25lbnRzLmQudHNcIi8+XG5cbmNsYXNzIEJpbmQgZXh0ZW5kcyBoby5jb21wb25lbnRzLldhdGNoQXR0cmlidXRlIHtcblxuXHRpbml0KCkge1xuXHRcdHN3aXRjaCh0aGlzLmVsZW1lbnQudGFnTmFtZS50b1VwcGVyQ2FzZSgpKSB7XG5cdFx0XHRjYXNlICdJTlBVVCc6XG5cdFx0XHRcdHRoaXMuYmluZElucHV0KCk7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSAnU0VMRUNUJzpcblx0XHRcdFx0dGhpcy5iaW5kU2VsZWN0KCk7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSAnVEVYVEFSRUEnOlxuXHRcdFx0XHR0aGlzLmJpbmRUZXh0YXJlYSgpO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdHRoaXMuYmluZE90aGVyKCk7XG5cdFx0fVxuXHR9XG5cblx0cHJvdGVjdGVkIGJpbmRJbnB1dCgpIHtcblx0XHR0aGlzLmVsZW1lbnQub25rZXl1cCA9IGUgPT4ge1xuXHRcdFx0dGhpcy5ldmFsKGAke3RoaXMudmFsdWV9ID0gJyR7KDxIVE1MSW5wdXRFbGVtZW50PnRoaXMuZWxlbWVudCkudmFsdWV9J2ApO1xuXHRcdH1cblx0fVxuXG5cdHByb3RlY3RlZCBiaW5kU2VsZWN0KCkge1xuXHRcdHRoaXMuZWxlbWVudC5vbmNoYW5nZSA9IGUgPT4ge1xuXHRcdFx0dGhpcy5ldmFsKGAke3RoaXMudmFsdWV9ID0gJyR7KDxIVE1MU2VsZWN0RWxlbWVudD50aGlzLmVsZW1lbnQpLnZhbHVlfSdgKTtcblx0XHR9XG5cdH1cblxuXHRwcm90ZWN0ZWQgYmluZFRleHRhcmVhKCkge1xuXHRcdHRoaXMuZWxlbWVudC5vbmtleXVwID0gZSA9PiB7XG5cdFx0XHR0aGlzLmV2YWwoYCR7dGhpcy52YWx1ZX0gPSAnJHsoPEhUTUxJbnB1dEVsZW1lbnQ+dGhpcy5lbGVtZW50KS52YWx1ZX0nYCk7XG5cdFx0fVxuXHR9XG5cblx0cHJvdGVjdGVkIGJpbmRPdGhlcigpIHtcblx0XHR0aHJvdyBgQmluZDogdW5zdXBwb3J0ZWQgZWxlbWVudCAke3RoaXMuZWxlbWVudC50YWdOYW1lfWA7XG5cdH1cblxufVxuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9