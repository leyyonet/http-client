import {strict as assert} from 'assert';
import {describe, it} from "node:test";
import {reflectionPool} from "@leyyo/core";
import {httpSigner} from "@leyyo/http";
import {$test, InvalidValueError} from "@leyyo/common";
import {clientPool} from "../pool";
import {HttpClient} from "../decorators";

describe('30* >> Service', () => {
    it($test.title(100, '[w] Service is already signed'), () => {
        // $test.$secure.$ok();
        clientPool.clear();

        assert.doesNotThrow(() => {

                @HttpClient('http://localhost:8080/users')
                class Client100 {

                }
                httpSigner.append(Client100, 'client.service'); // hack the system
                clientPool.service.fetchClasses();

                assert.equal(clientPool.hasWarningCase(100), true);
            })
    });
    it($test.title(101, '[w] Service is duplicated'), () => {
        // $test.$secure.$ok();
        clientPool.clear();

        assert.doesNotThrow(() => {

            @HttpClient(() => 'http://localhost:8080/users')
            class Client101 {

            }
            const classRef = reflectionPool.get(Client101); // hack the system
            clientPool.service.allClasses.set(classRef, clientPool.service.newItem(classRef));

            clientPool.service.fetchClasses();

            assert.equal(clientPool.hasWarningCase(101), true);
        })
    });
    it($test.title(102, '[s] Service is signed'), () => {
        // $test.$secure.$ok();
        clientPool.clear();

        assert.doesNotThrow(() => {

            @HttpClient()
            class Client102 {

            }
            clientPool.service.fetchClasses();

            assert.equal(clientPool.hasInfoCase(102), true);
        })
    });
    it($test.title(103, '[e] Service address is invalid'), () => {
        // $test.$secure.$ok();

        assert.throws(() => {
                clientPool.clear();

                @HttpClient()
                class Client103 {

                }
                clientPool.service.fetchClasses();
            },
            error => {
                assert.equal(error instanceof InvalidValueError, true);
                return true;
            })
    });
});
