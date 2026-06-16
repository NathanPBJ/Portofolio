package handlers

import (
	"net/http"
	"portfolio-backend/data"
	"strconv"

	"github.com/gin-gonic/gin"
)

type Response struct {
	Success bool        `json:"success"`
	Data    interface{} `json:"data"`
	Message string      `json:"message"`
}

func HealthCheck(c *gin.Context) {
	c.JSON(http.StatusOK, Response{
		Success: true,
		Data:    nil,
		Message: "OK",
	})
}

func GetProfile(c *gin.Context) {
	profile := data.GetProfile()
	c.JSON(http.StatusOK, Response{
		Success: true,
		Data:    profile,
		Message: "OK",
	})
}

func GetProjects(c *gin.Context) {
	projects := data.GetProjects()
	c.JSON(http.StatusOK, Response{
		Success: true,
		Data:    projects,
		Message: "OK",
	})
}

func GetProjectByID(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, Response{
			Success: false,
			Data:    nil,
			Message: "Invalid project ID",
		})
		return
	}

	projects := data.GetProjects()
	for _, p := range projects {
		if p.ID == id {
			c.JSON(http.StatusOK, Response{
				Success: true,
				Data:    p,
				Message: "OK",
			})
			return
		}
	}

	c.JSON(http.StatusNotFound, Response{
		Success: false,
		Data:    nil,
		Message: "Project not found",
	})
}
