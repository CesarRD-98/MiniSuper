import { Request } from 'express'

export function getPublicImageUrl(
    req: Request, filename: string, folder = 'products'
): string {
    const host = `${req.protocol}://${req.get('host')}`
    return `${host}/uploads/${folder}/${filename}`
}