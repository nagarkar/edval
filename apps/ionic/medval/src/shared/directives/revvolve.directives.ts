import {Directive, ElementRef, Input, Renderer} from "@angular/core";
import {Account} from "../../services/account/schema";
/**
 * Created by chinmay on 3/27/17.
 * Copyright HC Technology Inc.
 * Please do not copy without permission. This code may not be used outside
 * of this application without permission. Copying and re-posting on another
 * site or application without licensing is strictly prohibited.
 */

declare let w3color;

export class w3ColorCache {
  static w3HexColors = {};

  static getFromHex(col: string): any {
    if (!w3ColorCache.w3HexColors[col]) {
      w3ColorCache.w3HexColors[col] = new w3color(w3ColorCache.fromHexToRgb(col));
    }
    return w3ColorCache.w3HexColors[col];
  }

  static fromHexToRgb(value): string {
    var str = String(value);
    str = str.trim();
    if (str.startsWith("#")){
      str = str.slice(1);
    }
    if (str.length < 6) {
      throw new Error('Colors should be in form #xxyyzz or xxyyzz');
    }
    var r = parseInt(str.slice(0,2), 16);
    var g = parseInt(str.slice(2,4), 16);
    var b = parseInt(str.slice(4,6), 16);
    return "RGB(" + r + "," + g + "," + b + ")";
  }
}

@Directive({
  selector: '[backgroundColor]'
})
export class BackgroundColor {

  @Input('backgroundColor')
  set color(v:string) {
    this.el.nativeElement.style.backgroundColor = Account.getBrandingAttribute(v, false);
  }

  constructor(private el: ElementRef) { }
}

@Directive({
  selector: '[primary-button]'
})
export class PrimaryButton {

  constructor(private el: ElementRef) {
    let primaryColor = Account.getBrandingAttribute('primaryColor');
    let buttonTextColor = Account.getBrandingAttribute('buttonTextColor');
    this.el.nativeElement.style.backgroundColor = primaryColor;
    this.el.nativeElement.style.color = buttonTextColor;
  }
}

@Directive({
  selector: '[primary-color]'
})
export class PrimaryColor {

  constructor(private el: ElementRef, renderer: Renderer) {
    let primaryColor = Account.getBrandingAttribute('primaryColor');
    let buttonTextColor = Account.getBrandingAttribute('buttonTextColor');
    let hel: HTMLElement = this.el.nativeElement;
    let classList = hel.classList;
    if (classList.contains('button-outline')) {
      this.el.nativeElement.style.borderColor = primaryColor;
      this.el.nativeElement.style.color = primaryColor;
    } else if (classList.contains('button')) {
      this.el.nativeElement.style.backgroundColor = primaryColor;
      this.el.nativeElement.style.color = buttonTextColor;
    } else {
      this.el.nativeElement.style.color = primaryColor;
    }
  }
}

@Directive({
  selector: '[secondary-button]'
})
export class SecondaryButton {

  constructor(private el: ElementRef) {
    let secondaryColor = Account.getBrandingAttribute('secondaryColor');
    let buttonTextColor = Account.getBrandingAttribute('buttonTextColor');
    this.el.nativeElement.style.backgroundColor = secondaryColor;
    this.el.nativeElement.style.color = buttonTextColor;
  }
}

@Directive({
  selector: '[tertiary-button]'
})
export class TertiaryButton {

  constructor(private el: ElementRef) {
    let tertiaryColor = Account.getBrandingAttribute('tertiaryColor');
    let buttonTextColor = Account.getBrandingAttribute('buttonTextColor');
    this.el.nativeElement.style.backgroundColor = tertiaryColor;
    this.el.nativeElement.style.color = buttonTextColor;
  }
}

@Directive({
  selector: '[light-button]'
})
export class LightButton {

  constructor(private el: ElementRef) {
    let lightColor = Account.getBrandingAttribute('lightColor');
    let buttonTextColor = Account.getBrandingAttribute('buttonTextColor');
    this.el.nativeElement.style.backgroundColor = lightColor;
    this.el.nativeElement.style.color = buttonTextColor;
  }
}

@Directive({
  selector: '[primary-box]'
})
export class PrimaryBox {

  constructor(private el: ElementRef) {
    let primaryColor = Account.getBrandingAttribute('primaryColor');
    let style = this.el.nativeElement.style;
    style.borderBottomColor = primaryColor;
    style.borderBottomWidth = "9px";
    style.borderBottomStyle = "solid";
    style.padding = "0px 5px 0 5px";
    //style.backgroundColor = PrimaryBox.getBackgroundColorFor(primaryColor);
  }

  static backgroundColorCache = {};

  private static getBackgroundColorFor(primaryColor: any) {
    if (!PrimaryBox.backgroundColorCache[primaryColor]) {
      let bColor = new w3color(w3ColorCache.getFromHex(primaryColor));
      bColor.lighter((100 - bColor.lightness * 100) - 10);
      PrimaryBox.backgroundColorCache[primaryColor] = bColor.toHexString();
    }
    return PrimaryBox.backgroundColorCache[primaryColor];
  }
}

@Directive({
  selector: '[primary-img]'
})
export class PrimaryImage {

  constructor(private el: ElementRef, private renderer: Renderer) {
    let primaryColor = Account.getBrandingAttribute('primaryColor');
    let targetColor = w3ColorCache.getFromHex(primaryColor);

    let hel: HTMLElement = this.el.nativeElement;
    let hueRotation = targetColor.hue - PrimaryImage.sourceColor.hue;
    let filter = "hue-rotate("+ hueRotation +"deg) " +
      //"saturate("+ (1 + Math.abs(PrimaryImage.sourceColor.sat - targetColor.sat)) * 100 + "%) " +
      //"brightness("+ (1 + Math.abs(PrimaryImage.sourceColor.lightness - targetColor.lightness)) * 100 + "%)";
      "saturate("+ (1 - Math.abs(PrimaryImage.sourceColor.sat - targetColor.sat)) * 100 + "%) " +
      "brightness("+ (1 - Math.abs(PrimaryImage.sourceColor.lightness - targetColor.lightness)) * 100 + "%)";
    this.renderer.setElementStyle(hel, 'filter', filter);
    this.renderer.setElementStyle(hel, 'webkitFilter', filter);
    //hel.style.filter = filter;
    //hel.style['-webkit-filter'] = filter;
  }

  static sourceColor = w3ColorCache.getFromHex('#27AE60');
}

@Directive({
  selector: '[with-boundary]'
})
export class WithBoundary {

  constructor(private el: ElementRef) {}
  ngAfterViewInit(){
    this.el.nativeElement.children[0].style = "border: 1px solid black;" +
      "padding: .1em 0 .1em .3em;" +
      "font-family: monospace;";
  }
}

export const REVVOLVE_DIRECTIVES: any[] = [
  LightButton,
  TertiaryButton,
  SecondaryButton,
  PrimaryButton,
  PrimaryColor,
  BackgroundColor,
  PrimaryBox,
  PrimaryImage,
  WithBoundary,
];
