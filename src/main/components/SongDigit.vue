<template>
  <div class="ion-text-center">
    <ion-button fill="outline" @click="inc()">
      <ion-icon slot="icon-only" :icon="chevronUpOutline" />
    </ion-button>
    <div class="ion-padding">
      <ion-label class="ion-text-center">
        {{ model }}
      </ion-label>
    </div>
    <ion-button fill="outline" @click="dec()">
      <ion-icon slot="icon-only" :icon="chevronDownOutline" />
    </ion-button>
  </div>
</template>
<script lang="ts" setup>
  import { chevronDownOutline, chevronUpOutline } from 'ionicons/icons'
  import { IonButton, IonIcon, IonLabel } from '@ionic/vue'

  const model = defineModel<number>()
  const inc = () => change(+1)
  const dec = () => change(-1)

  const change = (value: number) => {
    let val = model.value + value
    if (val < 0) {
      val = 9
    } else if (val > 9) {
      val = 0
    }
    model.value = val
  }
</script>
