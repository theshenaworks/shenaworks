import * as migration_20261111_142652_initial from './20261111_142652_initial';

export const migrations = [
  {
    up: migration_20261111_142652_initial.up,
    down: migration_20261111_142652_initial.down,
    name: '20261111_142652_initial'
  },
];
