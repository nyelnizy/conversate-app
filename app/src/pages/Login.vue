<template>
    <q-page class="flex flex-center">
      <div class="row full-width justify-center">
        <div class="col-5">
          <div class="text-center">
            <strong>Login</strong>
          </div>
          <q-form @submit="login" class="q-gutter-md q-mt-md">
            <div class="">
              <q-input v-model="user.email" type="email" label="Email" filled />
            </div>
            <div class="">
              <q-input v-model="user.password" type="password" label="Password" filled />
            </div>
           <div style="display:flex;justify-content:center;">
            <q-btn
              color="primary"
              @click="$router.push('/register')"
              label="Register"
              class="float-left mr-md"
              outline
            />
            <q-btn
              color="primary"
              icon="check"
              label="Login"
              type="submit"
              class="float-right"
            />
           </div>
          </q-form>
        </div>
      </div>
    </q-page>
  </template>
  
  <script>
  import { defineComponent } from "vue";
  export default defineComponent({
    name: "Register",
    data() {
      return {
        user:{
             email:"",
             password:"",
        },
      };
    },

    methods: {
      login() {
        this.$q.loading.show();
        window.cs.converse("login", (res) => {
            this.$q.loading.hide();
            this.$q.notify({ message: "Success", type: "positive" });
            localStorage.setItem("token", res.data)
            setTimeout(()=>{
                this.$router.push("/")
            },300)
          },(err) => {
            this.$q.loading.hide();
            this.$q.notify({ message: "Failed", type: "negative" });
          },this.user);
      },
    },
  });
  </script>
  