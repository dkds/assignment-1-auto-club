
/*
 * ------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */
export enum MembersOrderBy {
    NATURAL = "NATURAL",
    ID_ASC = "ID_ASC",
    ID_DESC = "ID_DESC",
    FIRST_NAME_ASC = "FIRST_NAME_ASC",
    FIRST_NAME_DESC = "FIRST_NAME_DESC",
    LAST_NAME_ASC = "LAST_NAME_ASC",
    LAST_NAME_DESC = "LAST_NAME_DESC",
    EMAIL_ASC = "EMAIL_ASC",
    EMAIL_DESC = "EMAIL_DESC",
    CAR_MODEL_ID_ASC = "CAR_MODEL_ID_ASC",
    CAR_MODEL_ID_DESC = "CAR_MODEL_ID_DESC",
    VIN_ASC = "VIN_ASC",
    VIN_DESC = "VIN_DESC",
    MANUFACTURED_DATE_ASC = "MANUFACTURED_DATE_ASC",
    MANUFACTURED_DATE_DESC = "MANUFACTURED_DATE_DESC",
    AGE_OF_VEHICLE_ASC = "AGE_OF_VEHICLE_ASC",
    AGE_OF_VEHICLE_DESC = "AGE_OF_VEHICLE_DESC",
    CREATED_AT_ASC = "CREATED_AT_ASC",
    CREATED_AT_DESC = "CREATED_AT_DESC",
    PRIMARY_KEY_ASC = "PRIMARY_KEY_ASC",
    PRIMARY_KEY_DESC = "PRIMARY_KEY_DESC"
}

export class CarMakeInput {
    id?: number;
    name: string;
}

export class CarModelInput {
    id?: number;
    name: string;
    carMakeId: number;
}

export class MemberInput {
    id?: number;
    firstName: string;
    lastName: string;
    email: string;
    vin: string;
    mfd: Datetime;
    carModelId: number;
}

export abstract class IQuery {
    abstract carMakes(): CarMakeView[] | Promise<CarMakeView[]>;

    abstract carMakeByName(name: string): CarMakeView | Promise<CarMakeView>;

    abstract carMake(id: number): CarMakeView | Promise<CarMakeView>;

    abstract carModels(): CarModelView[] | Promise<CarModelView[]>;

    abstract carModelByName(name: string, carMakeId: number): CarModelView | Promise<CarModelView>;

    abstract carModel(id: number): CarModelView | Promise<CarModelView>;

    abstract members(first?: number, offset?: number, query?: string, orderBy?: MembersOrderBy): MemberPage | Promise<MemberPage>;

    abstract membersByCarAgeMoreThan(age?: number): MemberPage | Promise<MemberPage>;

    abstract membersByCarAgeLessThan(age?: number): MemberPage | Promise<MemberPage>;

    abstract memberByName(firstName: string, lastName: string, vin: string): MemberView | Promise<MemberView>;

    abstract member(id: number): MemberView | Promise<MemberView>;
}

export abstract class IMutation {
    abstract createCarMake(carMakeInput?: CarMakeInput): CarMakeView | Promise<CarMakeView>;

    abstract createOrGetCarMake(carMakeInput?: CarMakeInput): CarMakeView | Promise<CarMakeView>;

    abstract updateCarMake(carMakeInput?: CarMakeInput): CarMakeView | Promise<CarMakeView>;

    abstract deleteCarMake(id: number): CarMakeRemoveResponse | Promise<CarMakeRemoveResponse>;

    abstract createCarModel(carModelInput?: CarModelInput): CarModelView | Promise<CarModelView>;

    abstract createOrGetCarModel(carModelInput?: CarModelInput): CarModelView | Promise<CarModelView>;

    abstract updateCarModel(carModelInput?: CarModelInput): CarModelView | Promise<CarModelView>;

    abstract deleteCarModel(id: number): CarModelRemoveResponse | Promise<CarModelRemoveResponse>;

    abstract createMember(memberInput?: MemberInput): MemberView | Promise<MemberView>;

    abstract updateMember(memberInput?: MemberInput): MemberView | Promise<MemberView>;

    abstract deleteMember(id: number): MemberRemoveResponse | Promise<MemberRemoveResponse>;
}

export class CarMakeRemoveResponse {
    deletedCarMakeId?: number;
}

export class CarMakeView {
    id: number;
    name: string;
}

export class CarModelRemoveResponse {
    deletedCarModelId?: number;
}

export class CarModelView {
    id: number;
    name: string;
    carMake: CarMakeView;
}

export class MemberPage {
    totalCount?: number;
    nodes?: MemberView[];
}

export class MemberRemoveResponse {
    deletedMemberId?: number;
}

export class MemberView {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    vin: string;
    mfd: Datetime;
    carModel: CarModelView;
}

export type Datetime = any;
