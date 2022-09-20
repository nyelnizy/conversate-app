<template>
    <q-page class="flex flex-center">
      <div class="row full-width justify-center">
        <div class="col-5">
          <div class="text-center">
            <strong>Register Form</strong>
          </div>
          <q-form @submit="register" class="q-gutter-md q-mt-md">
            <div class="">
              <q-input v-model="user.name" type="text" label="Name" filled />
            </div>  
            <div class="">
              <q-input v-model="user.email" type="email" label="Email" filled />
            </div>
            <div class="">
              <q-input v-model="user.password" type="password" label="Password" filled />
            </div>
            <div class="">
              <q-input v-model="user.password_confirmation" type="password" label="Confirm Password" filled />
            </div>
            <div style="display:flex;justify-content:center;">
            <q-btn
              color="primary"
              @click="$router.push('/login')"
              label="Login"
              class="float-left mr-md"
              outline
            />
            <q-btn
              color="primary"
              icon="check"
              label="Register"
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
             name:"",
             email:"",
             password:"",
             password_confirmation:"",
        },
      };
    },

    methods: {
      register() {
        this.$q.loading.show();
        window.cs.converse("register", (res) => {
            console.log(res.data);
            this.$q.loading.hide();
            this.$q.notify({ message: "Registered", type: "positive" });
            this.$router.push("/login")
          },(err) => {
            this.$q.loading.hide();
            this.$q.notify({ message: "Failed", type: "negative" });
          },this.user);
      },
    },
  });
  </script>
  