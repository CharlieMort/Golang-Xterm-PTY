FROM cgr.dev/chainguard/node as node-builder

WORKDIR /app
COPY --chown=node:node ["./client", "./"]
RUN npm install
RUN npm run build

FROM cgr.dev/chainguard/go AS go-builder
COPY ./server /app
RUN cd /app && CGO_ENABLED=0 GOOS=linux go build -o terminal-app .

FROM kalilinux/kali-rolling
COPY --from=go-builder /app/terminal-app /usr/bin/
COPY --from=node-builder /app/dist/ /usr/bin/public/
RUN apt update && apt -y install kali-linux-headless
ENTRYPOINT ["/usr/bin/terminal-app"]


