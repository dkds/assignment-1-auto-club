import { ParseIntPipe } from '@nestjs/common';
import { Args, Mutation, Parent, Query, ResolveField, Resolver, Subscription } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { mergeMap, pluck } from 'rxjs/operators';
import { CarModelService } from 'src/core/service/car-model.service';

const pubSub = new PubSub();

@Resolver('CarModel')
export class CarModelResolver {

    constructor(
        private readonly memberService: CarModelService) { }

    @Query('carModels')
    async listCarModel() {
        return this.memberService.findAll();
    }

    // @Query('membersByRegex')
    // async getCarModelByRegex() {
    //     return this.memberService.findAll();
    // }

    // @ResolveField()
    // async carModel(@Parent() member) {
    //     const { carModelId } = member;
    //     return this.carModelService.getCarModelById(carModelId)
    //         .pipe(
    //             pluck('name')
    //         );
    // }

    // @ResolveField()
    // async carMake(@Parent() member) {
    //     const { carModelId } = member;
    //     return this.carModelService.getCarModelById(carModelId)
    //         .pipe(
    //             mergeMap((carModel) => this.carMakeService.getCarMakeById(carModel.carMakeId)),
    //             pluck('name'),
    //         );
    // }
}