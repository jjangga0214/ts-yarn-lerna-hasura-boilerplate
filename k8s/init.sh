BASE_DIR=$(dirname "$0")

kubectl -f $BASE_DIR/base apply
glooctl install knative --skip-installing-gloo --install-knative-version 0.11.1
