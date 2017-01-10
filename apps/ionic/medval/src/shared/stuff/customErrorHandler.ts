import { ErrorHandler } from '@angular/core';
import { IonicErrorHandler } from 'ionic-angular';
import { AwsClient } from "../aws/aws.client";

export class CustomErrorHandler extends IonicErrorHandler implements ErrorHandler {

	constructor() {
		super();
	}

	handleError(err: any): void {
		AwsClient.logEvent(err);
		super.handleError(err);
	}
}