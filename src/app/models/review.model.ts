export class Review{
    constructor(
        public id: number,
        public userId: number,
        public venueId: number,
        public rating: number,
        public comment: string,
        public date: string
    ){}
}