FROM python:3.12.3
RUN apt-get update \
    && apt-get install -y libjsoncpp-dev hfst \
    && apt-get clean \
    && pip install stanza \
    && python -c "import stanza; stanza.download('et'); stanza.download('ru');"
