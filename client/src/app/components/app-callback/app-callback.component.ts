import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SpotifyService } from '../../services/spotify.service';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-app-callback',
  templateUrl: './app-callback.component.html'
})
export class CallbackComponent implements OnInit {

  constructor(private route: ActivatedRoute,
            private router: Router,
            private spotify: SpotifyService) {
  }

  ngOnInit() {
    const code = this.route.snapshot.queryParams['code'];
    const response = this.spotify.getToken(code);
    if ( typeof response !==  'string') {
     (<Observable<Object>>response).subscribe((data) => {
        sessionStorage.setItem('access_token', data['access_token']);
        sessionStorage.setItem('refresh_token', data['refresh_token']);
       });
      }
        this.router.navigateByUrl('/dashboard');
    }
}
