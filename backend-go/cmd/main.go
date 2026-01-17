package main

import (
	"os"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"

	"react-flask-memo-app/backend-go/handler"
	"react-flask-memo-app/backend-go/handler/jwtauth"
	"react-flask-memo-app/backend-go/infra"
	"react-flask-memo-app/backend-go/usecase"
)

func main() {
	infra.InitDB()
	infra.LoadKeys()

	e := echo.New()

	// Middleware
	e.Use(middleware.RequestLoggerWithConfig(middleware.RequestLoggerConfig{
		LogStatus: true,
		LogURI:    true,
		LogMethod: true,
		LogValuesFunc: func(c echo.Context, v middleware.RequestLoggerValues) error {
			e.Logger.Infof("%s %s %d", v.Method, v.URI, v.Status)
			return nil
		},
	}))
	e.Use(middleware.Recover())
	e.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		AllowOrigins: []string{os.Getenv("CORS_ORIGINS")},
		AllowHeaders: []string{
			echo.HeaderOrigin,
			echo.HeaderContentType,
			echo.HeaderAccept,
			echo.HeaderAuthorization,
		},
		AllowMethods: []string{
			echo.GET,
			echo.POST,
			echo.PUT,
			echo.DELETE,
		},
	}))

	// Handlers
	userHandler := handler.NewUserHandler(
		usecase.NewUserUsecase(infra.NewUserRepository(infra.DB)),
		infra.PrivateKey,
	)
	memoHandler := handler.NewMemoHandler(
		usecase.NewMemoUsecase(infra.NewMemoRepository(infra.DB)),
	)

	// Routes
	e.GET("/health", func(c echo.Context) error {
		return c.JSON(200, map[string]string{"status": "OK"})
	})

	api := e.Group("/api")
	api.POST("/signup", userHandler.Signup)
	api.POST("/login", userHandler.Login)

	protected := api.Group("", jwtauth.Middleware(infra.PublicKey))
	protected.GET("/me", userHandler.GetMe)
	protected.POST("/logout", userHandler.Logout)
	protected.GET("/memos", memoHandler.GetMemos)
	protected.POST("/memos", memoHandler.CreateMemo)
	protected.PUT("/memos/:id", memoHandler.UpdateMemo)
	protected.DELETE("/memos/:id", memoHandler.DeleteMemo)

	e.Logger.Fatal(e.Start(":8081"))
}
