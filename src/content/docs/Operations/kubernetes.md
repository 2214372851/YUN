---
title: Kubernetes 基础
---

## kubectl

### 基本信息

```shell
kubectl --help			# 查看帮助
kubectl api-versions	# 查看 API 版本
kubectl cluster-info	# 查看集群信息
```

### 查看信息

```shell
kubectl get nodes	# 查看集群节点信息
kubectl get pods	# 简写 po 查看 Pod 信息
kubectl get svc		# 查看 Service
kubectl get deploy	# 查看 Deploy
kubectl get rs		# 查看 ReplicaSet
kubectl get cm		# 查看 ConfigMap
kubectl get secret	# 查看 Secret
kubectl get ing		# 查看 Ingress
kubectl get pv		# 查看 PersistentVolume
kubectl get pvc		# 查看 PersistentVolumeClaim
kubectl get ns		# 查看 Namespace
kubectl get node	# 查看 Node
kubectl get all		# 查看所有资源
kubectl get pods -o wide	# 查看详细信息
kubectl get pod nginx		# kubectl describe RESOURCE NAME 查看某类型资源信息
```

### 运行创建

```shell
kubectl run nginx --image=nginx	# 创建并运行一个名字为nginx的Pod

kubectl create deployment nginx-deploy --image=nginx # 创建 Nginx 的 Doployment资源

kubectl create -f nginx.yaml # 根据nginx.yaml配置文件创建资源

kubectl create -f https://k8s.io/examples/application/deployment.yaml # 根据URL创建资源

kubectl create -f ./dir # 根据目录下的所有配置文件创建资源

kubectl apply -f (-k DIRECTORY | -f FILENAME | stdin) # 通过文件名或标准输入配置资源

kubectl apply -n default -f nginx.yaml # 根据 nginx.yaml 配置文件在命名空间 default 创建资源
```

### 调试交互

```shell
kubectl logs nginx-pod # 查看名为 nginx-pod 的 Pod 日志

kubectl port-forward nginx-pod 8080:80 # 将名为 nginx-pod 的 Pod 的80端口转发到本地

kubectl attach POD -c CONTAINER # 连接到现有的某个 Pod（将某个Pod的标准输入输出转发到本地）

kubectl run nginx --image=nginx -- /bin/bash # 运行名字为 nginx 的 Pod 容器启动时执行 bash 而不是默认 nginx 服务
```

### 修改删除清理

```shell
kubectl label pod nginx app=test pr=xxx # 更新名字为nginx的Pod的标签

kubectl delete pod nginx # 删除名字为nginx的Pod

kubectl delete pod --all # 删除 Pod 的所有实例

kubectl delete -f FILENAME # 根据YAML配置文件删除资源

kubectl scale --replicas=3 deployment/nginx # 设置名为 nginx 的 Deployment 的副本数

kubectl replace -f nginx.yaml # 根据nginx.yaml配置文件替换名字为nginx的Deployment

kubectl edit deploy nginx-test # 修改名为 nginx-test 的 Deployment 配置
```

## 部署配置文件

```yaml
kind: ConfigMap # 定义资源类型为ConfigMap
apiVersion: v1 # 指定Kubernetes API版本为v1
metadata:
  name: configmap-nginx-deploy
  namespace: default
data: # 配置数据
  DB_HOST: "7891" # key:value
---

apiVersion: apps/v1 # 指定Kubernetes API版本为apps/v1
kind: Deployment # 定义资源类型为Deployment部署
metadata: # 元数据部分，包含资源的基本信息
  name: nginx-deploy # 部署的名称
  namespace: default # 部署所在的命名空间
  labels: # 标签，用于标识和选择资源
    app: nginx-deploy # 应用标签，值为nginx-deploy
spec: # 部署的详细规格配置
  selector: # 选择器，用于匹配要管理的Pod
    matchLabels: # 匹配标签的方式
      app: nginx-deploy # 匹配带有此标签的Pod
  replicas: 1 # 指定Pod副本数量为1个
  strategy: # 部署更新策略
    rollingUpdate: # 滚动更新配置
      maxSurge: 25% # 更新时最多可以超出期望副本数的25%
      maxUnavailable: 25% # 更新时最多可以有25%的Pod不可用
    type: RollingUpdate # 更新类型为滚动更新
  template: # Pod模板，定义要创建的Pod
    metadata: # Pod的元数据
      labels: # Pod的标签
        app: nginx-deploy # Pod标签，与selector匹配
    spec: # Pod的具体规格
      # initContainers:  # 初始化容器配置（已注释）
      # Init containers are exactly like regular containers, except:  # 初始化容器说明
      # - Init containers always run to completion.  # 初始化容器总是运行到完成
      # - Each init container must complete successfully before the next one starts.  # 每个初始化容器必须成功完成后才能启动下一个
      containers: # 容器列表
        - name: nginx-deploy # 容器名称
          image: nginx:latest # 容器镜像及标签
          resources: # 资源限制和请求
            requests: # 资源请求，容器启动时保证的资源
              cpu: 100m # CPU请求100毫核
              memory: 100Mi # 内存请求100MB
            limits: # 资源限制，容器能使用的最大资源
              cpu: 100m # CPU限制100毫核
              memory: 100Mi # 内存限制100MB
          livenessProbe: # 存活探针，检查容器是否还在运行
            tcpSocket: # 使用TCP套接字检查
              port: 80 # 检查80端口
            initialDelaySeconds: 5 # 容器启动后5秒开始检查
            timeoutSeconds: 5 # 每次检查超时时间5秒
            successThreshold: 1 # 成功1次认为探针成功
            failureThreshold: 3 # 失败3次认为探针失败
            periodSeconds: 10 # 每10秒检查一次
          readinessProbe: # 就绪探针，检查容器是否准备好接收流量
            httpGet: # 使用HTTP GET请求检查
              path: / # 健康检查路径
              port: 80 # 检查80端口
            initialDelaySeconds: 5 # 容器启动后5秒开始检查
            timeoutSeconds: 2 # 每次检查超时时间2秒
            successThreshold: 1 # 成功1次认为探针成功
            failureThreshold: 3 # 失败3次认为探针失败
            periodSeconds: 10 # 每10秒检查一次
          env: # 环境变量列表
            - name: DB_HOST # 环境变量名称
              valueFrom: # 从其他资源获取值
                configMapKeyRef: # 从ConfigMap获取
                  name: nginx-deploy # ConfigMap名称
                  key: DB_HOST # ConfigMap中的键名
          ports: # 容器端口配置
            - containerPort: 80 # 容器内部端口80
              name: nginx-deploy # 端口名称
          volumeMounts: # 卷挂载配置
            - name: localtime # 挂载的卷名称
              mountPath: /etc/localtime # 容器内挂载路径
      volumes: # 卷定义
        - name: localtime # 卷名称
          hostPath: # 主机路径类型的卷
            path: /usr/share/zoneinfo/Asia/Shanghai # 主机上的路径，用于设置时区
      restartPolicy: Always # 重启策略，总是重启失败的容器

---

apiVersion: v1 # 指定Kubernetes API版本为v1
kind: Service # 定义资源类型为Service
metadata:
  name: nginx-deploy
  namespace: default
spec:
  selector:
    app: nginx-deploy
  type: NodePort # 服务类型默认为 ClusterIP 内部服务
  sessionAffinity: None
  sessionAffinityConfig: # 会话亲和性配置
    clientIP: # 客户端IP
      timeoutSeconds: 10800 # 超时时间为10800秒
  ports: # 端口配置
  - name: nginx-deploy # 端口名称
    protocol: TCP # 使用TCP协议
    port: 80 # 服务端口
    targetPort: 80 # 容器端口
    # If you set the `spec.type` field to `NodePort` and you want a specific port number,
    # you can specify a value in the `spec.ports[*].nodePort` field.
    nodePort: 30080 # NodePort 每个节点的指定端口进行访问，范围需要在 30000-32767 之间
```

