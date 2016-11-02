import { Component, Input, Output, EventEmitter, ElementRef, QueryList, ContentChildren } from '@angular/core';
import {CarouselItem, SlideItem} from "./carousel.schema";
import {Utils} from "../../../shared/stuff/utils";

@Component({
  selector: 'carousel',
  templateUrl: 'carousel.component.html'
})
export class CarouselComponent {

  currentDeg: number = 0;
  containerWidth: number = 250;
  tz: number;
  items: Array<SlideItem> = [];

  @Output()
  selectSlide = new EventEmitter();

  @Output()
  done = new EventEmitter();

  @Input()
  set slides(values: Array<CarouselItem>) {
    if (!values.length) return;

    let degree: number = 0;
    this.tz = 250;//Math.round((this.containerWidth / 2) /
    //Math.tan(Math.PI / values.length));
    this.items = <Array<SlideItem>>values.map((item: CarouselItem, index: number) => {
      let slideItem = {
        idx: index,
        description: item.description,
        imgUrl: item.imgUrl,
        color: item.color,
        currentPlacement: degree,
        isSelected: false,
      };
      degree = degree + 60;
      return slideItem;
    });
  }

  constructor(private eleRef: ElementRef, private utils: Utils) { }

  onSwipeLeft() {
    this.utils.log('swiped left');
    this.currentDeg = this.currentDeg - 60;
    this.applyStyle();
  }

  onSwipeRight() {
    this.utils.log('swiped right');
    this.currentDeg = this.currentDeg + 60;
    this.applyStyle();
  }

  private applyStyle() {
    let ele = this.eleRef.nativeElement.querySelector('.carousel');
    ele.style[ '-webkit-transform' ] = "rotateY(" + this.currentDeg + "deg)";
    ele.style[ '-moz-transform' ] = "rotateY(" + this.currentDeg + "deg)";
    ele.style[ '-o-transform' ] = "rotateY(" + this.currentDeg + "deg)";
    ele.style[ 'transform' ] = "rotateY(" + this.currentDeg + "deg)";
  }

  selectItem(item:any){
    this.utils.log('selected slide: ' + JSON.stringify(item));
    this.selectSlide.emit(item);
  }

  finished() {
    this.done.emit();
  }
}
