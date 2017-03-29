/**
 * Created by Chinmay Nagarkar on 9/30/2016.
 * Copyright HC Technology Inc.
 * Please do not copy without permission. This code may not be used outside
 * of this application without permission. Copying and re-posting on another
 * site or application without licensing is strictly prohibited.
 */
import {Injectable} from "@angular/core";
import {Campaign} from "./schema";
import {AbstractMockService} from "../../shared/service/abstract.mock.service";

@Injectable()
export class MockCampaignService extends AbstractMockService<Campaign> {

  private static data: Map<string, Campaign>;

  constructor() {
    super();
  }

  reset(): Promise<any>  {
    MockCampaignService.data = this.mockData();
    return Promise.resolve();
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
