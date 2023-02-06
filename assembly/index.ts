@external("env", "sleep")
declare function sleep(ms: i32): void;

export function main(): void {
  sleep(2000);
}