response=$(curl -s -o /dev/null -w "%{http_code}" "https://kalshi-public-docs.s3.amazonaws.com/reporting/market_data_$(date +'%Y-%m-%d').json")

if [ $response -eq 200 ]; then
    curl "https://kalshi-public-docs.s3.amazonaws.com/reporting/market_data_$(date +'%Y-%m-%d').json" \
      -H 'Connection: keep-alive' \
      -A 'Chrome/123.0.0.0' \
      --compressed
else
    curl "https://kalshi-public-docs.s3.amazonaws.com/reporting/market_data_$(date -d yesterday +'%Y-%m-%d').json" \
      -H 'Connection: keep-alive' \
      -A 'Chrome/123.0.0.0' \
      --compressed
fi
