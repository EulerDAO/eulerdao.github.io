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
  }

  _createClass(Problem, [{
    key: "resize",
    value: function resize() {
      var obj = document.getElementById('content');
      obj.style.height = obj.contentWindow.document.documentElement.scrollHeight + 'px';
    }
  }, {
    key: "submit",
    value: function submit() {
      var pool, signer, bytecode, digest, abi, contract;
      return regeneratorRuntime.async(function submit$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              pool = '0x64f4FD397E2Ca009912ef7C53219eAB4D7A74157'; //todo

              signer = window.wallet.signer;

              if (!(signer === null)) {
                _context.next = 5;
                break;
              }

              alert("Connect wallect first!");
              return _context.abrupt("return");

            case 5:
              bytecode = document.getElementById('code').value;

              if (!bytecode.startsWith('0x')) {
                document.getElementById('code').value = '0x' + document.getElementById('code').value;
                bytecode = document.getElementById('code').value;
              }

              try {
                digest = window.ethers.utils.keccak256(bytecode);
              } catch (_unused) {
                alert('invald bytecode');
              }

              abi = ['function lock_challenge(uint256 id) public payable'];
              contract = new window.ethers.Contract(pool, abi, signer);
              _context.next = 12;
              return regeneratorRuntime.awrap(contract.lock_challenge(digest));

            case 12:
            case "end":
              return _context.stop();
          }
        }
      });
    }
  }]);

  return Problem;
}();

window.addEventListener('load', function () {
  window.problem = new Problem();
});