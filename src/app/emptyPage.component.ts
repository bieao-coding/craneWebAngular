import { Component,OnInit} from '@angular/core';

@Component({
  selector: 'app-empty',
  template: ``
})
export class EmptyPageComponent implements OnInit{
  constructor(){
  }
  ngOnInit(){
    window.location.href = '/';
  }
}
