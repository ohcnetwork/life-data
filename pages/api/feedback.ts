import axios from 'axios'
import * as AWS from 'aws-sdk'
import { VercelRequest, VercelResponse } from '@vercel/node'

AWS.config.update({
    accessKeyId: process.env.AWS_SQS_ACCESS,
    secretAccessKey: process.env.AWS_SQS_SECRET,
    region: process.env.AWS_SQS_REGION
})
var sqs = new AWS.SQS({ apiVersion: '2012-11-05' })

enum Choices {
    Upvote,
    Downvote,
    VerifiedAndAvailable,
    VerifiedAndUnavailable
}

enum ResponseTypes {
    Success,
    Error
}

interface IResponse {
    type: ResponseTypes
    message: String
    data?: any
}

const isCaptchaVerified = async (captchaResponse: string) => {
    const { data } = await axios.post('https://www.google.com/recaptcha/api/siteverify', [], {
        params: {
            secret: process.env.RECAPTCHA_SECRET,
            response: captchaResponse
        }
    })

    return data.success
}

const respond = (res: VercelResponse, payload: IResponse) => {
    const resData = {
        type: ResponseTypes[payload.type],
        message: payload.message,
        data: payload.data
    }

    if (payload.type === ResponseTypes.Error)
        return res.status(500).json(resData)
    
    return res.json(resData)
}

const sendToSQS = (feedback: number, external_id: string): Promise<AWS.SQS.SendMessageResult> =>
    new Promise((resolve, reject) => {
        const choice = Choices[feedback]
        const sqsParams: AWS.SQS.SendMessageRequest = {
            QueueUrl: process.env.AWS_SQS_URL,
            MessageBody: 'Feedback submitted by user, ' + choice,
            MessageAttributes: {
                'Feedback': {
                    DataType: 'String',
                    StringValue: choice
                },
                'ExternalID': {
                    DataType: 'String',
                    StringValue: external_id
                }
            }
        }

        sqs.sendMessage(sqsParams, (err, data) => err ? reject(err) : resolve(data))
    })

const handler = async (req: VercelRequest, res: VercelResponse) => {
    const { feedback, external_id } = req.body
    const captchaRes = req.body['g-recaptcha-response']

    const sentToSQS = await sendToSQS(feedback, external_id)
    const captchaVerified = await isCaptchaVerified(captchaRes)

    if (captchaVerified && sentToSQS)
        return respond(res, {
            type: ResponseTypes.Success,
            message: 'Feedback has been successfully recorded'
        })

    return respond(res, {
        type: ResponseTypes.Error,
        message: 'Error while recording your feedback'
    })
}

export default handler
