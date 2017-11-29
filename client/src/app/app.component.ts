import { Component, OnInit } from '@angular/core';
import { SongRequestService } from './services/songrequest.service';
import { SongRequest } from './classes/songrequest';
import * as $ from 'jquery';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  public title = 'app';
  public currentlyPlayingRequest: SongRequest = new SongRequest('', '', '', true);
  public fullRequestList: Array<SongRequest>;

  constructor(private songRequestService: SongRequestService) {
  }

  ngOnInit() {
    // GET THE LIST
    this.songRequestService.getAllRequests()
      .subscribe(requests => {
        this.fullRequestList = requests;
      },
      (err) => {
        console.error(`An error has occurred: ${err}`);
      },
      () => {
        console.log('App component finished init');
        if (this.fullRequestList === null  || this.fullRequestList.length === 0) {
          console.log('Getting the button disabled');
          $('#nextTrackBtn').prop('disabled');
          $('#emptysonglistmsg').removeClass('invisible').addClass('visible');
          $('#currentsongmsg').removeClass('invisible').addClass('visible');
          $('#currentsongcard').remove('visible').addClass('invisible');
          } else {
          this.processRequest(true);
        }
      }
    );
  }

  public onPlayRequest(request: SongRequest) {
    console.log('setting the request');
    try {
        this.processRequest(false);
    }catch (err) {
      console.error(`An error has occurred: ${err}`);
    }
  }

  private processRequest(isFirstTime: boolean) {
    if (!this.fullRequestList) {
      console.log('There is nothing in the queue to process.');
      $('#emptysonglistmsg').removeClass('invisible').addClass('visible');
      return;
    }
    this.setCurrentlyPlaying();
    this.songRequestService.dequeue().subscribe(() => {
      console.log('Item successfully dequeued');
      },
      (err) => {
        console.error(`An error occurred: ${err}`);
      },
      () => {
        console.log('Subscription completed');
        this.songRequestService.getAllRequests()
          .subscribe(requests => {
            this.fullRequestList = requests;
        });
      });
  }

  private setCurrentlyPlaying() {
    const request = this.fullRequestList.shift();
    console.log(request);
    request.currentlyPlaying = true;
    this.currentlyPlayingRequest = request;
  }
}
