import { CarModel } from "src/app/core/model/car-model.model";

export class Member {

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