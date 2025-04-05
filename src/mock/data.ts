// src/mock/data.ts
import { Job, JobStatus } from '../types';

// Mock container images
export const mockImages = [
  'nginx:latest',
  'node:16',
  'python:3.9',
  'mysql:8.0',
  'redis:alpine',
  'postgres:13',
  'ubuntu:20.04',
  'mongo:latest'
];

// Mock jobs
export const mockJobs: Job[] = [
  {
    id: '1',
    name: 'Web Server',
    image: 'nginx:latest',
    status: JobStatus.RUNNING,
    created: new Date(Date.now() - 3600000 * 24).toISOString(), // 1 day ago
    started: new Date(Date.now() - 3600000 * 23).toISOString(), // 23 hours ago
    config: {
      ports: ['80:80', '443:443'],
      volumes: ['/data/nginx/conf:/etc/nginx/conf.d', '/data/nginx/logs:/var/log/nginx'],
      env: {
        'NGINX_HOST': 'example.com',
        'NGINX_PORT': '80'
      }
    }
  },
  {
    id: '2',
    name: 'API Server',
    image: 'node:16',
    status: JobStatus.RUNNING,
    created: new Date(Date.now() - 3600000 * 48).toISOString(), // 2 days ago
    started: new Date(Date.now() - 3600000 * 47).toISOString(), // 47 hours ago
    config: {
      command: ['npm', 'start'],
      ports: ['3000:3000'],
      volumes: ['/data/app:/app'],
      env: {
        'NODE_ENV': 'production',
        'PORT': '3000',
        'DB_HOST': 'localhost'
      },
      resources: {
        cpus: 1,
        memory: '512m'
      }
    }
  },
  {
    id: '3',
    name: 'Database',
    image: 'postgres:13',
    status: JobStatus.RUNNING,
    created: new Date(Date.now() - 3600000 * 72).toISOString(), // 3 days ago
    started: new Date(Date.now() - 3600000 * 71).toISOString(), // 71 hours ago
    config: {
      ports: ['5432:5432'],
      volumes: ['/data/postgres:/var/lib/postgresql/data'],
      env: {
        'POSTGRES_USER': 'admin',
        'POSTGRES_PASSWORD': 'secret',
        'POSTGRES_DB': 'mydb'
      },
      resources: {
        cpus: 2,
        memory: '1g'
      }
    }
  },
  {
    id: '4',
    name: 'Failed Job',
    image: 'python:3.9',
    status: JobStatus.FAILED,
    created: new Date(Date.now() - 3600000 * 12).toISOString(), // 12 hours ago
    started: new Date(Date.now() - 3600000 * 11).toISOString(), // 11 hours ago
    finished: new Date(Date.now() - 3600000 * 10).toISOString(), // 10 hours ago
    config: {
      command: ['python', 'app.py'],
      env: {
        'DEBUG': 'true'
      }
    }
  },
  {
    id: '5',
    name: 'Completed Job',
    image: 'ubuntu:20.04',
    status: JobStatus.COMPLETED,
    created: new Date(Date.now() - 3600000 * 24).toISOString(), // 1 day ago
    started: new Date(Date.now() - 3600000 * 23).toISOString(), // 23 hours ago
    finished: new Date(Date.now() - 3600000 * 22).toISOString(), // 22 hours ago
    config: {
      command: ['bash', '-c', 'echo "Hello World"'],
    }
  }
];

// Sample logs for different jobs
export const mockLogs: Record<string, string> = {
  '1': `2023-03-24T12:00:00.000Z [info] Starting nginx server...
2023-03-24T12:00:01.000Z [info] nginx/1.21.6
2023-03-24T12:00:01.500Z [info] Configuration file /etc/nginx/nginx.conf test successful
2023-03-24T12:00:02.000Z [info] nginx started successfully
2023-03-24T12:00:03.000Z [info] Accepting connections on port 80
2023-03-24T12:00:10.000Z [info] 192.168.1.100 - - [24/Mar/2023:12:00:10 +0000] "GET / HTTP/1.1" 200 612 "-" "Mozilla/5.0"
2023-03-24T12:01:15.000Z [info] 192.168.1.101 - - [24/Mar/2023:12:01:15 +0000] "GET /index.html HTTP/1.1" 200 612 "-" "Mozilla/5.0"
2023-03-24T12:05:22.000Z [info] 192.168.1.102 - - [24/Mar/2023:12:05:22 +0000] "GET /api HTTP/1.1" 404 153 "-" "curl/7.68.0"`,

  '2': `2023-03-23T08:00:00.000Z [info] Starting Node.js application...
2023-03-23T08:00:01.000Z [info] Node.js v16.14.0
2023-03-23T08:00:02.000Z [info] Initializing API routes
2023-03-23T08:00:03.000Z [info] Connected to database successfully
2023-03-23T08:00:04.000Z [info] HTTP server listening on port 3000
2023-03-23T08:01:10.000Z [info] GET /api/users 200 52.135 ms
2023-03-23T08:05:22.000Z [info] GET /api/products 200 61.417 ms
2023-03-23T08:10:33.000Z [info] POST /api/orders 201 143.871 ms
2023-03-23T08:15:45.000Z [error] Error connecting to database: connection timeout
2023-03-23T08:15:46.000Z [info] Reconnecting to database...
2023-03-23T08:15:48.000Z [info] Database connection re-established`,

  '3': `2023-03-22T06:00:00.000Z [info] Starting PostgreSQL 13.6...
2023-03-22T06:00:02.000Z [info] Logging to '/var/log/postgresql/postgresql-13-main.log'
2023-03-22T06:00:03.000Z [info] Database system was shut down at 2023-03-22 05:59:58 UTC
2023-03-22T06:00:04.000Z [info] Database system is ready to accept connections
2023-03-22T06:00:05.000Z [info] Autovacuum launcher started
2023-03-22T06:01:15.000Z [info] Connection received: host=localhost port=5432 database=mydb
2023-03-22T06:01:16.000Z [info] Authentication successful for user 'admin'`,

  '4': `2023-03-24T12:00:00.000Z [info] Starting Python application...
2023-03-24T12:00:01.000Z [info] Python 3.9.7
2023-03-24T12:00:02.000Z [info] Loading configuration...
2023-03-24T12:00:03.000Z [info] Initializing data processors
2023-03-24T12:00:04.000Z [error] ModuleNotFoundError: No module named 'tensorflow'
2023-03-24T12:00:04.100Z [error] Traceback (most recent call last):
  File "app.py", line 10, in <module>
    import tensorflow as tf
ModuleNotFoundError: No module named 'tensorflow'
2023-03-24T12:00:04.200Z [error] Application failed to start. Exiting with code 1`,

  '5': `2023-03-23T12:00:00.000Z [info] Starting script...
2023-03-23T12:00:01.000Z [info] Running: bash -c echo "Hello World"
2023-03-23T12:00:01.500Z [info] Hello World
2023-03-23T12:00:02.000Z [info] Script completed successfully
2023-03-23T12:00:02.100Z [info] Exiting with code 0`
};