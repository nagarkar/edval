import {Injectable} from "@angular/core";

@Injectable()
export class Config {

  /* TODO this should not be hardcoded */
  public static CUSTOMERID : string = "OMC";

  public readonly timeOutAfterThanks: number = 5000;

  public static POOL_DATA = {
    UserPoolId : 'us-east-1_WRjTRJPkD', // Your user pool metricId here
    ClientId : 's8koda3rkc3rsjt3fdlvdnvia' // Your client metricId here
  };

  public static REFRESH_ACCESS_TOKEN: number = 100000;

  private static MOCK_DATA : boolean = false;

  public static isMockData() : boolean {
    return Config.MOCK_DATA;
  }


  public static useMockData() : void {
    Config.MOCK_DATA = true;
  }

  public static useLiveData() : void {
    Config.MOCK_DATA = false;
  }
}
