import { Injectable } from "@nestjs/common";

/**
 * SortingService provides functionality to sort words based on their count
 */
@Injectable()
export class SortingService {
    /**
     * Sorts the words in the provided word count map by their frequency
     * @param wordCountMap - The map containing words and their respective counts
     * @param wordCount - The number of top words to return. If not provided, defaults to the size of the wordCountMap
     * @returns An array of objects containing the words and their counts, sorted by count in descending order
     */
    sortWords(wordCountMap: Map<string, number>, wordCount: number): { word: string, count: number }[] {
        if (!wordCountMap) return []
        if (wordCount < 0) wordCount = wordCountMap.size

        return Array.from(wordCountMap.entries()) // Convert the map to an array of entries
            .sort((a, b) => b[1] - a[1]) // sort by count in descending order
            .slice(0, wordCount) // slice to get the top words
            .map(([word, count]: [string, number]) => ({ word, count })) // map to the desired format
    }
}