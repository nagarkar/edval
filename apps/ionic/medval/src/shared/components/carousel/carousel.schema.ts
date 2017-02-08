/**
 * Created by Chinmay Nagarkar on 9/30/2016.
 * Copyright HC Technology Inc.
 * Please do not copy without permission. This code may not be used outside
 * of this application without permission. Copying and re-posting on another
 * site or application without licensing is strictly prohibited.
 */
import {Utils} from "../../stuff/utils";
export class SlideItem {
  idx?: number;
  username?: string;
  heading: string;
  subheading: string;
  isSelected?: boolean;
  imgUrl: string;
  currentPlacement?: number;
  style?: string;

  toString() {
    return Utils.stringify(this);
  }
}
