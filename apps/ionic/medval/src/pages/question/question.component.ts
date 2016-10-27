import { Component, Input, Output, EventEmitter } from '@angular/core';

import { NavController, NavParams } from'ionic-angular';

import {DashboardComponent} from "../dashboard/dashboard.component";
import {QuestionService} from "./question.service";
import {IQuestion} from "./question.schema";
import {QuestionDetailsComponent} from "./question-details/question-details.component";


@Component({
  selector: 'questions',
  templateUrl: 'question.component.html',
  providers: [ QuestionService ]
})
export class QuestionsComponent {
  pageCounter: number = 0;
  questions: IQuestion[];
  slicedQuestions: IQuestion[] = [];
  itemPerPage: number = 1;
  currentPage: number = 1;
  totalItems: number;
  progressBarValue: number = 10;
  selectedProducer: any;

  constructor(
    private questionService: QuestionService,
    private navController: NavController,
    private navParams: NavParams
  ) {
    this.selectedProducer = this.navParams.get('producer')
   }

  ngOnInit() {
    this.questions = this.questionService.getQuestions();
    this.totalItems = this.questions.length;
    this.onPageChange(0);
    this.progressBarValue = 10;
  }

  onAnswerSelection(data: IQuestion) {
    // setting up answer value to question object.
    this.questions
      .filter((item) => item.id == data.id)
      .map(item => item.answer = data.answer);
    this.pageCounter++;
    this.onPageChange(this.pageCounter * this.itemPerPage);
  }

  onPageChange(page) {
    this.currentPage = page;
    this.slicedQuestions = this.questions.slice(this.currentPage, this.currentPage + this.itemPerPage);
    this.calculateProgressBarValue();
  }

  private gotoLogin() {
    this.navController.setRoot(DashboardComponent);
  }

  private calculateProgressBarValue() {
    let length = this.questions.length;
    if (length > 0) {
      this.progressBarValue = this.progressBarValue +  Math.round(80 / length);
    }
  }
}
