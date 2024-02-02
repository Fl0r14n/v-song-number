<template>
  <ion-header>
    <ion-toolbar>
      <ion-title class="ion-text-center">
        {{ editMode ? t('pages.bookModal.edit.title') : t('pages.bookModal.add.title') }}
      </ion-title>
      <ion-buttons slot="primary">
        <ion-button color="primary" @click="dismiss()">
          <ion-icon slot="icon-only" :icon="closeCircle" />
        </ion-button>
      </ion-buttons>
    </ion-toolbar>
  </ion-header>
  <ion-content>
    <form @submit.prevent="submit()">
      <ion-card>
        <img :src="form.thumb" alt="book-thumb" v-if="form.thumb" />
        <ion-fab vertical="top" horizontal="end">
          <ion-fab-button @click="takePicture()" class="ion-margin-bottom" :disabled="!hasCameraPermission">
            <ion-icon :icon="camera" />
          </ion-fab-button>
          <ion-fab-button @click="selectPicture()" :disabled="!hasPhotosPermission">
            <ion-icon :icon="image" />
          </ion-fab-button>
        </ion-fab>
        <ion-card-content>
          <ion-input
            type="text"
            v-model="form.title"
            :label="t('pages.bookModal.bookTitle')"
            label-placement="floating"
            :clear-input="true"
            :counter="true"
            maxlength="128"
            required
            minlength="5"
            :class="classes.title"
            @ionBlur="touch" />
          <ion-input
            type="text"
            v-model="form.description"
            :label="t('pages.bookModal.bookDescription')"
            label-placement="floating"
            :clear-input="true"
            :counter="true"
            maxlength="256"
            @ionBlur="touch" />
          <ion-select
            v-model="form.label"
            :label="t('pages.bookModal.collection')"
            label-placement="floating"
            required
            :class="classes.label">
            <ion-select-option v-for="(label, i) in labels" :key="i">{{ label }}</ion-select-option>
          </ion-select>
          <ion-button expand="block" color="primary" type="submit" :disabled="!valid">
            {{ editMode ? t('pages.bookModal.edit.submit') : t('pages.bookModal.add.submit') }}
          </ion-button>
        </ion-card-content>
      </ion-card>
    </form>
  </ion-content>
</template>
<script lang="ts" setup>
  import {
    IonButton,
    IonButtons,
    IonCard,
    IonCardContent,
    IonContent,
    IonFab,
    IonFabButton,
    IonHeader,
    IonIcon,
    IonInput,
    IonSelect,
    IonSelectOption,
    IonTitle,
    IonToolbar,
    modalController
  } from '@ionic/vue'
  import { computed, onMounted } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { Book, BookCollection, minLengthRule, requiredRule, useCameraStore, useForm, useSongBooksStore } from '@/store'
  import { camera, closeCircle, image } from 'ionicons/icons'
  import { CameraSource } from '@capacitor/camera'
  import { storeToRefs } from 'pinia'

  const props = defineProps<{
    collections?: BookCollection[]
    collection?: BookCollection
    book?: Book
  }>()
  const { form, valid, touch, classes } = useForm({
    form: { ...props.book, label: props.collection?.name },
    rules: { title: [requiredRule(), minLengthRule(5)], thumb: [requiredRule()], label: [requiredRule()] }
  })
  const { t } = useI18n()
  const { defaultCover } = useSongBooksStore()
  const cameraStore = useCameraStore()
  const { getPicture, askPermission } = cameraStore
  const { hasPhotosPermission, hasCameraPermission } = storeToRefs(cameraStore)
  const { dismiss } = modalController
  const editMode = computed(() => !!props.book?.title)
  const labels = computed(() => props.collections?.map(v => v.name).sort() || [])
  const takePicture = async () => {
    const picture = await getPicture(CameraSource.Camera)
    if (picture) {
      form.value.thumb = picture
    }
  }
  const selectPicture = async () => {
    const picture = await getPicture(CameraSource.Photos)
    if (picture) {
      form.value.thumb = picture
    }
  }
  const submit = () => dismiss(form.value)

  onMounted(async () => {
    if (!form.value.thumb) {
      const cover = await defaultCover()
      form.value.thumb = cover.thumb
    }
    await askPermission()
  })
</script>
