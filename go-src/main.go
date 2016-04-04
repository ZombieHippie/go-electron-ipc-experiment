package main

import (
	"bufio"
	"fmt"
	"os"

	"github.com/golang/protobuf/proto"
	pb "github.com/ZombieHippie/go-electron-ipc-experiment/protobuf-build"
)

func compute(op *pb.MathOperation) *pb.MathResult {
	lhs := op.LeftHandSide
	rhs := op.RightHandSide
	var res float32
	var err string
	switch op.Operation {
	case pb.MathOperation_ADD:
		res = lhs + rhs
	case pb.MathOperation_SUBTRACT:
		res = lhs - rhs
	case pb.MathOperation_MULTIPLY:
		res = lhs * rhs
	case pb.MathOperation_DIVIDE:
		if rhs == 0 {
			err = "Cannot divide by zero"
		} else {
			res = lhs / rhs
		}
	default:
		err = "Unknown OperationType"
	}
	return &pb.MathResult{
		Id: op.Id,
		Result: res,
		Error: err,
	}
}

func main() {
	scanner := bufio.NewScanner(os.Stdin)
	writer := bufio.NewWriter(os.Stdout)
	errorWriter := bufio.NewWriter(os.Stderr)


	//fmt.Println("Ping")
	for scanner.Scan() {
		// Always of form [ cmd: string, id: string, data: {}interface ]
		reqt := &pb.MathOperation{}
		src := scanner.Bytes()
		if len(src) == 0 {
			continue
		}
		fmt.Println("src",src)
		if err := proto.Unmarshal(src, reqt); err != nil {
			fmt.Fprintln(errorWriter, "Error marshalling", err)
		}
		fmt.Println("reqt",reqt)
		res := compute(reqt)
		out, err := proto.Marshal(res)

		fmt.Println("out",out)
		if err != nil {
			msg := fmt.Sprintln("Failed to encode math result", err)
			errorWriter.WriteString(msg)
			errorWriter.WriteRune('\n')
			errorWriter.Flush()
		} else {
			writer.Write(out)
			writer.WriteRune('\n')
			writer.Flush()
		}
	}
}
