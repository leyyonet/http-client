import {decoratorPool, Fqn, lifecycle} from "@leyyo/core";
import {$descriptor, $log, $repo, $test, DevOpt, List} from "@leyyo/common";

import {FQN_PCK} from "../internal";
import {ClientService, ClientServiceLike} from "../service";
import {ClientEndpoint, ClientEndpointLike} from "../endpoint";
import {ClientParameter, ClientParameterLike} from "../parameter";
import {ClientPoolLike} from "./index.types";

@Fqn(FQN_PCK)
class ClientPool implements ClientPoolLike {
    private readonly logger = $log.create(ClientPool);

    private readonly _service: ClientServiceLike;
    private readonly _endpoint: ClientEndpointLike;
    private readonly _parameter: ClientParameterLike;

    infoMessages: List<DevOpt>;
    redundantMessages: List<DevOpt>;
    warningMessages: List<DevOpt>

    constructor() {
        this._service = new ClientService(this);
        this._endpoint = new ClientEndpoint(this);
        this._parameter = new ClientParameter(this);
    }

    clear(): void {
        lifecycle.clearMessages();
        this._service.clear();
        this._endpoint.clear();
        this._parameter.clear();
        decoratorPool.decorators()
            .filter(deco => deco.hasKeyword('api'))
            .forEach(deco => deco.clearInstances());
    }

    get endpoint(): ClientEndpointLike {
        return this._endpoint;
    }
    get parameter(): ClientParameterLike {
        return this._parameter;
    }

    get service(): ClientServiceLike {
        return this._service;
    }

    hasInfoCase(testCase: number|string): boolean {
        const filtered = this.infoMessages
            .filter(d => d.case === $test.code(FQN_PCK, testCase));
        return filtered.length > 0;
    }
    hasWarningCase(testCase: number|string): boolean {
        const filtered = this.warningMessages
            .filter(d => d.case === $test.code(FQN_PCK, testCase));
        return filtered.length > 0;
    }
    hasRedundantCase(testCase: number|string): boolean {
        const filtered = this.redundantMessages
            .filter(d => d.case === $test.code(FQN_PCK, testCase));
        return filtered.length > 0;
    }

    addInfo(testCase: number|string, opt: DevOpt): void {
        this.infoMessages.push({
            case: $test.code(FQN_PCK, testCase),
            ...opt,
        });
    }
    addWarning(testCase: number|string, opt: DevOpt): void {
        this.warningMessages.push({
            case: $test.code(FQN_PCK, testCase),
            ...opt,
        });
    }
    addRedundant(testCase: number|string, opt: DevOpt): void {
        this.redundantMessages.push({
            case: $test.code(FQN_PCK, testCase),
            ...opt,
        });
    }

    start() {
        this._service.fetchClasses();
        this._endpoint.fetchMethods();
    }
}
// noinspection JSUnusedGlobalSymbols
export const clientPool: ClientPoolLike = new ClientPool();
