import { Component, ViewChild, Input, Output, EventEmitter, ElementRef, QueryList, ContentChildren } from '@angular/core';
import { Platform } from 'ionic-angular';
import {SlideItem} from "./carousel.schema";
import {Utils} from "../../../shared/stuff/utils";

@Component({
  selector: 'carousel',
  templateUrl: 'carousel.component.html'
})
export class CarouselComponent {
  _options:any;
  @ViewChild('mySlider') mySlider: any;

  currentDeg: number = 0;
  containerWidth: number = 250;
  tz: number;
  items: Array<SlideItem> = [];

  @Output()
  selectSlide = new EventEmitter();

  @Output()
  done = new EventEmitter();

  @Input()
  set slides(values: Array<SlideItem>) {
    if (!values.length) return;

    let degreeIncrement: number = 60;
    this.tz = 250;//Math.round((this.containerWidth / 2) /
    //Math.tan(Math.PI / values.length));
    this.items = values
      .filter((slideItem: SlideItem, index: number)=>{
        slideItem.currentPlacement = degreeIncrement * index;
        return true;
      });
  }
  big:boolean = false;
  constructor(private eleRef: ElementRef, private utils: Utils, private platform: Platform) {
    this.platform = platform;
    if(this.platform.is('ipad') || this.platform.is('tablet') || this.platform.is('core')) {
      this.big = true;
      this._options = {
        pagination: '.swiper-pagination',
        effect: 'coverflow',
        grabCursor: true,
        centeredSlides: true,
        slidesPerView: 'auto',
        coverflow: {
          rotate: 50,
          stretch: 0,
          depth: 100,
          modifier: 1,
          slideShadows : true
        },
        nextButton: ".swiper-button-next",
        prevButton: ".swiper-button-prev",
      }
    } else {
      this.big = false;
      this._options = {
        pagination: '.swiper-pagination',
        effect: 'coverflow',
        grabCursor: true,
        centeredSlides: true,
        slidesPerView: 'auto',
        coverflow: {
          rotate: 50,
          stretch: 0,
          depth: 100,
          modifier: 1,
          slideShadows : true
        }
      }
    }
  }

  onSwipeLeft() {
    Utils.log('swiped left');
    this.currentDeg = this.currentDeg - 60;
    this.applyStyle();
  }

  onSwipeRight() {
    Utils.log('swiped right');
    this.currentDeg = this.currentDeg + 60;
    this.applyStyle();
  }

  private applyStyle() {
    let ele = this.eleRef.nativeElement.querySelector('.carousel');
    if (!ele) {
      return;
    }
    ele.style[ '-webkit-transform' ] = "rotateY(" + this.currentDeg + "deg)";
    ele.style[ '-moz-transform' ] = "rotateY(" + this.currentDeg + "deg)";
    ele.style[ '-o-transform' ] = "rotateY(" + this.currentDeg + "deg)";
    ele.style[ 'transform' ] = "rotateY(" + this.currentDeg + "deg)";
  }

  selectItem(item: SlideItem){
    item.isSelected = !item.isSelected;
    Utils.log('selected slide: ' + Utils.stringify(item));
    this.selectSlide.emit(item);
  }

  removeItem(item: SlideItem) {
    item.isSelected = !item.isSelected;
  }

  finished() {
    this.done.emit();
  }

}
