@echo off
title 3D Room Design Viewer
echo Starting 3D Architectural Floor Plan Viewer...
start http://localhost:5173
npx vite preview --port 5173 --host
pause
