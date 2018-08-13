const argv = require('yargs')
  .usage('Usage: $0 --mode=(GetApi, GetTemplate, SendTemplate) --hostname= --username= --password= --template="(file name or template name on Zabbix)" --format=("xml", "json")')
  .demandOption(['mode','hostname','username','password'])
  .argv;
const Zabbix =require('zabbix');
const fs = require('fs');

const Mode = argv.mode;
let apiversion = undefined;
const template = argv.template;
const format = argv.format;

const zabbix = new Zabbix(`http://${argv.hostname}/api_jsonrpc.php`, argv.username, argv.password);
console.log(`Auth string is ${JSON.stringify(zabbix)}`);

if (Mode == "GetApi") {
    zabbix.getApiVersion((err, resp, {result}) => {
  if (!err) {
      console.log(`Zabbix api version is ${result}`);
      apiversion = (result);
    }
  if (err) {
  console.log (err);
  }
})
}
if (Mode == "GetTemplate") {
  if (format == undefined) {
    console.log ("Format is mandatory for export and import");
    process.exit(-1);
  };
  let gettemplate = {
    "output": "extend",
    "filter": {
      "host": [
        template
      ]
    },
  };
  zabbix.login((err, resp, body) => {
    if (!err) {
      console.log(`Authenticated! AuthID is: ${zabbix.authid}`);
      zabbix.call("template.get", gettemplate, (err, resp, {result}) => {
        if (!err) {
          let temp = JSON.parse(JSON.stringify(result[0]));
          let templateid = (temp.templateid);
          console.log (`Template ID is: ${templateid}`);
          const getdata = {
            "options" : {
              "templates" : [
                templateid
              ]
            },
            "format": format
          };
          console.log("Aquiring template");
          zabbix.call("configuration.export", getdata, (err, resp, {result}) => {
            if (!err) {
              data = (result);
              fs.writeFile(`${template}.${format}`, data, 'utf8', err => {
                if (err) console.log(err);
            if (!err) {
              console.log ("Exported sucessfully");
            }
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
}
if (Mode == "SendTemplate") {
  if (format == undefined) {
    console.log ("Format is mandatory for export and import");
    process.exit(-1);
  };
  zabbix.login((err, resp, body) => {
    if (!err) {
      console.log(`Authenticated! AuthID is: ${zabbix.authid}`);
      fs.readFile(argv.template, 'utf8', (err, source) => {
        let sendtemplate = {
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
        console.log("Sending template");
        zabbix.call("configuration.import", sendtemplate, (err, resp, {result}) => {
          if (!err) {
            if (result == true) {
              console.log ("Imported sucessfully")
            };
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
}
