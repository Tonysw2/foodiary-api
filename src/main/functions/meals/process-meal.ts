import 'reflect-metadata'

import { MealsQueueConsumer } from '@app/queues/message-queue-consumer'
import { lambdaSqsAdapter } from '@main/adapters/lambda-sqs-adapter'

export const handler = lambdaSqsAdapter(MealsQueueConsumer)
