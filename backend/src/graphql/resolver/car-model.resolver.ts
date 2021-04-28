import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CarModelInput } from '../schema/types';
import { CarModelService } from '../service/car-model.service';

@Resolver('CarModelPage')
export class CarModelResolver {

    constructor(
        private readonly carModelService: CarModelService) { }

    @Query('carModels')
    async listCarModels(
        @Args('first') first: number,
        @Args('offset') offset: number,
        @Args('orderBy') orderBy: string) {
        return this.carModelService.list({ first, offset, orderBy });
    }

    @Query('carModelByName')
    async carModelByName(
        @Args('name') name: string,
        @Args('carMakeId') carMakeId: number) {
        return this.carModelService.getByName(name, carMakeId);
    }

    @Mutation('createCarModel')
    async createCarModel(
        @Args('carModelInput') carModelInput: CarModelInput) {
        return this.carModelService.create({ ...carModelInput });
    }

    @Mutation('createOrGetCarModel')
    async createOrGetCarModel(
        @Args('carModelInput') carModelInput: CarModelInput) {
        return this.carModelService.getOrCreate({ ...carModelInput });
    }

    @Mutation('updateCarModel')
    async updateCarModel(
        @Args('carModelInput') carModelInput: CarModelInput) {
        return this.carModelService.update({ ...carModelInput });
    }

    @Mutation('deleteCarModel')
    async deleteCarModel(
        @Args('id') id: number) {
        return this.carModelService.delete(id);
    }
}