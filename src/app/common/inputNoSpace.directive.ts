import { Directive, ElementRef, HostListener, Input } from '@angular/core';
import { FormGroup, FormControl, NgControl } from '@angular/forms';

@Directive({
  selector:'[input-noSpace]'
})
export class InputNoSpaceDirective{
  constructor(private elementRef: ElementRef, private control: NgControl){
  }
  debugger;
  @HostListener("keydown", ["$event"])
  keydownFun(evt) {
    if (evt.key.trim() === '') {
      evt.preventDefault();
    }
  }
  @HostListener("keyup", ["$event", "$event.target"])
  keyupFun(evt, target) {
    if (target.value) {
      this.control.control.setValue(target.value.replace(/(\s*)/g, ""));
    }
  }
}
