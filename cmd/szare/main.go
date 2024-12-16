package main

import (
	"net/http"
	"os"
	"strconv"
	"szare-backend/cmd/utils"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	router := gin.Default()
	port := "8080"
	// step 1: create a server
	// step 2: show link and qr code
	// step 3: get("/") here we will fetch all the files and dir of server computer
	// step 4: if clicked on file then it will download the file

	utils.ShowQRCode(port)

	router.Use(cors.Default())
	router.GET("/", getHomepage)
	router.POST("/api/download/:id", downloadFile)
	router.Run(":8000")
}

func downloadFile(ctx *gin.Context) {
	currWorkingDir, err := os.Getwd()
	id := ctx.Param("id")
	idInt, err := strconv.Atoi(id)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid file ID"})
		return
	}	 
	
	files := utils.GetFiles()
	if idInt < 0 || idInt >= len(files) {
		ctx.JSON(http.StatusNotFound, gin.H{"error": "File not found"})
		return
	}
	
	var fileName string = files[idInt]
	var filePath string = currWorkingDir + "/" + fileName
	
	// Ensure the file exists before sending
	if _, err := os.Stat(filePath); os.IsNotExist(err) {
		ctx.JSON(http.StatusNotFound, gin.H{"error": "File not found"})
		return
	}

	ctx.FileAttachment(filePath , fileName)
}

func getHomepage(ctx *gin.Context) {
	sysFiles := utils.GetFiles()
	// var fileNames []string
	// for _, file := range sysFiles {
	// 	fileNames = append(fileNames, file.Name())
	// }
	ctx.JSON(http.StatusOK, sysFiles)
}