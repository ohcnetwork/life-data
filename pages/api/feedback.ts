import axios from 'axios'
import * as AWS from 'aws-sdk'
import { VercelRequest, VercelResponse } from '@vercel/node'

AWS.config.update({
    accessKeyId: process.env.AWS_SQS_ACCESS,
    secretAccessKey: process.env.AWS_SQS_SECRET,
    region: process.env.AWS_SQS_REGION
})
var sqs = new AWS.SQS({ apiVersion: '2012-11-05' })

const isCaptchaVerified = async (captchaResponse: string) => {
    const { data } = await axios.post('https://www.google.com/recaptcha/api/siteverify', [], {
        params: {
            secret: process.env.RECAPTCHA_SECRET,
            response: captchaResponse
        }
    })

    return data.success
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
        return sqs.sendMessage(sqsParams, (err, data) => {
            if (!err) {
                return res.json({
                    type: 'success',
                    message: 'Feedback has been successfully recorded'
                })
            }

            return res.json({
                type: 'error',
                message: 'Error while recording feedback'
            }).status(500)
        })
    }

    return res.json({
        type: 'error',
        message: 'Captcha not verified'
    }).status(500)
}

export default handler
