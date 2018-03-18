import { Component, Input, Output, EventEmitter } from '@angular/core';
import { SongRequestService } from './../../services/songrequest.service';
import { SongRequest } from './../../classes/songrequest';
import {} from '@types/spotify-web-playback-sdk';

@Component({
  selector: 'app-song-request',
  templateUrl: './app-song-request.component.html',
  styleUrls: ['./app-song-request.component.css']
})
export class SongRequestComponent {
    @Input() request: SongRequest;
    @Output() reject = new EventEmitter<SongRequest>();
    @Output() play = new EventEmitter<SongRequest>();
}
