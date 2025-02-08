---
title: "Homelab setup step-by-step"
pubDate: 2025-02-08
description: ""
author: "Darrel"
image: {}
tags: ["Homelab", "Proxmox", "Linux"]
readTime: 15
---

In a previous post, I shared about my simple homelab and gave an overview of how it was setup. In this post, I aim to provide a more detailed guide on the steps and commands used which will hopefully be useful for anyone looking to setup Proxmox or a similar homelab setup.

## Creating bootable USB

There are many guides out there for creating a bootable Proxmox USB installer so I will not elaborate too much here. Generally, I would recommend [Ethcer](https://etcher.balena.io/) for Windows or MacOS, and the `dd` command for Linux. 

## Installing Proxmox

After booting into the Proxmox installer, there are only a few steps to go through before the installation is complete. The version use in this guide is Proxmox 8. The first step is to select the target drive to install Proxmox on, so make sure you know which drive you want to install it on. The next step to configure would be the network settings, which should be done manually. Make sure you have ready the static local IP address you would like to assign to the Proxmox server, the router gateway IP and the DNS server of your preference.

After clicking through the rest of the installation, Proxmox should be installed and will automatically reboot. You can then access the web interface by going to `https://<ip-address>:8006` in your browser. The default username is `root` and the password is the one you set during installation.

## Post-installation

This is where I will introduce you to the wonderful [Proxmox Community Helper-Scripts](https://community-scripts.github.io/ProxmoxVE/scripts) repo that contains many useful scripts managing Promox. The first script I always run is the Proxmox VE Post Install script that does a bunch of things including disabling the subscription nag. Simply open the shell from web UI and copy and paste the commands from the repo's site. The script should then prompt for some options after which it will confirm to reboot the system.

## Mounting additional storage

As mentioned in my previous post, I would perfer to keep the storage and system separate, instead of using Proxmox to manage the drives. Unlike most tutorials which would create a storage location using the web UI, I chose to manually mount the drives instead. We can do this by editing the `/etc/fstab` file and adding the respective drives UUID and desired mount points.

The information we require will be the drive UUIDs, which can be found with the following command:
```bash
lsblk -o NAME,FSTYPE,LABEL,UUID,MODEL
```
Tis prints out more relevant information compared to the default command. Note down the UUID  and filesystem of the devices you would like to mount.

Next, we can edit the `/etc/fstab` file with the editor of your choice. The first line of the file provides the format for adding new entries, and you follow the example below:
```
UUID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx /mnt/<mount_point> ext4 defaults,noatime 0 2
```
`noatime` is a good option for HDDs while `2` specifices that it will be checked after the root filesystem. Then you will have to create the directories for the mount point by using `mkdir /mnt/<mount_point>, after which you can run `mount -a` to mount the drives without rebooting. If you cd into the mount point, you should see the file contents of the drive.

## Seting up disks

The previous section assumes that the drives are already formatted and have a filesystem. If not, you can use the `fdisk` command to create format drives and setup new partition. First, find the device path of the drive you want to setup. The previos `lsblk` command should wokr great for this as well. Then run the following command to start the fdisk utility:
```bash
fdisk /dev/sdX
```
The 2 main commands are `g` to create a new GPT partition table which is recommended for modern drives; `n` to create a new partition; and finally `w` to write the changes to the disk. Note that doing so will erase all data on the drive so be careful.
After creating the partition, you can format it with the following command:
```bash
mkfs.ext4 /dev/sdX1
```
`ext4` seems to be the most common filesystem for Linux, but you can choose another filesystem if you have specific needs.

## Creating a LXC container

The first thing I would create is a LXC container to run services that require more direct access to the hardware. The mmain function I need would be a NFS server to share any storage drive(s) to any other VMs or the rest of the network. By using an NFS share, multiples clients could access the storage and it would serve as a layer of sepration between between the storage and the system. Another advantage is that local VMs that access the storage would use the virtualized network, so performance should not be affected too much.

Here I will use the Proxmox community scripts to setup the LXC container with Debian. THe recommeded defaults should be good enough for most use cases. But these are some the options I customise, you can choose the right values for your use case:

- Cores
- Memory
- Privileged container
- IP address (static)
- Enable root SSH access

After going through the script, the LXC container should be started.

## NFS share

To allow the LXC container to access data on the host drives, we need to create bind mounts. Since we are manually handling storage, we'll need to manually create the bind mounts as well instead of using the Proxmox web UI. This is done by editing the `/etc/pve/lxc/<container_id>.conf` file on the *host* and adding the following lines:
```
mp0: /mnt/<location_on_host>,mp=/mnt/<mount_point_in_container>
```
You can add multiple bind mounts by incrementing the `mp` values. After saving the file, you can restart the LXC container to apply the changes.

Then, we'll create a NFS share in the LXC Container. First, we need to install the NFS server package with the following command:
```bash
, we'll create a NFS share in the LXC Container. First, we need to install the NFS server package with the following command:
```bash
apt install nfs-kernel-server
```
Edit the `/etc/exports` file to configure the NFS share. 
```
/mnt/<mount_point_in_container> *(rw,sync,no_subtree_check)
```
Here we are specifying that all clients can read and write to the share. After saving the file, you can restart the NFS server with the following command:
```bash
exportfs -a
systemctl restart nfs-kernel-server
```

## Creating a VM

Next, I'll create a VM to run services together with Docker. I chose to use Fedora Server but you can choose any OS you are comfortable with. First, we'll need to download the ISO installer, which you can do so directly in the Proxmox UI. Select the `local (pve)` tab from the sidebar, then navigate to `ISO Images` -> `Download from URL`. After downloading the ISO, we can proceed to create the VM by clicking on the `Create VM` button in the top right.

There are many options to configure when creating a VM in Promox, these are the recommended options I like to start with: 

- **General**: 
    - VM IDs generally start from 100 and increases sequentially.
    - Name: Choose a name that is descriptive of the VM.

- **OS**:
    - Choose the ISO image you downloaded.
    - OS Type: Linux
    - Version: 6.x - 2.6 Kernel
- **System**:
    - Machine: q35
    - BIOS: OVMF (UEFI)
    - EFI Storage: local-lvm
- **Disks**:
    - We can leave the default settings, but choose the size of the disk you would like to allocate.
    - The disks are thin provisioned by default, so the actual disk space used will only be the amount of data stored.
    - Select SSD emulation if you are using an SSD.
- **CPU**:
    - The main setting to focus on is the number of cores. A good start would be 4 cores. Depending on your CPU, you can allocate more or less cores
    - Setting the number of cores does not mean that the VM has exclusive access, so the total number of cores across all VMs can exceed the number of physical cores.
    - Type: select the highest version of x86-64-vx that your CPU supports. You can start with the highest version and work your way down. The VM will fail to start if the CPU does not support the selected type.
- **Memory**:
    - Allocate the amount of memory you would like to assign to the VM. Similar to CPU, the memory is not exclusive and can be shared between VMs.
- **Network**:
    - Leave as default

After creating the VM, you can start it and open the console to install the OS. You can enter the installation process by clicking on the `Console` button in the VM page. Follow the installation process if the respective OS you have.

Note that if you are using Ubuntu or Debian, you can also choose to use the community scripts to setup a VM.

## Accessing NFS share

We can access the NFS share from the VM by mounting the share. For Fedora server, the NFS client should be installed by default. If not you can do so with:
```bash
sudo dnf install nfs-utils
```
Then you can mount the share with by editing the `/etc/fstab` file and adding the following line:
```
<ip_of_lxc_container>:/mnt/<mount_point_in_container> /mnt/<mount_point_in_vm> nfs defaults 0 0
```
As before, you can run `mount -a` to mount the share without rebooting. If you cd into the mount point, you should see the file contents of the drive.

## Running services with Docker

I will not go into detail on how to setup Docker and run services as there are many guides out there. But to keep things simple, I generally just use Docker Compose without any additional tools like Portainer.

## Final touches

You now have a basic homelab setup that you can access from your local network. But what if we want to access it remotely?

## Tailscale

To easily access your server remotely, you can use Tailscale. With Tailscale, your server will appeapr though it was on the local network no matter where you connect from. Simply follow the Tailscale instructions from their website.

After installing, you will be able to access the server when connected to the Tailscale VPN. The next step you can do is setup the Proxmox node as a subnet router so that you can access other devices on your home network as well. The full instructions can be found on the Tailscale website, but this is the command you would run on the Proxmox node (assuming your router assigns local IP addresses in the 10.193.86.xxx range):
```bash
sudo tailscale up --advertise-routes=10.193.86.0/24
```

## Clouflare Tunnels

Tailscale is great for accessing the server remotely, but if you want to expose services to the internet without needing to deal with things like security, SSL or port forwarding, you can use Cloudflare Tunnels. The setup involves installing the `cloudflared` daemon onto your desired server. Instructions for Fedora will be something like this:
```bash
sudo dnf -y install dnf-plugins-core
sudo dnf-3 config-manager --add-repo https://pkg.cloudflare.com/cloudflared-ascii.repo
sudo dnf install cloudflared
```

Then setup the configuration in your Cloudflare dashboard and follow the instructions to start the tunnel.


With that, you should now have a basic homelab setup that you can access and manage remotely. Happy homelabbing!

