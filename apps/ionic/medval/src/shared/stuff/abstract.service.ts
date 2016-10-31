import {AccessTokenService} from "../aws/access.token.service";
import {ErrorType} from "./error.types";


export abstract class AbstractService {

  constructor(protected accessProvider: AccessTokenService) { }

  protected checkGate() : void {
    if (!this.accessProvider.supposedToBeLoggedIn()) {
      throw ErrorType.NotLoggedIn;
    }
  }
}
