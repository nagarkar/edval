import {Component, OnInit, ViewChild} from "@angular/core";
import {Utils} from "../../../shared/stuff/utils";
import {StaffService} from "../../../services/staff/delegator";
import {SlideItem} from "../carousel/carousel.schema";
import {Staff} from "../../../services/staff/schema";
import {CarouselComponent} from "../carousel/carousel.component";
import {NavController, NavParams} from "ionic-angular";
import {LoginComponent} from "../../login/login.component";
import {SessionService} from "../../../services/session/delegator";
import {ServiceFactory} from "../../../services/service.factory";
import {RegisterComponent} from "../../../services/survey/survey.navigator";
import {SurveyNavUtils} from "../SurveyNavUtils";

@Component({
  templateUrl:'pickstaff.component.html'
})

@RegisterComponent
export class PickStaffComponent {

  private roles: string[] = [];
  slides: SlideItem[] = [];
  slideToStaffMap: Map<number, Staff> = new Map<number, Staff>();

  selectedStaff: Set<Staff> = new Set<Staff>();

  constructor(
    private utils: Utils,
    private navCtrl: NavController,
    private sessionSvc: SessionService,
    private staffSvc: StaffService,
    navParams: NavParams) {

    this.roles = navParams.get("roles") || [];
    this.setupSlides();
  }

  gotoLogin() {
    this.utils.setRoot(this.navCtrl, LoginComponent);
  }

  /** Click handler for the flat carousel. */
  selectStaff(slideitem: SlideItem) {
    const staff: Staff = this.slideToStaffMap.get(slideitem.idx);
    Utils.log("In Pickstaff.selectStaff with item {0}\n {1}\n",
      Utils.stringify(slideitem),
      Utils.stringify(staff))
    if (slideitem.isSelected) {
      this.selectedStaff.add(staff);
    } else {
      this.selectedStaff.delete(staff);
    }
    Utils.log("Selected staff {0} in pickstaff.", staff.username);
    if (this.selectedStaff.size > 2) {
      this.navigateToNext();
    }
  }

  /** Click handler for the rotating carousel. */
  imageClick(slideitem: SlideItem) {
    const staff: Staff = this.slideToStaffMap.get(slideitem.idx);
    Utils.log("In Pickstaff.selectStaff with item {0}\n {1}\n",
      Utils.stringify(slideitem),
      Utils.stringify(staff))
    if (!slideitem.isSelected) {
      slideitem.isSelected = true;
      this.selectedStaff.add(staff);
    } else {
      slideitem.isSelected = false;
      this.selectedStaff.delete(staff);
    }
    Utils.log("Image click staff {0} in pickstaff.", staff.username);
    if (this.selectedStaff.size > 2) {
      this.navigateToNext();
    }
  }

  private setupSlides() {
    this.staffSvc.list()
      .then((staffList: Staff[]) => {
        this.slideToStaffMap = new Map<number, Staff>();
        let count = 0;
        //this.utils.log("got staff for carousel " + Utils.stringify(staffList));
        this.slides = staffList
          .sort((a: Staff, b: Staff) => {
            let aIndex: number = this.roles.indexOf(a.role);
            let bIndex: number = this.roles.indexOf(b.role);
            if (aIndex < 0) {
              return -1; // consider a < b
            }
            if (bIndex < 0) {
              return 1; // consider b < a
            }
            return aIndex - bIndex; // If a.role needs to sort first, a.index will be lower.
          })
          .filter((staff: Staff) => {
            return staff.role != "ADMIN"
          })
          .map<SlideItem>((staff: Staff): SlideItem => {
            this.slideToStaffMap.set(count, staff);
            Utils.log("In setup slides, wtih staff: {0}", Utils.stringify(staff));
            return <SlideItem>{
              idx: count++,
              heading: staff.displayName,
              subheading: staff.role,
              imgUrl: staff.properties.photoUrl,
              isSelected: false,
            };
          })
      });

  }

  public navigateToNext() {
    if (this.sessionSvc.hasCurrentSession()) {
      this.sessionSvc.getCurrentSession().setStaffUsernames(Staff.getUsernames(this.selectedStaff));
    }
    SurveyNavUtils.navigateOrTerminate(this.sessionSvc.surveyNavigator, this.navCtrl, this.utils);
  }
}
