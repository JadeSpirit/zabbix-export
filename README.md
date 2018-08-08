# zabbix-export

Script for exporting and importing zabbix items.

Usage.
Downloading template:
node download.js --hostname=Your zabbix hostname --username=Zabbix admin username --password=Zabbix admin password --template="Template to download" --format="xml|json"
Expected result: exported template  in form of "template".xml or "template".json files in root folder.
