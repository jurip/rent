import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';

export function validate(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors: Record<string, string[]> = {};
        for (const issue of error.issues) {
          const path = issue.path.join('.') || 'body';
          if (!errors[path]) errors[path] = [];
          errors[path].push(issue.message);
        }
        res.status(400).json({ success: false, message: 'Ошибка валидации', errors });
        return;
      }
      next(error);
    }
  };
}
