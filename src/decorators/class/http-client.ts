import {decoratorPool, footprint, Provider} from "@leyyo/core";
import {$assert, $dev, $is, Dict, ValueCallbackAsync} from "@leyyo/common";
import {AsyncFnc, Fnc, ValueOrCallback} from "@leyyo/common";
import {FQN_PCK} from "../../internal";

export interface HttpClientOpt {
    url?: string;
    fn?: Fnc<string>;
    fnAsync?: AsyncFnc<string>;
}
interface P {
    url: ValueOrCallback<string>
}

/**
 * Indicates that this class is a http client
 *
 * Notes:
 * - Annotated class should not be annotated by {@Provider} again, because it will be added automatically
 *
 * */
export function HttpClient(url?: ValueOrCallback<string>): ClassDecorator {
    return clazz => id.process([clazz], {url});
}

const idProvider = decoratorPool.getIdentifier(Provider);
const id = decoratorPool.newId<HttpClientOpt, Dict, P>(HttpClient)
    .fqn(FQN_PCK)
    .targets('class')
    .rules('no-inherited', 'no-multiple')
    .keywords('api')
    .processor((ins, p) => {
        idProvider.process(ins, {});
        const opt = {} as HttpClientOpt;
        if (!$is.empty(p.url)) {
            if (typeof p.url === 'string') {
                $assert.text(p.url, $dev.desc(ins, {field: 'url'}));
                opt.url = p.url;
            }
            else {
                $assert.func(p.url, $dev.desc(ins, {field: 'url lambda'}));
                if (footprint.isAsync(p.url)) {
                    opt.fnAsync = p.url as ValueCallbackAsync<string>;
                }
                else {
                    opt.fn = p.url;
                }
            }
        }
        ins.set(opt);
    });
