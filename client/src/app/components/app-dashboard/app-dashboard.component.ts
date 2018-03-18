import { Component, OnInit, OnDestroy } from '@angular/core';
import { SongRequestService } from '../../services/songrequest.service';
import { SongRequest } from '../../classes/songrequest';
import * as $ from 'jquery';
import * as signalR from '@aspnet/signalr';
import {} from '@types/spotify-web-playback-sdk';

@Component({
  selector: 'app-dashboard',
  templateUrl: './app-dashboard.component.html',
  styleUrls: ['./app-dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {
  public title = 'app';
  public currentlyPlayingRequest: SongRequest = new SongRequest('', '', '', true);
  public fullRequestList: SongRequest[];
  private connection: signalR.HubConnection;

  constructor(private songRequestService: SongRequestService) {
    this.fullRequestList = [];
    this.connection = new signalR.HubConnection('https://localhost:44319/playlisthub');
  }

  ngOnInit() {
    this.connection.start().then((conn) => {
      console.log(`Connection started: ${conn}`);
    }).catch(error => {
      console.error(error);
    });
    // SETUP SPOTIFY

    // SETUP SIGNALR
    this.connection.on('SendMessage', (user, message) => {
      console.log(user);
      console.log(message);
    });
    // GET THE LIST
    /*this.songRequestService.getAllRequests()
      .subscribe(
        (requests) => {
          requests.forEach(element => {
            this.fullRequestList.push
            (new SongRequest(
              element['songTitle'],
              element['artistName'],
              element['artistImageUrl'],
              element['currentlyPlaying'],
              element['songUrl']));
          });
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
            this.processRequest();
        }
      }
    );*/
  }

  ngOnDestroy() {
    this.connection.stop();
  }

  public onPlayRequest(request: SongRequest) {
    console.log('setting the request');
    try {
        this.processRequest();
    }catch (err) {
      console.error(`An error has occurred: ${err}`);
    }
  }
  private processRequest() {
    /*if (!this.fullRequestList) {
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
      });*/
  }

  private setCurrentlyPlaying() {
    const request = this.fullRequestList.shift();
    console.log(request);
    request.currentlyplaying = true;
    this.currentlyPlayingRequest = request;
  }
}
