import { PYTHON_URL } from "$env/static/private";
import { beforeAll, describe, expect, test } from "vitest";
import net from "node:net";

function checkConnection() {
  return new Promise<boolean>((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error(`timeout trying to connect to Python API backend`));
      socket.end();
    }, 10000);
    const socket = net.createConnection(8000, "localhost", () => {
      clearTimeout(timer);
      resolve(true);
      socket.end();
    });
    socket.on('error', (err) => {
      clearTimeout(timer);
      reject(err);
    })
  })
}

const serverRunning : boolean = await checkConnection().then(() => true, () => false);

const liveTest = (...args: Parameters<typeof test>) =>
  serverRunning ? test(...args) : test.skip(...args);

describe('Request Handshake from API', () => {
  let response: Response;
  let data: string;
  const BEFORE_ALL_TIMEOUT: number = 1000;

  beforeAll(async() => {
    response = await fetch(`${PYTHON_URL}/handshake`, { method: 'GET' });
    data = await response.json();
  }, BEFORE_ALL_TIMEOUT);

  liveTest('Should return response status 200', () => {
    expect(response.status).toBe(200);
  });

  liveTest('Should return response data True', () => {
    expect(JSON.parse(data)).toBe(true);
  });
})