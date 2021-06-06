import { TestBed } from "@angular/core/testing";
import { NGXLogger } from "ngx-logger";
import { ApolloTestingModule, ApolloTestingController } from 'apollo-angular/testing';
import { CREATE_CAR_MAKE, DELETE_CAR_MAKE, LIST_CAR_MAKE, UPDATE_CAR_MAKE } from "../config/graphql.queries";
import { CarMakeService } from "./car-make.service";
import { CarMake } from "../model/car-make.model";

describe("CarMakeService", () => {

  let service: CarMakeService;
  let apolloController: ApolloTestingController;

  beforeEach(() => {
    const logMock = jasmine.createSpyObj('NGXLogger', ['debug']);

    TestBed.configureTestingModule({
      imports: [
        ApolloTestingModule
      ],
      providers: [
        { provide: NGXLogger, useValue: logMock },
        CarMakeService
      ]
    });
    service = TestBed.inject(CarMakeService);
    apolloController = TestBed.inject(ApolloTestingController);
  });

  it("loading car makes", (done) => {
    const carMakes = [
      { id: 1, name: 'Car make 1', },
      { id: 2, name: 'Car make 3', }
    ];

    service.getCarMakes()
      .subscribe((result) => {
        expect(result).toEqual(carMakes.map(CarMake.fromObject));
        done();
      });
    apolloController.expectOne(LIST_CAR_MAKE).flush({
      data: { carMakes },
    });
    apolloController.verify();
  });

  it("create new car make", (done) => {
    const carMake = { id: 0, name: 'Car make 1' };

    service.saveCarMake(carMake).subscribe(() => {
      done();
    });
    apolloController.expectOne((operation) => {
      expect(operation.variables.name).toEqual(carMake.name);
      expect(operation.query.definitions).toEqual(CREATE_CAR_MAKE.definitions);
      return true;
    }).flush({
      data: { createCarMake: carMake },
    });
    apolloController.verify();
  });

  it("update car make", (done) => {
    const carMake = { id: 1, name: 'Car make updated' };

    service.saveCarMake(carMake).subscribe(() => {
      done();
    });
    apolloController.expectOne((operation) => {
      expect(operation.variables.id).toEqual(carMake.id);
      expect(operation.variables.name).toEqual(carMake.name);
      expect(operation.query.definitions).toEqual(UPDATE_CAR_MAKE.definitions);
      return true;
    }).flush({
      data: { updateCarMake: carMake },
    });
    apolloController.verify();
  });

  it("delete car make", (done) => {
    const deleteId = 1;

    service.deleteCarMake(deleteId).subscribe(() => {
      done();
    });
    apolloController.expectOne((operation) => {
      expect(operation.variables.id).toEqual(deleteId);
      expect(operation.query.definitions).toEqual(DELETE_CAR_MAKE.definitions);
      return true;
    }).flush({
      data: { deletedCarMakeId: deleteId },
    });
    apolloController.verify();
  });
});