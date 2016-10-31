import {MetricService} from "./metric.service";
import {Metric} from "./metric.schema";
export class MetricIterator implements Iterator<Metric> {

  questions: IterableIterator<Metric>;

  constructor(private questionSvc : MetricService) {
    this.questions = this.questionSvc.getQuestions().values();
  }

  next(value?: any): IteratorResult<Metric> {
    return this.questions.next(value);
  }
}
