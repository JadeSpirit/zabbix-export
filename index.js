var Zabbix = require ('zabbix');
var xlsx = require ('node-xlsx').default;
var json2array = require("json2array");
var jsonexport = require("jsonexport");
var writeFileSync = require ('jest-serializer');
var fs = require ('fs');
const { toXML } = require('jstoxml');
var convert = require ('xml-js');
var apiversion = "0";

var zabbix = new Zabbix('http://10.82.252.68/api_jsonrpc.php','Admin', 'JetZabbixAdmin');

zabbix.getApiVersion(function (err, resp, body) {
  if (!err) {
    console.log("Unauthenticated API version request, and the version is: " + body.result)
    var apiversion = (body.result);
  }
});
zabbix.login(function (err, resp, body) {
  if (!err) {
    console.log("Authenticated! AuthID is: " + zabbix.authid);
  }

  zabbix.call("template.get",
    {
    "search" : {"host" : "JET Linux"},
    "output" : "extend",
    "selectItems" : "extend"
    }
    ,function (err, resp, body) {
      if (!err) {
        rawdata = (body.result[0]);
        rawdata2 = JSON.stringify(rawdata);
        fs.writeFile('out.json', rawdata2, function(err) {
          if (err) console.log(err);
        });
        data = toXML(rawdata);
        var output =
        '<?xml version="1.0" encoding="UTF-8"?>'+
        '<zabbix_export>'+
        '<version>'+apiversion+'</version>'+
        '<groups>'+
        '</groups>'+
        data +
        '</zabbix_export>';
        fs.writeFile('out.xml', output, function(err) {
        if (err) console.log(err);
        });
      }
    });
  });
