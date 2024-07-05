import { initLogging } from "./utils.mjs";
import { getIP } from "./utils.mjs";
import { printAsciiArt } from "./utils.mjs";

printAsciiArt();
initLogging();

const ip = await getIP();

console.log(`Public IP:[${ip}]`);

const dotk = process.env.DIGITALOCEAN_TOKEN;
if (!dotk) {
  console.error("Invalid DIGITALOCEAN_TOKEN env variable");
  process.exit(1);
}

let auth = await $`doctl auth --access-token=$DIGITALOCEAN_TOKEN init`;
if (auth.exitCode != 0) {
  console.error(`
    Error Authenticating with DigitalOcean.
    Ensure you have set the env variable DIGITALOCEAN_TOKEN correctly
    Generate your token here: https://cloud.digitalocean.com/account/api/tokens.
    `);
  process.exit(1);
}

async function updateRecords() {
  // Get records to update
  let recordsStr = await fs.readFileSync("records.json", { encoding: "utf-8" });
  let records = JSON.parse(recordsStr);
  let totalUpdates = 0;

  Object.keys(records).forEach(async (domain) => {
    console.log(domain);
    let recordsDO =
      await $`doctl compute domain records list ${domain} -o json`.then(
        JSON.parse
      );

    records[domain].forEach(async (r) => {
      let foundRecord = recordsDO.find(
        (v) => v.name == r.name && v.type == r.type
      );

      if (foundRecord && (foundRecord.ttl != r.ttl || foundRecord.data != ip)) {
        totalUpdates++;
        console.log(`--- Updating Record ---`);
        console.log(`  Domain: ${domain}`);
        console.log(`  Name: ${foundRecord.name}`);
        console.log(`  TTL: ${foundRecord.ttl} -> ${r.ttl}`);
        console.log(`  IP: ${foundRecord.data} -> ${ip}\n`);
        let result = await $`doctl compute domain records update ${domain} \
      -o json \
      --record-id ${foundRecord.id} \
      --record-data ${ip} \
      --record-ttl ${r.ttl}`;
        if (result.exitCode != 0) {
          console.error("Error updating record, ", result);
        } else {
          console.log("Update successful");
        }
      }
    });

    console.log(`${totalUpdates} records updated`);
  });
}
updateRecords();
let intervalSeconds = process.env.INTERVAL_SECONDS || 60 * 5;
let interval = setInterval(updateRecords, intervalSeconds * 1000);
