### Deployment Manager

```

Mandatory property: "resources" 

resources: 
    name: 
    type: 
    properties:
    
    
gcloud deployment-manager deployments create DEPLOYMENT_NAME --config config.yaml

gcloud deployment-manager deployments update DEPLOYMENT_NAME --config config.yaml

gcloud deployment-manager deployments delete DEPLOYMENT_NAME

// Preview
gcloud deployment-manager deployments create DEPLOYMENT_NAME --config config.yaml --preview

```


