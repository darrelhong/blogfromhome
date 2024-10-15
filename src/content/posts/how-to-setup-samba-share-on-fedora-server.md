---
title: "How to setup Samba share on Fedora Server"
pubDate: 2024-04-10
description: ""
author: "Darrel"
image: {}
tags: ["Guide", "Fedora", "Linux"]
readTime: 3
---

Setting up a Samba share on Fedora should be a fairly straightforward process. The offical Fedora documentation contains very detailed information and is a great place to start. However, I still encountered some issues which were not mentioned. In this post, I will share some of the steps that you may need to take to successfully setup a Samba share on Fedora.

### Install Samba

We will follow the official documentation to install Samba. Do check [this link](https://docs.fedoraproject.org/en-US/quick-docs/samba/) for the latest information.

```bash
sudo dnf install samba
sudo systemctl enable smb --now
firewall-cmd --get-active-zones
sudo firewall-cmd --permanent --zone=FedoraServer --add-service=samba
sudo firewall-cmd --reload
```

These steps will install and enable Samba, as well as create a firewall rule to allow Samba traffic.

### Create Samba user and configure share

Assuming desired Samaba user is `homelab`, create a Samba user with the following command:

```bash
sudo smbpasswd -a homelab
```

Next, we will create a share. Add the following block to `/etc/samba/smb.conf`:

```bash
[share]
        path = /home/homelab/share
        writeable = yes
        browseable = yes
        public = yes
```

You may require sudo permissions to edit the file.

### Enable nmb

At this point you might notice that the share is not discoverable from other devices on the local network unlike shares created by MacOS or Windows. This is because the nmb service is not enabled by default. To enable it, run:

```bash
sudo systemctl enable nmb --now
```

### Enable SELinux Boolean

Lastly, you may still be unable to view or access files after connecting to the share. To do so, we need to enable the `samba_enable_home_dirs` [SELinux boolean](https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux/7/html/selinux_users_and_administrators_guide/sect-managing_confined_services-samba-booleans):

```bash
sudo setsebool -P samba_enable_home_dirs on
```

You should now be able to find your share on the local network and access files just like any Samaba share created by other operating systems.
