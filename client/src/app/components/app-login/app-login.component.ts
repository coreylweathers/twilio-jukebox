import { Component, OnInit } from '@angular/core';
import { SpotifyService } from '../../services/spotify.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'app-login',
    templateUrl: './app-login.component.html'
})

export class LoginComponent implements OnInit {
    code;
    // tslint:disable-next-line:max-line-length
    loginUrl = 'https://accounts.spotify.com/authorize?response_type=code&client_id=e80c6616e53c4da18f2f19c169809593&scope=user-read-private%20user-read-email&redirect_uri=http://localhost:4200/callback';


    constructor(public spotify: SpotifyService,
                private route: ActivatedRoute,
                private router: Router) {
                    /*this.code = this.route.snapshot.queryParams.code;
                    if (this.code) {
                        localStorage.setItem('callback_code', this.code);
                    }*/
    }

    ngOnInit() {
        /*if (this.code) {
            this.spotify.getToken(this.code).subscribe(data => {
                console.log(data);
                localStorage.setItem('access_token', data['access_token']);
                localStorage.setItem('refresh_token', data['refresh_token']);
                localStorage.removeItem('callback_code');
                this.router.navigateByUrl('/home');
            });
        }*/
    }

    login() {
    }

    logout() {
    }

    isAuthenticated() {
    }
}
