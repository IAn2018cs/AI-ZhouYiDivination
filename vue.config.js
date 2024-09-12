module.exports = {
    devServer: {
      proxy: {
        '/divinate': {
          target: 'http://localhost:3000',
          changeOrigin: true
        },
        '/divinate-test': {
          target: 'http://localhost:3000',
          changeOrigin: true
        }
      }
    }
  }
  