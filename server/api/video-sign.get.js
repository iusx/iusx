import crypto from 'crypto'

export default defineEventHandler(() => {
  const secretKey = 'your_secret_key' 
  const filePath = '/test/test.mp4'  
  const expire = Math.floor(Date.now() / 1000) + 600 

  const stringToSign = `${filePath}${expire}${secretKey}`
  const token = crypto
    .createHash('md5')
    .update(stringToSign)
    .digest('hex')

  return {
    url: `${filePath}?token=${token}&expire=${expire}`
  }
})
