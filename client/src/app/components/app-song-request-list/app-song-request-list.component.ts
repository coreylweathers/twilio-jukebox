import { Component, Input } from '@angular/core';
import { SongRequest } from './../../classes/songrequest';

@Component({
  selector: 'app-song-request-list',
  templateUrl: './app-song-request-list.component.html',
  styleUrls: ['./app-song-request-list.component.css']
})
export class SongRequestListComponent {
  @Input() requestList: Array<SongRequest>;
}
