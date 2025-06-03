pid_websersocket=$(pgrep -f "websersocket_d5e8e7f0-f3b4-4ea6-a9d5-a5c455ace606.js")
watch -n 1 ps -p $pid_websersocket -o pid,etime,%cpu,%mem,cmd