import {DecoInstanceLike, footprint, Fqn} from "@leyyo/core";
import {$assert, $dev} from "@leyyo/common";
import {
    EndpointHelperLike,
    ToValueItems,
    ToValueLambdaAsync,
    ToValueLambdaSync,
    ToValueOpt,
    ToValueParam
} from "./index.types";
import {FQN_PCK} from "../../internal";

@Fqn(FQN_PCK)
class EndpointHelper implements EndpointHelperLike {
    toValueItem(ins: DecoInstanceLike, p1: unknown, p2: unknown): ToValueOpt {
        $assert.text(p1, () => $dev.desc(ins, {field: 'name'}));
        const opt: ToValueOpt = {
            name: p1 as string,
        };
        switch (typeof p2) {
            case "number":
                $assert.number(p2, $dev.desc(ins, {field: 'value'}));
                opt.value = p2;
                break;
            case "boolean":
                opt.value = p2;
                break;
            case "function":
                if (footprint.isAsync(p2)) {
                    opt.isAsync = true;
                    opt.lambda = p2 as ToValueLambdaAsync;
                }
                else {
                    opt.lambda = p2 as ToValueLambdaSync;
                }
                break;
            default:
                $assert.text(p2, $dev.desc(ins, {field: 'value'}));
                opt.value = p2 as string;
                break;
        }
        return opt;
    }
    organizeToValue(ins: DecoInstanceLike, params: ToValueParam): ToValueItems {
        const items: Array<ToValueOpt> = [];
        if (typeof params.p1 === 'string') {
            items.push(this.toValueItem(ins, params.p1, params.p2));
        }
        else {
            params.values.unshift(params.p1 as ToValueOpt, params.p2 as ToValueOpt);
            for (const item of params.values) {
                if (item) {
                    items.push(this.toValueItem(ins, item.name, item.lambda ?? item.value));
                }
            }
        }
        return {items};
    }

}
export const endpointHelper: EndpointHelperLike = new EndpointHelper();
