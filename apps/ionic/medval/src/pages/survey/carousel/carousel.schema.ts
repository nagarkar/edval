import {Utils} from "../../../shared/stuff/utils";
export class SlideItem {
  idx?: number;
  username?: string;
  heading: string;
  subheading: string;
  isSelected?: boolean;
  imgUrl: string;
  currentPlacement?: number

  toString() {
    return Utils.stringify(this);
  }
}
