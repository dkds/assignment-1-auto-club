import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CarMakeInput } from '../schema/types';
import { CarMakeService } from '../service/car-make.service';

@Resolver('CarMakePage')
export class CarMakeResolver {

    constructor(
        private readonly carMakeService: CarMakeService) { }

    @Query('carMakes')
    async listCarMakes(
        @Args('first') first: number,
        @Args('offset') offset: number,
        @Args('orderBy') orderBy: string) {
        return this.carMakeService.list({ first, offset, orderBy });
    }

    @Mutation('createCarMake')
    async createCarMake(
        @Args('carMakeInput') carMakeInput: CarMakeInput) {
        return this.carMakeService.create({ ...carMakeInput });
    }

    @Mutation('updateCarMake')
    async updateCarMake(
        @Args('carMakeInput') carMakeInput: CarMakeInput) {
        return this.carMakeService.update({ ...carMakeInput });
    }

    @Mutation('deleteCarMake')
    async deleteCarMake(
        @Args('id') id: number) {
        return this.carMakeService.delete(id);
    }
}