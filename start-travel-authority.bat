@echo off
cd /d "C:\Users\keanj\Desktop\travel-order\server"
start cmd /k node server.js

@echo off
cd /d "C:\Users\keanj\Desktop\travel-order\front-end"
start cmd /k npm run dev
