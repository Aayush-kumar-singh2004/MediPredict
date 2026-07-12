#!/bin/sh
# Starts the persistent Python prediction server in the background,
# waits until it's actually ready (not just "started"), then starts
# the Node server in the foreground (so Render's process manager
# tracks Node as the main process).

set -e

echo "Starting Python prediction server..."
python "ML/Lung Cancer Prediction/server.py" &
PY_PID=$!

# Wait for the Flask server's /health endpoint to respond before
# letting Node start accepting traffic that depends on it.
echo "Waiting for prediction server to be ready..."
for i in $(seq 1 30); do
  if curl -sf http://127.0.0.1:6000/health > /dev/null 2>&1; then
    echo "Prediction server is ready."
    break
  fi
  sleep 1
done

echo "Starting Node server..."
node index.js

# If node exits, also kill the python server so the container fully stops.
kill $PY_PID 2>/dev/null || true