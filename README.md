# zabbix-export

Universal script for exporting and importing zabbix items.

Based on https://github.com/pawmint/zabbix.js


Usage:

node index.js (options).

Or download pre-compiled zabbix-export.exe and use it from windows console.


--mode=(GetApi, GetTemplate, SendTemplate) - work mode selection. Mandatory.

 -GetApi returns Zabbix api version.

 -GetTemplate saves selected template to XML or JSON file in working dir.

 -SendTemplate uploads template file to zabbix server.

 -CreateHost creates hosts from file, for example hosts.json (batch)


--zbxhost=(zabbix host name or ip address). Mandatory.


--zbxuser=(zabbix username). Must have admin rights to do upload and download. Mandatory.


--zbxpass=(zabbix password). Mandatory.


--template=(template name on server or file name). Mandatory for upload and download. Must use file name for download and template name for upload.


--format=(JSON or XML). Mandatory for upload and download. XML is ready for uploading via web interface.

--hostpath=(path_to_hosts_file). Mandatory for creating hosts. File must be json, example attached.

Other modes will be added later:

 -export parsed template to XLS or CSV for analisys.

 -batch export and import.

 -uploading and downloading items and other elements.

 -etc.


Contributions and propositions are welcome.
