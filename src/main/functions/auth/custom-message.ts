import ForgotPasswordEmail from '@app/infra/emails/templates/auth/forgot-password'
import { render } from '@react-email/render'
import type { CustomMessageTriggerEvent } from 'aws-lambda'

export async function handler(event: CustomMessageTriggerEvent) {
  if (event.triggerSource === 'CustomMessage_ForgotPassword') {
    const confirmationCode = event.request.codeParameter

    const html = await render(ForgotPasswordEmail({ confirmationCode }))

    event.response.emailSubject = 'Reset your Foodiary password'
    event.response.emailMessage = html
  }
  return event
}
