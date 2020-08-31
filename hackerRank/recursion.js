function factorial(n) {
  if (n == 1) {
    return;
  } else {
    console.log(n * factorial(n - 1));
  }
}

// Double Recursion

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
