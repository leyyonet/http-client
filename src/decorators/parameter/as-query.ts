import {decoratorPool} from "@leyyo/core";
import {FQN_PCK} from "../../internal";
import {MonoParamOpt} from "./index.types";
import {$assert, $dev, $is, Dict} from "@leyyo/common";

interface P {
    fieldOrSnakeCase?: string|true;
}
export function AsQuery(): ParameterDecorator;
export function AsQuery(isRemoteSnakeCase: true): ParameterDecorator;
export function AsQuery(field: string): ParameterDecorator;
export function AsQuery(fieldOrSnakeCase?: string|true): ParameterDecorator {
    return (clazz, propertyKey, index) =>
        id.process([clazz, propertyKey, index], {fieldOrSnakeCase});
}

const id = decoratorPool.newId<MonoParamOpt, Dict, P>(AsQuery)
    .fqn(FQN_PCK)
    .targets('parameter')
    .rules('no-multiple')
    .keywords('http-client')
    .processor((ins, p) => {
        const opt = {} as MonoParamOpt;
        if ($is.empty(p.fieldOrSnakeCase)) {
            switch (typeof p.fieldOrSnakeCase) {
                case "boolean":
                    if (p.fieldOrSnakeCase === true) {
                        opt.isRemoteSnakeCase = true;
                    }
                    else {
                        throw $dev.developerError2(FQN_PCK, 313, {issue: 'Only true can be used in place of false', field: 'isRemoteSnakeCase', desc: ins.description});
                    }
                    break;
                case "string":
                    $assert.text(p.fieldOrSnakeCase, () => [FQN_PCK, 314, {field: 'field', desc: ins.description}]);
                    opt.field = p.fieldOrSnakeCase as string;
                    break;
                default:
                    throw $dev.developerError2(FQN_PCK, 315, {issue: 'Field name a string - strictly', field: 'field', desc: ins.description});
            }
        }
        ins.set(opt);
    });
