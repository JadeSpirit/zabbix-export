# zabbix-export

Script for exporting and importing zabbix items.

Usage.
Downloading template:
node download.js --hostname=Your zabbix hostname --username=Zabbix admin username --password=Zabbix admin password --template="Template to download" --format="xml|json"
Expected result: exported template  in form of "template".xml or "template".json files in root folder.

XML is supported for importing via zabbix web interface.
JSON is required for future import via upload.js or for other needs.

Uploading template:
node upload.js --file="file to upload" --format="xml|json" --hostname=Your zabbix hostname --username=Zabbix admin username --password=Zabbix admin password
Expected result: imported template from xml/json file. Default rules: create missing, update existing, delete missing from template.


TODO:
Create methods and index.js

Contributions and propositions are welcome.
