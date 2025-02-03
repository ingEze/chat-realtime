import nodemailer from 'nodemailer'
import { google } from 'googleapis'
import { emailConfig as config } from '../../config/email.config.js'
import { JwtService } from './JwtService.js'
import fs from 'fs'
import path from 'path'

const OAuth2 = google.auth.OAuth2

class EmailService {
  constructor () {
    this.oauth2Client = new OAuth2(
      config.auth.clientId,
      config.auth.clientSecret,
      'https://developers.google.com/oauthplayground'
    )
    this.oauth2Client.setCredentials({
      refresh_token: config.auth.refreshToken,
      tls: {
        rejectUnauthorized: false
      }
    })
  }

  async createTransport () {
    try {
      const accessToken = await new Promise((resolve, reject) => {
        this.oauth2Client.getAccessToken((err, token) => {
          if (err) {
            reject(err)
          }
          resolve(token)
        })
      })
      const transportConfig = {
        service: config.service,
        auth: {
          ...config.auth,
          accessToken
        }
      }
      return nodemailer.createTransport(transportConfig)
    } catch (err) {
      console.error('Error creating transport:', err)
      throw new Error('Error creating transport', err)
    }
  }

  async sendVerificationEmail (user) {
    try {
      const transporter = await this.createTransport()
      const verificationToken = JwtService.generateEmailVerificationToken(user._id)

      let logoPath = path.join(process.cwd(), 'frontend', 'image', 'flopichat.png')
      let mimeType = 'image/png'

      if (!fs.existsSync(logoPath)) {
        logoPath = path.join(process.cwd(), 'frontend', 'image', 'flopichat.jpg')
        mimeType = 'image/jpeg'

        if (!fs.existsSync(logoPath)) {
          logoPath = path.join(process.cwd(), 'frontend', 'image', 'flopichat.webp')
          mimeType = 'image/webp'
        }
      }

      const logoContent = fs.readFileSync(logoPath)

      const mailOptions = {
        from: 'FlopiChat <flopichat.app@gmail.com>',
        to: user.email,
        subject: 'Verify your account - FlopiChat',
        html: `
            <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 40px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
              <div style="text-align: center; margin-bottom: 30px;">
                  <img src="cid:unique-logo" alt="FlopiChat Logo" style="width: 100px; height: auto; border-radius: 15px;">
              </div>

              <div style="border-bottom: 2px solid #f0f0f0; padding-bottom: 20px; margin-bottom: 20px;">
                  <h2 style="color: #2C3E50; font-size: 24px; margin: 0 0 10px 0; text-align: center;">Welcome to FlopiChat!</h2>
                  <p style="color: #666; font-size: 16px; line-height: 1.6; margin-bottom: 25px; text-align: center;">Thank you for joining our community. We're excited to have you on board!</p>
              </div>

              <div style="background-color: #f8f9fa; padding: 20px; border-radius: 6px; margin-bottom: 25px;">
                  <p style="color: #2C3E50; font-size: 16px; line-height: 1.6; margin: 0 0 15px 0;">To ensure the security of your account and start enjoying all FlopiChat features, please verify your email address:</p>

                  <div style="text-align: center; margin: 25px 0;">
                      <a href="${process.env.FRONTEND_URL}/verify-email.html?token=${verificationToken}"
                        style="display: inline-block; padding: 14px 30px; background-color: #4CAF50; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px; transition: background-color 0.3s ease; cursor: pointer;">
                          Verify My Email

                      </a>
                  </div>

                  <p style="color: #666; font-size: 14px; margin: 0;">If you didn't create a FlopiChat account, you can safely ignore this email.</p>
              </div>

              <div style="border-top: 2px solid #f0f0f0; padding-top: 20px; text-align: center;">
                  <p style="color: #666; font-size: 14px; margin: 0 0 10px 0;">Need help? <a href="mailto:${config.auth.support}" style="color:rgb(108, 184, 111); text-decoration: none; cursor: pointer;">Contact our support team</a></p>
                  <p style="color: #666; font-size: 14px; margin: 0;">© ${new Date().getFullYear()} FlopiChat. All rights reserved.</p>
              </div>
            </div>
        `,
        attachments: [{
          filename: 'logo.' + mimeType.split('/')[1],
          content: logoContent,
          cid: 'unique-logo',
          contentType: mimeType,
          contentDisposition: 'inline'
        }]
      }

      const result = await transporter.sendMail(mailOptions)
      console.log('Correo enviado exitosamente:', result)

      return result
    } catch (err) {
      throw new Error('Failed to send verification email')
    }
  }
}

export default new EmailService()
