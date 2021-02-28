var jwt = require('jsonwebtoken');

// var data = { username : 'MINH' }
// var token = jwt.sign(data , 'minh123', { expiresIn : 30 });
// console.log(token);
 var token1 = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Ik1JTkgiLCJpYXQiOjE2MDY4ODExMTcsImV4cCI6MTYwNjg4MTE0N30.cUeH_gj0w-UIA8R0EiW3fhK4on_aA-0F_sYvL2EJ6pA'
 var verify = jwt.verify( token1 , 'minh123')
 console.log(verify);