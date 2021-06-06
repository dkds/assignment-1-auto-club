import { Injectable, Compiler, Injector, NgModuleFactory, Type } from "@angular/core";
import { NGXLogger } from "ngx-logger";

@Injectable({
  providedIn: 'root'
})
export class LazyLoaderService {

  constructor(
    private logger: NGXLogger,
    private compiler: Compiler,
    private injector: Injector) { }

  loadModule(path: any) {
    return (path() as Promise<NgModuleFactory<any> | Type<any>>)
      .then(elementModuleOrFactory => {
        if (elementModuleOrFactory instanceof NgModuleFactory) {
          // if ViewEngine
          return elementModuleOrFactory;
        } else {
          try {
            // if Ivy
            return this.compiler.compileModuleAsync(elementModuleOrFactory);
          } catch (err) {
            throw err;
          }
        }
      })
      .then(moduleFactory => {
        try {
          const elementModuleRef = moduleFactory.create(this.injector);
          const moduleInstance = elementModuleRef.instance;

          this.logger.debug("loaded module: ", moduleInstance);
        } catch (err) {
          throw err;
        }
      });
  }
}