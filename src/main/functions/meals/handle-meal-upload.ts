import 'reflect-metadata'

import { MealUploadedFileEventHandler } from '@app/events/files/meal-file-uploaded-event-handler'
import { lambdaS3Adapter } from '@main/adapters/lambda-s3-adapter'

export const handler = lambdaS3Adapter(MealUploadedFileEventHandler)
