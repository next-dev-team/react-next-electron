#!/bin/bash

MAX_RETRIES=5
RETRY_DELAY=2
retry_count=0

cleanup() {
  rm -f output.log
  exit
}

trap cleanup SIGINT

while [ $retry_count -le $MAX_RETRIES ]; do
  echo "Attempt $((retry_count + 1)) of $((MAX_RETRIES + 1))..."

  # Run command with real-time output and logging
  yarn dev 2>&1 | tee output.log
  exit_code=${PIPESTATUS[0]}

  # Check results
  if [ $exit_code -eq 0 ]; then
    echo "Command succeeded!"
    cleanup
  else
    if grep -q "tailwindcss generate failed after 5 seconds" output.log; then
      echo "TailwindCSS timeout detected. Retrying in ${RETRY_DELAY}s..."
      ((retry_count++))
      sleep $RETRY_DELAY
    else
      echo "Command failed with unexpected error. Last output:"
      cat output.log
      cleanup
    fi
  fi
done

echo "Max retries reached. Please check your Tailwind configuration."
cleanup
