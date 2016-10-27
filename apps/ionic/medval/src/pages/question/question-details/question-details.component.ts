import { Component, Input, Output, EventEmitter } from '@angular/core';
import {IQuestion} from "../question.schema";

@Component({
  selector: 'question',
  templateUrl: 'question-details.component.html',
})
export class QuestionDetailsComponent {
  @Input() question: IQuestion;

  @Output() onAnswerSelection: EventEmitter<IQuestion>
  = new EventEmitter<IQuestion>();

  private defaultQuestion: IQuestion = {
    id: '',
    text: '',
    type: 'Rating',
    answer: 0
  }

  ngOnInit() {
    this.question = Object.assign({}, this.defaultQuestion, this.question);
  }

  private onSelection(data) {
    this.question.answer = data;
    this.onAnswerSelection.next(this.question);
  }
}
