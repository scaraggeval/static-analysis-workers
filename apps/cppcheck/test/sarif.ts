export default {
  $schema: 'https://schemastore.azurewebsites.net/schemas/json/sarif-2.1.0-rtm.4.json',
  version: '2.1.0',
  runs: [
    {
      tool: {
        driver: {
          name: 'Cppcheck',
          fullName: 'cppcheck version 2.7',
          rules: [
            {
              id: 'arrayIndexOutOfBounds',
              name: 'arrayIndexOutOfBounds',
            },
            {
              id: 'nullPointer',
              name: 'nullPointer',
            },
          ],
        },
      },
      results: [
        {
          message: {
            text: "Array 'array[10]' accessed at index 10, which is out of bounds.",
          },
          ruleId: 'arrayIndexOutOfBounds',
          locations: [
            {
              physicalLocation: {
                region: {
                  startLine: 11,
                  startColumn: 14,
                },
              },
            },
          ],
        },
        {
          message: {
            text: "Array 'array[10]' accessed at index 11, which is out of bounds.",
          },
          ruleId: 'arrayIndexOutOfBounds',
          locations: [
            {
              physicalLocation: {
                region: {
                  startLine: 15,
                  startColumn: 14,
                },
              },
            },
          ],
        },
        {
          message: {
            text: 'Null pointer dereference: ptr',
          },
          ruleId: 'nullPointer',
          locations: [
            {
              physicalLocation: {
                region: {
                  startLine: 18,
                  startColumn: 6,
                },
              },
            },
          ],
        },
      ],
    },
  ],
};
