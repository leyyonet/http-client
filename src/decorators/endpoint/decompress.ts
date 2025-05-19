import {$assert, $dev, $is} from "@leyyo/common";
import {decoratorPool} from "@leyyo/core";
import {FQN_PCK} from "../../internal";

export interface DecompressOpt {
    enabled: boolean;
}
export function Decompress(enabled: boolean): ClassDecorator;
export function Decompress(enabled: boolean): MethodDecorator;
export function Decompress(enabled: boolean = true): ClassDecorator|MethodDecorator {
    return (clazz: any, property?: PropertyKey, descriptor?: TypedPropertyDescriptor<any>) =>
        id.process([clazz, property, descriptor], {enabled});
}

const id = decoratorPool.newId<DecompressOpt>(Decompress)
    .fqn(FQN_PCK)
    .targets('parameter')
    .rules('no-multiple')
    .keywords('http-client')
    .processor((ins, p) => {
        $assert.booleanOptional(p.enabled, $dev.desc(ins, {field: 'enabled'}));
        if ($is.empty(p.enabled)) {
            p.enabled = true;
        }
        ins.set(p);
    });
