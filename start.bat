@echo off
title Realm Code Generator - By MrDiamond64 ^| Total Attempts: 0
if not exist node_modules\ cmd /c npm i
echo {}>invalidtokens.json
node main.js