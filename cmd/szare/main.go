package main

import (
	"szare/cmd/api"
	"szare/cmd/utils"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	router := gin.Default()
	clientPort := "8080"

	utils.ShowQRCode(clientPort)
	router.Use(cors.Default())
	router.GET("/", api.GetHomepage)
	router.POST("/api/download/", api.DownloadFile)
	router.Run(":8000")
}
