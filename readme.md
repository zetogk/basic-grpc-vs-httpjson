# Basic GRPC vs HTTP/JSON

## Description
The purpose of this project is for learning and demo in a Kubernetes Medellín MeetUp.

In this project you can compare the speed between call a gRPC service and a HTTP request to send a base64-image.

**This is not a benchmark, is just a test comparing both ways to consume microservices**


## Running

### Mongo

* You should have a Mongo instande running.
* Ensure update the *.envrc* files of backend projects with Mongo data.

### Web

* `npm run serve`

### 'Rest' interface
* `source .envrc`
* `npm run start`

### Micro-service exposed on HTTP-JSON
* `source .envrc`
* `npm run start`

### Micro-service exposed on gRPC
* `source .envrc`
* `npm run start`

## Authors
Santiago Yepes <zetogk@gmail.com>