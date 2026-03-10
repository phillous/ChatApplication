// config.ts
export default () => ({
  mongo: {
    uri: process.env.MONGO_URI
  },
  jwt: {
    secret: process.env.JWT_SECRET
  },
  cookie: {
    cookieKey: process.env.COOKIE_KEY
  },
  redisUrl: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT
  },
  email: {
    resendApiKey: process.env.RESEND_API_KEY,
    emailFrom: process.env.EMAIL_FROM,
    emailFromName: process.env.EMAIL_FROM_NAME
  },
  clientUrl: process.env.CLIENT_URL,
  cloudinary: {
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      apiKey: process.env.CLOUDINARY_API_KEY,
      apiSecret: process.env.CLOUDINARY_API_SECRET
  }
});





