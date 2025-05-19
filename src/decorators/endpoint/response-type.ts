import {$assert, $dev} from "@leyyo/common";
import {decoratorPool} from "@leyyo/core";
import {FQN_PCK} from "../../internal";
import {HttpResponseType, HttpResponseTypeItems} from "../../literals";

export interface ResponseTypeOpt {
    type: HttpResponseType;
}
export function ResponseType(type: HttpResponseType): ClassDecorator;
export function ResponseType(type: HttpResponseType): MethodDecorator;
export function ResponseType(type: HttpResponseType): ClassDecorator|MethodDecorator {
    return (clazz: any, property?: PropertyKey, descriptor?: TypedPropertyDescriptor<any>) =>
        id.process([clazz, property, descriptor], {type});
}

const id = decoratorPool.newId<ResponseTypeOpt>(ResponseType)
    .fqn(FQN_PCK)
    .targets('parameter')
    .rules('no-multiple')
    .keywords('http-client')
    .processor((ins, p) => {
        $assert.literal(p.type, HttpResponseTypeItems, $dev.desc(ins, {field: 'type'}));
        ins.set(p);
    });
