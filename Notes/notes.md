Table of Contents

- [Big O Notation](#big-o-notation)
    - [Deriving Big O (Asymptotic Analysis)](#deriving-big-o-asymptotic-analysis)
- [Important Maths Algorithms](#important-maths-algorithms)
    - [Sum of all numbers leading to n](#sum-of-all-numbers-leading-to-n)

## Big O Notation

|                             |           |
| --------------------------- | --------- |
| Linear Time                 | O(n)      |
| Logarithmic Time complexity | O(log(n)) |
| Constant Time               | O(1)      |
| Quadratic Time              | O(n^2)    |
| Cubic Time                  | O(n^3)    |
| Exponential Time Complexity | O(2^n)    |

#### Deriving Big O (Asymptotic Analysis)

Using the following function:

```js
function badSumUp(n) {
  let res = 0;
  for (let i = 0; i <= n; i++) {
    res += i;
  }
  console.log(res);
}
function goodSumUp(n) {
  return (n / 2) * (n + 1);
}
```

- Define the mathematical function. In this case:
  ```js
  let res = 0 // 1
  for (let i = 0; i <= n; i++) { // 1
    res += i; // n
  // T = 1 + 1 + n = 2 + 1*n
  ```
  > The mathematical function is `T = a*n + b` where a = 1 and b = 2

* Find the fastest growing term

  > This is easily `a*n` because `b` is a constant

* Remove the coefficient

  > T = n (the time complexity depends on n)

  > hence Big O notation is **O(n)**

---

- Another example
  ```js
  return (n / 2) * (n + 1); // 1
  // T = 1
  ```
  > The mathematical function is `T = 1`

* Find the fastest growing term

  > This is just the constant 1

  > hence Big O notation is **O(1)**

---

## Important Maths Algorithms

#### Sum of all numbers leading to n

```js
function sumUp(n) {
  return (n / 2) * (n + 1);
}
```
