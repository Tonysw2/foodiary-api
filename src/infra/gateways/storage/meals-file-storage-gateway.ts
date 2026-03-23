import { Meal } from '@app/entities/meal.js'
import { HeadObjectCommand } from '@aws-sdk/client-s3'
import { createPresignedPost } from '@aws-sdk/s3-presigned-post'
import { s3Client } from '@infra/clients/s3-client.js'
import { Injectable } from '@kernel/decorators/injectable.js'
// biome-ignore lint/style/useImportType: value import required for emitDecoratorMetadata
import { AppConfig } from '@shared/config/app-config.js'
import KSUID from 'ksuid'

@Injectable()
export class MealsFileStorageGateway {
  constructor(private readonly appConfig: AppConfig) {}

  getInputFileURL(fileKey: string): string {
    return `${this.appConfig.cdns.mealsCDN}/${fileKey}`
  }

  static generateInputFileKey({
    accountId,
    inputType,
  }: MealsFileStorageGateway.GenerateInputFileKeyParams): string {
    const extension = inputType === Meal.InputType.AUDIO ? 'm4a' : 'jpeg'
    const filename = `${KSUID.randomSync().string}.${extension}`

    return `${accountId}/${filename}`
  }

  async createPOST({
    file,
    mealId,
    accountId,
  }: MealsFileStorageGateway.CreatePOSTParams): Promise<MealsFileStorageGateway.CreatePOSTResult> {
    const bucket = this.appConfig.storage.mealsBucket
    const contentType =
      file.inputType === Meal.InputType.AUDIO ? 'audio/m4a' : 'image/jpeg'

    const { url, fields } = await createPresignedPost(s3Client, {
      Bucket: bucket,
      Key: file.fileKey,
      Expires: 300,
      Conditions: [
        { bucket },
        ['eq', '$key', file.fileKey],
        ['eq', '$Content-Type', contentType],
        ['content-length-range', file.fileSize, file.fileSize],
      ],
      Fields: {
        'x-amz-meta-mealid': mealId,
        'x-amz-meta-accountid': accountId,
      },
    })

    const uploadSignature = Buffer.from(
      JSON.stringify({
        url,
        fields: {
          ...fields,
          'Content-Type': contentType,
        },
      }),
    ).toString('base64')

    return {
      uploadSignature,
    }
  }

  async getFileMetadata({
    fileKey,
  }: MealsFileStorageGateway.GetFileMetadataParams): Promise<MealsFileStorageGateway.GetFileMetadataResult> {
    const command = new HeadObjectCommand({
      Bucket: this.appConfig.storage.mealsBucket,
      Key: fileKey,
    })

    const { Metadata = {} } = await s3Client.send(command)

    if (!Metadata.accountid || !Metadata.mealid) {
      throw new Error(`[getFileMetadata] Cannot process file "${fileKey}"`)
    }

    return {
      mealId: Metadata.mealid,
      accountId: Metadata.accountid,
    }
  }
}

export namespace MealsFileStorageGateway {
  export type GenerateInputFileKeyParams = {
    accountId: string
    inputType: Meal.InputType
  }

  export type CreatePOSTParams = {
    mealId: string
    accountId: string
    file: {
      fileKey: string
      fileSize: number
      inputType: Meal.InputType
    }
  }

  export type CreatePOSTResult = {
    uploadSignature: string
  }

  export type GetFileMetadataParams = {
    fileKey: string
  }

  export type GetFileMetadataResult = {
    accountId: string
    mealId: string
  }
}
