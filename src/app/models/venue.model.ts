export class Venue{
    constructor(
        public id: number,
        public name: string,
        public location: string,
        public capacity: number,
        public price: number,
        public imageUrls: string[],
        public description: string
    ){}
}