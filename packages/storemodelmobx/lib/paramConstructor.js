'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.ParamConstructor = void 0;
exports.ParamConstructor = {
  join: function (str) {
    if (typeof str === 'object') return 'join=' + str.join('&join=');
    return 'join=' + str;
  },
  limit: function (str) {
    return 'limit=' + str;
  },
  sort: function (str) {
    return 'sort=' + str;
  },
  filter: function (str) {
    return 'filter=' + JSON.stringify(str).replace(/"/g, '');
  },
  s: function (str) {
    return 's=' + JSON.stringify(str);
  },
};
//# sourceMappingURL=paramConstructor.js.map
