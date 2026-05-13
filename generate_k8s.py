import yaml

services = {
    "zookeeper": {"image": "confluentinc/cp-zookeeper:7.4.0", "port": 2181, "env": {"ZOOKEEPER_CLIENT_PORT": "2181", "ZOOKEEPER_TICK_TIME": "2000"}},
    "kafka": {"image": "confluentinc/cp-kafka:7.4.0", "port": 9092, "env": {"KAFKA_BROKER_ID": "1", "KAFKA_ZOOKEEPER_CONNECT": "zookeeper:2181", "KAFKA_ADVERTISED_LISTENERS": "PLAINTEXT://kafka:9092,PLAINTEXT_HOST://localhost:29092", "KAFKA_LISTENER_SECURITY_PROTOCOL_MAP": "PLAINTEXT:PLAINTEXT,PLAINTEXT_HOST:PLAINTEXT", "KAFKA_INTER_BROKER_LISTENER_NAME": "PLAINTEXT", "KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR": "1"}},
    "postgres": {"image": "postgres:15-alpine", "port": 5432, "env": {"POSTGRES_USER": "root", "POSTGRES_PASSWORD": "rootpassword", "POSTGRES_DB": "stock_portfolio"}},
    "redis": {"image": "redis:7-alpine", "port": 6379},
    "vault": {"image": "vault:1.13.2", "port": 8200, "env": {"VAULT_DEV_ROOT_TOKEN_ID": "root", "VAULT_DEV_LISTEN_ADDRESS": "0.0.0.0:8200"}},
    "elasticsearch": {"image": "elasticsearch:8.8.1", "port": 9200, "env": {"discovery.type": "single-node", "xpack.security.enabled": "false", "ES_JAVA_OPTS": "-Xms512m -Xmx512m"}},
    "kibana": {"image": "kibana:8.8.1", "port": 5601, "env": {"ELASTICSEARCH_HOSTS": "http://elasticsearch:9200"}},
    "logstash": {"image": "logstash:8.8.1", "port": 5044},
    "config-server": {"image": "ashwins1/spe-stocksys-mjproj:spestocksys-config-server", "port": 8888},
    "eureka-server": {"image": "ashwins1/spe-stocksys-mjproj:spestocksys-eureka-server", "port": 8761},
    "api-gateway": {"image": "ashwins1/spe-stocksys-mjproj:spestocksys-api-gateway", "port": 8087, "env": {"SERVER_PORT": "8087"}},
    "user-service": {"image": "ashwins1/spe-stocksys-mjproj:spestocksys-user-service", "port": 8081},
    "order-service": {"image": "ashwins1/spe-stocksys-mjproj:spestocksys-order-service", "port": 8082},
    "portfolio-service": {"image": "ashwins1/spe-stocksys-mjproj:spestocksys-portfolio-service", "port": 8083},
    "market-data": {"image": "ashwins1/spe-stocksys-mjproj:spestocksys-market-data", "port": 8084},
    "notification-service": {"image": "ashwins1/spe-stocksys-mjproj:spestocksys-notification-service", "port": 8085},
    "risk-service": {"image": "ashwins1/spe-stocksys-mjproj:spestocksys-risk-service", "port": 8086},
    "price-prediction": {"image": "ashwins1/spe-stocksys-mjproj:spestocksys-price-prediction", "port": 8000},
    "frontend-react": {"image": "ashwins1/spe-stocksys-mjproj:spestocksys-frontend-react", "port": 5173, "type": "NodePort"}
}

vault_env = [
    {
        "name": "VAULT_TOKEN",
        "valueFrom": {
            "secretKeyRef": {
                "name": "vault-keys",
                "key": "token"
            }
        }
    },
    {
        "name": "SPRING_DATASOURCE_PASSWORD",
        "valueFrom": {
            "secretKeyRef": {
                "name": "vault-keys",
                "key": "db_password"
            }
        }
    }
]

default_resources = {
    "requests": {"cpu": "250m", "memory": "256Mi"},
    "limits": {"cpu": "500m", "memory": "512Mi"}
}

heavy_resources = {
    "requests": {"cpu": "500m", "memory": "1Gi"},
    "limits": {"cpu": "1000m", "memory": "2Gi"}
}

with open("k8s/deployment.yaml", "w") as f:
    for name, data in services.items():
        # Service
        svc = {
            "apiVersion": "v1",
            "kind": "Service",
            "metadata": {"name": name, "namespace": "stock-portfolio"},
            "spec": {
                "selector": {"app": name},
                "ports": [{"port": data["port"], "targetPort": data["port"]}]
            }
        }
        if "type" in data:
            svc["spec"]["type"] = data["type"]
            if data["type"] == "NodePort" and name == "frontend-react":
                svc["spec"]["ports"][0]["nodePort"] = 30173

        # Deployment
        env_list = [{"name": k, "value": str(v)} for k, v in data.get("env", {}).items()]
        # Append Vault env vars
        env_list.extend(vault_env)

        # Assign resources based on service
        res = heavy_resources if name in ["elasticsearch", "kafka", "logstash"] else default_resources

        dep = {
            "apiVersion": "apps/v1",
            "kind": "Deployment",
            "metadata": {"name": name, "namespace": "stock-portfolio"},
            "spec": {
                "replicas": 1,
                "strategy": {"type": "Recreate"},
                "selector": {"matchLabels": {"app": name}},
                "template": {
                    "metadata": {"labels": {"app": name}},
                    "spec": {
                        "hostNetwork": True,
                        "enableServiceLinks": False, # CRITICAL: Prevents Kafka KAFKA_PORT env var crash!
                        "containers": [{
                            "name": name,
                            "image": data["image"],
                            "imagePullPolicy": "IfNotPresent",
                            "ports": [{"containerPort": data["port"]}],
                            "env": env_list,
                            "resources": res
                        }]
                    }
                }
            }
        }
        f.write("---\n")
        yaml.dump(svc, f)
        f.write("---\n")
        yaml.dump(dep, f)

print("Generated full k8s/deployment.yaml with enableServiceLinks: False")
