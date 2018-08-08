var argv = require('yargs')
  .usage('Usage: $0 --template="" --hostname= --username= --password= --format=("xml", "json")')
  .demandOption(['template','hostname','username','password','format'])
  .argv;
var Zabbix = require('zabbix');
var fs = require('fs');
const { toXML } = require('jstoxml');

var apiversion = "0";

var template = argv.template;
var format = argv.format;

var gettemplate = {
  "output": "extend",
  "filter": {
    "host": [
      template
    ]
  },
};

var zabbix = new Zabbix('http://' + argv.hostname + '/api_jsonrpc.php', argv.username, argv.password);

console.log("Auth string is " + JSON.stringify(zabbix));

zabbix.getApiVersion(function (err, resp, version) {
  if (!err) {
  console.log("Zabbix api version is " + version.result);
  apiversion = (version.result);
}
if (err) {
  console.log (err);
}
});
zabbix.login(function (err, resp, body) {
  if (!err) {
    console.log("Authenticated! AuthID is: " + zabbix.authid);
  }

  zabbix.call("template.get", gettemplate, function (err, resp, body) {
    if (!err) {
      console.log (body.result[0]);
    }
    if (err) {
      console.log (err);
    }
});

  var getdata = {
    "options" : {
      "templates" : [
        "10170"
      ]
    },
    "format": format
  };

  console.log("Aquiring template using " + JSON.stringify(gettemplate) + JSON.stringify(getdata));

  zabbix.call("configuration.export", getdata, function (err, resp, body) {
    if (!err) {
      console.log (body.result);
      data = (body.result);
      fs.writeFile(template + '.'+ format, data, function (err) {
        if (err) console.log(err);
      });
    }
    if (err) {
      console.log(err);
    }
  });
});
