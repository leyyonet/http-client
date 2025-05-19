import {ClassReflectionLike, DecoInstanceLike, ParameterReflectionLike, PropertyReflectionLike} from "@leyyo/core";
import {HttpMethod, HttpParameter, HttpPlaceExtended} from "@leyyo/http";
import {List} from "@leyyo/common";
import {ParameterItem} from "../parameter";
import {ClientServiceConfig} from "../service";

export interface ClientEndpointLike {
    allEndpoints: Map<PropertyReflectionLike, EndpointItem>;
    newItem(methodRef: PropertyReflectionLike, path: string): EndpointItem;
    clear(): void;
    fetchMethods(): void;
}

export interface EndpointItem {
    inController?: boolean;
    methodRef: PropertyReflectionLike;
    ins: DecoInstanceLike;

    classRef: ClassReflectionLike;
    methods: Array<HttpMethod>;
    path: string;

    parameters: Array<ParameterItem>;
    config: ClientServiceConfig;

    // from single
    uniqueNames: Record<HttpPlaceExtended, Array<string>>; // <place, name[]>
    // from single or multiple
    reservedNames: Record<HttpPlaceExtended, Array<string>>; // <place, name[]>
    // from multiple
    allUsed: Record<HttpPlaceExtended, Array<number>>; // <place, index[]>

    kindMap: Record<HttpParameter, number>; // kind / index

    // provided by routes
    pathNames: Array<string>;
    ignorableNames: Array<string>;

    // 1 - cloned from pathNames
    // 2 - must be empty at the end
    usableNames: List<string>;
}
