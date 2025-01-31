import fs from 'fs';
import path from 'path';

import { TMP_DIR } from '../../../test/config';
import { COPIED_CONFIGS, CONFIG_TEMPLATES, CONFIGURATOR_CONFIGS } from '../constants';
import { copyToProject, injectPathAndCopyToProject } from '../initializeProject';
import { wipeAndCreateDir } from '../wipeAndCreateDir';


const libDir = path.resolve(__dirname, '../../../lib');

describe('copyToProject()', () => {
  it('should copy files from sourceDir to targetDir', () => {
    const targetDir = path.join(TMP_DIR, 'copyToProject-test');
    (targetDir);

    /* TODO: This test depends on having the built project at `lib/`. Either break this dependency
       or make it explicit by renaming the test suffix to `app.test.ts` */
    const files = [...COPIED_CONFIGS, ...CONFIGURATOR_CONFIGS];
    copyToProject({
      sourceDir: libDir,
      targetDir,
      files,
    });

    files.forEach((file) => {
      const filePath = path.resolve(targetDir, file);
      expect(fs.existsSync(filePath)).toBe(true);
    });
  });
});

describe('injectPathAndCopyToProject()', () => {
  it('should remove the `-template` suffix and copy files from sourceDir to targetDir', () => {
    const targetDir = path.join(TMP_DIR, 'removeSuffixAndCopyToProject-test');
    wipeAndCreateDir(targetDir);

    /* TODO: This test depends on having the built project at `lib/`. Either break this dependency
       or make it explicit by renaming the test suffix to `app.test.ts` */
    const files = CONFIG_TEMPLATES;
    injectPathAndCopyToProject({
      sourceDir: libDir,
      targetDir,
      files,
    });

    files.forEach((file) => {
      const filePath = path.resolve(targetDir, file);
      expect(fs.existsSync(filePath)).toBe(true);
    });
  });
});
