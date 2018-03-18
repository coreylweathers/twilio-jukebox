import { Component, Input } from '@angular/core';
import { SongRequest } from './../../classes/songrequest';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-song-request-list',
  templateUrl: './app-song-request-list.component.html',
  styleUrls: ['./app-song-request-list.component.css']
})
export class SongRequestListComponent {
  @Input() requestList: SongRequest[];
  requestList$: Observable<SongRequest[]>;
}
