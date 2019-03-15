import { Directive, HostListener, ElementRef, ViewContainerRef, ComponentFactoryResolver, Input, OnInit } from '@angular/core';
import { ImageMarkerComponent } from './image-marker.component';

@Directive({
  selector: '[appMarker]'
})
export class MarkerDirective implements OnInit {

  constructor(
    private el: ElementRef,
    private viewContainerRef: ViewContainerRef,
    private componentFactoryResolver: ComponentFactoryResolver
  ) { }

  ngOnInit() {
    this.el.nativeElement.style.position = 'relative';
  }

  @HostListener('click', ['$event'])
  onMouseDown(event: any) {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(ImageMarkerComponent);
    const componentRef = this.viewContainerRef.createComponent(componentFactory);
    componentRef.instance.x = `${event.offsetX}px`;
    componentRef.instance.y = `${event.offsetY}px`;
    componentRef.instance.onDel.subscribe(x => componentRef.destroy());
  }

}
