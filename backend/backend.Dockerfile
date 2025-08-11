FROM node:alpine

WORKDIR /backend
COPY . .
RUN npm ci
RUN npm run build

CMD ["./entrypoint.sh"]