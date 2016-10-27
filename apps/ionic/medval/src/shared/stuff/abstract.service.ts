import {AccessTokenProvider} from "../aws/access.token.service";
import {ErrorType} from "./error.types";


export abstract class AbstractService {

  constructor(protected accessProvider: AccessTokenProvider) { }

  protected checkGate() : void {
    if (!this.accessProvider.supposedToBeLoggedIn()) {
      throw ErrorType.NotLoggedIn;
    }
  }
}
