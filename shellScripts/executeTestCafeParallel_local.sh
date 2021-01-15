set +e
npx testcafe -c 1 chrome ./tests/nexthub/dashboardSharing.spec.js --test-meta sequence=1 -s takeOnFails=true --reporter allure,junit:./reports/junit_seq1.xml,spec
npx testcafe -c 1 chrome ./tests/nexthub/dashboardSharing.spec.js --test-meta sequence=2 -s takeOnFails=true --reporter allure,junit:./reports/junit_seq2.xml,spec
# npx testcafe -c 1 chrome ./tests/nexthub/dashboardSharing.spec.js --test-meta sequence=1 -s takeOnFails=true --reporter allure,junit:./reports/junit_seq3.xml,spec
set -e