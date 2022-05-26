const biscoint = require("./biscoint");
biscoint.meta()
    .then(data => console.log(JSON.stringify(data, null, 2)))
    .catch(err => console.error(err));