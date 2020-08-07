"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventEmitter = void 0;
var EventEmitter = /** @class */ (function () {
    function EventEmitter() {
        this.events = [];
    }
    EventEmitter.prototype.on = function (event, cb) {
        this.events.push({ event: event, cb: cb });
    };
    EventEmitter.prototype.emit = function (event, data) {
        this.events.forEach(function (v) {
            if (v.event === event)
                v.cb(data);
        });
    };
    return EventEmitter;
}());
exports.EventEmitter = EventEmitter;
//# sourceMappingURL=EventEmitter.js.map