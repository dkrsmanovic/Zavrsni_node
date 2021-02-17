<template>
  <div id="komentari">
    <div id="komentari-container">
      <div id="komentari-header">
        <div id="search-container">
          <input type="text" id="searchbox" placeholder="Search" @keyup="search">
        </div>
      </div>
      <div id="all-komentar">
        <textarea class="new-komentar-container" placeholder="Start writing a new comment..." v-model="text"></textarea>
        <div id="dodajNovi" @click="addNew">
          +
        </div>
        <div id="added-komentar">
          <K v-if="komentar.length > 0" v-bind:komentar="komentar" v-bind:iduser="this.iduser" @deleteUpdate="delUpdate"></K>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import K from '@/components/K.vue'
import {mapActions, mapState, mapGetters} from 'vuex';
import router from "@/router";

export default {
  name: "Komentar",
  components: {
    K
  },
  data() {
    return {
      text: '',
      komentar: [],
    }
  },
  computed: {
    ...mapGetters({
      iduser: 'id'
    })
  },
  methods: {
    search: function (e) {
      let svi = document.querySelectorAll("#komentar-text");
      if (e.target.value === "") {
        for (let i = 0; i < svi.length; i++) {
          svi[i].parentElement.parentElement.parentElement.style.display = "block";
        }
      }
      else {
        for (let i = 0; i < svi.length; i++) {
          if (svi[i].textContent.includes(e.target.value)) {
            svi[i].parentElement.parentElement.parentElement.style.display = "block";
          }
          else {
            svi[i].parentElement.parentElement.parentElement.style.display = "none";
          }
        }
      }
    },
    addNew: function () {
      if (this.text === "") {
        alert("Fill out this field!");
        return;
      }
      fetch('http://localhost:3000/komentar/novi', {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({text: this.text, iduser: "" + this.iduser})
      }).then((response) => {
        if (!response.ok)
          throw response;
        return response.json();
      }).then(({ jsonData }) => {
        this.komentar = [];
        for(let i = 0; i < jsonData.length; i++) {
          this.komentar.push(jsonData[i]);
          console.log("komentar " + jsonData[i].id)
        }
        this.text = "";
      }).catch((error) => {
        if (typeof error.text === 'function')
          error.text().then((errorMessage) => {
            alert(errorMessage);
          });
        else
          alert(error);
      });
    },
    delUpdate( array ) {
      this.komentar = [];
      for (let i = 0; i < array.length; i++) {
        this.komentar.push(array[i]);
      }
    },
    initialFetch: function () {
      fetch('http://localhost:3000/komentar', { method: 'get' }).then((response) => {
        if (!response.ok)
          throw response;
        return response.json()
      }).then(({ jsonData }) => {
        for(let i = 0; i < jsonData.length; i++) {
          console.log(jsonData[i]);
          this.komentar.push(jsonData[i]);
        }
      }).catch((error) => {
        if (typeof error.text === 'function')
          error.text().then((errorMessage) => {
            alert(errorMessage);
          });
        else
          alert(error);
      });
    },
  },
  mounted () {
    console.log("fetch komentar");
    this.initialFetch();
  },
  watch: {
    '$route': 'initialFetch'
  },
}
</script>

<style>

  #komentari {
    height: 100vh;
    width: 60%;
  }

  #komentari-container {
    position: relative;
    width: 100%;
    height: 100%;
  }


  #komentari-header {
    position: relative;
    left: 1%;
    top: 1%;
    width: 99%;
    height: 3.5%;
  }

  #search-container {
    position: relative;
    width: 60%;
    height: 100%;
    display: flex;
  }

  #searchbox {
    display: flex;
    font-size: 20px;
    border-radius: 5px;
    border: 1px solid darkgrey;
    width: 100%;
    text-indent: 10%;
  }

  #all-komentar {
    position: absolute;
    top: 5%;
    left: 1%;
    width: 99%;
    height: 100%;
  }

  .new-komentar-container {
    text-align: left;
    font-size: 16px;
    background-color: whitesmoke;
    height: 10%;
    width: 100%;
    border: none;
    resize: vertical;
    font-family: "Trebuchet MS";
  }

  #dodajNovi {
    width: 3vw;
    position: absolute;
    right: 0;
    cursor: pointer;
    font-weight: bold;
    color: burlywood;
    font-size: 4vh;
    top: 0;
    user-select: none;
  }

  #dodajNovi:hover {
    opacity: 0.5;
  }

  #added-komentar {
    position: relative;
    top: 5vh;
  }

</style>