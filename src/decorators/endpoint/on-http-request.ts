import {$assert, $dev} from "@leyyo/common";
import {decoratorPool, footprint} from "@leyyo/core";
import {FQN_PCK} from "../../internal";
import {HttpRequestLambda} from "./index.types";

export interface OnHttpRequestOpt {
    lambda: HttpRequestLambda;
    isAsync?: boolean;
}
export function OnHttpRequest(lambda: HttpRequestLambda): ClassDecorator;
export function OnHttpRequest(lambda: HttpRequestLambda): MethodDecorator;
export function OnHttpRequest(lambda: HttpRequestLambda): ClassDecorator|MethodDecorator {
    return (clazz: any, property?: PropertyKey, descriptor?: TypedPropertyDescriptor<any>) =>
        id.process([clazz, property, descriptor], {lambda});
}

const id = decoratorPool.newId<OnHttpRequestOpt>(OnHttpRequest)
    .fqn(FQN_PCK)
    .targets('parameter')
    .rules('no-multiple')
    .keywords('http-client')
    .processor((ins, p) => {
        $assert.func(p.lambda, $dev.desc(ins, {field: 'lambda'}));
        if (footprint.isAsync(p.lambda)) {
            p.isAsync = true;
        }
        ins.set(p);
    });
