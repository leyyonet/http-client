import {Fqn, Loader} from "@leyyo/core";
import {FQN_PCK} from "./internal";
import {clientPool} from "./pool";

@Loader(clientPool)
@Fqn(FQN_PCK)
export class HttpClientLoader {

}
