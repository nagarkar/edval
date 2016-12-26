import { Component, Input, Output, EventEmitter, ElementRef } from '@angular/core';
import {SlideItem} from "../carousel/carousel.schema";

@Component({
  selector: 'rotating-carousel',
  templateUrl: "rotatingcarousel.component.html"
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
    let degree: number = 0;
    this.tz = 250;//Math.round((this.containerWidth / 2) /
    let degreeIncrement: number = 360/values.length;
    this.items = values
      .filter((slideItem: SlideItem, index: number)=>{
        slideItem.currentPlacement = degree;
        degree = degree + degreeIncrement;
        return true;
      });
  }

  get selectedItems(): Array<SlideItem> {
    return this.items.filter((value: SlideItem)=>{
      return value.isSelected;
    })
  }

  constructor(private eleRef: ElementRef) {
    console.log("in carousel constructor")
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

  private applyStyle() {
    let ele = this.eleRef.nativeElement.querySelector('.carousel');
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
