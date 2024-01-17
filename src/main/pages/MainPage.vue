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
          <h2 :hidden="book">{{ t('pages.main.book') }}</h2>
          <h3 v-if="book">{{ book.title }}</h3>
          <p v-if="book">{{ book.description }}</p>
        </ion-label>
      </ion-item>

      <ion-fab vertical="bottom" horizontal="start" slot="fixed">
        <ion-fab-button :disabled="presentedButton.disabled" :color="presentedButton.color" @click="readPresented()">
          <ion-icon :icon="presentedButton.icon" />
        </ion-fab-button>
      </ion-fab>

      <ion-fab vertical="bottom" horizontal="end" slot="fixed">
        <ion-fab-button :disabled="presentButton.disabled" :color="presentButton.color"
                        @click="presentNumber(presentButton.presenting)">
          <ion-icon :icon="presentButton.icon" />
        </ion-fab-button>
      </ion-fab>
    </ion-content>
  </ion-page>
</template>
<script setup lang="ts">
  import {
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
    IonToolbar
  } from '@ionic/vue'
  import { useI18n } from 'vue-i18n'
  import { musicalNotes } from 'ionicons/icons'
  import { useSongBooksStore, useSongNumberStore } from '@/store'
  import { storeToRefs } from 'pinia'
  import SongNumber from '@/main/components/SongNumber.vue'

  const { t } = useI18n()
  const songNumberStore = useSongNumberStore()
  const { cast, readPresented, presentNumber } = songNumberStore
  const { book, notes, message, castButton, presentedButton, presentButton, digits } = storeToRefs(songNumberStore)
  const { collections } = storeToRefs(useSongBooksStore())

  const openSelectBookModal = async () => {

  }
</script>
<style lang="scss">
  ion-header {
    ion-fab-button {
      margin-right: 8px;
      padding: 2px;
    }
  }
</style>
