import { Test, TestingModule } from '@nestjs/testing';
import { SortingService } from './sorting.service';

describe('SortingService', () => {
    let service: SortingService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [SortingService],
        }).compile();

        service = module.get<SortingService>(SortingService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should sort words correctly', () => {
        // Given 
        const wordCountMap = new Map<string, number>([
            ['hello', 1],
            ['world', 2],
            ['testing', 3],
        ]);
        const wordCount = 2
        const expectedResult = [
            { word: 'testing', count: 3 },
            { word: 'world', count: 2 },
        ]

        // When
        const actualResult = service.sortWords(wordCountMap, wordCount);

        // Then
        expect(actualResult).toEqual(expectedResult);
    });

    it('should return an empty array when the map is empty and word count is defined', () => {
        // Given 
        const wordCountMap = new Map<string, number>()
        const wordCount = 2
        const expectedResult = []

        // When
        const actualResult = service.sortWords(wordCountMap, wordCount);

        // Then
        expect(actualResult).toEqual(expectedResult);
    });

    it('should sort correctly when word count is undefined', () => {
        // Given 
        const wordCountMap = new Map<string, number>([
            ['hello', 1],
            ['world', 2],
            ['testing', 3],
        ]);
        const expectedResult = [
            { word: 'testing', count: 3 },
            { word: 'world', count: 2 },
            { word: 'hello', count: 1 },
        ]

        // When
        const actualResult = service.sortWords(wordCountMap, undefined);

        // Then
        expect(actualResult).toEqual(expectedResult);
    });

    it('should sort correctly when word count is a negative number', () => {
        // Given 
        const wordCount = -100
        const wordCountMap = new Map<string, number>([
            ['hello', 1],
            ['world', 2],
            ['testing', 3],
        ]);
        const expectedResult = [
            { word: 'testing', count: 3 },
            { word: 'world', count: 2 },
            { word: 'hello', count: 1 },
        ]

        // When
        const actualResult = service.sortWords(wordCountMap, wordCount);

        // Then
        expect(actualResult).toEqual(expectedResult);
    });

    it('should return an empty array when the map is undefined', () => {
        // Given 
        const expectedResult = []

        // When
        const actualResult = service.sortWords(undefined, undefined);

        // Then
        expect(actualResult).toEqual(expectedResult);
    });
});