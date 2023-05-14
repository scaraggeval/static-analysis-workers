import SarifConverterService from 'wrappers/common/service/sarif.converter.service';
import { ToolRunConverter } from 'wrappers/common/interface/tool.run.converter.interface';

describe('SarifConverterService', () => {
  let sarifConverterService: SarifConverterService<string>;

  const toolRunConverterMock = {
    loadToolReport: jest.fn(),
    convertToolRun: jest.fn(),
  };

  beforeEach(() => {
    sarifConverterService = new SarifConverterService(toolRunConverterMock as unknown as ToolRunConverter<string>);
  });

  describe('convertFromReportFolder', () => {
    it('throws an error if no report folder has been set', async () => {
      const reportFolder = '';
      const originatingFileName = 'test.ts';

      await expect(sarifConverterService.convertFromReportFolder(reportFolder, originatingFileName)).rejects.toThrowError(
        'Nothing to load from as report folder has not been set or no way to load the tool report has been given!',
      );
    });

    it('throws an error if no way to load the tool report has been given', async () => {
      sarifConverterService = new SarifConverterService({} as ToolRunConverter<string>);
      const reportFolder = 'report/folder';
      const originatingFileName = 'test.ts';

      await expect(sarifConverterService.convertFromReportFolder(reportFolder, originatingFileName)).rejects.toThrowError(
        'Nothing to load from as report folder has not been set or no way to load the tool report has been given!',
      );
    });

    it('calls loadToolReport with the report folder', async () => {
      const reportFolder = 'report/folder';
      const originatingFileName = 'test.ts';
      const toolReportMock = 'mocked tool report';

      toolRunConverterMock.loadToolReport.mockResolvedValue(toolReportMock);

      await sarifConverterService.convertFromReportFolder(reportFolder, originatingFileName);

      expect(toolRunConverterMock.loadToolReport).toHaveBeenCalledWith(reportFolder);
    });

    it('calls convertFromInput with the loaded tool report and originating file name', async () => {
      const reportFolder = 'report/folder';
      const originatingFileName = 'test.ts';
      const toolReportMock = 'mocked tool report';
      const convertedToolRunMock = { convertedToolRun: 'mock' };

      toolRunConverterMock.loadToolReport.mockResolvedValue(toolReportMock);
      toolRunConverterMock.convertToolRun.mockResolvedValue(convertedToolRunMock);

      await sarifConverterService.convertFromReportFolder(reportFolder, originatingFileName);

      expect(toolRunConverterMock.convertToolRun).toHaveBeenCalledWith(toolReportMock, originatingFileName);
    });
  });

  describe('convertFromInput', () => {
    it('throws an error if no input has been given', async () => {
      const input = '';
      const originatingFileName = 'test.ts';

      await expect(sarifConverterService.convertFromInput(input, originatingFileName)).rejects.toThrowError('Nothing to load from as no input has been given!');
    });

    it('calls convertToolRun with the input and originating file name', async () => {
      const input = 'input string';
      const originatingFileName = 'test.ts';
      const convertedToolRunMock = { convertedToolRun: 'mock' };

      toolRunConverterMock.convertToolRun.mockResolvedValue(convertedToolRunMock);

      await sarifConverterService.convertFromInput(input, originatingFileName);

      expect(toolRunConverterMock.convertToolRun).toHaveBeenCalledWith(input, originatingFileName);
    });

    it('should throw an error when no input is provided', async () => {
      await expect(sarifConverterService.convertFromInput(undefined)).rejects.toThrowError('Nothing to load from as no input has been given!');
    });

    it('should return a valid Sarif Log object', async () => {
      const expectedTemplate = {
        $schema: 'https://schemastore.azurewebsites.net/schemas/json/sarif-2.1.0-rtm.4.json',
        version: '2.1.0',
        runs: [{}],
      };
      const input = 'test-input';

      toolRunConverterMock.convertToolRun.mockReturnValue({});

      const result = await sarifConverterService.convertFromInput(input);

      expect(result).toEqual(expectedTemplate);
    });

    it('should call toolRunConverter.convertToolRun with the correct arguments', async () => {
      const input = 'test-input';
      const originatingFileName = 'test-file-name';

      await sarifConverterService.convertFromInput(input, originatingFileName);

      expect(toolRunConverterMock.convertToolRun).toHaveBeenCalledWith(input, originatingFileName);
    });
  });
});
