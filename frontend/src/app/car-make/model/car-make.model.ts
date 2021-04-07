export class CarMake {

    static fromObject(carMake: any): CarMake {
        if (!carMake.id || !carMake.name) {
            throw new Error("Invalid object, needs id and name");
        }
        const obj = new CarMake(carMake.name);
        obj.id = carMake.id
        return obj;
    }

    id: number = 0;
    constructor(public name: string) { }
}