import {Injectable, Inject} from '@angular/core';
import {Staff} from "../staff";
import {AbstractService} from "../../../shared/stuff/abstract.service";
import {InterfaceStaffService} from "./interface.staff.service";
import {Logger} from "../../../shared/logger.service";
import {AccessTokenProvider} from "../../../shared/aws/access.token.service";

@Injectable()
export class MockStaffService extends AbstractService implements InterfaceStaffService {

  private static staffArray: Map<string, Staff> = MockStaffService.mockMap();

  constructor(
    @Inject(Logger) private logger,
    @Inject(AccessTokenProvider) protected accessProvider) {

    super(accessProvider);
    this.logger.log("created staff service)");
  }


  public listStaff() : Promise<Staff[]> {
    return Promise.resolve(Array.from(MockStaffService.staffArray.values()));
  }

  public updateStaff(staffMember: Staff) : Promise<Staff[]> {
    //TODO Add assertion (npm install check-preconditions)
    this.updateCache(staffMember);
    return this.save(staffMember);
  }

  public deleteStaff(staffMember: Staff) : Promise<Staff[]> {
    //TODO Add assertion (npm install check-preconditions)
    this.deleteFromCache(staffMember);
    return this.delete(staffMember);
  }

  private save(staffMember: Staff) : Promise<Staff[]> {
     return Promise.resolve(Array.from(MockStaffService.staffArray.values()));
  }

  private delete(staffMember: Staff) : Promise<Staff[]> {
    return Promise.resolve(Array.from(MockStaffService.staffArray.values()));
  }

  private updateCache(staffMember: Staff) : void {
    MockStaffService.staffArray.set(staffMember.id, staffMember);
  }

  private deleteFromCache(staffMember: Staff) : void {
    MockStaffService.staffArray.delete(staffMember.id);
  }

  private static mockMap() : Map<string, Staff> {
    let map : Map<string, Staff> = new Map<string, Staff>();
    map.set("id1", {
      id: "id1",
        name: "Dr Nagarkar",
        email: "nagarkar@imaginary.com",
        role: "MD",
        imageUrl: "https://media.licdn.com/mpr/mpr/shrinknp_200_200/AAEAAQAAAAAAAAfzAAAAJDllODlkOWU4LWRkODAtNDhjYi1hZjA3LWQ4YzFiYjE1NjVlZg.jpg"
    });
    map.set("id2", {
      id: "id2",
        name: "Dr Dre",
        email: "dre@imaginary.com",
        role: "Nurse",
        imageUrl: "http://www.name-list.net/img/portrait/Chinmay_6.jpg"
    });
    return map;
  }
}
