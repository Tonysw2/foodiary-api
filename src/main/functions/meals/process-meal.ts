import 'reflect-metadata'

import { MealsQueueConsumer } from '@app/queues/message-queue-consumer'
import { Registry } from '@kernel/di/registry'
import { lambdaSqsAdapter } from '@main/adapters/lambda-sqs-adapter'

const consumer = Registry.getInstance().resolve(MealsQueueConsumer)

export const handler = lambdaSqsAdapter(consumer)
