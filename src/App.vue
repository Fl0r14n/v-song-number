<template>
  <ion-app>
    <ion-router-outlet />
  </ion-app>
</template>

<script setup lang="ts">
  import { IonApp, IonRouterOutlet, useBackButton, useIonRouter } from '@ionic/vue'
  import { onMounted } from 'vue'
  import { SplashScreen } from '@capacitor/splash-screen'
  import { App } from '@capacitor/app'

  const ionRouter = useIonRouter()
  useBackButton(-1, () => {
    if (!ionRouter.canGoBack()) {
      App.exitApp()
    }
  })

  onMounted(async () => {
    await SplashScreen.hide()
  })
</script>
