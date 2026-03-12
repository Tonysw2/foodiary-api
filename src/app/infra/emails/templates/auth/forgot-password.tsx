import { Body } from '@react-email/body'
import { Container } from '@react-email/container'
import { Head } from '@react-email/head'
import { Heading } from '@react-email/heading'
import { Hr } from '@react-email/hr'
import { Html } from '@react-email/html'
import { Preview } from '@react-email/preview'
import { Section } from '@react-email/section'
import { Tailwind } from '@react-email/tailwind'
import { Text } from '@react-email/text'

interface ForgotPasswordEmailProps {
  confirmationCode: string
}

export default function ForgotPasswordEmail({
  confirmationCode,
}: ForgotPasswordEmailProps) {
  return (
    <Html>
      <Head />
      <Tailwind>
        <Preview>Your Foodiary password reset code</Preview>
        <Body className="bg-gray-50 font-sans">
          <Container className="mx-auto max-w-lg px-4 py-12">
            <Section className="bg-white rounded-lg px-10 py-10 shadow-sm">
              <Heading
                as="h1"
                className="text-2xl font-bold text-gray-900 mt-0 mb-2"
              >
                Reset your password
              </Heading>
              <Text className="text-gray-600 mt-0 mb-6">
                You requested a password reset for your Foodiary account. Use
                the code below to reset your password.
              </Text>

              <Section className="bg-gray-100 rounded-lg py-6 text-center mb-6">
                <Text className="text-4xl font-bold tracking-widest text-gray-900 my-0">
                  {confirmationCode}
                </Text>
              </Section>

              <Text className="text-sm text-gray-500 mt-0 mb-0">
                This code expires in <strong>1 hour</strong>. If you didn't
                request a password reset, you can safely ignore this email.
              </Text>
            </Section>

            <Hr className="my-6 border-gray-200" />

            <Text className="text-xs text-center text-gray-400 mt-0">
              Foodiary — Track your meals, own your health.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}

ForgotPasswordEmail.PreviewProps = {
  confirmationCode: '123456',
}
