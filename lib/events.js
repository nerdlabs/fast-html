var EventEmitter = (function () {
    function EventEmitter() {
        this.listeners = {};
    }
    EventEmitter.prototype.on = function (event, listener) {
        var _this = this;
        if (Array.isArray(event)) {
            event.forEach(function (e) {
                return _this.on(e, listener);
            });
        } else {
            if (!this.listeners[event]) {
                this.listeners[event] = [];
            }
            this.listeners[event].push(listener);
        }

        return this;
    };

    EventEmitter.prototype.once = function (event, listener) {
        var self = this;
        this.on(event, function _once() {
            var args = [];
            for (var _i = 0; _i < (arguments.length - 0); _i++) {
                args[_i] = arguments[_i + 0];
            }
            self.off(event, _once);
            listener.apply(self, args);
        });
        return this;
    };

    EventEmitter.prototype.off = function (event, listener) {
        if (!Array.isArray(this.listeners[event])) {
            return;
        }
        var l = this.listeners[event].length, i = 0;

        if (!listener) {
            this.listeners[event] = [];
        }

        for (; i < l; i += 1) {
            if (this.listeners[event][i] === listener) {
                this.listeners[event].splice(i, 1);
            }
        }
        return this;
    };

    EventEmitter.prototype.emit = function (event) {
        var args = [];
        for (var _i = 0; _i < (arguments.length - 1); _i++) {
            args[_i] = arguments[_i + 1];
        }
        if (!Array.isArray(this.listeners[event])) {
            return;
        }
        var l = this.listeners[event].length, i = 0;

        for (; i < l; i += 1) {
            var listener = this.listeners[event][i];
            listener.apply(this, args);
        }
    };
    return EventEmitter;
})();
exports.EventEmitter = EventEmitter;
