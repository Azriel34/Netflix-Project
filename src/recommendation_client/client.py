from socket import socket, AF_INET, SOCK_STREAM
import sys

BUFFER_SIZE = 4096

def run_client(dest_ip, dest_port):
    # create a socket with IPv4 and TCP protocol
    s = socket(AF_INET, SOCK_STREAM)
    
    # try to connect to the server, using the IP and port
    s.connect((dest_ip, dest_port))

    # recieve an input
    msg = input()
    # the program dosen't stop
    while True:
        # send the message to the server
        s.send(bytes(msg, 'utf-8'))
        # receive the answer from the server
        data = s.recv(BUFFER_SIZE)
        # print the server's answer
        print(data.decode('utf-8'))
        # recieve another input
        msg = input()
    
    # close the socket, shouldn't be reached
    s.close()


def main():
    # Arguments from the CLI are in sys.argv. The first element is the script name.
    if len(sys.argv) < 3:
        # usage: python client.py <ip> <port>
        return
   
    ip = sys.argv[1]
    port = int(sys.argv[2])

    run_client(ip, port)


# This ensures that the main function is called when running
if __name__ == "__main__":
    main()
