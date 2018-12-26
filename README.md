# Fushigi - Distributed Rock-Paper-Scissors Matchmaking

## Description

Fushigi is a matchmaking application, which creates private rock-pape-scissors game runners as containers in a cluster.
Fushigi is comprised from several services, which make up the whole system.

These services are: Hub, Scheduler, Runner and Client.

### Hub

Hub accepts connections from players who are willing to play.
When a number of players is enough to play a game, Hub sends a request to Scheduler to create a private Runner.
Hub notifies players with connection details, which then proceed to connect to the Runner.

### Scheduler

When Scheduler receives request to create new Runner,
it talks to Kubernetes API server and creates necessary Kubernetes objects (Deployment, Service, VirtualService).

### Runner

When created, Runner accepts connections from players.
Runner controls game flow and state in order to provide fair and pleasant experience for Clients.

### Client

Client is a browser application which connects to Hub and Runners.
It has all necessary user interfaces in order to play rock-paper-scissors with other players.

## Getting Started

These instructions will help you with getting Fushigi up and running on your local machine.

### Prerequisites

- `minikube` installed on your system
- `helm` installed on your system
- `skaffold` installed on your system
- `https://github.com/istio/istio` git repository cloned

## Deployment instructions

- Coming soon

Keep in mind that this project is a work in progess.
