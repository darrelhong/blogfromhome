---
title: How to debug flaky RSpec tests
pubDate: 2025-05-24
author: "Darrel"
image: {}
tags: ["Ruby", "GitHub Actions", "RSpec", "CI"]
readTime: 5
---

When running RSpec tests, you may encounter flaky tests that fail intermittently in a CI environment but pass when running in isolation or locally. I experienced this issue while trying to [even out runtimes of parallel CI jobs](split-ruby-tests-evenly) in a Ruby on Rails project. 

After adding the `parallel_tests` gem and using it to run tests, there was a noticeable increase in spontaneous test failures. However, the tests were flaky in the sense that different examples would fail across different branches, but the failures were were somewhat consistent on the same branch. Crucuially, there was nothing wrong with the tests themselves, and passed 100% of the time when run locally even across repeated runs.

This suggests that the issue could be related to the CI environment or the ordering of tests. Though it was quick to rule out the CI envvironment differences as all the setup was the same, e.g database versions, transaction isolalation levels, etc. I did not believe that the ordering of tests could be an issue as tests should be run file by file, and running each file individually did not reproduce the behaviour. This is where the `--bisect` option of RSpec comes in. When using `parallel_tests` with the `--verbose-rerun-command` option, it will output the actual command used to run the tests. When a runner fails, we can use this command and add the `--bisect` option to it. From the docs, this option will:
> repeatedly run subsets of your suite in order to isolate the minimal set of examples that reproduce the same failures.

This process will take longer than usual but if successful, it will output a command to run that should reliably reproduce the test failures. Sure enough, in the the project i was working on, RSpec managed to find a sequence of tests that would fail and this command would also fail locally.

The error that came up seemed to be related to inconsistent database states. But the tests were not directly related to each other and since tests should be run on a per-file basis, I was not exactly sure how separate examples from separate files can conflict with each other. Manually clearing some of the states before the tests helo resolve the issue, however, the same issue might pop up for other test sequences and this was not a scalable solution.

Utimately after some digging, I noticed the project was using the `database-cleaner` gem, but using the `before` and `after` hooks to do the necessary cleanup actions instead of the `around` hook as recommended by the docs. With not many options left, I updated the configuration and it miraculously allowed the failing sequence of tests to pass. I definitely do not have enough information to know how this ended up fixing the issue, but all the CI tests from the on ran much more consistently after the change.

Sometimes, all you need is some trial and error and just a little more context of how to even go about debugging weird, unexplainable issues by first replicating the issue. Hope this guide has helped you in your own test suites.

