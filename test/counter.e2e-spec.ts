
import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { CounterModule } from '../src/counter/counter.module';
import { INestApplication } from '@nestjs/common';
import * as fs from 'fs';

describe('Counter', () => {
  let app: INestApplication;

  // Given
  const testFilePathTxt: string = __dirname + '\\success.txt';
  const testFileContentTxt: string = 'line1\nline2\nline1\nline3';
  const text: string = "This is a text that I am testing this is test";
  const wordCount: number = 3;

  beforeAll(async () => {
    fs.writeFileSync(testFilePathTxt, testFileContentTxt);

    const moduleRef = await Test.createTestingModule({
      imports: [CounterModule],
    })
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  it(`/POST upload`, () => {
    // Given
    const expectedResult = [
      { word: 'line1', count: 2 },
      { word: 'line2', count: 1 },
      { word: 'line3', count: 1 },
    ]

    // When
    return request(app.getHttpServer())
      .post('/upload')
      .set('Accept-Language', 'en')
      .attach('file', testFilePathTxt)
      .field('wordCount', wordCount)
      .expect(201) // Then
      .expect(expectedResult)
  });

  it(`/POST read-string`, () => {
    // Given
    const expectedResult = [
      { word: 'this', count: 2 },
      { word: 'is', count: 2 },
      { word: 'a', count: 1 },
    ]

    // When
    return request(app.getHttpServer())
      .post('/read-string')
      .set('Accept-Language', 'en')
      .send({ text, wordCount })
      .expect(201) //Then
      .expect(expectedResult);
  });

  afterAll(async () => {
    if (fs.existsSync(testFilePathTxt)) {
      fs.unlinkSync(testFilePathTxt);
    }
    await app.close();
  });
});