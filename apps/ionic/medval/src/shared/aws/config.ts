import {Injectable} from "@angular/core";

@Injectable()
export class AWSConfig {

  /* TODO this should not be hardcoded */
  public static CUSTOMERID : string = "OMC";

  public static POOL_DATA = {
    UserPoolId : 'us-east-1_WRjTRJPkD', // Your user pool id here
    ClientId : 's8koda3rkc3rsjt3fdlvdnvia' // Your client id here
  };

  public static REFRESH_ACCESS_TOKEN: number = 100000;

  private static MOCK_DATA : boolean = false;

  public static isMockData() : boolean {
    return AWSConfig.MOCK_DATA;
  }

  public static useMockData() : void {
    AWSConfig.MOCK_DATA = true;
  }

  public static useLiveData() : void {
    AWSConfig.MOCK_DATA = false;
  }
}
