var argv = require('yargs').argv;
var Zabbix = require('zabbix');
var xlsx = require('node-xlsx').default;
var json2array = require("json2array");
var jsonexport = require("jsonexport");
var writeFileSync = require('jest-serializer');
var fs = require('fs');
const { toXML } = require('jstoxml');
var convert = require('xml-js');

var apiversion = "0";
var gettemplate = {
  "search": { "host": argv.template },
  "output": "extend",
  "selectGroups": "extend",
  "selectItems": "extend",
  "selectMacros": "extend"
}
var hostname = argv.hostname
if (hostname = "undefined") {
  hostname = '10.82.252.68'
};
console.log(zabbix);
console.log(gettemplate);
var zabbix = new Zabbix('http://' + hostname + '/api_jsonrpc.php', 'Admin', 'JetZabbixAdmin');
zabbix.getApiVersion(function (err, resp, version) {
  console.log("Zabbix api version is " + version.result);
  apiversion = (version.result);
});
zabbix.login(function (err, resp, body) {
  if (!err) {
    console.log("Authenticated! AuthID is: " + zabbix.authid);
  }
  zabbix.call("template.get", gettemplate, function (err, resp, body) {
    if (!err) {
      rawdata = (body.result[0]);
      rawdata2 = JSON.stringify(rawdata);
      fs.writeFile('out.json', rawdata2, function (err) {
        if (err) console.log(err);
      });
      data = toXML(rawdata);
      var output =
        '<?xml version="1.0" encoding="UTF-8"?>' +
        '<zabbix_export>' +
        '<version>' + apiversion + '</version>' +
        data +
        '</zabbix_export>';
      fs.writeFile('out.xml', output, function (err) {
        if (err) console.log(err);
      });
    }
    if (err) {
      console.log(err);
    }
  });
});
