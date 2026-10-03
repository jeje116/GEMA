import * as migration_20260919_225758_cms_003_content_migration from './20260919_225758_cms_003_content_migration';
import * as migration_20260919_232314_cleanup_temporary_media_mappings from './20260919_232314_cleanup_temporary_media_mappings';
import * as migration_20260920_050226_add_page_editorial_globals from './20260920_050226_add_page_editorial_globals';
import * as migration_20260920_072811_add_homepage_signature_dishes_items from './20260920_072811_add_homepage_signature_dishes_items';
import * as migration_20260920_080744_add_homepage_cuisine_teaser_fixed_group from './20260920_080744_add_homepage_cuisine_teaser_fixed_group';
import * as migration_20260920_100607_add_cms_009a_content_ownership from './20260920_100607_add_cms_009a_content_ownership';
import * as migration_20260921_add_uat001_editorial_parity from './20260921_add_uat001_editorial_parity';

export const migrations = [
  {
    up: migration_20260919_225758_cms_003_content_migration.up,
    down: migration_20260919_225758_cms_003_content_migration.down,
    name: '20260919_225758_cms_003_content_migration',
  },
  {
    up: migration_20260919_232314_cleanup_temporary_media_mappings.up,
    down: migration_20260919_232314_cleanup_temporary_media_mappings.down,
    name: '20260919_232314_cleanup_temporary_media_mappings',
  },
  {
    up: migration_20260920_050226_add_page_editorial_globals.up,
    down: migration_20260920_050226_add_page_editorial_globals.down,
    name: '20260920_050226_add_page_editorial_globals',
  },
  {
    up: migration_20260920_072811_add_homepage_signature_dishes_items.up,
    down: migration_20260920_072811_add_homepage_signature_dishes_items.down,
    name: '20260920_072811_add_homepage_signature_dishes_items',
  },
  {
    up: migration_20260920_080744_add_homepage_cuisine_teaser_fixed_group.up,
    down: migration_20260920_080744_add_homepage_cuisine_teaser_fixed_group.down,
    name: '20260920_080744_add_homepage_cuisine_teaser_fixed_group',
  },
  {
    up: migration_20260920_100607_add_cms_009a_content_ownership.up,
    down: migration_20260920_100607_add_cms_009a_content_ownership.down,
    name: '20260920_100607_add_cms_009a_content_ownership'
  },
  {
    up: migration_20260921_add_uat001_editorial_parity.up,
    down: migration_20260921_add_uat001_editorial_parity.down,
    name: '20260921_add_uat001_editorial_parity',
  },
];
