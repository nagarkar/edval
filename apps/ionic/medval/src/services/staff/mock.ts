import {Injectable} from '@angular/core';
import {Staff} from "./schema";
import {Utils} from "../../shared/stuff/utils";
import {AccessTokenService} from "../../shared/aws/access.token.service";
import {Config} from "../../shared/aws/config";
import {AbstractMockService} from "../../shared/service/abstract.mock.service";

@Injectable()
export class MockStaffService extends AbstractMockService<Staff> {

  private static staffMap: Map<string, Staff> = MockStaffService.mockMap();

  constructor(
    utils: Utils,
    accessProvider: AccessTokenService) {

    super(utils, accessProvider);
    Utils.log("created staff account)");
  }

  reset() {
    MockStaffService.staffMap = MockStaffService.mockMap();
  }

  getId(member: Staff) {
    return member.username;
  }

  setId(member: Staff, id: string): string {
    return member.username = id;
  }

  public mockData() : Map<string, Staff> {
    return MockStaffService.staffMap;
  }


  private static mockMap() : Map<string, Staff> {
    let map : Map<string, Staff> = new Map<string, Staff>();
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
  }
}
