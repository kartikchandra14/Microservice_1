# 🚀 NestJS Microservice

This project is a **NestJS-based microservice**, containerized with Docker for easy setup and deployment.

---

## 📦 Project Setup

Install Node.js dependencies:

```bash
npm i
```

Install Docker images instances like Redis, Zookeeper, Kafka & MongoDB:

```bash
docker compose up -d 
```


Run project with below command:

```bash
npm run dev:all 
```


Please down docker instances once done with testing of source code:

```bash
docker compose down -v
```
