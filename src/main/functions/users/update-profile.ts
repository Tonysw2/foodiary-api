import 'reflect-metadata'

import { UpdateProfileController } from '@app/controllers/users/update-profile-controller.js'
import { Registry } from '@kernel/di/registry.js'
import { lambdaHttpAdapter } from '@main/adapters/lambda-http-adapter.js'

const controller = Registry.getInstance().resolve(UpdateProfileController)

export const handler = lambdaHttpAdapter(controller)
