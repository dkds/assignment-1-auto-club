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

    @Mutation('createCarModel')
    async createCarModel(
        @Args('carModelInput') carModelInput: CarModelInput) {
        return this.carModelService.create({ ...carModelInput });
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