FROM python:3.10

WORKDIR /app

RUN apt-get update -y \
    && pip install swig==3.0.12 \
    && git clone https://github.com/TartuNLP/grammar-worker.git /app \
    && cd /app \
    && git checkout nelb \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/* \
    && apt-get update -y \
    && apt-get -y install locales \
    && sed -i '/en_US.UTF-8/s/^# //g' /etc/locale.gen \
    && locale-gen \
    && apt-get clean

ENV LANG en_US.UTF-8
ENV LANGUAGE en_US:en
ENV LC_ALL en_US.UTF-8

# Fix jamspell missing uint32_t include before installing requirements
RUN pip download jamspell==0.0.12 -d /tmp \
    && tar xzf /tmp/jamspell-0.0.12.tar.gz -C /tmp \
    && sed -i '9i#include <cstdint>' /tmp/jamspell-0.0.12/contrib/handypack/handypack.hpp \
    && (cd /tmp/jamspell-0.0.12 && python3 setup.py bdist_wheel) \
    && pip install /tmp/jamspell-0.0.12/dist/*.whl \
    && rm -rf /tmp/jamspell-0.0.12 /tmp/jamspell-0.0.12.tar.gz \
    && pip install -r /app/requirements.txt \
    && python -c "import nltk; nltk.download('punkt_tab')" \
    && pip install -U Flask \
    && apt-get update \
    && apt-get install -y git-lfs \
    && apt-get clean \
    && git lfs install \
    && git clone https://huggingface.co/Jaagup/etnc19_reference_corpus_6000000_web_2019_600000 /app/models/Jaagup/etnc19_reference_corpus_6000000_web_2019_600000 \
    && git clone https://huggingface.co/tartuNLP/en-et-de-cs-nelb /app/models/tartuNLP/en-et-de-cs-nelb

# Alternative models
# git clone https://huggingface.co/Jaagup/etnc19_reference_corpus_model_6000000_lines /app/models/Jaagup/etnc19_reference_corpus_model_6000000_lines && \
# git clone https://huggingface.co/Jaagup/etnc19_web_2019 /app/models/Jaagup/etnc19_web_2019

EXPOSE 5400

COPY ./grammar-worker-server/ /app/

CMD ["python", "/app/server.py"]
