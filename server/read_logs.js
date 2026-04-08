import fs from 'fs';
const data = fs.readFileSync('failures.log', 'utf16le');
console.log(data.slice(-2000));
