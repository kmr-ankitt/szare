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
	gin.SetMode(gin.ReleaseMode)

	utils.StartFrontend()
	utils.ShowQRCode(clientPort)
	router.Use(cors.Default())
	router.GET("/", api.GetHomepage)
	router.GET("/api/download/", api.DownloadFile)
	router.POST("/api/send", api.SendFile)
	router.Run(":8000")
}
