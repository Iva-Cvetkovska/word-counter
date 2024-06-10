import { Test, TestingModule } from '@nestjs/testing';
import { ProcessingService } from './processing.service';
import { WordCountingService } from './word-counting.service';
import { InternalServerErrorException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

describe('ProcessingService', () => {
  let service: ProcessingService;

  const testFilePathTxt = path.join(__dirname, 'processing-test.txt');
  const testFileContentTxt = 'line1\nline2';

  beforeAll(() => {
    fs.writeFileSync(testFilePathTxt, testFileContentTxt);
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProcessingService, WordCountingService],
    }).compile();

    service = module.get<ProcessingService>(ProcessingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should read .txt file line by line', async () => {
    // Given
    const expectedResult = new Map<string, number>();
    expectedResult.set("line1", 1);
    expectedResult.set("line2", 1);

    // When
    const result = await service.readFileByLine(testFilePathTxt);

    // Then
    expect(result).toEqual(expectedResult);
  });

  it('should throw error when the file path does not exist', async () => {
    // Given
    const filePath = './test.txt'
    try {
      // When
      const result = await service.readFileByLine(filePath);
    } catch (e) {
      // Then
      expect(e instanceof InternalServerErrorException).toBe(true)
      expect(e.message).toBe(`The file path ${filePath} does not exist`);
    }
  });

  it('should return a map of the words contained in the text', async () => {
    // Given
    const text = "This is a test test"
    const expectedResult = new Map<string, number>()
    expectedResult.set('this', 1)
    expectedResult.set('is', 1)
    expectedResult.set('a', 1)
    expectedResult.set('test', 2)

    // When
    const actualResult = await service.readString(text);

    // Then
    expect(actualResult).toEqual(expectedResult);
  });

  it('map should be empty if text is empty, undefined or null', () => {
    // Given
    const textValues: string[] = ['', undefined, null]

    // When
    textValues.forEach(async value => {
      const actualResult = await service.readString(value);

      // Then
      expect(actualResult.size).toBe(0);
    })
  });

  afterAll(() => {
    if (fs.existsSync(testFilePathTxt)) {
      fs.unlinkSync(testFilePathTxt);
    }
  });
});