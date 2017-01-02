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
        logo: "data:image/png;base64,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",
        contactName: "Dr. Megha",
        accountName: "Orthodontic Excellence",
        address: {
          street1: '6981 Coal Creek Pkwy SE',
          city: 'Renton',
          state: 'WA',
          zip: '98059'
        }
      }}));
    return map;
  }

}
