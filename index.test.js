const request = require('supertest');
// express app
const app = require('./index');

// db setup
const { sequelize, Dog } = require('./db');
const seed = require('./db/seedFn');
const {dogs} = require('./db/seedData');

describe('Endpoints', () => {
    // to be used in POST test
    const testDogData = {
        breed: 'Poodle',
        name: 'Sasha',
        color: 'black',
        description: 'Sasha is a beautiful black pooodle mix.  She is a great companion for her family.'
    };

    beforeAll(async () => {
        // rebuild db before the test suite runs
        await seed();
    });

    describe('GET /dogs', () => {
        it('should return list of dogs with correct data', async () => {
            // make a request
            const response = await request(app).get('/dogs');
            // assert a response code
            expect(response.status).toBe(200);
            // expect a response
            expect(response.body).toBeDefined();
            // toEqual checks deep equality in objects
            expect(response.body[0]).toEqual(expect.objectContaining(dogs[0]));
        });
    });

    describe('POST /dogs', () => {
        it('should add a dog to the list of dog', async () => {
            // make a request
            // const dog = { breed: "Pug Mix", name: "Frodo", color: "beige", description: "Elder pug mix with a hunchback, snaggletooth, and scruffy face" };
            const response = await request(app)
                .post('/dogs')
                //.send
                .send( testDogData)
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200)
                 // Assert (expect) that the data coming back matches the data in testDogData.
                .then(response => {
                    expect(response.body.name).toEqual(testDogData.name)
                 });

        });

        it('query database for matching response.body.id', async () => {
            // In another test (another it), query the database for a dog of id matching that of the response.body.id coming back from the API. Assert that the dog data from the db matches the request body. 
            const response = await request(app)
            .post('/dogs')
            //.send
            .send( testDogData)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)

            const goodBoy = await Dog.findByPk(response.body.id)
            expect(response.body.id).toEqual(goodBoy.id);
        });
    });


    // describe('DELETE /dogs/:id', () => {
    //     it('should delete dog data of :id', async () => {
    //         // This time, send a DELETE request to /dogs/1 via supertest.
    //         // Query the database for a dog with ID of 1.

    //         // Assert that the dog returned from the findAll is null. Use Jest’s toBeNull.
       
    //     });
    // });
});