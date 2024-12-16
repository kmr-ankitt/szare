package api

import (
	"net/http"
	"os"
	"path/filepath"
	"szare/cmd/utils"

	"github.com/gin-gonic/gin"
)

func DownloadFile(ctx *gin.Context) {
	currWorkingDir, err := os.Getwd()
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Internal server error"})
		return
	}
	
	fileName := ctx.Query("name")
	if fileName == "" {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "File name is required"})
		return
	}
	
	// var fileName string = files[idInt]
	filePath := filepath.Join(currWorkingDir, fileName)
	
	
	if fileInfo, err := os.Stat(filePath); err == nil && fileInfo.IsDir() {
		utils.ExpandDirectory(fileName)
		ctx.Status(205)
		return
	}	
	
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