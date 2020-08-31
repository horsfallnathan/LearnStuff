### Question

Given a `6 x 6` 2D array

```txt
1 1 1 0 0 0
0 1 0 0 0 0
1 1 1 0 0 0
0 0 0 0 0 0
0 0 0 0 0 0
0 0 0 0 0 0
```

We define an hourglass in to be a subset of values with indices falling in this pattern:

```txt
a b c
  d
e f g
```

Calculate the hourglass sum for every hourglass in the original array, then print the maximum hourglass sum.

### Solution

```js
const ma = (pI, str = []) => {
  if (pI[1] == undefined || pI[2] == undefined) {
    console.log(Math.max(...str));
    return;
  }
  const fun = (a, b, c) => {
    if (a[1] == undefined || a[2] == undefined) return;
    str.push(a[0] + a[1] + a[2] + b[1] + c[0] + c[1] + c[2]);
    fun(a.slice(1), b.slice(1), c.slice(1));
  };
  fun(pI[0], pI[1], pI[2]);
  ma(pI.slice(1), str);
};
ma(arr);
```
