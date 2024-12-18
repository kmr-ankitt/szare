package api

import (
	"net/http"
	"os"
	"path/filepath"
	"szare/cmd/utils"
	"fmt"
	"io"

	"github.com/gin-gonic/gin"
)

func SendFile(ctx *gin.Context) {
	file, header, err := ctx.Request.FormFile("file")
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Failed to get file from request"})
		return
	}
	defer file.Close()

	currWorkingDir, err := os.Getwd()
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Internal server error"})
		return
	}

	filePath := filepath.Join(currWorkingDir, header.Filename)

	// Check if file already exists and rename if necessary
	if _, err := os.Stat(filePath); err == nil {
		ext := filepath.Ext(header.Filename)
		base := header.Filename[:len(header.Filename)-len(ext)]
		i := 1
		for {
			newFileName := fmt.Sprintf("%s(%d)%s", base, i, ext)
			filePath = filepath.Join(currWorkingDir, newFileName)
			if _, err := os.Stat(filePath); os.IsNotExist(err) {
				break
			}
			i++
		}
	}

	out, err := os.Create(filePath)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create file on server"})
		return
	}
	defer out.Close()

	_, err = io.Copy(out, file)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save file on server"})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"message": "File sent successfully"})
}

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

	// Get file info for size
	fileInfo, err := os.Stat(filePath)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Cannot get file info"})
		return
	}

	// Set additional headers
	ctx.Header("Content-Length", fmt.Sprintf("%d", fileInfo.Size()))
	ctx.Header("Content-Disposition", "attachment; filename="+fileName)
	ctx.Header("Content-Type", "application/octet-stream")
	ctx.Header("Accept-Ranges", "bytes")

	// Open file
	file, err := os.Open(filePath)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Cannot open file"})
		return
	}
	defer file.Close()

	// Stream in chunks
	buffer := make([]byte, 1024*1024) // 1MB chunks
	for {
		n, err := file.Read(buffer)
		if err == io.EOF {
			break
		}
		if err != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Error reading file"})
			return
		}
		ctx.Writer.Write(buffer[:n])
		ctx.Writer.Flush()
	}
}

func GetHomepage(ctx *gin.Context) {
	sysFile, sysFolder := utils.GetAllFilesAndFolder()
	ctx.JSON(http.StatusOK, gin.H{"files": sysFile, "folders": sysFolder})
}