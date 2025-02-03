---
title: "My humble homelab"
pubDate: 2025-02-01
description: ""
author: "Darrel"
image: {}
tags: ["Homelab", "Proxmox", "Linux"]
readTime: 10
---


The first iteration of my home server was just an old *Lenovo ThinkCentre SFF desktop* that I had which had a 7th Gen i5 processor. I installed Linux directly on it and used it to run services mostly with Docker. The i5 chip was more than sufficient and it generally worked well but the **main limitation** was the lack of storage. The ThinkCentre was not designed to be upgraded and only had enough space and ports for a single 3.5" hard drive. Even if there was space and additional ports through a PCIe adapter, power would be an issue and it only had 4-pin ATX power, which means a splitter would be needed to power the drives.

However, I'm not sure if the Lenovo desktops are just not meant to be powered on 24/7 or if it was just my unit, but it just **died suddenly** after a few months of use. As I had a LGA1151 system, I could test that all the individual components were fine, even the CPU fan was spinning, but the system would not POST. Even though many people online suggested that Lenovo PCs make good home server components, I decided to go with a more traditional PC build for my next server, as that would give more **flexibility** in terms of upgrades and repairs. Furthermore, in my area, old gaming desktops are much more common on Carousell (eBay equivalent) than Lenovo PCs, so it is easier to find a better deal on a used gaming desktop instead.

I ended up getting a used desktop for around S$150. The specs are as follows:

- CPU: Intel Core i7-7700
- GPU: Nvidia GTX 660
- RAM: 16GB DDR4
- Motherboard: MSI Tomahawk B250

Coincidentally, it was also a 7th Gen CPU and while the system might not be the most ideal for server use with only 4 cores, it was okay for the price and I did not want to wait for a better deal. The GTX 660 would also not be required for most use cases, but I could try to resell it to offset the cost or use it in a VM for a HTPC or something. For general purpose and even hardware-accelerated transcoding the iGPU would be even more suitabale. Storage wise, I would also be reusing what I had existing and also purchased a *used enterprise 10TB drive* off eBay.

This time I decided to install *Proxmox* instead of running Linux natively. I chose it mainly because it is widely used and promoted by the community, and having a hypervisor would also allow for more easier **experimentation** with different OSes and configurations. I wanted to keep it as simple as possile so I installed Proxmox on a SSD with the default configuration. For additional storage, I did not want to have Proxmox manage the drives directly, so I created a ext4 partition on the 10TB drive and mounted it to a folder manually.

For services, I decieded to run a *Fedora Server VM with Docker*. This contains any service that would run well in a container, and one of the main services I run is Immich, which is essentaially a Google Photos replacement. For services like JellyFin that require more direct access to the hardware, I would run them in a *LXC container*. Most importantly, I setup a LXC container with NFS server to share the main storage drive(s) to any other VMs or the rest of the network. By using an **NFS share**, multiples clients could access the storage and it would serve as a layer of sepration between between the storage and the system. Another advantage is that local VMs that access the storage would use the virtualized network, so performance should not be affected too much.

The last benefit of keeping the storage drives "dumb" is that it would be easier to move them to another system if needed and it makes backups easier to reason about. My current **backup solution** involves just using rsync to backup to backup important folders to an external drive. While this is not the most robust solution and is not anywhere near the widely cited 3-2-1 backup strategy, it is **simple** and works well for my current needs.

Another 2 essential services that I use is *Tailscale* and *Cloudflare Tunnels*. Tailscale is used to access the server remotely as though it was on the local network, and Cloudflare Tunnels is used to expose services to the internet without needing to deal with things like security, SSL or port forwarding. For my current usage, Tunnels is sufficient, but I might look into setting up a p*roper reverse proxy* in the future. The great things is that both services are free for personal use and are easy to setup.

As you might notice, a lot of the current setup work is *manual*, setting up VMs, shares and Proxmox. While although services can be simplified with Docker Compose, I would like to implement some declarative configs for whole system, so that all setup can be *automated* and rebuilt in less time. 

I'm not sure when my next homelab build will be, and as long as the current one runs, I might not need an upgrade in a while. Although, I already have some ideas on what it might look like. Ideally I would like to separate storage from the system and add more redundancy, so getting a NAS or DAS support that. Perhaps I would also down-size to a mini-pc for a more compact and aesthetic build. There's also many things to explore such as TrueNAS, Proxmox Backup server or even high-availability and I'm sure that will be a fun project to work on.