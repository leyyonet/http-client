import {$assert, $dev} from "@leyyo/common";
import {decoratorPool} from "@leyyo/core";
import {FQN_PCK} from "../../internal";

export interface ProducesOpt {
    mimeTypes: Array<string>;
}
export function Produces(...mimeTypes: Array<string>): ClassDecorator;
export function Produces(...mimeTypes: Array<string>): MethodDecorator;
export function Produces(...mimeTypes: Array<string>): ClassDecorator|MethodDecorator {
    return (clazz: any, property?: PropertyKey, descriptor?: TypedPropertyDescriptor<any>) =>
        id.process([clazz, property, descriptor], {mimeTypes});
}

const id = decoratorPool.newId<ProducesOpt>(Produces)
    .fqn(FQN_PCK)
    .targets('parameter')
    .rules('no-multiple')
    .keywords('http-client')
    .processor((ins, p) => {
        $assert.textArray(p.mimeTypes, $dev.desc(ins, {field: 'mimeTypes'}));
        ins.set(p);
    });
