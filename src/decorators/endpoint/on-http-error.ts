import {$assert, $dev} from "@leyyo/common";
import {decoratorPool, footprint} from "@leyyo/core";
import {FQN_PCK} from "../../internal";
import {HttpRequestLambda, HttpResponseErrorLambda, HttpResponseSuccessLambda} from "./index.types";

export interface OnHttpErrorOpt {
    lambda: HttpResponseErrorLambda;
    isAsync?: boolean;
    silent?: boolean;
}
export function OnHttpError(lambda: HttpResponseErrorLambda, silent?: boolean): ClassDecorator;
export function OnHttpError(lambda: HttpResponseErrorLambda, silent?: boolean): MethodDecorator;
export function OnHttpError(lambda: HttpResponseErrorLambda, silent?: boolean): ClassDecorator|MethodDecorator {
    return (clazz: any, property?: PropertyKey, descriptor?: TypedPropertyDescriptor<any>) =>
        id.process([clazz, property, descriptor], {lambda, silent});
}

const id = decoratorPool.newId<OnHttpErrorOpt>(OnHttpError)
    .fqn(FQN_PCK)
    .targets('parameter')
    .rules('no-multiple')
    .keywords('http-client')
    .processor((ins, p) => {
        $assert.func(p.lambda, $dev.desc(ins, {field: 'lambda'}));
        if (footprint.isAsync(p.lambda)) {
            p.isAsync = true;
        }
        $assert.booleanOptional(p.silent, $dev.desc(ins, {field: 'silent'}));
        ins.set(p);
    });
