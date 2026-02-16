# ELLE / EVKK

ELLE - Estonian Language Learning and Analysis Environment is a development of the user interface of the Estonian Interlanguage Corpus (Eesti vahekeele korpus - EVKK).

## General recommendations

- All commands should be executed from the project's root directory if not stated otherwise.

## Local development

### Requirements

- JDK 11: https://openjdk.java.net/projects/jdk/11
- Docker Engine 24.x: https://docs.docker.com/get-docker
- Docker Compose (version 1, preferably the latest, which is 1.29.2): https://docs.docker.com/compose/install
- NodeJS 24.x: https://nodejs.org/en/download
  - **It is recommended to use NVM** instead of installing NodeJS directly: https://www.nvmnode.com
  - Using NVM, you can install and use the correct version of NodeJS for the project simply by running `nvm install` and
    `nvm use` commands
  - Keep in mind that `nvm use` only affects the current shell session, meaning:
    - If you want to persist the project's NodeJS version globally, use `nvm alias default <version>` (see `.nvmrc` for
      the version)
    - If you don't want to override the version globally, either run `nvm use` in every shell session or consider Volta,
      direnv or similar tools
- Yarn 4.x (**does not need to be installed separately**): https://yarnpkg.com

### Getting started
1. Make sure *docker-compose* is installed correctly: `docker-compose --version`
2. Start docker containers (this can take several minutes the first time around). The simplest way in IntelliJ is to use
   a suitable `run-local` run config under `.run`, however, you can also do it manually:
   1. UNIX-like (Linux, macOS): `./run-local.sh`
   2. Windows: `.\run-local.ps1`  
      By default, this command will start **all** containers.  
      If you only want to start specific containers, you can do so using docker profiles.  
      See all available profiles in `docker-compose.yml` file.  
      Examples for choosing profiles:
      1. UNIX-like (Linux, macOS): `COMPOSE_PROFILES=backend,stanza ./run-local.sh`
      2. Windows: `.\run-local.ps1 -Profiles 'backend,stanza'`
3. Run database migrations and insert seed data. The simplest way in IntelliJ is to use a suitable `clean db` run config
   under `.run`, however, you can also do it manually:
   1. UNIX-like (Linux, macOS): `./gradlew :db:bootRun --args 'clean migrate seed'`
   2. Windows: `.\gradlew.bat :db:bootRun --args 'clean migrate seed'`
4. Make sure you have enabled annotation processing for IntelliJ IDEA:
   `Settings -> Build, Execution, Deployment -> Compiler -> Annotation Processors -> Enable annotation processing`
5. Before running the UI module for the first time, enable Corepack: `corepack enable`
  1. Corepack is included with NodeJS 18.x and newer. It handles installing the correct version of Yarn for the project
6. Run UI module. The simplest way in IntelliJ is to use a suitable `ui` run config under `.run`, however, you can also
   do it manually:
   1. UNIX-like (Linux, macOS): `yarn --cwd=./ui install && yarn --cwd=./ui start`
   2. Windows: `cd ui; yarn install; yarn start`  
      Running each command directly in `ui` like in UNIX can cause issues with Corepack not respecting the necessary
      Yarn version defined in `package.json`
7. If IntelliJ IDEA does not recognize Yarn packages installed using PnP (i.e. package.json shows all packages as not
   installed), change the package manager in settings:
   `Settings -> Languages & Frameworks -> JavaScript Runtime -> Package manager -> Choose Yarn`
8. Run API module. The simplest way in IntelliJ is to use the `ApiRunner` run config under `.run`. However, you can also
   do it manually (other modules like `task-scheduler` work in similar fashion in terms of run configs and running
   manually):
   1. UNIX-like (Linux, macOS): `./gradlew :api:bootRun`
   2. Windows: `.\gradlew.bat :api:bootRun`

### Python debugging

Only Stanza server currently has built-in support for local debugging. The simplest way in IntelliJ is to use the
`stanza DEBUG` run config by **running it before running the container**. However, you can also do it manually:

1. Create a new Python Debug Server run configuration
2. Make sure it listens to localhost:5310 and that the paths are correctly mapped:
  1. Local path should point to the stanza-server project path, for example `/home/user/IdeaProjects/evkk/stanza-server`
  2. Remote path should be `/app`
3. **Start the Python Debug Server before running the container!**

### Database migrations

Database migrations are implemented with Flyway migration tool: https://www.red-gate.com/products/flyway/community  
For running migrations, execute Gradle task `db:bootRun`.  
All standard Flyway commands are supported (see https://documentation.red-gate.com/fd for more information).  
Also, extra command `seed` has been implemented to provide sample data for development environment.  
Please note that seeds are **not** applied in a production environment and are only used for demo data.  
For example, run **clean**, **migrate** and **seed** commands: `./gradlew :db:bootRun --args 'clean migrate seed'`

### Java development

The preferred IDE is IntelliJ IDEA, but other widely adopted IDE-s should work as well.  
Download here: https://www.jetbrains.com/idea/download

## Corpus license
The Estonian Interlanguage Corpus is licensed under a [Creative Commons Attribution 4.0 International (CC-BY-4.0) License](https://creativecommons.org/licenses/by/4.0/).
Copyright 2024 Tallinn University School of Digital Technologies and the corpus contributors.
