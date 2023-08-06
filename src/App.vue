<!-- eslint-disable vue/no-unused-vars -->
<script setup lang="ts">
import { ref } from 'vue'
const csv = ref(null)
</script>

<template>
  <div id="app">
    <img alt="Vue logo" src="assets/logo.png" />
    <div class="container">
      <div class="row mt-5 text-center">
        <div class="col-6 offset-3">
          <a href="assets/csv-sample.csv" target="_blank">Example CSV</a>
        </div>
      </div>
      <section class="py-5">
        <div class="row mt-5">
          <div class="col-8 offset-2">
            <h4>Example:</h4>
            <pre><code class="html">&lt;vue-csv-import
  v-model="csv"
  :fields="{name: {required: false, label: 'Name'}, age: {required: true, label: 'Age'}}"
&gt;
  &lt;vue-csv-toggle-headers&gt;&lt;/vue-csv-toggle-headers&gt;
  &lt;vue-csv-errors&gt;&lt;/vue-csv-errors&gt;
  &lt;vue-csv-input&gt;&lt;/vue-csv-input&gt;
  &lt;vue-csv-table-map :auto-match="false"&gt;&lt;/vue-csv-table-map&gt;
&lt;/vue-csv-import&gt;</code></pre>
          </div>
        </div>
        <div class="row mt-5">
          <div class="col-8 offset-2">
            <h4 class="mb-4">Result:</h4>
            <vue-csv-import
              v-slot="{ file }"
              v-model="csv"
              :fields="{
                name: { required: false, label: 'Name' },
                age: { required: true, label: 'Age' }
              }"
            >
              <vue-csv-errors></vue-csv-errors>
              <vue-csv-toggle-headers></vue-csv-toggle-headers>
              <vue-csv-input></vue-csv-input>
              <vue-csv-table-map
                :auto-match="false"
                :table-attributes="{ id: 'csv-table' }"
              ></vue-csv-table-map>
              <vue-csv-submit url="/"></vue-csv-submit>
            </vue-csv-import>
            <pre class="mt-15" v-if="csv"><code>{{ csv }}</code></pre>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
header {
  line-height: 1.5;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}
</style>
