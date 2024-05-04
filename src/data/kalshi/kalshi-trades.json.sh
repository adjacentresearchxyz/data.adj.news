response=$(curl -s -o /dev/null -w "%{http_code}" "https://trading-api.kalshi.com/v1/trades/?trades_date=$(date +'%Y-%m-%d')")

if [ $response -eq 200 ]; then
    curl "https://trading-api.kalshi.com/v1/trades/?trades_date=$(date +'%Y-%m-%d')" \
      -H 'Connection: keep-alive' \
      -A 'Chrome/123.0.0.0' \
      --compressed
else
    curl "https://trading-api.kalshi.com/v1/trades/?trades_date=$(date -d yesterday +'%Y-%m-%d')" \
      -H 'Connection: keep-alive' \
      -A 'Chrome/123.0.0.0' \
      --compressed
fi
