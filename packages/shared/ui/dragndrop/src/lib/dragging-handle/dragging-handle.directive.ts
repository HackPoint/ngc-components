import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[ngcDraggingHandle]'
})
export class DraggingHandleDirective {

  constructor(readonly elementRef: ElementRef<HTMLElement>) {}

}
