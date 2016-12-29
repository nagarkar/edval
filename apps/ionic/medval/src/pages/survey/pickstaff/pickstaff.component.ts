import {Component} from "@angular/core";
import {Utils} from "../../../shared/stuff/utils";
import {StaffService} from "../../../services/staff/delegator";
import {SlideItem} from "../../../shared/components/carousel/carousel.schema";
import {Staff} from "../../../services/staff/schema";
import {NavController, NavParams} from "ionic-angular";
import {LoginComponent} from "../../login/login.component";
import {SessionService} from "../../../services/session/delegator";
import {RegisterComponent} from "../../../services/survey/survey.navigator";
import {SurveyPage} from "../survey.page";
import {Idle} from "@ng-idle/core";

@Component({
  templateUrl:'pickstaff.component.html'
})

@RegisterComponent
export class PickStaffComponent extends SurveyPage {

  private roles: string[] = [];
  slides: SlideItem[] = [];
  slideToStaffMap: Map<number, Staff> = new Map<number, Staff>();

  selectedStaff: Set<Staff> = new Set<Staff>();
  displayCount: number = 3;

  constructor(
    idle: Idle,
    utils: Utils,
    navCtrl: NavController,
    sessionSvc: SessionService,
    private staffSvc: StaffService,
    params: NavParams) {

    super(utils, navCtrl, sessionSvc, idle);
    //SurveyNavUtils.setIdleWatch(idle, () => {utils.setRoot(navCtrl, StartWithSurveyOption);})

    this.displayCount = params.get('displayCount') || 3;

    this.roles = params.get("roles") || [];
    this.setupSlides();
  }

  gotoLogin() {
    this.utils.setRoot(this.navCtrl, LoginComponent);
  }

  /** Click handler for the flat carousel. */
  selectStaff(slideitem: SlideItem) {
    this.processSelection(slideitem, false);
  }

  imageClick(slideitem: SlideItem) {
    this.processSelection(slideitem, true);
  }

  /** Click handler for the rotating carousel. */
  processSelection(slideitem: SlideItem, updateSelected: boolean) {
    const staff: Staff = this.slideToStaffMap.get(slideitem.idx);
    Utils.log("In Pickstaff.selectStaff with item {0}\n {1}\n",
      Utils.stringify(slideitem),
      Utils.stringify(staff))
    if (!slideitem.isSelected) {
      if (updateSelected) {
        slideitem.isSelected = true;
      }
      this.selectedStaff.add(staff);
    } else {
      if (updateSelected) {
        slideitem.isSelected = false;
      }
      this.selectedStaff.delete(staff);
    }
    Utils.log("Image click staff {0} in pickstaff.", staff.username);
    if (this.selectedStaff.size >= this.displayCount) {
      setTimeout(() => {
        this.navigateToNext();
      }, 1000)

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
    this.sessionSvc.getCurrentSession().setStaffUsernames(Staff.getUsernames(this.selectedStaff));
    super.navigateToNext();
  }
}
