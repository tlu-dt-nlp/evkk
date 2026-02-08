FROM python:3.10.14

RUN apt-get update \
    && apt-get install -y build-essential libpcre3-dev wget locales \
    && apt-get clean

RUN wget https://sourceforge.net/projects/swig/files/swig/swig-3.0.12/swig-3.0.12.tar.gz \
    && tar -xzf swig-3.0.12.tar.gz \
    && cd swig-3.0.12 \
    && ./configure \
    && make \
    && make install \
    && cd .. \
    && rm -rf swig-3.0.12 swig-3.0.12.tar.gz

RUN sed -i '/en_US.UTF-8/s/^# //g' /etc/locale.gen && locale-gen

ENV LANG=en_US.UTF-8
ENV LANGUAGE=en_US:en
ENV LC_ALL=en_US.UTF-8

RUN pip install jamspell
RUN pip install Flask

RUN mkdir -p /app/ && curl -o /app/jamspell.et.bin https://www.cs.tlu.ee/keelemudelid/jamspell_estonian_2021_05_13.bin
RUN python -c "import jamspell; corrector=jamspell.TSpellCorrector(); corrector.LoadLangModel(\"/app/jamspell.et.bin\");"

COPY ./corrector-server/ /app/
CMD ["python", "/app/server.py"]
