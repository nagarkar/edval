import {Component, ViewChild, Input, Output, EventEmitter, Renderer, OnChanges, SimpleChanges} from "@angular/core";
import {Slides} from "ionic-angular";
import {SlideItem} from "./carousel.schema";
import {Utils} from "../../../shared/stuff/utils";

@Component({
  selector: 'carousel',
  templateUrl: 'carousel.component.html'
})
export class CarouselComponent implements OnChanges {
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
  //activeSlide: number = 0;
  sliderOptions:any;

  constructor(private utils: Utils, private renderer: Renderer) {
    /*
    setTimeout(() => {
      console.log("length", this.items.length);
      this.activeSlide = Math.round(this.items.length/2) - 1;
      this.slider.slideTo(this.slider.getActiveIndex(), 1000);
    }, 500);
    */
  }

  ngOnInit() {

  }

  ngOnChanges(changes: SimpleChanges) {
    this.setSlideOptions(false);
    var refreshId = setInterval(() => {
      if (this.activeIndex > -1) {
        this.slider.slideTo(this.sliderOptions.initialSlide);
        clearInterval(refreshId);
      }
    }, 10);
  }

  private setSlideOptions(loop: boolean) {
    this.sliderOptions = {
      pagination: '.swiper-pagination',
      slidesPerView: 'auto',
      centeredSlides: true,
      paginationClickable: true,
      spaceBetween: 30,
      grabCursor: true,
      nextButton: ".swiper-button-next",
      prevButton: ".swiper-button-prev",
      loop:loop,
      initialSlide: Math.floor(this.items.length/2),
    }
    //this.activeSlide = Math.floor(this.items.length/2);
  }

  selectItem(item: SlideItem){
    item.isSelected = !item.isSelected;
    //this.activeSlide = item.idx || this.activeSlide;
    this.slider.slideTo(this.slider.getActiveIndex(), 1000);
    Utils.log('selected slide: ' + Utils.stringify(item));
    this.selectSlide.emit(item);
  }

  removeItem(item: SlideItem): void {
    item.isSelected = !item.isSelected;
  }

  finished(): void {
    this.done.emit();
  }

  get activeIndex() {
    if (this.slider.getSlider()) {
      return this.slider.getActiveIndex();
    }
    return -1;
  }

}
