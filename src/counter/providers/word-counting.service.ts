import { BadRequestException, Injectable } from "@nestjs/common";

@Injectable()
export class WordCountingService {
    /**
     * Counts words in a given line of text and updates the provided word count map
     * @param line - The line of text to be processed
     * @param wordCountMap - The map to store the count of each word
     * @returns The updated map with word counts
     * @throws BadRequestException if the line contains the forbidden word 'the'
     */
    countWords(line: string, wordCountMap: Map<string, number>): Map<string, number> {
        if (!wordCountMap) wordCountMap = new Map<string, number>()
        if (!line) return wordCountMap

        const words: string[] = line.split(/\s+/)

        for (const word of words) {
            // Remove all characters that are not letters, digits or underscores -> hello! = hello
            const cleanedWord: string = word.toLowerCase().replace(/[^\w]/g, '')
            if (cleanedWord == 'the') {
                throw new BadRequestException('The line contains the forbidden word THE')
            }
            if (cleanedWord) {
                wordCountMap.set(cleanedWord, (wordCountMap.get(cleanedWord) || 0) + 1)
            }
        }

        return wordCountMap
    }
}