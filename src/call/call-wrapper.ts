import {CallFileItem, CallOption, CallWrapperLike} from "./index-types";
import {EndpointWrapperLike} from "../endpoint";
import {leyyo, RecLike} from "@leyyo/core";
import {Fqn} from "@leyyo/fqn";
import {FQN_NAME} from "../internal";
import axios, {AxiosRequestConfig, AxiosRequestHeaders, AxiosResponse} from "axios";
import {PAYLOAD_SEND} from "../index-types";
import * as qs from "qs";

@Fqn(...FQN_NAME)
export class CallWrapper implements CallWrapperLike, CallOption {
    private readonly _endpoint: EndpointWrapperLike;
    private readonly _header: RecLike;
    private readonly _param: RecLike;
    private readonly _cookie: RecLike;
    private readonly _payload: unknown;
    private readonly _query: RecLike;
    private readonly _file: RecLike<CallFileItem>;
    private _tryCount: number;

    constructor(endpoint: EndpointWrapperLike, opt: CallOption) {
        this._endpoint = endpoint;
            this._header = leyyo.primitive.object(opt?.header);
            this._param = leyyo.primitive.object(opt?.param);
            this._cookie = leyyo.primitive.object(opt?.cookie);
            this._query = leyyo.primitive.object(opt?.query);
            this._file = leyyo.primitive.object(opt?.file);
            this._payload = opt?.payload;
        this._tryCount = 0;
    }

    get endpoint(): EndpointWrapperLike {
        return this._endpoint;
    }
    private _parseMustache(str: string, obj: RecLike): string {
        return str.replace(/{\s*([\w.]+)\s*}/g, (tag: string, match: string): string => {
            const nodes = match.split(".");
            let current = {...obj} as RecLike;
            const length = nodes.length;
            let i = 0;
            while (i < length) {
                try {
                    current = current[nodes[i]] as RecLike;
                } catch (e) {
                    return "";
                }
                i++;
            }
            return current as unknown as string;
        });
    }
    async run<P = unknown, D = unknown>(): Promise<AxiosResponse<P, D>> {
        this._tryCount++;

        const config: AxiosRequestConfig<P> = {
            baseURL: this._endpoint.getBaseUrl,
            headers: {...(this._endpoint.getBaseHeader ?? {}), ...(this._header ?? {})} as AxiosRequestHeaders,
            params: {...(this._endpoint.getBaseQuery ?? {}), ...(this._query ?? {})},
            paramsSerializer: this._endpoint.getQuerySerializer,
            timeout: this._endpoint.getTimeout,
            timeoutErrorMessage: this._endpoint.getTimeoutErrorMessage,
            // responseType: this.getResponseType, // todo
            maxContentLength: this._endpoint.getMaxContentLength,
            maxBodyLength: this._endpoint.getMaxBodyLength,
            maxRedirects: this._endpoint.getMaxRedirects,
            proxy: this._endpoint.getProxy,
            decompress: this._endpoint.getDecompress,
            url: this._endpoint.getFullUrl ?? (this._endpoint.getBaseUrl + (this._endpoint.controller.getFolder ?? '')) + (this._endpoint.getPath ?? ''),
            method: this._endpoint.getMethod,
            data: this._payload as P,
        };
        // region path-params
        if (config.url && leyyo.is.object(this._param, true)) {
            config.url = this._parseMustache(config.url, this._param);
        }
        // endregion path-params
        // region cookie
        const cookies = {...(this._endpoint.getBaseQuery ?? {}), ...(this._cookie ?? {})};
        if (leyyo.is.object(cookies, true)) {
            const items = [];
            for (const [k, v] of Object.entries(cookies)) {
                items.push(`${k}=${v}`);
            }
            config.headers['cookie'] = items.join(': ');
        }
        // endregion cookie
        // region file
        if (leyyo.is.object(this._file, true)) {
            const form = new FormData();
            for (const [key, file] of Object.entries(this._file)) {
                form.append(key, file.data as Blob, file.name);
            }
            if (this._payload) {
                if (leyyo.is.object(this._payload)) {
                    // todo raise
                }
                for (const [key, value] of Object.entries(this._payload)) {
                    if (leyyo.is.object(value)) {
                        form.append(key, JSON.stringify(value));
                    }
                    else if (leyyo.is.array(value)) {
                        (value as Array<unknown>).forEach(item => {
                            if (leyyo.is.primitive(item)) {
                                form.append(`${key}[]`, item as string);
                            } else {
                                form.append(`${key}[]`, JSON.stringify(item));
                            }
                        });
                    }
                    else {
                        form.append(key, value);
                    }
                }
            }
            if (!PAYLOAD_SEND.includes(this._endpoint.getMethod)) {
                // todo raise
            }
            if (!this._endpoint.getIsForm) {
                this._endpoint.isForm(true);
            }
        }
        // endregion file
        // region form
        else if (this._endpoint.getIsForm && leyyo.is.object(config.data, true)) {
            config.data = qs.stringify(config.data);
        }
        // endregion form
        // region data for no-payload
        if (!PAYLOAD_SEND.includes(this._endpoint.getMethod)) {
            if (config?.data) {
                delete config.data;
            }
        }
        // endregion data for no-payload
        // region on-request
        if (this._endpoint.getOnRequest) {
            try {
                this._endpoint.getOnRequest(config);
            } catch (e) {
            }
        }
        // endregion on-request
        // region run
        try {
            const response = await axios.request<P, D>(config) as AxiosResponse<P, D>;
            if (this._endpoint.getOnSuccess) {
                try {
                    return this._endpoint.getOnSuccess(response) as AxiosResponse<P, D>;
                } catch (e) {
                }
            }
            return response;
        } catch (e) {
            let err = e;
            const response = this._endpoint.getErrorParser(e, config);
            if (this._endpoint.getOnError) {
                try {
                    err = this._endpoint.getOnError(response);
                } catch (e) {
                }
            }
            throw err;
        }
        // endregion run
    }
    get tryCount(): number {
        return this._tryCount;
    }

    get header(): RecLike {
        return this._header;
    }

    get param(): RecLike {
        return this._param;
    }
    get cookie(): RecLike {
        return this._cookie;
    }

    get payload(): unknown {
        return this._payload;
    }

    get query(): RecLike {
        return this._query;
    }
    get file(): RecLike<CallFileItem> {
        return this._file;
    }
}
