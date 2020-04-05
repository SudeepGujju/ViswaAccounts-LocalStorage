import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-card-list',
  templateUrl: './card-list.component.html',
  styleUrls: ['./card-list.component.scss']
})
export class CardListComponent implements OnInit {

  // @Input()
  // set cardsList(cardsList: object[]){
  //   console.log(cardsList)
  // };

  @Input() cardsList: object[];

  constructor() {
  }

  ngOnInit() {
  }

}
