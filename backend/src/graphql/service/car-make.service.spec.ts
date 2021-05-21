import { Test } from '@nestjs/testing';
import { ApolloService } from './apollo.service';
import { CarMakeService } from './car-make.service';
import { CREATE_CAR_MAKE, DELETE_CAR_MAKE, GET_CAR_MAKE_BY_NAME, LIST_CAR_MAKE, UPDATE_CAR_MAKE } from './graphql-queries.schema';

describe('CarNakeService', () => {
  let carMakeService: CarMakeService;
  let apolloService: ApolloService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        CarMakeService,
        ApolloService
      ],
    }).compile();

    carMakeService = moduleRef.get<CarMakeService>(CarMakeService);
    apolloService = moduleRef.get<ApolloService>(ApolloService);
  });

  it('should trigger query car makes', async () => {
    const data = { allCarMakes: { nodes: ['test'] } };
    jest.spyOn(apolloService, 'query').mockImplementation(async () => ({
      data,
      networkStatus: 2,
      loading: false
    }));

    const criteria = {
      first: 10,
      offset: 0,
      orderBy: "DEFAULT"
    }

    expect(await carMakeService.list(criteria).toPromise()).toBe(data.allCarMakes.nodes);
    expect(apolloService.query).toHaveBeenCalledWith({
      query: LIST_CAR_MAKE,
      variables: {
        ...criteria
      }
    });
  });

  it('should trigger query car make by name and return the found', async () => {
    const data = { allCarMakes: { nodes: ['test'] } };
    jest.spyOn(apolloService, 'query').mockImplementation(async () => ({
      data: data,
      networkStatus: 2,
      loading: false
    }));

    const carMake = {
      name: "carMake1",
    }

    expect(await carMakeService.getOrCreate(carMake).toPromise()).toBe(data.allCarMakes.nodes[0]);
    expect(apolloService.query).toHaveBeenCalledWith({
      query: GET_CAR_MAKE_BY_NAME,
      variables: { ...carMake }
    });
  });

  it('should trigger query car make by name and create when not found', async () => {
    const queryData = { allCarMakes: { nodes: [] } };
    jest.spyOn(apolloService, 'query').mockImplementation(async () => ({
      data: queryData,
      networkStatus: 2,
      loading: false
    }));
    const carMake = {
      id: 1,
      name: "carMake1",
    }
    const mutateData = { createCarMake: { carMake: { ...carMake } } };
    jest.spyOn(apolloService, 'mutate').mockImplementation(async () => ({
      data: mutateData,
      networkStatus: 2,
      loading: false
    }));

    expect(await carMakeService.getOrCreate(carMake).toPromise()).toEqual(carMake);
    expect(apolloService.query).toHaveBeenCalledWith({
      query: GET_CAR_MAKE_BY_NAME,
      variables: { name: carMake.name }
    });
    expect(apolloService.mutate).toHaveBeenCalledWith({
      mutation: CREATE_CAR_MAKE,
      variables: {
        ...carMake
      }
    });
  });

  it('should trigger mutation on create', async () => {
    const data = { createCarMake: { carMake: { id: 1, name: "carMake1" } } };
    jest.spyOn(apolloService, 'mutate').mockImplementation(async () => ({
      data,
      networkStatus: 2,
      loading: false
    }));

    const carMake = {
      name: "carMake1",
    }

    expect(await carMakeService.create(carMake).toPromise()).toBe(data.createCarMake.carMake);
    expect(apolloService.mutate).toHaveBeenCalledWith({
      mutation: CREATE_CAR_MAKE,
      variables: {
        ...carMake
      }
    });
  });

  it('should trigger mutation on update', async () => {
    const data = { updateCarMakeById: { carMake: { id: 1, name: "carMake1" } } };
    jest.spyOn(apolloService, 'mutate').mockImplementation(async () => ({
      data,
      networkStatus: 2,
      loading: false
    }));

    const carMake = {
      id: 1,
      name: "carMake1",
    }

    expect(await carMakeService.update(carMake).toPromise()).toBe(data.updateCarMakeById.carMake);
    expect(apolloService.mutate).toHaveBeenCalledWith({
      mutation: UPDATE_CAR_MAKE,
      variables: {
        ...carMake
      }
    });
  });

  it('should trigger mutation on delete', async () => {
    const data = { deleteCarMakeById: { deletedCarMakeId: 1 } };
    jest.spyOn(apolloService, 'mutate').mockImplementation(async () => ({
      data,
      networkStatus: 2,
      loading: false
    }));

    const carMake = {
      id: 1,
      name: "carMake1",
    }

    expect(await carMakeService.delete(carMake.id).toPromise()).toEqual(data.deleteCarMakeById);
    expect(apolloService.mutate).toHaveBeenCalledWith({
      mutation: DELETE_CAR_MAKE,
      variables: { id: carMake.id }
    });
  });
});