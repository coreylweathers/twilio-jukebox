import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { SongRequest } from './../classes/songrequest';
import 'rxjs/add/operator/map';

@Injectable()
export class SongRequestService {
    private baseUri = 'https://requestfunction.azurewebsites.net';
    constructor(private http: Http) {}

    public requestlist: Array<SongRequest>;

    getAllRequests() {
        return this.http.get(`${this.baseUri}/api/request`)
            .map(response => {
               return response.json().items;
            });
    }

    dequeue() {
       return this.http.delete(`${this.baseUri}/api/delete`).map(response => {
        return ''; });
    }
}
