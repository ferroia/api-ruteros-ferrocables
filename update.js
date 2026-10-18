const fs = require('fs');
let content = fs.readFileSync('index.js', 'utf8');
if (!content.includes("express.static('public')")) {
  content = content.replace("app.use(express.json());", "app.use(express.json());\napp.use(express.static('public'));");
  fs.writeFileSync('index.js', content);
  console.log('index.js actualizado correctamente');
}
