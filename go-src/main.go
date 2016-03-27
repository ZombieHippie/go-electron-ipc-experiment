package main

import (
    "bufio"
    "fmt"
    "os"
    "encoding/json"
    "reflect"
    "errors"
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

type multiplyData struct {
    By      float64
    It      float64
}

func setField(obj interface{}, name string, value interface{}) error {
    structValue := reflect.ValueOf(obj).Elem()
    structFieldValue := structValue.FieldByName(name)

    if !structFieldValue.IsValid() {
        return fmt.Errorf("No such field: %s in obj\n", name)
    }

    if !structFieldValue.CanSet() {
        return fmt.Errorf("Cannot set %s field value\n", name)
    }

    structFieldType := structFieldValue.Type()
    val := reflect.ValueOf(value)
    if structFieldType != val.Type() {
        return errors.New("Provided value type didn't match obj field type")
    }

    structFieldValue.Set(val)
    return nil
}

func (s *multiplyData) FillStruct(m map[string]interface{}) error {
    for k, v := range m {
        err := setField(s, k, v)
        if err != nil {
            return err
        }
    }
    return nil
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
        var slcD response
        if req.Command == "multiply" {
            data, ok := req.Data.(map[string]interface{})
            if ok {
                result := &multiplyData{}
                err := result.FillStruct(data)
                if err != nil {
                    slcD = response{
                        req.ResponseID,
                        err.Error(),
                    }
                } else {
                    slcD = response{
                        req.ResponseID,
                        result.It * result.By,
                    }
                }
            } else {
                slcD = response{req.ResponseID, nil}
            }
        } else {
            slcD = response{req.ResponseID, req.Data}
        }
        slcB, _ := json.Marshal(slcD)
        writer.Write(slcB)
        writer.WriteRune('\n')
        writer.Flush()
    }
}