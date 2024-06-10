import { Test, TestingModule } from '@nestjs/testing';
import { WordCountingService } from './word-counting.service';
import { BadRequestException } from '@nestjs/common';

describe('WordCountingService', () => {
  let service: WordCountingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WordCountingService],
    }).compile();

    service = module.get<WordCountingService>(WordCountingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should count words correctly', () => {
    // Given
    const line = 'Am i or am I not coRrectLy %testing correctly?';
    const wordCountMap = new Map<string, number>();

    // When
    service.countWords(line, wordCountMap);

    //Then
    expect(wordCountMap.get('am')).toBe(2);
    expect(wordCountMap.get('i')).toBe(2)
    expect(wordCountMap.get('or')).toBe(1);
    expect(wordCountMap.get('not')).toBe(1)
    expect(wordCountMap.get('testing')).toBe(1)
    expect(wordCountMap.get('correctly')).toBe(2)
  });

  it('map should remain the same if the line is empty, undefined or null', () => {
    // Given
    const lines: string[] = ['', undefined, null]
    const expectedResult = new Map<string, number>()
    expectedResult.set('hello', 3)

    // When
    lines.forEach(line => {
      const actualResult = service.countWords(line, expectedResult);

      // Then
      expect(actualResult).toEqual(expectedResult);
    })
  });

  it('should initialize an empty map if the map is undefined', () => {
    // Given
    const line: string = "Hello world!"
    const expectedResult = new Map<string, number>()
    expectedResult.set('hello', 1)
    expectedResult.set('world', 1)
    
    // When
    const actualResult = service.countWords(line, undefined)

    // Then
    expect(actualResult).toEqual(expectedResult)
  });

  it('should throw error if the line contains "the"', async () => {
    // Given
    const line = 'This is the test';

    try {
      // When
      const result = await service.countWords(line, new Map<string, number>());
    } catch (e) {
      // Then
      expect(e instanceof BadRequestException).toBe(true)
      expect(e.message).toBe(`The line contains the forbidden word THE`);
    }
  });
});