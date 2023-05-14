export default {
  $schema: 'https://raw.githubusercontent.com/oasis-tcs/sarif-spec/master/Schemata/sarif-schema-2.1.0.json',
  version: '2.1.0',
  runs: [
    {
      tool: {
        driver: {
          downloadUri: 'https://github.com/checkstyle/checkstyle/releases/',
          fullName: 'Checkstyle',
          informationUri: 'https://checkstyle.org/',
          language: 'en',
          name: 'Checkstyle',
          organization: 'Checkstyle',
          rules: [],
          semanticVersion: '10.4',
          version: '10.4',
        },
      },
      results: [
        {
          level: 'error',
          locations: [
            {
              physicalLocation: {
                region: {
                  startLine: 1,
                },
              },
            },
          ],
          message: {
            text: 'File does not end with a newline.',
          },
          ruleId: 'noNewlineAtEOF',
        },
        {
          level: 'error',
          locations: [
            {
              physicalLocation: {
                region: {
                  startLine: 1,
                },
              },
            },
          ],
          message: {
            text: 'Missing package-info.java file.',
          },
          ruleId: 'javadoc.packageInfo',
        },
        {
          level: 'error',
          locations: [
            {
              physicalLocation: {
                region: {
                  startColumn: 8,
                  startLine: 1,
                },
              },
            },
          ],
          message: {
            text: 'Unused import - java.util.ArrayList.',
          },
          ruleId: 'import.unused',
        },
        {
          level: 'error',
          locations: [
            {
              physicalLocation: {
                region: {
                  startColumn: 5,
                  startLine: 6,
                },
              },
            },
          ],
          message: {
            text: 'Missing a Javadoc comment.',
          },
          ruleId: 'javadoc.missing',
        },
        {
          level: 'error',
          locations: [
            {
              physicalLocation: {
                region: {
                  startColumn: 5,
                  startLine: 8,
                },
              },
            },
          ],
          message: {
            text: 'Missing a Javadoc comment.',
          },
          ruleId: 'javadoc.missing',
        },
        {
          level: 'error',
          locations: [
            {
              physicalLocation: {
                region: {
                  startColumn: 5,
                  startLine: 11,
                },
              },
            },
          ],
          message: {
            text: "Class 'Example' looks like designed for extension (can be subclassed), but the method 'addToList' does not have javadoc that explains how to do that safely. If class is not designed for extension consider making the class 'Example' final or making the method 'addToList' static/final/abstract/empty, or adding allowed annotation for the method.",
          },
          ruleId: 'design.forExtension',
        },
        {
          level: 'error',
          locations: [
            {
              physicalLocation: {
                region: {
                  startColumn: 5,
                  startLine: 11,
                },
              },
            },
          ],
          message: {
            text: 'Missing a Javadoc comment.',
          },
          ruleId: 'javadoc.missing',
        },
        {
          level: 'error',
          locations: [
            {
              physicalLocation: {
                region: {
                  startColumn: 27,
                  startLine: 11,
                },
              },
            },
          ],
          message: {
            text: 'Parameter i should be final.',
          },
          ruleId: 'final.parameter',
        },
        {
          level: 'error',
          locations: [
            {
              physicalLocation: {
                region: {
                  startColumn: 5,
                  startLine: 15,
                },
              },
            },
          ],
          message: {
            text: "Class 'Example' looks like designed for extension (can be subclassed), but the method 'getItem' does not have javadoc that explains how to do that safely. If class is not designed for extension consider making the class 'Example' final or making the method 'getItem' static/final/abstract/empty, or adding allowed annotation for the method.",
          },
          ruleId: 'design.forExtension',
        },
        {
          level: 'error',
          locations: [
            {
              physicalLocation: {
                region: {
                  startColumn: 5,
                  startLine: 15,
                },
              },
            },
          ],
          message: {
            text: 'Missing a Javadoc comment.',
          },
          ruleId: 'javadoc.missing',
        },
        {
          level: 'error',
          locations: [
            {
              physicalLocation: {
                region: {
                  startColumn: 28,
                  startLine: 15,
                },
              },
            },
          ],
          message: {
            text: 'Parameter index should be final.',
          },
          ruleId: 'final.parameter',
        },
        {
          level: 'error',
          locations: [
            {
              physicalLocation: {
                region: {
                  startColumn: 5,
                  startLine: 19,
                },
              },
            },
          ],
          message: {
            text: 'Missing a Javadoc comment.',
          },
          ruleId: 'javadoc.missing',
        },
        {
          level: 'error',
          locations: [
            {
              physicalLocation: {
                region: {
                  startColumn: 29,
                  startLine: 19,
                },
              },
            },
          ],
          message: {
            text: 'Parameter args should be final.',
          },
          ruleId: 'final.parameter',
        },
        {
          level: 'error',
          locations: [
            {
              physicalLocation: {
                region: {
                  startColumn: 27,
                  startLine: 22,
                },
              },
            },
          ],
          message: {
            text: "'10' is a magic number.",
          },
          ruleId: 'magic.number',
        },
        {
          level: 'error',
          locations: [
            {
              physicalLocation: {
                region: {
                  startColumn: 27,
                  startLine: 23,
                },
              },
            },
          ],
          message: {
            text: "'20' is a magic number.",
          },
          ruleId: 'magic.number',
        },
        {
          level: 'error',
          locations: [
            {
              physicalLocation: {
                region: {
                  startColumn: 27,
                  startLine: 24,
                },
              },
            },
          ],
          message: {
            text: "'30' is a magic number.",
          },
          ruleId: 'magic.number',
        },
        {
          level: 'error',
          locations: [
            {
              physicalLocation: {
                region: {
                  startColumn: 66,
                  startLine: 27,
                },
              },
            },
          ],
          message: {
            text: "'3' is a magic number.",
          },
          ruleId: 'magic.number',
        },
      ],
    },
  ],
};
