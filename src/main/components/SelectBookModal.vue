<template>
  <ion-header>
    <ion-toolbar>
      <ion-title class="ion-text-center">
        {{ t('pages.selectBookModal.title') }}
      </ion-title>
      <ion-buttons slot="primary">
        <ion-button color="primary" @click="dismiss()">
          <ion-icon slot="icon-only" :icon="closeCircle" />
        </ion-button>
      </ion-buttons>
    </ion-toolbar>
  </ion-header>
  <ion-content>
    <ion-list inset>
      <template v-for="collection in collections" :key="objectKey(collection)">
        <ion-item-divider>
          <ion-label>{{ collection.name }}</ion-label>
        </ion-item-divider>
        <ion-item v-for="item of collection.books" :key="objectKey(item)" @click="selectBook(item)" :color="isSameBook(item, book) ? 'primary' : ''">
          <ion-thumbnail slot="start">
            <img :src="item.thumb" alt="item-thumb" />
          </ion-thumbnail>
          <ion-label>
            <h2>{{ item.title }}</h2>
            <p>{{ item.description }}</p>
          </ion-label>
        </ion-item>
      </template>
    </ion-list>
  </ion-content>
</template>
<script lang="ts" setup>
  import {
    IonButton,
    IonButtons,
    IonContent,
    IonHeader,
    IonIcon,
    IonItem,
    IonItemDivider,
    IonLabel,
    IonList,
    IonThumbnail,
    IonTitle,
    IonToolbar,
    modalController
  } from '@ionic/vue'
  import { closeCircle } from 'ionicons/icons'
  import { useI18n } from 'vue-i18n'
  import { type Book, type BookCollection, isSameBook, objectKey } from '@/store'

  const { t } = useI18n()
  defineProps<{
    collections: BookCollection[]
    book: Book
  }>()

  const dismiss = () => modalController.dismiss()
  const selectBook = (item: Book) => modalController.dismiss(item)
</script>
