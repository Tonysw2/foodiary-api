import type { IQueueConsumer } from '@app/contracts/queue-consumer-impl'
import type { SQSHandler } from 'aws-lambda'

export function lambdaSqsAdapter(consumer: IQueueConsumer<any>): SQSHandler {
  return async (event) => {
    await Promise.allSettled(
      event.Records.map(async (record) => {
        const message = JSON.parse(record.body)
        await consumer.process(message)
      }),
    )
  }
}
