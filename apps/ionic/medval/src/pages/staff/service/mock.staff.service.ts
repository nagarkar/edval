import {Injectable, Inject, EventEmitter} from '@angular/core';
import {Staff} from "../staff";
import {AbstractService} from "../../../shared/stuff/abstract.service";
import {InterfaceStaffService} from "./interface.staff.service";
import {Utils} from "../../../shared/stuff/utils";
import {AccessTokenService} from "../../../shared/aws/access.token.service";
import {Config} from "../../../shared/aws/config";

@Injectable()
export class MockStaffService extends AbstractService implements InterfaceStaffService {

  public onCreate: EventEmitter<Staff> = new EventEmitter<Staff>();
  public onUpdate: EventEmitter<Staff> = new EventEmitter<Staff>();
  public onDelete: EventEmitter<Staff> = new EventEmitter<Staff>();

  private static staffArray: Map<string, Staff> = MockStaffService.mockMap();

  constructor(
    @Inject(Utils) private utils,
    @Inject(AccessTokenService) protected accessProvider) {

    super(accessProvider);
    this.utils.log("created staff service)");
  }


  public listStaff() : Promise<Staff[]> {
    return Promise.resolve(Array.from(MockStaffService.staffArray.values()));
  }

  public updateStaff(staffMember: Staff) : Promise<Staff> {
    //TODO Add assertion (npm install check-preconditions)
    this.updateCache(staffMember);

    return Promise.resolve(JSON.parse(JSON.stringify(staffMember)));
    //return this.save(staffMember);
  }

  createStaff(staffMember: Staff): Promise<Staff> {
    this.updateCache(staffMember);
    this.onCreate.emit(staffMember);
    return Promise.resolve(JSON.parse(JSON.stringify(staffMember)));
  }

  public deleteStaff(staffMember: Staff) : Promise<boolean> {
    //TODO Add assertion (npm install check-preconditions)
    this.deleteFromCache(staffMember);
    this.onDelete.emit(staffMember);
    return Promise.resolve(true);
    //return this.delete(staffMember);
  }

  /*
  private save(staffMember: Staff) : Promise<Staff[]> {
     return Promise.resolve(Array.from(MockStaffService.staffArray.values()));
  }

  private delete(staffMember: Staff) : Promise<Staff[]> {
    return Promise.resolve(Array.from(MockStaffService.staffArray.values()));
  }
   */
  private updateCache(staffMember: Staff) : void {
    MockStaffService.staffArray.set(staffMember.username, staffMember);
  }

  private deleteFromCache(staffMember: Staff) : void {
    MockStaffService.staffArray.delete(staffMember.username);
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
    map.set("celeron", Object.assign(new Staff(), {
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
    return map;
  }
}
