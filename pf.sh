#!/bin/bash
while true; do
  kubectl port-forward svc/user-service 8081:8081 -n stock-portfolio --address 0.0.0.0
  sleep 2
done &

while true; do
  kubectl port-forward svc/price-prediction 8000:8000 -n stock-portfolio --address 0.0.0.0
  sleep 2
done &

while true; do
  kubectl port-forward svc/api-gateway 8087:8087 -n stock-portfolio --address 0.0.0.0
  sleep 2
done &

while true; do
  kubectl port-forward svc/kibana 5601:5601 -n stock-portfolio --address 0.0.0.0
  sleep 2
done &
