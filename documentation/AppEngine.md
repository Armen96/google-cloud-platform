### App Engine

```
app.yaml file content
# Langugae
runtime: nodejs14

# Application service name
service: default

Then run
gcloud app deploy app.yaml

Deploy 2 more versions
gcloud app deploy app.yaml --version=v1
gcloud app deploy app.yaml --version=v2 --no-promote

Migrate traffic randomly
gcloud app services set-traffic default --splits=v1=0.5,v2=0.5 --split-by=random

Split by random, ip or by cookie
```


