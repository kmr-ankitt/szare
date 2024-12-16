run : 
	go run cmd/szare/main.go

build :
	go build -o szare cmd/szare/main.go

start :
	cd client && npm run dev
	
.PHONY: run
