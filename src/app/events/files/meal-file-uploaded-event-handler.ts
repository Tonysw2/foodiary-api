import type { IFileEventHandler } from '@app/contracts/file-event-handler-impl'
// biome-ignore lint/style/useImportType: value import required for emitDecoratorMetadata
import { MealUploadedUseCase } from '@app/use-cases/meals/meal-uploaded-use-case'
import { Injectable } from '@kernel/decorators/injectable'

@Injectable()
export class MealUploadedFileEventHandler implements IFileEventHandler {
  constructor(private readonly mealUploadedUseCase: MealUploadedUseCase) {}

  async handle(input: IFileEventHandler.Input): Promise<void> {
    await this.mealUploadedUseCase.execute({ fileKey: input.fileKey })
  }
}
