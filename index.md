title: 前端基于GitLab CI/CD 自动化构建分享
speaker: 西子湖畔
css: ['https://cdn.bootcdn.net/ajax/libs/font-awesome/5.15.3/css/all.min.css', 'custom.css']
js: 
    - custom.js
prismTheme: 'okaidia'
plugins:
    - echarts

<slide class="bg-black-blue aligncenter" image="https://crm-public.hzdahongniang.com/FpWRT9juO0iO9om-HxQX23GObr2o.jpg .dark">

# 前端基于GitLab CI/CD 自动化构建分享  {.text-landing.text-shadow}

By hxz {.text-intro}

<slide class="bg-black-blue aligncenter"  :class="size-80">

:::{.content-center}
### 目录
---

* Docker 入门指南 {.animated.fadeInUp}
* Dockerfile 编写 {.animated.fadeInUp.delay-400}
* GitLab Runner CI/CD 自动化构建 {.animated.fadeInUp.delay-800}

<slide class="bg-black-blue slide-top">

#### Docker是什么

---
:::flexblock
Docker 是允许开发人员，系统管理员等轻松地在沙盒（又称容器）中部署其应用程序以在主机操作系统上运行的工具。 {.text-subtitle .animated.fadeInUp}
:::
---

#### 为什么要用 Docker {.animated.fadeInUp.delay-400}

:::flexblock

使用Docker的主要好处是它可以打包代码及其所有依赖项，因此无论计算环境如何，应用程序都可以快速可靠地运行。{.animated.fadeInUp.delay-800}

通过这种解耦，可以轻松且一致地部署基于容器的应用程序，而不管应用程序将部署在何处：云服务器，内部公司服务器或个人电脑。{ .animated.fadeInUp.delay-1200 .mb-20}

  -   **更快速的启动时间** 
  -   **一致的运行环境** 
  -   **持续交付和部署** 
  -   **更轻松的迁移** 
  -   **更轻松的维护和扩展** 
      { .animated.fadeInUp.delay-1400 } 

:::

<slide class="bg-black-blue slide-top">

#### Docker基本概念 {.bounce.mb-20}

1. 镜像(Image) {.subtitle .fadeInUp}
    :::flexblock {.pmb-20 }
    :Docker镜像是一个特殊的文件系统(相当于Linux的root文件系统)，除了提供容器运行时所需的程序、库、资源、配置等文件外，还包含了一些为运行时准备的一些配置参数（如匿名卷、环境变量、用户等）。镜像不包含任何动态数据，其内容在构建之后也不会被改变。:{ onclick="showExtra('extra number1')"}  
    :镜像构建时，会一层层构建，前一层是后一层的基础。每一层构建完就不会再发生改变，后一层上的任何改变只发生在自己这一层。比如，删除前一层文件的操作，实际不是真的删除前一层的文件，而是仅在当前层标记为该文件已删除。在最终容器运行的时候，虽然不会看到这个文件，但是实际上该文件会一直跟随镜像。因此，在构建镜像的时候，需要额外小心，每一层尽量只包含该层需要添加的东西，任何额外的东西应该在该层构建结束前清理掉。:{.extra.number1 }
    :::
2. 容器(Container){.fadeInUp}   
    :::flexblock {.pmb-20}
    :镜像和容器的关系，就像是面向对象程序设计中的`类`{.inline-code}和`实例`{.inline-code}一样，镜像是静态的定义，容器是镜像运行时的实体。容器可以被创建、启动、停止、删除、暂停等。:{ onclick="showExtra('extra number2')"}  
    
    :每一个容器运行时，是以镜像为基础层，在其上创建一个当前容器的存储层，我们可以称这个为容器运行时读写而准备的存储层为容器存储层。容器存储层的生存周期和容器一样，容器消亡时，容器存储层也随之消亡。因此，任何保存于容器存储层的信息都会随容器删除而丢失。:{.extra.number2}

    :容器不应该向其存储层内写入任何数据，容器存储层要保持无状态化。所有的文件写入操作，都应该使用  数据卷（Volume） 、或者绑定宿主目录，在这些位置的读写会跳过容器存储层，直接对宿主(或网络存储)发生读写，其性能和稳定性更高:{.extra.number2}
    :::
3. 仓库(Repository){.fadeInUp}    
    :::flexblock {.pmb-20}
    :镜像构建完成后，可以很容易的在当前宿主上运行，但是，如果需要在其它服务器上使用这个镜像，我们就需要一个集中的存储、分发镜像的服务， Docker Registry 就是这样的服务。:


<slide class="slide-top bg-black-blue">

#### Docker 常用命令{.bounce}

##### 镜像相关 { .bounceInLeft}

```bash{.zoomIn.delay-400}
# 从 Docker 镜像仓库获取镜像 仓库地址默认Docker Hub （docker.io） 例: 拉取node12镜像 docker pull node:12   可以在hub.docker.com公共镜像仓库内查找
$ docker pull [OPTIONS] [Docker Registry 地址[:端口号]/]仓库名[:标签]   
# 查看本地镜像列表 可查看镜像的 仓库名、标签、镜像 ID、创建时间 以及 所占用的空间
$ docker images [OPTIONS]
# 构建镜像 例 docker build -t build_image_name .
$ docker build [OPTIONS] [上下文路径/URL/-]
# 删除本地镜像 <镜像> 可以是 镜像短 ID、镜像长 ID、镜像名 或者 镜像摘要
$ docker rmi IMAGE [IMAGE ...]
# 清理本地无用镜像
$ docker image prune
```

##### 容器相关 { .bounceInLeft}

```bash{.bounceInLeft.delay-400.slow}
# 新建并启动容器 例 docker run --rm -it -p 8080:80 -v D:\data:/data --name node12 node:12 /bin/bash
# -i 交互式操作 -t 终端 -d: 后台运行容器 --rm 容器退出时删除 -p 指定端口映射 -v 数据卷映射
$ docker run [OPTIONS] IMAGE [CMD]
# 在容器使用后台模式时 可以用此命令进入容器操作 例 docker exec -it node12 /bin/bash
$ docker exec [OPTIONS] CONTAINER 
# 查看正在运行的容器(container)
$ docker ps
# 启动一个或多个容器 例 docker start mydemo
$ docker start [OPTIONS] CONTAINER [CONTAINER...]
# 停止运行中的容器
$ docker stop [OPTIONS] CONTAINER [CONTAINER...]
# 重启容器
$ docker restart [OPTIONS] CONTAINER [CONTAINER...]
# 删除容器 例 docker rm mydemo
$ docker rm [OPTIONS] CONTAINER [CONTAINER...] 
```

<slide class="slide-top bg-black-blue">

#### 使用 Dockerfile 定制镜像 {.bounce .mb-20}

Dockerfile 是一个文本文件，其内包含了一条条的 指令(Instruction)，每一条指令构建一层，因此每一条指令的内容，就是描述该层应当如何构建。{.fadeInRight}

- Dockerfile 常用指令{.fadeInRight}
    - **FROM**  `FROM <image>:<tag>`指定基础镜像
    - **WORKDIR** `WORKDIR <工作目录路径>` 指定工作目录（当前目录），以后各层的当前目录就被改为指定的目录，如该目录不存在，会自动创建目录
    - **RUN**  `RUN <CMD>` 执行命令 
    - **COPY** `COPY <源路径> <目标路径>` 复制文件
    - **ADD**  `ADD <源路径> <目标路径>` 更高级的复制文件 源路径可以是URL 如果是tar压缩文件 复制的同时会自动解压到目标路径
    - **CMD** `CMD ["参数1", "参数2"...]` 容器启动命令 指定默认的容器主进程 守护进程监听的默认进程 **该进程结束容器会退出**
    - **ENTRYPOINT** `ENTRYPOINT ["参数"]` 指定容器启动程序及参数与CMD一样 可以执行预处理脚本
    - **ENV** `ENV <key> <value> | <key1>=<value1> <key2>=<value2>` 设置环境变量
    - **ARG** `ARG <参数名>[=<默认值>]` 构建参数 和ENV的效果一样，都是设置环境变量 但在将来容器运行时是不存在的 只在构建镜像时存在
    - **EXPOSE** `EXPOSE <端口1>  [<端口2>...]` 暴露端口 声明容器运行时提供服务的端口
    - **LABEL** `LABEL <key>=<value> <key>=<value> ...` 给镜像添加元数据 如 申明镜像的作者、文档地址
    {.fadeInRight}


<slide class="slide-top bg-black-blue relative">

#### 构建镜像{.bounce .mb-20}

```docker{.fadeInRight}
# 以nginx镜像为基础构建
FROM nginx:alpine 
# 设置工作目录/app
WORKDIR /app
# 复制源码文件到当前目录  即/app/index.md
COPY index.md .
# 安装node环境支持
RUN apk add --no-cache nodejs npm 
# 安装全局依赖
RUN npm config set registry https://registry.npm.taobao.org && npm i -g nodeppt
# 打包
RUN nodeppt build index.md
# 把打包的静态文件放到nginx访问目录
RUN mv ./dist/* /usr/share/nginx/html/
# 设置默认的启动命令 nginx 前台运行
CMD ["nginx", "-g", "daemon off;"]
```

---

###### 如何构建优秀的镜像(又快又小){.fadeInRight}
  - 使用更加精简的基础镜像{.fadeInUp}
    | Alpine | Debian | Ubuntu |
    | :----------- | :------------: | ------------: |
    | 5.6MB   |   70M   |   79M |
  - 减少镜像构建层数{.fadeInUp onClick="showModal('subImageLayer', this)"}
  - 清理缓存，清理中间产物（必须在同层清理）{.fadeInUp}
  - 配置dockerignore
  - 多段构建{.fadeInUp onClick="showModal('multistageBuild', this)"}


```docker{#subImageLayer onClick="hideModel(this)"}
# 以nginx镜像为基础构建
FROM nginx:alpine 
# 设置工作目录/app
WORKDIR /app

# 复制源码文件到当前目录  即/app/index.md
COPY index.md .

# 安装node环境支持
RUN apk add --no-cache --virtual .build-deps \
    nodejs \
    npm && \
    npm config set registry https://registry.npm.taobao.org && \
    npm i -g nodeppt && \
    nodeppt build index.md && \
	npm cache clean --force && \
	rm -rf /usr/local/lib/node_modules && \
    apk del --no-network .build-deps && \
    mv ./dist/* /usr/share/nginx/html/

# 设置默认的启动命令 nginx 前台运行
CMD ["nginx", "-g", "daemon off;"]
```

```docker{#multistageBuild onClick="hideModel(this)"}
#构建builder部分
FROM node:12-alpine as builder

WORKDIR /app

RUN npm config set registry https://registry.npm.taobao.org && npm i -g nodeppt

COPY index.md .

RUN nodeppt build index.md

#最终镜像
FROM nginx:alpine

COPY --from=builder /app/dist/  /usr/share/nginx/html/

CMD ["nginx", "-g", "daemon off;"]
```

  


<slide class="slide-top bg-black-blue">

#### 构建镜像{.bounce .mb-20}

```bash{.fadeInRight}
# 构建镜像
$ docker build . -t share_docker_demo

[+] Building 5.4s (12/12) FINISHED
 => [internal] load build definition from Dockerfile                                                               0.0s
 => => transferring dockerfile: 262B                                                                               0.0s
 => [internal] load .dockerignore                                                                                  0.0s
 => => transferring context: 2B                                                                                    0.0s
 => [internal] load metadata for docker.io/library/nginx:alpine                                                    0.0s
 => [1/7] FROM docker.io/library/nginx:alpine                                                                      0.0s
 => [internal] load build context                                                                                  0.0s
 => => transferring context: 8.36kB                                                                                0.0s
 => CACHED [2/7] WORKDIR /app                                                                                      0.0s
 => CACHED [3/7] RUN apk add --no-cache nodejs npm                                                                 0.0s
 => CACHED [4/7] RUN npm i -g nodeppt                                                                              0.0s
 => [5/7] COPY index.md .                                                                                          0.0s
 => [6/7] RUN nodeppt build index.md                                                                               4.8s
 => [7/7] RUN mv ./dist/* /usr/share/nginx/html/                                                                   0.3s
 => exporting to image                                                                                             0.1s
 => => exporting layers                                                                                            0.1s
 => => writing image sha256:d450aec860a9e2382d57619026ec5140f83615d6fa5e8f1c15ad6353cff31a8e                       0.0s
 => => naming to docker.io/library/share_docker_demo                                                               0.0s

Use 'docker scan' to run Snyk tests against images to find vulnerabilities and learn how to fix them
```

<slide class="slide-top bg-black-blue">

#### 构建镜像{.bounce .mb-20}

##### 查看以构建镜像{.bounce }

```bash{.fadeInRight}
$ docker images

REPOSITORY                                                    TAG                  IMAGE ID       CREATED         SIZE
share_docker_demo                                             latest               d450aec860a9   3 minutes ago   193MB
less_layout_demo                                              latest               6f307820d7c3   1 hours ago   23.2MB
multisatge_demo                                               latest               e8b91a443cdb   8 hours ago     23MB
```

##### 启动容器{.bounce}

```bash{.fadeInRight}
$ docker run --rm -it -p 8888:80 share_docker_demo

/docker-entrypoint.sh: /docker-entrypoint.d/ is not empty, will attempt to perform configuration
/docker-entrypoint.sh: Looking for shell scripts in /docker-entrypoint.d/
/docker-entrypoint.sh: Launching /docker-entrypoint.d/10-listen-on-ipv6-by-default.sh
10-listen-on-ipv6-by-default.sh: info: Getting the checksum of /etc/nginx/conf.d/default.conf
10-listen-on-ipv6-by-default.sh: info: Enabled listen on IPv6 in /etc/nginx/conf.d/default.conf
/docker-entrypoint.sh: Launching /docker-entrypoint.d/20-envsubst-on-templates.sh
/docker-entrypoint.sh: Launching /docker-entrypoint.d/30-tune-worker-processes.sh
/docker-entrypoint.sh: Configuration complete; ready for start up
2021/08/04 10:23:25 [notice] 1#1: using the "epoll" event method
2021/08/04 10:23:25 [notice] 1#1: nginx/1.21.1
2021/08/04 10:23:25 [notice] 1#1: built by gcc 10.3.1 20210424 (Alpine 10.3.1_git20210424)
2021/08/04 10:23:25 [notice] 1#1: OS: Linux 5.4.72-microsoft-standard-WSL2
2021/08/04 10:23:25 [notice] 1#1: getrlimit(RLIMIT_NOFILE): 1048576:1048576
2021/08/04 10:23:25 [notice] 1#1: start worker processes
2021/08/04 10:23:25 [notice] 1#1: start worker process 32
```

<slide class="slide-top bg-black-blue" >

!![figure](https://crm-public.hzdahongniang.com/FuUwfPhvA_91IbEXO8IjKPui5ODc.png .size-80.aligncenter.shadow)


<slide class="bg-black-blue aligncenter "  >
>目前前端项目上线的流程
> {.text-quote}


<slide class="bg-black-blue aligncenter"  >

#### 传统方式{.title .lightSpeedIn}
!![figure](https://crm-public.hzdahongniang.com/FvYM3DhUNJBVr0kpX08moTyiTNH-.png .lightSpeedIn)


<slide class="bg-black-blue aligncenter"  >

####  DevOps{.title .lightSpeedIn}

:::{.centerBox}

!![](https://crm-public.hzdahongniang.com/FsgM0qVq8uN-c39-3gcgVBNiYCdN.png .lightSpeedIn )

----

- 持续集成(Continuous Integration)
- 持续交付(Continuous Delivery) 
- 持续部署(Continuous Deployment)
{.lightSpeedIn}

:::

<slide class="bg-black-blue aligncenter"  >

#### 持续集成(Continuous Integration){.title .lightSpeedIn}
!![](https://crm-public.hzdahongniang.com/FvezCacCLVp752CnkgC4vxo5ylk-.jpg .lightSpeedIn)

----

- 持续集成是一种软件开发实践，每次集成都通过自动化的构建（包括编译，发布，自动化测试）来验证，从而尽早地发现集成错误。{.lightSpeedIn}

<slide class="bg-black-blue aligncenter"  >

#### 持续交付(Continuous Delivery){.title .lightSpeedIn}
!![](https://crm-public.hzdahongniang.com/FgG5wFOFT6AfxoUUGtGV7jQ1uU29.jpg .lightSpeedIn )

----

- 持续交付在持续集成的基础上，将集成后的代码部署到更贴近真实运行环境的 `类生产环境` 中。比如，我们完成单元测试后，可以把代码部署到连接数据库的 `预发布` 环境中更多的测试。如果代码没有问题，可以继续手动部署到生产环境中。{.lightSpeedIn}


<slide class="bg-black-blue aligncenter"  >

#### 持续部署(Continuous Deployment){.title .lightSpeedIn}
!![](https://crm-public.hzdahongniang.com/FjU3j_JdPC1IRXJW1XCYT23u6xv0.jpg .lightSpeedIn)

----

- 持续部署则是在持续交付的基础上，把部署到生产环境的过程自动化。
- 与 `Jenkins` 不同的是，基于 Docker 的 CI/CD 每一步都运行在 Docker 容器中，所以理论上支持所有的编程语言。
{.lightSpeedIn}



<slide class="slide-top bg-black-blue" >

#### GitLab Runner CI/CD 自动化构建 {.bounce .mb-20}


- 概念{ .fadeInRight.delay-400 .pmb-20}
    - GitLab CI/CD   
    GitLab CI/CD 是GitLab Continuous Integration（Gitlab持续集成）的简称。GitLab 自GitLab 8.0开始提供了持续集成的功能，且对所有项目默认开启。只要在项目仓库的根目录添加.gitlab-ci.yml文件，并且配置了Runner（运行器），那么每一次push或者合并请求（Merge Request）都会触发CI Pipeline。
    - GitLab Runner   
        GitLab Runner是一个开源项目，可以运行在 GNU / Linux，macOS 和 Windows 操作系统上。每次push的时候 GitLab CI 会根据.gitlab-ci.yml配置文件运行你流水线（Pipeline）中各个阶段的任务（Job），并将结果发送回 GitLab。
    - Pipelines   
        Pipelines 中文称为流水线，是分阶段执行的构建任务。如：安装依赖、运行测试、打包、部署开发服务器、部署生产服务器等流程。每一次push或者Merge Request都会触发生成一条新的Pipeline。
        !![](https://crm-public.hzdahongniang.com/FirBMoJwNmwQEp0qwVZTsXaW9AMC.png)

<slide class="slide-top bg-black-blue" >

#### GitLab Runner CI/CD 自动化构建 {.bounce .mb-20}

- 概念{ .fadeInRight.delay-400 .pmb-20}
    - .gitlab-ci.yml   
        项目构建配置文件。默认需要存放于项目仓库的根目录，定义流水线的各个阶段，以及各个阶段中的若干作业（任务）。
        ```yaml
        stages:  # 声明构建步骤
            - build
            - deploy
        build-h5-job:  # 构建的作业
            stage: build
            script:
                - echo "Build the code..."  # 具体执行的内容
        build-miniprogram-job:  # 构建的作业
            stage: build
            script:
                - echo "Build the code..."  # 具体执行的内容
        deploy-job:      
            stage: deploy 
            script:
                - echo "Deploying application..."
                - echo "Application successfully deployed."
        ```
    - Jobs   
    Jobs 表示构建的作业（或称之为任务），表示某个 Stage 里面执行的具体任务。我们可以在 Stages 里面定义多个 Jobs，这些 Jobs 会有以下特点：
       - 相同 Stage 中的 Jobs 无执行顺序要求，会并行执行
       - 相同 Stage 中的 Jobs 都执行成功时，该 Stage 才会成功
       - 如果任何一个 Job 失败，那么该 Stage 失败，即该构建任务 (Pipeline) 也失败（可以在.gitlab-ci.yml文件中配置允许某 Job 可以失败，也算该 Stage 成功）

<slide class="slide-top bg-black-blue" >

#### GitLab Runner CI/CD 自动化构建实例 {.bounce .mb-none}

:::column{.codeColumn}

```yaml{ onClick="currentCode(this)"}
image: "$CI_REGISTRY/public_space/public_docker_image/miniprogram-ci:latest" 

stages:          
  - preparation
  - build
  - deploy

cache: 
    - key:
        files:
        - yarn.lock
      paths:
      - node_modules/
    - paths:
      - ".yarn-cache/"

preparation:
  stage: preparation
  only:
    - beta
  script:
    - yarn install --cache-folder .yarn-cache 
  cache:
    - policy: pull-push
```

---

```yaml{onClick="currentCode(this)"}
h5: 
  stage: build  
  only: 
    - beta
  script:
    - yarn build:h5
  artifacts:
    expire_in: 1d
    paths:
      - dist
  cache: 
    - policy: pull

miniprogram: 
  stage: build  
  only: 
    - beta
  script:
    - yarn build:mp-weixin-docker
    - miniprogram-ci upload --pp "$CI_PROJECT_DIR/dist/dev/mp-weixin" --pkp "$PKP" --appid "wx509c385abb776467" --enable-es6 true --enable-minify true --uv "$CI_COMMIT_SHORT_SHA" --ud "$CI_COMMIT_DESCRIPTION"
  cache: 
    - policy: pull
```

---

```yaml{onClick="currentCode(this)"}
deploy:
  stage: deploy
  image: docker
  only: 
    - beta
  variables:
    # 这里定义了打包成功后的Docker镜像名称，镜像版本库地址：分支（tag）名称-commit的版本号
    IMAGE_FULL_NAME: ${CI_REGISTRY_IMAGE}/fron/h5:${CI_COMMIT_REF_SLUG}-${CI_COMMIT_SHORT_SHA}
  script:
    - ls
    - mkdir -p buildfile && mkdir -p bulidfile/dist
    - mv dist/build/h5/ buildfile/dist/
    - mv Dockerfile buildfile/
    - cd buildfile
    - docker login --username $CI_REGISTRY_USER --password $CI_REGISTRY_PASSWORD $CI_REGISTRY
    - docker build -t $IMAGE_FULL_NAME .
    - docker push $IMAGE_FULL_NAME
    - docker rmi $IMAGE_FULL_NAME
  cache: {}
  dependencies:
    - h5
```

<slide class="bg-black-blue  "  >
:::{.centerBox}

<!-- !![](https://crm-public.hzdahongniang.com/FgyxhPnyU6YrGUP5NZ-8nuU7YtsJ.jpeg .aligncenter) -->

##### 推荐文章：{.mb-20}
* [Docker 从入门到实践](https://yeasy.gitbook.io/docker_practice/container) {.link}
* [持续集成是什么？](http://www.ruanyifeng.com/blog/2015/09/continuous-integration.html) {.link}
* [如何实现前端工程的持续集成与持续部署？](https://www.zhihu.com/question/60194439) {.link}
* [基于 GitLab CI 的前端工程CI/CD实践](https://github.com/giscafer/blog/issues/27) {.link}
* [GitLab Docs](https://docs.gitlab.com) {.link}

:==TO BE CONTINUED==:{.end}

:::
