export class Review{
    constructor(
        public id: string,
        public userId: string,
        public venueId: string,
        public rating: number,
        public comment: string,
        public date: string
    ){}
}