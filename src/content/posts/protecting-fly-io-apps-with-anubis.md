---
title: "Protecting fly.io apps with Anubis"
description: "Crawlers be gone!"
pubDate: 2026-02-10
author: "Darrel"
image: {}
tags: ["Development", "Web Scraping", "Security"]
readTime: 6
---

I run a small app on Fly.io that serves [HDB resale flat prices](https://hdb-resale-prices.fly.dev/resale/resale_prices) data with a easy-to-use web interface. Since launching it, I have generally not needed to pay for hosting as the overall bill including bandwidth was below $5, and Fly.io waives bills below that amount. However, I recently received a unexpected bill and most of it was attributed to outbound bandwidth. This likely means that the site was being hit by **web scrapers and/or AI crawlers** which is definitely not good.

After reaching out to Fly.io support, they agreed that this was likely caused by bots and not reflective of real user usage, and graciously waived the bill. (Thanks Fly.io!). They also mentioned that there is currently no global firewall on the platform and recommended some application-level measures to prevent this.

The simple solution would be to use Cloudflare and call it a day, but in this case I do not have a domain for the site and it would not be possible to proxy it through Cloudflare.

I remembered that I had seen some firewall solution before on some sites from Hacker News or homelab reddit posts. After some quick googling, I found that it was called [Anubis](https://github.com/TecharoHQ/anubis). It is a reverse proxy that uses a **proof-of-work challenge** to protect upstream services from scraper and bots. It works by presenting a SHA-256 challenge that must be solved with JavaScript before the request is forwarded to the actual app. This takes a few hundred milliseconds for a human but becomes expensive and slow for automated botnets running thousands of requests.

Anubis is shipped as a Docker image at `ghcr.io/techarohq/anubis:latest` and is designed to sit between your service and the public internet. However, in this case the app is directly exposed to the public internet via Fly.io, so we need to find another way to add it to our app.

## Implementing Anubis on Fly.io

The idea is to run Anubis and your app as **co-processes** in the same Fly.io machine. Anubis listens on the public port and proxies verified requests to your app on an internal port.

```
Internet → Fly.io (port 8080) → Anubis → your app (port 8081)
```

In my case, I was using `datasette publish fly` which auto-generates a Dockerfile and deploys it. To add Anubis, I switched to a two-step process: first **generate** the deployment files with `--generate-dir`, then **patch** the Dockerfile to include Anubis before deploying.

### The entrypoint script

We need an entrypoint script that starts both your app and Anubis. Your app runs on an internal port (8081) while Anubis takes the public port (8080) and proxies to it.

```sh
#!/bin/bash

# Start your app on port 8081
your-app-start-command --port 8081 &

# Start Anubis on port 8080, proxying to your app
BIND=":8080" TARGET="http://localhost:8081" /usr/local/bin/anubis &

wait -n
exit $?
```

### The Dockerfile changes

Append the following to your existing Dockerfile. This copies the Anubis binary from its official image and sets the entrypoint. Note that the binary is at `/ko-app/anubis` as the image is built with [ko](https://ko.build/).

```dockerfile
COPY --from=ghcr.io/techarohq/anubis:latest /ko-app/anubis /usr/local/bin/anubis
COPY entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh
CMD ["/usr/local/bin/entrypoint.sh"]
```

Remember to remove the original `CMD` line from your Dockerfile as the entrypoint script will handle starting your app.

## Verifying

After deploying, visit your app in an **incognito window**. You should briefly see the Anubis challenge page before being redirected to your app. A `curl` request should also return the challenge page instead of your app content, as curl does not execute JavaScript:

```sh
curl -s https://your-app.fly.dev | head -20
```

With this, you should have a application-level protection in place that should keep those Fly.io bills in check.
