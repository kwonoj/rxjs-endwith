import { Observable } from 'rxjs/Observable';
import { ArrayObservable } from 'rxjs/observable/ArrayObservable';
import { EmptyObservable } from 'rxjs/observable/EmptyObservable';
import { ScalarObservable } from 'rxjs/observable/ScalarObservable';
import { concatStatic } from 'rxjs/operator/concat';
import { IScheduler } from 'rxjs/Scheduler';
import { isScheduler } from 'rxjs/util/isScheduler';

export interface OperatorFunction<T> {
  (source: Observable<T>): Observable<T>;
}

/* tslint:disable:max-line-length */
export function endWith<T>(v1: T, scheduler?: IScheduler): OperatorFunction<T>;
export function endWith<T>(v1: T, v2: T, scheduler?: IScheduler): OperatorFunction<T>;
export function endWith<T>(v1: T, v2: T, v3: T, scheduler?: IScheduler): OperatorFunction<T>;
export function endWith<T>(v1: T, v2: T, v3: T, v4: T, scheduler?: IScheduler): OperatorFunction<T>;
export function endWith<T>(v1: T, v2: T, v3: T, v4: T, v5: T, scheduler?: IScheduler): OperatorFunction<T>;
export function endWith<T>(v1: T, v2: T, v3: T, v4: T, v5: T, v6: T, scheduler?: IScheduler): OperatorFunction<T>;
export function endWith<T>(...array: Array<T | IScheduler>): OperatorFunction<T>;
/* tslint:enable:max-line-length */

export function endWith<T>(this: Observable<T>, ...array: Array<T | IScheduler>): OperatorFunction<T> {
  return (source: Observable<T>) => {
    let scheduler: IScheduler | undefined = array[array.length - 1] as any;
    if (isScheduler(scheduler)) {
      array.pop();
    } else {
      scheduler = undefined;
    }

    const len = array.length;
    if (len === 1) {
      return concatStatic<T>(source, new ScalarObservable(array[0] as T, scheduler));
    } else if (len > 1) {
      return concatStatic<T>(source, new ArrayObservable(array as Array<T>, scheduler));
    } else {
      return concatStatic<T>(source, new EmptyObservable(scheduler));
    }
  };
}
