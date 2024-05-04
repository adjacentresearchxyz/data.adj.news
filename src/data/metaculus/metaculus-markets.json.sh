curl -X POST -H "Content-Type: application/json" \
    -d '{"query":"{ questions(first: 100000 orderBy: FIRST_SEEN_DESC) { edges { node { id title url description options { name probability } qualityIndicators { numForecasts stars } firstSeenStr fetchedStr } } pageInfo { endCursor startCursor } } }"}' \
    https://metaforecast.org/api/graphql