package main

import (
	"fmt"
	"net"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/mdp/qrterminal/v3"
)

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

func ShowQRCode(port string){
	ip := GetLocalIP()
	hostIp := "http://" + ip + ":" + port
	fmt.Println(`Server running on ` + hostIp)
	
	config := qrterminal.Config{
		Level:     qrterminal.M,
		Writer:    os.Stdout,
		BlackChar: qrterminal.WHITE,
		WhiteChar: qrterminal.BLACK,
		QuietZone: 1,
	}
	qrterminal.GenerateWithConfig(hostIp, config)
}

func main() {
	router := gin.Default()
	port := "8080"
	// step 1: create a server
	// step 2: show link and qr code
	// step 3: get("/") here we will fetch all the files and dir of server computer and let us download it

	// gin.SetMode(gin.ReleaseMode)

	ShowQRCode(port);
	
	router.Run("localhost:" + port)
}
