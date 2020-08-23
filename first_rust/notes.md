- [Shadowing](#shadowing)
- [Data Types](#data-types)
  - [Scalar](#scalar)
    - [Integer Types](#integer-types)
    - [Integer Overflow](#integer-overflow)

### Shadowing

- Declaring a new variable with the same name as a previously existing variable.

  ```Rust
  fn main() {
    let x = 5;

    let x = x + 1;

    let x = x * 2;

    println!("The value of x is: {}", x);

  }
  ```

- A benefit is the variable remains immutable after all operations on it have been completed.
- Another benefit is that the type of the variable can be changed using this process.

### Data Types

Broadly grouped into two subsets - Scalar** and **Compound\*\* data types

#### Scalar

Represents a single value and could be integers, floating-point, numbers, booleans or characters.

##### Integer Types

| Length  | Signed | Unsigned |
| ------- | ------ | -------- |
| 8-bit   | i8     | u8       |
| 16-bit  | i16    | u16      |
| 32-bit  | i32    | u32      |
| 64-bit  | i64    | u64      |
| 128-bit | i128   | u128     |
| arch    | isize  | usize    |

- Signed and unsigned refers to the integers possibility to be negative. Unsigned integers are always only going to be positive, signed integers could have either positive or negative signs.
- The maximum a signed integer can store is (2<sup>n-1</sup> - 1) for 128-bit = `170141183460469231731687303715884105727`
- The minimum a signed integer can store is -(2<sup>n-1</sup>) for 128-bit = `-170141183460469231731687303715884105728`
- The range of numbers an unsigned integer can store is from 0 to (2<sup>n-1</sup> - 1)
- `isize` and `usize` integers take their n-values from the kind or architecture the code is running on _hint: 'arch'_. So a 32-bit machine will have a n-value of 32.
- Integer literals take a type suffix e.g. `23u8`
- Integer literals can use an underscore (\_) as a visual separator e.g. `25_000`
- Rust's default integer type is `i32` and is generally the fastest even on 64bit systems.

##### Integer Overflow

This occurs when you assign a value that is more that the maximum value an integer type can contain.

- This either leads to a panic or wrapping, depending on if you are compiling with the --release flag enabled.
- Wrapping or technically called `two's complement wrapping` is when values greater than the maximum an integer type can represent wraps around to the minimum. e.g. in a `u8` integer type, 256 becomes 0 and 257 becomes 1.
- Wrapping when not explicitly desired (using the standard `Wrapping` library) could lead to inaccurate outputs.
