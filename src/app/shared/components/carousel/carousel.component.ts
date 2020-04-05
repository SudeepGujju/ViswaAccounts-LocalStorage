import { Component, OnInit, Input } from '@angular/core';
import { trigger, style, transition, animate, group, query } from '@angular/animations';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss'],
  animations: [
    trigger('slider', [
      transition(':increment', group([
        query(':enter', [
          style({
            left: '100%'
          }),
          animate('0.5s ease-out', style('*'))
        ]),
        query(':leave', [
          style({
            marginLeft: '-16px'
          }),
          animate('0.5s ease-out', style({
            left: '-100%'
          }))
        ])
      ])),
      transition(':decrement', group([
        query(':enter', [
          style({
            left: '-100%'
          }),
          animate('0.5s ease-out', style('*'))
        ]),
        query(':leave', [
          style({
            marginLeft: '16px'
          }),
          animate('0.5s ease-out', style({
            left: '100%'
          }))
        ])
      ])),
    ])
  ]
})
export class CarouselComponent implements OnInit {
  @Input()
  set imageList(imageList: string[]) {
    this._imageList = (imageList && imageList.length > 0) ? imageList : [];
  }
  constructor() { }
  get images() {
    return [this._imageList[this.selectedIndex]];
  }

  private _imageList: string[] = [];

  disableNext = false;
  disablePrvs = false;
  timeIntervalId: any;

  selectedIndex = 0;

  ngOnInit() {
    // this.InitAutoSlide();
  }

  previous() {

    if (this.disablePrvs) { return false; }

    this.disablePrvs = true;

    this.clearAutoSlide();
    if (this.selectedIndex === 0) {
      this.selectedIndex = this._imageList.length - 1;
    } else {
      this.selectedIndex = Math.max(this.selectedIndex - 1, 0);
    }
    this.InitAutoSlide();

    setTimeout(() => { this.disablePrvs = false; }, 500);

  }

  next() {

    if (this.disableNext) { return false; }

    this.disableNext = true;
    this.clearAutoSlide();
    if (this.selectedIndex === this._imageList.length - 1) {
      this.selectedIndex = 0;
    } else {
      this.selectedIndex = Math.min(this.selectedIndex + 1, this._imageList.length - 1);
    }
    this.InitAutoSlide();

    setTimeout(() => { this.disableNext = false; }, 500);
  }

  InitAutoSlide() {
    this.timeIntervalId = setInterval(() => {

      if (this.selectedIndex === this._imageList.length - 1) {
        this.selectedIndex = 0;
      } else {
        this.next();
      }

    }, 2000);
  }

  clearAutoSlide() {
    clearInterval(this.timeIntervalId);
  }
}
