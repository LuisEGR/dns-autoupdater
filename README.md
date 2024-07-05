# DigitalOcean DNS Updater

This script automatically updates DNS records on DigitalOcean with your current public IP address. It is designed to run continuously, checking for IP changes at a specified interval and updating the records as needed.

## Features

- Automatically detects your current public IP address
- Updates specified DNS records on DigitalOcean with the current IP
- Customizable update interval (default: 5 minutes)
- Supports updating multiple domains and records
- Easy setup with environment variables for DigitalOcean API token and update interval

## Prerequisites

- A DigitalOcean account with API access
- Docker
  or
  - Node.js (version 12 or higher)
  - `doctl` command-line tool installed and configured with your DigitalOcean API token

## Docker

```
docker run \
-e DIGITALOCEAN_TOKEN=<YOUR_TOKEN_HERE> \
-e INTERVAL_SECONDS=300 \
-v /path/to/records.json:/records.json \
ghcr.io/luisegr/dns-autoupdater:latest
```

## Installation

1. Clone the repository:

   ```
   git clone https://github.com/LuisEGR/digitalocean-dns-updater.git
   ```

2. Navigate to the project directory:

   ```
   cd digitalocean-dns-updater
   ```

3. Install the dependencies:

   ```
   npm install
   ```

4. Set the required environment variables:

   - `DIGITALOCEAN_TOKEN`: Your DigitalOcean API token. Generate one from the DigitalOcean API settings page.
   - `INTERVAL_SECONDS` (optional): The interval in seconds between each IP check and update. Default is 300 seconds (5 minutes).

5. Configure the DNS records to update in the `records.json` file. The file should be in the following format:
   ```json
   {
     "example.com": [
       {
         "name": "subdomain1",
         "type": "A",
         "ttl": 3600
       },
       {
         "name": "subdomain2",
         "type": "A",
         "ttl": 1800
       }
     ],
     "example.net": [
       {
         "name": "@",
         "type": "A",
         "ttl": 3600
       }
     ]
   }
   ```

## Usage

To start the DNS updater, run the following command:

```
npm run start
```

The script will continuously run, checking your public IP address at the specified interval and updating the configured DNS records on DigitalOcean if necessary.

## Configuration

- `records.json`: This file contains the DNS records to be updated. Each domain is represented as a key, and the value is an array of records. Each record should have a `name`, `type`, and `ttl` property.

- `DIGITALOCEAN_TOKEN` environment variable: Set this to your DigitalOcean API token. You can generate a token from the DigitalOcean API settings page.

- `INTERVAL_SECONDS` environment variable (optional): Set this to the desired interval in seconds between each IP check and update. The default value is 300 seconds (5 minutes).

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contributing

Contributions are welcome! If you find any issues or have suggestions for improvements, please open an issue or submit a pull request.

## Acknowledgements

- [DigitalOcean API](https://developers.digitalocean.com/documentation/v2/)
- [doctl command-line tool](https://github.com/digitalocean/doctl)
