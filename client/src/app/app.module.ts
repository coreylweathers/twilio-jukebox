import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { NavComponent } from './components/app-nav/app-nav.component';
import { SongRequestComponent } from './components/app-song-request/app-song-request.component';
import { SongRequestListComponent } from './components/app-song-request-list/app-song-request-list.component';

import { SongRequestService } from './services/songrequest.service';

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    SongRequestComponent,
    SongRequestListComponent
  ],
  imports: [
    BrowserModule,
    HttpModule
  ],
  providers: [SongRequestService],
  bootstrap: [AppComponent]
})
export class AppModule { }
