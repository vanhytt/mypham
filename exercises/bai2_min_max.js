const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('--- Bài 2: Tìm Min và Max của 3 số nguyên ---');

readline.question('Nhập số thứ nhất: ', (n1) => {
  readline.question('Nhập số thứ hai: ', (n2) => {
    readline.question('Nhập số thứ ba: ', (n3) => {
      const a = parseInt(n1);
      const b = parseInt(n2);
      const c = parseInt(n3);

      if (isNaN(a) || isNaN(b) || isNaN(c)) {
        console.log('Vui lòng nhập các số nguyên hợp lệ!');
      } else {
        const max = Math.max(a, b, c);
        const min = Math.min(a, b, c);
        console.log(`Số lớn nhất (Max) là: ${max}`);
        console.log(`Số nhỏ nhất (Min) là: ${min}`);
      }
      readline.close();
    });
  });
});
