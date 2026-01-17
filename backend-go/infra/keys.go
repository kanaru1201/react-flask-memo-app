package infra

import (
	"crypto/rsa"
	"log"
	"os"

	"github.com/golang-jwt/jwt/v5"
)

var PrivateKey *rsa.PrivateKey
var PublicKey *rsa.PublicKey

func LoadKeys() {
	privKeyBytes, err := os.ReadFile("private_key.pem")
	if err != nil {
		log.Fatalf("Failed to read private key: %v", err)
	}
	PrivateKey, err = jwt.ParseRSAPrivateKeyFromPEM(privKeyBytes)
	if err != nil {
		log.Fatalf("Failed to parse private key: %v", err)
	}

	pubKeyBytes, err := os.ReadFile("public_key.pem")
	if err != nil {
		log.Fatalf("Failed to read public key: %v", err)
	}
	PublicKey, err = jwt.ParseRSAPublicKeyFromPEM(pubKeyBytes)
	if err != nil {
		log.Fatalf("Failed to parse public key: %v", err)
	}
	log.Println("RSA Keys loaded successfully")
}
