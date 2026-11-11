import * as migration_20261111_142652_initial from './20261111_142652_initial';
import * as migration_20261111_230319_add_legal_pages_versions from './20261111_230319_add_legal_pages_versions';

export const migrations = [
  {
    up: migration_20261111_142652_initial.up,
    down: migration_20261111_142652_initial.down,
    name: '20261111_142652_initial',
  },
  {
    up: migration_20261111_230319_add_legal_pages_versions.up,
    down: migration_20261111_230319_add_legal_pages_versions.down,
    name: '20261111_230319_add_legal_pages_versions'
  },
];
