import { Injectable } from '@angular/core';

@Injectable()
export class Logger {

  logs: string[] = []; // capture logs for testing

  public log(message: string) : void {
    this.logs.push(message);
    console.log(message);
  }
}
