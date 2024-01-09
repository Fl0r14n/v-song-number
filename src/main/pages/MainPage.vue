<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>
          <ion-icon :icon="musicalNotes" />
          {{ t('pages.main.title') }}
        </ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
    </ion-content>
  </ion-page>
</template>
<script setup lang="ts">
  import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonIcon } from '@ionic/vue'
  import { useI18n } from 'vue-i18n'
  import { musicalNotes } from 'ionicons/icons'

  const { t } = useI18n()
</script>
