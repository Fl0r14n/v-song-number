<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>
          <ion-icon :icon="musicalNotes" />
          {{ t('pages.main.title') }}
        </ion-title>
        <ion-buttons slot="primary">
          <ion-fab-button :disabled="castButton.disabled" :color="castButton.color" @click="cast()">
            <ion-icon :src="castButton.src" />
          </ion-fab-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true" class="ion-padding">
      <song-number v-model="digits" />
      <ion-item class="ion-padding-start ion-padding-end">
        <ion-input v-model="notes" :label="t('pages.main.notes')" label-placement="floating" />
      </ion-item>
      <ion-item class="ion-padding" @click="openSelectBookModal()">
        <ion-thumbnail slot="start" v-if="book?.thumb">
          <img :src="book.thumb" alt="book-thumb" />
        </ion-thumbnail>
        <ion-label>
          <template v-if="book.title">
            <h3>{{ book.title }}</h3>
            <p>{{ book.description }}</p>
          </template>
          <h2 v-else>{{ t('pages.main.book') }}</h2>
        </ion-label>
      </ion-item>
      <ion-fab vertical="bottom" horizontal="start" slot="fixed">
        <ion-fab-button :disabled="presentedButton.disabled" :color="presentedButton.color" @click="readPresented()">
          <ion-icon :icon="presentedButton.icon" />
        </ion-fab-button>
      </ion-fab>
      <ion-fab vertical="bottom" horizontal="end" slot="fixed">
        <ion-fab-button :disabled="presentButton.disabled" :color="presentButton.color" @click="presentNumber(presentButton.presenting)">
          <ion-icon :icon="presentButton.icon" />
        </ion-fab-button>
      </ion-fab>
    </ion-content>
  </ion-page>
</template>
<script setup lang="ts">
  import {
    alertController,
    IonButtons,
    IonContent,
    IonFab,
    IonFabButton,
    IonHeader,
    IonIcon,
    IonInput,
    IonItem,
    IonLabel,
    IonPage,
    IonThumbnail,
    IonTitle,
    IonToolbar,
    modalController
  } from '@ionic/vue'
  import { useI18n } from 'vue-i18n'
  import { musicalNotes } from 'ionicons/icons'
  import { useSongBooksStore, useSongNumberStore } from '@/store'
  import { storeToRefs } from 'pinia'
  import SongNumber from '@/main/components/SongNumber.vue'
  import SelectBookModal from '@/main/components/SelectBookModal.vue'
  import { watch } from 'vue'

  const { t } = useI18n()
  const songNumberStore = useSongNumberStore()
  const { cast, readPresented, presentNumber } = songNumberStore
  const { book, notes, message, castButton, presentedButton, presentButton, digits } = storeToRefs(songNumberStore)
  const { collections } = storeToRefs(useSongBooksStore())

  const openSelectBookModal = async () => {
    const modal = await modalController.create({
      component: SelectBookModal,
      componentProps: {
        collections: collections.value,
        book: book.value
      }
    })
    modal.present()
    const { data } = await modal.onDidDismiss()
    data && (book.value = data)
  }

  watch(message, async data => {
    if (data.isFeedback) {
      const { thumb } = data.book || {}
      let image = ''
      if (thumb) {
        image = thumb.match(/\((.*?)\)/)[1].replace(/('|")/g, '')
        image = `<img src="${image}">`
      }
      const notes = (data.notes && `<ion-card-content>${data.notes}</ion-card-content>`) || ''
      let alertMessage
      switch (data.type) {
        case 1: {
          alertMessage = `
            ${image}
            <ion-card-header>
            <ion-card-title>${data.number} ${data.book.title}</ion-card-title>
            <ion-card-subtitle>${data.book.description}</ion-card-subtitle>
            </ion-card-header>
            ${notes}
          `
          break
        }
        case 2: {
          alertMessage = data.message
          break
        }
        default: {
          alertMessage = t('pages.main.empty')
        }
      }
      const feedbackAlert = await alertController.create({
        cssClass: 'info-modal',
        message: alertMessage,
        buttons: [t('pages.main.close')]
      })
      await feedbackAlert.present()
    }
  })
</script>
<style lang="scss">
  ion-header {
    ion-fab-button {
      margin-right: 8px;
      padding: 2px;
    }
  }
</style>
