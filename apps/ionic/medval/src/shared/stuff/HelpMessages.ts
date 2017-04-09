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
    'account.properties.customerName': ['Organization Name', `This field should be the name of your clinic. A name 
        between 15 and 25 characters works best. If this field is not set properly, it may leave a bad impression with patients.`],
    'account.properties.contactName': ['Contact Person', `This is the title and name of an individual who has the authority
        to follow up with satisfied and dissatisfied patients. This is typically one
        of the senior doctors or administrators. This is an important setting, and is used in the surveys. If this field 
        is not set properly, it may leave a bad impression with patients.`],
    'account.properties.verticalId': ['The type of practice', 'Currently, Orthodontic Clinics & Dental Clinics are supported'],
    'account.customerId': ['Your Unique Organization Id', `When you contact us for support, it would be useful to 
        provide this the Organization Id. The Organization Id should not have any whitespace characters.`],
    'account.email': ['Email', `We will send you your temporary password to 
        this email address, along with other reports/data you ask for, from within the app. After logging in finishing account setup, please verify
        your password, so we can send you recovery passwords when necessary.`],
    'account.username': ['Username', 'You will login using this username. Please provide a valid username: numbers, digits ' +
        'and special charaters are ok, whitespace characters are not ok)'],
    SWEEPSTAKES_INTERVAL: ['Setting Interval',``],
    SWEEPSTAKES_SHOW_WHEEL: ['Wheel of Fortune Game', `Show a 'Wheel of Fortune' game to patients on the 'Thank You' page. 
      <ol>
        <li>A game is a great way to get patients to keep giving feedback</li>
        <li>A patient who provides a review can 'spin the wheel' after a survey, and win a gift card </li>
        <li>You can configure the gift card amount (default: $5). You can also decide how much you want to spend per patient</li>
      </ol>
      For example, if you decide you want the gift card to be $5, and want to spend $1 per patient who provides a review, the game adjusts 
      the odds so that only one in five patients wins. This game is only displayed if the patient is not upset with your service.`],
    SWEEPSTAKES_AWARD_AMOUNT: ['Amount Won in $', `If you have enabled the 'Wheel of Fortune' game, patients win a gift card in 
      this amount if they win. Usually set to a value between 5 and 25. Please make sure you have some gift cards in this amount ready in case someone wins!`],
    SWEEPSTAKES_COST_PER_USE: ['How much you want to spend per patient', `If you have enabled the 'Wheel of Fortune' game, this is the amount 
      you will spend on gift cards per patient who plays this game. Usually set to a value between 0.5 and 5 (dollars).`],
    SHOW_JOKES_ON_THANK_YOU_PAGE: ['Show Jokes', `Control whether you want to show jokes on the thank you page. Jokes make people smile,
      and why not! A smile is a great gift after a healthcare appointment. The jokes are only shown if a patient is not
      upset or highly dissatisfied with service.`],
    REVIEW_URL: ['Online Reviews',`When patients are pleased and express interest in providing an online review, we 
      ask them if they would like to receive a reminder with instructions to do so. In these instructions, we mention 
      the positive things they have expressed about your clinic and provide the link to your clinic's review url. 
      <br/>Click on the help icons for the various review sites on the right, to see how to set up these URLs.`],
    SPEAK_GREETING: ['Say Thank you!',`The App includes a Speech component. Patients can be thanked by the App after they provide a review.`],
    SPEAK_GREETING_RATE: ['How fast to speak', `Set the speed of audio greetings between 1-1.5`],
    CHIME_INTERVAL: [
      'Chime',
      `On the Survey Start page, there is a series of various short, inconspicuous sounds that play at 
        intervals. This is a useful feature to attract patient attention. By setting a large interval, you can effectively 
        disable this feature if you want.`
    ],
    REVIEW_URL_FACEBOOK: ['Get Facebook Reviews',`In order to get Facebook reviews and ratings, you'll need to make sure that your Page category is set to “Local Business”
     in your settings&nbsp;<a href="https://www.facebook.com/help/222732947737668" target="_blank">(instructions)</a>. You can get your page URL with these steps:
        <ol style='text-align:left'>
          <li>Copy your Facebook 'Local Business' page URL (usually looks like 'https://www.facebook.com/{yourBusiness}'</li>
          <li>Optionally, shorten the URL using something like <a href="https://goo.gl/">this URL shortener</a></li>
          <li>Copy the URL</li>
          <li>Go to the Account Settings page in this App, and paste the URL into the correct field</li>
          <li>Instructions for copy/pasting text and urls can be found <a href="http://appleinsider.com/articles/15/06/15/inside-ios-9-apples-quicktype-keyboard-gains-quick-cut-copy-paste-more-on-ipad" target="_blank">here</a></li>
        </ol>`],
    REVIEW_URL_GOOGLE: ['Get Google Reviews', `Here are the steps to get your Google Page URL into this App:
        <ol style='text-align:left'>
          <li>Search for your company by name in Google</li>
          <li>Click on the button “Write a review”</li>
          <li>You'll see a Google review box has popped up, copy the URL out of the address bar</li>
          <li>Optionally, shorten the URL using something like <a href="https://goo.gl/">this URL shortener</a>.</li>
          <li>Go to the Account Settings page in this App, and paste the URL into the correct field</li>
          <li>Instructions for copy/pasting text and urls can be found <a href="http://appleinsider.com/articles/15/06/15/inside-ios-9-apples-quicktype-keyboard-gains-quick-cut-copy-paste-more-on-ipad" target="_blank">here</a></li>
        </ol>`],
    REVIEW_URL_YELP: ['Get Yelp Reviews', `Here are the steps to get your Yelp Page URL into this App:
        <ol style='text-align:left''>
          <li>Copy your Yelp page URL (usually looks like 'https://www.yelp.com/biz/{yourbusiness}'</li>
          <li>Optionally, shorten the URL using something like <a href="https://goo.gl/">this URL shortener</a></li>
          <li>Go to the Account Settings page in this App, and paste the URL into the correct field</li>
          <li>Instructions for copy/pasting text and urls can be found <a href="http://appleinsider.com/articles/15/06/15/inside-ios-9-apples-quicktype-keyboard-gains-quick-cut-copy-paste-more-on-ipad" target="_blank">here</a></li>
        </ol>`],
    UNEXPECTED_INTERNAL_ERROR: "Unexpected Internal Error. You may have lost your internet connection.",
    FOLLOWUP_STANDARD: [
      'Service Hour Followup',
      `This section helps you address patients who gave feedback indicating a poor experience but chose not to provide their
          contact information. We want to maintain patient confidentiality, but also want to help you address patient concerns. As
          a compromise, we indicate in the table below, the service-hour during which you received poor feedback. Please 
          follow up with patients in the indicated service-hour. To find out what patients visited you during the
          window, please check your appointment records. We recommend these contacts be conducted by a senior or
           experienced staff member.
      `],
    FOLLOWUP_TARGETED: [
      'Targeted Followups ',
      `Follow up with patients who have left their contact information and indicated that a follow-up may be useful.
       These patients should be contacted by a senior staff member!`],
    FOLLOWUP_AUTOMATIC: [
      'Automatic Followup',
      `We automatically follow up with patients who have left their contact information and indicated that they would
       like to provide an online review. We send a short email or SMS message indicating when they provided their feedback
       in the clinic, a brief summary of the feedback and the review link you've previously configured in account settings.
        The status of these follow-up activities is provided here for your information, or in case you want to follow up yourself.`
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
      be useful`],
    NO_NETWORK: ['Network Disconnected','There is no internet connection. Please check the connection state in your Device Settings.']
  }

  static get(item: string): string {
    let content = HelpMessages.helpContent[item];
    if (!content) {
      Utils.error("Attempted to get Help Content for non-existent item {0}", item);
    }
    return content;
  }

  static getMessageFor(item: string): any {
    return HelpMessages.getTitleAndMessage(item);
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
