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
  
  const data = {
    userNameOrEmailAddress: userName,
    password,
    rememberMe:true
  }
  return _api["default"].request({
    url: 'api/account/login',
    data,
    method: 'post',
    headers: {
      'Accept-Language': 'zh-Hans'
    }
  });
};

exports.login = login;