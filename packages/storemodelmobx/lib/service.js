"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Service = void 0;
var axios_1 = __importDefault(require("axios"));
var Service = /** @class */ (function () {
    function Service() {
    }
    Service.get = function (url, headers) {
        if (headers === void 0) { headers = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var d, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.ajax.get(url, { headers: headers })];
                    case 1:
                        d = _a.sent();
                        d = d.data;
                        return [3 /*break*/, 3];
                    case 2:
                        e_1 = _a.sent();
                        d = { error: e_1 };
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/, d];
                }
            });
        });
    };
    Service.post = function (url, data, headers, many) {
        if (data === void 0) { data = {}; }
        if (headers === void 0) { headers = {}; }
        if (many === void 0) { many = false; }
        return __awaiter(this, void 0, void 0, function () {
            var d, e_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.ajax.post(url + (many ? '/bulk' : ''), data, { headers: headers })];
                    case 1:
                        d = _a.sent();
                        d = d.data;
                        return [3 /*break*/, 3];
                    case 2:
                        e_2 = _a.sent();
                        d = { error: e_2 };
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/, d];
                }
            });
        });
    };
    Service.update = function (url, data, headers) {
        if (headers === void 0) { headers = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var d, e_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.ajax.patch(url + "/" + data.id, data, { headers: headers })];
                    case 1:
                        d = _a.sent();
                        d = d.data;
                        return [3 /*break*/, 3];
                    case 2:
                        e_3 = _a.sent();
                        d = { error: e_3 };
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/, d];
                }
            });
        });
    };
    Service.delete = function (url, id, headers) {
        if (headers === void 0) { headers = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var d, e_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.ajax.delete(url + "/" + id, { headers: headers })];
                    case 1:
                        d = _a.sent();
                        d = { id: id };
                        return [3 /*break*/, 3];
                    case 2:
                        e_4 = _a.sent();
                        d = { error: e_4 };
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/, d];
                }
            });
        });
    };
    Service.setBaseUrl = function (url) {
        this.ajax.defaults.baseURL = url;
        this.baseUrl = url;
    };
    Service.setBearerToken = function (token) {
        this.ajax.defaults.headers.common.Authorization = 'Bearer ' + token;
    };
    Service.isLoggedIn = false;
    Service.baseUrl = '';
    Service.ajax = axios_1.default.create();
    return Service;
}());
exports.Service = Service;
Service.ajax.defaults.timeout = 2500;
//# sourceMappingURL=service.js.map