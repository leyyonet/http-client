import {$assert, $dev, $is, ClassLike} from "@leyyo/common";
import {decoratorPool, footprint} from "@leyyo/core";
import {FQN_PCK} from "../../internal";

export interface TimeoutOpt {
    milliseconds: number;
    error: string|ClassLike;
}
export function Timeout(milliseconds: number): ClassDecorator;
export function Timeout(milliseconds: number): MethodDecorator;
export function Timeout(milliseconds: number, errorMessage: string): ClassDecorator;
export function Timeout(milliseconds: number, errorMessage: string): MethodDecorator;
export function Timeout(milliseconds: number, errorClass: ClassLike): ClassDecorator;
export function Timeout(milliseconds: number, errorClass: ClassLike): MethodDecorator;
export function Timeout(milliseconds: number, error?: string|ClassLike): ClassDecorator|MethodDecorator {
    return (clazz: any, property?: PropertyKey, descriptor?: TypedPropertyDescriptor<any>) =>
        id.process([clazz, property, descriptor], {milliseconds, error});
}

const id = decoratorPool.newId<TimeoutOpt>(Timeout)
    .fqn(FQN_PCK)
    .targets('parameter')
    .rules('no-multiple')
    .keywords('http-client')
    .processor((ins, p) => {
        $assert.positiveInteger(p.milliseconds, $dev.desc(ins, {field: 'milliseconds'}));
        if (!$is.empty(p.error)) {
            if (typeof p.error === 'string') {
                $assert.text(p.error, $dev.desc(ins, {field: 'errorMessage'}));
            }
            else {
                $assert.func(p.error, $dev.desc(ins, {field: 'errorClass'}));
                if (!footprint.isClass(p.error, true)) {
                    $assert.clazz(undefined, $dev.desc(ins, {field: 'errorClass'}));
                }
            }
        }
        ins.set(p);
    });
