<template>
  <v-container fluid>
    <v-layout row md6>
      <v-flex>
        <v-form ref="form" v-model="valid" lazy-validation>
          <v-text-field v-model="user" :counter="4" :rules="userRules" label="User" required></v-text-field>
          <v-text-field v-model="imageUrl" :rules="imageUrlRules" label="URL Image" required></v-text-field>
          <v-text-field
            v-model="encodeString"
            :counter="2"
            :rules="encodeStringRules"
            label="Encode String"
            required
          ></v-text-field>

          <v-btn color="error" @click="reset">Reset Form</v-btn>

          <v-btn color="success" @click="saveRecord">Encode and Save</v-btn>
        </v-form>
      </v-flex>
    </v-layout>
    <v-layout row md6>
      <v-flex md12>
        <v-data-table :headers="headersTable" :items="encodesRecords" class="elevation-1" :key="componentKey">
          <template v-slot:items="props"> 
            <td class="text-xs-center">{{ props.item.byteSize }}</td>
            <td class="text-xs-center">{{ props.item.kbyteSize }}</td>
            <td class="text-xs-center">{{ props.item.grpcTime }}</td>
            <td class="text-xs-center">{{ props.item.httpTime }}</td>
            <td class="text-xs-center">{{ props.item.lastRecord }}</td>
          </template>
        </v-data-table>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>

export default {
  data: () => ({
    componentKey: 0,
    encodesRecords: [],
    headersTable: [{
      value: 'byteSize',
      text: 'Size (in bytes) sent',
      align: 'center'
    },
    {
      value: 'kbyteSize',
      text: 'Size (in Kb) sent',
      align: 'center'
    },
    {
      value: 'grpcTime',
      text: 'GRPC Time',
      align: 'center'
    },
    {
      value: 'httpTime',
      text: 'HTTP Time',
      align: 'center'
    },
    {
      value: 'lastRecord',
      text: 'Is the last record?',
      align: 'center'
    }],
    valid: true,
    user: "",
    userRules: [
      v => !!v || "User is required",
      v => (v && v.length >= 4) || "User must be greater than 4 characters"
    ],
    imageUrl: "",
    imageUrlRules: [v => !!v || "Image URL is required"],
    encodeString: "",
    encodeStringRules: [
      v => !!v || "Encode string is required",
      v =>
        (v && v.length >= 2) || "EncodeString must be greater than 2 characters"
    ]
  }),
  methods: {
    reset() {
      this.$refs.form.reset();
    },
    async saveRecord() {
      await this.$http
        .post("http://localhost:3000/encode", {
          user: this.user,
          imageUrl: this.imageUrl,
          encodeString: this.encodeString
        })
      const user = this.user;
      this.reset();
      const data = await this.$http.get(`http://localhost:3000/encode/${user}`);
      this.encodesRecords = data.data.reverse().map(record => ({
        ...record,
        kbyteSize: record.byteSize / 1000,
        lastRecord: false
      }));
      if (this.encodesRecords.length > 0) {
        this.encodesRecords[0].lastRecord = true;
      } 
      this.componentKey += 1; 
      this.$forceUpdate();
      console.log('this.encodesRecords::: ', this.encodesRecords);
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
