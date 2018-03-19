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


    constructor(private spotify: SpotifyService,
                private route: ActivatedRoute,
                private router: Router) {
    }

    ngOnInit() {
    }

    login() {
        this.spotify.login();
    }

    logout() {
        this.spotify.logout();
        this.router.navigateByUrl('/home');
    }

    isAuthenticated() {
        return this.spotify.isAuthenticated();
    }
}
