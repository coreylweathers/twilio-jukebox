import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import * as SpotifyWebApi from 'spotify-web-api-js';

@Injectable()
export class SpotifyService {
    private clientId = 'e80c6616e53c4da18f2f19c169809593';
    // tslint:disable-next-line:max-line-length
    private scopes = ['user-read-private', 'user-read-email', 'user-follow-read', 'user-follow-modify', 'playlist-read-collaborative', 'playlist-read-private', 'playlist-modify-public', 'playlist-modify-private'].join(' ');
    private callback = 'http://localhost:4200/callback';
    isLoggedIn: Boolean = false;
    private spotify = new SpotifyWebApi();
    private token: string;
    private playlistId: string;
    private playlist;
    private tracks;
    private spotifyUserId: string;
    private playlistName = 'spread the gospel';

    constructor(private http: HttpClient) {
        this.init();
    }

    login() {
        console.log(`Logging into Spotify`);
        window.location.href = 'https://accounts.spotify.com/authorize?' +
        'response_type=code' +
        '&client_id=' + this.clientId +
        '&scope=' + encodeURIComponent(this.scopes) +
        '&redirect_uri=' + encodeURIComponent(this.callback);
    }

    logout() {
        sessionStorage.removeItem('access_token');
        sessionStorage.removeItem('refresh_token');
        this.spotify.setAccessToken('');
    }

    init() {
        this.token = <string>this.getToken();
        this.setToken(this.token);
        this.spotify.getMe()
            .then((me) => {
                this.spotifyUserId = me.id;
                this.spotify.getUserPlaylists(this.spotifyUserId)
                    .then(results => {
                        results.items.filter(item => item.name.toLowerCase() === this.playlistName.toLowerCase())
                            .map(item => {
                                if (item) {
                                    this.playlist = item;
                                    this.playlistId = item.id;
                                    console.log('Setting the playlist variables', this.playlist, this.playlistId);
                                } else {
                                    this.spotify.createPlaylist(me.id, {
                                        name: this.playlistName
                                    }).then(playlist => {
                                        console.log('Playlist created', playlist);
                                        this.playlist = playlist; }); }});
                    });
            }).catch(error => {
                console.error('An error occurred while getting the user data', error);
            });
    }

    getToken(code?: string) {
        if (code) {
            return this.http.get(`http://localhost:7071/api/spotifytoken?code=${code}`);
        } else {
            this.token = sessionStorage.getItem('access_token');
            return this.token;
        }
    }

    private setToken(token: string) {
       const temp = sessionStorage.getItem('access_token');
        if (temp || temp !== token) {
            sessionStorage.setItem('access_token', token);
        }
        this.spotify.setAccessToken(this.token);
    }

    updatePlaylist(id, name) {
        this.spotify.addTracksToPlaylist(this.spotifyUserId, this.playlist.id, [`spotify:track:${id}`])
            .then(data => {
                console.log('Added the song to the playlist', data);
            })
            .catch(err => console.error('An error has occurred', err));
    }

    getPlaylistTracks() {
        return Observable.fromPromise(this.spotify.getPlaylistTracks('spotify', '37i9dQZF1DX7OIddoQVdRt'));
        //return Observable.fromPromise(this.spotify.getPlaylistTracks(this.spotifyUserId, this.playlistId, {}));
    }

    isAuthenticated() {
        const access_token = sessionStorage.getItem('access_token');
        return (access_token !== null);
    }
}
