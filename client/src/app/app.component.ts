import { Component, OnInit } from '@angular/core';
import { SongRequestService } from './services/songrequest.service';
import { SongRequest } from './classes/songrequest';
import * as $ from 'jquery';
import {} from '@types/spotify-web-playback-sdk';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {}
