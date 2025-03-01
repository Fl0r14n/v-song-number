<template>
  <ion-row>
    <ion-col v-for="digit in model" :key="digit.pos">
      <song-digit v-model="digit.val" />
    </ion-col>
  </ion-row>
</template>
<script lang="ts" setup>
  import { IonCol, IonRow } from '@ionic/vue'
  import SongDigit from '@/main/components/SongDigit.vue'
  import { Digit } from '@/store'

  const model = defineModel<Digit[]>()
</script>
