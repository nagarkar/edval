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
