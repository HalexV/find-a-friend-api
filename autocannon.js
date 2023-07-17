'use strict';

const { setTimeout } = require('node:timers/promises');
const { promisify } = require('node:util');
const exec = promisify(require('node:child_process').exec);
const axios = require('axios').default;
const autocannon = require('autocannon');

const axiosInstance = axios.create({
  baseURL: 'http://localhost:3000',
  validateStatus: () => true,
});

async function createUser() {
  await axiosInstance.post('/orgs', {
    address: 'Avenida das nações nº 4040',
    cep: '99999000',
    city: 'Colorado',
    email: 'orgxyz@org.com',
    latitude: -12.7569858,
    longitude: -60.1626287,
    name: 'Org Adote',
    password: '12345678',
    responsibleName: 'John Doe',
    whatsappNumber: '+55099911223344',
  });
}

async function logUser() {
  const response = await axiosInstance.post('/sessions', {
    email: 'orgxyz@org.com',
    password: '12345678',
  });

  const { token } = response.data;

  return token;
}

const baseImagesPath = 'src/utils/test/images/';

const myForm = `{ "about": { "type": "text", "value": "any" }, "age": { "type": "text", "value": "PUPPY" },"ambience": {"type": "text",  "value": "MEDIUM"},"available": {"type": "text","value": "true"},"energyLevel": {"type": "text","value": "AVERAGE"},"independenceLevel": {"type": "text","value": "HIGH"},"name": {"type": "text","value": "Mark"},"size": { "type": "text", "value": "MEDIUM"},"type": {"type": "text", "value": "DOG"},"photos_1": {"type": "file","path": "${baseImagesPath}image1.jpg"},"photos_2": {"type": "file", "path": "${baseImagesPath}image2.jpg"}}`;

async function main() {
  await exec('docker compose up -d');
  await setTimeout(1000);
  await exec('npx prisma migrate deploy');
  await setTimeout(1000);

  await createUser();
  const token = await logUser();

  const result = await autocannon({
    url: 'http://localhost:3000/pets',
    headers: {
      authorization: `Bearer ${token}`,
    },
    form: myForm,
    connections: 5,
    amount: 500,
  });

  console.log(autocannon.printResult(result));

  await exec('docker compose down');
}

main();
