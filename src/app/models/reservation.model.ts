export class Reservation{
    constructor(
        public id: string,
        public venueId: string,
        public userId: string,
        public startDate: string,
        public endDate: string,
        public guestCount: number
    ){}
}