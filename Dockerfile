FROM ubuntu:latest
LABEL authors="mamzil"

ENTRYPOINT ["top", "-b"]