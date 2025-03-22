<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title>
          <ion-icon :icon="informationCircle" />
          {{ t('pages.info.title') }}
        </ion-title>
        <ion-buttons slot="primary">
          <ion-fab-button :disabled="castButton.disabled" :color="castButton.color" @click="cast()">
            <ion-icon :src="castButton.src" />
          </ion-fab-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true" class="ion-padding">
      <ion-item>
        <ion-textarea clearInput :rows="6" :placeholder="t('pages.info.textArea')" v-model="info" />
      </ion-item>
      <ion-fab vertical="bottom" horizontal="start" slot="fixed">
        <ion-fab-button :disabled="presentedButton.disabled" :color="presentedButton.color" @click="readPresented()">
          <ion-icon :icon="presentedButton.icon" />
        </ion-fab-button>
      </ion-fab>
      <ion-fab vertical="bottom" horizontal="end" slot="fixed">
        <ion-fab-button :disabled="presentButton.disabled" :color="presentButton.color" @click="presentInfo(presentButton.presenting)">
          <ion-icon :icon="presentButton.icon" />
        </ion-fab-button>
      </ion-fab>
    </ion-content>
  </ion-page>
</template>
<script setup lang="ts">
  import {
    IonContent,
    IonHeader,
    IonToolbar,
    IonIcon,
    IonPage,
    IonTitle,
    IonFabButton,
    IonButtons,
    IonTextarea,
    IonItem,
    IonFab
  } from '@ionic/vue'
  import { useI18n } from 'vue-i18n'
  import { informationCircle } from 'ionicons/icons'
  import { useSongNumberStore } from '@/store'
  import { storeToRefs } from 'pinia'

  const { t } = useI18n()
  const songNumberStore = useSongNumberStore()
  const { cast, readPresented, presentInfo } = songNumberStore
  const { info, castButton, presentedButton, presentButton } = storeToRefs(songNumberStore)
</script>
<style lang="scss">
  ion-header {
    ion-fab-button {
      margin-right: 8px;
      padding: 2px;
    }
  }
</style>
