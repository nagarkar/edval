import {Injectable} from "@angular/core";
import {Staff} from "./schema";
import {Utils} from "../../shared/stuff/utils";
import {AccessTokenService} from "../../shared/aws/access.token.service";
import {Config} from "../../shared/config";
import {AbstractMockService} from "../../shared/service/abstract.mock.service";


@Injectable()
export class MockStaffService extends AbstractMockService<Staff> {

  private static staffMap: Map<string, Staff>;

  constructor(
    utils: Utils,
    accessProvider: AccessTokenService) {

    super(utils, accessProvider);
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
    if (!MockStaffService.staffMap) {
      MockStaffService.staffMap = MockStaffService.mockMap();
    }
    return MockStaffService.staffMap;
  }

  static mockMap() : Map<string, Staff> {
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
        photoUrl: "http://www.smilewithbraces.com/wp-content/uploads/2015/01/Ermaina-240x300.jpg"
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
        photoUrl: "http://www.smilewithbraces.com/wp-content/uploads/2016/06/Jaite-Cheverez.jpg"
      }
    }));
    map.set("celeron", Object.assign(new Staff(), {
      customerId: Config.CUSTOMERID,
      username: "celeron",
      entityStatus: "ACTIVE",
      role: "DDS",
      properties: {
        title: "Dr.",
        firstName: "Megha",
        lastName: "Anand",
        email: "drmegha@smilewithbraces.com",
        photoUrl: "assets/img/drmegha.jpg"
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
        photoUrl: "http://www.smilewithbraces.com/wp-content/uploads/2016/06/Kelsey-Garbe.jpg"
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
        photoUrl: "http://www.smilewithbraces.com/wp-content/uploads/2016/06/Jazzmine-Wilke.jpg"
      }
    }));
    return map;
  }
}
