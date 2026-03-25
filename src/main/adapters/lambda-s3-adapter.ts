import type { IFileEventHandler } from '@app/contracts/file-event-handler-impl'
import { Registry } from '@kernel/di/registry.js'
import type { Constructor } from '@shared/types/constructor.js'
import type { S3Handler } from 'aws-lambda'

export function lambdaS3Adapter(
  EventHandlerClass: Constructor<IFileEventHandler>,
): S3Handler {
  return async (event) => {
    const eventHandler = Registry.getInstance().resolve(EventHandlerClass)
    const responses = await Promise.allSettled(
      event.Records.map((record) =>
        eventHandler.handle({
          fileKey: record.s3.object.key,
        }),
      ),
    )

    const failedEvents = responses.filter(
      (response) => response.status === 'rejected',
    )

    for (const event of failedEvents) {
      console.error(JSON.stringify(event.reason, null, 2))
    }
  }
}
