package handler

import (
	"crypto/rsa"
	"net/http"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/labstack/echo/v4"

	"react-flask-memo-app/backend-go/usecase"
)

type UserHandler struct {
	usecase    usecase.UserUsecase
	privateKey *rsa.PrivateKey
}

func NewUserHandler(u usecase.UserUsecase, privateKey *rsa.PrivateKey) *UserHandler {
	return &UserHandler{
		usecase:    u,
		privateKey: privateKey,
	}
}

type SignupRequest struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

func (h *UserHandler) Signup(c echo.Context) error {
	req := new(SignupRequest)
	if err := c.Bind(req); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Invalid request"})
	}

	if req.Username == "" || req.Password == "" {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Username and password are required"})
	}

	if err := h.usecase.Signup(req.Username, req.Password); err != nil {
		if err.Error() == "username is already taken" {
			return c.JSON(http.StatusConflict, map[string]string{"error": err.Error()})
		}
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
	}

	user, err := h.usecase.Login(req.Username, req.Password)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Failed to auto-login"})
	}

	token, err := h.generateToken(user.ID)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Failed to generate token"})
	}

	return c.JSON(http.StatusCreated, LoginResponse{Token: token})
}

func (h *UserHandler) Login(c echo.Context) error {
	req := new(LoginRequest)
	if err := c.Bind(req); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Invalid request"})
	}

	user, err := h.usecase.Login(req.Username, req.Password)
	if err != nil {
		return c.JSON(http.StatusUnauthorized, map[string]string{"error": "Invalid login credentials"})
	}

	token, err := h.generateToken(user.ID)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Failed to generate token"})
	}

	return c.JSON(http.StatusOK, LoginResponse{Token: token})
}

func (h *UserHandler) generateToken(userID int) (string, error) {
	claims := &JWTCustomClaims{
		UserID: userID,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(time.Hour * 24)),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
		},
	}
	token := jwt.NewWithClaims(jwt.SigningMethodRS256, claims)
	return token.SignedString(h.privateKey)
}

func (h *UserHandler) GetMe(c echo.Context) error {
	user := c.Get("user").(*jwt.Token)
	claims := user.Claims.(*JWTCustomClaims)

	u, err := h.usecase.GetMe(claims.UserID)
	if err != nil {
		return c.JSON(http.StatusNotFound, map[string]string{"error": "User not found"})
	}

	return c.JSON(http.StatusOK, map[string]interface{}{
		"userid":   u.ID,
		"username": u.Username,
	})
}

func (h *UserHandler) Logout(c echo.Context) error {
	return c.JSON(http.StatusOK, map[string]string{"message": "Logged out successfully"})
}
