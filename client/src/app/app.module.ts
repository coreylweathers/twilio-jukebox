import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { RouterModule, Routes, Route } from '@angular/router';

import { AppComponent } from './app.component';
import { NavComponent } from './components/app-nav/app-nav.component';
import { SongRequestComponent } from './components/app-song-request/app-song-request.component';
import { SongRequestListComponent } from './components/app-song-request-list/app-song-request-list.component';
import { CurrentSongRequestComponent } from './components/app-current-song-request/app-current-song-request.component';
import { LoginComponent } from './components/app-login/app-login.component';
import { DashboardComponent } from './components/app-dashboard/app-dashboard.component';
import { ConfigComponent } from './components/app-config/app-config.component';
import { HomeComponent } from './components/app-home/app-home.component';
import { CallbackComponent } from './components/app-callback/app-callback.component';


import { SongRequestService } from './services/songrequest.service';
import { WindowRef } from './classes/windowref';
import { SpotifyService } from './services/spotify.service';

const appRoutes: Routes = [
  { path: 'callback', component: CallbackComponent},
  { path: 'login', component: LoginComponent },
  { path: 'logout', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent},
  { path: 'home', component: HomeComponent},
  { path: '', redirectTo: '/home', pathMatch: 'full'},
  { path: '**', component: HomeComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    ConfigComponent,
    CurrentSongRequestComponent,
    DashboardComponent,
    HomeComponent,
    LoginComponent,
    NavComponent,
    SongRequestComponent,
    SongRequestListComponent,
    CallbackComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot(
      appRoutes
    )
  ],
  providers: [SongRequestService, SpotifyService, {provide: 'Window', useValue: window}],
  bootstrap: [AppComponent]
})
export class AppModule { }
