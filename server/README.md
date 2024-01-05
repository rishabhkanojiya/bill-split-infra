# Bill-Split

Deployed rishabh75/**bill-split** :

```
docker build -t bill-split:latest .
docker tag bill-split:latest rishabh75/bill-split:1.0
docker push rishabh75/bill-split:1.0
```

Delete All :

```
kubectl delete pv --all
kubectl delete --all deployments,services,configmaps,pods --namespace=default
```
