import { writeFileSync } from 'fs';

import tmp from 'tmp';

import { readPackageFile, updatePackageFile } from '../updatePackageFile';

const packageFileContent = `
{
  "version": "1.0.0",
  "files": [
    "/lib"
  ], 
  "scripts": {
    "existingScript": "do something"
  }
}
`;

const pathToFile = tmp.fileSync().name;
writeFileSync(pathToFile, packageFileContent);


describe('updatePackageFile()', () => {
  describe("given a new key and value under the 'scripts' key in package.json", () => {

    it('should merge the key and value into package.json without overriding existing keys', () => {
      const newScript = { scripts: { newScript: 'do something new' } };
      updatePackageFile(newScript, { pathToFile });

      const packageContent = readPackageFile(pathToFile);
      expect(packageContent).toMatchObject({
        version: '1.0.0',
        scripts: {
          existingScript: 'do something',
          newScript: 'do something new',
        },
      });
    });
  });

  describe('given a key with an array value', () => {
    it("should create the array if it doesn't exist", () => {
      const packageFileEntry = { keywords: ['test', 'array', ['nested item']] };
      updatePackageFile(packageFileEntry, { pathToFile });

      const packageContent = readPackageFile(pathToFile);
      expect(packageContent).toMatchObject({
        version: '1.0.0',
        keywords: [
          'test',
          'array',
          ['nested item'],
        ],
      });
    });
    it('should add the value to an existing array', () => {
      const packageFileEntry = { files: ['anotherDir'] };
      updatePackageFile(packageFileEntry, { pathToFile });

      const packageContent = readPackageFile(pathToFile);
      expect(packageContent).toMatchObject({
        version: '1.0.0',
        files: [
          '/lib',
          'anotherDir',
        ],
      });
    });
  });
});
