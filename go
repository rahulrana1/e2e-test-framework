#!/bin/bash

set -eo pipefail

function target_build_docker_image() {
    docker build -t "$IMAGENAME" -f Docker/dockerfile .
}

function target_build_docker_image_local() {
    setEnvVariables
    docker build -t "$IMAGENAME" -f Docker/dockerfile .
}

function target_execute_railsNodejs_tests_docker() {
    set +e
    docker run -i -e ENVIRONMENT -e RAILSNODEJS_CONTAINER_NAME --name "$RAILSNODEJS_CONTAINER_NAME" "$IMAGENAME" npm run test:railsNodejs:parallel
    set -e
}

function target_run_nexthub_data_cleanup_docker() {
    docker run -i -e ENVIRONMENT -e DATACLEANUP_CONTAINER_NAME --name "$DATACLEANUP_CONTAINER_NAME" "$IMAGENAME" npm run data:cleanup
}

function target_execute_testcafe_tests_docker() {
    set +e
    docker run -i -e ENVIRONMENT -e TESTCAFE_CONTAINER_NAME --name "$TESTCAFE_CONTAINER_NAME" "$IMAGENAME" npm run test:chrome:parallel
    set -e
}

function target_execute_testcafe_tests_docker_videos() {
    set +e
    docker run -i -e ENVIRONMENT -e TESTCAFE_CONTAINER_NAME --name "$TESTCAFE_CONTAINER_NAME" "$IMAGENAME" npm run test:chrome:parallel:videos
    set -e
}

function target_execute_visual_tests_docker() {
    set +e
    docker run -i -e ENVIRONMENT -e APPLICATION -e BACKSTOPJS_CONTAINER_NAME --name "$BACKSTOPJS_CONTAINER_NAME" "$IMAGENAME" npm run test:visual:docker
    set -e
}

function target_execute_visual_tests_docker_local_mac() {
    set +e
    setEnvVariables
    docker run -i -e ENVIRONMENT -e APPLICATION -v $(pwd):/app "$IMAGENAME" npm run test:visual:docker
    set -e
}

function target_execute_visual_tests_docker_local_windows() {
    set +e
    setEnvVariables
    docker run -i -e ENVIRONMENT -e APPLICATION -v ${pwd}:/app "$IMAGENAME" npm run test:visual:docker
    set -e
}

function target_visual_approve_baseline() {
    npx backstop approve --config=visualTest/config/backstop_config.js
}

function target_dataSetup_visualTests() {
    node visualTest/dataSetup/dataSetup.js
}

function target_remove_container_image_docker() {
    set +e
    docker rm $(docker stop "$DATACLEANUP_CONTAINER_NAME")
    docker rm $(docker stop "$TESTCAFE_CONTAINER_NAME")
    docker rm $(docker stop "$BACKSTOPJS_CONTAINER_NAME")
    docker rm $(docker stop "$RAILSNODEJS_CONTAINER_NAME")
    docker rmi "$IMAGENAME"
    set -e
}

function target_cleanup_stopped_image_container() {
    set +e
    docker rm $(docker ps -a -q)
    docker image prune -a -f
    set -e
}

function target_storeAdvisorCookies() {
    node -r esm APITesting/advisorLoginAndStoreSession.js
}


function setEnvVariables() {
    input=".env"
    while IFS= read -r line; do
        arrIN=(${line//=/ })
        export ${arrIN[0]}=${arrIN[1]}
    done <"$input"
}

if type -t "target_$1" &>/dev/null; then
    #setEnvVariables
    target_$1 ${@:2}
else
    echo "usage: $0 <target>
target:

    build_docker_image                          --      build docker image for executing tests
    run_nexthub_data_cleanup_docker             --      execute collections to clean up data before execution
    execute_testcafe_tests_docker               --      execute testcafe tests in docker
    execute_visual_tests_docker                 --      execute visual tests in docker
    remove_container_image_docker               --      after the test execution delete the image and containers
    execute_railsNodejs_tests_docker            --      execute railsNodeJs tests in docker
    cleanup_stopped_image_container             --      clean up any stopped and untagged conatiners and images
    storeAdvisorCookies                         --      creates and stores cookies for advisor login in newman env variable files
    build_docker_image_local                    --      Use this to create docker image locally
    execute_visual_tests_docker_local_mac       --      Run this for macs. Execute visual tests to get the screenshot locally. This is required so that you can approve the baseline.
    execute_visual_tests_docker_local_windows   --      Run this for windows. Execute visual tests to get the screenshot locally. This is required so that you can approve the baseline.
    visual_approve_baseline                     --      Once screenshots saved locally, use this to approve the them to make baseline images
    execute_testcafe_tests_docker_videos        --      Run testcafe tests in docker with videos enabled
    dataSetup_visualTests                       --      data setup for visual tests such as creating dashboards
"
    exit 1
fi