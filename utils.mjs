export function initLogging() {
  const originalLog = console.log;
  const originalError = console.error;

  function getTimeStamp() {
    const now = new Date();
    return now.toLocaleString(); // This gives a human-readable format
  }

  console.log = function (...args) {
    const timeStamp = `[${getTimeStamp()}]`;
    originalLog.apply(console, [timeStamp, ...args]);
  };

  console.error = function (...args) {
    const timeStamp = `[${getTimeStamp()}]`;
    const redText = `\x1b[31m${timeStamp} ${args.join(" ")}\x1b[0m`; // ANSI escape code for red text
    originalError.call(console, redText);
  };
}

export async function getIP() {
  const ip = await $`curl -s 'https://api.ipify.org?format=json'`
    .then(JSON.parse)
    .then((data) => data.ip)
    .catch((e) => {
      console.error("Error obtaining public ip, ", e);
    });
  return ip;
}

let ascii64 = fs.readFileSync("ascii_b64.txt", { encoding: "utf-8" });
let ascii = atob(ascii64);
export function printAsciiArt() {
  console.log(ascii);
}
