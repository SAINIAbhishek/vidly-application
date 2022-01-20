const exercise = require('./exercise1');

describe('fizzBuzz', () => {
    it('should throw an exception if input not number ', function () {
        expect(() => exercise.fizzBuzz('a')).toThrow();
        expect(() => exercise.fizzBuzz(null)).toThrow();
        expect(() => exercise.fizzBuzz(undefined)).toThrow();
        expect(() => exercise.fizzBuzz({})).toThrow();
    });

    it('should return FizzBuzz if number is divisible by 3 and 5', function () {
        const result = exercise.fizzBuzz(15);
        expect(result).toBe('FizzBuzz');
    });

    it('should return Fizz if number is divisible by 3', function () {
        const result = exercise.fizzBuzz(9);
        expect(result).toBe('Fizz');
    });

    it('should return Buzz if number is divisible by 5', function () {
        const result = exercise.fizzBuzz(20);
        expect(result).toBe('Buzz');
    });

    it('should return input if not divisible by 3 and 5', function () {
        const result = exercise.fizzBuzz(1);
        expect(result).toBe(1);
    });
});
