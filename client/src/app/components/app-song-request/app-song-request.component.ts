import { Component, Input, Output, EventEmitter } from '@angular/core';
import { SongRequestService } from './../../services/songrequest.service';
import { SongRequest } from './../../classes/songrequest';

@Component({
  selector: 'app-song-request',
  templateUrl: './app-song-request.component.html',
  styleUrls: ['./app-song-request.component.css']
})
export class SongRequestComponent {
    @Input() request: SongRequest;
    @Output() reject = new EventEmitter<SongRequest>();
    @Output() play = new EventEmitter<SongRequest>();
    public onReject() {
      console.log('rejected');
      this.reject.emit(this.request);
     }
     public onPlay() {
       console.log('played');
       this.play.emit(this.request);
       console.log('finished emitting event');
     }
}
