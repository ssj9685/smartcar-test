'use strict';

import express from 'express';
import { Smartcar, AuthClient, Vehicle } from 'smartcar';
import config from './config.js';

const app = express();

const port = 8000;

const smartcar = new Smartcar();

const client = new AuthClient({
  clientId: config.clientId,
  clientSecret: config.clientSecret,
  redirectUri: config.redirectUri,
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
  console.log(access);

  const { vehicles } = await smartcar.getVehicles(access.accessToken);
  const vehicle = new Vehicle(vehicles[0], access.accessToken);
  const attributes = await vehicle.attributes();

  console.log(attributes);
});

app.listen(port, () => console.log(`Listening on port ${port}`));
