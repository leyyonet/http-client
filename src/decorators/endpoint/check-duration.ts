import {$assert, $dev} from "@leyyo/common";
import {decoratorPool, footprint} from "@leyyo/core";
import {DurationLambda} from "./index.types";
import {FQN_PCK} from "../../internal";

export interface DurationOpt {
    lambda: DurationLambda;
    isAsync?: boolean;
}
export function CheckDuration(lambda: DurationLambda): ClassDecorator;
export function CheckDuration(lambda: DurationLambda): MethodDecorator;
export function CheckDuration(lambda: DurationLambda): ClassDecorator|MethodDecorator {
    return (clazz: any, property?: PropertyKey, descriptor?: TypedPropertyDescriptor<any>) =>
        id.process([clazz, property, descriptor], {lambda});
}

const id = decoratorPool.newId<DurationOpt>(CheckDuration)
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
