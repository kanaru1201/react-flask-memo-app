package handler

import "github.com/golang-jwt/jwt/v5"

// JWTCustomClaims represents the custom claims for a JSON Web Token.
type JWTCustomClaims struct {
	UserID int `json:"userid"`
	jwt.RegisteredClaims
}

// LoginRequest represents the request body for user authentication.
type LoginRequest struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

// LoginResponse represents the response body for user authentication.
type LoginResponse struct {
	Token string `json:"token"`
}
