package api

import (
	"net/http"
	"os"
	"strconv"
	"szare/cmd/utils"

	"github.com/gin-gonic/gin"
)

func DownloadFile(ctx *gin.Context) {
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

func GetHomepage(ctx *gin.Context) {
	sysFile, sysFolder := utils.GetAllFilesAndFolder()
	ctx.JSON(http.StatusOK, gin.H{"files": sysFile, "folders": sysFolder})
}