<template>
  <v-autocomplete
    v-model="selectedCustomer"
    :items="customers"
    item-title="text"
    item-value="value"
    label="Customers"
    :loading="isLoading"
    :search-input="searchQuery"
    @update:search="updateSearchQuery"
    @input="fetchCustomers"
  ></v-autocomplete>
  <br /><br /><br /><br />
  {{ selectedCustomer }}

  {{ customers }}

  {{ searchQuery }}
</template>

<script>
import axios from "axios";
import config from "@/config";
import { createVuetify } from "vuetify";
import { VAutocomplete } from "vuetify/lib/components"; // Import createVuetify from Vuetify

import "vuetify/dist/vuetify.css"; // Import Vuetify CSS styles

export default {
  components: {
    VAutocomplete, // Register the VAutocomplete component
  },
  data() {
    return {
      searchQuery: "",
      isLoading: false,
      customers: [],
      selectedCustomer: null,
    };
  },
  computed: {},
  methods: {
    updateSearchQuery(value) {
      this.searchQuery = value;
    },
    fetchCustomers() {
      // Fetch customers from API
      if (this.searchQuery.length >= 2) {
        this.isLoading = true;
        const axiosConfig = {
          headers: {
            "Content-Type": "application/json",
            Authorization:
              "Bearer " + (localStorage.getItem("authtoken") || ""),
          },
        };
        axios
          .get(
            `${config.apiEndpoint}/customerSuggestions/${this.searchQuery}`,
            axiosConfig
          )
          .then((response) => {
            this.customers = response.data;
            this.isLoading = false;
          })
          .catch((error) => {
            console.error(error);
            this.isLoading = false;
          });
      } else {
        this.customers = [];
      }
    },
  },
  mounted() {
    const vuetify = createVuetify({
      theme: {
        // Specify your desired theme configurations here
      },
    });

    // Use the created Vuetify instance
    this.$vuetify = vuetify;
  },
};
</script>
