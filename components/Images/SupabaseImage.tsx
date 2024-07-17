import { getSignedUrl } from '@/data/api'
import React, { useState, useEffect } from 'react'
import { Image, ActivityIndicator, StyleSheet, ImageProps } from 'react-native'
import { ThemedText } from '../ThemedText'
import { ThemedView } from '../ThemedView'

type SupabaseImageProps = {
  path: string
} & ImageProps

const SupabaseImage: React.FC<SupabaseImageProps> = ({
  path,
  style,
  ...props
}) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    console.log('=== path', path)
    async function fetchSignedUrl() {
      if (!path.startsWith('http')) {
        // If it's already a LOCAL path, use it directly
        setImageUrl(path)
        setIsLoading(false)
      } else {
        // If it's a publicPath, get a signed URL
        const signedUrl = await getSignedUrl(path)
        setImageUrl(signedUrl)
        setIsLoading(false)
      }
    }

    fetchSignedUrl()
  }, [path])

  if (!path) {
    return <ThemedText>No image path provided</ThemedText>
  }

  return (
    <ThemedView style={[styles.container, style]}>
      {isLoading && <ActivityIndicator size="small" style={styles.loader} />}
      {imageUrl && (
        <Image
          source={{ uri: imageUrl }}
          style={[styles.image, style, isLoading && styles.hidden]}
          resizeMode="cover"
          onLoadStart={() => setIsLoading(true)}
          onLoadEnd={() => setIsLoading(false)}
          onError={() => {
            setHasError(true)
            setIsLoading(false)
          }}
          {...props}
        />
      )}
      {hasError && (
        <ThemedText style={styles.errorThemedText}>
          Failed to load image
        </ThemedText>
      )}
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    // Add any additional styles here
  },
  hidden: {
    opacity: 0,
  },
  loader: {
    position: 'absolute',
  },
  errorThemedText: {
    position: 'absolute',
    textAlign: 'center',
  },
})

export default SupabaseImage
