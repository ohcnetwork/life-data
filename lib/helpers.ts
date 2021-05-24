import { VercelRequest, VercelResponse } from '@vercel/node'

export enum ResponseTypes {
    Success,
    Error
}

export interface IResponse {
    type: ResponseTypes
    message: String
    data?: any
}

export interface VercelHandler {
    (req: VercelRequest, res: VercelResponse): VercelResponse | Promise<VercelResponse>
}

export const respond = (res: VercelResponse, payload: IResponse) => {
    const resData = {
        type: ResponseTypes[payload.type],
        message: payload.message,
        data: payload.data
    }

    if (payload.type === ResponseTypes.Error)
        return res.status(500).json(resData)
    
    return res.json(resData)
}

export const isUserAllowed = (token: string) => {
    const authTokens = process.env.AUTH_TOKENS.split(',')
    return authTokens.includes(token)
}

export const cors = fn => async (req: VercelRequest, res: VercelResponse) => {
    res.setHeader('Access-Control-Allow-Credentials', "true")
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    )

    if (req.method === 'OPTIONS')
        return res.status(200).end()

    return await fn(req, res)
}
