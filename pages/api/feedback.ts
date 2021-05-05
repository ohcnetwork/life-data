import { VercelRequest, VercelResponse } from '@vercel/node'

const handler = (req: VercelRequest, res: VercelResponse) => {
    res.json({ hello: 'world' })
}

export default handler
