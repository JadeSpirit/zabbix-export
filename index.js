var Zabbix = require ('zabbix');
var xlsx = require ('node-xlsx').default;
var json2array = require("json2array");
var jsonexport = require("jsonexport");
var writeFileSync = require ('jest-serializer');
var fs = require ('fs');

var zabbix = new Zabbix('http://10.82.252.68/api_jsonrpc.php','Admin', 'JetZabbixAdmin');

zabbix.getApiVersion(function (err, resp, body) {
  if (!err) {
    console.log("Unauthenticated API version request, and the version is: " + body.result)
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
        var data = (body.result[0]);
        jsonexport(data,function(err, csv){
          if(err) return console.log(err);
          console.log("Writing current template to out.csv");
          fs.writeFile('out.csv', csv, function(err) {
          if (err) console.log(err);
        })
        });
      }
    });
  });
