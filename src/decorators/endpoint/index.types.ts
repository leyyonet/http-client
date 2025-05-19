import {Arr, Dict, ExceptionLike} from "@leyyo/common";
import {DecoInstanceLike} from "@leyyo/core";
import {Context, HttpErrorStateNum} from "@leyyo/http";
import {AxiosRequestConfig, AxiosResponse, AxiosResponseHeaders} from "axios";

export type ToValuePrimitive = string|boolean|number;
export interface ToValueOpt {
    name: string;
    lambda?: ToValueLambda;
    isAsync?: boolean;
    value?: ToValuePrimitive;
}
export interface ToValueParam {
    p1: string|ToValueOpt;
    p2?: ToValuePrimitive|ToValueLambda|ToValueOpt;
    values?: Array<ToValueOpt>;
}

export interface EndpointHelperLike {
    toValueItem(ins: DecoInstanceLike, p1: unknown, p2: unknown): ToValueOpt;
    organizeToValue(ins: DecoInstanceLike, params: ToValueParam): ToValueItems;

}
export interface ToValueItems {
    items: Array<ToValueOpt>;
}
export type ParamsSerializerLambda = <D = Dict>(ctx: Context, data: D) => string;
export type ToValueLambda = ToValueLambdaSync | ToValueLambdaAsync;
export type ToValueLambdaSync = (ctx: Context) => any;
export type ToValueLambdaAsync = (ctx: Context) => Promise<any>;

export type RetryLambda = RetryLambdaSync | RetryLambdaAsync;
export type RetryLambdaSync = (ctx: Context, times: number, status: HttpErrorStateNum) => boolean;
export type RetryLambdaAsync = (ctx: Context, times: number, status: HttpErrorStateNum) => Promise<boolean>;

export type HttpRequestBody = Arr|Dict|string|unknown;
export type HttpResponseData = Arr|Dict|string|unknown;
export type HttpRequestLambda<P = unknown> = (requestConfig: AxiosRequestConfig<P>) => boolean;
export type HttpResponseSuccessLambda<P = unknown, D = unknown, D2 = D> = (response: AxiosResponse<P, D>) => AxiosResponse<P, D2>;
export type HttpResponseErrorLambda<D = HttpResponseData, B = HttpRequestBody> = (response: HttpErrorResponse<Error, D, B>) => ExceptionLike;
export type ErrorParserLambda<E = Error, P = HttpRequestBody> = (error: Error, config: AxiosRequestConfig<P>) => HttpErrorResponse<E>;
export type HttpSuccessResponse<D = HttpResponseData, B = HttpRequestBody> = AxiosResponse<D, B>;
export type HttpRequestOptional = unknown;

export interface HttpErrorResponse<E = Error, D = HttpResponseData, P = HttpRequestBody> {
    data: D | E;
    status: number;
    statusText: string;
    headers: AxiosResponseHeaders;
    config: AxiosRequestConfig<P>;
    request?: HttpRequestOptional;
}

export type DurationLambda = DurationLambdaSync | DurationLambdaAsync;
export type DurationLambdaSync = (ctx: Context, duration: number, expected: number) => void;
export type DurationLambdaAsync = (ctx: Context, duration: number, expected: number) => Promise<void>;
