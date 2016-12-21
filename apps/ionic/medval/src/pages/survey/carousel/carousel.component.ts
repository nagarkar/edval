import {
  Component, ViewChild, Input, Output, EventEmitter, ElementRef, QueryList, ContentChildren,
  OnInit, Renderer
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

  constructor(private utils: Utils, private renderer: Renderer) {
    let me = this;
    this.sliderOptions = {
      pagination: '.swiper-pagination',
      slidesPerView: 'auto',
      centeredSlides: true,
      paginationClickable: true,
      spaceBetween: 30,
      grabCursor: true,
      nextButton: ".swiper-button-next",
      prevButton: ".swiper-button-prev",
      loop:true,
      initialSlide: 0,
      onSlideChangeStart: (swiper) => {
        /*
                 me.renderer.listen(swiper, 'click', (event) => {
                    console.log(event);
                  })
                  
                  console.log(swiper);
                console.log('mySwiper.slides.length - 2',swiper.slides.length - 2);
                console.log('current slide',(swiper.activeIndex - 1) % (swiper.slides.length - 2));
*/
                this.activeSlide = swiper.activeIndex;
                if(this.activeSlide > this.items.length) this.activeSlide = swiper.activeIndex - this.items.length;
                swiper.createLoop();
                
                if (swiper.activeIndex > swiper.previousIndex) { //go forward
                    //console.log(this.slider);
                    this.next(swiper);
                }
                else if (swiper.activeIndex < swiper.previousIndex) { //go backward
                    this.prev(swiper);
                }
            }
    }

    //initialSlide: Math.floor(this.items.length/2)
    setTimeout(() => {
      console.log("length", this.items.length);
      //this.activeSlide = Math.round(this.items.length/2) - 1;
      //this.slider.slideTo(4, 3000);
    }, 500);

  }

  next(swiper) {
    
    //this.slider.slideTo(1, 1000);
    console.log('swiper.activeIndex:next',this.activeSlide);
    //console.log('this.slider.getActiveIndex():next', this.slider.getActiveIndex());
    //swiper.createLoop();
	}
	
	prev(swiper) {
    console.log('swiper.activeIndex:prev',swiper.activeIndex);
    //console.log('this.slider.getActiveIndex():prev', this.slider.getActiveIndex());
    //this.slider.slideTo(1, 1000);
    //swiper.createLoopssss();
	}

  selectItem(item: SlideItem){
    item.isSelected = !item.isSelected;
    //this.activeSlide = item.idx || this.activeSlide;
    //this.slider.slideTo(this.activeSlide, 1000);
    Utils.log('selected slide: ' + Utils.stringify(item));
    this.selectSlide.emit(item);
  }

  removeItem(item: SlideItem) {
    item.isSelected = !item.isSelected;
  }

  onSlideChanged() {
    //this.activeSlide = this.slider.getActiveIndex();
    console.log("Current index is", this.activeSlide);
  }

  finished() {
    this.done.emit();
  }

}
