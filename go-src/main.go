package main

import (
    "bufio"
    "fmt"
    "os"
    "encoding/json"
    // "strings"
)

type response struct {
    ResponseID  string      `json:"id"`
    Data        interface{} `json:"data"`
}

type request struct {
    Command     string      `json:"cmd"`
    ResponseID  string      `json:"id"`
    Data        interface{} `json:"data"`
}

func main () {
    scanner := bufio.NewScanner(os.Stdin)
    writer := bufio.NewWriter(os.Stdout)
    fmt.Println("Ping")
    for scanner.Scan() {
        // Always of form [ cmd: string, id: string, data: {}interface ]
        src := scanner.Bytes()
        var req request
        // Here's the actual decoding, and a check for
        // associated errors.
        if err := json.Unmarshal(src, &req); err != nil {
            panic(err)
        }
        slcD := response{req.ResponseID, req.Data}
        slcB, _ := json.Marshal(slcD)
        writer.Write(slcB)
        writer.WriteRune('\n')
        writer.Flush()
    }
}