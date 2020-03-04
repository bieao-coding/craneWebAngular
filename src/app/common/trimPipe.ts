import { Pipe, PipeTransform } from '@angular/core';
@Pipe({name: 'trim'})
export class TrimPipe implements PipeTransform {
  transform(value: any): any {
    return value.replace(/[^\u2E80-\u9FFF]+/,'');
  }
}
