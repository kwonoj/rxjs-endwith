import * as Rx from 'rxjs';
import { createTestScheduler, observableAssert } from 'rxjs-testscheduler-bootstrapper';
import { ColdObservable } from 'rxjs/testing/ColdObservable';
import { HotObservable } from 'rxjs/testing/HotObservable';
import { SubscriptionLog } from 'rxjs/testing/SubscriptionLog';
import { subscriptionLogsToBeFn } from 'rxjs/testing/TestScheduler';
import { endWith } from '../src/endWith';

describe('endWith', () => {
  let scheduler: Rx.TestScheduler,
    hot: <T = string>(marbles: string, values?: any, error?: any) => HotObservable<T>,
    cold: <T = string>(marbles: string, values?: any, error?: any) => ColdObservable<T>,
    expectObservable: observableAssert,
    expectSubscriptions: (subscriptionLog: Array<SubscriptionLog>) => { toBe: subscriptionLogsToBeFn };

  beforeEach(() => {
    ({ scheduler, hot, cold, expectObservable } = createTestScheduler() as any);
    expectSubscriptions = (...args: Array<any>) => scheduler.expectSubscriptions.apply(scheduler, args);
  });

  it('should append to a cold Observable', () => {
    const e1 = cold('---a--b--c--|');
    const e1subs = '^           !';
    const expected = '---a--b--c--(s|)';

    expectObservable(e1.let(endWith('s'))).toBe(expected);
    expectSubscriptions(e1.subscriptions).toBe(e1subs);

    scheduler.flush();
  });

  it('should end an observable with given value', () => {
    const e1 = hot('--a--|');
    const e1subs = '^    !';
    const expected = '--a--(x|)';

    expectObservable(e1.let(endWith('x'))).toBe(expected);
    expectSubscriptions(e1.subscriptions).toBe(e1subs);

    scheduler.flush();
  });

  it('should not append given value and does not completes if source does not completes', () => {
    const e1 = hot('----a-');
    const e1subs = '^     ';
    const expected = '----a-';

    expectObservable(e1.let(endWith('x'))).toBe(expected);
    expectSubscriptions(e1.subscriptions).toBe(e1subs);

    scheduler.flush();
  });

  it('should not append given value and does not completes if source never emits', () => {
    const e1 = cold('-');
    const e1subs = '^';
    const expected = '-';

    expectObservable(e1.let(endWith('x'))).toBe(expected);
    expectSubscriptions(e1.subscriptions).toBe(e1subs);

    scheduler.flush();
  });

  it('should end with given value and completes if source does not emits', () => {
    const e1 = hot('---|');
    const e1subs = '^  !';
    const expected = '---(x|)';

    expectObservable(e1.let(endWith('x'))).toBe(expected);
    expectSubscriptions(e1.subscriptions).toBe(e1subs);

    scheduler.flush();
  });

  it('should end with given value and complete immediately if source is empty', () => {
    const e1 = cold('|');
    const e1subs = '(^!)';
    const expected = '(x|)';

    expectObservable(e1.let(endWith('x'))).toBe(expected);
    expectSubscriptions(e1.subscriptions).toBe(e1subs);

    scheduler.flush();
  });

  it('should end with given value and source both if source emits single value', () => {
    const e1 = cold('(a|)');
    const e1subs = '(^!)';
    const expected = '(ax|)';

    expectObservable(e1.let(endWith('x'))).toBe(expected);
    expectSubscriptions(e1.subscriptions).toBe(e1subs);

    scheduler.flush();
  });

  it('should end with given values when given value is more than one', () => {
    const e1 = hot('-----a--|');
    const e1subs = '^       !';
    const expected = '-----a--(yz|)';

    expectObservable(e1.let(endWith('y', 'z'))).toBe(expected);
    expectSubscriptions(e1.subscriptions).toBe(e1subs);

    scheduler.flush();
  });

  it('should not append given value and raises error if source raises error', () => {
    const e1 = hot('--#');
    const e1subs = '^ !';
    const expected = '--#';

    expectObservable(e1.let(endWith('x'))).toBe(expected);
    expectSubscriptions(e1.subscriptions).toBe(e1subs);

    scheduler.flush();
  });

  it('should not append given value and raises error immediately if source throws error', () => {
    const e1 = cold('#');
    const e1subs = '(^!)';
    const expected = '#';

    expectObservable(e1.let(endWith('x'))).toBe(expected);
    expectSubscriptions(e1.subscriptions).toBe(e1subs);

    scheduler.flush();
  });

  it('should allow unsubscribing explicitly and early', () => {
    const e1 = hot('---a--b----c--d--|');
    const unsub = '         !        ';
    const e1subs = '^        !        ';
    const expected = '---a--b---';
    const values = { s: 's', a: 'a', b: 'b' };

    const result = e1.let(endWith('s', scheduler));

    expectObservable(result, unsub).toBe(expected, values);
    expectSubscriptions(e1.subscriptions).toBe(e1subs);

    scheduler.flush();
  });

  it('should not break unsubscription chains when result is unsubscribed explicitly', () => {
    const e1 = hot('---a--b----c--d--|');
    const e1subs = '^        !        ';
    const expected = '---a--b---        ';
    const unsub = '         !        ';
    const values = { s: 's', a: 'a', b: 'b' };

    const result = e1
      .mergeMap((x: string) => Rx.Observable.of(x))
      .let(endWith('s', scheduler))
      .mergeMap((x: string) => Rx.Observable.of(x));

    expectObservable(result, unsub).toBe(expected, values);
    expectSubscriptions(e1.subscriptions).toBe(e1subs);

    scheduler.flush();
  });

  it('should end with empty if given value is not specified', () => {
    const e1 = hot('-a-|');
    const e1subs = '^  !';
    const expected = '-a-|';

    expectObservable(e1.let(endWith(scheduler as any))).toBe(expected);
    expectSubscriptions(e1.subscriptions).toBe(e1subs);

    scheduler.flush();
  });

  it('should accept scheduler as last argument with single value', () => {
    const e1 = hot('--a--|');
    const e1subs = '^    !';
    const expected = '--a--(x|)';

    expectObservable(e1.let(endWith('x', scheduler))).toBe(expected);
    expectSubscriptions(e1.subscriptions).toBe(e1subs);

    scheduler.flush();
  });

  it('should accept scheduler as last argument with multiple value', () => {
    const e1 = hot('-----a--|');
    const e1subs = '^       !';
    const expected = '-----a--(yz|)';

    expectObservable(e1.let(endWith('y', 'z', scheduler))).toBe(expected);
    expectSubscriptions(e1.subscriptions).toBe(e1subs);

    scheduler.flush();
  });
});
