import {strict as assert} from 'assert';
import {describe, it} from "node:test";
import {reflectionPool} from "@leyyo/core";
import {Get} from "@leyyo/http";
import {$test} from "@leyyo/common";

import {FQN_PCK} from "../internal";
import {PropertyReflectionLike} from "@leyyo/core";
import {clientPool} from "../pool";
import {AsCookie, AsHeader, AsParam, AsQuery} from "../decorators";
import {AsBody} from "../decorators";
import {EndpointItem} from "../endpoint";

function newEndpointItem(ref: PropertyReflectionLike, paths?: Array<string>, ignorable?: Array<string>): EndpointItem {
    const endpointItem = clientPool.endpoint.newItem(ref, '');
    endpointItem.methods = ['get'];

    if (Array.isArray(paths) && paths.length > 0) {
        endpointItem.pathNames.push(...paths);
    }
    if (Array.isArray(ignorable) && ignorable.length > 0) {
        endpointItem.ignorableNames.push(...ignorable);
    }
    if (endpointItem.pathNames.length > 0) {
        endpointItem.usableNames.push(...endpointItem.pathNames);
    }
    return endpointItem;
}

describe('Constraints', () => {
    it($test.title(300, 'Variadic parameter is not allowed in endpoint'), () => {
        clientPool.clear();

        assert.throws(() => {
                class Class300 {

                    @Get()
                    get(...id: Array<any>) {
                        return [id];
                    }
                }

                const ref = reflectionPool.get(Class300).getInstanceProperty('get');
                const endpointItem = newEndpointItem(ref);
                clientPool.parameter.forMethod(ref, endpointItem);
            },
            error => {
                assert.equal((error as Error).message, $test.code(FQN_PCK, 300));
                return true;
            })
    });
});
describe('Kind from decorator', () => {
    it($test.title(301, 'A Parameter can use only one place decorator'), () => {
        clientPool.clear();

        assert.throws(() => {

                class Class301 {

                    @Get()
                    get(@AsHeader() @AsCookie() value: any) {
                        return [value];
                    }
                }

                const ref = reflectionPool.get(Class301).getInstanceProperty('get');
                const endpointItem = newEndpointItem(ref);
                clientPool.parameter.forMethod(ref, endpointItem);
            },
            error => {
                assert.equal((error as Error).message, $test.code(FQN_PCK, 301));
                return true;
            })
    });
    it($test.title(301, 'Parameter can use only one same decorator'), () => {
        clientPool.clear();

        assert.throws(() => {

                class Class301A {

                    @Get()
                    get(@AsCookie() @AsCookie() value: any) {
                        return [value];
                    }
                }

                const ref = reflectionPool.get(Class301A).getInstanceProperty('get');
                const endpointItem = newEndpointItem(ref);
                clientPool.parameter.forMethod(ref, endpointItem);
            },
            error => {
                assert.equal((error as Error).message, $test.code('leyyo.decorator', 120)); // @bound
                return true;
            })
    });
});
describe('Anonymous decorators', () => {
    it($test.title(302, 'Body can be used only one time'), () => {
        clientPool.clear();

        assert.doesNotThrow(() => {

            class Controller302 {

                @Get()
                get(@AsBody() body: any, @AsBody() payload: any) {
                    return [body, payload];
                }
            }

            const ref = reflectionPool.get(Controller302).getInstanceProperty('get');
            const endpointItem = newEndpointItem(ref);
            clientPool.parameter.forMethod(ref, endpointItem);
            assert.equal(clientPool.hasWarningCase(302), true); // payload index: 1
        })
    });
});
describe('Mono resource in place decorators', () => {
    it($test.title(310, 'Path value does not exist in endpoint path'), () => {
        clientPool.clear();
        assert.throws(() => {
                class Class310 {
                    @Get()
                    get(@AsParam('incorrectKey') value: any) {
                        return [value];
                    }
                }
                const ref = reflectionPool.get(Class310).getInstanceProperty('get');
                const endpointItem = newEndpointItem(ref, ['correctKey']);
                clientPool.parameter.forMethod(ref, endpointItem);
            },
            error => {
                assert.equal((error as Error).message, $test.code(FQN_PCK, 310));
                return true;
            })
    });
    it($test.title(311, 'Path value reserved by earlier parameter'), () => {
        clientPool.clear();

        assert.throws(() => {

                class Class310A {
                    @Get()
                    get(@AsParam('customerId') customerId: any, @AsParam('customerId') customerId2: any) {
                        return [customerId, customerId2];
                    }
                }
                const ref = reflectionPool.get(Class310A).getInstanceProperty('get');
                const endpointItem = newEndpointItem(ref, ['customerId']);
                clientPool.parameter.forMethod(ref, endpointItem);
            },
            error => {
                assert.equal((error as Error).message, $test.code(FQN_PCK, 310)); // @bound
                return true;
            })
    });
    it($test.title(312, 'Resource is reserved by another parameter'), () => {
        clientPool.clear();

        assert.throws(() => {

                class Class312 {
                    @Get()
                    get(@AsQuery('customerId') customerId: any, @AsQuery('customerId') addressId: any) {
                        return [customerId, addressId];
                    }
                }
                const ref = reflectionPool.get(Class312).getInstanceProperty('get');
                const endpointItem = newEndpointItem(ref);
                clientPool.parameter.forMethod(ref, endpointItem);
            },
            error => {
                assert.equal((error as Error).message, $test.code(FQN_PCK, 312));
                return true;
            })
    });
    it($test.title(313, 'Only true can be used in place of false'), () => {
        clientPool.clear();

        assert.throws(() => {

                class Class313 {
                    @Get()
                    get(@AsQuery(false as true) customerId: any) { // hack the typescript with as keyword
                        return [customerId];
                    }
                }
                const ref = reflectionPool.get(Class313).getInstanceProperty('get');
                const endpointItem = newEndpointItem(ref);
                clientPool.parameter.forMethod(ref, endpointItem);
            },
            error => {
                assert.equal((error as Error).message, $test.code(FQN_PCK, 313));
                return true;
            })
    });
    it($test.title(314, 'Field name should be trimmed string'), () => {
        clientPool.clear();

        assert.throws(() => {

                class Class314 {
                    @Get()
                    get(@AsQuery('  ') customerId: any) { // hack the typescript with as keyword
                        return [customerId];
                    }
                }
                const ref = reflectionPool.get(Class314).getInstanceProperty('get');
                const endpointItem = newEndpointItem(ref);
                clientPool.parameter.forMethod(ref, endpointItem);
            },
            error => {
                assert.equal((error as Error).message, $test.code(FQN_PCK, 314));
                return true;
            })
    });
    it($test.title(315, 'Field name a string - strictly'), () => {
        clientPool.clear();

        assert.throws(() => {

                class Class315 {
                    @Get()
                    get(@AsQuery(44 as unknown as string) customerId: any) { // hack the typescript with as keyword
                        return [customerId];
                    }
                }
                const ref = reflectionPool.get(Class315).getInstanceProperty('get');
                const endpointItem = newEndpointItem(ref);
                clientPool.parameter.forMethod(ref, endpointItem);
            },
            error => {
                assert.equal((error as Error).message, $test.code(FQN_PCK, 314));
                return true;
            })
    });
});

describe('Find with parameter name', () => {
    it($test.title(320, 'Bind [body] named parameter to body resource'), () => {
        clientPool.clear();

        assert.doesNotThrow(() => {

            class Class320Body {
                @Get()
                get(body: string) {
                    return [body];
                }
            }
            const ref = reflectionPool.get(Class320Body).getInstanceProperty('get');
            const endpointItem = newEndpointItem(ref, ['id']);
            clientPool.parameter.forMethod(ref, endpointItem);
            const paramItem = endpointItem.parameters[0]; // app
            assert.equal(paramItem.kind, 'body');
            assert.equal(paramItem.flags.includes('kind-from-ref'), true);
            assert.equal(paramItem.flags.includes('resource-from-ref'), true);
        });
    });
    it($test.title(320, 'Bind [payload] named parameter to body resource'), () => {
        clientPool.clear();

        assert.doesNotThrow(() => {

            class Class320Payload {
                @Get()
                get(payload: string) {
                    return [payload];
                }
            }
            const ref = reflectionPool.get(Class320Payload).getInstanceProperty('get');
            const endpointItem = newEndpointItem(ref, ['id']);
            clientPool.parameter.forMethod(ref, endpointItem);
            const paramItem = endpointItem.parameters[0]; // app
            assert.equal(paramItem.kind, 'body');
            assert.equal(paramItem.flags.includes('kind-from-ref'), true);
            assert.equal(paramItem.flags.includes('resource-from-ref'), true);
        });
    });
    it($test.title(320, 'Bind [cookies] named parameter to all cookies resource'), () => {
        clientPool.clear();

        assert.doesNotThrow(() => {

            class Class320Cookies {
                @Get()
                get(cookies: string) {
                    return [cookies];
                }
            }
            const ref = reflectionPool.get(Class320Cookies).getInstanceProperty('get');
            const endpointItem = newEndpointItem(ref, ['id']);
            clientPool.parameter.forMethod(ref, endpointItem);
            const paramItem = endpointItem.parameters[0]; // app
            assert.equal(paramItem.kind, 'cookies');
            assert.equal(paramItem.flags.includes('kind-from-ref'), true);
            assert.equal(paramItem.flags.includes('resource-from-ref'), true);
        });
    });
    it($test.title(320, 'Bind [headers] named parameter to all headers resource'), () => {
        clientPool.clear();

        assert.doesNotThrow(() => {

            class Class320Headers {
                @Get()
                get(headers: string) {
                    return [headers];
                }
            }
            const ref = reflectionPool.get(Class320Headers).getInstanceProperty('get');
            const endpointItem = newEndpointItem(ref, ['id']);
            clientPool.parameter.forMethod(ref, endpointItem);
            const paramItem = endpointItem.parameters[0]; // app
            assert.equal(paramItem.kind, 'headers');
            assert.equal(paramItem.flags.includes('kind-from-ref'), true);
            assert.equal(paramItem.flags.includes('resource-from-ref'), true);
        });
    });
    it($test.title(320, 'Bind [params] named parameter to all params resource'), () => {
        clientPool.clear();

        assert.doesNotThrow(() => {

            class Class320Params {
                @Get()
                get(params: string) {
                    return [params];
                }
            }
            const ref = reflectionPool.get(Class320Params).getInstanceProperty('get');
            const endpointItem = newEndpointItem(ref, ['id']);
            clientPool.parameter.forMethod(ref, endpointItem);
            const paramItem = endpointItem.parameters[0]; // app
            assert.equal(paramItem.kind, 'params');
            assert.equal(paramItem.flags.includes('kind-from-ref'), true);
            assert.equal(paramItem.flags.includes('resource-from-ref'), true);
        });
    });
    it($test.title(320, 'Bind [queries] named parameter to all queries resource'), () => {
        clientPool.clear();

        assert.doesNotThrow(() => {

            class Class320Queries {
                @Get()
                get(queries: string) {
                    return [queries];
                }
            }
            const ref = reflectionPool.get(Class320Queries).getInstanceProperty('get');
            const endpointItem = newEndpointItem(ref, ['id']);
            clientPool.parameter.forMethod(ref, endpointItem);
            const paramItem = endpointItem.parameters[0]; // app
            assert.equal(paramItem.kind, 'queries');
            assert.equal(paramItem.flags.includes('kind-from-ref'), true);
            assert.equal(paramItem.flags.includes('resource-from-ref'), true);
        });
    });
    it($test.title(320, 'Bind [files] named parameter to all files resource'), () => {
        clientPool.clear();

        assert.doesNotThrow(() => {

            class Class320Files {
                @Get()
                get(files: string) {
                    return [files];
                }
            }
            const ref = reflectionPool.get(Class320Files).getInstanceProperty('get');
            const endpointItem = newEndpointItem(ref, ['id']);
            clientPool.parameter.forMethod(ref, endpointItem);
            const paramItem = endpointItem.parameters[0]; // app
            assert.equal(paramItem.kind, 'files');
            assert.equal(paramItem.flags.includes('kind-from-ref'), true);
            assert.equal(paramItem.flags.includes('resource-from-ref'), true);
        });
    });
});

describe('Not attended parameters', () => {
    it($test.title(330, 'Attend empty parameter to body'), () => {
        clientPool.clear();

        assert.doesNotThrow(() => {

            class Class330 {
                @Get()
                get(id: string, @AsQuery() flag: boolean, body55: any) {
                    return [id, flag, body55];
                }
            }
            const ref = reflectionPool.get(Class330).getInstanceProperty('get');
            const endpointItem = newEndpointItem(ref, ['id']);
            clientPool.parameter.forMethod(ref, endpointItem);
            const paramItem = endpointItem.parameters[2]; // body55
            assert.equal(paramItem.kind, 'body');
            assert.equal(paramItem.flags.includes('kind-from-empty'), true);
            assert.equal(paramItem.flags.includes('resource-from-empty'), true);
        });
    });
    it($test.title(331, 'Some parameters are attended to any resource'), () => {
        clientPool.clear();

        assert.throws(() => {

                class Class331 {
                    @Get()
                    get(body1: any, body2: any) {
                        return [body1, body2];
                    }
                }
                const ref = reflectionPool.get(Class331).getInstanceProperty('get');
                const endpointItem = newEndpointItem(ref);
                clientPool.parameter.forMethod(ref, endpointItem);
            },
            error => {
                assert.equal((error as Error).message, $test.code(FQN_PCK, 331));
                return true;
            })
    });
});
