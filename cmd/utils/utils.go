package utils

import (
	"fmt"
	"net"
	"os"

	"github.com/mdp/qrterminal/v3"
)

func GetFiles() []string {
	items, err := os.ReadDir("./")
	if err != nil {
		fmt.Println(err)
	}
	var fileNames []string
	for _, file := range items {
		fileNames = append(fileNames, file.Name())
	}
	
	return fileNames
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