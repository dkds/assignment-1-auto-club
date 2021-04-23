import { CarMake } from "src/app/core/model/car-make.model";

export class CarModel {

    static fromObject(carModel: any): CarModel {
        if (!carModel.id || !carModel.carMakeId || !carModel.name) {
            throw new Error("Invalid object, needs id, name and car make");
        }
        const obj = new CarModel(carModel.name);
        obj.id = carModel.id;
        obj.carMake = carModel.carMake;
        return obj;
    }

    id: number = 0;
    carMake?: CarMake;
    constructor(public name: string) { }
}