(module
    (memory 1 1)
    (import "env" "before" (func $before))
    (import "env" "sleep" (func $sleep (param i32)))
    (import "env" "after" (func $after))
    (export "memory" (memory 0))
    (export "main" (func $main))
    (func $main
      (call $before)
      (call $sleep (i32.const 2000))
      (call $after)
    )
  )