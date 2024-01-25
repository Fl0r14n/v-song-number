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
        <ion-item-sliding ref="slidersRef">
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
          <ion-item-sliding v-for="(b, j) in collection.books" :key="j" ref="slidersRef">
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
    alertController,
    IonButtons,
    IonContent,
    IonFab,
    IonFabButton,
    IonHeader,
    IonIcon,
    IonItem,
    IonItemGroup,
    IonItemOption,
    IonItemOptions,
    IonItemSliding,
    IonLabel,
    IonPage,
    IonReorder,
    IonReorderGroup,
    IonThumbnail,
    IonTitle,
    IonToolbar,
    ItemReorderEventDetail,
    modalController
  } from '@ionic/vue'
  import { ref } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { add, create, list, reorderFourOutline, trash } from 'ionicons/icons'
  import { Book, BookCollection, useSongBooksStore, useSongNumberStore } from '@/store'
  import { storeToRefs } from 'pinia'
  import CollectionModal from '@/books/components/CollectionModal.vue'
  import BookModal from '@/books/components/BookModal.vue'

  const { t } = useI18n()
  const songNumberStore = useSongNumberStore()
  const { book } = storeToRefs(songNumberStore)
  const songBooksStore = useSongBooksStore()
  const { addBook: addToCollection, deleteBook: delFromCollection, editBook: editInCollection } = songBooksStore
  const { collections } = storeToRefs(songBooksStore)
  const slidersRef = ref<(typeof IonItemSliding)[]>([])

  const addBook = async () => {
    const modal = await modalController.create({
      component: BookModal,
      componentProps: {
        book: {},
        collections: collections.value
      }
    })
    await modal.present()
    const { data } = await modal.onDidDismiss()
    closeItemSliders()
    if (data) {
      const { label } = data
      delete data.label
      addToCollection(data, label)
      book.value = data
    }
  }
  const reorderCollections = async () => {
    const modal = await modalController.create({
      component: CollectionModal
    })
    await modal.present()
  }
  const reorderBook = async (collection: BookCollection, { detail }: CustomEvent<ItemReorderEventDetail>) => {
    const { books } = collection
    books && books.splice(detail.to, 0, books.splice(detail.from, 1)[0])
    await detail.complete(true)
  }
  const editBook = async (b: Book, c: BookCollection) => {
    const modal = await modalController.create({
      component: BookModal,
      componentProps: {
        book: b,
        collection: c,
        collections: collections.value
      }
    })
    modal.present()
    const { data } = await modal.onDidDismiss()
    closeItemSliders()
    if (data) {
      // did the collection change?
      if (data.label === c.name) {
        delete data.label
        editInCollection(b, data)
      } else {
        delFromCollection(b, c)
        const { label } = data
        delete data.label
        addToCollection(data, label)
      }
      delete data.label
      book.value = data
    }
  }
  const removeBook = async (item: Book, collection: BookCollection) => {
    const confirm = await alertController.create({
      header: t('pages.books.removeBook', { value: item.title }),
      message: t('pages.books.permanentRemoval'),
      buttons: [
        {
          text: t('pages.books.cancel'),
          handler: () => {
            closeItemSliders()
          }
        },
        {
          text: t('pages.books.remove'),
          handler: () => {
            closeItemSliders()
            delFromCollection(item, collection)
          }
        }
      ]
    })
    await confirm.present()
  }
  const closeItemSliders = () => {
    slidersRef.value.forEach(v => v.$el.close())
  }
</script>
