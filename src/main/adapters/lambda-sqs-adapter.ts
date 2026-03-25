import type { IQueueConsumer } from '@app/contracts/queue-consumer-impl'
import { Registry } from '@kernel/di/registry.js'
import type { Constructor } from '@shared/types/constructor.js'
import type { SQSHandler } from 'aws-lambda'

export function lambdaSqsAdapter(
  ConsumerClass: Constructor<IQueueConsumer<Record<string, unknown>>>,
): SQSHandler {
  return async (event) => {
    const consumer = Registry.getInstance().resolve(ConsumerClass)
    await Promise.allSettled(
      event.Records.map(async (record) => {
        const message = JSON.parse(record.body)
        await consumer.process(message)
      }),
    )
  }
}
