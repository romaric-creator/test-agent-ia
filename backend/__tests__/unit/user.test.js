const { Sequelize, DataTypes } = require('sequelize');
const { makeMockModels } = require('sequelize-test-helpers');
const { expect } = require('@jest/globals'); // Explicitly import expect

// Load the actual User model definition
const UserModel = require('../../models/user');
const sequelize = new Sequelize('sqlite::memory:', { logging: false });

describe('User Model', () => {
  const { User } = makeMockModels({ User: UserModel(sequelize, DataTypes) });

  beforeAll(() => {
    // Synchronize the model to create the table in the in-memory SQLite database
    return sequelize.sync({ force: true });
  });

  afterEach(async () => {
    // Clean up after each test
    await User.destroy({ truncate: true });
  });

  test('should create a user successfully', async () => {
    const user = await User.create({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123'
    });
    expect(user.id).toBeDefined();
    expect(user.username).toBe('testuser');
    expect(user.email).toBe('test@example.com');
  });

  test('should not create a user with duplicate email', async () => {
    await User.create({
      username: 'testuser1',
      email: 'duplicate@example.com',
      password: 'password123'
    });
    await expect(
      User.create({
        username: 'testuser2',
        email: 'duplicate@example.com',
        password: 'password123'
      })
    ).rejects.toThrow(); // Expect a unique constraint error
  });

  test('should not create a user with duplicate username', async () => {
    await User.create({
      username: 'duplicateuser',
      email: 'test1@example.com',
      password: 'password123'
    });
    await expect(
      User.create({
        username: 'duplicateuser',
        email: 'test2@example.com',
        password: 'password123'
      })
    ).rejects.toThrow(); // Expect a unique constraint error
  });

  test('should not create a user without a username', async () => {
    await expect(
      User.create({
        email: 'test@example.com',
        password: 'password123'
      })
    ).rejects.toThrow(); // Expect a not-null constraint error
  });

  test('should not create a user without an email', async () => {
    await expect(
      User.create({
        username: 'testuser',
        password: 'password123'
      })
    ).rejects.toThrow(); // Expect a not-null constraint error
  });

  test('should not create a user without a password', async () => {
    await expect(
      User.create({
        username: 'testuser',
        email: 'test@example.com'
      })
    ).rejects.toThrow(); // Expect a not-null constraint error
  });
});
