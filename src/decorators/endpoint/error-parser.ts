import {$assert, $dev} from "@leyyo/common";
import {decoratorPool, footprint} from "@leyyo/core";
import {FQN_PCK} from "../../internal";
import {ErrorParserLambda} from "./index.types";

export interface ErrorParserOpt {
    lambda: ErrorParserLambda;
    isAsync?: boolean;
}
export function ErrorParser(lambda: ErrorParserLambda): ClassDecorator;
export function ErrorParser(lambda: ErrorParserLambda): MethodDecorator;
export function ErrorParser(lambda: ErrorParserLambda): ClassDecorator|MethodDecorator {
    return (clazz: any, property?: PropertyKey, descriptor?: TypedPropertyDescriptor<any>) =>
        id.process([clazz, property, descriptor], {lambda});
}

const id = decoratorPool.newId<ErrorParserOpt>(ErrorParser)
    .fqn(FQN_PCK)
    .targets('parameter')
    .rules('no-multiple')
    .keywords('http-client')
    .processor((ins, p) => {
        $assert.func(p.lambda, $dev.desc(ins, {field: 'lambda'}));
        if (footprint.isAsync(p.lambda)) {
            p.isAsync = true;
        }
        ins.set(p);
    });
