set +e
./go storeAdvisorCookies
./go dataSetup_visualTests
npx backstop test --config=visualTest/config/backstop_config.js
set -e