import { ApiResponse } from "@common/interfaces/response.interface";
import { Injectable } from "@nestjs/common";

@Injectable()
export class ResponseService {
    success<T>(code: string, data?: T, message?: string): ApiResponse<T> {
        return {
            status: 'success', code, message, data
        }
    }
}