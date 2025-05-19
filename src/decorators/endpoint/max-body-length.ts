import {$assert, $dev} from "@leyyo/common";
import {decoratorPool} from "@leyyo/core";
import {FQN_PCK} from "../../internal";

export interface MaxBodyLengthOpt {
    bytes: number;
}
export function MaxBodyLength(bytes: number): ClassDecorator;
export function MaxBodyLength(bytes: number): MethodDecorator;
export function MaxBodyLength(bytes: number): ClassDecorator|MethodDecorator {
    return (clazz: any, property?: PropertyKey, descriptor?: TypedPropertyDescriptor<any>) =>
        id.process([clazz, property, descriptor], {bytes});
}

const id = decoratorPool.newId<MaxBodyLengthOpt>(MaxBodyLength)
    .fqn(FQN_PCK)
    .targets('parameter')
    .rules('no-multiple')
    .keywords('http-client')
    .processor((ins, p) => {
        $assert.positiveInteger(p.bytes, $dev.desc(ins, {field: 'bytes'}));
        ins.set(p);
    });
