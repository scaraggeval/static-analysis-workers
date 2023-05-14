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
              id: 'NULL_DEREFERENCE',
              name: 'Null Dereference',
            },
          ],
        },
      },
      results: [
        {
          message: {
            text: 'object `s` last assigned on line 4 could be null and is dereferenced at line 5.',
          },
          level: 'warning',
          ruleId: 'NULL_DEREFERENCE',
          locations: [
            {
              physicalLocation: {
                region: {
                  startLine: 5,
                  startColumn: -1,
                },
              },
            },
          ],
        },
      ],
    },
  ],
};
