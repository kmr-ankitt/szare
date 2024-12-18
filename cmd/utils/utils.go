package utils

import (
	"fmt"
	"net"
	"os"
	"os/exec"
	"path/filepath"
	"time"

	"github.com/mdp/qrterminal/v3"
)

/*
* Testing
 */
func StartFrontend(){
	
	execPath,err := os.Executable()
	if err != nil {
		fmt.Println("Failed to get executable path", err)
	}
	
	execDir := filepath.Dir(execPath)
	clientDir := filepath.Join(execDir, "client")
	
	nextCmd := exec.Command("npm", "run", "start")
	nextCmd.Dir = clientDir
	nextCmd.Stdout = os.Stdout
	nextCmd.Stderr = os.Stderr
	
	if err := nextCmd.Start(); err != nil {
		fmt.Printf("Failed to start frontend: %v", err)
	}	
	time.Sleep(5* time.Second)
}

func GetAllFilesAndFolder() ([]string, []string) {
	items, err := os.ReadDir("./")
	if err != nil {
		fmt.Println(err)
	}
	var fileNames []string 
	var folderNames []string = []string{".."}
	for _, file := range items {
		if !file.IsDir() {
			fileNames = append(fileNames, file.Name())
		} else {
			folderNames = append(folderNames, file.Name())
		}
	}

	// Filter out hidden files
	var filteredFileNames []string
	for _, fileName := range fileNames {
		if fileName[0] != '.' {
			filteredFileNames = append(filteredFileNames, fileName)
		}
	}
	fileNames = filteredFileNames

	// Filter out hidden folders
	filteredFolderNames := []string{}
	for index, folderName := range folderNames {

		if index == 0 {
			filteredFolderNames = append(filteredFolderNames, folderName)
		}
		if folderName[0] != '.' {
			filteredFolderNames = append(filteredFolderNames, folderName)
		}
	}

	return filteredFileNames , filteredFolderNames
}

func ExpandDirectory(folderName string) ([]string, []string) {
	err := os.Chdir(folderName)
	if err != nil {
		fmt.Println(err)
	}
	return GetAllFilesAndFolder()
}

/*
* ShowQRCode shows the server link and it's QR code
 */
func ShowQRCode(port string) {
	ip := GetLocalIP()
	hostIp := "http://" + ip + ":" + port
	fmt.Println("Enter " + hostIp + " in your browser" + "\nor\n" + "Scan this QR code on your phone")

	config := qrterminal.Config{
		Level:     qrterminal.M,
		Writer:    os.Stdout,
		BlackChar: qrterminal.WHITE,
		WhiteChar: qrterminal.BLACK,
		QuietZone: 1,
	}
	qrterminal.GenerateWithConfig(hostIp, config)
}

/*
* GetLocalIP returns the local IP address of the computer
 */
func GetLocalIP() string {
	addrs, err := net.InterfaceAddrs()
	if err != nil {
		return ""
	}
	for _, address := range addrs {
		// check the address type and if it is not a loopback the display it
		if ipnet, ok := address.(*net.IPNet); ok && !ipnet.IP.IsLoopback() {
			if ipnet.IP.To4() != nil {
				return ipnet.IP.String()
			}
		}
	}
	return ""
}