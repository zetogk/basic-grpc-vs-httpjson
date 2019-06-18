<template>
  <v-app>
    <v-toolbar app>
      <v-toolbar-title class="headline text-uppercase">
        <span>Vuetify</span>
        <span class="font-weight-light">MeetUp 3# K8SMedellín</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn
        flat
        href="https://github.com/vuetifyjs/vuetify/releases/latest"
        target="_blank"
      >
      </v-btn>
    </v-toolbar>

    <v-content>
      <EncoderSection/>
    </v-content>
  </v-app>
</template>

<script>
import EncoderSection from './components/Encode.vue'

export default {
  name: 'App',
  components: {
    EncoderSection
  },
  data () {
    return {
      //
    }
  }
}
</script>
