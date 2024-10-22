package main

import (
	"encoding/base64"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
)

func main() {
	username := os.Getenv("API_SOLUTIONBOX_USER")
	if username == "" {
		fmt.Println("API_SOLUTIONBOX_USER no está definida")
		return
	}
	password := os.Getenv("API_SOLUTIONBOX_PASS")
	if password == "" {
		fmt.Println("API_SOLUTIONBOX_PASS no está definida")
		return
	}
	url := os.Getenv("API_SOLUTIONBOX_URL")
	if url == "" {
		fmt.Println("API_SOLUTIONBOX_URL no está definida")
		return
	}

	// Combinar usuario y contraseña con ":" y codificar en base64
	auth := base64.StdEncoding.EncodeToString([]byte(username + ":" + password))

	// Crear la solicitud POST
	req, err := http.NewRequest("POST", url+"/usuario/createToken", nil)
	if err != nil {
		fmt.Println("Error al crear la solicitud:", err)
		return
	}

	// Agregar el encabezado de autorización
	req.Header.Add("Authorization", "Basic "+auth)

	// Realizar la petición
	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		fmt.Println("Error al realizar la petición:", err)
		return
	}
	defer resp.Body.Close()

	// Leer el cuerpo de la respuesta
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		fmt.Println("Error al leer la respuesta:", err)
		return
	}

	// Imprimir el cuerpo de la respuesta (ajusta según el formato de la respuesta)
	fmt.Println(string(body))

	// Si la respuesta es JSON, puedes decodificarla:
	var result map[string]interface{}
	err = json.Unmarshal(body, &result)
	if err != nil {
		fmt.Println("Error al decodificar JSON:", err)
		return
	}
	fmt.Println(result)

}
