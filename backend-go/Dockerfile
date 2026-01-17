# Build Stage
FROM golang:1.25.5-alpine AS builder

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .

# Build from cmd/main.go
# Generate a statically linked binary compatible with distroless/static
RUN CGO_ENABLED=0 go build -ldflags="-w -s" -o main ./cmd/main.go

# Busybox stage to grab useful tools
FROM busybox:musl AS busybox

# Run Stage
FROM gcr.io/distroless/static

WORKDIR /app

# Copy essential busybox commands including sh, ls, and cat
COPY --from=busybox /bin/sh /bin/sh
COPY --from=busybox /bin/ls /bin/ls
COPY --from=busybox /bin/cat /bin/cat

# Copy the application binary and keys
COPY --from=builder /app/main .
COPY --from=builder /app/private_key.pem .
COPY --from=builder /app/public_key.pem .

EXPOSE 8081

CMD ["./main"]
