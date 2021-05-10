import { VercelResponse } from '@vercel/node'

export enum ResponseTypes {
    Success,
    Error
}

export interface IResponse {
    type: ResponseTypes
    message: String
    data?: any
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
