import {DevOpt, List} from "@leyyo/common";
import {ClientServiceLike} from "../service";
import {ClientEndpointLike} from "../endpoint";
import {ClientParameterLike} from "../parameter";

export interface ClientPoolLike {
    start(): void;

    hasInfoCase(testCase: number | string): boolean;

    hasWarningCase(testCase: number | string): boolean;

    hasRedundantCase(testCase: number | string): boolean;

    addInfo(testCase: number | string, opt: DevOpt): void;

    addWarning(testCase: number | string, opt: DevOpt): void;

    addRedundant(testCase: number | string, opt: DevOpt): void;


    infoMessages: List<DevOpt>;
    redundantMessages: List<DevOpt>;
    warningMessages: List<DevOpt>;

    clear(): void;

    get service(): ClientServiceLike;

    get endpoint(): ClientEndpointLike;

    get parameter(): ClientParameterLike;
}
