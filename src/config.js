if (process.env.NODE_ENV === "DEVELOPMENT") {
  const configuration = {
    apiURL: "http://206.189.128.57:7080",
    masterRegisterEndpoint: "https://master.uhcit.in/graphql",
    downloadEndPoint: "https://206.189.139.120/graphql"
  };
  module.exports = configuration;
} else {
  module.exports = {
    apiURL: "https://api-dev.uhcitp.in",
    masterRegisterEndpoint: "https://mr.subscriblee.com/graphql",
    downloadEndPoint: "https://206.189.139.120/graphql"

  };
}
