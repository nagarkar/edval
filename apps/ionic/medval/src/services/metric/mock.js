var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { Metric } from './schema';
import { Config } from "../../shared/aws/config";
import { Injectable } from '@angular/core';
import { Utils } from "../../shared/stuff/utils";
import { AccessTokenService } from "../../shared/aws/access.token.service";
import { AbstractMockService } from "../../shared/service/abstract.mock.service";
export var MockMetricService = (function (_super) {
    __extends(MockMetricService, _super);
    function MockMetricService(utils, accessProvider) {
        _super.call(this, utils, accessProvider);
        Utils.log("created staff account)");
    }
    MockMetricService.prototype.reset = function () {
        MockMetricService.metricMap = MockMetricService.mockMap();
    };
    MockMetricService.prototype.setId = function (member, id) {
        return member.metricId = id;
    };
    MockMetricService.prototype.getId = function (member) {
        return member.metricId;
    };
    MockMetricService.prototype.mockData = function () {
        return MockMetricService.metricMap;
    };
    MockMetricService.mockMap = function () {
        var map = new Map();
        MockMetricService.getMetrics().forEach(function (untypedMetric) {
            var metric = Object.assign(new Metric(), untypedMetric);
            map.set(metric.metricId, metric);
        });
        return map;
    };
    // MD Questions
    // NPS Parent
    MockMetricService.getMetrics = function () {
        return [{
                customerId: Config.CUSTOMERID,
                metricId: 'root',
                parentMetricId: null,
                entityStatus: "ACTIVE",
                subject: "org",
                properties: {
                    conversationSetup: "Lets get the most important question out of the way!",
                    question: "Would you recommend Orthodontic Excellence to your friends and family?",
                    metricName: "",
                    metricDescription: "Organization Level Metric. This metric is alrways present by default and cannot be deleted",
                    definition: {
                        npsType: {
                            range: 11
                        }
                    }
                }
            }, {
                customerId: Config.CUSTOMERID,
                metricId: '62861045b4984805213df729dad97b',
                parentMetricId: null,
                entityStatus: "ACTIVE",
                subject: "role:Orthodontic Assistant",
                properties: {
                    question: "How would you rate our Orthodontic Assistants?",
                    metricName: "NPS Metric for Role Orthodontic Assistant",
                    definition: {
                        npsType: {
                            range: 11
                        }
                    }
                }
            }, {
                customerId: Config.CUSTOMERID,
                metricId: '62861045b4984805ae213df729dad97b',
                parentMetricId: null,
                entityStatus: "ACTIVE",
                subject: "role:MD",
                properties: {
                    question: "Would you recommend Dr Megha to your friends and family?",
                    metricName: "NPS Metric for Role MD",
                    definition: {
                        npsType: {
                            range: 11
                        }
                    }
                }
            }, {
                // MD Drill Downs
                customerId: Config.CUSTOMERID,
                metricId: '2861045b4984805ae23df729dad97b',
                parentMetricId: '62861045b4984805ae213df729dad97b',
                entityStatus: "ACTIVE",
                subject: "role:MD",
                properties: {
                    question: 'Was your doctor friendly and courteous?',
                    metricName: 'FriendlycourteousMD',
                    positiveImpact: "The doctor is friendly and treats me with the utmost courtesy and respect",
                    improvement: "Be more friendly and courteous",
                    definition: {
                        npsType: {
                            range: 11
                        }
                    }
                }
            }, {
                customerId: Config.CUSTOMERID,
                metricId: '861045b4984805ae213df729dad97b',
                parentMetricId: '62861045b4984805ae213df729dad97b',
                entityStatus: "ACTIVE",
                subject: "role:MD",
                properties: {
                    metricName: 'Doctor Skill',
                    question: 'Do you feel the doctors at OE are skillful in performing their tasks?',
                    positiveImpact: "The doctor & team are skillful in performing their tasks",
                    improvement: "Please provide better quality treatment and focus on results",
                    definition: {
                        npsType: {
                            range: 11
                        }
                    }
                }
            }, {
                customerId: Config.CUSTOMERID,
                metricId: '1045b4984805ae213df729dad97b',
                parentMetricId: '62861045b4984805ae213df729dad97b',
                entityStatus: "ACTIVE",
                subject: "role:MD",
                properties: {
                    metricName: 'Treatment progress',
                    question: 'Are you kept well-informed about the progress of your treatment & are your questions answered?',
                    positiveImpact: "The doctor & team keep me informed of treatment progress & answer all my questions",
                    improvement: "Do a better job explaining the treament and the plan going forward",
                    definition: {
                        npsType: {
                            range: 11
                        }
                    }
                }
            }, {
                customerId: Config.CUSTOMERID,
                metricId: '045b4984805ae213df729dad97b',
                parentMetricId: '62861045b4984805ae213df729dad97b',
                entityStatus: "ACTIVE",
                subject: "role:MD",
                properties: {
                    metricName: 'Did Dr. Megha address your concerns and questions?',
                    question: 'Does the doctor & team show genuine interest in patients?',
                    positiveImpact: "The doctor & team show genuine interest in patients",
                    improvement: "Show genuine interest in patients and address their concerns",
                    definition: {
                        npsType: {
                            range: 11
                        }
                    }
                }
            }, {
                customerId: Config.CUSTOMERID,
                metricId: 'aae40633d0f646ce86840bf21bfcb3a4',
                parentMetricId: null,
                entityStatus: "ACTIVE",
                subject: "role:PA",
                properties: {
                    metricName: 'How do you rate the office and support staff?',
                    question: 'How would you rate the front-desk and other support staff?',
                    definition: {
                        npsType: {
                            range: 11
                        }
                    }
                }
            }, {
                customerId: Config.CUSTOMERID,
                metricId: '95a8659497274ffe9f8fb14fa45b21e5',
                parentMetricId: 'aae40633d0f646ce86840bf21bfcb3a4',
                entityStatus: "ACTIVE",
                subject: "role:PA",
                properties: {
                    metricName: 'Was the office staff professional and helpful?',
                    question: 'Did Financial Coordinator present financial information clearly & concisely',
                    positiveImpact: 'Your Financial Coordinator presented financial information clearly & concisely',
                    improvement: 'The front office staff need to be more professional and helpful!',
                    definition: {
                        npsType: {
                            range: 11
                        }
                    }
                }
            }, {
                customerId: Config.CUSTOMERID,
                metricId: '6e0f99cdd7a34a058ff2fb22fbe51738',
                parentMetricId: 'aae40633d0f646ce86840bf21bfcb3a4',
                entityStatus: "ACTIVE",
                subject: "role:PA",
                properties: {
                    metricName: 'Was it easy and convenient to book an appointment?',
                    question: 'Do you usually get an appointment at a time and location convenient to you?',
                    positiveImpact: "It's always easy to book an appointment!",
                    improvement: "Please make it easier to get convenient appointments",
                    definition: {
                        npsType: {
                            range: 11
                        }
                    }
                }
            }, {
                customerId: Config.CUSTOMERID,
                metricId: '0f99cdd7a34a058ff2fb22fbe51738',
                parentMetricId: 'aae40633d0f646ce86840bf21bfcb3a4',
                entityStatus: "ACTIVE",
                subject: "role:PA",
                properties: {
                    metricName: 'Once you arrived, did you see your doctor on time?',
                    question: 'Do you usually wait less than 5 minutes after you arrive for your appointment?',
                    positiveImpact: 'My wait time is always less than 5 minutes after I arrive.',
                    improvement: 'I had to wait too long in the waiting area. Please get organized!',
                    definition: {
                        npsType: {
                            range: 11
                        }
                    }
                }
            }, {
                customerId: Config.CUSTOMERID,
                metricId: '34182735427d4f2eba99eb0acb66078f',
                parentMetricId: 'aae40633d0f646ce86840bf21bfcb3a4',
                entityStatus: "ACTIVE",
                subject: "role:PA",
                properties: {
                    metricName: 'cleanliness',
                    question: 'Was the reception area comfortable & clean?',
                    positiveImpact: 'The reception area is comfortable & clean.',
                    improvement: 'Please keep the reception area comfortable & clean!',
                    definition: {
                        npsType: {
                            range: 11
                        }
                    }
                }
            }
        ];
    };
    MockMetricService.metricMap = MockMetricService.mockMap();
    MockMetricService.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    MockMetricService.ctorParameters = [
        { type: Utils, },
        { type: AccessTokenService, },
    ];
    return MockMetricService;
}(AbstractMockService));
//# sourceMappingURL=mock.js.map