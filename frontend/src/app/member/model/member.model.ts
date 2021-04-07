import { CarModel } from "src/app/car-model/model/car-model.model";

export class Member {

    static fromObject(member: any): Member {
        if (!member.id || !member.carModelId || !member.firstName || !member.lastName || !member.vin || !member.manufacturedDate) {
            throw new Error("Invalid object, needs id, name and car model");
        }
        const obj = new Member(member.firstName, member.lastName, member.email, member.vin, member.manufacturedDate);
        obj.id = member.id
        return obj;
    }

    id: number = 0;
    carModel?: CarModel;
    constructor(
        public firstName: string,
        public lastName: string,
        public email: string,
        public vin: string,
        public mfd: string,
    ) { }
}