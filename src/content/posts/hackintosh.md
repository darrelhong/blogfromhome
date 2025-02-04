---
title: "Setting up a Hackintosh"
pubDate: 2025-02-02
description: ""
author: "Darrel"
image: {}
tags: ["Hackintosh", "Mac"]
readTime: 10
---


I recently setup a new Hackintosh build and I wanted to share some of the issues I faced and how to overcome them. I expected that the process would be fairly straightforward as I had done it a few times before and this time I had a much more compatible build. Also, hackinosh documentation has come a long way since the Clover days and Dortania's OpenCore guide is very comprehensive and easy to follow. However, there was just a few steps I needed to do differently to get everything working. 

Builds can be very specific and tied to the hardware so this is the specs of my build:

- CPU: Intel Core i7-9700
- GPU: AMD Radeon VII GTX
- Motherboard:  ROG Z390 Maximus XI Hero (Wi-Fi)
- MacOS: Sequoia 15.2

## Installation issues

The first issue I encountered came when trying to boot into the installer. It would boot partially and then panic with a stop sign with a link to `support.apple.com/macsetup`. The debugging messages weren't very helpful but I saw that just a few lines before it was related to USB. Searching online, I found that a few people suggested to disable `XhciPortLimit` in the OpenCore config.plist. The Dortania docs specified to enable this option on macOS 11.3+, which is why it was enabled. But it appears this is a common issue when not having a proper USB map. After disabling this, I was able to boot into the installer and complete the installation. As a note, the documentation recommends to create a USB map so it is best to do that after installation, if you do not have access to a windows machine beforehand.


## Post-install issues

After installation, almost everything was working out of the box, which is expected, but Bluetooth wasn't working, even thought it was detected in the System Information. Once again, I searched online and found some solutions. It appears that the Wi-Fi and Bluetooh stacks are tied together in this Intel chipsets and some additional kexts needed to be installed. The kexts needed were `BlueToolFixup.kext`, `IntelBTPatcher.kext` and `IntelBluetoothFirmware.kext`. After installing the kexts, Bluetooth was still not working but it turns out the final steps needed were to add the following values under `NVRAM > 7C436110-AB2A-4BBB-A880-FE41995C9F82` in the config.plist:

| Key | Type | Value |
| ----------- | ----------- | ----------- |
| bluetoothExternalDongleFailed | Data | 00 |
| bluetoothInternalControllerInfo | String | 0000000000000000000000000000 |

After rebooting, Bluetooth was working on the hackintosh.

## Sleep issues

Sleep issues
hibernatemode 0
proximitywake 0