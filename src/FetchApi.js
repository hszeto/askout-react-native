const config = require('./Config.js');

export function fetchServer(token){
  const askoutApiEndpoint = config.env.development.android.askoutApiEndpoint;

  const settings = {
    headers: {
      "authorization": token
    }
  };

  const p = new Promise((resolve, reject) => {
    fetch(askoutApiEndpoint, settings).then((res) => {
      res.json().then((json) => {
        if (json.error) reject(json);
        resolve(json);
      }).catch((err)=>{
        reject(err);
      })
    });
  });

  return p;
};