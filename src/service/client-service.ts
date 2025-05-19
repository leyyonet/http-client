import {ClassReflectionLike, CoreReflectionLike, decoratorPool, Fqn} from "@leyyo/core";
import {$descriptor, $log, $repo, Arr} from "@leyyo/common";
import {httpSigner} from "@leyyo/http";
import {FQN_PCK} from "../internal";
import {ClientServiceConfig, ClientServiceLike, ServiceItem} from "./index.types";
import {ClientPoolLike} from "../pool";
import {
    BodySerializer,
    Consumes,
    Decompress,
    CheckDuration,
    ErrorParser,
    HttpClient,
    HttpClientOpt,
    IsForm,
    HttpProxy,
    MaxBodyLength,
    MaxContentLength,
    MaxRedirects,
    OnHttpError,
    OnHttpRequest,
    OnHttpSuccess,
    Produces, QuerySerializer, ResponseType, Retry, Timeout, ToCookie, ToHeader, ToParam, ToQuery, BodySerializerOpt
} from "../decorators";

@Fqn(FQN_PCK)
export class ClientService implements ClientServiceLike {
    private readonly logger = $log.create(ClientService);
    allClasses: Map<ClassReflectionLike, ServiceItem>;

    constructor(private pool: ClientPoolLike) {
        this.allClasses = $repo.newMap($descriptor.sym(FQN_PCK, 'allClasses'));
    }

    clear(): void {
        this.allClasses.clear();
    }

    protected _appendConfig(conf: ClientServiceConfig, key: keyof ClientServiceConfig, value: any) {
        if (!Array.isArray(conf[key])) {
            conf[key] = [];
        }
        conf[key].push(value);
    }
    protected _cloneConfig(source: ClientServiceConfig, target: ClientServiceConfig, key: keyof ClientServiceConfig) {
        if (!Array.isArray(source[key])) {
            return;
        }
        if (!Array.isArray(target[key])) {
            target[key] = [];
        }
        target[key].push(...(source[key] as Arr));
    }
    cloneConfig(source: ClientServiceConfig, target: ClientServiceConfig): void {
        this._cloneConfig(source, target, 'bodySerializer');
        this._cloneConfig(source, target, 'duration');
        this._cloneConfig(source, target, 'consumes');
        this._cloneConfig(source, target, 'decompress');
        this._cloneConfig(source, target, 'errorParser');
        this._cloneConfig(source, target, 'proxy');
        this._cloneConfig(source, target, 'isForm');
        this._cloneConfig(source, target, 'maxBodyLength');
        this._cloneConfig(source, target, 'maxContentLength');
        this._cloneConfig(source, target, 'maxRedirects');
        this._cloneConfig(source, target, 'onHttpError');
        this._cloneConfig(source, target, 'onHttpRequest');
        this._cloneConfig(source, target, 'onHttpSuccess');
        this._cloneConfig(source, target, 'produces');
        this._cloneConfig(source, target, 'querySerializer');
        this._cloneConfig(source, target, 'responseType');
        this._cloneConfig(source, target, 'retry');
        this._cloneConfig(source, target, 'timeout');
        this._cloneConfig(source, target, 'toCookie');
        this._cloneConfig(source, target, 'toHeader');
        this._cloneConfig(source, target, 'toParam');
        this._cloneConfig(source, target, 'toQuery');

    }
    fetchConfig(ref: CoreReflectionLike, conf: ClientServiceConfig): void {
        ref.docsAll().forEach(doc => {
            switch (doc.ins.identifier.fn) {
                case BodySerializer:
                    this._appendConfig(conf, 'bodySerializer', doc.value);
                    break;
                case CheckDuration:
                    this._appendConfig(conf, 'duration', doc.value);
                    break;
                case Consumes:
                    this._appendConfig(conf, 'consumes', doc.value);
                    break;
                case Decompress:
                    this._appendConfig(conf, 'decompress', doc.value);
                    break;
                case ErrorParser:
                    this._appendConfig(conf, 'errorParser', doc.value);
                    break;
                case HttpProxy:
                    this._appendConfig(conf, 'proxy', doc.value);
                    break;
                case IsForm:
                    this._appendConfig(conf, 'isForm', doc.value);
                    break;
                case MaxBodyLength:
                    this._appendConfig(conf, 'maxBodyLength', doc.value);
                    break;
                case MaxContentLength:
                    this._appendConfig(conf, 'maxContentLength', doc.value);
                    break;
                case MaxRedirects:
                    this._appendConfig(conf, 'maxRedirects', doc.value);
                    break;
                case OnHttpError:
                    this._appendConfig(conf, 'onHttpError', doc.value);
                    break;
                case OnHttpRequest:
                    this._appendConfig(conf, 'onHttpRequest', doc.value);
                    break;
                case OnHttpSuccess:
                    this._appendConfig(conf, 'onHttpSuccess', doc.value);
                    break;
                case Produces:
                    this._appendConfig(conf, 'produces', doc.value);
                    break;
                case QuerySerializer:
                    this._appendConfig(conf, 'querySerializer', doc.value);
                    break;
                case ResponseType:
                    this._appendConfig(conf, 'responseType', doc.value);
                    break;
                case Retry:
                    this._appendConfig(conf, 'retry', doc.value);
                    break;
                case Timeout:
                    this._appendConfig(conf, 'timeout', doc.value);
                    break;
                case ToCookie:
                    this._appendConfig(conf, 'toCookie', doc.value);
                    break;
                case ToHeader:
                    this._appendConfig(conf, 'toHeader', doc.value);
                    break;
                case ToParam:
                    this._appendConfig(conf, 'toParam', doc.value);
                    break;
                case ToQuery:
                    this._appendConfig(conf, 'toQuery', doc.value);
                    break;
            }
        })
    }
    fetchClasses(): void {
        const id = decoratorPool.get(HttpClient, true).asIdentifier;
        id
            .instances
            .forEach(ins => {
                const classRef = ins.asClass;
                if (httpSigner.is(classRef.creator, 'client.service')) {
                    this.pool.addWarning(100, {
                        issue: 'Client is already signed',
                        desc: ins.description,
                        clazz: classRef.name
                    });
                    return;
                }
                if (this.allClasses.has(classRef)) {
                    this.pool.addWarning(101, {
                        issue: 'Client is duplicated',
                        desc: ins.description,
                        clazz: classRef.name
                    });
                    return;
                }
                const item = this.newItem(classRef);
                item.address = ins.getValue<HttpClientOpt>();
                this.allClasses.set(classRef, item);
                httpSigner.append(classRef.creator, 'client.service');

                this.pool.addInfo(102, {
                    issue: 'Client is signed',
                    desc: ins.description,
                    clazz: classRef.name
                });
                this.fetchConfig(classRef, item.config);
            });
    }

    newItem(classRef: ClassReflectionLike): ServiceItem {
        return {
            classRef,
            address: {},
            instance: undefined,
            endpoints: new Map(),
            config: {},
        } as ServiceItem;
    }

}
