export interface CarouselItem {
  description: string;
  imgUrl?: string;
  color?: string
}

export interface SlideItem {
  idx: number;
  username?: string;
  description: string;
  isSelected: boolean;
  imgUrl: string;
  color?: string;
  currentPlacement?: number
}
