import {strict as assert} from 'assert';
import {beforeEach, describe, it} from "node:test";
import {decoratorPool, reflectionPool} from "@leyyo/core";
import {Get, httpSigner, Method, Post} from "@leyyo/http";
import {$test} from "@leyyo/common";

import {FQN_PCK} from "../internal";
import {clientPool} from "../pool";
import {HttpClient} from "../decorators";

describe('50* >> Endpoint', () => {
    beforeEach(() => decoratorPool.get(Method).clearInstances());
    it($test.title(200, '[w] Method is already signed as an endpoint'), () => {
        // $test.$secure.$ok();
        clientPool.clear();

        assert.doesNotThrow(() => {

            @HttpClient('users')
            class Client200 {

                @Get()
                getUsers200() {
                }
            }

            const methodRef = reflectionPool.get(Client200).getInstanceProperty('getUsers500');
            httpSigner.append(methodRef.callable, 'client.endpoint'); // hack
            clientPool.service.fetchClasses();
            clientPool.endpoint.fetchMethods();

            assert.equal(clientPool.hasWarningCase(200), true);
        })
    });
    it($test.title(201, '[w] Method is already signed as an endpoint'), () => {
        // $test.$secure.$ok();
        clientPool.clear();

        assert.doesNotThrow(() => {

            @HttpClient()
            class Client201 {

                @Get()
                getUsers201() {
                }
            }

            httpSigner.appendExt(Client201, 'getUsers201', 'methods'); // hacks
            clientPool.service.fetchClasses();
            clientPool.endpoint.fetchMethods();

            assert.equal(clientPool.hasWarningCase(201), true);
        })
    });
    it($test.title(202, '[e] Class is not signed as a service'), () => {
        // $test.$secure.$ok();

        assert.throws(() => {
                clientPool.clear();

                @HttpClient()
                class HttpClient202 {

                    @Get()
                    getUsers202() {
                    }
                }

                clientPool.service.fetchClasses();
                clientPool.service.allClasses.delete(reflectionPool.get(HttpClient202)); // hack
                clientPool.endpoint.fetchMethods();
            },
            error => {
                assert.equal((error as Error).message, $test.code(FQN_PCK, 202));
                return true;
            })
    });
    it($test.title(203, '[e] Class is not decorated as a service'), () => {
        // $test.$secure.$ok();
        clientPool.clear();

        assert.throws(() => {

                @HttpClient()
                class HttpClient203 {

                    @Get()
                    getUsers520() {
                    }
                }
                clientPool.service.allClasses.delete(reflectionPool.get(HttpClient203)); // hack
                clientPool.service.fetchClasses();
                clientPool.endpoint.fetchMethods();
            },
            error => {
                assert.equal((error as Error).message, $test.code(FQN_PCK, 203));
                return true;
            })
    });
    it($test.title(204, '[s] Endpoint is bound to service'), () => {
        // $test.$secure.$ok();
        clientPool.clear();

        assert.doesNotThrow(() => {

            @HttpClient()
            class HttpClient204 {
                @Post()
                getUsers522() {
                }
            }

            clientPool.service.fetchClasses();
            clientPool.endpoint.fetchMethods();

            assert.equal(clientPool.hasInfoCase(204), true);
        })
    });
});
