import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Http } from '@angular/http';

@Injectable()
export class SpotifyService {
    private clientId = 'e80c6616e53c4da18f2f19c169809593';
    private scopes = ['user-read-private', 'user-read-email'].join(' ');
    private callback = 'http://localhost:4200/callback';
    isLoggedIn: Boolean = false;
    constructor(private http: HttpClient) {
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
    }

    getToken(code: string) {
        const token = localStorage.getItem('access_token');
        if (token) {
            return token;
        } else {
            return this.http.get(`http://localhost:7071/api/spotifytoken?code=${code}`);
        }
    }

    private extractData(res: Response) {
        return res.json();
    }
}
