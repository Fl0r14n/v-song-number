<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title>
          <ion-icon :icon="settings" />
          {{ t('pages.config.title') }}
        </ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true" class="ion-padding">
      <ion-item-group>
        <ion-item-divider>
          <ion-label>{{ t('pages.config.title') }}</ion-label>
        </ion-item-divider>
        <ion-item>
          <ion-toggle v-model="debug">{{ t('pages.config.debug') }}</ion-toggle>
        </ion-item>
        <ion-item>
          <ion-select v-model="digitsLength" :label="t('pages.config.digits')">
            <ion-select-option v-for="value in possibleDigits" :value="value" :key="value">{{ value }}</ion-select-option>
          </ion-select>
        </ion-item>
        <ion-item>
          <ion-input v-model="endpoint" :label="t('pages.config.collections')" label-placement="floating" />
        </ion-item>
      </ion-item-group>
      <ion-fab vertical="bottom" horizontal="end" slot="fixed">
        <ion-fab-button @click="importCollection()">
          <ion-icon :icon="add" />
        </ion-fab-button>
      </ion-fab>
    </ion-content>
  </ion-page>
</template>
<script setup lang="ts">
  import { computed } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { add, settings } from 'ionicons/icons'
  import { storeToRefs } from 'pinia'
  import {
    IonContent,
    IonHeader,
    IonIcon,
    IonPage,
    IonTitle,
    IonToolbar,
    IonItemGroup,
    IonLabel,
    IonFab,
    IonFabButton,
    IonInput,
    IonSelect,
    IonSelectOption,
    IonItem,
    IonItemDivider,
    IonToggle,
    modalController,
    useIonRouter
  } from '@ionic/vue'
  import { LogLevel, useLoggerStore, useSongBooksStore, useSongNumberStore } from '@/store'
  import ImportModal from '@/config/components/ImportModal.vue'

  const { t } = useI18n()
  const router = useIonRouter()
  const possibleDigits = [1, 2, 3, 4, 5]
  const songNumberStore = useSongNumberStore()
  const { digitsLength } = storeToRefs(songNumberStore)
  const { logLevel } = storeToRefs(useLoggerStore())
  const debug = computed({
    get: () => logLevel.value === LogLevel.DEBUG,
    set: value => (logLevel.value = (value && LogLevel.DEBUG) || LogLevel.INFO)
  })
  const { endpoint } = storeToRefs(useSongBooksStore())
  const importCollection = async () => {
    const modal = await modalController.create({
      component: ImportModal
    })
    await modal.present()
    await modal.onDidDismiss()
    router.push({ name: 'books' })
  }
</script>
