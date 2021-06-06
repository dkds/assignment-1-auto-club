import { Injectable } from "@angular/core";
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { LazyLoaderService } from "./lazy-loader.service";

@Injectable({
  providedIn: 'root'
})
export class CarModelResolverService implements Resolve<any> {

  constructor(
    private lazyLoaderService: LazyLoaderService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.lazyLoaderService.loadModule(() =>
      import('../../car-model/car-model.module').then(m => m.CarModelModule));
  }
}