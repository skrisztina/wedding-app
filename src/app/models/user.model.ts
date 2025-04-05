export class User{
    constructor(
        public id: number,
        public name: string,
        public gender: string,
        public email: string,
        public password: string,
        public phone: string,
        public profilePic: string,
    ){}
}