const { execSync } = require('child_process');

if (process.env.NODE_ENV === 'test') {
  try {
    execSync('dropdb -h db -U postgres test');
    console.log('Destroyed existing test database');
  } catch (e) {
    console.log('Could not delete existing test db, probably doesnt exist');
  }

  execSync('createdb -h db -U postgres test');
  console.log('Created test database');

  console.log('Running migrations...');
  execSync('./node_modules/.bin/sequelize db:migrate', { stdio: 'inherit' });
  console.log('Migrations completed');

  execSync('redis-cli -h redis flushall', { stdio: 'inherit' });
  console.log('Cleared redis');
} else {
  throw new Error(`node env was '${process.env.NODE_ENV}', expected 'test'`);
}
