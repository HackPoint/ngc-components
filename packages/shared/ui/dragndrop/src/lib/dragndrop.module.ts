import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DraggingDirective } from './dragging/dragging.directive';
import { DraggingHandleDirective } from './dragging-handle/dragging-handle.directive';

@NgModule({
  imports: [CommonModule],
  declarations: [DraggingDirective, DraggingHandleDirective],
  exports: [DraggingDirective, DraggingHandleDirective]
})
export class DragndropModule {
}
