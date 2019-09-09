FROM ubuntu:16.04

# initial setup
RUN apt-get update && apt install -y wget ca-certificates lsb-release curl

# install psql
RUN wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | apt-key add -
RUN sh -c 'echo "deb http://apt.postgresql.org/pub/repos/apt/ `lsb_release -cs`-pgdg main" >> /etc/apt/sources.list.d/pgdg.list'
RUN apt-get update && apt-get install -y postgresql-11 postgresql-contrib-11

# install node
RUN curl -sL https://deb.nodesource.com/setup_10.x | bash -
RUN apt-get update && apt-get install -y nodejs

RUN npm install -g sequelize sequelize-cli jest

WORKDIR /usr/src/kit

COPY . .

# verify versions for everything
RUN node -v && npm -v && psql --version

EXPOSE 8080
EXPOSE 8888

# run the thing
CMD ["npm", "run", "dev"]