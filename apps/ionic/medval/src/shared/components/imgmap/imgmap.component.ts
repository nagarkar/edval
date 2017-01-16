import {Component, Input, ViewChild, ElementRef, Output, EventEmitter} from "@angular/core";
import {NavController} from "ionic-angular";

declare function Path2D(): void;

/**
 * Shows the header, including the account logo. If not logged in, logo is not shown.
 */
@Component({
  templateUrl: 'imgmap.component.html',
  selector: 'imgmap'
})
export class ImageMapComponent {


  @ViewChild('canvasEl')
  canvasEl: ElementRef;

  ctx: any;

  @Input()
  img: HTMLImageElement;

  @Input()
  imgMap: HTMLMapElement;

  @Output()
  selected: EventEmitter<number> = new EventEmitter<number>();

  paths = [];

  showIcon: boolean;

  iconStyle: any;

  lastSelectedPath: any;

  constructor(private navCtrl: NavController) { }

  ngOnInit() {
    if (!this.img) {
      return;
    }
    let canvas = this.canvasEl.nativeElement;
    this.ctx = canvas.getContext('2d');
    let imageObj = this.img; //document.getElementById(this.img);
    imageObj.onload = () => {
      //let img: HTMLImageElement = document.getElementById('img1') as HTMLImageElement;
      let rect: ClientRect = imageObj.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
      //let areas: any /*HTMLAreasCollection*/ = document.getElementsByName(imageObj.useMap)[0]['areas'];
      this.redraw();
    }
  }

  handleClick(event) {
    let path = this.getSelectedPath(event);
    if (!path) {
      return;
    }
    if (this.lastSelectedPath && this.lastSelectedPath === path.path) {
      this.showIcon = false;
      return;
    }
    this.lastSelectedPath = path.path;
    this.showIcon = true;
    let topLeft: {top:number, left: number} = this.getTopLeft(this.getPointsArray(path.index));
    this.iconStyle = {
      "top": ""+topLeft.top+"px",
      "left": ""+topLeft.left+"px"
    }
    this.redraw(path.index);
    this.selected.emit(path.index);
  }

  onNgDestroy() {
    this.paths = null;
  }

  getPointsArray(i:number): number[][] {
    let points = this.imgMap.areas[i].getAttribute('coords').split(',');
    //alert(points);
    let pointsArr = [];
    let point = [];
    points.forEach((pt)=>{
      if (point.length < 2) {
        point.push(pt);
      };
      if (point.length == 2) {
        pointsArr.push(point);
        point = [];
      };
    });
    return pointsArr;
  }

  getSelectedPath(event): {path: any, index: number} {
    let canvas = this.canvasEl.nativeElement;
    var brect = canvas.getBoundingClientRect();
    // http://stackoverflow.com/questions/17130395/real-mouse-position-in-canvas
    let x = event.x - brect.left;
    let y = event.y - brect.top;
    for(let i = 0; i < this.paths.length; i++) {
      let path = this.paths[i];
      if (this.ctx.isPointInPath(path, x, y)) {
        return {path: path, index: i};
      }
    }
    return null;
  }

  redraw(selected?: number) {
    let canvas = this.canvasEl.nativeElement;
    this.ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < this.imgMap.areas.length; i++) {
      let ptsArray: number[][] = this.getPointsArray(i);
      this.paths.push(this.redrawPath(ptsArray, selected == i));
    }
  }

  redrawPath(ptsArray: number[][], selected?: boolean){
    let path = new Path2D();
    //alert(path);
    path.moveTo(...ptsArray[0]);
    for(let i = 1; i < ptsArray.length; i++) {
      path.lineTo(...ptsArray[i]);
    }
    path.closePath();
    let ctx = this.ctx;
    if (selected) {
      ctx.fillStyle = "rgba(255, 0, 0, .1)"
      ctx.shadowColor = '#333';
      ctx.shadowBlur = 20;
      ctx.shadowOffsetX = 15;
      ctx.shadowOffsetY = 15;
    } else {
      ctx.fillStyle = "rgba(100, 0, 255, 0.1)"
      ctx.shadowColor = '#333';
      ctx.shadowBlur = 20;
      ctx.shadowOffsetX = 15;
      ctx.shadowOffsetY = 15;
    }
    ctx.fill(path);
    return path;
  }

  /*
  private setFill(path: any, alpha: number) {
    let ctx = this.ctx;
    ctx.fillStyle = Utils.format("rgba(100, 100, 250, {0})", alpha);
    ctx.shadowColor = '#333';
    ctx.shadowBlur = 20;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    ctx.fill(path);
  }
  */

  private getTopLeft(pointsArray: number[][]): {top: number, left: number} {
    let top: number = Infinity;
    let left: number = Infinity;
    pointsArray.forEach((point: number[])=>{
      left = Math.min(point[0], left);
      top = Math.min(point[1], top);
    });
    return {top: top, left: left};
  }
}
