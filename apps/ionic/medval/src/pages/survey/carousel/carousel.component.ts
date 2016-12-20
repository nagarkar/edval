import {
  Component, ViewChild, Input, Output, EventEmitter, ElementRef, QueryList, ContentChildren,
  OnInit
} from '@angular/core';
import { Platform, Slides } from 'ionic-angular';
import {SlideItem} from "./carousel.schema";
import {Utils} from "../../../shared/stuff/utils";

@Component({
  selector: 'carousel',
  templateUrl: 'carousel.component.html'
})
export class CarouselComponent {
  @ViewChild('mySlider') slider: Slides;


  @Output() selectSlide = new EventEmitter();
  @Output() done = new EventEmitter();

  @Input() maxselect: number;
  @Input()
  set slides(values: Array<SlideItem>) {
    if (!values.length) return;

    let degreeIncrement: number = 60;
    this.items = values
      .filter((slideItem: SlideItem, index: number)=>{
        slideItem.currentPlacement = degreeIncrement * index;
        return true;
      });
  }

  items: Array<SlideItem> = [];
  get selectedItems(): Array<SlideItem> {
    return this.items.filter((value: SlideItem)=>{
      return value.isSelected;
    })
  }
  activeSlide: number = 0;
  sliderOptions:any;

  constructor(private eleRef: ElementRef, private utils: Utils, private platform: Platform) {
    this.sliderOptions = {
      pagination: '.swiper-pagination',
      slidesPerView: 'auto',
      centeredSlides: true,
      paginationClickable: true,
      spaceBetween: 30,
      grabCursor: true,
      nextButton: ".swiper-button-next",
      prevButton: ".swiper-button-prev",
      //loop:true,
      initialSlide: Math.floor(this.items.length/2)
    }
    setTimeout(() => {
      console.log("length", this.items.length);
      this.activeSlide = Math.round(this.items.length/2) - 1;
      this.slider.slideTo(this.activeSlide, 1000);
    }, 500);
  }

  selectItem(item: SlideItem){
    item.isSelected = !item.isSelected;
    this.activeSlide = item.idx || this.activeSlide;
    this.slider.slideTo(this.activeSlide, 1000);
    Utils.log('selected slide: ' + Utils.stringify(item));
    this.selectSlide.emit(item);
  }

  removeItem(item: SlideItem) {
    item.isSelected = !item.isSelected;
  }

  onSlideChanged() {
    this.activeSlide = this.slider.getActiveIndex();
    console.log("Current index is", this.activeSlide);
  }

  finished() {
    this.done.emit();
  }

}
