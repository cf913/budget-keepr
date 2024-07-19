import { supabase } from '@/lib/supabase'
import { decode } from 'base64-arraybuffer'
import * as FileSystem from 'expo-file-system'

export const BUCKET_NAME = 'avatars'
const FOLDER_NAME = 'avatars'

export async function uploadImage(uri: string): Promise<string> {
  try {
    // Generate a unique file name
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}`
    const fileExtension = uri.split('.').pop()
    const filePath = `${FOLDER_NAME}/${fileName}.${fileExtension}`

    // Read the file as base64
    const base64 = await FileSystem.readAsStringAsync(uri, {
      encoding: FileSystem.EncodingType.Base64,
    })

    // Upload to Supabase
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME) // Replace 'images' with your bucket name
      .upload(filePath, decode(base64), {
        contentType: `image/${fileExtension}`,
      })

    if (error) {
      throw error
    }

    if (!data) {
      throw new Error('Upload failed')
    }

    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from(BUCKET_NAME) // Replace 'images' with your bucket name
      .getPublicUrl(filePath)

    return publicUrlData.publicUrl
  } catch (error) {
    console.error('Error uploading image:', error)
    throw error
  }
}
