import { Component, Input, Inject, OnInit, OnDestroy } from '@angular/core';
import { SongRequest } from '../../classes/songrequest';

@Component({
  selector: 'app-current-song-request',
  templateUrl: './app-current-song-request.component.html',
  styleUrls: ['./app-current-song-request.component.css']
})
export class CurrentSongRequestComponent implements OnInit, OnDestroy {
    @Input() public request: SongRequest;
    public player: Spotify.SpotifyPlayer;
    private token: string;

    constructor(@Inject('Window') private window: Window) {
    }
    ngOnInit() {
        /*this.window.onSpotifyWebPlaybackSDKReady = () => {
            this.token =
            // tslint:disable-next-line:max-line-length
            'BQANXil8Z-xc_xXen8-tsScMjVA9hWjpBliIIB4ORAb_2dPB6nyGFSblhJaqaT7Kpd2GYpa8z1OkgSDnsLqmYerfRoI2MX0cCmh7mmhbtSJOR4marHVpojAiUaESk_uU6cledtn7MOPpc3bkGbL_7Fku6hQSdVH-';
            this.player = new Spotify.Player({
              name: 'Twilio Jukebox Spotify Player',
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
          };*/
    }

    ngOnDestroy() {
      this.player.getCurrentState().then((state) => {
        if (state) {
          this.player.disconnect();
        } else {
          console.log(`The player isn't connected`);
        }
      });
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
