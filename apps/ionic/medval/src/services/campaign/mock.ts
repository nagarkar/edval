import {Injectable} from "@angular/core";
import {Campaign} from "./schema";
import {Utils} from "../../shared/stuff/utils";
import {AccessTokenService} from "../../shared/aws/access.token.service";
import {AbstractMockService} from "../../shared/service/abstract.mock.service";
import {Config} from "../../shared/config";

@Injectable()
export class MockCampaignService extends AbstractMockService<Campaign> {

  private static data: Map<string, Campaign>;

  constructor(
    utils: Utils,
    accessProvider: AccessTokenService) {

    super(utils, accessProvider);
    Utils.log("Created Mock Campaign Service");
  }

  reset() {
    MockCampaignService.data = this.mockData();
  }

  setId(member: Campaign, id: string): string {
    return member.campaignId = id;
  }

  getId(member: Campaign) {
    return member.campaignId;
  }

  public mockData() : Map<string, Campaign> {
    if (!MockCampaignService.data || !MockCampaignService.data.size) {
      MockCampaignService.data = MockCampaignService.mockMap();
    }
    return MockCampaignService.data;
  }

  static mockMap() : Map<string, Campaign> {
    let map : Map<string, Campaign> = new Map<string, Campaign>();
    map.set("default", Object.assign(new Campaign(), {
      campaignId: 'default',
      properties: {
        name:  'Default Campaign'
      },
      statistics: {
        summary: {
          priorWindowSessionCount:10,
          lastWindowSessionCount:12,
          totalSessions:100,
          dateOfFirstFeedback: new Date(2014, 3, 15).getMilliseconds(),
          dateOfLastFeedback: new Date(2017, 0, 15).getMilliseconds()
        },
        metrics: [{
          metricSubject:'role:Orthodontic Assistant',
          currentWindowStats: {
            mean:0.5,
            frequencies: {
              detractor: .04,
              promoter: .04
            }
          },
          previousWindowStats: {
            mean:0.5,
            frequencies: {
              detractor: .03,
              promoter: .05
            }
          }
        },
          {
            metricSubject:'role:DDS',
            currentWindowStats: {
              mean:0.5,
              frequencies: {
                detractor: .04,
                promoter: .04
              }
            },
            previousWindowStats: {
              mean:0.5,
              frequencies: {
                detractor: .03,
                promoter: .05
              }
            }
          },
          {
            metricSubject:'role:DDS',
            currentWindowStats: {
              mean:0.5,
              frequencies: {
                detractor: .04,
                promoter: .04
              }
            },
            previousWindowStats: {
              mean:0.5,
              frequencies: {
                detractor: .03,
                promoter: .05
              }
            }
          },
          {
            metricSubject:'role:DDS',
            currentWindowStats: {
              mean:0.5,
              frequencies: {
                detractor: .04,
                promoter: .04
              }
            },
            previousWindowStats: {
              mean:0.5,
              frequencies: {
                detractor: .03,
                promoter: .05
              }
            }
          }]
      }
    }));
    map.set("campaign-123", Object.assign(new Campaign(), {
      campaignId: 'campaign-123',
      properties: {
        name: 'Second Campaign'
      },
      statistics: {
        summary: {
          priorWindowSessionCount:10,
          lastWindowSessionCount:12,
          totalSessions:100,
          dateOfFirstFeedback: new Date(2014, 3, 15).getMilliseconds(),
          dateOfLastFeedback: new Date(2017, 0, 15).getMilliseconds()
        },
        metrics: [{
          metricSubject:'role:Orthodontic Assistant',
          currentWindowStats: {
            mean:0.5,
            frequencies: {
              detractor: .04,
              promoter: .04
            }
          },
          previousWindowStats: {
            mean:0.5,
            frequencies: {
              detractor: .03,
              promoter: .05
            }
          }
        },
        {
          metricSubject:'role:DDS',
          currentWindowStats: {
            mean:0.5,
            frequencies: {
              detractor: .04,
              promoter: .04
            }
          },
          previousWindowStats: {
            mean:0.5,
            frequencies: {
              detractor: .03,
              promoter: .05
            }
          }
        },
        {
          metricSubject:'role:DDS',
          currentWindowStats: {
            mean:0.5,
            frequencies: {
              detractor: .04,
              promoter: .04
            }
          },
          previousWindowStats: {
            mean:0.5,
            frequencies: {
              detractor: .03,
              promoter: .05
            }
          }
        },
        {
          metricSubject:'role:DDS',
          currentWindowStats: {
            mean:0.5,
            frequencies: {
              detractor: .04,
              promoter: .04
            }
          },
          previousWindowStats: {
            mean:0.5,
            frequencies: {
              detractor: .03,
              promoter: .05
            }
          }
        }]
      }
    }));
    return map;
  }
}
