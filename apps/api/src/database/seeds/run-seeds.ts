import { AppDataSource } from '../../config/typeorm.config';
import { BuildingSeed } from './building.seed';

async function runSeeds() {
  try {
    await AppDataSource.initialize();
    console.log('Database connected');

    const seeds = [
      new BuildingSeed(),
      // Add more seeds here as you create new entities
    ];

    for (const seed of seeds) {
      await seed.run();
    }

    console.log('All seeds completed successfully');
  } catch (error) {
    console.error('Error running seeds:', error);
  } finally {
    await AppDataSource.destroy();
  }
}

runSeeds();
