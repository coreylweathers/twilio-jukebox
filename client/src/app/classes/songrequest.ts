export class SongRequest {

    constructor(
        public songtitle: string,
        public artistname: string,
        public artistimageurl: string,
        public currentlyPlaying: boolean) {}
}
