import { Staff } from '../staff';

export interface InterfaceStaffService {
  listStaff() : Promise<Staff[]>;
  updateStaff(staffMember: Staff) : Promise<Staff[]>;
  deleteStaff(staffMember: Staff) : Promise<Staff[]>;
}
