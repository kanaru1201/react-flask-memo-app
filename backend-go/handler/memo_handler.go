package handler

import (
	"net/http"
	"strconv"
	"strings"

	"github.com/golang-jwt/jwt/v5"
	"github.com/labstack/echo/v4"

	"react-flask-memo-app/backend-go/usecase"
)

type MemoHandler struct {
	usecase usecase.MemoUsecase
}

func NewMemoHandler(u usecase.MemoUsecase) *MemoHandler {
	return &MemoHandler{u}
}

type MemoRequest struct {
	Title string `json:"title"`
	Body  string `json:"body"`
}

type MemoResponse struct {
	MemoID    int    `json:"memoid"`
	OwnerID   int    `json:"owner_id"`
	Title     string `json:"title"`
	Body      string `json:"body"`
	CreatedAt string `json:"created_at"`
}

func (h *MemoHandler) GetMemos(c echo.Context) error {
	user := c.Get("user").(*jwt.Token)
	claims := user.Claims.(*JWTCustomClaims)

	memos, err := h.usecase.GetMemos(claims.UserID)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
	}

	response := make([]MemoResponse, len(memos))
	for i, m := range memos {
		response[i] = MemoResponse{
			MemoID:    m.ID,
			OwnerID:   m.OwnerID,
			Title:     m.Title,
			Body:      m.Body,
			CreatedAt: m.CreatedAt.Format("2006-01-02T15:04:05Z"),
		}
	}

	return c.JSON(http.StatusOK, response)
}

func (h *MemoHandler) CreateMemo(c echo.Context) error {
	user := c.Get("user").(*jwt.Token)
	claims := user.Claims.(*JWTCustomClaims)

	req := new(MemoRequest)
	if err := c.Bind(req); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Invalid request"})
	}

	if err := h.usecase.CreateMemo(claims.UserID, req.Title, req.Body); err != nil {
		if strings.Contains(err.Error(), "cannot be empty") {
			return c.JSON(http.StatusBadRequest, map[string]string{"error": err.Error()})
		}
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
	}

	return c.JSON(http.StatusCreated, map[string]string{"message": "Memo created successfully"})
}

func (h *MemoHandler) UpdateMemo(c echo.Context) error {
	user := c.Get("user").(*jwt.Token)
	claims := user.Claims.(*JWTCustomClaims)

	id, _ := strconv.Atoi(c.Param("id"))
	req := new(MemoRequest)
	if err := c.Bind(req); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Invalid request"})
	}

	if err := h.usecase.UpdateMemo(id, claims.UserID, req.Title, req.Body); err != nil {
		if strings.Contains(err.Error(), "cannot be empty") {
			return c.JSON(http.StatusBadRequest, map[string]string{"error": err.Error()})
		}
		if err.Error() == "memo not found or unauthorized" {
			return c.JSON(http.StatusNotFound, map[string]string{"error": err.Error()})
		}
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
	}

	return c.JSON(http.StatusOK, map[string]string{"message": "Memo updated successfully"})
}

func (h *MemoHandler) DeleteMemo(c echo.Context) error {
	user := c.Get("user").(*jwt.Token)
	claims := user.Claims.(*JWTCustomClaims)
	id, _ := strconv.Atoi(c.Param("id"))

	if err := h.usecase.DeleteMemo(id, claims.UserID); err != nil {
		if err.Error() == "memo not found or unauthorized" {
			return c.JSON(http.StatusNotFound, map[string]string{"error": err.Error()})
		}
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
	}

	return c.JSON(http.StatusOK, map[string]string{"message": "Memo deleted successfully"})
}
