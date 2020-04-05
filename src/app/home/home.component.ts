import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  public imageList: string[] = [
    'https://pixelz.cc/wp-content/uploads/2018/08/wall-e-uhd-4k-wallpaper.jpg',
    'https://i.pinimg.com/originals/23/26/c5/2326c5a4ded3fcdf3c80ad237ab46b3f.jpg',
    'https://images.unsplash.com/photo-1521540546296-9f2d04fd9261?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1500&q=80'
  ];

  public mainCardsList: object[] = [
    {
      title: 'Headphones',
      src: '/assets/images/headphones.jpg'
    },
    {
      title: 'Bags',
      src: '/assets/images/bag.jpg'
    },
    {
      title: 'Shoes',
      src: '/assets/images/shoe.jpg'
    },
    {
      title: 'Watches',
      src: '/assets/images/watches.jpg'
    },
    {
      title: 'Chairs',
      src: '/assets/images/chair.jpg'
    }
  ];

  constructor() { }

  ngOnInit() {
  }



}
