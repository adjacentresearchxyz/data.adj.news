#!/bin/bash

# @TODO: as we implement our own database then use this run it daily and just get markets from those days
# # Initial curl request
# response=$(curl -s "https://api.manifold.markets/v0/markets?limit=1000" -X GET)
# all_responses=$response

# while true; do
#   # Get the ID of the last market
#   last_id=$(echo $response | jq -r '.[-1].id')

#   # Make the next curl request with the before parameter
#   response=$(curl -s "https://api.manifold.markets/v0/markets?limit=1000&before=$last_id" -X GET)

#   # Check if the response contains less than 1000 markets
#   if [ $(echo $response | jq '. | length') -lt 1000 ]; then
#     all_responses="$all_responses,$response"
#     break
#   fi

#   # Join the new response with the previous ones
#   all_responses="$all_responses,$response"
# done

# # Print all responses
# echo $all_responsesa

curl -s "https://api.manifold.markets/v0/markets?limit=1000" -X GET