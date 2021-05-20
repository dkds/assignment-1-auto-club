import { CarMake } from "src/app/core/model/car-make.model";

export class CarModel {

    id: number = 0;
    carMake?: CarMake;
    constructor(public name: string) { }
}