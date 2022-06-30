<template>
  <div class="container">
    <table class="table">
      <thead>
      <tr>
        <th scope="col">#</th>
        <th scope="col">Name</th>
        <th scope="col">Email</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="userDetail in users">
        <td>{{ userDetail.id }}</td>
        <td>{{ userDetail.name }}</td>
        <td>{{ userDetail.email }}</td>
      </tr>
      </tbody>
    </table>

    <div class="form">
      <div class="form-group">
        <label for="">Name</label>
        <input type="text" class="form-control" v-model="formData.name">
      </div>

      <div class="form-group">
        <label for="">Email</label>
        <input type="email" class="form-control" v-model="formData.email">
      </div>

      <div class="form-group">
        <label for="">Password</label>
        <input type="password" class="form-control" v-model="formData.password">
      </div>
    </div>
    <button class="btn btn-success" @click="createUser()">Success</button>
  </div>
</template>

<script>
import gql from 'graphql-tag'

const ALL_USER = gql`
  query ALL_USER {
    user {
      data {
        id
        name
        email
      }
    }
  }
`;

const CREATE_USER = gql`
  mutation(
    $name: String!
    $email: String!
    $password: String!
  ) {
    createUser(
      name: $name,
      email: $email,
      password: $password
    ) {
      id
      name
      email
    }
  }
`;

export default {
  name: 'UserIndex',
  apollo: {
    user: {
      query: ALL_USER
    }
  },

  data() {
    return {
      users: null,
      formData: {
        name: null,
        email: null,
        password: null
      }
    }
  },

  mounted() {
    this.getListUser();
  },

  methods: {
    async getListUser() {
      // const client = this.apolloProvider.defaultClient;

      const res = await this.$apollo.query({
        query: ALL_USER,
      })
      console.log(res.data);
      this.users = res.data.user.data;
    },

    createUser() {
      console.log(this.formData);
      this.$apollo.mutate({
        mutation: CREATE_USER,
        variables: {
          name: this.formData.name,
          email: this.formData.email,
          password: this.formData.password
        }
      }).then((data) => {
        const user = {
          id: data.data.createUser.id,
          name: data.data.createUser.name,
          email: data.data.createUser.email,
        }
      this.users.push(user);
      })
    }
  }
}
</script>
