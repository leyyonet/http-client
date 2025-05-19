import {$assert, $dev} from "@leyyo/common";
import {decoratorPool} from "@leyyo/core";
import {FQN_PCK} from "../../internal";

export interface MaxRedirectsOpt {
    maxTimes: number;
}
export function MaxRedirects(maxTimes: number): ClassDecorator;
export function MaxRedirects(maxTimes: number): MethodDecorator;
export function MaxRedirects(maxTimes: number): ClassDecorator|MethodDecorator {
    return (clazz: any, property?: PropertyKey, descriptor?: TypedPropertyDescriptor<any>) =>
        id.process([clazz, property, descriptor], {maxTimes});
}

const id = decoratorPool.newId<MaxRedirectsOpt>(MaxRedirects)
    .fqn(FQN_PCK)
    .targets('parameter')
    .rules('no-multiple')
    .keywords('http-client')
    .processor((ins, p) => {
        $assert.positiveInteger(p.maxTimes, $dev.desc(ins, {field: 'maxTimes'}));
        ins.set(p);
    });
