import { Injectable } from '@angular/core';

import { QUESTIONS } from './question.mock';
import * as schema from './question.schema';
import {IQuestion} from "./question.schema";

@Injectable()
export class QuestionService {

  private static data : IQuestion[] = QUESTIONS;
  constructor() { }

  getQuestions() : IQuestion[] {
    return QuestionService.data;
  }

}
