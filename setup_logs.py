import os
import re

microservices = [
    'api-gateway', 'config-server', 'eureka-server', 'user-service',
    'order-service', 'portfolio-service', 'market-data', 'risk-service',
    'notification-service'
]

logback_xml = """<?xml version="1.0" encoding="UTF-8"?>
<configuration>
    <include resource="org/springframework/boot/logging/logback/defaults.xml"/>
    
    <!-- Console Appender -->
    <appender name="CONSOLE" class="ch.qos.logback.core.ConsoleAppender">
        <encoder>
            <pattern>${CONSOLE_LOG_PATTERN}</pattern>
        </encoder>
    </appender>

    <!-- Logstash TCP Appender -->
    <appender name="LOGSTASH" class="net.logstash.logback.appender.LogstashTcpSocketAppender">
        <destination>logstash:5044</destination>
        <encoder class="net.logstash.logback.encoder.LogstashEncoder">
            <customFields>{"service_name":"${spring.application.name}"}</customFields>
        </encoder>
    </appender>

    <root level="INFO">
        <appender-ref ref="CONSOLE"/>
        <appender-ref ref="LOGSTASH"/>
    </root>
</configuration>
"""

dependency = "\n\timplementation 'net.logstash.logback:logstash-logback-encoder:7.3'"

for service in microservices:
    gradle_path = os.path.join(service, 'build.gradle')
    logback_path = os.path.join(service, 'src', 'main', 'resources', 'logback-spring.xml')
    
    if os.path.exists(gradle_path):
        with open(gradle_path, 'r') as f:
            content = f.read()
            
        if 'logstash-logback-encoder' not in content:
            # Add dependency after "dependencies {"
            new_content = re.sub(r'(dependencies\s*\{)', r'\1' + dependency, content)
            with open(gradle_path, 'w') as f:
                f.write(new_content)
            print(f"Updated {gradle_path}")
            
    if os.path.exists(os.path.dirname(logback_path)):
        with open(logback_path, 'w') as f:
            f.write(logback_xml)
        print(f"Created {logback_path}")
