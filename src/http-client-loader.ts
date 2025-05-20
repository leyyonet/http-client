import {Fqn} from "@leyyo/core";
import {Loader} from "@leyyo/injection";
import {FQN_PCK} from "./internal";
import {clientPool} from "./pool";

@Loader(clientPool)
@Fqn(FQN_PCK)
export class HttpClientLoader {

}
