import { NgModule } from '@angular/core';

/*Angular material*/
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';

import { CarouselComponent, CardListComponent } from './components';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
    declarations: [
        CarouselComponent,
        CardListComponent
    ],
    imports: [
        BrowserAnimationsModule,
        MatButtonModule,
        MatIconModule,
        MatInputModule,
        MatCardModule
    ],
    exports: [
        CarouselComponent,
        CardListComponent
    ]
})
export class SharedModule {

}
