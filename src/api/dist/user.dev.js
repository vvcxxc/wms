"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.login = void 0;

var _api = _interopRequireDefault(require("@/libs/api.request"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var login = function login(userName, password) {
  // const data = {
  //   userName,
  //   password
  // }
  return _api["default"].request({
    url: 'Login/CheckLog2?usercode=' + userName + '&&password=' + password,
    method: 'post'
  });
};

exports.login = login;