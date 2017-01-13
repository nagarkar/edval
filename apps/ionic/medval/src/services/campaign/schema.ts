export class Campaign {
  customerId: string;
  id: string;
  properties: {
    startDate: number;
    endDate: number;
    name: string;                           // Short display name (< 20 chars)
    goals: string[];                        // Description of goals.
    roles: string[];                        // List of roles we are trying to target.
    staff: string[];                        // List of staff we are trying to target
    metrics: string[];                      // List of Metric Ids we expect to be impacted.
    timeToAffectChange: MeasurementWindow;  // How long is it expected to affect change?
  }
}

export enum MeasurementWindow {
  Quarter, Month, Week
}

export class SmmaryMetrics {
  customerId: string;
  id: string;                           // metricId:subject
  currentTopline: MetricStatistics;     // Topline in current period (MeasurementWindow)
  previousTopline: MetricStatistics;    // Topline in period before to campaign start date, or before current MeasurementWindow
}

export class TimeSeries {
  customerId: string;
  id: string;                           // metricId:subject:time
  data: MetricTimeSeries;
}


export class MetricStatistics {
  metricId: string;
  subject: string;
  mean: string;
  frequencies: {
    [key: string] : number
  }
}

export class MetricTimeSeries {
  metricId: string;
  subject: string;
  series: Array<DataPoint>;
}

export class DataPoint {
  time: number;
  value: string;
}
