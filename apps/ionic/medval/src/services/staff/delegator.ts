import {Injectable} from '@angular/core';

import {MockStaffService} from "./mock";
import {Staff} from "./schema";
import {LiveStaffService} from "./live";
import {DelegatingService} from "../../shared/service/delegating.service";

@Injectable()
export class StaffService extends DelegatingService<Staff> {
  constructor(
    mockService: MockStaffService,
    liveService: LiveStaffService) {

    super(mockService, liveService);
  }

  getId(member: Staff): string {
    return member.username;
  }
}
