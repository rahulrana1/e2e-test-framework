set +e
./go storeAdvisorCookies
npx testcafe -c 7 chrome:headless ./tests/nexthub/*.spec.js --test-meta sequence=1 -q -s takeOnFails=true --reporter allure,junit:./reports/junit_seq1.xml,spec --disable-multiple-windows --video reports/videos --video-options singleFile=false,failedOnly=true,pathPattern=${QUARANTINE_ATTEMPT}_${TEST}_${DATE}_${TIME}.mp4
npx testcafe -c 7 chrome:headless ./tests/nexthub/*.spec.js --test-meta sequence=2 -q -s takeOnFails=true --reporter allure,junit:./reports/junit_seq2.xml,spec --disable-multiple-windows --video reports/videos --video-options singleFile=false,failedOnly=true,pathPattern=${QUARANTINE_ATTEMPT}_${TEST}_${DATE}_${TIME}.mp4
npx testcafe -c 7 chrome:headless ./tests/nexthub/*.spec.js --test-meta sequence=3 -q -s takeOnFails=true --reporter allure,junit:./reports/junit_seq3.xml,spec --disable-multiple-windows --video reports/videos --video-options singleFile=false,failedOnly=true,pathPattern=${QUARANTINE_ATTEMPT}_${TEST}_${DATE}_${TIME}.mp4
npm run write:envfile
set -e