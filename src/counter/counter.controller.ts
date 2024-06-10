import { Controller, Post, UseInterceptors, UploadedFile, Body, ParseIntPipe, DefaultValuePipe, Query, ParseFilePipe, FileTypeValidator } from '@nestjs/common';
import { CounterService } from './providers/counter.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer'
import { v4 as uuidv4 } from 'uuid';
import { ApiBody, ApiConsumes, ApiHeader, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
const path = require('path');

/**
 * CounterController handles file uploads and text processing requests
 */
@ApiTags('word-counter')
@Controller('')
export class CounterController {
  constructor(private readonly counterService: CounterService) { }

  /**
   * Uploads a file and processes it to count words
   * @param file - The uploaded file
   * @param wordCount - The number of words to count (default is 10)
   * @returns A promise that resolves to the word count result
   */
  @Post('upload')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
        const uniqueSuffix = `${Date.now()}-${uuidv4()}`
        const ext = path.extname(file.originalname)
        cb(null, `${uniqueSuffix}${ext}`)
      },
    }),
  }))
  @ApiOperation({ summary: "Upload a file and proccess it to count the occurances of words" })
  @ApiConsumes('multipart/form-data')
  @ApiHeader({
    name: 'Accept-Language',
    description: 'Language coming from the request (browser)',
    required: true,
    schema: {
      type: 'string',
      default: 'en'
    }
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiQuery({ name: 'wordCount', required: false, type: Number, description: "Number of words to return" })
  @ApiResponse({ status: 201, description: "File successfully processed" })
  async uploadFile(
    @UploadedFile(new ParseFilePipe({
      validators: [
        new FileTypeValidator({ fileType: 'text/plain' })
      ]
    }))
    file: Express.Multer.File,
    @Query('wordCount', new ParseIntPipe({ optional: true })) wordCount: number = 10
  ) {
    return this.counterService.processFile(file.path, wordCount)
  }

  /**
   * Processes a string to count words
   * @param text - The text to be processed
   * @param wordCount - The number of words to count (default is 10)
   * @returns A promise that resolves to the word count result
   */
  @Post('read-string')
  @ApiOperation({ summary: "Process a string to count the occurances of words in it" })
  @ApiConsumes('application/json')
  @ApiHeader({
    name: 'Accept-Language',
    description: 'Language coming from the request (browser)',
    required: true,
    schema: {
      type: 'string',
      default: 'en'
    }
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        text: {
          type: 'string'
        },
        wordCount: {
          type: 'number',
          default: 10
        }
      }
    }
  })
  @ApiResponse({ status: 201, description: "String successfully processed" })
  async readString(
    @Body('text') text: string,
    @Body('wordCount', new DefaultValuePipe(10), new ParseIntPipe({ optional: true })) wordCount: number
  ) {
    return this.counterService.processString(text, wordCount)
  }
}
