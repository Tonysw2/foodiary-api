import type { ZodMiniType } from 'zod/mini'

const SCHEMA_METADATA_KEY = 'custom:schema'

export function Schema(schema: ZodMiniType): ClassDecorator {
  return (target) => {
    Reflect.defineMetadata(SCHEMA_METADATA_KEY, schema, target)
  }
}

export function getSchema<TOutput = unknown>(
  target: any,
): ZodMiniType<TOutput> | undefined {
  return Reflect.getMetadata(SCHEMA_METADATA_KEY, target.constructor)
}
