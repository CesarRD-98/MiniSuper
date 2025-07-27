import { ApiResponse } from "@common/interfaces/response.interface";
import { ResponseService } from "./response.service";

export abstract class ResponseController {
    constructor(protected readonly responseService: ResponseService) { }
    protected success<T>(code: string, data?: T, message?: string): ApiResponse<T> {
        return this.responseService.success(code, data, message)
    }
}