package main

import (
	"bufio"
	"errors"
	"log"
	"net"
	"os"

	pb "github.com/ZombieHippie/go-electron-ipc-experiment/mathoperation"
	"golang.org/x/net/context"
	"google.golang.org/grpc"
)

const (
	port = ":49050"
)

// server is used to implement mathoperation.CalculatorServer
type server struct{}

// Compute implements mathoperation.CalculatorServer
func (s *server) Compute(ctx context.Context, in *pb.MathOperation) (*pb.MathResult, error) {
	res := compute(in)
	var err error
	if len(res.Error) > 0 {
		err = errors.New(res.Error)
	}
	return res, err
}

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
		Id:     op.Id,
		Result: res,
		Error:  err,
	}
}

func main() {
	lis, err := net.Listen("tcp", port)
	if err != nil {
		log.Fatalf("failed to listen: %v", err)
	}
	s := grpc.NewServer()
	pb.RegisterCalculatorServer(s, &server{})
	s.Serve(lis)
	writer := bufio.NewWriter(os.Stdout)
	writer.WriteString(port)
}
