const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('--- Bài 1: Tính tổng, hiệu, tích của 2 số nguyên ---');

readline.question('Nhập số nguyên x: ', (xStr) => {
  readline.question('Nhập số nguyên y: ', (yStr) => {
    const x = parseInt(xStr);
    const y = parseInt(yStr);

    if (isNaN(x) || isNaN(y)) {
      console.log('Vui lòng nhập số nguyên hợp lệ!');
    } else {
      console.log(`Tổng (x + y) = ${x + y}`);
      console.log(`Hiệu (x - y) = ${x - y}`);
      console.log(`Tích (x * y) = ${x * y}`);
    }
    readline.close();
  });
});
