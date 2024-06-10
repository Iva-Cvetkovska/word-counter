import { Injectable } from '@nestjs/common';
import { ProcessingService } from './processing.service';
import { SortingService } from './sorting.service';
import { promises } from 'fs';

/**
 * CounterService provides functionality to process files and strings to count words
 */
@Injectable()
export class CounterService {
  /**
   * Constructs the CounterService
   * @param processingService - The service responsible for processing file and string content
   * @param sortingService - The service responsible for sorting word counts
   */
  constructor(
    private readonly processingService: ProcessingService,
    private readonly sortingService: SortingService
  ) { }

  /**
   * Processes a file to count words and then sorts the words by frequency
   * @param filePath - The path to the file to be processed
   * @param wordCount - The number of words to return sorted by frequency
   * @returns A promise that resolves to an array of word count objects
   */
  async processFile(filePath: string, wordCount: number): Promise<{ word: string, count: number }[]> {
    const wordCountMap: Map<string, number> = await this.processingService.readFileByLine(filePath)
    await promises.unlink(filePath) // Delete the file after processing
    return this.sortingService.sortWords(wordCountMap, wordCount)
  }

  /**
   * Processes a string to count words and then sorts the words by frequency
   * @param text - The text to be processed
   * @param wordCount - The number of words to return sorted by frequency
   * @returns A promise that resolves to an array of word count objects
   */
  async processString(text: string, wordCount: number): Promise<{ word: string, count: number }[]> {
    const wordCountMap: Map<string, number> = await this.processingService.readString(text)
    return this.sortingService.sortWords(wordCountMap, wordCount)
  }
}
