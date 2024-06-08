# Get the current hour in UTC
current_hour_utc=$(date -u +'%H')

# If the current hour is less than 8, use the data from two days ago
if [ $current_hour_utc -lt 8 ]; then
    trades_date=$(date -u -d '2 days ago' +'%Y-%m-%d')
else
    trades_date=$(date -u -d '1 day ago' +'%Y-%m-%d')
fi

response=$(curl -s -o /dev/null -w "%{http_code}" "https://trading-api.kalshi.com/v1/trades/?trades_date=$trades_date")

if [ $response -eq 200 ]; then
    curl "https://trading-api.kalshi.com/v1/trades/?trades_date=$trades_date" \
      -H 'Connection: keep-alive' \
      -A 'Chrome/123.0.0.0' \
      --compressed
else
    echo "Data for $trades_date is not available yet."
fi