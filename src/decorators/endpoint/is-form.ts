import {$assert, $dev, $is} from "@leyyo/common";
import {decoratorPool} from "@leyyo/core";
import {FQN_PCK} from "../../internal";

export interface IsFormOpt {
    enabled: boolean;
}
export function IsForm(enabled: boolean): ClassDecorator;
export function IsForm(enabled: boolean): MethodDecorator;
export function IsForm(enabled: boolean = true): ClassDecorator|MethodDecorator {
    return (clazz: any, property?: PropertyKey, descriptor?: TypedPropertyDescriptor<any>) =>
        id.process([clazz, property, descriptor], {enabled});
}

const id = decoratorPool.newId<IsFormOpt>(IsForm)
    .fqn(FQN_PCK)
    .targets('parameter')
    .rules('no-multiple')
    .keywords('http-client')
    .processor((ins, p) => {
        $assert.booleanOptional(p.enabled, $dev.desc(ins, {field: 'enabled'}));
        if ($is.empty(p.enabled)) {
            p.enabled = true;
        }
        ins.set(p);
    });


/*
* const IsForm = require('form-data'); // npm install --save form-data

const form = new IsForm();
*
form.append('file', (file instance of fs.ReadStream>): file: fs.createReadStream(file as string));

const request_config = {
  headers: {
    'Authorization': `Bearer ${access_token}`,
    ...form.getHeaders()
  }
};

return axios.post(url, form, request_config);
*
* form.getHeaders() returns an Object with the content-type as well as the boundary.
For example:

{ "content-type": "multipart/form-data; boundary=-------------------0123456789" }
* */
