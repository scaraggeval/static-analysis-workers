export default {
  $schema: 'https://raw.githubusercontent.com/oasis-tcs/sarif-spec/master/Schemata/sarif-schema-2.1.0.json',
  version: '2.1.0',
  runs: [
    {
      tool: {
        driver: {
          name: 'PMD',
          version: '6.43.0',
          informationUri: 'https://pmd.github.io/pmd/',
          rules: [
            {
              id: 'UnnecessaryImport',
              shortDescription: {
                text: "Unused import 'java.util.ArrayList'",
              },
              fullDescription: {
                text: "\n            Reports import statements that can be removed. They are either unused,\n            duplicated, or the members they import are already implicitly in scope,\n            because they're in java.lang, or the current package.\n        ",
              },
              helpUri: 'https://pmd.github.io/pmd-6.43.0/pmd_rules_java_codestyle.html#unnecessaryimport',
              help: {
                text: "\n            Reports import statements that can be removed. They are either unused,\n            duplicated, or the members they import are already implicitly in scope,\n            because they're in java.lang, or the current package.\n        ",
              },
              properties: {
                ruleset: 'Code Style',
                priority: 4,
                tags: ['Code Style'],
              },
            },
            {
              id: 'NoPackage',
              shortDescription: {
                text: 'All classes, interfaces, enums and annotations must belong to a named package',
              },
              fullDescription: {
                text: '\nDetects when a class, interface, enum or annotation does not have a package definition.\n        ',
              },
              helpUri: 'https://pmd.github.io/pmd-6.43.0/pmd_rules_java_codestyle.html#nopackage',
              help: {
                text: '\nDetects when a class, interface, enum or annotation does not have a package definition.\n        ',
              },
              properties: {
                ruleset: 'Code Style',
                priority: 3,
                tags: ['Code Style'],
              },
            },
            {
              id: 'UnnecessaryConstructor',
              shortDescription: {
                text: 'Avoid unnecessary constructors - the compiler will generate these for you',
              },
              fullDescription: {
                text: '\nThis rule detects when a constructor is not necessary; i.e., when there is only one constructor and the\nconstructor is identical to the default constructor. The default constructor should has same access\nmodifier as the declaring class. In an enum type, the default constructor is implicitly private.\n        ',
              },
              helpUri: 'https://pmd.github.io/pmd-6.43.0/pmd_rules_java_codestyle.html#unnecessaryconstructor',
              help: {
                text: '\nThis rule detects when a constructor is not necessary; i.e., when there is only one constructor and the\nconstructor is identical to the default constructor. The default constructor should has same access\nmodifier as the declaring class. In an enum type, the default constructor is implicitly private.\n        ',
              },
              properties: {
                ruleset: 'Code Style',
                priority: 3,
                tags: ['Code Style'],
              },
            },
            {
              id: 'UncommentedEmptyConstructor',
              shortDescription: {
                text: 'Document empty constructor',
              },
              fullDescription: {
                text: '\nUncommented Empty Constructor finds instances where a constructor does not\ncontain statements, but there is no comment. By explicitly commenting empty\nconstructors it is easier to distinguish between intentional (commented)\nand unintentional empty constructors.\n        ',
              },
              helpUri: 'https://pmd.github.io/pmd-6.43.0/pmd_rules_java_documentation.html#uncommentedemptyconstructor',
              help: {
                text: '\nUncommented Empty Constructor finds instances where a constructor does not\ncontain statements, but there is no comment. By explicitly commenting empty\nconstructors it is easier to distinguish between intentional (commented)\nand unintentional empty constructors.\n        ',
              },
              properties: {
                ruleset: 'Documentation',
                priority: 3,
                tags: ['Documentation'],
              },
            },
          ],
        },
      },
      results: [
        {
          ruleId: 'UnnecessaryImport',
          ruleIndex: 0,
          message: {
            text: "Unused import 'java.util.ArrayList'",
          },
          locations: [
            {
              physicalLocation: {
                region: {
                  startLine: 1,
                  startColumn: 1,
                  endLine: 1,
                  endColumn: 27,
                },
              },
            },
          ],
        },
        {
          ruleId: 'NoPackage',
          ruleIndex: 1,
          message: {
            text: 'All classes, interfaces, enums and annotations must belong to a named package',
          },
          locations: [
            {
              physicalLocation: {
                region: {
                  startLine: 4,
                  startColumn: 1,
                  endLine: 29,
                  endColumn: 1,
                },
              },
            },
          ],
        },
        {
          ruleId: 'UnnecessaryConstructor',
          ruleIndex: 2,
          message: {
            text: 'Avoid unnecessary constructors - the compiler will generate these for you',
          },
          locations: [
            {
              physicalLocation: {
                region: {
                  startLine: 8,
                  startColumn: 12,
                  endLine: 9,
                  endColumn: 5,
                },
              },
            },
          ],
        },
        {
          ruleId: 'UncommentedEmptyConstructor',
          ruleIndex: 3,
          message: {
            text: 'Document empty constructor',
          },
          locations: [
            {
              physicalLocation: {
                region: {
                  startLine: 8,
                  startColumn: 12,
                  endLine: 9,
                  endColumn: 5,
                },
              },
            },
          ],
        },
      ],
      invocations: [
        {
          executionSuccessful: true,
          toolConfigurationNotifications: [],
          toolExecutionNotifications: [],
        },
      ],
    },
  ],
};
