/**
 * Created by chinmay on 4/8/17.
 * Copyright HC Technology Inc.
 * Please do not copy without permission. This code may not be used outside
 * of this application without permission. Copying and re-posting on another
 * site or application without licensing is strictly prohibited.
 */

import {Session} from "../../services/session/schema";
import {Account} from "../../services/account/schema";
import {Config} from "../config";
import {SessionOrthoScrubber} from "./session.ortho.scrubber";
import {Scrubber} from "./scrubber";
import {MetricService} from "../../services/metric/delegator";
import {StaffService} from "../../services/staff/delegator";
import {Injectable} from "@angular/core";

@Injectable()
export class SessionScrubber implements Scrubber<Session>{

  scrubbers : {[key: string]: Scrubber<Session>};

  constructor(private sessionOrthoScrubber: SessionOrthoScrubber){
    this.scrubbers = this.createScrubberMap();
  }

  scrub(session: Session) {
    let account: Account = Config.CUSTOMER;
    let scrubber : Scrubber<Session> = this.scrubbers[account.properties.verticalId];
    scrubber.scrub(session);
  }

  private createScrubberMap(): {[key: string]: Scrubber<Session>} {
    return {
      'OrthodonticClinic' : this.sessionOrthoScrubber
    }
  }
}
