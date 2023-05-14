export default {
  $schema: 'https://schemastore.azurewebsites.net/schemas/json/sarif-2.1.0-rtm.4.json',
  version: '2.1.0',
  runs: [
    {
      tool: {
        driver: {
          name: 'Infer',
          rules: [
            {
              id: 'DEAD_STORE',
              name: 'Dead Store',
            },
            {
              id: 'NULL_DEREFERENCE',
              name: 'Null Dereference',
            },
            {
              id: 'UNINITIALIZED_VALUE',
              name: 'Uninitialized Value',
            },
          ],
        },
      },
      results: [
        {
          message: {
            text: 'The value written to &j (type int) is never used.',
          },
          level: 'warning',
          ruleId: 'DEAD_STORE',
          locations: [
            {
              physicalLocation: {
                region: {
                  startLine: 15,
                  startColumn: 5,
                },
              },
            },
          ],
        },
        {
          message: {
            text: 'pointer `ptr` last assigned on line 7 could be null and is dereferenced at line 18, column 5.',
          },
          level: 'warning',
          ruleId: 'NULL_DEREFERENCE',
          locations: [
            {
              physicalLocation: {
                region: {
                  startLine: 18,
                  startColumn: 5,
                },
              },
            },
          ],
        },
        {
          message: {
            text: 'The value read from array[_] was never initialized.',
          },
          level: 'warning',
          ruleId: 'UNINITIALIZED_VALUE',
          locations: [
            {
              physicalLocation: {
                region: {
                  startLine: 15,
                  startColumn: 5,
                },
              },
            },
          ],
        },
      ],
    },
  ],
};
