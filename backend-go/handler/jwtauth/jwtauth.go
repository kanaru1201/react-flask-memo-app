package jwtauth

import (
	"crypto/rsa"

	"github.com/golang-jwt/jwt/v5"
	echojwt "github.com/labstack/echo-jwt/v4"
	"github.com/labstack/echo/v4"

	"react-flask-memo-app/backend-go/handler"
)

func Middleware(publicKey *rsa.PublicKey) echo.MiddlewareFunc {
	return echojwt.WithConfig(echojwt.Config{
		NewClaimsFunc: func(c echo.Context) jwt.Claims {
			return new(handler.JWTCustomClaims)
		},
		SigningKey:    publicKey,
		SigningMethod: "RS256",
	})
}
