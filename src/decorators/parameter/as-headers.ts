import {decoratorPool} from "@leyyo/core";
import {FQN_PCK} from "../../internal";
import {Dict} from "@leyyo/common";

type O = Dict;
export function AsHeaders(): ParameterDecorator {
    return (clazz, propertyKey, index) =>
        id.process([clazz, propertyKey, index], {});
}

const id = decoratorPool.newId<O>(AsHeaders)
    .fqn(FQN_PCK)
    .targets('parameter')
    .rules('no-multiple')
    .keywords('http-client')
    .processor((ins, p) => {
        ins.set(p);
    });
