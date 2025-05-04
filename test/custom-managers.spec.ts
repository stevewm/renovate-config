import { extractPackageFile } from 'renovate/dist/modules/manager/custom/regex'
import { ExtractConfig } from 'renovate/dist/modules/manager/types'
import * as path from 'path';
import * as fs from 'fs';
import JSON5 from 'json5';

  const configFileName = path.join(
    path.dirname(__filename),
    '../presets',
    path.basename(__filename).replace('.spec.ts', '.json5')
  );
  const baseConfig = JSON5.parse(fs.readFileSync(configFileName, 'utf8'));
  const packageFile = 'UNUSED';

describe(path.basename(configFileName), () => {

  describe('yaml annotation', () => {
    // unfortunately we have to index into this right now, until https://github.com/renovatebot/renovate/issues/21760 is complete
    const config: ExtractConfig = baseConfig.customManagers[0]

    const fileContents = {
      'newline': `
      # renovate: depName=kubernetes
      version: 1.33
      `,
      'inline': `
      version: 1.33 # renovate: depName=kubernetes
      `,
    }

    const expected = { "deps": [{ "depName": "kubernetes", "currentValue": "1.33" }] }

    it('matches newline annotation', () => {
      const content = fileContents['newline']

      const res = extractPackageFile(content, packageFile, config)

      expect(res).toMatchSnapshot(expected)
    })

    it('matches inline annotation', () => {
      const content = fileContents['inline']

      const res = extractPackageFile(content, packageFile, config)

      expect(res).toMatchSnapshot(expected)
    })
  })
});
