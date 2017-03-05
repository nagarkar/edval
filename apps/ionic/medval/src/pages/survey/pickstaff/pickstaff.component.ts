/**
 * Created by Chinmay Nagarkar on 9/30/2016.
 * Copyright HC Technology Inc.
 * Please do not copy without permission. This code may not be used outside
 * of this application without permission. Copying and re-posting on another
 * site or application without licensing is strictly prohibited.
 */
import {Component, Input} from "@angular/core";
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
  templateUrl:'./pickstaff.component.html',
})

@RegisterComponent
export class PickStaffComponent extends SurveyPage {

  @Input()
  roles: string[] = [];
  @Input()
  displayCount: number = 3;
  @Input()
  message: string = "Tell us who worked with you!";

  slides: SlideItem[] = [];
  slideToStaffMap: Map<number, Staff> = new Map<number, Staff>();
  selectedStaff: Set<Staff> = new Set<Staff>();

  constructor(
    idle: Idle,
    utils: Utils,
    navCtrl: NavController,
    sessionSvc: SessionService,
    private staffSvc: StaffService,
    params: NavParams) {

    super(navCtrl, sessionSvc, idle);

    try {

      this.displayCount = params.get('displayCount') || this.displayCount;
      this.roles = params.get("roles") || this.roles;
      this.message = params.get("message") || this.message;
      if (this.staffSvc.listCached().length == 0) {
        super.navigateToNext(true /* Force Navigate */);
        return;
      }
      this.setupSlides();
    } catch(err) {
      super.handleErrorAndCancel(err);
    }

  }

  ngOnInit() {
    super.ngOnInit();
  }

  gotoLogin() {
    Utils.setRoot(this.navCtrl, LoginComponent);
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
    if (this.selectedStaff.size >= this.displayCount) {
      setTimeout(() => {
        this.navigateToNext(true /* ForceNavigate */);
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

  public navigateToNext(forceNavigate?: boolean) {
    this.sessionSvc.getCurrentSession().setStaffUsernames(Staff.getUsernames(this.selectedStaff));
    super.navigateToNext(forceNavigate);
  }
}
