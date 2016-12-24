import { EventEmitter } from "@angular/core";
export var AbstractMockService = (function () {
    function AbstractMockService(utils, accessProvider) {
        this.utils = utils;
        this.accessProvider = accessProvider;
        this.onCreate = new EventEmitter();
        this.onUpdate = new EventEmitter();
        this.onDelete = new EventEmitter();
    }
    AbstractMockService.prototype.get = function (id, dontuseCache) {
        return Promise.resolve(this.mockData().get(id));
    };
    AbstractMockService.prototype.list = function () {
        return Promise.resolve(Array.from(this.mockData().values()));
    };
    AbstractMockService.prototype.listCached = function () {
        return Array.from(this.mockData().values());
    };
    AbstractMockService.prototype.getCached = function (id) {
        return this.mockData().get(id);
    };
    AbstractMockService.prototype.update = function (member) {
        //TODO Add assertion (npm install check-preconditions)
        this.updateCache(member);
        this.onUpdate.emit(member);
        return Promise.resolve(member);
    };
    AbstractMockService.prototype.create = function (member) {
        if (!this.getId(member)) {
            this.setId(member, "id-" + Math.ceil(Math.random() * 10e10));
        }
        this.updateCache(member);
        this.onCreate.emit(member);
        // We use JSON.stringify to copy instead of Utils.stringify because we expect
        // there are no circular references.
        return Promise.resolve(JSON.parse(JSON.stringify(member)));
    };
    AbstractMockService.prototype.delete = function (id) {
        //TODO Add assertion (npm install check-preconditions)
        this.deleteFromCache(id);
        this.onDelete.emit(id);
        return Promise.resolve(true);
    };
    AbstractMockService.prototype.deleteFromCache = function (id) {
        this.mockData().delete(id);
    };
    AbstractMockService.prototype.updateCache = function (member) {
        this.mockData().set(this.getId(member), member);
    };
    return AbstractMockService;
}());
//# sourceMappingURL=abstract.mock.service.js.map