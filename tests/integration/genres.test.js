require('../../ApiModels');
const mongoose = require('mongoose');
const Genre = mongoose.model('Genre');
const User = mongoose.model('User');
const request = require('supertest');

let server;

describe('/api/genres', () => {
    // jest calls each time
    beforeEach(() => {
        server = require('../../index');
    });

    afterEach(async () => {
        await server.close();
        await Genre.remove({});
    });

    describe('GET /', () => {
        it('should return all genres', async () => {
            const genres = [
                { name: 'genre1' },
                { name: 'genre2' }
            ];
            await Genre.collection.insertMany(genres);
            const res = await request(server).get('/api/genres');
            expect(res.status).toBe(200);
            expect(res.body.length).toBe(2);
            expect(res.body.some(g => g.name === 'genre1')).toBeTruthy();
            expect(res.body.some(g => g.name === 'genre2')).toBeTruthy();
        });
    });

    describe('GET /:id', () => {
        it('should return a genre if valid id is passed', async () => {
            const genre = new Genre({ name: 'genre1' });
            await genre.save();
            const res = await request(server).get(`/api/genres/${genre._id}`);
            expect(res.status).toBe(200);
            expect(res.body[0]).toHaveProperty('name', genre.name);
        });

        it('should return 404 if invalid id is passed', async () => {
            const res = await request(server).get('/api/genres/1');
            expect(res.status).toBe(404);
        });
    });


    describe('POST / ', () => {
        let token;
        let name;

        beforeEach(() => {
            token = new User().generateAuthToken();
            name = 'genre1';
        });

        const exec = async () => {
            return await request(server)
                .post('/api/genres')
                .set('x-auth-token', token)
                .send({ name });
        };

        it('should return 401 if client is not logged in', async () => {
            token = '';
            const res = await exec();
            expect(res.status).toBe(401);
        });

        it('should return 400 if genre is less than 5 characters', async () => {
            name = '1234';
            const res = await exec();
            expect(res.status).toBe(400);
        });

        it('should return 400 if genre is more than 50 characters', async () => {
            name = new Array(52).join('a');
            const res = await exec();
            expect(res.status).toBe(400);
        });

        it('should save the genre if it is valid', async () => {
            await exec();
            const genre = await Genre.find({ name: 'genre1' });
            expect(genre).not.toBeNull();
        });

        it('should return the genre if it is valid', async () => {
            const res = await exec();
            expect(res.body).toHaveProperty('_id');
            expect(res.body).toHaveProperty('name', 'genre1');
        });

    });

    describe('PUT /:id', () => {
        let token;
        let newName;
        let genre;
        let id;

        const exec = async () => {
            return await request(server)
                .put('/api/genres/' + id)
                .set('x-auth-token', token)
                .send({ name: newName });
        }

        beforeEach(async () => {
            // Before each test we need to create a genre and
            // put it in the database.
            genre = new Genre({ name: 'genre1' });
            await genre.save();
            token = new User().generateAuthToken();
            id = genre._id;
            newName = 'updatedName';
        })

        it('should return 401 if client is not logged in', async () => {
            token = '';
            const res = await exec();
            expect(res.status).toBe(401);
        });

        it('should return 400 if genre is less than 5 characters', async () => {
            newName = '1234';
            const res = await exec();
            expect(res.status).toBe(400);
        });

        it('should return 400 if genre is more than 50 characters', async () => {
            newName = new Array(52).join('a');
            const res = await exec();
            expect(res.status).toBe(400);
        });

    });

});
