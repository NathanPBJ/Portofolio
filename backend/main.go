package main

import (
	"log"
	"os"
	"portfolio-backend/handlers"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	router := gin.Default()

	config := cors.Config{
		AllowOrigins:     []string{"http://localhost:5173"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
	}
	router.Use(cors.New(config))

	registerAPIRoutes(router.Group("/api"))
	registerAPIRoutes(router.Group("/_/backend/api"))

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("Starting server on :%s", port)
	if err := router.Run(":" + port); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}

func registerAPIRoutes(api *gin.RouterGroup) {
	api.GET("/health", handlers.HealthCheck)
	api.GET("/profile", handlers.GetProfile)
	api.GET("/projects", handlers.GetProjects)
	api.GET("/projects/:id", handlers.GetProjectByID)
}
