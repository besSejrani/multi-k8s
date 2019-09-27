docker build -t bes1815/multi-client:latest -f -t bes1815/multi-client:$SHA ./client/Dockerfile ./client
docker build -t bes1815/multi-server:latest -f -t bes1815/multi-server:$SHA ./server/Dockerfile ./server
docker build -t bes1815/multi-worker:latest -f -t bes1815/multi-worker:$SHA ./worker/Dockerfile ./worker

docker push bes1815/multi-client:latest
docker push bes1815/multi-server:latest
docker push bes1815/multi-worker:latest

docker push bes1815/multi-client:$SHA
docker push bes1815/multi-server:$SHA
docker push bes1815/multi-worker:$SHA

kubectl apply -f kubernetes
kubectl set image deployments/server-deployment server=bes1815/multi-server:$SHA
kubectl set image deployments/client-deployment client=bes1815/multi-client:$SHA
kubectl set image deployments/worker-deployment worker=bes1815/multi-worker:$SHA