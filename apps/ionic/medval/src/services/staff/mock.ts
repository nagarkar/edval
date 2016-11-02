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
    this.utils.log("created staff account)");
  }


  getId(member: Staff) {
    return member.username;
  }

  public mockData() : Map<string, Staff> {
    return MockStaffService.staffMap;
  }


  private static mockMap() : Map<string, Staff> {
    let map : Map<string, Staff> = new Map<string, Staff>();
    map.set("celeron", Object.assign(new Staff(), {
        customerId: Config.CUSTOMERID,
        username: "celeron",
        entityStatus: "ACTIVE",
        role: "MD",
        properties: {
          firstName: "Chinmay",
          lastName: "Nagarkar",
          email: "nagarkar@imaginary.com",
          photoUrl: "https://media.licdn.com/mpr/mpr/shrinknp_200_200/AAEAAQAAAAAAAAfzAAAAJDllODlkOWU4LWRkODAtNDhjYi1hZjA3LWQ4YzFiYjE1NjVlZg.jpg"
        }
    }));
    map.set("admin2", Object.assign(new Staff(), {
      customerId: Config.CUSTOMERID,
      username: "admin2",
      entityStatus: "ACTIVE",
      role: "MD",
      properties: {
        firstName: "Dre",
        lastName: "Robbins",
        email: "dre@imaginary.com",
        photoUrl: "http://www.name-list.net/img/portrait/Chinmay_6.jpg"
      }
    }));
    map.set("admin", Object.assign(new Staff(), {
      customerId: Config.CUSTOMERID,
      username: "admin",
      entityStatus: "ACTIVE",
      role: "MD",
      properties: {
        firstName: "Dre2",
        lastName: "Robbins2",
        email: "dre@imaginary.com",
        photoUrl: "http://www.name-list.net/img/portrait/Chinmay_6.jpg"
      }
    }));
    return map;
  }
}
