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

const handler = async (req: VercelRequest, res: VercelResponse) => {
    const { feedback, external_id } = req.body
    const captchaRes = req.body['g-recaptcha-response']
    const sqsParams: AWS.SQS.SendMessageRequest = {
        QueueUrl: process.env.AWS_SQS_URL,
        MessageBody: 'Feedback submitted by user, ' + feedback,
        MessageAttributes: {
            'Feedback': {
                DataType: 'String',
                StringValue: feedback
            },
            'External ID': {
                DataType: 'String',
                StringValue: external_id
            },
        }
    }

    if (await isCaptchaVerified(captchaRes)) {
        return sqs.sendMessage(sqsParams, (err, _) => {
            if (!err) {
                return respond(res, {
                    type: ResponseTypes.Success,
                    message: 'Feedback has been successfully recorded'
                })
            }

            return respond(res, {
                type: ResponseTypes.Error,
                message: 'Error while recording your feedback'
            })
        })
    }

    return respond(res, {
        type: ResponseTypes.Error,
        message: 'Captcha was not verified'
    })
}

export default handler
