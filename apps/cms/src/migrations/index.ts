import * as migration_20260919_104920_initial_setup from './20260919_104920_initial_setup';

export const migrations = [
  {
    up: migration_20260919_104920_initial_setup.up,
    down: migration_20260919_104920_initial_setup.down,
    name: '20260919_104920_initial_setup'
  },
];
