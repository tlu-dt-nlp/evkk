FROM --platform=linux/amd64 ubuntu:16.04
ENV PATH="/root/anaconda3/bin:$PATH"
RUN apt-get update \
    && apt-get install wget -y \
    && apt-get clean \
    && wget --no-verbose https://repo.anaconda.com/archive/Anaconda3-2021.05-Linux-x86_64.sh \
    && sh Anaconda3-2021.05-Linux-x86_64.sh -b \
    && rm Anaconda3-2021.05-Linux-x86_64.sh
