import {$assert, $dev, $is, $to, Dict} from "@leyyo/common";
import {decoratorPool, footprint} from "@leyyo/core";
import {HttpErrorStateAny} from "@leyyo/http";

import {FQN_PCK} from "../../internal";
import {RetryLambda} from "./index.types";

export interface RetryOpt {
    maxTimes: number;
    lambda: RetryLambda;
    isAsync?: boolean;
}
interface P {
    maxTimes: number;
    p2: HttpErrorStateAny|RetryLambda;
}

export function Retry(maxTimes: number): ClassDecorator;
export function Retry(maxTimes: number): MethodDecorator;
export function Retry(maxTimes: number, status: HttpErrorStateAny): ClassDecorator;
export function Retry(maxTimes: number, status: HttpErrorStateAny): MethodDecorator;
export function Retry(maxTimes: number, condition: RetryLambda): ClassDecorator;
export function Retry(maxTimes: number, condition: RetryLambda): MethodDecorator;
export function Retry(maxTimes: number, p2?: HttpErrorStateAny|RetryLambda): ClassDecorator|MethodDecorator {
    return (clazz: any, property?: PropertyKey, descriptor?: TypedPropertyDescriptor<any>) =>
        id.process([clazz, property, descriptor], {maxTimes, p2});
}

const id = decoratorPool.newId<RetryOpt, Dict, P>(Retry)
    .fqn(FQN_PCK)
    .targets('parameter')
    .rules('no-multiple')
    .keywords('http-client')
    .processor((ins, p) => {
        const opt = {} as RetryOpt;
        $assert.positiveInteger(p.maxTimes, $dev.desc(ins, {field: 'maxTimes'}));
        opt.maxTimes = p.maxTimes;
        if (!$is.empty(p.p2)) {
            let statusNum: number;
            switch (typeof p.p2) {
                case 'string':
                    $assert.text(p.p2, $dev.desc(ins, {field: 'status'}));
                    statusNum = $to.integer(p.p2, () => $dev.desc(ins, {field: 'status'}));
                    $assert.positiveInteger(statusNum, $dev.desc(ins, {field: 'status'}));
                    opt.lambda = (_ctx, _times, status) => (status === statusNum);
                    break;
                case 'number':
                    $assert.positiveInteger(p.p2, $dev.desc(ins, {field: 'status'}));
                    opt.lambda = (_ctx, _times, status) => (status === p.p2);
                    break;
                default: //function
                    $assert.func(p.p2, $dev.desc(ins, {field: 'condition'}));
                    opt.isAsync = footprint.isAsync(p.p2);
                    opt.lambda = p.p2 as RetryLambda;
                    break;
            }
        }
        ins.set(opt);
    });
