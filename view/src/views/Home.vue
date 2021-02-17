<template>
  <div class="home">
    <Header></Header>
    <div class="cont">
      <Komentar></Komentar>
      <Film></Film>
    </div>
  </div>
</template>

<script>

import Header from '@/components/Header.vue';
import Komentar from "@/components/Komentar";
import Account from "@/views/Account";
import {mapState, mapActions} from "vuex";
import Film from "@/components/Film";

export default {
  name: 'Home',
  components: {
    Film,
    Header,
    Komentar,
    Account
  },
  computed: {
    ...mapState(['userid']),
    iduser: function () {
      return this.userid;
    },
    ...mapState(['username']),
    name: function () {
      return this.username;
    }
  },
  mounted: function () {
    this.load_user();
  },
  methods: {
    ...mapActions(['load_user'])
  }
}
</script>

<style scoped>
  .home {
    height: 80vh;
  }

  .cont {
    width: 100%;
    display: flex;
    flex-direction: row;
  }
</style>
