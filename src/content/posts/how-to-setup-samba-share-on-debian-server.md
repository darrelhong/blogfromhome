---
title: "How to setup Samba share on Debian Server"
pubDate: 2025-01-25
description: ""
author: "Darrel"
image: {}
tags: ["Guide", "Debian", "Linux"]
readTime: 3
---

There are several guides out there when searching for creating a Samba share on Debian, each with slightly differing instructions. However, none worked out of the box and I had to combine information from multiple sources to get it working. This guide will show you how to create a Samba share on Debian.

### Install Samba

Installing Samba just requires a single command:

```bash
sudo apt install samba
```

### Create users

Create user and Samba user for Samba share

```bash
sudo useradd -m <username>
sudo smbpasswd -a <username>

```

### Editing Samba configuration file

Then, edit the Samba configuration file located at `/etc/samba/smb.conf`. A minimal configuration file would look like this:

```
[share]
        path = /home/<username>/share (or desired directory)
        writeable = yes
        browseable = yes
        valid users = <username>
```

You may require sudo permissions to edit the file.

### Restart Samba

Run the following command to restart the Samba service:

```bash
systemctl restart smbd.service
```

You should now be able to access the share from another computer on the network.
