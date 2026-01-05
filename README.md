# ELLE / EVKK

ELLE - Estonian Language Learning and Analysis Environment is a development of the user interface of the Estonian Interlanguage Corpus (Eesti vahekeele korpus - EVKK).

## General recommendations
- All commands should be executed from project's root directory if not stated otherwise.

## Local development

### Requirements
- JDK 11: https://openjdk.java.net/projects/jdk/11/
- Docker Engine 24.x: https://docs.docker.com/get-docker/
- Docker Compose 1.28+: https://docs.docker.com/compose/install/
- NodeJS 20.x: https://nodejs.org
- YARN (classic, 1.22.x): https://yarnpkg.com

### Getting started
1. Make sure *docker-compose* is installed correctly: `docker-compose --version`
2. Start docker containers (this can take several minutes the first time around):
   1. UNIX-like (Linux, macOS): `$ ./run-local.sh`
   2. Windows: `.\run-local.ps1`  
      By default, this command will start **all** containers.  
      If you only want to start specific containers, you can do so using docker profiles.  
      See all available profiles in `docker-compose.yml` file.  
      Examples for choosing profiles:
      1. UNIX-like (Linux, macOS): `COMPOSE_PROFILES=backend,stanza ./run-local.sh`
      2. Windows: `.\run-local.ps1 -Profiles 'backend,stanza'`
3. Run database migrations and insert seed data: `$ ./gradlew :db:bootRun --args 'clean migrate seed'`
4. Make sure you have enabled annotation processing for IntelliJ IDEA: `Preferences -> Build, Execution, Deployment -> Compiler -> Annotation Processors -> Enable annotation processing`
5. Run UI module: 
   1. UNIX-like (Linux, macOS): `$ yarn --cwd=./ui install && yarn --cwd=./ui start`
   2. Windows: `yarn --cwd .\ui install; yarn --cwd .\ui start`  
   Tip: the simplest way to install yarn is `npm install --global yarn`
6. Run API module: `$ ./gradlew :api:bootRun` (other modules like `task-scheduler` work in similar fashion)

### Database migrations
Database migrations are implemented with Flyway migration tool: https://flywaydb.org/  
For running migrations execute gradle task `db:bootRun`.  
All standard Flyway commands are supported (see https://flywaydb.org/documentation/ for more information).  
Also, extra command `seed` has been implemented in order to provide sample data for development environment.  
Please note that seeds are **not** applied in production environment and are only used for demo data.  
For example: run **clean**, **migrate** and **seed** commands: `$ ./gradlew :db:bootRun --args 'clean migrate seed'`  

### Java development
Preferred IDE is IntelliJ IDEA but other widely adopted IDE-s should work as well.  
IntelliJ community edition download: https://www.jetbrains.com/idea/download/  

## Corpus license
The Estonian Interlanguage Corpus is licensed under a [Creative Commons Attribution 4.0 International (CC-BY-4.0) License](https://creativecommons.org/licenses/by/4.0/).
Copyright 2024 Tallinn University School of Digital Technologies and the corpus contributors.
