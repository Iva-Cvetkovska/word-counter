import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { CounterService } from './counter.service';
import { ProcessingService } from './processing.service';
import { WordCountingService } from './word-counting.service';
import { SortingService } from './sorting.service';
import * as fs from 'fs';
import * as path from 'path';


describe('CounterService', () => {
  let service: CounterService;

  const testFilePathTxt = path.join(__dirname, 'success.txt');
  const testFileContentTxt = 'line1\nline2\nline1\nline3';

  const testFilePathToFail = path.join(__dirname, 'fail.txt');
  const testFileContentToFail = 'the line1\nline2';

  beforeAll(() => {
    fs.writeFileSync(testFilePathTxt, testFileContentTxt);
    fs.writeFileSync(testFilePathToFail, testFileContentToFail);
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CounterService, ProcessingService, WordCountingService, SortingService],
    }).compile();

    service = module.get<CounterService>(CounterService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should process file correctly', async () => {
    // Given
    const wordCount = 3
    const expectedResult = [
      { word: 'line1', count: 2 },
      { word: 'line2', count: 1 },
      { word: 'line3', count: 1 },
    ];

    // When
    const actualResult = await service.processFile(testFilePathTxt, wordCount);

    // Then
    expect(actualResult).toEqual(expectedResult);
  });

  it('should process the text string correctly', async () => {
    // Given
    const text = "This is a test test"
    const wordCount = 4
    const expectedResult = [
      { word: 'test', count: 2 },
      { word: 'this', count: 1 },
      { word: 'is', count: 1 },
      { word: 'a', count: 1 },
  ]

    // When
    const actualResult = await service.processString(text, wordCount);

    // Then
    expect(actualResult).toEqual(expectedResult);
  });

  it('should throw error if the file line contains "the"', async () => {
    // Given
    const wordCount = 4

    try {
      // When
      const result = await service.processFile(testFilePathToFail, wordCount);
    } catch (e) {
      // Then
      expect(e instanceof BadRequestException).toBe(true)
      expect(e.message).toBe(`The line contains the forbidden word THE`);
    }
  });

  it('should throw error if the text string contains "the"', async () => {
    // Given
    const text = "This is THE end!"
    const wordCount = 4

    try {
      // When
      const result = await service.processString(text, wordCount);
    } catch (e) {
      // Then
      expect(e instanceof BadRequestException).toBe(true)
      expect(e.message).toBe(`The line contains the forbidden word THE`);
    }
  });

  afterAll(() => {
    if (fs.existsSync(testFilePathTxt)) {
      fs.unlinkSync(testFilePathTxt);
    }
    if (fs.existsSync(testFilePathToFail)) {
      fs.unlinkSync(testFilePathToFail);
    }
  });
});
