import { readFileSync } from "fs";
const binary = readFileSync("./build/release.wasm");
const compiled = new WebAssembly.Module(binary);
const instance = new WebAssembly.Instance(compiled, {
    env: {
        sleep: function (ms) {
            if (!sleeping) {
                console.log("Winding... Call stack paused!");
                view[DATA_ADDR >> 2] = DATA_ADDR + 8;
                view[DATA_ADDR + 4 >> 2] = 1024;
                wasmExports.asyncify_start_unwind(DATA_ADDR);
                sleeping = true;
                setTimeout(function () {
                    wasmExports.asyncify_start_rewind(DATA_ADDR);
                    wasmExports.main();
                }, ms);
            } else {
                console.log('Unwinding... Call stack resumed!');
                wasmExports.asyncify_stop_rewind();
                sleeping = false;
            }
        }
    }
});
const wasmExports = instance.exports;
const view = new Int32Array(wasmExports.memory.buffer);

const DATA_ADDR = 16;
let sleeping = false;

wasmExports.main();
wasmExports.asyncify_stop_unwind();