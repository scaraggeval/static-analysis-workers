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
          rules: [],
        },
      },
      results: [],
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
