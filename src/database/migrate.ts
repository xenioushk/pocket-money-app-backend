import fs from 'fs';
import path from 'path';
import { pool } from '../config/database';

const runMigrations = async (): Promise<void> => {
  try {
    console.log('🔄 Running database migrations...');

    const migrationsPath = path.join(__dirname, 'migrations');
    const files = fs
      .readdirSync(migrationsPath)
      .filter((file) => file.endsWith('.sql'))
      .sort();

    for (const file of files) {
      console.log(`Running migration: ${file}`);
      const sql = fs.readFileSync(path.join(migrationsPath, file), 'utf8');
      await pool.query(sql);
      console.log(`✅ Migration ${file} completed`);
    }

    console.log('✅ All migrations completed successfully');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  }
};

const runSeeds = async (): Promise<void> => {
  try {
    console.log('🌱 Running database seeds...');

    const seedsPath = path.join(__dirname, 'seeds');
    const files = fs
      .readdirSync(seedsPath)
      .filter((file) => file.endsWith('.sql'))
      .sort();

    for (const file of files) {
      console.log(`Running seed: ${file}`);
      const sql = fs.readFileSync(path.join(seedsPath, file), 'utf8');
      await pool.query(sql);
      console.log(`✅ Seed ${file} completed`);
    }

    console.log('✅ All seeds completed successfully');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    throw error;
  }
};

const resetDatabase = async (): Promise<void> => {
  try {
    console.log('🔄 Resetting database...');

    // Drop all tables
    await pool.query(`
      DROP TABLE IF EXISTS images CASCADE;
      DROP TABLE IF EXISTS favorites CASCADE;
      DROP TABLE IF EXISTS sessions CASCADE;
      DROP TABLE IF EXISTS jobs CASCADE;
      DROP TABLE IF EXISTS categories CASCADE;
      DROP TABLE IF EXISTS users CASCADE;
      DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;
    `);

    console.log('✅ Database reset completed');
  } catch (error) {
    console.error('❌ Database reset failed:', error);
    throw error;
  }
};

// CLI commands
if (require.main === module) {
  const command = process.argv[2];

  const run = async (): Promise<void> => {
    try {
      if (command === 'migrate') {
        await runMigrations();
      } else if (command === 'seed') {
        await runSeeds();
      } else if (command === 'reset') {
        await resetDatabase();
        await runMigrations();
        await runSeeds();
      } else {
        console.log('Usage: ts-node migrate.ts [migrate|seed|reset]');
      }
      process.exit(0);
    } catch (error) {
      process.exit(1);
    }
  };

  run();
}

export { runMigrations, runSeeds, resetDatabase };
