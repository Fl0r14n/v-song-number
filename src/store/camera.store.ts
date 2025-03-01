import { useLoggerStore } from '@/store/logger.store'
import { Camera, CameraResultType, CameraSource, type ImageOptions, type PermissionStatus } from '@capacitor/camera'
import { type CameraPermissionType } from '@capacitor/camera/dist/esm/definitions'
import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'

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
  const permissionStatus = ref<PermissionStatus>()
  const hasCameraPermission = computed(() => permissionStatus.value?.camera === 'granted')
  const hasPhotosPermission = computed(() => permissionStatus.value?.photos === 'granted')
  const askPermission = async (source?: CameraSource) => {
    const permissions: CameraPermissionType[] = []
    if (!source) {
      if (!hasCameraPermission.value) permissions.push('camera')
      if (!hasPhotosPermission.value) permissions.push('photos')
    } else if (source === CameraSource.Camera && !hasCameraPermission.value) {
      permissions.push('camera')
    } else if (source === CameraSource.Photos && !hasPhotosPermission.value) {
      permissions.push('photos')
    }
    try {
      permissionStatus.value = await Camera.requestPermissions({ permissions })
    } catch {
      /* empty */
    }
  }
  const getPicture = async (source: CameraSource) => {
    try {
      const img = await Camera.getPhoto(cameraOptions(source))
      return `data:image/jpeg;base64,${img.base64String}`
    } catch (err: any) {
      await error(err.message)
      return undefined
    }
  }

  watch(
    permissionStatus,
    async () => {
      permissionStatus.value = await Camera.checkPermissions()
    },
    { immediate: true, once: true }
  )

  return {
    getPicture,
    askPermission,
    permissionStatus,
    hasCameraPermission,
    hasPhotosPermission
  }
})
