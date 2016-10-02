# Pull base image.
FROM ubuntu:16.04

# Install Python.
RUN \
  apt-get update && \
  apt-get install -y software-properties-common python-software-properties curl && \
  add-apt-repository -y ppa:nginx/stable && \
  apt-get update && \
  apt-get install -y nginx && \
  rm -rf /var/lib/apt/lists/*

RUN \
  curl -sL https://deb.nodesource.com/setup_6.x | bash - && \
  apt-get install -y nodejs && \
  npm install -g npm && \
  printf '\n# Node.js\nexport PATH="node_modules/.bin:$PATH"' >> /root/.bashrc && \
  rm -rf /var/lib/apt/lists/* && \
  echo "\ndaemon off;" >> /etc/nginx/nginx.conf && \
  chown -R www-data:www-data /var/lib/nginx && \
  mkdir -p /etc/nginx/web/gallery

WORKDIR /usr/src/app
COPY . /usr/src/app
#RUN npm install \
#  && npm run build:prod

COPY build/* /etc/nginx/web/gallery
COPY nginx.conf /etc/nginx/

CMD ["nginx"]
