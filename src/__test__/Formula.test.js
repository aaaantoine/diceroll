import Formula from '../Formula';

function testTotal(expression, expected) {
    const response = Formula.calculate(expression);
    expect(response.total).toBe(expected);
}

test('calculates 1+1 and returns total of 2', () => testTotal("1+1", 2));
test('calculates 8*4 and returns total of 32', () => testTotal("8*4", 32));
test('calculates 1d1+1 and returns total of 2', () => testTotal("1d1+1", 2));
test('calculates 1D1+1 and returns total of 2', () => testTotal("1D1+1", 2));
test('calculates 4+3*2 and returns total of 10', () => testTotal("4+3*2", 10));
test('calculates (4+3)*2 and returns total of 14', () => testTotal("(4+3)*2", 14));
test('throws exception when calculating abc', () => {
    expect(() => Formula.calculate("abc")).toThrow(new Error('Formula is invalid.'));
});
