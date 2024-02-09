const lunr = require('lunr');
const path = require('path');
const fs = require('fs');
const directoryPath = path.join(__dirname, '../competitions');
var files = fs.readdirSync(directoryPath)

let competitions = files.flatMap((file) => {
  return JSON.parse(fs.readFileSync("../competitions/" + file))
})
var idx = lunr(function () {
  this.ref('id')
  this.field('equipes')
  competitions.forEach((doc) => {
    this.add(doc)
  })
});

fs.writeFileSync("./app/index.json", JSON.stringify(idx))
