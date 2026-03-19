/* eslint-disable no-console */
import { promises as fs } from 'node:fs'
import path from 'node:path'

const API_URL = 'https://vzp01655s4.execute-api.us-east-1.amazonaws.com/meals'
const TOKEN =
  'eyJraWQiOiJ6QnhQa1Y5a1BsSFwvd21Xb0VpNzN3N1NWRzliSG14SFZSbmFJY3dCNGJtOD0iLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJhNDc4ZDRlOC03MGMxLTcwMTMtNTg5OS1jMGIyZGMzZTZiNWUiLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAudXMtZWFzdC0xLmFtYXpvbmF3cy5jb21cL3VzLWVhc3QtMV8wZDZhRWYyV3AiLCJjbGllbnRfaWQiOiIzczEwZ3ZrOG9laml2a3JkbTdlMGJmNmc2cCIsIm9yaWdpbl9qdGkiOiI1MDQyNDcyOS1jNzAzLTRkOWUtYjQ3YS01YjI1ZjdhMjVkNmMiLCJpbnRlcm5hbElkIjoiM0Ixckd3cTRSdkh6bEVVOUJGWGlzbGxHSWJmIiwiZXZlbnRfaWQiOiJiNWIxZDViNS0zNjczLTRkNGQtYmUyZS01ZmNmYjc4ZDM5NDAiLCJ0b2tlbl91c2UiOiJhY2Nlc3MiLCJzY29wZSI6ImF3cy5jb2duaXRvLnNpZ25pbi51c2VyLmFkbWluIiwiYXV0aF90aW1lIjoxNzczOTM2MDgwLCJleHAiOjE3NzM5NzkyODAsImlhdCI6MTc3MzkzNjA4MCwianRpIjoiYjcxMDI0NzQtMjgxZi00MWExLTliY2QtNGNhNjExZjg2MWQ0IiwidXNlcm5hbWUiOiJhNDc4ZDRlOC03MGMxLTcwMTMtNTg5OS1jMGIyZGMzZTZiNWUifQ.hT7N_BDvXIHRGd5MIMYRqhNcNyRpIiTrlbFlunP6sBbp-VSgsgvqCxEY24mJwmtE-HTINKlf4rOX5gHQ3Ltgr_keVYpfxuJB3rYxIvZR-fcMPlhWl4VaA6MgoiG2ZLptorc_1cBIPDw5EL8snRckf6AOYf75_HBqwm-VOrx6SpZCR3dnPUm1R3FkajecLHvrkYF-NYGZHkDrlgRNzDdGulpNv0b_Y2wgpwyIl3tNiPF8ZfzlCLIyJiex5khZ26WpF4GQwfBEEyOdedFtOJKEoJEfMDkuLxEO80JHX-wN7L6qYaOoNLwYaiUSqdUmUcu0Zt9iy5lpFEeXkMHXBxcjLw'

interface IPresignResponse {
  uploadSignature: string
}

interface IPresignDecoded {
  url: string
  fields: Record<string, string>
}

async function readFile(
  filePath: string,
  type: 'audio/m4a' | 'image/jpeg',
): Promise<{
  data: Buffer
  size: number
  type: string
}> {
  console.log(`🔍 Reading file from disk: ${filePath}`)
  const data = await fs.readFile(filePath)
  return {
    data,
    size: data.length,
    type,
  }
}

async function createMeal(
  fileType: string,
  fileSize: number,
): Promise<IPresignDecoded> {
  console.log(
    `🚀 Requesting presigned POST for ${fileSize} bytes of type ${fileType}`,
  )
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${TOKEN}`,
    },
    body: JSON.stringify({ file: { inputType: fileType, size: fileSize } }),
  })

  if (!res.ok) {
    throw new Error(
      `Failed to get presigned POST: ${res.status} ${res.statusText}`,
    )
  }

  const json = (await res.json()) as IPresignResponse
  const decoded = JSON.parse(
    Buffer.from(json.uploadSignature, 'base64').toString('utf-8'),
  ) as IPresignDecoded

  console.log('✅ Received presigned POST data')
  return decoded
}

function buildFormData(
  fields: Record<string, string>,
  fileData: Buffer,
  filename: string,
  fileType: string,
): FormData {
  console.log(
    `📦 Building FormData with ${Object.keys(fields).length} fields and file ${filename}`,
  )
  const form = new FormData()
  for (const [key, value] of Object.entries(fields)) {
    form.append(key, value)
  }
  const blob = new Blob([new Uint8Array(fileData)], { type: fileType })
  form.append('file', blob, filename)
  return form
}

async function uploadToS3(url: string, form: FormData): Promise<void> {
  console.log(`📤 Uploading to S3 at ${url}`)
  const res = await fetch(url, {
    method: 'POST',
    body: form,
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(
      `S3 upload failed: ${res.status} ${res.statusText} — ${text}`,
    )
  }

  console.log('🎉 Upload completed successfully')
}

async function uploadFile(
  filePath: string,
  fileType: 'audio/m4a' | 'image/jpeg',
): Promise<void> {
  try {
    const { data, size, type } = await readFile(filePath, fileType)
    const { url, fields } = await createMeal(type, size)
    const form = buildFormData(fields, data, path.basename(filePath), type)
    await uploadToS3(url, form)
  } catch (err) {
    console.error('❌ Error during uploadFile:', err)
    throw err
  }
}

uploadFile(
  path.resolve(__dirname, 'assets', 'first-lunch.jpg'),
  'image/jpeg',
).catch(() => process.exit(1))
