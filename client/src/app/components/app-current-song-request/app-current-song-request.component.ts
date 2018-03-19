import { Component, Input, Inject, OnInit, OnDestroy } from '@angular/core';
import { SongRequest } from '../../classes/songrequest';
import { SpotifyService } from '../../services/spotify.service';

@Component({
  selector: 'app-current-song-request',
  templateUrl: './app-current-song-request.component.html',
  styleUrls: ['./app-current-song-request.component.css']
})
export class CurrentSongRequestComponent implements OnInit, OnDestroy {
    @Input() public request: SongRequest;
    public player: Spotify.SpotifyPlayer;
    private token: string;

    constructor(@Inject('Window') private window: Window,
                private spotify: SpotifyService) {
    }
    ngOnInit() {
      this.window.onSpotifyWebPlaybackSDKReady = () => {
            this.token = <string>this.spotify.getToken();
            // tslint:disable-next-line:max-line-length
            this.player = new Spotify.Player({
              name: 'Twilio Jukebox',
              getOAuthToken: cb => { cb(this.token); }
            });
            // Error handling
            this.player.on('initialization_error', e => { console.error(e); });
            this.player.on('authentication_error', e => { console.error(e); });
            this.player.on('account_error', e => { console.error(e); });
            this.player.on('playback_error', e => { console.error(e); });
            // Playback status updates
            this.player.on('player_state_changed', state => { console.log(`State has changed: ${state}`); });
            // Ready
            this.player.on('ready', data => {
              const device_id = data;
              console.log('Ready with Device ID', device_id);
            });
            // Connect to the player!
            this.player.connect();
          };
        }

    ngOnDestroy() {
      if (this.player) {
        this.player.getCurrentState().then((state) => {
          if (state) {
            this.player.disconnect();
          } else {
            console.log(`The player isn't connected`);
          }
        });
      }
    }

    public onNext() {
      console.log('next button clicked');
     }
     public onPlay() {
       console.log('played');
       this.player.togglePlay().then(() => {
         console.log('play button toggled');
       }).catch(err => {
         console.log(`play button errored: ${err}`);
       });
     }

     public onPause() {
      console.log('pause button pressed');
     }
}
