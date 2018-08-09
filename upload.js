var argv = require('yargs')
  .usage('Usage: $0 --file= --hostname= --username= --password= --format=("xml", "json")')
  .demandOption(['file','hostname','username','password','format'])
  .argv;
var Zabbix = require('zabbix');
var fs = require('fs');
const { toXML } = require('jstoxml');

var apiversion = undefined;
var format = argv.format;

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
    fs.readFile(argv.file, 'utf8', function (err, source) {
      var sendtemplate = {
        "format": format,
        "rules": {
          "templates": {
                      "createMissing": "true",
                      "updateExisting": "true"
                  },
          "items": {
                      "createMissing": "true",
                      "updateExisting": "true",
                      "deleteMissing": "true"
                  },
            "triggers": {
                      "createMissing": "true",
                      "updateExisting": "true",
                      "deleteMissing": "true"
                  }
        },
        "source": source
      };
      console.log("Sending template using " + JSON.stringify(sendtemplate));
      zabbix.call("configuration.import", sendtemplate, function (err, resp, body) {
        if (!err) {
          console.log(JSON.stringify(body.result));
        }
        if (err) {
          console.log(err);
        }
      });
  });
}
  if (err) {
    console.log (err);
  }
});
