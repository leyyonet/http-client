import {Dict} from "@leyyo/common";
import {decoratorPool} from "@leyyo/core";
import {ToValueItems, ToValueLambda, ToValueOpt, ToValueParam, ToValuePrimitive} from "./index.types";
import {FQN_PCK} from "../../internal";
import {endpointHelper} from "./endpoint-helper";

export function ToParam(name: string, value: ToValuePrimitive): ClassDecorator;
export function ToParam(name: string, value: ToValuePrimitive): MethodDecorator;
export function ToParam(name: string, fn: ToValueLambda): ClassDecorator;
export function ToParam(name: string, fn: ToValueLambda): MethodDecorator;
export function ToParam(...values: Array<ToValueOpt>): ClassDecorator;
export function ToParam(...values: Array<ToValueOpt>): MethodDecorator;
export function ToParam(p1: string|ToValueOpt, p2?: ToValuePrimitive|ToValueLambda|ToValueOpt, ...values: Array<ToValueOpt>): ClassDecorator|MethodDecorator {
    return (clazz: any, property?: PropertyKey, descriptor?: TypedPropertyDescriptor<any>) =>
        id.process([clazz, property, descriptor], {p1, p2, values});
}

const id = decoratorPool.newId<ToValueItems, Dict, ToValueParam>(ToParam)
    .fqn(FQN_PCK)
    .targets('parameter')
    .rules('no-multiple')
    .keywords('http-client')
    .processor((ins, p) => {
        ins.set(endpointHelper.organizeToValue(ins, p));
    });
