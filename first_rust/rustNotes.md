- [Shadowing](#shadowing)
- [Data Types](#data-types)
  - [Scalar](#scalar)
    - [Integer](#integer)
      - [Integer Types](#integer-types)
      - [Integer Overflow](#integer-overflow)
    - [Floating-Point Types](#floating-point-types)
    - [Boolean](#boolean)
    - [Character Type](#character-type)
  - [Compound Types](#compound-types)
    - [Tuples](#tuples)
    - [Array Type](#array-type)

## Shadowing

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

## Data Types

Broadly grouped into two subsets - Scalar** and **Compound\*\* data types

### Scalar

Represents a single value and could be integers, floating-point numbers, booleans or characters.

#### Integer

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

#### Floating-Point Types

Cater for numbers with decimal points. There are two types in Rust: `f32` and `f64` default is `f64` because it offers more precision and is almost the same speed on fast computers as the former.
`f32` - each number uses 32 bits - single precision
`f64` - each number uses 64 bits - double precision.
Half precision exists in computer sciences also that when 16 bits is used to represent a number. It is not available in Rust though.

#### Boolean

Boolean types are represented by `bool`

```Rust
let f: bool = false;
```

#### Character Type

Rust's literal `char` are specified with single quotes e.g. `'n'`. String literals require double quotes. e.g. `"why?"`
The Rust `char` type takes 4 bytes

### Compound Types

Groups multiple values into one type, there are two primitive compound types in Rust - tuples and arrays.

#### Tuples

Although it sounds like it contains only a pair of values, it does actually hold more.

- Tuples have a fixed length and cannot grow or shrink in size.
- Each position in a tuple has a type which can be different from other positions.

```Rust
fn main() {
  let tupVar:(u32,char,bool) = (35,'q',true) // tuple with type annotation
  let tupVar2 = (35,'x',false)
}
```

To get individual values from a tuple you could

- Destructure them
  ```Rust
  let (num, character, boolean) = tupVar2`
  ```
- Use their index position with the dot notation

  ```Rust
  let ourNum = tupVar.0
  let ourBool = tupVar.2
  ```

#### Array Type

- Every item in a array must have the same type
- An array cannot grow or shrink in size (length).
  ex:
  ```Rust
  let arr = [3,4,1,5]
  ```
-
