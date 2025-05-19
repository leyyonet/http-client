import {decoratorPool} from "@leyyo/core";
import {Dict} from "@leyyo/common";
import {FQN_PCK} from "../../internal";

type O = Dict;

export function AsCookies(): ParameterDecorator {
    return (clazz, propertyKey, index) =>
        id.process([clazz, propertyKey, index], {});
}

const id = decoratorPool.newId<O>(AsCookies)
    .fqn(FQN_PCK)
    .targets('parameter')
    .rules('no-multiple')
    .keywords('http-client')
    .processor((ins, p) => {
        ins.set(p)
    });
