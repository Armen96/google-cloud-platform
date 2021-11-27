### Networking

```
// PROJECT 1
// Create Cusom VPC
gcloud compute networks create network-a --subnet-mode custom

// Create subnet
gcloud compute networks subnets create network-a-central1 --network network-a --range 10.0.0.0/16 --region us-central1

// Create VM
gcloud compute instances create instance-net-1 --network network-a --zone us-central1-a --subnet network-a-central1 

// Attach firewall-rules
gcloud compute firewall-rules create network-a-fw --network network-a --allow tcp:22,icmp 


// PROJECT 2
// Create Cusom VPC
gcloud compute networks create network-b --subnet-mode custom

// Create subnet
gcloud compute networks subnets create network-b-central1 --network network-b --range 10.0.0.0/16 --region us-central1

// Create VM
gcloud compute instances create instance-net-1 --network network-b --zone us-central1-a --subnet network-b-central1 

// Attach firewall-rules
gcloud compute firewall-rules create network-b-fw --network network-b --allow tcp:22,icmp 

// VPC Peering
```


