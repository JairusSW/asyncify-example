import { readFileSync } from "fs";

function pause() {
    if (paused) {
        wasmExports.asyncify_stop_rewind();
        paused = false;
    } else {
        memory[DATA_ADDR >> 2] = DATA_ADDR + 8;
        memory[DATA_ADDR + 4 >> 2] = 1024;
        wasmExports.asyncify_start_unwind(DATA_ADDR);
        paused = true;
    }
}

function resume() {
    wasmExports.asyncify_start_rewind(DATA_ADDR);
    wasmExports.main();
}

const binary = readFileSync("./build/test.wasm");
const compiled = new WebAssembly.Module(binary);
const instance = new WebAssembly.Instance(compiled, {
    env: {
        sleep: function (ms) {
            pause();
            setTimeout(function () {
                resume();
            }, ms);
        },
        log: function (num) {
            console.log(num ? "Waking up... Call stack resumed!" : "Sleeping... Call stack paused!");
        },
        abort: function () { }
    }
});

const wasmExports = instance.exports;
const memory = new Int32Array(wasmExports.memory.buffer);

const DATA_ADDR = 8;
let paused = false;

wasmExports.main();
wasmExports.asyncify_stop_unwind();