import { Staff } from '../staff';
import {EventEmitter} from "@angular/core";

export interface InterfaceStaffService {

  onCreate: EventEmitter<Staff>;
  onUpdate: EventEmitter<Staff>;
  onDelete: EventEmitter<Staff>;

  listStaff() : Promise<Staff[]>;
  updateStaff(staffMember: Staff) : Promise<Staff>;
  createStaff(staffMember: Staff) : Promise<Staff>;
  deleteStaff(staffMember: Staff) : Promise<boolean>;
}
