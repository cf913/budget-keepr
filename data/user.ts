import { supabase } from '@/lib/supabase'

type UserProfileUpdate = {
  username: string
  avatarUrl: string | null
}

export async function updateUserProfile({
  username,
  avatarUrl,
}: UserProfileUpdate): Promise<void> {
  try {
    // Get the current user's ID
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      throw new Error('No user logged in')
    }

    // Update the user's profile in the 'profiles' table
    const { error } = await supabase
      .from('users')
      .update({
        username: username,
        avatar_url: avatarUrl,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id)

    if (error) {
      throw error
    }

    // Optionally, update the user's metadata in the auth.users table
    const { error: updateError } = await supabase.auth.updateUser({
      data: {
        username: username,
        avatar_url: avatarUrl,
      },
    })

    if (updateError) {
      console.error('Error updating user metadata:', updateError)
      // Decide if you want to throw this error or just log it
    }
  } catch (error) {
    console.error('Error updating user profile:', error)
    throw error
  }
}
