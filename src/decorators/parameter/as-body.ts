import {decoratorPool} from "@leyyo/core";
import {FQN_PCK} from "../../internal";
import {MonoParamOpt} from "./index.types";

export function AsBody(): ParameterDecorator {
    return (clazz, propertyKey, index) =>
        id.process([clazz, propertyKey, index], {});
}

const id = decoratorPool.newId(AsBody)
    .fqn(FQN_PCK)
    .targets('parameter')
    .rules('no-multiple')
    .keywords('http-client')
    .processor((ins, p) => {
        ins.set(p);
    });
