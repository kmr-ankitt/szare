run : 
	go run cmd/szare/main.go

build :
	go build -o szare cmd/szare/main.go

.PHONY: run
