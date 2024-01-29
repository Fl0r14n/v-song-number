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
          <ion-fab-button @click="takePicture()" class="ion-margin-bottom">
            <ion-icon :icon="camera" />
          </ion-fab-button>
          <ion-fab-button @click="selectPicture()">
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
            @ionInput="validate($event)"
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
          <ion-select v-model="form.label" :label="t('pages.bookModal.collection')" label-placement="floating" required>
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
    InputCustomEvent,
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
  import { computed } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { Book, BookCollection, minLengthRule, requiredRule, useCameraStore, useForm } from '@/store'
  import { camera, closeCircle, image } from 'ionicons/icons'
  import { CameraSource } from '@capacitor/camera'

  const props = defineProps<{
    collections?: BookCollection[]
    collection?: BookCollection
    book?: Book
  }>()
  const { form, valid, touch } = useForm({
    form: { ...props.book, label: props.collection?.name },
    rules: { title: [requiredRule(), minLengthRule(5)], thumb: [requiredRule()], label: [requiredRule()] }
  })
  const { t } = useI18n()
  const { getPicture } = useCameraStore()
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

  const validate = (ev: InputCustomEvent) => {
    const { value, classList } = ev.target
    console.log(value, classList, ev)

    classList.add('ion-invalid')
    classList.add('ion-touched')
  }
</script>
