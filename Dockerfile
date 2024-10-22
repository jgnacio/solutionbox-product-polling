FROM golang:1.23.2-bookworm

# Copiar el código fuente
COPY . .

# Establecer la variable de entorno
ENV API_SOLUTIONBOX_USER=${API_USER}
ENV API_SOLUTIONBOX_PASS=${API_PASS}
ENV API_SOLUTIONBOX_URL="https://lxc.solutionbox.com.uy/api"

# Construir la aplicación
RUN go build -o app .

# Exponer el puerto
EXPOSE 8080

# Comando para ejecutar la aplicación
CMD ["./app"]