<template>
  <ion-page>
    <ion-tabs>
      <ion-router-outlet></ion-router-outlet>
      <template v-slot:bottom>
<ion-tab-bar >
        <ion-tab-button tab="main" href="/main">
          <ion-icon :icon="home" />
        </ion-tab-button>
        <ion-tab-button tab="info" href="/info">
          <ion-icon :icon="informationCircle" />
        </ion-tab-button>
        <ion-tab-button tab="books" href="/books">
          <ion-icon :icon="list" />
        </ion-tab-button>
        <ion-tab-button tab="config" href="/config">
          <ion-icon :icon="settings" />
        </ion-tab-button>
      </ion-tab-bar>
</template>
    </ion-tabs>
  </ion-page>
</template>
<script setup lang="ts">
  import { IonIcon, IonPage, IonRouterOutlet, IonTabBar, IonTabButton, IonTabs } from '@ionic/vue'
  import { home, informationCircle, list, settings } from 'ionicons/icons'
</script>
