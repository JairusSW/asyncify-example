@external("env", "before")
declare function before(): void;
@external("env", "sleep")
declare function sleep(ms: i32): void;
@external("env", "after")
declare function after(): void;

export function main(): void {
  before();
  sleep(2000);
  after();
}