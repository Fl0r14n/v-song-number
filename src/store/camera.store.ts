import { defineStore } from 'pinia'
import { Camera, CameraResultType, CameraSource, ImageOptions } from '@capacitor/camera'
import { useLoggerStore } from '@/store/logger.store'

const width = 600
const height = 600

const cameraOptions = (source: CameraSource): ImageOptions => ({
  quality: 50,
  allowEditing: true,
  source,
  resultType: CameraResultType.Base64,
  correctOrientation: true,
  width,
  height
})

export const useCameraStore = defineStore('CameraStore', () => {
  const { error } = useLoggerStore()
  const getPicture = async (source: CameraSource) => {
    try {
      const img = await Camera.getPhoto(cameraOptions(source))
      return `data:image/jpeg;base64,${img.base64String}`
    } catch (err: any) {
      await error(err.message)
      return undefined
    }
  }

  return {
    getPicture
  }
})
