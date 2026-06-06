#!/usr/bin/env bash
# #region agent log
LOG="/Users/vesas/Desktop/vesa-lab/.cursor/debug-cf62bc.log"
ts=$(date +%s000)
providers=$(grep -E '^providers' nixpacks.toml 2>/dev/null || echo 'providers=unknown')
node_v=$(node -v 2>/dev/null || echo 'missing')
npm_v=$(npm -v 2>/dev/null || echo 'missing')
php_v=$(php -v 2>/dev/null | head -1 || echo 'missing')
nix_node="${NIXPACKS_NODE_VERSION:-unset}"
line=$(printf '{"sessionId":"cf62bc","runId":"%s","hypothesisId":"A","location":"scripts/nixpacks-build-debug.sh","message":"nixpacks install phase reached","data":{"providers":"%s","node":"%s","npm":"%s","php":"%s","NIXPACKS_NODE_VERSION":"%s"},"timestamp":%s}' \
  "${DEBUG_RUN_ID:-post-fix}" "$providers" "$node_v" "$npm_v" "$php_v" "$nix_node" "$ts")
echo "AGENT_DEBUG_NIXPACKS ${line}"
if [ -d "$(dirname "$LOG")" ]; then
  echo "$line" >> "$LOG"
fi
# #endregion
