---
title: "How to use Gluetun with Podman on Fedora"
pubDate: 2024-04-11
description: ""
author: "Darrel"
image: {}
tags: ["Guide", "Fedora", "Linux"]
readTime: 3
---

Gluetun is a VPN client that can be used with containerized applications. However, it is not as straightforward to use with Podman/Fedora as compared to Docker and other distros. I was also unable to find a good resource on how to resolve the issues, therefore, I hope this guide will help anyone who is also trying to use Gluetun with Podman on Fedora.

### Install Podman

First, we need install [Podman](https://podman.io/docs/installation#fedora) and [podman-compose](https://github.com/containers/podman-compose?tab=readme-ov-file#manual). On Fedora, we can simply run:

```bash
sudo dnf -y install podman
```

```bash
sudo dnf -y install podman-compose  
```

### Setup Gluetun

We will start with the base docker-compose config from the Gluetun [repository](https://github.com/qdm12/gluetun?tab=readme-ov-file#setup).

```yaml
version: "3"
services:
  gluetun:
    image: qmcgaw/gluetun
    container_name: gluetun
    cap_add:
      - NET_ADMIN
    devices:
      - /dev/net/tun:/dev/net/tun
    ports:
      - 8888:8888/tcp # HTTP proxy
      - 8388:8388/tcp # Shadowsocks
      - 8388:8388/udp # Shadowsocks
      # expose other ports here
    volumes:
      - ./gluetun:/gluetun
    environment:
      # See https://github.com/qdm12/gluetun-wiki/tree/main/setup#setup
      - VPN_SERVICE_PROVIDER=ivpn
      - VPN_TYPE=openvpn
      # OpenVPN:
      - OPENVPN_USER=
      - OPENVPN_PASSWORD=
      - TZ=
```

If this config is run with Podman, the first error to pop up is:

```
ERROR writing servers to file: open /youdirectoryhere/servers.json...
```

The error occurs as the container is unable to write to the volume on the host due to SELinux policies. To fix this, we need to add the `:z` suffix to the volume mount. See [here](https://docs.podman.io/en/v4.4/markdown/podman-run.1.html) for more info.

```diff
volumes:
-  - ./gluetun:/gluetun
+  - ./gluetun:/gluetun:z
```

The next error we encounter is:

```
ERROR checking TUN device: TUN device is not available
```

This error occurs as the container is unable to access the TUN device on the host. To fix this, we need to run the container in privilleged mode.

```diff
    container_name: gluetun
+   privileged: true
```

With these changes, you should know be able to succesfully run Gluetun and see the success logs.

```
INFO [healthcheck] healthy!
INFO [vpn] You are running on the bleeding edge of latest!
```
