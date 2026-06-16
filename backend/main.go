package main

import (
	"log"
	"portfolio-backend/handlers"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	router := gin.Default()

	// CORS Configuration
	config := cors.Config{
		AllowOrigins:     []string{"http://localhost:5173"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
	}
	router.Use(cors.New(config))

	// API Routes
	api := router.Group("/api")
	{
		api.GET("/health", handlers.HealthCheck)
		api.GET("/profile", handlers.GetProfile)
		api.GET("/projects", handlers.GetProjects)
		api.GET("/projects/:id", handlers.GetProjectByID)
	}

	log.Println("Starting server on :8080")
	if err := router.Run(":8080"); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
