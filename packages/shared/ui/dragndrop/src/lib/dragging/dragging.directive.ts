import { AfterViewInit, ContentChild, Directive, ElementRef, Inject, Input, OnDestroy } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { fromEvent, Subscription, takeUntil } from 'rxjs';
import { DraggingHandleDirective } from '../dragging-handle/dragging-handle.directive';

@Directive({
  selector: '[ngcDrag]'
})
export class DraggingDirective implements AfterViewInit, OnDestroy {
  private _element!: HTMLElement;
  private readonly subscriptions: Subscription[] = [];
  private readonly DEFAULT_DRAGGING_BOUNDARY_QUERY = 'body';

  handleElement!: HTMLElement;
  draggingBoundaryElement!: HTMLElement | HTMLBodyElement;

  @ContentChild(DraggingHandleDirective) handle!: DraggingHandleDirective;

  @Input() boundaryQuery = this.DEFAULT_DRAGGING_BOUNDARY_QUERY;


  constructor(private readonly _elementRef: ElementRef<HTMLElement>,
              @Inject(DOCUMENT) private readonly _document: Document) {
  }

  ngAfterViewInit(): void {
    this.draggingBoundaryElement = (this._document as Document).querySelector(
      this.boundaryQuery
    ) as HTMLElement | HTMLBodyElement;

    if (!this.draggingBoundaryElement) {
      throw new Error(
        'Couldn\'t find any element with query: ' + this.boundaryQuery
      );
    } else {
      this._element = this._elementRef.nativeElement as HTMLElement;
      this.handleElement =
        this.handle?.elementRef?.nativeElement || this._element;
      this.initDrag();
    }
  }

  initDrag(): void {
    const dragStart$ = fromEvent<MouseEvent>(this.handleElement, 'mousedown');
    const dragEnd$ = fromEvent<MouseEvent>(this._document, 'mouseup');
    const drag$ = fromEvent<MouseEvent>(this._document, 'mousemove').pipe(
      takeUntil(dragEnd$)
    );

    let initialX: number,
      initialY: number,
      currentX = 0,
      currentY = 0;

    let dragSub: Subscription = new Subscription();
    const boundary = this.draggingBoundaryElement as HTMLElement;

    const minBoundX = boundary.offsetLeft;
    const minBoundY = boundary.offsetTop;

    const maxBoundX = minBoundX + boundary.offsetWidth - this._element.offsetWidth;
    const maxBoundY = minBoundY + boundary.offsetHeight - this._element.offsetHeight;

    const dragStartSub = dragStart$.subscribe((event: MouseEvent) => {
      initialX = event.clientX - currentX;
      initialY = event.clientY - currentY;
      this._element.classList.add('free-dragging');

      dragSub = drag$.subscribe((event: MouseEvent) => {
        event.preventDefault();

        const x = event.clientX - initialX;
        const y = event.clientY - initialY;

        currentX = Math.max(minBoundX, Math.min(x, maxBoundX));
        currentY = Math.max(minBoundY, Math.min(y, maxBoundY));

        this._element.style.transform =
          'translate3d(' + currentX + 'px, ' + currentY + 'px, 0)';
      });
    });

    const dragEndSub = dragEnd$.subscribe(() => {
      initialX = currentX;
      initialY = currentY;
      this._element.classList.remove('free-dragging');
      if (dragSub) {
        dragSub.unsubscribe();
      }
    });

    this.subscriptions.push.apply(this.subscriptions, [
      dragStartSub,
      dragSub!,
      dragEndSub,
    ]);
  }


  ngOnDestroy(): void {
    this.subscriptions.forEach((s: Subscription) => s?.unsubscribe());
  }
}
