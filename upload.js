var argv = require('yargs')
  .usage('Usage: $0 --template="" --hostname= --username= --password=')
  .demandOption(['template','hostname','username','password'])
  .argv;
var Zabbix = require('zabbix');
var fs = require('fs');
const { toXML } = require('jstoxml');

var templatename = "JET TEST 02";
var groupid = "1";

var apiversion = "0";
var sendtemplate = {
  "host": templatename,
  "groups": {
    "groupid": groupid
  }
}

var hostname = argv.hostname
if (hostname = "undefined") {
  hostname = '10.82.252.68'
};

var username = argv.username
if (username = "undefined") {
  username = "Admin"
  console.log ("Using default username")
}

var password = argv.password
if (password = "undefined") {
  password = "Zabbix"
  console.log ("Using default password")
}

var zabbix = new Zabbix('http://' + hostname + '/api_jsonrpc.php', username, password);
console.log(zabbix);

zabbix.getApiVersion(function (err, resp, version) {
  console.log("Zabbix api version is " + version.result);
  apiversion = (version.result);
});

zabbix.login(function (err, resp, body) {
  if (!err) {
    console.log("Authenticated! AuthID is: " + zabbix.authid);
  }
  zabbix.call("template.create", sendtemplate, function (err, resp, body) {
    if (err) {
      console.log(err);
    }
  })
});
