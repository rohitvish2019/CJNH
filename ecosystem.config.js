module.exports = {
  apps: [
    {
      name: "hospital-app",
      script: "hospital.js",
      args: "",
      env: {
        PORT: "4000",
        NODE_ENV: "production"
      }
    }
  ]
}
