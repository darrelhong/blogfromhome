---
title: "Git: 3 ways"
pubDate: 2024-04-03
description: "Evolving methods of interacting with Git."
author: "Darrel"
image: {}
tags: ["Git", "Development", "Thoughts"]
readTime: 5
---

## Command line

Git is a CLI tool, so naturally the command line will be the first method of interacting with Git. When using Git for the first time, most people probably copy and pasted commands from a tutorial without learning the concepts first. For simple use cases, this is fine and you can get quite far with just using `git add` and `git commit`. However, as you come across more complex scenarios and start to work with distributed changes, you may find yourself stuck and not being able to execute the commands that you need.

![basic git commands](./images/git-basic.avif)

I have definitely encountered situtaions where I didn't know what was going on and just ran `git reset --hard` to solve everything. And you probably have too. That is why for many junior developers, using a Git GUI is recommended as they are often easier to understand and you do not need to remember the commands.

## Git GUI

The command line is a very powerful tool, but it can present a steep learning curve for new users. Even if you have an understanding of the Git concepts, it can still be hard to wrap your head around what is happening. A GUI is very useful in this case as it lays out the changes and gives you a visual representation of your commit history and branches etc. This make it much easier to understand what the current state of the repository and what the effects of your actions are. With a GUI, certain actions such as partial commits and merge conflicts are much easier to perform, as you can select which changes to keep with a click.

There are many Git GUIs available out there from GitHub Desktop to Sourcetree. However, some of these GUIs either do not provide the full functionality of Git or are very abstracted such that you are not aware of what commands are even being run on your repository. The best GUI that I have found is [Submlime Merge](https://www.sublimemerge.com/) which is not only fast and simple to use, but most importantly, shows you exactly what commands are being run. In my opinion, this is the best way to learn Git and really helps gives a better understanding of the Git more than any command line-based tutorial.

![sublime merge](./images/git-sublime-merge.avif)

## Back to the command line

As you get more experienced with Git and working on larger projects, you might find that a Git GUI is not the fastest way to get things done. In my experience, while Sublime Merge is very performant, it can still be slow on large repositories. And when you encounter repositories that even the Git CLI takes a while to respond, using a GUI is a non-starter. Because of this, I was forced to ditch Git clients altogether and go back to the command line. However, this time, I had a much better understanding of Git and I realised I was able to do things much faster than before. Commands such as `git rebase --interactive` and `git log --patch` felt more intuitive and were actually easier to operate than in a GUI.

## Git GUI + Command line

But what if you still wanted a visual overview of the repository and want a UI for things like merge conflicts? Well, you can have the best of both worlds by using a Git terminal UI like [Lazygit](https://github.com/jesseduffield/lazygit). It gives you all the features of a Git GUI but with the speed and power of the command line. Given that it is in the terminal, you can also easily switch between the command line and only bring up the UI when you need it.

![lazygit](./images/git-lazygit.avif)

## Your way

Most of the time, only a handful of Git commands are the most frequently used and you can easily remember them. You can also create aliases or use a shell plugin to execute them with just a few keystrokes. These days when working in smaller repositories, I find myself just using VS Code's built in Git UI to quickly view the changes made and then using the command line to execute commands. In cases where the UI is too slow, basic `git status` and `git diff` commands provide almost all you need tp view your changes and commit them.

In sum, the title of this post is slightly misleading as there all the methods presented involve are esseentially using the command line, but the way they are presented makes a significant difference in how you interact with Git. I highly recommend that you explore all the options out there and find out what works best for you.
