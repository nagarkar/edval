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

  selectProducer(producer: any) {
    if (this.staffSelected() > 1) {
      this.utils.setRoot(this.navCtrl, SurveyComponent);
    }
    this.utils.log(JSON.stringify(producer));
    this.carousel.onSwipeLeft();
  }

  private setupSlides() {
    this.staffSvc.list()
      .then((staffList: Staff[]) => {
        //this.utils.log("got staff for carousel " + JSON.stringify(staffList));
        this.slides = staffList.map<SlideItem>((value: Staff, idx, arr): SlideItem => {
          return <SlideItem>{
            idx: idx,
            username: value.username,
            description: [value.properties.title, value.properties.firstName, value.properties.lastName].join(' '),
            imgUrl: value.properties.photoUrl,
            isSelected: false,
            currentPlacement: idx*(360/arr.length),
            color:"#000000"
          };
        })
      });

    //setTimeout(() =>{
    //  this.startSurvey();
    //}, 20*1000 /* 10 seconds */);
  }

  startSurvey(){
    this.utils.setRoot(this.navCtrl, SurveyComponent, {directPage: true});
    /* TODO: Actually save the session
    this.sessionSvc.create(new Session()).then(
      (session: Session) => {
        this.utils.setRoot(this.navCtrl, SurveyComponent, {directPage: true});
      }
    )
    */
  }

  private staffSelected() : number {
    let count = 0;
    this.slides.forEach((value: SlideItem)=>{
      if (value.isSelected) count ++;
    })
    return count;
  }
}
