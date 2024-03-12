# DigitalMenuFe

## Getting started

Create a docker network named "digitalmenu_network"

```bash
docker network create digitalmenu_network
```

Run the following command to start the container

```bash
docker-compose up -d && docker-compose exec app sh
```

This container has node with npm pre-installed. You can run commands like npm install, npm run dev, npm run build, etc.