import { Registry } from '@kernel/di/registry.js'
import type { Constructor } from '@shared/types/constructor.js'

export function Injectable(): ClassDecorator {
  return (target) => {
    Registry.getInstance().register(target as unknown as Constructor)
  }
}
