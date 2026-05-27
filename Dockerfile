FROM cgr.dev/chainguard/node as node-builder

WORKDIR /app
COPY --chown=node:node ["package.json", "package-lock.json", "server.js", "./client"]
RUN npm install --omit=dev
RUN npm run build

FROM cgr.dev/chainguard/go AS go-builder
COPY . /app
RUN cd /app && go build -o terminal-app .

FROM kalilinux/kali-rolling
COPY --from=go-builder /app/server/terminal-app /usr/bin/
COPY --from=node-builder /app/dist/ /usr/bin/dist/
ENTRYPOINT ["/usr/bin/terminal-app"]


