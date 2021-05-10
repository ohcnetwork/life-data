import axios from 'axios'
import * as AWS from 'aws-sdk'
import { VercelRequest, VercelResponse } from '@vercel/node'
import { isUserAllowed, respond, ResponseTypes, VercelHandler } from '../../lib/helpers'

AWS.config.update({
    accessKeyId: process.env.AWS_SQS_ACCESS,
    secretAccessKey: process.env.AWS_SQS_SECRET,
    region: process.env.AWS_SQS_REGION
})
const sqs = new AWS.SQS({ apiVersion: '2012-11-05' })

enum Choices {
    Upvote,
    Downvote,
    VerifiedAndAvailable,
    VerifiedAndUnavailable
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

const choiceExists = (feedback: number) => 
    Choices[feedback] == undefined ? false : true

const submitFeedback = async (req: VercelRequest, res: VercelResponse) => {
    const { feedback, external_id, token } = req.body

    if (!choiceExists(feedback))
        return respond(res, {
            type: ResponseTypes.Error,
            message: 'The choice you selected does not exist'
        })

    if (Choices[feedback] === 'VerifiedAndAvailable' && !isUserAllowed(token))
        return respond(res, {
            type: ResponseTypes.Error,
            message: 'You are not allowed to change the verification status'
        })

    const sentToSQS = await sendToSQS(feedback, external_id)

    if (sentToSQS)
        return respond(res, {
            type: ResponseTypes.Success,
            message: 'Feedback has been successfully recorded'
        })

    return respond(res, {
        type: ResponseTypes.Error,
        message: 'Error while recording your feedback'
    })
}

const updateVerification: VercelHandler = async (req, res) => {
    const { feedback, external_id } = req.body

    // TODO: Implement updation of verification status for the particular data

    return respond(res, {
        type: ResponseTypes.Success,
        message: 'Verification status has been updated successfully'
    })
}

const handler: VercelHandler = async (req, res) => {
    const captchaRes = req.body['g-recaptcha-response']
    const method = req.method.toLowerCase()

    const captchaVerified = await isCaptchaVerified(captchaRes)
    if (!captchaVerified)
        return respond(res, {
            type: ResponseTypes.Error,
            message: 'Captcha verification failed'
        })

    switch (method) {
        case 'post':
            await submitFeedback(req, res)
            break
        case 'put':
            await updateVerification(req, res)
            break
        default:
            respond(res, {
                type: ResponseTypes.Error,
                message: method + ' HTTP method is not supported'
            })
    }
}

export default handler
