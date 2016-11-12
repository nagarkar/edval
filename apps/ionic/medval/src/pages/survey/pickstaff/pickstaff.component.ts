import {Component, OnInit, ViewChild} from "@angular/core";
import {Utils} from "../../../shared/stuff/utils";
import {StaffService} from "../../../services/staff/delegator";
import {SlideItem } from "../carousel/carousel.schema";
import {Staff} from "../../../services/staff/schema";
import {CarouselComponent} from "../carousel/carousel.component";
import {NavController} from "ionic-angular";
import {LoginComponent} from "../../login/login.component";
import {SurveyComponent} from "../survey.component";
import {SessionService} from "../../../services/session/delegator";
import {Session} from "../../../services/session/schema";
import {Config} from "../../../shared/aws/config";

@Component({
  templateUrl:'pickstaff.component.html'
})
export class PickStaffComponent implements OnInit {

  @ViewChild(CarouselComponent) carousel: CarouselComponent;

  slides: SlideItem[] = [];
  slideToStaffMap: Map<number, Staff> = new Map<number, Staff>();

  selectedStaff: Set<Staff> = new Set<Staff>();

  constructor(
    private utils: Utils,
    private staffSvc: StaffService,
    private sessionSvc: SessionService,
    private navCtrl: NavController) { }

  ngOnInit(): void {
    this.setupSlides();
  }

  gotoLogin() {
    this.utils.setRoot(this.navCtrl, LoginComponent);
  }

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
  }

  private setupSlides() {
    this.staffSvc.list()
      .then((staffList: Staff[]) => {
        this.slideToStaffMap = new Map<number, Staff>();
        let count = 0;
        //this.utils.log("got staff for carousel " + Utils.stringify(staffList));
        this.slides = staffList
          .filter((staff: Staff) => {
            return staff.role != "ADMIN"
          })
          .map<SlideItem>((staff: Staff): SlideItem => {
            this.slideToStaffMap.set(count, staff);
            Utils.log("In setup slides, wtih staff: {0}", staff);
            return <SlideItem>{
              idx: count++,
              heading: staff.displayName,
              subheading: staff.role,
              imgUrl: staff.properties.photoUrl,
              isSelected: false,
            };
          })
      });

    //setTimeout(() =>{
    //  this.startSurvey();
    //}, 20*1000 /* 10 seconds */);
  }

  startSurvey(){
    this.sessionSvc.getCurrentSession().setStaffUsernames(Staff.getUsernames(this.selectedStaff));
    if (this.selectedStaff.size > 0) {
      this.utils.setRoot(this.navCtrl, SurveyComponent, {directPage: true, staff: this.selectedStaff});
      return;
    }
    this.utils.presentProceedCancelPrompt(()=>{
      this.utils.setRoot(this.navCtrl, SurveyComponent, {directPage: true, staff: this.selectedStaff});
    }, `If you forgot to tell us (using the carousel checkboxes) who you worked with today, 
        just click Cancel and try again. If you Proceed, you can still give us a text review.`);
  }
}
