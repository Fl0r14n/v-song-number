<template>
  <ion-header>
    <ion-toolbar>
      <ion-title class="ion-text-center">
        {{ t('pages.collectionModal.title') }}
      </ion-title>
      <ion-buttons slot="primary">
        <ion-button color="primary" @click="dismiss()">
          <ion-icon slot="icon-only" :icon="closeCircle" />
        </ion-button>
      </ion-buttons>
    </ion-toolbar>
  </ion-header>
  <ion-content class="ion-padding">
    <ion-reorder-group :disabled="false" @ionItemReorder="reorderCollection($event)">
      <ion-item-sliding v-for="(collection, i) in collections" :key="i" ref="slidersRef">
        <ion-item>
          <ion-label>{{ collection.name }}</ion-label>
          <ion-reorder slot="end" />
        </ion-item>
        <ion-item-options side="start">
          <ion-item-option color="secondary" @click="editCollection(collection)">
            <ion-icon :icon="create" />
            {{ t('pages.books.edit') }}
          </ion-item-option>
        </ion-item-options>
        <ion-item-options side="end">
          <ion-item-option color="danger" @click="removeCollection(collection)">
            <ion-icon :icon="trash" />
            {{ t('pages.books.delete') }}
          </ion-item-option>
        </ion-item-options>
      </ion-item-sliding>
    </ion-reorder-group>
    <ion-fab vertical="bottom" horizontal="end" slot="fixed">
      <ion-fab-button @click="addCollection()">
        <ion-icon :icon="add" />
      </ion-fab-button>
    </ion-fab>
  </ion-content>
</template>
<script lang="ts" setup>
  import {
    alertController,
    IonButton,
    IonButtons,
    IonContent,
    IonFab,
    IonFabButton,
    IonHeader,
    IonIcon,
    IonItem,
    IonItemOption,
    IonItemOptions,
    IonItemSliding,
    IonLabel,
    IonReorder,
    IonReorderGroup,
    IonTitle,
    IonToolbar, type ItemReorderEventDetail,

    modalController
  } from '@ionic/vue'
  import { add, closeCircle, create, trash } from 'ionicons/icons'
  import { ref } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { storeToRefs } from 'pinia'
  import { type BookCollection, useSongBooksStore } from '@/store'

  const { t } = useI18n()
  const { dismiss } = modalController
  const slidersRef = ref<(typeof IonItemSliding)[]>([])
  const songBooksStore = useSongBooksStore()
  const { collections } = storeToRefs(songBooksStore)
  const closeItemSliders = () => slidersRef.value.forEach(v => (v as any).$el.close())

  const addCollection = async () => {
    const confirm = await alertController.create({
      header: t('pages.collectionModal.addDialog'),
      inputs: [
        {
          name: 'label',
          placeholder: t('pages.collectionModal.collection'),
          type: 'text',
          attributes: {
            minlength: 1
          }
        }
      ],
      buttons: [
        {
          text: t('pages.collectionModal.cancel'),
          handler: () => closeItemSliders()
        },
        {
          text: t('pages.collectionModal.add'),
          handler: data => {
            closeItemSliders()
            if (data.label.length) {
              collections.value.push({ name: data.label })
              return true
            }
            return false
          }
        }
      ]
    })
    await confirm.present()
  }

  const removeCollection = async (collection: BookCollection) => {
    const confirm = await alertController.create({
      header: t('pages.collectionModal.removeDialog', { value: collection.name }),
      message: t('pages.collectionModal.permanentRemoval'),
      buttons: [
        {
          text: t('pages.collectionModal.cancel'),
          handler: () => closeItemSliders()
        },
        {
          text: t('pages.collectionModal.remove'),
          handler: () => {
            closeItemSliders()
            const idx = collections.value.indexOf(collection)
            collections.value.splice(idx, 1)
          }
        }
      ]
    })
    await confirm.present()
  }
  const editCollection = async (collection: BookCollection) => {
    const confirm = await alertController.create({
      header: t('pages.collectionModal.editDialog', { value: collection.name }),
      inputs: [
        {
          name: 'label',
          placeholder: t('pages.collectionModal.collection'),
          type: 'text',
          value: collection.name,
          attributes: {
            minlength: 1
          }
        }
      ],
      buttons: [
        {
          text: t('pages.collectionModal.cancel'),
          handler: () => closeItemSliders()
        },
        {
          text: t('pages.collectionModal.edit'),
          handler: data => {
            if (data.label.length) {
              closeItemSliders()
              collection.name = data.label
              return true
            }
            return false
          }
        }
      ]
    })
    await confirm.present()
  }

  const reorderCollection = async ({ detail }: CustomEvent<ItemReorderEventDetail>) => {
    collections.value.splice(detail.to, 0, collections.value.splice(detail.from, 1)[0])
    await detail.complete(false)
  }
</script>
