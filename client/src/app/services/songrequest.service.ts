import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SongRequest } from './../classes/songrequest';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class SongRequestService {
    private baseUri: String = 'http://localhost:7071';
    private requests: SongRequest[] = [];
    constructor(private http: HttpClient) {}

    getAllRequests() {
        console.log('getting all requests in teh playlist');
        /*return this.http.get(`${this.baseUri}/api/spotifyqueue`)
            .map(response => {
                return response;
            });*/
    }

    dequeue() {
        console.log('Dequeing request');
       /*return this.http.delete(`${this.baseUri}/api/delete`)
       .map(response => {
        return ''; });*/
    }
}
