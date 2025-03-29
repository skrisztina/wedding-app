export class Reservation{
    constructor(
        public id: number,
        public venueId: number,
        public userId: number,
        public startDate: string,
        public endDate: string,
        public guestCount: number
    ){}
}