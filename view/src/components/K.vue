<template>
  <div class="k">
    <div v-for="k in komentar" :key="k.id">
      <div id="preview">
        <div id="preview-text-container" @click="clk">
          <div id="del">
            <div @click="del(k)">
              x
            </div>
          </div>
          <p id="preview-text">
            {{ (k.text).length > 20? (k.text).slice(0,20) + "..." : k.text }}
          </p>
          <div id="created-on">
            {{ k.date.slice(0, 19).replace('T', ' ').split(" ")[0].split("-")[0] === new Date().toISOString().slice(0, 19).replace('T', ' ').split(" ")[0].split("-")[0]
            && k.date.slice(0, 19).replace('T', ' ').split(" ")[0].split("-")[1] === new Date().toISOString().slice(0, 19).replace('T', ' ').split(" ")[0].split("-")[1]
            && parseInt(k.date.slice(0, 19).replace('T', ' ').split(" ")[0].split("-")[2]) + 1 === parseInt(new Date().toISOString().slice(0, 19).replace('T', ' ').split(" ")[0].split("-")[2])
              ?
              "Today":(parseInt(k.date.slice(0,19).replace('T', ' ').split(" ")[0].split("-")[2]) + 1) + "/" + k.date.slice(0,19).replace('T', ' ').split(" ")[0].split("-")[1] +  "/" + k.date.slice(0,19).replace('T', ' ').split(" ")[0].split("-")[0]
            }}
          </div>
        </div>
        <div id="komentar-text-container" style="display: none">
          <textarea id="komentar-text" @keyup="update($event.target.value, k)">
            {{ k.text }}
          </textarea>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

  import {mapState} from "vuex";
  import router from "@/router";

  export default {
  name: "K",
    data() {
      return {
        array: [],
      }
    },
    props: {
      komentar:{
        type:Array
      },
    },
    computed: {
      ...mapState(['userid']),
      iduser: function () {
        return this.userid;
      },
    },
    methods: {
      clk: function (e) {
        let cont = e.target;
        let txt = cont.parentElement.parentElement.querySelector("#komentar-text-container");
        if (txt === null)
          return;
        let day = cont.parentElement.querySelector("#created-on");
        if (txt.style.display === "none") {
          txt.style.display = "block";
          cont.style.fontWeight = "bold";
          cont.parentElement.style.backgroundColor = "burlywood";
        } else {
          txt.style.display = "none";
          cont.style.fontWeight = "normal";
          cont.parentElement.style.backgroundColor = "white";
        }
        day.style.fontWeight = "bold";
      },
      del: function (k) {
        if (k.id === -1) {
          return;
        }
        fetch('http://localhost:3000/komentar/delete', {
          method: 'post',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({idkomentar: k.id, iduser: this.iduser})
        }).then((response) => {
          if (!response.ok)
            throw response;
          return response.json();
        }).then(({ jsonData }) => {
          this.array = [];
          for(let i = 0; i < jsonData.length; i++) {
              this.array.push(jsonData[i]);
          }
          this.$emit('deleteUpdate', this.array);
        }).catch((error) => {
          if (typeof error.text === 'function')
            error.text().then((errorMessage) => {
              alert(errorMessage);
            });
          else
            alert(error);
        });
      },
      update: function (txt, k) {
        if (k.id === -1) {
          return;
        }
        console.log(k.id)
        fetch('http://localhost:3000/komentar/update', {
          method: 'post',
              headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({text: txt, idkomentar: k.id, iduser: this.iduser})
        }).then((response) => {
          if (!response.ok)
            throw response;
          return response.json();
        }).then(({ jsonData }) => {
          this.array = [];
          for(let i = 0; i < jsonData.length; i++) {
              this.array.push(jsonData[i]);
          }
          this.$emit('deleteUpdate', this.array);
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
  }
</script>

<style scoped>

  .k {
    height: auto;
  }
  #preview {
    height: auto;
    border-bottom: 1px solid burlywood;
  }

  #preview-text-container {
    height: 100%;
    display: flex;
    width: 100%;
    flex-direction: column;
  }

  #preview-text {
    position: relative;
    text-align: left;
    font-family: "Trebuchet MS";
    font-size: 18px;
    left: 2%;
    user-select: none;
    height: 6vh;
    margin: 0;
    margin-top: 2%;
  }

  #komentar-text-container {
    position: relative;
    width: 100%;
  }

  #komentar-text {
    border: none;
    background-color: whitesmoke;
    resize: vertical;
    width: 99.8%;
    height: 15vh;
    font-family: "Trebuchet MS";
  }

  #created-on {
    position: relative;
    display: flex;
    justify-content: end;
    margin-right: 2%;
    user-select: none;
    color: #555555;
    font-weight: bold;
    padding-bottom: 1%;
  }

  #del {
    display: flex;
    justify-content: flex-end;
    padding-right: 2%;
    margin-bottom: -4%;
    font-weight: bold;
    font-family: cursive;
    z-index: 1000;
    user-select: none;
    color: #555555;
  }

  #del>div:hover {
    opacity: 0.5;
    cursor: pointer;
  }

</style>