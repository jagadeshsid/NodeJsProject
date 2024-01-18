// const request = require('supertest');
// const app = require('./app');
// const User = require('./models/User');

// // Clear the database before each test
// beforeEach(async () => {
//   await User.deleteMany({});
// });

// describe('Users', () => {
//   describe('GET /api/users', () => {
//     it('should return an array of users', async () => {
//       await User.create({ name: 'John' });
//       await User.create({ name: 'Jane' });

//       const res = await request(app)
//         .get('/api/users')
//         .expect(200);

//       expect(res.body).toEqual([
//         {
//           _id: expect.any(String),
//           name: 'John',
//         },
//         {
//           _id: expect.any(String),
//           name: 'Jane',
//         },
//       ]);
//     });
//   });

//   describe('POST /api/users', () => {
//     it('should create a new user', async () => {
//       const user = { name: 'John' };

//       const res = await request(app)
//         .post('/api/users')
//         .send(user)
//         .expect(201);

//       expect(res.body).toEqual({
//         _id: expect.any(String),
//         name: 'John',
//       });
//     });
//   });

//   describe('PUT /api/users/:id', () => {
//     it('should update an existing user', async () => {
//       const user = await User.create({ name: 'John' });

//       const updatedUser = { name: 'Jane' };

//       const res = await request(app)
//         .put(`/api/users/${user._id}`)
//         .send(updatedUser)
//         .expect(200);

//       expect(res.body).toEqual({
//         _id: user._id,
//         name: 'Jane',
//       });
//     });
//   });

//   describe('DELETE /api/users/:id', () => {
//     it('should delete an existing user', async () => {
//       const user = await User.create({ name: 'John' });

//       const res = await request(app)
//         .delete(`/api/users/${user._id}`)
//         .expect(204);

//       expect(res.body).toBeNull();
//     });
//   });
// });