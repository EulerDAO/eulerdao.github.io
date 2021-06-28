"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Problem =
/*#__PURE__*/
function () {
  function Problem() {
    _classCallCheck(this, Problem);

    this.args = new URLSearchParams(window.location.search);
    document.getElementById('content').src = "/problems/".concat(this.args.get('id'));
    document.getElementById('submit').href = "/submit?id=".concat(this.args.get('id'));
  }

  _createClass(Problem, [{
    key: "resize",
    value: function resize() {
      var obj = document.getElementById('content');
      obj.style.height = obj.contentWindow.document.documentElement.scrollHeight + 'px';
    }
  }]);

  return Problem;
}();

window.addEventListener('load', function () {
  window.problem = new Problem();
});