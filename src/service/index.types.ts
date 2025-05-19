import {ClassReflectionLike, CoreReflectionLike, PropertyReflectionLike} from "@leyyo/core";
import {Obj} from "@leyyo/common";
import {HttpMethod} from "@leyyo/http";
import {EndpointItem} from "../endpoint";
import {HttpResponseErrorLambda, ParamsSerializerLambda, ToValueItems} from "../decorators/endpoint/index.types";
import {
    BodySerializer,
    BodySerializerOpt,
    ConsumesOpt,
    Decompress,
    DecompressOpt,
    DurationOpt,
    ErrorParserOpt,
    HttpProxyOpt,
    MaxBodyLengthOpt,
    MaxContentLengthOpt,
    MaxRedirectsOpt,
    OnHttpErrorOpt,
    OnHttpRequestOpt,
    OnHttpSuccessOpt,
    ProducesOpt,
    QuerySerializerOpt,
    ResponseTypeOpt,
    RetryOpt,
    TimeoutOpt,
    ToCookie,
    ToHeader, ToParam, ToQuery, HttpClientOpt, IsFormOpt
} from "../decorators";

export interface ClientServiceLike {
    allClasses: Map<ClassReflectionLike, ServiceItem>;

    newItem(classRef: ClassReflectionLike): ServiceItem;
    clear(): void;

    cloneConfig(source: ClientServiceConfig, target: ClientServiceConfig): void;
    fetchConfig(ref: CoreReflectionLike, conf: ClientServiceConfig): void;
    fetchClasses(): void;
}

export interface ServiceItem {
    classRef: ClassReflectionLike,
    instance: Obj;
    address: HttpClientOpt;
    endpoints: Map<PropertyReflectionLike, EndpointItem>;
    config: ClientServiceConfig;
}
export interface ClientServiceConfig {
    bodySerializer?: Array<BodySerializerOpt>;
    consumes?: Array<ConsumesOpt>;
    decompress?: Array<DecompressOpt>;
    duration?: Array<DurationOpt>;
    errorParser?: Array<ErrorParserOpt>;
    isForm?: Array<IsFormOpt>;
    proxy?: Array<HttpProxyOpt>;
    maxBodyLength?: Array<MaxBodyLengthOpt>;
    maxContentLength?: Array<MaxContentLengthOpt>;
    maxRedirects?: Array<MaxRedirectsOpt>;
    onHttpError?: Array<OnHttpErrorOpt>;
    onHttpRequest?: Array<OnHttpRequestOpt>;
    onHttpSuccess?: Array<OnHttpSuccessOpt>;
    produces?: Array<ProducesOpt>;
    querySerializer?: Array<QuerySerializerOpt>;
    responseType?: Array<ResponseTypeOpt>;
    retry?: Array<RetryOpt>;
    timeout?: Array<TimeoutOpt>;
    toCookie?: Array<ToValueItems>;
    toHeader?: Array<ToValueItems>;
    toParam?: Array<ToValueItems>;
    toQuery?: Array<ToValueItems>;
}
