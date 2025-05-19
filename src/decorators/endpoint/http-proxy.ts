import {$assert, $dev, $is} from "@leyyo/common";
import {decoratorPool} from "@leyyo/core";
import {FQN_PCK} from "../../internal";
import {AxiosProxyConfig} from "axios";

export interface HttpProxyOpt {
    opt: AxiosProxyConfig|false
}
export function HttpProxy(opt: AxiosProxyConfig|false): ClassDecorator;
export function HttpProxy(opt: AxiosProxyConfig|false): MethodDecorator;
export function HttpProxy(opt: AxiosProxyConfig|false = false): ClassDecorator|MethodDecorator {
    return (clazz: any, property?: PropertyKey, descriptor?: TypedPropertyDescriptor<any>) =>
        id.process([clazz, property, descriptor], {opt});
}

const id = decoratorPool.newId<HttpProxyOpt>(HttpProxy)
    .fqn(FQN_PCK)
    .targets('parameter')
    .rules('no-multiple')
    .keywords('http-client')
    .processor((ins, p) => {
        if (p.opt !== false) {
            $assert.bareObject(p.opt, () => $dev.desc(ins, {field: 'option'}));
            $assert.text(p.opt.host, () => $dev.desc(ins, {field: 'option.host'}));
            $assert.positiveInteger(p.opt.port, () => $dev.desc(ins, {field: 'option.port'}));
            if (!$is.empty(p.opt.auth)) {
                $assert.bareObject(p.opt.auth, () => $dev.desc(ins, {field: 'option.auth'}));
                $assert.text(p.opt.auth.username, () => $dev.desc(ins, {field: 'option.auth.username'}));
                $assert.text(p.opt.auth.password, () => $dev.desc(ins, {field: 'option.auth.password'}));
            }
            $assert.textOptional(p.opt.protocol, () => $dev.desc(ins, {field: 'option.protocol'}));
        }
        ins.set(p);
    });
