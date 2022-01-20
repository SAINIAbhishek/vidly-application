const lib = require('./lib');
const db = require('./db');
const mail = require('./mail');

// grouping the tests.
describe('absolute', () => {
    it('should return +ve no. if input is +ve', () => {
        const result = lib.absolute(1);
        expect(result).toBe(1);
    });

    it('should return +ve no. if input is -ve', () => {
        const result = lib.absolute(-1);
        expect(result).toBe(1);
    });

    it('should return 0. if input is 0', () => {
        const result = lib.absolute(0);
        expect(result).toBe(0);
    });
});

describe('greet', () => {
    it('should return the greeting message', () => {
       const result = lib.greet('Abhishek');
       expect(result).toMatch(/Abhishek/);
    });
});

describe('getCurrencies', () => {
    it('should return supported currency', function () {
        const result = lib.getCurrencies();
        expect(result).toEqual(expect.arrayContaining(['USD', 'AUD', 'EUR']));
    });
});

describe('getProduct', () => {
    it('should return product with the given id', function () {
        const result = lib.getProduct(1);
        expect(result).toEqual({id: 1, price: 10});
        expect(result).toMatchObject({id: 1, price: 10});
    });
});

describe('registerUser', () => {
    it('should throw if username is falsy ', function () {
        const args = [null, undefined, NaN, '', 0, false];
        args.forEach((a) => {
           expect(() => lib.registerUser(a)).toThrow();
        });
    });

    it('should return user object if valid username', function () {
        const result = lib.registerUser('abhishek');
        expect(result).toMatchObject({username: 'abhishek'});
        expect(result.id).toBeGreaterThan(0);
    });
});

describe('applyDiscount', () => {
    it('should apply 10% discount if customer has points > 10', function () {
        db.getCustomerSync = function (customerId) {
            console.log('Faking reading customer...');
            return {id: customerId, points: 20 };
        }
        const order = { customerId: 1, totalPrice: 10 };
        lib.applyDiscount(order);
        expect(order.totalPrice).toBe(9);
    });
});

describe('notifyCustomer', () => {
    it('should send an email to the customer', function () {
        // creating mock function
        db.getCustomerSync = jest.fn().mockReturnValue({email: 'a'});
        mail.send = jest.fn();

        /*db.getCustomerSync = function (customerId) {
            return { email: 'a' };
        }
        let mailSent = false;
        mail.send = function (email, message) {
            mailSent = true;
        }*/
        lib.notifyCustomer({customerId: 1});

        // expect(mailSent).toBe(true);
        expect(mail.send).toHaveBeenCalled();
    });
});
