import {$assert, $dev} from "@leyyo/common";
import {decoratorPool, footprint} from "@leyyo/core";
import {FQN_PCK} from "../../internal";
import {HttpRequestLambda, HttpResponseSuccessLambda} from "./index.types";

export interface OnHttpSuccessOpt {
    lambda: HttpResponseSuccessLambda;
    isAsync?: boolean;
}
export function OnHttpSuccess(lambda: HttpResponseSuccessLambda): ClassDecorator;
export function OnHttpSuccess(lambda: HttpResponseSuccessLambda): MethodDecorator;
export function OnHttpSuccess(lambda: HttpResponseSuccessLambda): ClassDecorator|MethodDecorator {
    return (clazz: any, property?: PropertyKey, descriptor?: TypedPropertyDescriptor<any>) =>
        id.process([clazz, property, descriptor], {lambda});
}

const id = decoratorPool.newId<OnHttpSuccessOpt>(OnHttpSuccess)
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
