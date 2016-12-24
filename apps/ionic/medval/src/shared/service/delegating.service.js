import { EventEmitter } from "@angular/core";
import { Config } from "../aws/config";
import { Utils } from "../stuff/utils";
export var DelegatingService = (function () {
    function DelegatingService(mockService, liveService) {
        this.mockService = mockService;
        this.liveService = liveService;
        this.onCreate = new EventEmitter();
        this.onUpdate = new EventEmitter();
        this.onDelete = new EventEmitter();
        this.subscribeToEventsFor();
    }
    DelegatingService.prototype.getDelegate = function () {
        if (Config.isMockData(this.liveService.getInstance())) {
            return this.mockService;
        }
        else {
            return this.liveService;
        }
    };
    DelegatingService.prototype.reset = function () {
        if (this.inMockMode()) {
            Utils.log("Reseting mock service for object:{0}", this.getObjectName());
            this.mockService.reset();
        }
        else {
            Utils.log("Reseting live service for object:{0}", this.getObjectName());
            this.liveService.reset();
        }
    };
    DelegatingService.prototype.getId = function (member) {
        return this.getDelegate().getId(member);
    };
    DelegatingService.prototype.get = function (id, dontuseCache) {
        return this.getDelegate().get(id, dontuseCache);
    };
    DelegatingService.prototype.list = function (dontuseCache) {
        return this.getDelegate().list(dontuseCache);
    };
    DelegatingService.prototype.getCached = function (id) {
        return this.getDelegate().getCached(id);
    };
    DelegatingService.prototype.listCached = function () {
        return this.getDelegate().listCached();
    };
    DelegatingService.prototype.create = function (TMember) {
        return this.getDelegate().create(TMember);
    };
    DelegatingService.prototype.update = function (TMember) {
        return this.getDelegate().update(TMember);
    };
    DelegatingService.prototype.delete = function (id) {
        return this.getDelegate().delete(id);
    };
    DelegatingService.prototype.inMockMode = function () {
        return Config.isMockData(this.liveService.getInstance());
    };
    DelegatingService.prototype.getObjectName = function () {
        return Utils.getObjectName(this.liveService.getInstance());
    };
    DelegatingService.prototype.delegateEventEmitters = function () {
        var _this = this;
        this.mockService.onUpdate.subscribe(function (next) {
            _this.onUpdate.emit(next);
        });
        this.liveService.onUpdate.subscribe(function (next) {
            _this.onUpdate.emit(next);
        });
        this.mockService.onCreate.subscribe(function (next) {
            _this.onCreate.emit(next);
        });
        this.liveService.onCreate.subscribe(function (next) {
            _this.onCreate.emit(next);
        });
        this.mockService.onDelete.subscribe(function (next) {
            _this.onDelete.emit(next);
        });
        this.liveService.onDelete.subscribe(function (next) {
            _this.onDelete.emit(next);
        });
    };
    return DelegatingService;
}());
//# sourceMappingURL=delegating.service.js.map
