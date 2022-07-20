/*
 * Analysis Example
 * Operate data from devices
 *
 * Read information from a variable generated by devices,
 * run a simple calculation in real-time, and create a new variable with the output.
 *
 * Instructions
 * To run this analysis you need to add a device token to the environment variables,
 * To do that, go to your device, then token and copy your token.
 * Go the the analysis, then environment variables,
 * type device_token on key, and paste your token on value
 */

const { Analysis, Device, Utils } = require("@tago-io/sdk");

// The function myAnalysis will run when you execute your analysis
async function myAnalysis(context) {
  // reads the values from the environment and saves it in the variable env_vars
  const env_vars = Utils.envToJson(context.environment);

  if (!env_vars.device_token) {
    return context.log("Missing device_token environment variable");
  }

  const device = new Device({ token: env_vars.device_token });

  // create the filter options to get the data from TagoIO
  const filter = {
    variable: "c1_hourly_count",
    query: "",
  };

  const resultArray = await device.getData(filter).catch(() => null);

  // Check if the array is not empty
  if (!resultArray || !resultArray[0]) {
    return context.log("Empty Array");
  }

  // query:last_item always returns only one value
  const value = resultArray[0].value;
  const time = resultArray[0].time;

  // print to the console at TagoIO
  context.log(
    `The last record of c1_count is ${value}. It was inserted at ${time}`
  );

  // Multiplies the water_level value by 2 and inserts it in another variable
  const obj_to_save = {
    variable: "c1_count double",
    value: value * 2,
  };

  try {
    await device.sendData(obj_to_save);
    context.log("Successfully Inserted");
  } catch (error) {
    context.log("Error when inserting:", error);
  }
}

module.exports = new Analysis(myAnalysis);

// To run analysis on your machine (external)
// module.exports = new Analysis(myAnalysis, { token: "YOUR-TOKEN" });
