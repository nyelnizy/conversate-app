<template>
  <q-page class="flex flex-center">
    <div class="row full-width justify-center">
      <div style="margin-bottom:10px;" class="col-7">
        <div class="text-center">
          <strong>Post</strong>
        </div>
        <q-form @submit="submitPost" class="q-gutter-md q-mt-md">
          <div class="">
            <q-editor v-model="post.body" :definitions="{
              bold: { label: 'Bold', icon: null, tip: '' },
            }" />
          </div>
          <q-btn color="primary" icon="check" label="Post" type="submit" class="float-right" />
        </q-form>
      </div>
      <div class="col-7">
        <div class="row">
          <div style="margin-bottom:10px;" class="col-12" v-for="(p, i) in posts" :key="i">
             <q-card class="my-card">
              <q-card-section>
                <div class="text-h6">{{p.user.name}}</div>
                <div class="text-subtitle2">{{p.created_at}}</div>
              </q-card-section>
              <q-card-section>
                {{p.body}}
              </q-card-section>
             </q-card>
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import { defineComponent } from "vue";
export default defineComponent({
  name: "SubmitWork",
  data() {
    return {
      posts: [],
      post: {
        body: ""
      },
    };
  },
  mounted() {
    this.getPosts();
  },
  methods: {
    submitPost() {
      // this.$q.loading.show();
      window.cs
        .converse("create-post",(res) => {
          this.$q.loading.hide();
          this.$q.notify({ message: "Success", type: "positive" });
          this.posts = [res.data, ...this.posts];
        } ,(err) => {
          this.$q.loading.hide();
          this.$q.notify({ message: "Failed", type: "negative" });
        },this.post)
    },
    getPosts() {
      window.cs
        .converse("get-posts", (res) => {
          this.posts = res.data;
        }, (err) => {
          this.$q.loading.hide();
          this.$q.notify({
            message: "Failed to retrieve work plans",
            type: "negative",
          });
        })
    },
  },
});
</script>
