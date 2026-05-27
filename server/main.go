package main

import (
	"fmt"
	"log"
	"net/http"
	"os/exec"

	"github.com/creack/pty"
	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	// CheckOrigin: func(r *http.Request) bool {
	// 	origin := r.Header.Get("Origin")
	// 	return origin == "http://localhost:5173" // or check a whitelist
	// },
} // use default options

func WebSocketHandler(w http.ResponseWriter, r *http.Request) {
	fmt.Println("hey")
	ws, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Print("upgrade:", err)
		return
	}
	defer func() {
		ws.Close()
		log.Println("closing")
	}()

	cmd := exec.Command("bash")
	ptmx, _ := pty.Start(cmd)
	defer ptmx.Close()

	// PTY → WebSocket
	go func() {
		buf := make([]byte, 1024)
		for {
			n, err := ptmx.Read(buf)
			if err != nil {
				return
			}
			ws.WriteMessage(websocket.BinaryMessage, buf[:n])
		}
	}()

	// WebSocket → PTY
	for {
		_, msg, err := ws.ReadMessage()
		if err != nil {
			return
		}
		ptmx.Write(msg)
	}
}

func main() {

	http.HandleFunc("/ws", WebSocketHandler)

	fs := http.FileServer(http.Dir("./public"))
	http.Handle("/", fs)

	fmt.Println("Server listening on port 3000")
	http.ListenAndServe("localhost:3000", nil)
}
