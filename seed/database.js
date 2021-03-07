'use strict';

const Context = require('./context');

class Database {
  constructor(seedData, enableLogging) {
    this.tasks = seedData.tasks;
    this.users = seedData.users;
    this.enableLogging = enableLogging;
    this.context = new Context('tasklist.db', enableLogging);
  }

  log(message) {
    if (this.enableLogging) {
      console.info(message);
    }
  }

  tableExists(tableName) {
    this.log(`Checking if the ${tableName} table exists...`);

    return this.context
      .retrieveValue(`
        SELECT EXISTS (
          SELECT 1
          FROM sqlite_master
          WHERE type = 'table' AND name = ?
        );
      `, tableName);
  }

  createUser(user) {
    return this.context
      .execute(`
        INSERT INTO Users
          (firstName, lastName, emailAddress, password, isAdmin, createdAt, updatedAt)
        VALUES
          (?, ?, ?, ?, ?, datetime('now'), datetime('now'));
      `,
      user.firstName,
      user.lastName,
      user.emailAddress,
      user.password,
      user.isAdmin);
  }

  createTask(task) {
    return this.context
      .execute(`
        INSERT INTO Tasks
          (userId, taskCompleted, title, createdAt, updatedAt)
        VALUES
          (?, ?, ?, datetime('now'), datetime('now'));
      `,
      task.userId,
      task.taskCompleted,
      task.title
      );
  }

  async createUsers(users) {
    for (const user of users) {
      await this.createUser(user);
    }
  }

  async createTasks(tasks) {
    for (const task of tasks) {
      await this.createTask(task);
    }
  }

  async init() {
    const userTableExists = await this.tableExists('Users');

    if (userTableExists) {
      this.log('Dropping the Users table...');

      await this.context.execute(`
        DROP TABLE IF EXISTS Users;
      `);
    }

    this.log('Creating the Users table...');

    await this.context.execute(`
      CREATE TABLE Users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        firstName VARCHAR(255) NOT NULL DEFAULT '',
        lastName VARCHAR(255) NOT NULL DEFAULT '',
        emailAddress VARCHAR(255) NOT NULL DEFAULT '' UNIQUE,
        password VARCHAR(255) NOT NULL DEFAULT '',
        isAdmin BOOLEAN NOT NULL DEFAULT FALSE,
        createdAt DATETIME NOT NULL,
        updatedAt DATETIME NOT NULL
      );
    `);

    const users = await this.users;

    this.log('Creating the user records...');

    await this.createUsers(users);

    const taskTableExists = await this.tableExists('Tasks');

    if (taskTableExists) {
      this.log('Dropping the Tasks table...');

      await this.context.execute(`
        DROP TABLE IF EXISTS Tasks;
      `);
    }

    this.log('Creating the Tasks table...');

    await this.context.execute(`
      CREATE TABLE Tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        taskCompleted BOOLEAN NOT NULL DEFAULT FALSE,
        title VARCHAR(255) NOT NULL DEFAULT '',
        createdAt DATETIME NOT NULL,
        updatedAt DATETIME NOT NULL,
        userId INTEGER NOT NULL DEFAULT -1
          REFERENCES Users (id) ON DELETE CASCADE ON UPDATE CASCADE
      );
    `);

    this.log('Creating the task records...');

    await this.createTasks(this.tasks);

    this.log('Database successfully initialized!');
  }
}

module.exports = Database;
