export class Venue{
    constructor(
        public id: string,
        public name: string,
        public location: string,
        public capacity: number,
        public price: number,
        public image: string,
        public description: string
    ){}
}