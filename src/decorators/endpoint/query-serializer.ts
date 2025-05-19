import {$assert, $dev} from "@leyyo/common";
import {decoratorPool} from "@leyyo/core";
import {ParamsSerializerLambda} from "./index.types";
import {FQN_PCK} from "../../internal";

export interface QuerySerializerOpt {
    lambda: ParamsSerializerLambda;
}
export function QuerySerializer(lambda: ParamsSerializerLambda): ClassDecorator;
export function QuerySerializer(lambda: ParamsSerializerLambda): MethodDecorator;
export function QuerySerializer(lambda: ParamsSerializerLambda): ClassDecorator|MethodDecorator {
    return (clazz: any, property?: PropertyKey, descriptor?: TypedPropertyDescriptor<any>) =>
        id.process([clazz, property, descriptor], {lambda});
}

const id = decoratorPool.newId<QuerySerializerOpt>(QuerySerializer)
    .fqn(FQN_PCK)
    .targets('parameter')
    .rules('no-multiple')
    .keywords('http-client')
    .processor((ins, p) => {
        $assert.func(p.lambda, $dev.desc(ins, {field: 'lambda'}));
        ins.set(p);
    });
