

export class AbstractEvent {

    _isCancelled = false;
    static _handlers = []
    constructor() {

    }

    isCancelled() {
        return this._isCancelled;
    }

    setCancelled(value) {
        this._isCancelled = value;
    }

    static getHandlers() {
        return null;
    }

    static addHandler(handler) {
        return handler;
    }

    static removeHandler(handler) {
        return handler;
    }
}