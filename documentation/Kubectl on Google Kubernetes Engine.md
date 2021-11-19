### Getting started with Kubectl on Google Kubernetes Engine
(doc: https://jamesdefabia.github.io/docs/user-guide/kubectl)


```

gcloud container clusters create my-cluster --num-nodes 1 --zone us-central1-a

gcloud container clusters get-credentials my-cluster

kubectl cluster-info

kubectl config

kubectl top nodes

kubectl run nginx-1 --image nginx:latest

kubectl get pods

kubectl describe pod nginx-1

kubectl scale --replicas=3 rc/foo

kubectl autoscale deployment foo --min=2 --max=10 --cpu-percent=80

gcloud container clusters delete my-cluster

```
 

