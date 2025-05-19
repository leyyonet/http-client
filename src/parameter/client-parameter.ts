import {ClientParameterLike, ParameterControlFlag, ParameterItem,} from "./index.types";
import {HttpParameter, HttpPlaceExtended} from "@leyyo/http";
import {$dev, $log, Func, MethodTested, Tested} from "@leyyo/common";
import {DecoInstanceLike, Fqn, ParameterReflectionLike, PropertyReflectionLike} from "@leyyo/core";
import {EndpointItem} from "../endpoint";
import {FQN_PCK} from "../internal";
import {ClientPoolLike} from "../pool";
import {
    AsBody,
    AsCookie,
    AsCookies,
    AsFile,
    AsFiles,
    AsHeader,
    AsHeaders,
    AsParam,
    AsParams,
    AsQueries,
    AsQuery,
    MonoParamOpt
} from "../decorators";

@Tested()
@Fqn(FQN_PCK)
export class ClientParameter implements ClientParameterLike {

    // region properties
    private readonly logger = $log.create(ClientParameter);
    private readonly _PLACE_BY_KIND = {
        body: 'body',
        cookie: 'cookie',
        cookies: 'cookie',
        file: 'file',
        files: 'file',
        header: 'header',
        headers: 'header',
        param: 'path',
        params: 'path',
        query: 'query',
        queries: 'query',
        context: null,
        request: null,
        response: null,
        application: null,
    } as Record<HttpParameter, HttpPlaceExtended>;
    private readonly _KIND_BY_NAME = {
        // anonymous
        body: 'body',
        payload: 'body',
        ctx: 'context',
        context: 'context',
        res: 'response',
        response: 'response',
        req: 'request',
        request: 'request',
        app: 'application',
        application: 'application',
        // multiple
        cookies: 'cookies',
        headers: 'headers',
        params: 'params',
        queries: 'queries',
        files: 'files',
    } as Record<string, HttpParameter>;
    private readonly _KIND_BY_DECO = {
        AsApp: 'application',
        AsContext: 'context',
        AsRequest: 'request',
        AsResponse: 'response',
        Body: 'body',

        Cookie: 'cookie',
        Cookies: 'cookies',
        File: 'file',
        Files: 'files',
        Header: 'header',
        Headers: 'headers',
        Param: 'param',
        Params: 'params',
        Query: 'query',
        Queries: 'queries',
    } as Record<string, HttpParameter>;
    private readonly _NAME_POLY = ['cookies', 'files', 'headers', 'params', 'queries'] as Array<HttpParameter>;
    private readonly _NAME_MONO = ['cookie', 'file', 'header', 'param', 'query'] as Array<HttpParameter>;
    private readonly _ANONYMOUS_KINDS = ['body', 'context', 'response', 'request', 'application'] as Array<HttpParameter>;

    // endregion properties

    constructor(private pool: ClientPoolLike) {

    }

    newItem(ref: ParameterReflectionLike): ParameterItem {
        return {
            ref,
            place: undefined,
            kind: undefined,
            flags: [],
            resource: undefined,
            resourceMap: {},
        } as ParameterItem;
    }

    protected _buildItems(paramRefList: Array<ParameterReflectionLike>, endpointItem: EndpointItem): void {
        paramRefList.forEach(paramRef =>
            endpointItem.parameters.push(this.newItem(paramRef))
        );
    }

    /**
     * - Default parameter is not allowed in endpoint
     * - Variadic parameter is not allowed in endpoint
     * */
    @MethodTested(300)
    protected _checkNotAllowed(paramRefList: Array<ParameterReflectionLike>): void {
        paramRefList.forEach(paramRef => {
            if (paramRef.isVariadic) {
                throw $dev.developerError2(FQN_PCK, 300, {
                    issue: 'Variadic parameter is not allowed in endpoint',
                    desc: paramRef.description
                });
            }
        });
    }

    @MethodTested(301, 302)
    protected _kindFromDeco(paramRefList: Array<ParameterReflectionLike>, endpointItem: EndpointItem): void {
        const singleUsed = [] as Array<Func>;
        paramRefList
            .forEach((paramRef, index) => {
                const item = endpointItem.parameters[index];
                paramRef.docsAll()
                    .filter(doc => doc.ins.identifier.hasKeyword('api'))
                    .forEach(doc => {
                        const fn = doc.ins.identifier.fn;
                        const kind = this._KIND_BY_DECO[fn.name];
                        switch (fn) {
                            case AsBody:
                                this._only1Deco(item);
                                if (this._multipleUsedDeco(item, doc.ins, singleUsed)) {
                                    break;
                                }
                                this._setKind(item, kind);
                                this._appendFlag(item, 'kind-from-deco');
                                break;
                            case AsCookie:
                            case AsFile:
                            case AsHeader:
                            case AsParam:
                            case AsQuery:
                            case AsCookies:
                            case AsFiles:
                            case AsHeaders:
                            case AsParams:
                            case AsQueries:
                                this._only1Deco(item);
                                this._setKind(item, kind);
                                this._appendFlag(item, 'kind-from-deco');
                                break;
                        }
                    })
            });

    }

    /**
     * Case 1
     * */
    @MethodTested(301)
    protected _only1Deco(item: ParameterItem): void {
        if (item.flags.includes('has-deco')) {
            throw $dev.developerError2(FQN_PCK, 301, {issue: 'A Parameter can use only one place decorator'});
        }
        item.flags.push('has-deco');
    }

    @MethodTested(302)
    protected _multipleUsedDeco(item: ParameterItem, ins: DecoInstanceLike, singleUsed: Array<Func>): boolean {
        if (singleUsed.includes(ins.identifier.fn)) {
            this.pool.addWarning(302, {
                issue: `Anonymous decorators can be used only one time`,
                desc: ins.description,
                item: item.ref.description,
            });
            return true;
        }
        singleUsed.push(ins.identifier.fn);
        return false;
    }

    @MethodTested(310, 311, 312, 313, 314, 315)
    protected _nameFromDeco(paramRefList: Array<ParameterReflectionLike>, endpointItem: EndpointItem): void {
        paramRefList
            .forEach((paramRef, index) => {
                const item = endpointItem.parameters[index];
                if (!this._hasFlag(item, 'has-deco')) {
                    return;
                }
                if (this._ANONYMOUS_KINDS.includes(item.kind)) {
                    return;
                }
                paramRef.docsAll()
                    .filter(doc => doc.ins.identifier.hasKeyword('api'))
                    .forEach(doc => {
                        switch (doc.ins.identifier.fn) {
                            case AsCookie:
                            case AsFile:
                            case AsHeader:
                            case AsQuery:
                            case AsParam:
                                this._retrieveMonoResource(endpointItem, item, doc.value as MonoParamOpt);
                                this._checkUniqueNames(endpointItem, item);
                                break;
                            case AsCookies:
                            case AsFiles:
                            case AsHeaders:
                            case AsParams:
                            case AsQueries:
                                this._checkMultiple(endpointItem, item);
                                break;
                        }
                    })
            });

    }

    @MethodTested(310, 311, 312)
    protected _checkUniqueNames(endpointItem: EndpointItem, item: ParameterItem): void {
        if (item.resource) {
            if (item.place === 'path') {
                if (endpointItem.usableNames.includes(item.resource)) {
                    endpointItem.usableNames.delete(item.resource);
                } else {
                    throw $dev.developerError2(FQN_PCK, 310, {
                        issue: 'Path value does not exist in endpoint path',
                        kind: item.kind,
                        current: item.resource,
                        expected: endpointItem.pathNames,
                        desc: item.ref.description
                    })
                }
            }
            if (endpointItem.uniqueNames[item.kind] === undefined) {
                endpointItem.uniqueNames[item.kind] = [];
            }
            if (endpointItem.uniqueNames[item.kind].includes(item.resource)) {
                throw $dev.developerError2(FQN_PCK, 312, {
                    issue: 'Resource is reserved by another parameter',
                    kind: item.kind,
                    resource: item.resource,
                    desc: item.ref.description
                })
            } else {
                endpointItem.uniqueNames[item.kind].push(item.resource);
            }
            this._appendFlag(item, 'resource-from-deco');
        }
    }

    protected _checkMultiple(_endpointItem: EndpointItem, item: ParameterItem): void {
        this._appendFlag(item, 'resource-from-deco');
    }

    @MethodTested(313, 314, 315)
    protected _retrieveMonoResource(_endpointItem: EndpointItem, item: ParameterItem, param: MonoParamOpt): void {
        if (!param.field) {
            if (param.field && ['header', 'cookie'].includes(item.place)) {
                param.field = this._camelToKebab(item.ref.name);
                this._appendFlag(item, 'field-formatted');
            } else if (param.isRemoteSnakeCase) {
                param.field = this._camelToSnake(item.ref.name);
                this._appendFlag(item, 'field-formatted');
            }
        } else {
            this._appendFlag(item, 'field-given');
        }
        item.resource = param.field as string;
    }

    //560
    protected _nameFromPath(paramRefList: Array<ParameterReflectionLike>, endpointItem: EndpointItem): void {
        paramRefList
            .forEach((paramRef, index) => {
                const item = endpointItem.parameters[index];
                if (this._ANONYMOUS_KINDS.includes(item.kind)) {
                    return;
                }
                // resource is already found
                if (this._hasFlag(item, 'resource-from-deco')) {
                    return;
                }
                // if kind is known and it's not param
                if (item.kind && item.kind !== 'param') {
                    return;
                }
                // if reflection name is in path
                if (endpointItem.usableNames.includes(item.ref.name)) {
                    if (!item.kind) {
                        this._setKind(item, 'param');
                        this._appendFlag(item, 'kind-from-path');
                    }
                    this._appendFlag(item, 'resource-from-path');
                    item.resource = item.ref.name;
                    endpointItem.usableNames.delete(item.ref.name);
                }
            });
    }

    @MethodTested(320)
    protected _kindFromReflect(paramRefList: Array<ParameterReflectionLike>, endpointItem: EndpointItem): void {
        paramRefList
            .forEach((paramRef, index) => {
                const item = endpointItem.parameters[index];
                if (this._hasFlag(item, 'has-deco')) {
                    return;
                }
                if (!paramRef.name) {
                    return;
                }

                const resource = paramRef.name;
                const kind = this._KIND_BY_NAME[resource.toLowerCase()];
                if (kind !== undefined) {
                    const isAnonymous = this._ANONYMOUS_KINDS.includes(kind);
                    const isMultiple = this._NAME_POLY.includes(kind);
                    if (isAnonymous || isMultiple) {
                        if (endpointItem.kindMap[kind] === undefined) {
                            endpointItem.kindMap[kind] = item.ref.index;
                            this._setKind(item, kind);
                            this._appendFlag(item, 'kind-from-ref');
                            this._appendFlag(item, 'resource-from-ref');
                            if (isAnonymous) {
                                item.resource = resource;
                            } else {
                                item.all = true;
                            }
                        }
                    }
                }

            });
    }

    @MethodTested(330)
    protected _kindFromEmpty(_paramRefList: Array<ParameterReflectionLike>, endpointItem: EndpointItem): void {
        const emptyKinds = endpointItem.parameters.filter(p => !p.kind);
        // there is only 1 hole and body is not reserved
        if (emptyKinds.length === 1 && endpointItem.kindMap.body === undefined) {
            const item = emptyKinds[0];
            this._setKind(item, 'body');
            this._appendFlag(item, 'kind-from-empty');
            this._appendFlag(item, 'resource-from-empty');
            endpointItem.kindMap.body = item.ref.index;
        }
    }

    @MethodTested(331)
    protected _checkEmptyKind(_paramRefList: Array<ParameterReflectionLike>, endpointItem: EndpointItem): void {
        const emptyKinds = endpointItem.parameters.filter(p => !p.kind);
        if (emptyKinds.length > 0) {
            const notAttended = emptyKinds
                .map(item => item.ref.description);
            throw $dev.developerError2(FQN_PCK, 331, {
                issue: 'Some parameters are attended to any resource',
                desc: endpointItem.methodRef.description,
                notAttended
            });
        }
    }

    // 310
    protected _checkRemainingPaths(_paramRefList: Array<ParameterReflectionLike>, endpointItem: EndpointItem): void {
        if (endpointItem.usableNames.length > 0) {
            const remainingPaths = endpointItem.usableNames.filter(path => !endpointItem.ignorableNames.includes(path));
            if (remainingPaths.length > 0) {
                this.pool.addWarning(310, {
                    issue: `Endpoint has remaining path values which are not used by any parameter`,
                    desc: endpointItem.methodRef.description,
                    remainingPaths
                });
            }
        }
    }

    protected _appendFlag(item: ParameterItem, flag: ParameterControlFlag): void {
        if (item.flags.includes(flag)) {
            return;
        }
        item.flags.push(flag);
    }

    protected _hasFlag(item: ParameterItem, flag: ParameterControlFlag): boolean {
        return item.flags.includes(flag);
    }

    protected _setKind(item: ParameterItem, kind: HttpParameter): void {
        item.kind = kind;
        item.place = this._PLACE_BY_KIND[kind];
    }

    protected _camelToKebab(str: string) {
        return str.replace(/([a-zA-Z])(?=[A-Z])/g, '$1\-').toLowerCase();
    }

    protected _camelToSnake(str: string) {
        return str.replace(/([a-zA-Z])(?=[A-Z])/g, '$1\_').toLowerCase();
    }

    forMethod(methodRef: PropertyReflectionLike, endpointItem: EndpointItem): void {
        const paramRefList = methodRef.listParameters();
        if (paramRefList.length < 1) {
            return;
        }

        this._buildItems(paramRefList, endpointItem);
        this._checkNotAllowed(paramRefList);
        this._kindFromDeco(paramRefList, endpointItem);
        this._nameFromDeco(paramRefList, endpointItem);
        this._nameFromPath(paramRefList, endpointItem);
        this._kindFromReflect(paramRefList, endpointItem);
        this._kindFromEmpty(paramRefList, endpointItem);
        this._checkEmptyKind(paramRefList, endpointItem);
        this._checkRemainingPaths(paramRefList, endpointItem);

    }

    clear(): void {

    }

    fetchParameters(): void {
        this.pool.endpoint.allEndpoints
            .forEach((endpointItem, methodRef) => {
                this.forMethod(methodRef, endpointItem);
            })
    }
}
