import {Component, ViewChild, Input, Output, EventEmitter, Renderer, OnChanges, SimpleChanges} from "@angular/core";
import {Slides} from "ionic-angular";
import {SlideItem} from "./carousel.schema";
import {Utils} from "../../stuff/utils";

@Component({
  selector: 'carousel',
  templateUrl: './carousel.component.html'
})
export class CarouselComponent implements OnChanges {
  items: Array<SlideItem> = [];

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

  get selectedItems(): Array<SlideItem> {
    return this.items.filter((value: SlideItem)=>{
      return value.isSelected;
    })
  }
  sliderOptions:any;

  constructor(private renderer: Renderer) {}

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
  }

  selectItem(item: SlideItem){
    item.isSelected = !item.isSelected;
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
