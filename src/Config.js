module.exports = {
  env: {
    development: {
      android: {
        askoutApiEndpoint: 'http://10.0.2.2:3333/api/auth'
      },
      ios: {
        askoutApiEndpoint: 'http://localhost:3333/api/auth'
      }
    },
    production: {
      // android: {
      //   askoutApiEndpoint: 'http://10.0.2.2:3000'
      // },
      // ios: {
      //   askoutApiEndpoint: 'http://localhost:3000'
      // }
    }
  }
};
