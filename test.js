// Test script for Roman Urdu to Urdu Transliterator
const { romanUrduConverter, getDictionaryStats } = require('./romanUrduConverter.js');

console.log('========================================');
console.log('Roman Urdu to Urdu Transliterator Tests');
console.log('========================================\n');

// Test cases
const tests = [
    { input: 'Mujhe aap se pyaar hai', expected: 'مجھے آپ سے پیار ہے' },
    { input: 'Assalam o alaikum', expected: 'السلام و علیکم' },
    { input: 'kya haal hai', expected: 'کیا حال ہے' },
    { input: 'mein theek hoon shukriya', expected: 'میں ٹھیک ہوں شکریہ' },
    { input: 'khuda hafiz', expected: 'خدا حافظ' },
    { input: 'Pakistan hamara watan hai', expected: 'پاکستان ہمارا وطن ہے' },
    { input: 'bahut acha', expected: 'بہت اچھا' },
    { input: 'Aaj mausam acha hai', expected: 'آج موسم اچھا ہے' },
];

let passed = 0;
let failed = 0;

tests.forEach((test, i) => {
    const result = romanUrduConverter(test.input);
    const status = result.trim() === test.expected ? 'PASS' : 'CHECK';
    if (status === 'PASS') passed++;
    else failed++;

    console.log(`Test ${i + 1}: ${status}`);
    console.log(`  Input:    "${test.input}"`);
    console.log(`  Output:   "${result.trim()}"`);
    console.log(`  Expected: "${test.expected}"`);
    console.log('');
});

console.log('========================================');
console.log(`Results: ${passed} passed, ${failed} need review`);
console.log('========================================\n');

// Show stats
const stats = getDictionaryStats();
console.log('Dictionary Stats:');
console.log(`  Total words: ${stats.totalWords}`);
console.log('');
