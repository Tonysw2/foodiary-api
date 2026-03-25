export async function downloadFile(url: string): Promise<ArrayBuffer> {
  const response = await fetch(url)
  if (!response.ok) throw new Error(`Failed to download file: ${response.statusText}`)
  return response.arrayBuffer()
}
