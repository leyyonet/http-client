/**
 * Http response type items
 * */
export const HttpResponseTypeItems = [
    'arraybuffer', 'blob', 'document', 'json', 'text', 'stream',
] as const;
// noinspection JSUnusedGlobalSymbols
/**
 * Http response type
 * */
export type HttpResponseType = typeof HttpResponseTypeItems[number];
