var argv = require('yargs')
  .usage('Usage: $0 --template="" --hostname= --username= --password=')
  .demandOption(['template','hostname','username','password'])
  .argv;
var Zabbix = require('zabbix');
var xlsx = require('node-xlsx').default;
var json2array = require("json2array");
var jsonexport = require("jsonexport");
var writeFileSync = require('jest-serializer');
var fs = require('fs');
const { toXML } = require('jstoxml');
var convert = require('xml-js');

var apiversion = "0";

var gettemplatejson = {
  "params": {
    "options": {
      "templates": [
        argv.template
      ]
     },
  "format": "json"
},
};
var gettemplatexml = {
  "params": {
    "options": {
      "templates": [
        argv.template
      ]
     },
  "format": "xml"
},
};

var zabbix = new Zabbix('http://' + argv.hostname + '/api_jsonrpc.php', argv.username, argv.password);

console.log("Auth string is " + JSON.stringify(zabbix));
console.log("Aquiring template using " + JSON.stringify(gettemplatexml) + JSON.stringify(gettemplatejson));

zabbix.getApiVersion(function (err, resp, version) {
  console.log("Zabbix api version is " + version.result);
  apiversion = (version.result);
});
zabbix.login(function (err, resp, body) {
  if (!err) {
    console.log("Authenticated! AuthID is: " + zabbix.authid);
  }
  zabbix.call("configuration.export", gettemplatejson, function (err, resp, body) {
    if (!err) {
      rawdata = (body.result[0]);
      rawdata2 = JSON.stringify(rawdata);
      fs.writeFile(template + '.json', rawdata2, function (err) {
        if (err) console.log(err);
      });
    }
    if (err) {
      console.log(err);
    }
  });
  zabbix.call("configuration.export", gettemplatexml, function (err, resp, body) {
    if (!err) {
      rawdata = (body.result[0]);
      data = toXML(rawdata);
      fs.writeFile(template +'.xml', data, function (err) {
        if (err) console.log(err);
      });
    }
    if (err) {
      console.log(err);
    }
  });
});
