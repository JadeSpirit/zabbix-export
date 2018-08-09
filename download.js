var argv = require('yargs')
  .usage('Usage: $0 --template="" --hostname= --username= --password= --format=("xml", "json")')
  .demandOption(['template','hostname','username','password','format'])
  .argv;
var Zabbix = require('zabbix');
var fs = require('fs');
const { toXML } = require('jstoxml');

var apiversion = undefined;
var templateid = undefined;
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
    zabbix.call("template.get", gettemplate, function (err, resp, body) {
      if (!err) {
        var temp = JSON.parse(JSON.stringify(body.result[0]));
        templateid = (temp.templateid);
        console.log ("Template ID is: " + templateid);
        var getdata = {
          "options" : {
            "templates" : [
              templateid
            ]
          },
          "format": format
        };
        console.log("Aquiring template using " + JSON.stringify(gettemplate) + JSON.stringify(getdata));
        zabbix.call("configuration.export", getdata, function (err, resp, body) {
          if (!err) {
            data = (body.result);
            fs.writeFile(template + '.'+ format, data, 'utf8', function (err) {
              if (err) console.log(err);
            });
          }
          if (err) {
            console.log(err);
          }
        });
      }
      if (err) {
        console.log (err)
      }
  })
  }
  if (err) {
    console.log (err);
  }
});
