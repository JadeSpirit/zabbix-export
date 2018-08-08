var argv = require('yargs').argv;
var Zabbix = require('zabbix');
var xlsx = require('node-xlsx').default;
var json2array = require("json2array");
var jsonexport = require("jsonexport");
var writeFileSync = require('jest-serializer');
var fs = require('fs');
const { toXML } = require('jstoxml');
var convert = require('xml-js');
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

var zabbix = new Zabbix('http://' + hostname + '/api_jsonrpc.php', 'Admin', 'JetZabbixAdmin');
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
