export default {
  version: '2.1.0',
  $schema: 'http://json.schemastore.org/sarif-2.1.0-rtm.5',
  runs: [
    {
      tool: {
        driver: {
          name: 'ESLint',
          informationUri: 'https://eslint.org',
          rules: [
            {
              id: 'no-unused-vars',
              helpUri: 'https://eslint.org/docs/rules/no-unused-vars',
              properties: {},
              shortDescription: {
                text: 'Disallow unused variables',
              },
            },
          ],
          version: '8.22.0',
        },
      },
      artifacts: [
        {
          location: {
            uri: 'file:///home/rikola/projects/masters/static-analysis-tools-wrappers/%3Ctext%3E',
          },
        },
      ],
      results: [
        {
          level: 'error',
          message: {
            text: "'y' is defined but never used.",
          },
          locations: [
            {
              physicalLocation: {
                region: {
                  startLine: 2,
                  startColumn: 10,
                  endLine: 2,
                  endColumn: 11,
                },
              },
            },
          ],
          ruleId: 'no-unused-vars',
          ruleIndex: 0,
        },
      ],
    },
  ],
};
