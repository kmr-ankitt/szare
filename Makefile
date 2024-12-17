run : 
	go run cmd/szare/main.go

build :
	go build -o szare cmd/szare/main.go

dev :
	cd client && npm run dev

start :
	cd client && npm run build && npm start
	
.PHONY: run
