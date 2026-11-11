import * as migration_20261111_142652_initial from './20261111_142652_initial';
import * as migration_20261111_230319_add_legal_pages_versions from './20261111_230319_add_legal_pages_versions';
import * as migration_20261111_232334_enquiry_pipeline_seq_and_rate_limit from './20261111_232334_enquiry_pipeline_seq_and_rate_limit';

export const migrations = [
  {
    up: migration_20261111_142652_initial.up,
    down: migration_20261111_142652_initial.down,
    name: '20261111_142652_initial',
  },
  {
    up: migration_20261111_230319_add_legal_pages_versions.up,
    down: migration_20261111_230319_add_legal_pages_versions.down,
    name: '20261111_230319_add_legal_pages_versions',
  },
  {
    up: migration_20261111_232334_enquiry_pipeline_seq_and_rate_limit.up,
    down: migration_20261111_232334_enquiry_pipeline_seq_and_rate_limit.down,
    name: '20261111_232334_enquiry_pipeline_seq_and_rate_limit'
  },
];
