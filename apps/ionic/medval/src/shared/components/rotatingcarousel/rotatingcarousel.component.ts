/**
 * Created by Chinmay Nagarkar on 9/30/2016.
 * Copyright HC Technology Inc.
 * Please do not copy without permission. This code may not be used outside
 * of this application without permission. Copying and re-posting on another
 * site or application without licensing is strictly prohibited.
 */
import {Component, Input, Output, EventEmitter, ElementRef} from "@angular/core";
import {SlideItem} from "../carousel/carousel.schema";

@Component({
  selector: 'rotating-carousel',
  templateUrl: "./rotatingcarousel.component.html"
})
export class RotatingCarousel {
  private currentDeg: number = 0;
  items: Array<SlideItem> = [];
  tz: number;

  @Output() imageClicked = new EventEmitter();
  @Output() done = new EventEmitter();

  @Input()
  set slides(values: Array<SlideItem>) {
    if (!values.length) return;
    let numElements = values.length;
    let degree: number = 0;
    this.tz = 250;//Math.round((this.containerWidth / 2) /
    let degreeIncrement: number;
    let initialTransitionDurationSec: number;
    if (numElements >= 5) {
      degreeIncrement = 360/numElements;
      this.currentDeg = - 120;
      initialTransitionDurationSec = 1;
    } else {
      degreeIncrement = 60;
      this.currentDeg = - ( (numElements - 1) * 30);
    }
    setTimeout(()=>{
      this.applyStyle(initialTransitionDurationSec);
    }, 50);

    this.items = values
      .filter((slideItem: SlideItem, index: number)=>{
        slideItem.currentPlacement = degree;
        degree = degree + degreeIncrement;
        return true;
      });
  }

  get selectedItems(): Array<SlideItem> {
    let selectedItems: Array<SlideItem> = this.items.filter((value: SlideItem)=>{
      return value.isSelected;
    })
    return selectedItems;
  }

  constructor(private eleRef: ElementRef) {
  }


  removeItem(item: SlideItem): void {
    item.isSelected = !item.isSelected;
  }

  onSwipeLeft() {
    this.currentDeg = this.currentDeg - 60;
    this.applyStyle();
  }

  onSwipeRight() {
    this.currentDeg = this.currentDeg + 60;
    this.applyStyle();
  }

  private applyStyle(seconds? : number) {
    let ele = this.eleRef.nativeElement.querySelector('.carousel');
    if (seconds) {
      ele.style['transition-duration'] = seconds + "s";
    } else {
      ele.style['transition-duration'] = "";
    }
    ele.style[ '-webkit-transform' ] = "rotateY(" + this.currentDeg + "deg)";
    ele.style[ '-moz-transform' ] = "rotateY(" + this.currentDeg + "deg)";
    ele.style[ '-o-transform' ] = "rotateY(" + this.currentDeg + "deg)";
    ele.style[ 'transform' ] = "rotateY(" + this.currentDeg + "deg)";
  }

  finished(): void {
    this.done.emit();
  }

  imageClick(item:any){
    this.imageClicked.emit(item);
  }
}
