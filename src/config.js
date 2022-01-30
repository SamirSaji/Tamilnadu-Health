if (process.env.NODE_ENV === "DEVELOPMENT") {
  const configuration = {
    apiURL: "",
    masterRegisterEndpoint: "",
    downloadEndPoint: ""
  };
  module.exports = configuration;
} else {
  module.exports = {
    apiURL: "",
    masterRegisterEndpoint: "",
    downloadEndPoint: ""

  };
}
