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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImF0dHJpYnV0ZXMvYmluZC9iaW5kLnRzIl0sIm5hbWVzIjpbIkJpbmQiLCJCaW5kLmNvbnN0cnVjdG9yIiwiQmluZC5pbml0IiwiQmluZC5iaW5kSW5wdXQiLCJCaW5kLmJpbmRTZWxlY3QiLCJCaW5kLmJpbmRUZXh0YXJlYSIsIkJpbmQuYmluZE90aGVyIl0sIm1hcHBpbmdzIjoiQUFBQSx1RkFBdUY7Ozs7Ozs7QUFFdkY7SUFBbUJBLHdCQUE0QkE7SUFBL0NBO1FBQW1CQyw4QkFBNEJBO0lBd0MvQ0EsQ0FBQ0E7SUF0Q0FELG1CQUFJQSxHQUFKQTtRQUNDRSxNQUFNQSxDQUFBQSxDQUFDQSxJQUFJQSxDQUFDQSxPQUFPQSxDQUFDQSxPQUFPQSxDQUFDQSxXQUFXQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQTtZQUMzQ0EsS0FBS0EsT0FBT0E7Z0JBQ1hBLElBQUlBLENBQUNBLFNBQVNBLEVBQUVBLENBQUNBO2dCQUNqQkEsS0FBS0EsQ0FBQ0E7WUFDUEEsS0FBS0EsUUFBUUE7Z0JBQ1pBLElBQUlBLENBQUNBLFVBQVVBLEVBQUVBLENBQUNBO2dCQUNsQkEsS0FBS0EsQ0FBQ0E7WUFDUEEsS0FBS0EsVUFBVUE7Z0JBQ2RBLElBQUlBLENBQUNBLFlBQVlBLEVBQUVBLENBQUNBO2dCQUNwQkEsS0FBS0EsQ0FBQ0E7WUFDUEE7Z0JBQ0NBLElBQUlBLENBQUNBLFNBQVNBLEVBQUVBLENBQUNBO1FBQ25CQSxDQUFDQTtJQUNGQSxDQUFDQTtJQUVTRix3QkFBU0EsR0FBbkJBO1FBQUFHLGlCQUlDQTtRQUhBQSxJQUFJQSxDQUFDQSxPQUFPQSxDQUFDQSxPQUFPQSxHQUFHQSxVQUFBQSxDQUFDQTtZQUN2QkEsS0FBSUEsQ0FBQ0EsSUFBSUEsQ0FBSUEsS0FBSUEsQ0FBQ0EsS0FBS0EsWUFBMEJBLEtBQUlBLENBQUNBLE9BQVFBLENBQUNBLEtBQUtBLE1BQUdBLENBQUNBLENBQUNBO1FBQzFFQSxDQUFDQSxDQUFBQTtJQUNGQSxDQUFDQTtJQUVTSCx5QkFBVUEsR0FBcEJBO1FBQUFJLGlCQUlDQTtRQUhBQSxJQUFJQSxDQUFDQSxPQUFPQSxDQUFDQSxRQUFRQSxHQUFHQSxVQUFBQSxDQUFDQTtZQUN4QkEsS0FBSUEsQ0FBQ0EsSUFBSUEsQ0FBSUEsS0FBSUEsQ0FBQ0EsS0FBS0EsWUFBMkJBLEtBQUlBLENBQUNBLE9BQVFBLENBQUNBLEtBQUtBLE1BQUdBLENBQUNBLENBQUNBO1FBQzNFQSxDQUFDQSxDQUFBQTtJQUNGQSxDQUFDQTtJQUVTSiwyQkFBWUEsR0FBdEJBO1FBQUFLLGlCQUlDQTtRQUhBQSxJQUFJQSxDQUFDQSxPQUFPQSxDQUFDQSxPQUFPQSxHQUFHQSxVQUFBQSxDQUFDQTtZQUN2QkEsS0FBSUEsQ0FBQ0EsSUFBSUEsQ0FBSUEsS0FBSUEsQ0FBQ0EsS0FBS0EsWUFBNkJBLEtBQUlBLENBQUNBLE9BQVFBLENBQUNBLEtBQUtBLE1BQUdBLENBQUNBLENBQUNBO1FBQzdFQSxDQUFDQSxDQUFBQTtJQUNGQSxDQUFDQTtJQUVTTCx3QkFBU0EsR0FBbkJBO1FBQ0NNLE1BQU1BLCtCQUE2QkEsSUFBSUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsT0FBU0EsQ0FBQ0E7SUFDM0RBLENBQUNBO0lBRUZOLFdBQUNBO0FBQURBLENBeENBLEFBd0NDQSxFQXhDa0IsRUFBRSxDQUFDLFVBQVUsQ0FBQyxjQUFjLEVBd0M5QyIsImZpbGUiOiJhdHRyaWJ1dGVzL2JpbmQvYmluZC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi8uLi8uLi8uLi9ib3dlcl9jb21wb25lbnRzL2hvLWNvbXBvbmVudHMvZGlzdC9jb21wb25lbnRzLmQudHNcIi8+XHJcblxyXG5jbGFzcyBCaW5kIGV4dGVuZHMgaG8uY29tcG9uZW50cy5XYXRjaEF0dHJpYnV0ZSB7XHJcblxyXG5cdGluaXQoKSB7XHJcblx0XHRzd2l0Y2godGhpcy5lbGVtZW50LnRhZ05hbWUudG9VcHBlckNhc2UoKSkge1xyXG5cdFx0XHRjYXNlICdJTlBVVCc6XHJcblx0XHRcdFx0dGhpcy5iaW5kSW5wdXQoKTtcclxuXHRcdFx0XHRicmVhaztcclxuXHRcdFx0Y2FzZSAnU0VMRUNUJzpcclxuXHRcdFx0XHR0aGlzLmJpbmRTZWxlY3QoKTtcclxuXHRcdFx0XHRicmVhaztcclxuXHRcdFx0Y2FzZSAnVEVYVEFSRUEnOlxyXG5cdFx0XHRcdHRoaXMuYmluZFRleHRhcmVhKCk7XHJcblx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdGRlZmF1bHQ6XHJcblx0XHRcdFx0dGhpcy5iaW5kT3RoZXIoKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHByb3RlY3RlZCBiaW5kSW5wdXQoKSB7XHJcblx0XHR0aGlzLmVsZW1lbnQub25rZXl1cCA9IGUgPT4ge1xyXG5cdFx0XHR0aGlzLmV2YWwoYCR7dGhpcy52YWx1ZX0gPSAnJHsoPEhUTUxJbnB1dEVsZW1lbnQ+dGhpcy5lbGVtZW50KS52YWx1ZX0nYCk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRwcm90ZWN0ZWQgYmluZFNlbGVjdCgpIHtcclxuXHRcdHRoaXMuZWxlbWVudC5vbmNoYW5nZSA9IGUgPT4ge1xyXG5cdFx0XHR0aGlzLmV2YWwoYCR7dGhpcy52YWx1ZX0gPSAnJHsoPEhUTUxTZWxlY3RFbGVtZW50PnRoaXMuZWxlbWVudCkudmFsdWV9J2ApO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0cHJvdGVjdGVkIGJpbmRUZXh0YXJlYSgpIHtcclxuXHRcdHRoaXMuZWxlbWVudC5vbmtleXVwID0gZSA9PiB7XHJcblx0XHRcdHRoaXMuZXZhbChgJHt0aGlzLnZhbHVlfSA9ICckeyg8SFRNTFRleHRBcmVhRWxlbWVudD50aGlzLmVsZW1lbnQpLnZhbHVlfSdgKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHByb3RlY3RlZCBiaW5kT3RoZXIoKSB7XHJcblx0XHR0aHJvdyBgQmluZDogdW5zdXBwb3J0ZWQgZWxlbWVudCAke3RoaXMuZWxlbWVudC50YWdOYW1lfWA7XHJcblx0fVxyXG5cclxufVxyXG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=