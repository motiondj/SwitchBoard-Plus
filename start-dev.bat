@echo off
echo Starting Switchboard Plus Development Environment...

:: Start Server
start "SB+ Server" cmd /k "cd sb-server && npm run dev"

:: Wait for server to start
timeout /t 5

:: Start Web UI
start "SB+ Web" cmd /k "cd sb-web && npm run dev"

:: Start Client (Optional)
:: start "SB+ Client" cmd /k "cd sb-client && venv\Scripts\activate && python main.py"

echo All services started!
echo Server: http://localhost:8000
echo Web UI: http://localhost:5173
pause