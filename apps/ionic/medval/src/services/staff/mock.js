var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { Injectable } from '@angular/core';
import { Staff } from "./schema";
import { Utils } from "../../shared/stuff/utils";
import { AccessTokenService } from "../../shared/aws/access.token.service";
import { Config } from "../../shared/aws/config";
import { AbstractMockService } from "../../shared/service/abstract.mock.service";
export var MockStaffService = (function (_super) {
    __extends(MockStaffService, _super);
    function MockStaffService(utils, accessProvider) {
        _super.call(this, utils, accessProvider);
        Utils.log("created staff account)");
    }
    MockStaffService.prototype.reset = function () {
        MockStaffService.staffMap = MockStaffService.mockMap();
    };
    MockStaffService.prototype.getId = function (member) {
        return member.username;
    };
    MockStaffService.prototype.setId = function (member, id) {
        return member.username = id;
    };
    MockStaffService.prototype.mockData = function () {
        return MockStaffService.staffMap;
    };
    MockStaffService.mockMap = function () {
        var map = new Map();
        map.set("ermania", Object.assign(new Staff(), {
            customerId: Config.CUSTOMERID,
            username: "ermania",
            entityStatus: "ACTIVE",
            role: "FrontOffice",
            properties: {
                firstName: "Ermania",
                lastName: "",
                email: "team@smilewithbraces.com",
                photoUrl: "assets/img/staff/ermania.jpg"
            }
        }));
        map.set("jaite", Object.assign(new Staff(), {
            customerId: Config.CUSTOMERID,
            username: "jaite",
            entityStatus: "ACTIVE",
            role: "Orthodontic Assistant",
            properties: {
                firstName: "Jaite",
                lastName: "",
                email: "team@smilewithbraces.com",
                photoUrl: "assets/img/staff/jaite.jpg"
            }
        }));
        map.set("celeron", Object.assign(new Staff(), {
            customerId: Config.CUSTOMERID,
            username: "celeron",
            entityStatus: "ACTIVE",
            role: "MD",
            properties: {
                firstName: "Megha",
                lastName: "Anand",
                email: "drmegha@smilewithbraces.com",
                photoUrl: "assets/img/staff/megha.jpg"
            }
        }));
        map.set("kelsey", Object.assign(new Staff(), {
            customerId: Config.CUSTOMERID,
            username: "kelsey",
            entityStatus: "ACTIVE",
            role: "Orthodontic Assistant",
            properties: {
                firstName: "Kelsey",
                lastName: "",
                email: "team@smilewithbraces.com",
                photoUrl: "assets/img/staff/kelsey.jpg"
            }
        }));
        map.set("jazzmine", Object.assign(new Staff(), {
            customerId: Config.CUSTOMERID,
            username: "jazzmine",
            entityStatus: "ACTIVE",
            role: "Orthodontic Assistant",
            properties: {
                firstName: "Jazzmine",
                lastName: "",
                email: "team@smilewithbraces.com",
                photoUrl: "assets/img/staff/jazzmine.jpg"
            }
        }));
        map.set("liana", Object.assign(new Staff(), {
            customerId: Config.CUSTOMERID,
            username: "liana",
            entityStatus: "ACTIVE",
            role: "FrontOffice",
            properties: {
                firstName: "Liana",
                lastName: "",
                email: "team@smilewithbraces.com",
                photoUrl: "assets/img/staff/liana.jpg"
            }
        }));
        return map;
    };
    MockStaffService.staffMap = MockStaffService.mockMap();
    MockStaffService.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    MockStaffService.ctorParameters = [
        { type: Utils, },
        { type: AccessTokenService, },
    ];
    return MockStaffService;
}(AbstractMockService));
//# sourceMappingURL=mock.js.map