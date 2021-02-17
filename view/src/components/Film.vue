<template>
  <div class="film">
    <div class="novi">
      <input class="text-field" v-model="text" type="text" placeholder="Write a new movie..." maxlength="40">

      <div class="dodaj" @click="newF">
        +
      </div>
    </div>
    <div class="all-film">
      <F v-for="f in film" :key="f.id"  :id="f.id" :checked="f.done" :text="f.text" @deleteUpdate="delUpdate" @updateFilm="upFilm"></F>
    </div>
  </div>
</template>

<script>
import F from '@/components/F';
import {mapGetters} from "vuex";
import router from "@/router";
export default {
name: "Film",
  components: {
    F
  },
  data() {
    return {
      text: "",
      film: []
    }
  },
  computed: {
    ...mapGetters({
      iduser: 'id'
    })
  },
  methods: {
    newF: function () {
      if (this.text === "") {
        alert("Fill out this field!");
        return;
      }
      fetch('http://localhost:3000/film/novi', {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({text: this.text, iduser: this.iduser})
      }).then((response) => {
        if (!response.ok)
          throw response;
        return response.json();
      }).then(({ jsonData }) => {
        this.film = [];
        for(let i = 0; i < jsonData.length; i++) {
          this.film.push(jsonData[i]);
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
    delUpdate( id ) {
      let tmp = -1;
      for (let i = 0; i < this.film.length; i++) {
        if (this.film[i].id === id)
          tmp = i;
      }
      this.film.splice(tmp,1);
    },
    upFilm(id, checked) {
      let x = checked? 1: 0;
      for (let i = 0; i < this.film.length; i++) {
        if (this.film[i].id === id){
          this.film[i].done = x;
        }
      }
    },
    initialFetch: function () {
      console.log("initfetch" + this.iduser);
      fetch('http://localhost:3000/film', { method: 'get' }).then((response) => {
        if (!response.ok)
          throw response;
        return response.json()
      }).then(({ jsonData }) => {
        for(let i = 0; i < jsonData.length; i++) {
          console.log(jsonData[i]);
          this.film.push(jsonData[i]);
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
  mounted() {
    this.initialFetch();
  },
  watch: {
    '$route':'initialFetch'
  }
}
</script>

<style scoped>
  .film {
    height: 100vh;
    top: 15vh;
    left: 60%;
    width: 40%;
    background-color: whitesmoke;
    border-top: 2px solid #20391e;
  }

  .novi {
    margin-right: auto;
    margin-left: auto;
    margin-top: 1%;
    width: 70%;
    border: 1px solid burlywood;
    border-radius: 3px;
    height: 7%;
    position: relative;
    background-color: white;
  }

  .text-field {
    position: absolute;
    width: 90%;
    border: none;
    background-color: transparent;
    font-family: "Trebuchet MS";
    font-size: 2vh;
    left: 1%;
    top: 5%;
  }

  .dodaj {
    width: 1.5vw;
    height: 1.5vw;
    position: absolute;
    right: 0;
    font-weight: bold;
    color: #20391e;
    font-size: 3vh;
    bottom: 0;
    user-select: none;
  }

  .dodaj:hover {
    opacity: 0.5;
    cursor: pointer;
  }

  .all-film {
    margin-top: 6vh;
    height: 100%;
  }

</style>