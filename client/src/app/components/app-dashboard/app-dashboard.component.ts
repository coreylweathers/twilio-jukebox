import { Component, OnInit, OnDestroy, AfterContentInit } from '@angular/core';
import { SongRequestService } from '../../services/songrequest.service';
import { SongRequest } from '../../classes/songrequest';
import * as $ from 'jquery';
import * as signalR from '@aspnet/signalr';
import { SpotifyService } from '../../services/spotify.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './app-dashboard.component.html',
  styleUrls: ['./app-dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy, AfterContentInit {
  public title = 'app';
  public currentlyPlayingRequest: SongRequest = new SongRequest('', '', '', true);
  public fullRequestList: SongRequest[];
  private connection: signalR.HubConnection;

  constructor(private songRequestService: SongRequestService,
            private spotify: SpotifyService) {
    this.fullRequestList = [];
    this.connection = new signalR.HubConnection('https://localhost:44319/playlisthub');
  }

  ngOnInit() {
    this.connection.start()
      .catch(error => {
        console.error(error);
    });

    // SETUP SPOTIFY
    if (this.spotify.isAuthenticated()) {
      this.spotify.init();
    }

    // SETUP SIGNALR
    this.connection.on('updatePlaylist', (id, name) => {
      console.log(id);
      console.log(name);
      this.spotify.updatePlaylist(id, name);
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

  ngAfterContentInit() {
    this.spotify.getPlaylistTracks()
      .subscribe((result) => {
        result.items.slice(0, 5).forEach(track => {
          console.log(track);
          this.fullRequestList.push(
            new SongRequest(
              track.track.name,
              track.track.artists[0].name,
              track.track.album.images[0].url,
              false,
              track.track.uri));
        });
      }, (error) => {
          console.error('An error occurred while getting the playlist tracks', error);
      },  () => {
        console.log('App component finished init');
        if (this.fullRequestList === null  || this.fullRequestList.length === 0) {
          console.log('Getting the button disabled');
          $('#nextTrackBtn').prop('disabled');
          $('#emptysonglistmsg').removeClass('invisible').addClass('visible');
          $('#currentsongmsg').removeClass('invisible').addClass('visible');
          $('#currentsongcard').remove('visible').addClass('invisible');
          } else {
            this.processRequest();
        }});
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
    if (!this.fullRequestList) {
      console.log('There is nothing in the queue to process.');
      $('#emptysonglistmsg').removeClass('invisible').addClass('visible');
      return;
    }
    this.setCurrentlyPlaying();
    /*this.songRequestService.dequeue().subscribe(() => {
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
