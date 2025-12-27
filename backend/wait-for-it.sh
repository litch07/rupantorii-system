#!/usr/bin/env sh
set -e

if [ $# -lt 1 ]; then
  echo "Usage: wait-for-it.sh host:port -- command"
  exit 1
fi

HOSTPORT="$1"
shift

if [ "$1" = "--" ]; then
  shift
fi

HOST=$(echo "$HOSTPORT" | cut -d: -f1)
PORT=$(echo "$HOSTPORT" | cut -d: -f2)

node -e "const net=require('net');const host=process.argv[1];const port=process.argv[2];const timeoutMs=30000;const start=Date.now();const wait=()=>{const socket=net.connect({host,port});socket.on('connect',()=>{socket.end();process.exit(0);});socket.on('error',()=>{if(Date.now()-start>timeoutMs){console.error('Timeout waiting for '+host+':'+port);process.exit(1);}setTimeout(wait,1000);});};wait();" "$HOST" "$PORT"

exec "$@"
