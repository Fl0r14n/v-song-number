<template>
  <ion-header>
    <ion-toolbar>
      <ion-title class="ion-text-center">
        {{ t('pages.importModal.title') }}
      </ion-title>
      <ion-buttons slot="primary">
        <ion-button color="primary" @click="modalController.dismiss()">
          <ion-icon slot="icon-only" :icon="closeCircle" />
        </ion-button>
      </ion-buttons>
    </ion-toolbar>
  </ion-header>
  <ion-content class="ion-padding">
    <ion-list>
      <ion-list-header>{{ t('pages.importModal.languageHeader') }}</ion-list-header>
      <ion-item>
        <ion-select v-model="language" :label="t('pages.importModal.language')">
          <ion-select-option v-for="value in languages" :value="value" :key="value.code">{{ value.name }}</ion-select-option>
        </ion-select>
      </ion-item>
    </ion-list>
    <ion-list v-if="index">
      <ion-list-header>{{ t('pages.importModal.collectionsHeader') }}</ion-list-header>
      <ion-item v-for="(idx, i) of index" :key="i">
        <ion-checkbox slot="start" v-model="idx.selected" :aria-label="idx.name" />
        <ion-label>
          <h2>{{ idx.name }}</h2>
          <p>{{ idx.description }}</p>
        </ion-label>
        <ion-avatar>
          <img :src="idx.thumb" alt="id-thumb" v-if="idx.thumb" />
        </ion-avatar>
      </ion-item>
      <ion-button expand="block" color="primary" :disabled="!hasSelection" @click="importCollection()">{{
        t('pages.importModal.submit')
      }}</ion-button>
    </ion-list>
  </ion-content>
</template>
<script lang="ts" setup>
  import { ref } from 'vue'
  import { closeCircle } from 'ionicons/icons'
  import { useI18n } from 'vue-i18n'
  import {
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonContent,
    IonList,
    IonListHeader,
    IonItem,
    IonLabel,
    IonSelect,
    IonSelectOption,
    IonAvatar,
    IonCheckbox,
    IonIcon,
    modalController
  } from '@ionic/vue'
  import { type BookResourceCollection, type Language, useSongBooksStore } from '@/store'
  import { storeToRefs } from 'pinia'
  import { onMounted, watch, computed } from 'vue'

  const { t } = useI18n()
  const language = ref<Language>()
  const languages = ref<Language[]>()
  const index = ref<BookResourceCollection[]>()
  const hasSelection = computed(() => !!index.value?.find(idx => idx.selected))
  const songBooksStore = useSongBooksStore()
  const { getLanguages, getIndex, getCollections } = songBooksStore
  const { collections } = storeToRefs(songBooksStore)

  onMounted(async () => {
    languages.value = await getLanguages()
  })

  watch(language, async l => {
    if (l?.code) {
      index.value = await getIndex(l.code)
    }
  })

  const importCollection = async () => {
    const paths = new Set(
      index.value
        ?.filter(v => v.selected)
        .map(v => v.paths)
        .reduce((a, b) => [...a, ...b], [])
    )
    const cols = await getCollections([...paths])
    collections.value = [...collections.value, ...cols]
    await modalController.dismiss()
  }
</script>
