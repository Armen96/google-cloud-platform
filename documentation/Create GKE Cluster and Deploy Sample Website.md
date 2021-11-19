### Google Kubernetes Engine: Create GKE Cluster and Deploy Sample Website!

Open the Google cloud shell
Select a project using gcloud config command 

```
gcloud config set project [PROJECT_NAME]

// Then you need to run docker image
docker run -p 8080:80 nginx:latest

// See all running containers (add -a parameter to see all available containers)
docker ps

// Create index.html file and deploy inside your container
docker cp index.html [container-id]:/usr/share/nginx/html/

// Deploy into Container Registery
docker commit [container-id] cad/web:version1
docker tag cad/web:version1 us.gcr.io/[PROJECT_NAME]/cad-site:version1
docker push us.gcr.io/[PROJECT_NAME]/cad-site:version1

// Creating a GKE cluster
gcloud container clusters create gk-cluster --num-nodes=1
gcloud container clusters get-credentials gk-cluster // <- init kubectl


// Deploying an application to the cluster
kubectl create deployment web-server --image=us.gcr.io/[PROJECT_NAME]/cad-site:version1

// Exposing the Deployment (Make publicly available) expose type LoadBalancer or use Ingress
kubectl expose deployment web-server --type LoadBalancer --port 80 --target-port 80

(maket: kubectl expose (-f FILENAME | TYPE NAME) [--port=port] [--protocol=TCP|UDP] [--target-port=number-or-name] [--name=name] [--external-ip=external-ip-of-service] [--type=type])
(doc: https://jamesdefabia.github.io/docs/user-guide/kubectl/kubectl_expose/)

Parameters
--type="": Type for this service: ClusterIP, NodePort, or LoadBalancer. Default is 'ClusterIP'.
--port="": The port that the service should serve on. Copied from the resource being exposed, if unspecified.
--target-port="": Name or number for the port on the container that the service should direct traffic to. Optional.

// Get pods
kubectl get pods

```
 

