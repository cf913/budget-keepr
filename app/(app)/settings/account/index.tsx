import React, { useState } from 'react'
import { Image, Pressable, StyleSheet } from 'react-native'
import * as ImagePicker from 'expo-image-picker'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { Page, Content, Padder, Spacer } from '@/components/Layout'
import { ThemedView } from '@/components/ThemedView'
import { ThemedText } from '@/components/ThemedText'
import ThemedInput from '@/components/Inputs/ThemedInput'
import { ThemedButton } from '@/components/Buttons/ThemedButton'
import { useColors } from '@/hooks/useColors'
import Toasty from '@/lib/Toasty'

// Assume these functions exist in your project
import { uploadImage } from '@/utils/imageUpload'
import { updateUserProfile } from '@/data/user'
import { useUser } from '@/stores/userStore'
import SupabaseImage from '@/components/Images/SupabaseImage'
import LazyImage from '@/components/Images/LazyImage'

const AVATAR_SIZE = 150
export default function AccountPresenter() {
  return <AccountScreen />
}

function AccountScreen() {
  const queryClient = useQueryClient()
  const { user, refetch: userRefetch } = useUser()
  const [username, setUsername] = useState(user?.user_metadata?.username || '')
  const [email, setEmail] = useState(user?.user_metadata?.email || '')
  const [saving, setSaving] = useState(false)
  const [avatarUri, setAvatarUri] = useState<string | null>(
    user?.user_metadata?.avatar_url || null,
  )
  const { bgColor2, tintColor } = useColors()

  const updateProfileMutation = useMutation({
    mutationFn: updateUserProfile,
    onSuccess: () => {
      Toasty.success('Profile updated successfully!')
      userRefetch()
    },
    onError: error => {
      console.error('Error updating profile:', error)
      Toasty.error('Failed to update profile')
    },
    onSettled: () => {
      setSaving(false)
    },
  })

  const handleImagePick = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync()

    if (permissionResult.granted === false) {
      alert("You've refused to allow this app to access your photos!")
      return
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    })

    if (!result.canceled && result.assets[0].uri) {
      setAvatarUri(result.assets[0].uri)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    let avatarUrl = avatarUri
    if (avatarUri && avatarUri.startsWith('file://')) {
      avatarUrl = await uploadImage(avatarUri)
    }

    updateProfileMutation.mutate({ username, avatarUrl })
    queryClient.invalidateQueries({ queryKey: ['user'] })
  }

  return (
    <Page title="Account" scroll back>
      <Content style={{ flex: 1 }}>
        <Padder />
        <ThemedView style={styles.avatarContainer}>
          <Pressable onPress={handleImagePick}>
            {/* <SupabaseImage */}
            {/*   path={avatarUri} */}
            {/*   style={{ ...styles.avatar, borderColor: tintColor }} */}
            {/*   resizeMode="cover" */}
            {/* /> */}
            {avatarUri ? (
              <LazyImage
                source={{ uri: avatarUri }}
                style={{ ...styles.avatar, borderColor: tintColor }}
                resizeMode="cover"
              />
            ) : (
              <ThemedView
                style={[styles.avatar, { backgroundColor: bgColor2 }]}
              >
                <ThemedText type="title">?</ThemedText>
              </ThemedView>
            )}
          </Pressable>
        </ThemedView>
        <Padder h={2} />
        <ThemedView
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <ThemedText
            style={{ marginBottom: 8, width: '25%' }}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            Username
          </ThemedText>
          <Padder w={1} />
          <ThemedInput
            style={{ flex: 1, margin: 0 }}
            value={username}
            onChangeText={setUsername}
            placeholder="username"
            autoCapitalize="none"
          />
        </ThemedView>
        <ThemedView
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <ThemedText
            style={{ marginBottom: 8, width: '25%' }}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            Email
          </ThemedText>
          <Padder w={1} />
          <ThemedInput
            style={{ flex: 1, margin: 0, opacity: 0.4 }}
            editable={false}
            value={email}
            onChangeText={setEmail}
            placeholder="Email"
            inputMode="email"
            autoCapitalize="none"
          />
        </ThemedView>
        <Spacer />
        <ThemedButton
          title="Save Changes"
          onPress={handleSave}
          loading={saving || updateProfileMutation.isPending}
        />
        <Padder h={2} />
      </Content>
    </Page>
  )
}

const styles = StyleSheet.create({
  avatarContainer: {
    alignItems: 'center',
  },
  avatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
  },
})
