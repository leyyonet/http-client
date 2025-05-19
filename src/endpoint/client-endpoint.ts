import {ClientEndpointLike, EndpointItem} from "./index.types";
import {$descriptor, $dev, $repo, List} from "@leyyo/common";
import {decoratorPool, Fqn, PropertyReflectionLike} from "@leyyo/core";
import {httpSigner, Method, MethodOpt} from "@leyyo/http";
import {FQN_PCK} from "../internal";
import {ClientPoolLike} from "../pool";

@Fqn(FQN_PCK)
export class ClientEndpoint implements ClientEndpointLike {
    allEndpoints: Map<PropertyReflectionLike, EndpointItem>;

    constructor(private pool: ClientPoolLike) {
        this.allEndpoints = $repo.newMap($descriptor.sym(FQN_PCK, 'allEndpoints'));
    }
    clear(): void {
        this.allEndpoints.clear();
    }

    fetchMethods(): void {
        const id = decoratorPool.get(Method, true).asIdentifier;
        id
            .instances
            .forEach(ins => {
                const methodRef = ins.asMethod;
                const classRef = methodRef.clazz;
                if (httpSigner.is(classRef.creator, 'http.ignored')) {
                    return;
                }
                if (httpSigner.is(classRef.creator, 'http.app')) {
                    return;
                }
                if (httpSigner.is(classRef.creator, 'http.controller')) {
                    return;
                }
                if (httpSigner.is(methodRef.callable, 'client.endpoint')) {
                    this.pool.addWarning(200, {
                        issue: 'Method is already signed as an endpoint',
                        desc: ins.description
                    });
                    return;
                }
                if (httpSigner.isExt(classRef.creator, methodRef.name, 'methods')) {
                    this.pool.addWarning(201, {issue: 'Method is already signed as an endpoint', desc: ins.description});
                    return;
                }

                if (!httpSigner.is(classRef.creator, 'client.service')) {
                    throw $dev.developerError2(FQN_PCK, 202, {issue: 'Client class is not signed as a controller', desc: ins.description});
                }

                const serviceItem = this.pool.service.allClasses.get(classRef);
                if (!serviceItem) {
                    throw $dev.developerError2(FQN_PCK, 203, {issue: 'Service class is not in services', host: ins.description});
                }

                const opt = ins.getValue<MethodOpt>();
                const endpointItem = this.newItem(methodRef, opt.path);
                endpointItem.inController = true;
                endpointItem.ins = ins;
                endpointItem.methods.push(...opt.methods);
                this.allEndpoints.set(methodRef, endpointItem);
                serviceItem.endpoints.set(methodRef, endpointItem);
                httpSigner.append(methodRef.callable, 'client.endpoint');
                httpSigner.appendExt(classRef.creator, methodRef.name, 'methods');

                this.pool.addInfo(204, {
                    issue: 'Endpoint is bound to service',
                    desc: ins.description
                });
                this.pool.service.cloneConfig(serviceItem.config, endpointItem.config);
                this.pool.service.fetchConfig(methodRef, endpointItem.config);
            });
    }

    newItem(methodRef: PropertyReflectionLike, path: string): EndpointItem {
        return {
            methodRef,
            classRef: methodRef.clazz,
            path,
            methods: [],

            parameters: [],
            kindMap: {},
            uniqueNames: {},
            reservedNames: {},
            allUsed: {},

            pathNames: [],
            ignorableNames: [],
            usableNames: new List(),
            config: {},
        } as EndpointItem;
    }
    
}
