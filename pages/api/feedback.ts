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
    const { feedback, external_id } = req.body

    if (!choiceExists(feedback))
        return respond(res, {
            type: ResponseTypes.Error,
            message: 'The choice you selected does not exist'
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

const getFeedbacks: VercelHandler = async (req, res) => {
    // TODO: Implement getting feedbacks. Data object below shows an example

    return respond(res, {
        type: ResponseTypes.Success,
        message: 'Successfully obtained all feedbacks',
        data: [
            {
                external_id: '4983-8423-2384',
                feedback: 'VerifiedAndAvailable'
            },
            {
                external_id: '9234-8024-4043',
                feedback: 'Downvote'
            }
        ]
    })
}

const handler: VercelHandler = async (req, res) => {
    const { token } = req.body
    const captchaRes = req.body['g-recaptcha-response']
    const method = req.method.toLowerCase()
    const production = process.env.NODE_ENV === 'production'

    if (production) {
        if (!token) {
            const captchaVerified = await isCaptchaVerified(captchaRes)
            if (!captchaVerified)
                return respond(res, {
                    type: ResponseTypes.Error,
                    message: 'Captcha verification failed'
                })
        } else {
            if (!isUserAllowed(token))
                return respond(res, {
                    type: ResponseTypes.Error,
                    message: 'Token is invalid'
                })
        }
    }

    switch (method) {
        case 'post':
            return await submitFeedback(req, res)
        case 'put':
            return await updateVerification(req, res)
        case 'get':
            return await getFeedbacks(req, res)
        default:
            return respond(res, {
                type: ResponseTypes.Error,
                message: method + ' HTTP method is not supported'
            })
    }
}

export default handler
