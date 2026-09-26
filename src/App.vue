<template>
  <ion-app>
    <ion-router-outlet />
  </ion-app>
</template>

<script setup lang="ts">
  import { App } from '@capacitor/app'
  import { SplashScreen } from '@capacitor/splash-screen'
  import { IonApp, IonRouterOutlet, useBackButton, useIonRouter } from '@ionic/vue'
  import { onMounted } from 'vue'

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
