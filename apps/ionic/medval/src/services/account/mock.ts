import {Injectable} from "@angular/core";
import {Account} from "./schema";
import {Utils} from "../../shared/stuff/utils";
import {AccessTokenService} from "../../shared/aws/access.token.service";
import {Config} from "../../shared/config";
import {AbstractMockService} from "../../shared/service/abstract.mock.service";

@Injectable()
export class MockAccountService extends AbstractMockService<Account> {

  private static MOCK_DATA : Map<string, Account> = MockAccountService.mockMap();

  constructor(
    utils: Utils,
    accessProvider: AccessTokenService) {

    super(utils, accessProvider);
  }

  reset() {
    MockAccountService.MOCK_DATA = MockAccountService.mockMap();
  }

  mockData(): Map<string, Account> {
    return MockAccountService.MOCK_DATA;
  }

  getId(member: Account): string {
    return member.customerId;
  }

  setId(member: Account, id: string): string {
    return member.customerId = id;
  }


  private static mockMap() : Map<string, Account> {
    let map : Map < string, Account > = new Map<string, Account>();
    map.set(Config.CUSTOMERID, Object.assign(new Account(), {
      customerId: Config.CUSTOMERID,
      properties: {
        logo: "assets/img/logo.jpg",
        contactName: "Dr. Megha",
        accountName: "Orthodontic Excellence",
        address: {
        }
      }}));
    return map;
  }

}
