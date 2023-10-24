## Connect from docker container running in a bridge network to services running on host machine
By default, when you run a Docker container, it is connected to the default bridge network (commonly named bridge).
In this network, Docker assigns IP addresses from the 172.17.0.0/16 subnet.
The host machine is typically assigned the IP address 172.17.0.1 in this subnet (this is the interface Docker0).

However, docker compose will create a new bridge network with different ip range - for ex 172.19.0.0/16 - everytime you run the `docker compose up` command!
The host machine will be assigned the IP 172.19.0.1 in this network

How to connect from docker container running in a bridge network to services running on host machine
https://stackoverflow.com/questions/48546124/what-is-linux-equivalent-of-host-docker-internal/67158212#67158212
https://github.com/docker/for-linux/issues/264#issuecomment-784985736