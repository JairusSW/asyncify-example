import * as asyncify from "bindings/asyncify";

@external("env", "sleep")
declare function sleep(ms: i32): void;

@external("env", "log")
declare function log(num: i32): void;

export function main(): void {
  log(0);
  sleep(2000);
  log(1);
}