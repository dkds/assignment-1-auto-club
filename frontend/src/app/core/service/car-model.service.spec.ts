import { TestBed } from "@angular/core/testing";
import { NGXLogger } from "ngx-logger";
import { ApolloTestingModule, ApolloTestingController } from 'apollo-angular/testing';
import { CREATE_CAR_MODEL, DELETE_CAR_MODEL, LIST_CAR_MODEL, UPDATE_CAR_MODEL } from "./graphql.schema";
import { CarModelService } from "./car-model.service";
import { skip } from "rxjs/operators";

describe("CarModelService", () => {

  let service: CarModelService;
  let apolloController: ApolloTestingController;

  beforeEach(() => {
    const logMock = jasmine.createSpyObj('NGXLogger', ['debug']);

    TestBed.configureTestingModule({
      imports: [
        ApolloTestingModule
      ],
      providers: [
        { provide: NGXLogger, useValue: logMock },
        CarModelService
      ]
    });
    service = TestBed.inject(CarModelService);
    apolloController = TestBed.inject(ApolloTestingController);
  });

  it("loading car models", (done) => {
    const carModels = [
      { id: 1, name: 'Car model 1', carMake: { id: 1, name: "carmake1" } },
      { id: 2, name: 'Car model 3', carMake: { id: 1, name: "carmake1" } }
    ];

    service.loadCarModels();
    apolloController.expectOne(LIST_CAR_MODEL).flush({
      data: { carModels },
    });
    service.getCarModels()
      .pipe(skip(1))
      .subscribe((result) => {
        expect(result).toEqual(carModels);
        done();
      });
    apolloController.verify();
  });

  it("create new car model", (done) => {
    const carModel = { id: 0, name: 'Car model 1' };

    service.saveCarModel(carModel).subscribe(() => {
      done();
    });
    apolloController.expectOne((operation) => {
      expect(operation.variables.name).toEqual(carModel.name);
      expect(operation.query.definitions).toEqual(CREATE_CAR_MODEL.definitions);
      return true;
    }).flush({
      data: { createCarModel: carModel },
    });
    apolloController.verify();
  });

  it("update car model", (done) => {
    const carModel = { id: 1, name: 'Car model updated' };

    service.saveCarModel(carModel).subscribe(() => {
      done();
    });
    apolloController.expectOne((operation) => {
      expect(operation.variables.id).toEqual(carModel.id);
      expect(operation.variables.name).toEqual(carModel.name);
      expect(operation.query.definitions).toEqual(UPDATE_CAR_MODEL.definitions);
      return true;
    }).flush({
      data: { updateCarModel: carModel },
    });
    apolloController.verify();
  });

  it("delete car model", (done) => {
    const deleteId = 1;

    service.deleteCarModel(deleteId).subscribe(() => {
      done();
    });
    apolloController.expectOne((operation) => {
      expect(operation.variables.id).toEqual(deleteId);
      expect(operation.query.definitions).toEqual(DELETE_CAR_MODEL.definitions);
      return true;
    }).flush({
      data: { deletedCarModelId: deleteId },
    });
    apolloController.verify();
  });
});