'use strict';

const express = require('express');
const { Smartcar, AuthClient, Vehicle } = require('smartcar');

const app = express();

const port = 8000;

const smartcar = new Smartcar();

const client = new AuthClient({
  clientId: 'b592509a-5127-49a7-bdc8-d51f5c72933b',
  clientSecret: 'b773bb8f-442b-4857-b8b4-765841d8a6c7',
  redirectUri: 'http://localhost:8000/exchange',
});

app.get('/', function (req, res) {
  /** scope info
   * read_compass: Know the compass direction your vehicle is facing
   * read_engine_oil: Read vehicle engine oil health
   * read_battery: Read EV battery's capacity and state of charge
   * read_charge: Know whether vehicle is charging
   * control_charge: Start or stop your vehicle's charging
   * read_thermometer: Read temperatures from inside and outside the vehicle
   * read_fuel: Read fuel tank level
   * read_location: Access location
   * control_security: Lock or unlock your vehicle
   * read_odometer: Retrieve total distance traveled
   * read_speedometer: Know your vehicle's speed
   * read_tires: Read vehicle tire pressure
   * read_vehicle_info: Know make, model, and year
   * read_vin: Read VIN
   */
  const scope = ['read_vehicle_info'];
  const authUrl = client.getAuthUrl(scope);
  res.redirect(authUrl);
});

app.get('/exchange', async function (req, res) {
  const code = req.query?.code;
  console.log(code);
  if (!code) return;

  const access = await client.exchangeCode(code);
  const { vehicles } = await smartcar.getVehicles(access.accessToken);
  console.log(access.accessToken);
  const vehicle = new Vehicle(vehicles[0], access.accessToken);
  const attributes = await vehicle.attributes();

  console.log(attributes);
  req.sendStatus(200);
});

app.listen(port, () => console.log(`Listening on port ${port}`));
