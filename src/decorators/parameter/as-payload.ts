import {decoratorPool} from "@leyyo/core";
import {FQN_PCK} from "../../internal";
import {AsBody} from "./as-body";

export function AsPayload(): ParameterDecorator {
    return (clazz, propertyKey, index) =>
        cloned.process([clazz, propertyKey, index], {});
}

const cloned = decoratorPool.newClone(AsPayload, AsBody)
    .fqn(FQN_PCK);
