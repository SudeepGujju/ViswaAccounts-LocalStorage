import { Component, OnInit, ViewChild, NgZone, ElementRef, AfterViewInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { MatSidenavContent } from '@angular/material/sidenav';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit, AfterViewInit {

// @ViewChild(MatSidenavContent, { static: false }) sideNavContent: MatSidenavContent;
  @ViewChild('contentDiv', { static: false }) contentDiv: ElementRef;

  public isHandSet$: Observable<boolean>;
  public displayScrollTop = false;

  constructor(private breakpointObserver: BreakpointObserver, private ngZone: NgZone, private iconRegistry: MatIconRegistry, private sanitizer: DomSanitizer) {

    iconRegistry.addSvgIcon('sign-in-alt', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/sign-in-alt-solid.svg'));

    this.isHandSet$ = breakpointObserver.observe([Breakpoints.XSmall]).pipe(
      map((result) => result.matches),
      shareReplay()// Find Usage
    );

  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    /* this.sideNavContent.elementScrolled().subscribe((result) => {
      this.ngZone.run(() => {
        if (this.sideNavContent.measureScrollOffset('top') > 20)
          this.displayScrollTop = true;
        else
          this.displayScrollTop = false;
      })
    }) */
  }

  scrollToTop() {
    // this.sideNavContent.scrollTo({ top: 0, behavior: 'smooth' });
    this.contentDiv.nativeElement.scrollTo({ top: 0, behavior: 'smooth' });
  }

  onContentScroll(event) {
    if (event.target.scrollTop > 50) {
      this.displayScrollTop = true;
    } else {
      this.displayScrollTop = false;
    }
  }
}
