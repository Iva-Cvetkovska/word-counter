import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Interface, createInterface } from 'readline'
import { ReadStream, createReadStream, existsSync } from 'fs'
import { WordCountingService } from './word-counting.service';

/**
 * ProcessingService handles reading files and strings for word counting
 */
@Injectable()
export class ProcessingService {
    constructor(
        private readonly wordCountingService: WordCountingService,
    ) { }

    /**
     * Reads a file line by line and counts the words in each line
     * @param filePath - The path to the file to be read
     * @returns A promise that resolves to a map of word counts
     * @throws InternalServerErrorException if the file path does not exist
     */
    async readFileByLine(filePath: string): Promise<Map<string, number>> {
        if (!existsSync(filePath)) throw new InternalServerErrorException(`The file path ${filePath} does not exist`)

        let wordCountMap: Map<string, number> = new Map<string, number>();
        const fileStream: ReadStream = createReadStream(filePath)
        const rl: Interface = createInterface({ input: fileStream, crlfDelay: Infinity, })

        for await (const line of rl) {
            wordCountMap = this.wordCountingService.countWords(line, wordCountMap)
        }

        rl.close()
        return wordCountMap
    }

    /**
     * Reads a string and counts the words in the text
     * @param text - The text to be processed
     * @returns A promise that resolves to a map of word counts
     */
    async readString(text: string): Promise<Map<string, number>> {
        const wordCountMap = new Map<string, number>();
        this.wordCountingService.countWords(text, wordCountMap)
        return wordCountMap
    }
}

