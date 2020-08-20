"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Store = void 0;
var service_1 = require("./service");
var mobx_1 = require("mobx");
var pluralize_1 = __importDefault(require("pluralize"));
var EventEmitter_1 = require("./EventEmitter");
var Store = /** @class */ (function (_super) {
    __extends(Store, _super);
    function Store(model) {
        var _this = _super.call(this) || this;
        _this.route = '';
        _this.waitingToSave = [];
        _this.logging = false;
        _this.name = '';
        // DATA
        _this.objects = [];
        // LIFECYCLE
        _this.hydrated = false; // Hydrate from localstorage
        _this.initLoaded = false; // Load from server
        _this.ready = false; // Load and Hydrate are done
        // CRUD
        _this.fetchingData = false;
        _this.fetchFailed = false;
        _this.fetchSuccess = false;
        _this.defaultFetchFailedMessage = 'Failed to load ';
        _this.savingData = false;
        _this.saveSuccess = false;
        _this.saveFailed = false;
        _this.deletingData = false;
        _this.deleteSuccess = false;
        _this.deleteFailed = false;
        _this.deleteFailedMessage = '';
        _this.deleteTimer = false;
        _this.originalModel = model;
        _this.model = new model({});
        _this.current = new model({});
        if (_this.model.route) {
            _this.route = _this.model.route;
            _this.defaultFetchFailedMessage += pluralize_1.default(_this.route.replace(/\W/g, ' '));
        }
        else
            throw new Error("No route defined for model '" + model.name + "'");
        if (_this.model.getParams)
            _this.getParams = _this.model.getParams;
        return _this;
    }
    Store.prototype.refreshData = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.initLoad()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Store.prototype.retrySave = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                this.waitingToSave.forEach(function (v, i) {
                    if (v.type === 'create')
                        _this.create(v.data);
                    else
                        _this.update(v.data);
                });
                this.waitingToSave = [];
                return [2 /*return*/];
            });
        });
    };
    Store.prototype.initLoad = function () {
        return __awaiter(this, void 0, void 0, function () {
            var o;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getData()];
                    case 1:
                        o = _a.sent();
                        if (!o.error)
                            this.objects = o;
                        this.initLoaded = true;
                        this.afterLoad();
                        this.checkIsLoaded();
                        return [2 /*return*/];
                }
            });
        });
    };
    Store.prototype.setHydrated = function () {
        this.hydrated = true;
        this.afterHydrate();
        this.checkIsLoaded();
    };
    Store.prototype.checkIsLoaded = function () {
        if (this.hydrated && this.initLoaded) {
            this.ready = true;
            this.isReady();
        }
    };
    Store.prototype.afterLoad = function () {
        this.emit('after load');
    };
    Store.prototype.isReady = function () {
        this.emit('ready');
    };
    Store.prototype.afterHydrate = function () {
        this.emit('after hydrate');
    };
    Store.prototype.getData = function (url) {
        if (url === void 0) { url = ''; }
        return __awaiter(this, void 0, void 0, function () {
            var data;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.fetchFailed = false;
                        this.fetchingData = true;
                        this.fetchSuccess = false;
                        return [4 /*yield*/, service_1.Service.get(url || this.route + this.model.constructGetParams(this.getParams))];
                    case 1:
                        data = _a.sent();
                        mobx_1.runInAction(function () {
                            if (!data.error) {
                                data = data.map(function (v) {
                                    var m = new _this.originalModel(_this.cleanObject(v));
                                    m.convertFromLoad();
                                    return m;
                                });
                                _this.fetchSuccess = true;
                            }
                            else
                                _this.fetchFailed = true;
                            _this.fetchingData = false;
                        });
                        return [2 /*return*/, data];
                }
            });
        });
    };
    Store.prototype.create = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var m, d;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.savingData = true;
                        if (!this.waitingToSave.length)
                            this.saveFailed = false;
                        if (data.convertForSave)
                            data = data.convertForSave();
                        return [4 /*yield*/, service_1.Service.post(this.route, data)];
                    case 1:
                        d = _a.sent();
                        if (!d.error) {
                            m = new this.originalModel(d);
                            m.convertFromLoad();
                            this.addObject(m);
                            this.setSaveSuccess();
                        }
                        else
                            this.setSaveFailed({ type: 'create', data: data });
                        this.savingData = false;
                        return [2 /*return*/, m || d];
                }
            });
        });
    };
    Store.prototype.update = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var d;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.savingData = true;
                        if (!this.waitingToSave.length)
                            this.saveFailed = false;
                        data = data.convertForSave();
                        return [4 /*yield*/, service_1.Service.update(this.route, mobx_1.toJS(data, { recurseEverything: true }))];
                    case 1:
                        d = _a.sent();
                        if (!d.error)
                            this.setSaveSuccess();
                        else
                            this.setSaveFailed({ type: 'update', data: data });
                        this.savingData = false;
                        return [2 /*return*/, d];
                }
            });
        });
    };
    Store.prototype.delete = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var d;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.deleteFailed = false;
                        this.deleteSuccess = false;
                        this.deletingData = true;
                        this.deleteFailedMessage = '';
                        clearInterval(this.deleteTimer);
                        return [4 /*yield*/, service_1.Service.delete(this.route, id)];
                    case 1:
                        d = _a.sent();
                        this.deletingData = false;
                        if (!d.error) {
                            this.deleteSuccess = true;
                            this.deleteTimer = setTimeout(function () {
                                _this.deleteSuccess = false;
                            }, 3000);
                            this.removeObject(d);
                        }
                        else {
                            this.deleteFailed = true;
                            this.deleteFailedMessage = 'Failed to delete';
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    // ACTIONS ON THE CURRENT OBJECT
    Store.prototype.saveCurrent = function (dontReset) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.current.id) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.updateCurrent(dontReset)];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2: return [4 /*yield*/, this.createCurrent(dontReset)];
                    case 3: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    Store.prototype.createCurrent = function (dontReset) {
        return __awaiter(this, void 0, void 0, function () {
            var d;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.create(this.current)];
                    case 1:
                        d = _a.sent();
                        if (!d.error) {
                            this.addObject(d);
                            if (dontReset !== false)
                                this.resetCurrent();
                        }
                        return [2 /*return*/, d];
                }
            });
        });
    };
    Store.prototype.updateCurrent = function (dontReset) {
        return __awaiter(this, void 0, void 0, function () {
            var d;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.update(this.current)];
                    case 1:
                        d = _a.sent();
                        if (!d.error) {
                            this.addObject(d);
                            if (dontReset !== false)
                                this.resetCurrent();
                        }
                        return [2 /*return*/, d];
                }
            });
        });
    };
    Store.prototype.deleteCurrent = function () {
        return __awaiter(this, void 0, void 0, function () {
            var d;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.delete(this.current.id)];
                    case 1:
                        d = _a.sent();
                        this.resetCurrent();
                        return [2 /*return*/, d];
                }
            });
        });
    };
    Store.prototype.resetCurrent = function () {
        this.current.reset();
        this.current = new this.originalModel();
    };
    Store.prototype.setCurrent = function (item) {
        if (item === void 0) { item = {}; }
        this.current = new this.originalModel(item);
        this.current.convertFromLoad();
    };
    // END ACTIONS ON CURRENT
    Store.prototype.setSaveSuccess = function () {
        var _this = this;
        this.saveSuccess = true;
        setTimeout(function () { return (_this.saveSuccess = false); }, 3000);
    };
    Store.prototype.setSaveFailed = function (obj) {
        var _this = this;
        this.waitingToSave.push(obj);
        this.saveFailed = true;
        setTimeout(function () { return (_this.saveFailed = false); }, 3000);
    };
    // GETTERS
    Store.prototype.find = function (obj) {
        return this.objects.filter(function (v) { return Object.keys(obj).filter(function (a) { return v[a] === obj[a]; }).length; });
    };
    Store.prototype.getById = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var p;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        p = this.objects.find(function (v) { return v.id === id; });
                        if (!!p) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.getData(this.route + ("?s={\"id\": " + id + "}"))];
                    case 1:
                        p = _a.sent();
                        p = p[0];
                        if (p && !this.objects.find(function (v) { return v.id === p.id; }))
                            this.objects.push(p);
                        _a.label = 2;
                    case 2: return [2 /*return*/, p];
                }
            });
        });
    };
    Store.prototype.getByIdSync = function (id) {
        return this.objects.find(function (v) { return v.id === id; });
    };
    Store.prototype.getMultipleById = function (ids) {
        ids = typeof ids[0] === 'number' ? ids : ids.map(function (v) { return v.id; });
        return this.objects.filter(function (v) { return ids.includes(v.id); });
    };
    Store.prototype.search = function (obj) {
        return __awaiter(this, void 0, void 0, function () {
            var str, searchParams, ids, i;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        str = "?s=";
                        searchParams = {};
                        ids = this.objects.map(function (v) { return v.id; });
                        for (i in obj)
                            searchParams[i] = { $contL: obj[i] };
                        searchParams.id = { $notin: ids };
                        str += JSON.stringify(searchParams);
                        return [4 /*yield*/, this.getData(this.route + str)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    // END GETTERS
    // UTILS
    Store.prototype.cleanObject = function (obj) {
        for (var propName in obj) {
            if (obj[propName] === null || obj[propName] === undefined) {
                delete obj[propName];
            }
        }
        return obj;
    };
    Store.prototype.addObject = function (obj) {
        if (this.objects.map(function (v) { return v.id; }).indexOf(obj.id) < 0)
            this.objects.push(obj);
        else {
            var o = this.objects.find(function (a) { return a.id === obj.id; });
            Object.assign(o, obj);
        }
    };
    Store.prototype.removeObject = function (obj) {
        this.objects = this.objects.filter(function (v) { return v.id !== obj.id; });
    };
    __decorate([
        mobx_1.observable
    ], Store.prototype, "objects", void 0);
    __decorate([
        mobx_1.observable
    ], Store.prototype, "current", void 0);
    __decorate([
        mobx_1.observable
    ], Store.prototype, "hydrated", void 0);
    __decorate([
        mobx_1.observable
    ], Store.prototype, "initLoaded", void 0);
    __decorate([
        mobx_1.observable
    ], Store.prototype, "ready", void 0);
    __decorate([
        mobx_1.observable
    ], Store.prototype, "fetchingData", void 0);
    __decorate([
        mobx_1.observable
    ], Store.prototype, "fetchFailed", void 0);
    __decorate([
        mobx_1.observable
    ], Store.prototype, "fetchSuccess", void 0);
    __decorate([
        mobx_1.observable
    ], Store.prototype, "savingData", void 0);
    __decorate([
        mobx_1.observable
    ], Store.prototype, "saveSuccess", void 0);
    __decorate([
        mobx_1.observable
    ], Store.prototype, "saveFailed", void 0);
    __decorate([
        mobx_1.observable
    ], Store.prototype, "deletingData", void 0);
    __decorate([
        mobx_1.observable
    ], Store.prototype, "deleteSuccess", void 0);
    __decorate([
        mobx_1.observable
    ], Store.prototype, "deleteFailed", void 0);
    __decorate([
        mobx_1.action
    ], Store.prototype, "refreshData", null);
    __decorate([
        mobx_1.action
    ], Store.prototype, "retrySave", null);
    __decorate([
        mobx_1.action.bound
    ], Store.prototype, "initLoad", null);
    __decorate([
        mobx_1.action.bound
    ], Store.prototype, "setHydrated", null);
    __decorate([
        mobx_1.action
    ], Store.prototype, "checkIsLoaded", null);
    __decorate([
        mobx_1.action
    ], Store.prototype, "getData", null);
    __decorate([
        mobx_1.action
    ], Store.prototype, "create", null);
    __decorate([
        mobx_1.action
    ], Store.prototype, "update", null);
    __decorate([
        mobx_1.action
    ], Store.prototype, "delete", null);
    __decorate([
        mobx_1.action.bound
    ], Store.prototype, "saveCurrent", null);
    __decorate([
        mobx_1.action.bound
    ], Store.prototype, "createCurrent", null);
    __decorate([
        mobx_1.action.bound
    ], Store.prototype, "updateCurrent", null);
    __decorate([
        mobx_1.action.bound
    ], Store.prototype, "deleteCurrent", null);
    __decorate([
        mobx_1.action.bound
    ], Store.prototype, "resetCurrent", null);
    __decorate([
        mobx_1.action.bound
    ], Store.prototype, "setCurrent", null);
    __decorate([
        mobx_1.action
    ], Store.prototype, "setSaveSuccess", null);
    __decorate([
        mobx_1.action
    ], Store.prototype, "setSaveFailed", null);
    __decorate([
        mobx_1.action.bound
    ], Store.prototype, "getById", null);
    __decorate([
        mobx_1.action
    ], Store.prototype, "search", null);
    __decorate([
        mobx_1.action.bound
    ], Store.prototype, "addObject", null);
    __decorate([
        mobx_1.action.bound
    ], Store.prototype, "removeObject", null);
    return Store;
}(EventEmitter_1.EventEmitter));
exports.Store = Store;
//# sourceMappingURL=base.mobx.js.map