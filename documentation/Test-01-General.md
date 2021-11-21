## General TEST 01

### Preemptible VMs ~ Spot VMs
```
// Cutting cost
// Use preemptible VMs to run fault-tolerant workloads/batch-processing
// Create a cluster or node pool with preemptible VMs

gcloud container clasters create [CLUSER_NAME] --preemptible

gcloud container node-pools create [POOL_NAME] --cluster=[CLUSTER_NAME] --preemptible

// Autoscaling
gcloud container clusers create [CLUSTER_NAME] --enable-autoscaling --min-nodes 2 --max-nodes 6 
```
 
### Auto-provisioning (diff is metrics) (автоматическая подготовка )
```
// Node auto-provisioning automatically manages a set of node pools on the user's behalf.
// Without node auto-provisioning, GKE starts new nodes only from user-created node pools.
// With node auto-provisioning, new node pools are created and deleted automatically.

gcloud container clusters update CLUSTER_NAME \
    --enable-autoprovisioning \
    --min-cpu MINIMUM_CPU \
    --min-memory MIMIMUM_MEMORY \
    --max-cpu MAXIMUM_CPU \
    --max-memory MAXIMUM_MEMORY
```

### Health checking and auto healing
```
// Compute health-checks and firewall-rules
gcloud compute health-checks create http example-check --port 80 \
       --check-interval 30s \
       --healthy-threshold 1 \
       --timeout 10s \
       --unhealthy-threshold 3
       
gcloud compute firewall-rules create allow-health-check \
        --allow tcp:80 \
        --source-ranges 130.211.0.0/22,35.191.0.0/16 \
        --network default
```

### Cloud Marketplace

### App Engine traffic split 
```
1. Trafic migration (switches request routing)
2. Trafic spliting 

gcloud app services set-trafic 
gcloud app services set-traffic s1 --splits=v2=.5,v1=.5 (50% - s1, 50% - v1)
                                 \ --splits
                                 \ --migrate
                                 \ --split-by values ip, cookie, random

```

### Cloud function type Cloud Storage
```
– google.storage.object.finalize (default)

– google.storage.object.delete

– google.storage.object.archive

– google.storage.object.metadataUpdate

gcloud functions deploy helloGCS \
--runtime nodejs16 \
--trigger-resource YOUR_TRIGGER_BUCKET_NAME \
--trigger-event google.storage.object.delete
```

### Dataproc and Dataflow

Cloud Dataproc provides you with a Hadoop cluster, on GCP, and access to Hadoop-ecosystem tools (e.g. Apache Pig, Hive, and Spark); this has strong appeal if you are already familiar with Hadoop tools and have Hadoop jobs
Cloud Dataflow provides you with a place to run Apache Beam based jobs, on GCP, and you do not need to address common aspects of running jobs on a cluster (e.g. Balancing work, or Scaling the number of workers for a job; by default, this is automatically managed for you, and applies to both batch and streaming) -- this can be very time consuming on other systems
Apache Beam is an important consideration; Beam jobs are intended to be portable across "runners," which include Cloud Dataflow, and enable you to focus on your logical computation, rather than how a "runner" works -- In comparison, when authoring a Spark job, your code is bound to the runner, Spark, and how that runner works
Cloud Dataflow also offers the ability to create jobs based on "templates," which can help simplify common tasks where the differences are parameter values

### How Instances are Managed
```
Types -> AUTOMATIC BASIC MANUAL

basic_scaling:  max_instances: 10  idle_timeout: 5m

max_idle_instances
    Optional. The maximum number of idle instances that App Engine should maintain for this version.
    Specify a value from 1 to 1000. If not specified, the default value is automatic, which means App Engine will manage the number of idle instances. Keep the following in mind: 
```

### Deployment manager
```
A configuration describes all the resources you want for a single deployment.

resources:
- name: the-first-vm
  type: compute.v1.instance
  properties:
    zone: us-central1-a
    machineType: https://www.googleapis.com/compute/v1/projects/myproject/zones/us-central1-a/machineTypes/f1-micro
    disks:
    - deviceName: boot
      type: PERSISTENT
      boot: true
      autoDelete: true
      initializeParams:
        sourceImage: https://www.googleapis.com/compute/v1/projects/debian-cloud/global/images/debian-7-wheezy-v20150423
    networkInterfaces:
    - network: https://www.googleapis.com/compute/v1/projects/myproject/global/networks/default
      accessConfigs:
      - name: External NAT
        type: ONE_TO_ONE_NAT
```

### Cloud Run and Cloud Run for Anthos
```
Cloud Run
The Cloud Run platform allows you to deploy stateless containers without having to worry about the underlying infrastructure.
Your workloads are automatically scaled out or in to zero depending on the traffic to your app.

```

### Listing Services
```
gcloud services list --enabled --available

```

Storage Object Creator (roles/storage.objectCreator)
Storage Object Admin (roles/storage.objectAdmin)

### Private Google Access (not External IP they are not the same)

```
gcloud compute instance-groups managed set-autoscaling example-managed-instance-group \
  --max-num-replicas 20 \
  --target-cpu-utilization 0.60 \
  --cool-down-period 90
```


### VPC Network Peering
### Shared VPC (Organization level, share projects VPCs)
### Toggling deletion protection for existing instances (compute.instances.create)

### DaemonSet | ConfigMap | StatefulSet
```

Like other workload objects,a DaemonSet manages groups of replicated Pods.
However, DaemonSets attempt to adhere to a one-Pod-per-node model

```

### Troubleshoot Applications
```
If a Pod is stuck in Pending status, it means that it can’t be scheduled onto a node.
1. You don't have enough resources:
2. You are using hostPort

Waiting
1. Make sure that you have the name of the image correct.
2. Have you pushed the image to the repository?
3.  Run a manual docker pull <image> on your machine to see if the image can be pulled.

Debugging a Pod
kubectl describe pods PodName
```

### Data Studio | Data Catalog
```
Data Studio Free: data visualization tool 
Data Catalog descovery and metadata managment
```

### Creating a configuration
```
gcloud config configurations create DEV
gcloud config configuration create STAGE

gcloud config list
gcloud config configurations list
gcloud config configuration activate DEV

gcloud config set project PROJECT)ID
```

### IAM copy role
```
gcloud iam roles copy 

gcloud iam roles copy --source="roles/spanner.databaseAdmin" --destination=CustomViewer --dest-organization=1234567
gcloud iam roles copy 
                        [--dest-organization=DEST_ORGANIZATION]
                        [--dest-project=DEST_PROJECT]
                        [--destination=DESTINATION] 
                        [--source=SOURCE] 
                        [--source-organization=SOURCE_ORGANIZATION] 
                        [--source-project=SOURCE_PROJECT] 
                        [GCLOUD_WIDE_FLAG …]
                        
```

### Network configuration
```
private.googleapis.com (199.36.153.8/30) 
restricted.googleapis.com (199.36.153.4/30)
```

### Auto-upgrading nodes  --enable-autoupgrade
### Auto-repairing nodes  --enable-autorepair
