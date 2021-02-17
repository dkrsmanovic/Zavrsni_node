<template>
  <div class="f" :class="{'yes': toggle||checked, 'no': !toggle }">
    <textarea readonly class="text">{{ this.text }}</textarea>
    <div class="delete" @click="del">
      x
    </div>
    <input class="done" type="checkbox" @change="update" v-model="toggle">
  </div>
</template>

<script>
import {mapState} from "vuex";

export default {
name: "F",
  props: {
    text: String,
    id: Number,
    checked: Number
  },
  data() {
    return {
      toggle: false
    }
  },
  computed: {
    ...mapState(['userid']),
    iduser: function () {
      return this.userid;
    }
  },
  methods: {
    del: function () {
      if (this.id === -1) {
        alert("Couldn't fetch from api!");
        return;
      }
      console.log("okk");
      fetch('http://localhost:3000/film/delete', {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({idfilm: this.id, iduser: this.iduser})
      }).then((response) => {
        if (!response.ok)
          throw response;
        return response.json();
      }).then(({ jsonData }) => {
        this.$emit('deleteUpdate', this.id);
      }).catch((error) => {
        if (typeof error.text === 'function')
          error.text().then((errorMessage) => {
            alert(errorMessage);
          });
        else
          alert(error);
      });
    },
    update: function () {
      if (this.id === -1) {
        alert("Couldn't fetch from api!");
        return;
      }
      fetch('http://localhost:3000/film/update', {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({done: this.toggle, idfilm: this.id})
      }).then((response) => {
        if (!response.ok)
          throw response;
        return response.json();
      }).then(({ jsonData }) => {
        let array = [];
        for (let i = 0; i < jsonData.length; i++) {
          array.push(jsonData[i]);
        }
        this.$emit('refreshFilm', this.id, this.toggle);
      }).catch((error) => {
        if (typeof error.text === 'function')
          error.text().then((errorMessage) => {
            alert(errorMessage);
          });
        else
          alert(error);
      });
    }
  },
  mounted() {
    this.toggle = this.checked;
  },
  watch: {
    checked: function () {
      this.toggle = this.checked;
    }
  }
}
</script>

<style scoped>
  .f {
    margin-right: auto;
    margin-left: auto;
    margin-top: 4%;
    width: 70%;
    border:none;
    border-bottom: 1px solid #20391e;
    height: 7%;
    position: relative;
    background-color: transparent;
  }

  .text {
    position: absolute;
    resize: none;
    background-color: transparent;
    color: #20391e;
    width: 70%;
    height: 50%;
    border: none;
    font-size: 2vh;
    font-weight: bold;
    font-family: "Trebuchet MS";
    left: 1%;
    top: 5%;
  }

  .delete {
    font-weight: bold;
    font-family: cursive;
    z-index: 1000;
    user-select: none;
    color: #555555;
    position: absolute;
    bottom: 5%;
    right: 2%;
  }
  .delete:hover {
    cursor: pointer;
    opacity: 0.5;
  }

  .done {
    width: 1.2vh;
    height: 1.2vh;
    position: absolute;
    top: 8%;
    right: 1%;
    z-index: 9999;
    background-color: white;
  }

  .yes {
    opacity: 0.5;
  }
  .no {
    opacity: 1;
  }

  .done:hover {
    cursor: pointer;
    background-color: goldenrod;
  }

</style>