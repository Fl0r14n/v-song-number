<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>
          <ion-icon :icon="list" />
          {{ t('pages.books.title') }}
        </ion-title>
        <ion-buttons slot="primary">
          <ion-fab-button color="primary" @click="reorderCollections()">
            <ion-icon :icon="reorderFourOutline" />
          </ion-fab-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true" class="ion-padding">
      <ion-item-group v-for="(collection, i) in collections" :key="i">
        <ion-item-sliding #slidersRef>
          <ion-item>
            <ion-label color="medium">{{ collection.name }}</ion-label>
          </ion-item>
          <ion-item-options side="end">
            <ion-item-option color="primary" @click="collection.reorder = !collection.reorder">
              <ion-icon :icon="reorderFourOutline" />
            </ion-item-option>
          </ion-item-options>
        </ion-item-sliding>

        <ion-reorder-group :disabled="!collection.reorder" @ionItemReorder="reorderBook(collection, $event)">
          <ion-item-sliding v-for="(b, j) in collection.books" :key="j" #slidersRef>
            <ion-item :color="b === book ? 'primary' : ''">
              <ion-thumbnail slot="start">
                <img :src="b.thumb" alt="book-thumb" />
              </ion-thumbnail>
              <ion-label>
                <h2>{{ b.title }}</h2>
                <p>{{ b.description }}</p>
              </ion-label>
              <ion-reorder slot="end" />
            </ion-item>
            <ion-item-options side="start">
              <ion-item-option color="secondary" @click="editBook(b, collection)">
                <ion-icon :icon="create" size="large" />
              </ion-item-option>
            </ion-item-options>
            <ion-item-options side="end">
              <ion-item-option color="danger" @click="removeBook(b, collection)">
                <ion-icon :icon="trash" size="large" />
              </ion-item-option>
            </ion-item-options>
          </ion-item-sliding>
        </ion-reorder-group>
      </ion-item-group>

      <ion-fab vertical="bottom" horizontal="end" slot="fixed">
        <ion-fab-button @click="addBook()">
          <ion-icon :icon="add" />
        </ion-fab-button>
      </ion-fab>
    </ion-content>
  </ion-page>
</template>
<script setup lang="ts">
  import {
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonIcon,
    ItemReorderEventDetail,
    IonItemGroup,
    IonReorderGroup,
    IonReorder,
    IonThumbnail,
    IonItem,
    IonLabel,
    IonItemOptions,
    IonItemOption,
    IonFab,
    IonItemSliding,
    IonButtons,
    IonFabButton
  } from '@ionic/vue'
  import { useI18n } from 'vue-i18n'
  import { list, reorderFourOutline, add, create, trash } from 'ionicons/icons'
  import { Book, BookCollection, useSongBooksStore, useSongNumberStore } from '@/store'
  import { storeToRefs } from 'pinia'

  const { t } = useI18n()

  const songNumberStore = useSongNumberStore()
  const { cast } = songNumberStore
  const { book } = storeToRefs(songNumberStore)
  const { collections } = storeToRefs(useSongBooksStore())

  const addBook = async () => {}

  const reorderCollections = async () => {}

  const reorderBook = async (collection: BookCollection, { detail }: CustomEvent<ItemReorderEventDetail>) => {}
  const editBook = async (book: Book, collection: BookCollection) => {}

  const removeBook = async (item: Book, collection: BookCollection) => {}
</script>
