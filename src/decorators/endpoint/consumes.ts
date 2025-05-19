import {$assert, $dev} from "@leyyo/common";
import {decoratorPool} from "@leyyo/core";
import {FQN_PCK} from "../../internal";

export interface ConsumesOpt {
    mimeTypes: Array<string>;
}
export function Consumes(...mimeTypes: Array<string>): ClassDecorator;
export function Consumes(...mimeTypes: Array<string>): MethodDecorator;
export function Consumes(...mimeTypes: Array<string>): ClassDecorator|MethodDecorator {
    return (clazz: any, property?: PropertyKey, descriptor?: TypedPropertyDescriptor<any>) =>
        id.process([clazz, property, descriptor], {mimeTypes});
}

const id = decoratorPool.newId<ConsumesOpt>(Consumes)
    .fqn(FQN_PCK)
    .targets('parameter')
    .rules('no-multiple')
    .keywords('http-client')
    .processor((ins, p) => {
        $assert.textArray(p.mimeTypes, $dev.desc(ins, {field: 'mimeTypes'}));
        ins.set(p);
    });
