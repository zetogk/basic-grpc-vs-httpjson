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

    <v-layout class="stats" row md24>
      <v-flex class="stat_detail" md24><b>Average HTTP:</b> {{averageHttp}} ms. <b>% saved time: </b> {{perHttp}} <v-progress-linear v-model="perHttpBar"></v-progress-linear> </v-flex>
    </v-layout>

    <v-layout class="stats" row md24>
      <v-flex class="stat_detail" md24><b>Average GRPC:</b> {{averageGrpc}} ms <b>% saved time: </b> {{perGrpc}} <v-progress-linear v-model="perGrpcBar"></v-progress-linear></v-flex>
    </v-layout>
    
  </v-container>
</template>

<style scoped>

  .stats {
    margin-top: 20px;
  }

  .stat_detail {
    display: block;
    width: 100%;
  }

</style>


<script>

import { vProgressLinear } from 'vuetify/lib';

export default {
  data: () => ({
    componentKey: 0,
    encode: 0,
    averageHttp: 0,
    averageGrpc: 0,
    perHttp: 0,
    pergrpc: 0,
    perHttpBar: 0,
    perGrpcBar: 0,
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
      text: 'GRPC Time (in ms)',
      align: 'center'
    },
    {
      value: 'httpTime',
      text: 'HTTP/JSON Time (in ms)',
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
    encodeString: "abxz",
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
      //this.reset();
      this.imageUrl = '';
      const data = await this.$http.get(`http://localhost:3000/encode/${user}`);
      this.encodesRecords = data.data.reverse().map(record => ({
        ...record,
        kbyteSize: record.byteSize / 1000,
        lastRecord: false
      }));
      this.averageHttp = 0
      this.averageGrpc = 0
      data.data.map(record => {
        this.averageHttp = this.averageHttp + record.httpTime;
        this.averageGrpc = this.averageGrpc + record.grpcTime;
      });

      this.averageHttp = this.averageHttp/data.data.length
      this.averageGrpc = this.averageGrpc/data.data.length

      console.log('this.averageHttp: ', this.averageHttp)
      console.log('this.averageGrpc: ', this.averageGrpc)

      if (this.averageHttp == this.averageGrpc) {
        this.perHttp = 0
        this.perGrpc = 0
        this.perHttpBar = 100
        this.perGrpcBar = 100
      } else if (this.averageHttp > this.averageGrpc) {
        this.perHttp = 0
        this.perGrpc = this.averageGrpc / this.averageHttp * 100
        this.perHttpBar = 100
        this.perGrpcBar = 100 - this.perGrpc
      } else{
        this.perGrpc = 0
        this.perHttp = this.averageHttp / this.averageGrpc * 100
        this.perHttpBar = 100 - this.perHttp
        this.perGrpcBar = 100
      }

      if (this.encodesRecords.length > 0) {
        this.encodesRecords[0].lastRecord = true;
      } 
      this.componentKey += 1; 
      this.$forceUpdate();
      console.log('this.encodesRecords::: ', this.encodesRecords);
    }
  },
  componentes: {
    vProgressLinear: vProgressLinear
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
