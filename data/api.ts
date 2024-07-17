import { supabase } from '@/lib/supabase'
import { BUCKET_NAME } from '@/utils/imageUpload'
import { Session, User } from '@supabase/supabase-js'

export const getSupabaseSession = async () => {
  try {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession()

    if (error) {
      alert('unable to getUser: ' + error.message)
      return
    }

    const user = session?.user

    if (!user) {
      alert('getUser: User not found')
      return
    }
    return user
  } catch (e) {
    throw e
  }
}

export const getSupabaseUser = async (): Promise<User | null> => {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error) throw error

  return user
}

export const isAdmin = (session?: Session | null) => {
  const ADMIN_ID = 'ddee3ea7-0d3d-4194-8ab1-5e0a36ec2026'

  if (!session) return false

  return session.user?.id === ADMIN_ID
  //  const user = await getSupabaseUser()
  //  if (!user) return
  // const me = await supabase.auth.g
  //  return user.is_admin
}

function extractBucketAndPath(
  url: string,
): { bucket: string; filePath: string } | null {
  try {
    const parsedUrl = new URL(url)
    const pathParts = parsedUrl.pathname.split('/')

    // The bucket is always the first part after '/object/public/'
    const bucketIndex = pathParts.indexOf('public') + 1
    if (bucketIndex >= pathParts.length) return null

    const bucket = pathParts[bucketIndex]

    // The file path is everything after the bucket
    const filePath = pathParts.slice(bucketIndex + 1).join('/')

    return { bucket, filePath }
  } catch (error) {
    return null
  }
}

export async function getSignedUrl(publicUrl: string): Promise<string | null> {
  try {
    const extracted = extractBucketAndPath(publicUrl)
    if (!extracted) return null

    const { bucket, filePath } = extracted

    const { data, error } = await supabase.storage
      .from(bucket)
      .createSignedUrl(filePath, 3600 * 24) // URL expires in 1 hour (3600 seconds)

    if (error) throw error

    return data.signedUrl
  } catch (error) {
    console.error('Error getting signed image URL:', error)
    return null
  }
}
