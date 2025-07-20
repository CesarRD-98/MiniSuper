import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from "@nestjs/common";
import { Response } from "express";

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();

        let status = HttpStatus.INTERNAL_SERVER_ERROR;
        let message = 'Ha ocurrido un error inesperado';
        let code = 'INTERNAL_SERVER_ERROR';
        let data = null;

        if (exception instanceof HttpException) {
            status = exception.getStatus();
            const exceptionResponse = exception.getResponse();

            if (typeof exceptionResponse === 'string') {
                message = exceptionResponse;
            } else if (typeof exceptionResponse === 'object') {
                const res: any = exceptionResponse;

                if (Array.isArray(res.message)) {
                    message = res.message[0]
                } else if (typeof res.message === 'string') {
                    message = res.message
                }

                if (typeof res.error === 'string') {
                    code = res.error.toUpperCase().replace(/ /g, '_')
                } else if (typeof res.code === 'string') {
                    code = res.code
                }

                data = res.data ?? null;
            }
        }

        response.status(status).json({
            status: 'error', code, message, data
        })
    }
}