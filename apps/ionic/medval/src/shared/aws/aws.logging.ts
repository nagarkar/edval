import {Config} from "../config";
declare let AWS:any;

export class AWSLogging {

  private cloudwatch: any;
  private logStreamName: string;
  private nextSequenceToken: string;
  private logEvents: {message: string, timestamp: number} [] = [];

  constructor() {

    this.logStreamName = Config.CUSTOMERID;
    this.cloudwatch = new AWS.CloudWatchLogs({
      credentials: AWS.config.credentials,
      region: Config.AWS_CONFIG.REGION,
    });
    this.updateNextSequenceToken();
  }

  flush() {
    if (this.logEvents.length > 0) {
      this.logToAws(this.logEvents);
      this.logEvents = [];
    }
  }

  logEvent(message: string) {
    console.log("logging with sequence token: " + this.nextSequenceToken);
    this.logEvents.push({message: message, timestamp: Date.now()});
    if (this.logEvents.length >= Config.AWS_CONFIG.LOG_BATCH_SIZE) {
      let events = this.logEvents.slice(0, Config.AWS_CONFIG.LOG_BATCH_SIZE);
      this.logEvents = this.logEvents.slice(Config.AWS_CONFIG.LOG_BATCH_SIZE);
      this.logToAws(events);
    }
  }

  private logToAws(events) {
    this.cloudwatch.putLogEvents({
      logGroupName: Config.AWS_CONFIG.LOG_GROUP_NAME,
      logStreamName: this.logStreamName,
      sequenceToken: this.nextSequenceToken,
      logEvents: events
    }, (err, data) => {

      if (data) {
        this.nextSequenceToken = data.nextSequenceToken;
      }
      if (err) {
        if (err.code == 'InvalidSequenceTokenException') {
          let matches = err.message.match(/[0-9]+/g);
          if (matches.length > 0) {
            this.nextSequenceToken = matches[0];
            this.logToAws(events);
          }
        }
        console.log([err.name, err.message].join(":"))
      }
    });
  }

  updateNextSequenceToken() {

    var params = {
      logGroupName: Config.AWS_CONFIG.LOG_GROUP_NAME,
      descending: true,
      limit: 1,
      logStreamNamePrefix: this.logStreamName,
      orderBy: 'LogStreamName'
    };

    this.cloudwatch.describeLogStreams(params, (err, data) => {
      if (err) {
        console.log([err.name, err.message].join(":"))
        return;
      }
      if (data.logStreams.length == 0) {
        let params = {
          logGroupName: Config.AWS_CONFIG.LOG_GROUP_NAME,
          logStreamName: this.logStreamName
        };
        this.cloudwatch.createLogStream(params, (err: Error, data)=> {
          if (err) {
            console.log(err.name + ':' + err.message + ":" + err.stack);
          } else {
            setTimeout(()=> {
              this.updateNextSequenceToken();
            }, 3000);
          }
        });
      } else {
        this.nextSequenceToken = data.logStreams[0].uploadSequenceToken;
      }
    });
  }
}
