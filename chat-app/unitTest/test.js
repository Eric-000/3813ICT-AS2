const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../server'); // Adjust the path as needed.
const expect = chai.expect;

chai.use(chaiHttp);

describe('userController', () => {
  // Define your test user
  const testUser = {
    username: 'testuser',
    password: 'testpassword',
    email: 'testuser@example.com',
  };

  describe('POST /register', () => {
    it('should register a new user', (done) => {
      chai
        .request(app)
        .post('/users/register') // Make sure to use the correct route
        .send(testUser)
        .end((err, res) => {
          expect(res).to.have.status(201);
          expect(res.body).to.have.property('token');
          expect(res.body).to.have.property('user');
          done();
        });
    });

    it('should return an error for an existing user', (done) => {
      chai
        .request(app)
        .post('/users/register') // Make sure to use the correct route
        .send(testUser) // Try to register the same user again
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.text).to.equal('Username already exists.');
          done();
        });
    });
  });

  describe('POST /login', () => {
    it('should log in a user with correct credentials', (done) => {
      chai
        .request(app)
        .post('/users/login') // Make sure to use the correct route
        .send(testUser)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('token');
          expect(res.body).to.have.property('user');
          done();
        });
    });

    it('should return an error for incorrect credentials', (done) => {
      const invalidCredentials = {
        username: 'testuser',
        password: 'wrongpassword',
      };
      chai
        .request(app)
        .post('/users/login') // Make sure to use the correct route
        .send(invalidCredentials)
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.text).to.equal('Invalid credentials.');
          done();
        });
    });

    it('should return an error for a non-existent user', (done) => {
      const nonExistentUser = {
        username: 'nonexistentuser',
        password: 'password',
      };
      chai
        .request(app)
        .post('/users/login') // Make sure to use the correct route
        .send(nonExistentUser)
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.text).to.equal('User not found.');
          done();
        });
    });
  });
});
