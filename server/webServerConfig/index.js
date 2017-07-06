let configureServer;
if(process.env.NODE_ENV === 'production'){
  configureServer = () => {};
}else{
  configureServer = require('./dev').default;
}
export default configureServer;