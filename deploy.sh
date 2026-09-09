#!/usr/bin/env bash
set -euo pipefail

# Minimal deploy script
# Usage: ./deploy.sh [git_repo_url] [branch] [port]
# If git_repo_url omitted, uses current directory as app source.

REPO_URL="https://github.com/rohitvish2019/CJNH.git"
BRANCH="${2:-main}"
PORT="${3:-4000}"

APP_DIR="$(pwd)"
CLONE_DIR=""

echo "== Deploy script starting =="

if [ -n "$REPO_URL" ]; then
  # Clone into a temporary directory then copy files into the current working dir
  echo "Cloning $REPO_URL (branch: $BRANCH) into a temporary directory..."
  TMPDIR=$(mktemp -d)
  git clone --branch "$BRANCH" "$REPO_URL" "$TMPDIR"
  echo "Copying repository files into current directory ($APP_DIR)..."
  # Use rsync to copy files while excluding the .git folder to avoid changing git metadata
  if command -v rsync >/dev/null 2>&1; then
    rsync -a --exclude='.git' --delete "$TMPDIR"/ "$APP_DIR"/
  else
    # fallback to basic copy
    (cd "$TMPDIR" && find . -mindepth 1 -maxdepth 1 -print0 | xargs -0 -I{} cp -R {} "$APP_DIR"/)
  fi
  rm -rf "$TMPDIR"
  echo "Repository copied to $APP_DIR"
  APP_DIR="$APP_DIR"
else
  echo "No repo URL provided — using current directory: $APP_DIR"
fi

cd "$APP_DIR"

echo "App directory: $APP_DIR"

# Ensure node and npm exist
if ! command -v node >/dev/null 2>&1; then
  echo "ERROR: node not found. Please install Node.js (>=14) and re-run." >&2
  exit 1
fi
if ! command -v npm >/dev/null 2>&1; then
  echo "ERROR: npm not found. Please install npm and re-run." >&2
  exit 1
fi

echo "Installing npm dependencies..."
if [ -f package-lock.json ] || [ -f npm-shrinkwrap.json ]; then
  npm ci --silent
else
  npm install --silent
fi

# Install pm2 if not present
if ! command -v pm2 >/dev/null 2>&1; then
  echo "pm2 not found — installing globally via npm..."
  npm install -g pm2 --silent
fi

# Determine start script or entrypoint
START_CMD=""
if [ -f package.json ]; then
  start_script=$(node -p "require('./package.json').scripts && require('./package.json').scripts.start || ''" 2>/dev/null || echo "")
  if [ -n "$start_script" ]; then
    START_CMD="npm start"
  fi
fi
if [ -z "$START_CMD" ]; then
  if [ -f hospital.js ]; then
    START_CMD="node hospital.js"
  elif [ -f index.js ]; then
    START_CMD="node index.js"
  else
    echo "Cannot determine app entrypoint. Please ensure package.json start script or hospital.js/index.js exists." >&2
    exit 1
  fi
fi

APP_NAME="hospital-app"

echo "Starting app with pm2 as '$APP_NAME' on port $PORT"

# Stop existing
pm2 delete "$APP_NAME" >/dev/null 2>&1 || true

# Prepare an ecosystem config so pm2 sets the PORT and env correctly
SCRIPT_FIELD=""
ARGS_FIELD=""
if [ "$START_CMD" = "npm start" ]; then
  SCRIPT_FIELD="npm"
  ARGS_FIELD="start"
elif [[ "$START_CMD" == node* ]]; then
  # extract filename after 'node '
  FILE=$(echo "$START_CMD" | awk '{print $2}')
  SCRIPT_FIELD="$FILE"
  ARGS_FIELD=""
else
  # fallback: use the raw command as script (may fail)
  SCRIPT_FIELD="$START_CMD"
  ARGS_FIELD=""
fi

cat > ecosystem.config.js <<EOF
module.exports = {
  apps: [
    {
      name: "$APP_NAME",
      script: "$SCRIPT_FIELD",
      args: "$ARGS_FIELD",
      env: {
        PORT: "$PORT",
        NODE_ENV: "production"
      }
    }
  ]
}
EOF

# Start via pm2 using the generated ecosystem file
pm2 delete "$APP_NAME" >/dev/null 2>&1 || true
pm2 start ecosystem.config.js

echo "Saving pm2 process list and startup script..."
pm2 save

echo "Saving pm2 process list..."
pm2 save

# Attempt to setup pm2 startup script for the current init system.
echo "Configuring pm2 startup (may require root privileges)..."
startup_output=$(pm2 startup 2>&1 || true)
echo "$startup_output"

# Detect a suggested sudo command in the output and show it to the user.
startup_cmd=$(echo "$startup_output" | grep -Eo 'sudo .*' | tail -n1 || true)
if [ -n "$startup_cmd" ]; then
  echo "Suggested startup command:"
  echo "$startup_cmd"
  # Try running without prompting for a password; if sudo -n fails, print instruction.
  if sudo -n true 2>/dev/null; then
    echo "Running startup command with sudo..."
    eval "$startup_cmd"
  else
    echo "To complete pm2 startup, run the following command as root:" >&2
    echo "$startup_cmd" >&2
  fi
fi

if command -v pm2 >/dev/null 2>&1; then
  URL="http://localhost:$PORT"
  echo "== Deployment complete =="
  echo "App running under pm2 as '$APP_NAME'"
  echo "Open in browser: $URL"
else
  echo "pm2 not available after install; please start the app manually: $START_CMD" >&2
  exit 1
fi

exit 0
