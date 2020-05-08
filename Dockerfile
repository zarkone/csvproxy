FROM node:14
WORKDIR /root
COPY ./ .
RUN yarn add global typescript
RUN yarn run tsc

EXPOSE 3000
CMD ["node","/root/src/App.js"]