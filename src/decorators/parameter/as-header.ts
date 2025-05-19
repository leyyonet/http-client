import {decoratorPool} from "@leyyo/core";
import {FQN_PCK} from "../../internal";
import {MonoParamOpt} from "./index.types";
import {$assert, $dev} from "@leyyo/common";

export function AsHeader(field?: string): ParameterDecorator {
    return (clazz, propertyKey, index) =>
        id.process([clazz, propertyKey, index], {field});
}

const id = decoratorPool.newId<MonoParamOpt>(AsHeader)
    .fqn(FQN_PCK)
    .targets('parameter')
    .rules('no-multiple')
    .keywords('http-client')
    .processor((ins, p) => {
        $assert.textOptional(p.field, $dev.desc(ins, {field: 'field'}));
        ins.set(p);
    });
