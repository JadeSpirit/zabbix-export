const argv = require('yargs')
  .usage('Usage: $0 --mode=(GetApi, GetTemplate, SendTemplate, HostCreate) --zbxhost= --zbxuser= --zbxpass= --template="(file name or template name on Zabbix)" --format=("xml", "json") --hostdata="(path to file with host data)"')
  .demandOption(['mode','zbxhost','zbxuser','zbxpass'])
  .argv;
const Zabbix =require('zabbix');
const Zabbix_promise =require("zabbix-promise");
const fs = require('fs');

const Mode = argv.mode;
let apiversion = undefined;
const template = argv.template;
const format = argv.format;
const hostdata = argv.hostdata;

const zabbix = new Zabbix(`http://${argv.zbxhost}/api_jsonrpc.php`, argv.zbxhost, argv.zbxpass);
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
  }
  if (err) {
    console.log(err);
  }
};
}

if (Mode == "CreateHost") {
  (async () => {
  const zabbixp = new Zabbix_promise(`http://${argv.zbxhost}/api_jsonrpc.php`, argv.zbxhost, argv.zbxpass);
  await zabbixp.login();
  const host = JSON.parse(fs.readFileSync('file', 'utf8'));
  for (let index = 0; index < hosts; index++) {
    const host = host[index];
    try {
      await zabbixp.request("host.create", {
        host: host.ip,
        name: host.host,
        interfaces: [
          {
            type: 1,
            main: 1,
            useip: 1,
            ip: host.ip,
            dns: host.host,
            port: "10050"
          },
          {
            type: 2,
            main: 1,
            useip: 1,
            ip: host.ip,
            dns: host.host,
            port: "161"
          },

        ],
        "inventory_mode": 0,
        "inventory": {
            "asset_tag": host.host,
        }
        groups: [
          {
            groupid: host.groups
          }
        ]
      });
    } catch (error) {}
  }
  if (error) {
      console.log (err);
    }
})
}
