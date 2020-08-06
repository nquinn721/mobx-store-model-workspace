"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Model = void 0;
var mobx_1 = require("mobx");
var service_1 = require("./service");
var paramConstructor_1 = require("./paramConstructor");
var Model = /** @class */ (function () {
    function Model() {
        this.id = 0;
        this.route = '';
        this.original = {};
        this.propsToDeleteForSave = ['original', 'getParams', 'route'];
        this.editable = false;
        this.saved = false;
    }
    Model.prototype.init = function (data) {
        Object.assign(this, data);
        this.original = Object.assign({}, mobx_1.toJS(this));
    };
    Model.prototype.convertForSave = function (data) {
        if (data === void 0) { data = {}; }
        if (!data)
            data = {};
        var obj = Object.assign({}, this, data);
        // clean up obj for server
        for (var i in obj)
            if (typeof obj[i] === 'undefined' || this.propsToDeleteForSave.includes(i))
                delete obj[i];
        delete obj.propsToDeleteForSave;
        this.original = Object.assign({}, mobx_1.toJS(this, { recurseEverything: true }));
        return obj;
    };
    Model.prototype.convertFromLoad = function () {
        this.getDataFromStores();
    };
    Model.prototype.reset = function () {
        var model = this;
        for (var i in this.original)
            if (i !== 'original')
                model[i] = this.original[i];
    };
    Model.prototype.save = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (this.id)
                    this.update();
                else
                    this.create();
                return [2 /*return*/];
            });
        });
    };
    Model.prototype.create = function () {
        return __awaiter(this, void 0, void 0, function () {
            var d;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.route)
                            throw new Error('no route defined for model');
                        return [4 /*yield*/, service_1.Service.post(this.route, this.convertForSave())];
                    case 1:
                        d = _a.sent();
                        this.init(d);
                        this.convertFromLoad();
                        return [2 /*return*/];
                }
            });
        });
    };
    Model.prototype.update = function () {
        return __awaiter(this, void 0, void 0, function () {
            var d;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.route)
                            throw new Error('no route defined for model');
                        return [4 /*yield*/, service_1.Service.update(this.route, this.convertForSave())];
                    case 1:
                        d = _a.sent();
                        this.init(d);
                        this.convertFromLoad();
                        return [2 /*return*/];
                }
            });
        });
    };
    Model.prototype.delete = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.route)
                            throw new Error('no route defined for model');
                        return [4 /*yield*/, service_1.Service.delete(this.route, this.id)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Model.prototype.refresh = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, service_1.Service.get(this.route + "/" + this.id + this.constructGetParams(this.getParams))];
                    case 1:
                        _a.sent();
                        this.convertFromLoad();
                        return [2 /*return*/];
                }
            });
        });
    };
    Model.prototype.constructGetParams = function (obj) {
        var str = '';
        for (var i in obj)
            str += paramConstructor_1.ParamConstructor[i](obj[i]) + '&';
        str = str.substr(0, str.length - 1);
        return str ? "?" + str : '';
    };
    Model.prototype.getDataFromStores = function () { };
    __decorate([
        mobx_1.observable
    ], Model.prototype, "editable", void 0);
    __decorate([
        mobx_1.observable
    ], Model.prototype, "saved", void 0);
    return Model;
}());
exports.Model = Model;
//# sourceMappingURL=base.model.js.map