import {$assert, $dev} from "@leyyo/common";
import {decoratorPool} from "@leyyo/core";
import {FQN_PCK} from "../../internal";

export interface MaxContentLengthOpt {
    bytes: number;
}
export function MaxContentLength(bytes: number): ClassDecorator;
export function MaxContentLength(bytes: number): MethodDecorator;
export function MaxContentLength(bytes: number): ClassDecorator|MethodDecorator {
    return (clazz: any, property?: PropertyKey, descriptor?: TypedPropertyDescriptor<any>) =>
        id.process([clazz, property, descriptor], {bytes});
}

const id = decoratorPool.newId<MaxContentLengthOpt>(MaxContentLength)
    .fqn(FQN_PCK)
    .targets('parameter')
    .rules('no-multiple')
    .keywords('http-client')
    .processor((ins, p) => {
        $assert.positiveInteger(p.bytes, $dev.desc(ins, {field: 'bytes'}));
        ins.set(p);
    });
