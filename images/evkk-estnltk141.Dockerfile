FROM --platform=linux/amd64 evkk-anaconda-2021-05
ENV PATH="/root/anaconda3/envs/py35/bin:$PATH"
RUN apt-get update \
    && apt-get install openjdk-8-jdk -y \
    && apt-get clean \
    && conda create -n py35 python=3.5 \
    && conda install -n py35 -c estnltk -c conda-forge nltk=3.4.4 estnltk=1.4.1
