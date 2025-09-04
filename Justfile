registry := env("REGISTRY")
image_name := env("IMAGE_NAME")
docker_context := env("DOCKER_CONTEXT")
domain := env("DOMAIN")
version := `node -p "require('./package.json').version"`

build-container:
    docker --context default buildx build --platform linux/amd64,linux/arm64 -t {{image_name}}:{{version}} --load .

push-container:
    docker --context default buildx build --platform linux/amd64,linux/arm64 -t {{registry}}/{{image_name}}:{{version}} --push .

deploy: push-container
    docker --context {{docker_context}} pull {{registry}}/{{image_name}}:{{version}}
    REGISTRY={{registry}} VERSION={{version}} DOMAIN={{domain}} docker --context do stack deploy -c docker-compose.yml ghostpipe-swagger
