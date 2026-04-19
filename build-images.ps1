$ErrorActionPreference = 'Stop'

# Order is important here because images may depend on each other
docker build . -f ./images/evkk-anaconda-2021-05.Dockerfile -t evkk-anaconda-2021-05
docker build . -f ./images/evkk-estnltk141.Dockerfile -t evkk-estnltk141
docker build . -f ./images/evkk-stanza.Dockerfile -t evkk-stanza
docker build . -f ./images/evkk-jdk8-mvn.Dockerfile -t evkk-jdk8-mvn
