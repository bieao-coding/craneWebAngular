import { Directive,Input } from '@angular/core';
import { Validator, AbstractControl, NG_VALIDATORS } from '@angular/forms';


@Directive({
  selector: '[validateLeastOne]',
  providers: [
    { provide: NG_VALIDATORS, useExisting: LeastOneValidatorDirective, multi: true }
  ]
})
export class LeastOneValidatorDirective implements Validator {
  @Input()validateLeastOne: string;
  constructor() { }

  validate(control: AbstractControl): { [key: string]: any } {
    //当前控件的值
    const selfValue = control.value;

    // 需要比较的控件，根据属性名称获取
    const targetControl = control.root.get(this.validateLeastOne);
    if(!selfValue && !targetControl.value){
      targetControl.setErrors({
        validateLeastOne: true
      })
    }else{
      targetControl.setErrors(null);
    }
    return null;
  }
}
