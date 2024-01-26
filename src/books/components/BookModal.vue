<template>
  <ion-header>
    <ion-toolbar>
      <ion-title class="ion-text-center">
        {{ editMode ? t('pages.bookModal.edit.title') : t('pages.bookModal.add.title') }}
      </ion-title>
      <ion-buttons slot="end">
        <ion-button color="primary" @click="dismiss()">
          <ion-icon slot="icon-only" :icon="closeCircle" />
        </ion-button>
      </ion-buttons>
    </ion-toolbar>
  </ion-header>
  <ion-content>
    <form @submit.prevent="submit()" ref="f">
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
          <ion-list>
            <ion-item>
              <ion-input
                type="text"
                v-model="form.title"
                :label="t('pages.bookModal.bookTitle')"
                label-placement="floating"
                required
                min-length="5" />
            </ion-item>
            <ion-item>
              <ion-input type="text" v-model="form.description" :label="t('pages.bookModal.bookDescription')" label-placement="floating" />
            </ion-item>
            <ion-item>
              <ion-select v-model="form.label" :label="t('pages.bookModal.collection')" label-placement="floating" required>
                <ion-select-option v-for="(label, i) in labels" :key="i">{{ label }}</ion-select-option>
              </ion-select>
            </ion-item>
          </ion-list>
          <!--          :disabled="!f.valid"-->
          <ion-button expand="block" color="primary" type="submit">
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
    IonItem,
    IonList,
    IonSelect,
    IonSelectOption,
    IonTitle,
    IonToolbar,
    modalController
  } from '@ionic/vue'
  import { computed, ref, watch } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { Book, BookCollection, useCameraStore } from '@/store'
  import { camera, closeCircle, image } from 'ionicons/icons'
  import { CameraSource } from '@capacitor/camera'

  const f = ref()
  watch(f, fv => console.log(fv))
  const props = defineProps<{
    collections?: BookCollection[]
    collection?: BookCollection
    book?: Book
  }>()
  const form = ref({ ...props.book, label: props.collection?.name })
  const { t } = useI18n()
  const { getPicture } = useCameraStore()
  const { dismiss } = modalController
  const editMode = computed(() => !!props.book?.title)
  const labels = computed(() => props.collections?.map(v => v.name).sort() || [])
  const takePicture = async () => {
    form.value.thumb = await getPicture(CameraSource.Camera)
  }
  const selectPicture = async () => {
    form.value.thumb = await getPicture(CameraSource.Photos)
  }
  const submit = () => dismiss(form.value)
</script>
