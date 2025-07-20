export interface ApiResponse<T = any> {
    status: 'success' | 'error';
    code: string;
    message?: string;
    data?: T;
}