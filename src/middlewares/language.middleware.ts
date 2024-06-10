import { BadRequestException, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

/**
 * Middleware that enforces all endpoints to be available for English speakers strictly
 */
@Injectable()
export class LanguageMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        const acceptLanguage: string = req.headers['accept-language']

        // The accept-language header is actually a string containing all supported languages by priority ex. 'en,fr,de', so if the first one is different then en, then an error should fire
        if (!acceptLanguage || !acceptLanguage.startsWith('en')) {
            throw new BadRequestException("Only English speakers can access this service")
        }   

        next()
    }
}
