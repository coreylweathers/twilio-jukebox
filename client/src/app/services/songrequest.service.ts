import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { SongRequest } from './../classes/songrequest';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class SongRequestService {
    private baseUri:String = 'http://localhost:7071';
    private requests:SongRequest[] = [];
    constructor(private http: Http) {}

    getAllRequests() {
        return this.http.get(`${this.baseUri}/api/spotifyqueue`)
            .map(response => {
                return response.json();
            });
    }

    dequeue() {
       return this.http.delete(`${this.baseUri}/api/delete`)
       .map(response => {
        return ''; });
    }
}
