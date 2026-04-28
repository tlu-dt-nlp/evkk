FROM --platform=linux/amd64 evkk-anaconda-2021-05
ENV PATH="/root/anaconda3/envs/py35/bin:$PATH"
RUN apt-get update \
    && apt-get install openjdk-8-jdk -y \
    && apt-get clean

RUN conda create -n py35 python=3.5

# Install estnltk via conda; nltk via pip to reduce memory during build (avoids OOM 137)
RUN conda install -n py35 -c estnltk -c conda-forge estnltk=1.4.1 --yes \
    && /root/anaconda3/envs/py35/bin/pip install --no-cache-dir 'nltk==3.4.4' \
    && conda clean -afy
