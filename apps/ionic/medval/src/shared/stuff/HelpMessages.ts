import {Utils} from "./utils";
/**
 * Created by chinmay on 3/1/17.
 * Copyright HC Technology Inc.
 * Please do not copy without permission. This code may not be used outside
 * of this application without permission. Copying and re-posting on another
 * site or application without licensing is strictly prohibited.
 */


export class HelpMessages {

  private static helpContent = {
    SWEEPSTAKES_INTERVAL: ['Setting Interval',``],
    SWEEPSTAKES_SHOW_WHEEL: ['Wheel of Fortune Game', `Show a 'Wheel of Fortune' game to patients on the 'Thank You' page. A patient can 'spin the wheel'
      after a survey, and win a gift card. You can configure the amount (defaults to $5). You 
      can also decide how much you want to spend per patient. For example, if you decide you want the gift card to be
      $5, and want to spend $1 per patient, the game adjusts the odds so that one in five patients
      wins! This game is only displayed if the patient is not upset or very unhappy with your service.`],
    SWEEPSTAKES_AWARD_AMOUNT: ['Amount Won', `If you have enabled the 'Wheel of Fortune' game, patients win a gift card in 
      this amount if they win. Usually set to a value between 5 and 25 (dollars). 
      Please make sure you have some gift cards in this amount ready in case someone wins!`],
    SWEEPSTAKES_COST_PER_USE: ['How much you want to spend per patient', `If you have enabled the 'Wheel of Fortune' game, this is the amount 
      you will spend on gift cards per patient who plays this game. Usually set to a value between 0.5 and 5 (dollars).`],
    SHOW_JOKES_ON_THANK_YOU_PAGE: ['Show Jokes', `Control whether you want to show jokes on the thank you page. Jokes make people smile,
      and why not! A smile is a great gift after a healthcare appointment. The jokes are only shown if a patient is not
      upset or highly dissatisfied with service.`],
    REVIEW_URL: ['Online Reviews',`If a patient is highly likely to give a good review, after a survey, we request patients to provide their
      phone or email address so we can send them instructions to provide a review. In these instructions, we mention the positive
      things they have expressed, and provide specific instructions (e.g. web-links to your business page that you have setup 
      in your Account Settings`],
    SPEAK_GREETING: ['Say Thank you!',`The App includes a Speech component. Patients can be thanked by the App after they provide a review.`],
    SPEAK_GREETING_RATE: ['How fast to speak', `Set the speed of audio greetings between 1-1.5`],
    REVIEW_URL_FACEBOOK: ['Get Facebook Reviews',`In order to get Facebook reviews and ratings, you'll need to make sure that your Page's category is “Local Business”
     in your Page Settings.
        <ol style='text-align:left'>
          <li>Copy your Facebook 'Local Business' page URL (usually looks like 'https://www.facebook.com/{yourBusiness}'</li>
          <li>Optionally, shorten the URL using something like <a href="https://goo.gl/">this URL shortener</a></li>
          <li>Copy the URL into the Account Settings page.</li>
        </ol>`],
    REVIEW_URL_GOOGLE: ['Get Google Reviews', `Here are the steps to get your Google Page URL into this App:
        <ol style='text-align:left'>
          <li>Search for your company by name in Google</li>
          <li>Click on the button “Write a review”</li>
          <li>You'll see a Google review box has popped up, copy the URL out of the address bar</li>
          <li>Optionally, shorten the URL using something like <a href="https://goo.gl/">this URL shortener</a>.</li>
          <li>Copy the URL into the Account Settings page.</li>
        </ol>`],
    REVIEW_URL_YELP: ['Get Yelp Reviews', `Here are the steps to get your Yelp Page URL into this App:
        <ol style='text-align:left''>
          <li>Copy your Yelp page URL (usually looks like 'https://www.yelp.com/biz/{yourbusiness}'</li>
          <li>Optionally, shorten the URL using something like <a href="https://goo.gl/">this URL shortener</a></li>
          <li>Copy the URL into the Account Settings page.</li>
        </ol>`],
    UNEXPECTED_INTERNAL_ERROR: "Unexpected Internal Error. You may need to restart this App",
    FOLLOWUP_STANDARD: [
      'Standard Followup',
      `Follow up with patients in the indicated Feedback Time Window. To find out what patients visited you during the 
        window, please check your appointment records. One or more patients in these windows have either requested a 
        follow-up, or have given poor feedback. Here are some important points to consider:
        <ol>
          <li>Patients who have left poor feedback should be contacted by a senior staff member.</li>
          <li>We don't share precise time of appointment of patients who have provided poor feedback to maintain patient anonymity!</li>
        </ol>
      `],
    FOLLOWUP_TARGETED: [
      'Targeted Followup',
      `Follow up with patients who have left their contact information and indicated that a follow-up may be useful.
       These patients should be contacted by a senior staff member!`],
    FOLLOWUP_AUTOMATIC: [
      'Automatic Followup',
      `The Revvolve App System automatically follows up with patients who have left their contact information
       and indicated that they would like to provide a online review. The status of these follow up activities is provided
       here for your information.`
    ],
    FOLLOWUP_MARK_AS_COMPLETE: [
      'Marking items as complete',
      `For Standard Followups, mark as complete if you have followed up with patients who 
      were in the clinic during the indicated time window`],
    FOLLOWUP_STATUS: [
      'Status',
      `<ol>
        <li>"Not Initiated" state indicates no work has been done.</li>
        <li>"Completed" state indicates the necessary follow up is complete.</li>
      </ol>`],
    FOLLOWUP_STATUS_AUTOMATIC: [
      'Status for Automatic Followups',
      `<ol>
        <li>"Not Initiated" state indicates that the system has not yet started sending a communication to the patient with review instructions.</li>
        <li>"Completed" state indicates the necessary follow up is complete.</li>
      </ol>`],
    FEEDBACK_TIME: ['Feedback Time',`The approximate or precise time when a patient provided a review/feedback indicating a followup would
      be useful`]
  }

  static get(item: string): string {
    let content = HelpMessages.helpContent[item];
    if (!content) {
      Utils.error("Attempted to get Help Content for non-existent item {0}", item);
    }
    return content;
  }

  static getMessageFor(item: string): string {
    return HelpMessages.getTitleAndMessage(item).message;
  }

  static getTitleAndMessage(item: string): {title: string, message: string} {
    let helpMsgData = HelpMessages.get(item);
    let title, message;
    if (Array.isArray(helpMsgData)) {
      title = helpMsgData[0];
      message = helpMsgData[1];
    } else {
      title = item;
      message = helpMsgData;
    }
    return {
      title: title, message: message
    }
  }
}
