import 'reflect-metadata'

import { UpdateProfileController } from '@app/controllers/users/update-profile-controller.js'
import { lambdaHttpAdapter } from '@main/adapters/lambda-http-adapter.js'

export const handler = lambdaHttpAdapter(UpdateProfileController)
