package main

import (
	"bufio"
	"fmt"
	"os"
	// "strings"
)

func main () {
  scanner := bufio.NewScanner(os.Stdin)
  fmt.Println("Ping")
  for scanner.Scan() {
    fmt.Printf("Received %s\n", scanner.Text())
  }
}