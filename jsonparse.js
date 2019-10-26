const fs = require('fs');
console.log("testing111")
hosts = JSON.parse(fs.readFileSync("hosts.json", 'utf8'));
console.log(hosts);
for (let index = 0; index < hosts.length; index++) {
    const host = hosts[index];
    console.log(host.ip)
    console.log(host.host)
  }
