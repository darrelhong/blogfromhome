---
title: How to run Ruby tests in parallel with even runtimes
pubDate: 2025-05-15
description: "Split your Ruby across multiple GitHub Actions runners with even runtimes"
author: "Darrel"
image: {}
tags: ["Ruby", "GitHub Actions", "RSpec", "CI"]
readTime: 10
---

To speed up your Ruby tests suites in CI, it is common to run them in parallel across multiple runners. This can be done with GitHub Actions by using the `matrix` strategy. The config below shows how to run your tests in parallel across 1 runners:

```yaml
strategy:
  fail-fast: false
    matrix:
      index: [0, 1]
continue-on-error: true
```

To run only a subset of tests, you can use a script that scans your test files outputs the paths of the files to be run in each runner. This can be readily generated with ant LLM so it will be best to create one that fits your codebase.

However, this approach can easily lead to uneven runtimes across the runners. As not all tests files are equal and some may contain heavier database actions. This means splitting your tests across 4 runners for example will not lead to a 4x speedup, as the final runtime will be limited by the slowest runner.

To solve this, we can make use of the [`parallel_tests`](https://github.com/grosser/parallel_tests/) gem. Out of the box, parallel_tests comes with the ability to split  tests by filesize, which means that a custom script like above is not needed. The options `-n` and `--only-group` can be used to run a subset of tests in a parallel runner. `-n` specifies the number of parallel runners that are used, and `--only-group` specifies the group to be run.

```
bundle exec parallel_test -n 2 --only-group ${{ matrix }}
```

This will run the tests in parallel across 4 runners, and each runner will only run the tests that are assigned to it.

parallel_tests also comes with the ability to split tests by runtime. This is done by using the `--group-by runtime` option. However, for this to work, it needs to have the runtime of each test file. We can do this by outputting the runtime of each test file, combining all the logs from each runner and then caching it using the `actions/cache` action.

First, we need to output the runtimes of the tests, which can be done by adding the format option below.

```
--format ParallelTests::RSpec::RuntimeLogger --out tmp/parallel_runtime_rspec.log
```

Then, save the log for each runner to a cache.

```yaml
- name: "Clear previous runner log"
  if: (success() || failure()
  run: |
    gh cache delete runtime-log-runner-${{ matrix.index }}
  continue-on-error: true
- name: "Save runner log"
  uses: actions/cache/save@v4
  if: success() || failure()
  with:
    key: runtime-log-runner-${{ matrix.index }}
    path: tmp/parallel_runtime_logs
```

If you notice, we must always clear the previous cache before saving the new one. This is because GitHub caches are designed to be immutable and we are somewhat using it in a way that was not intended. We use `continue-on-error: true` to avoid failing the job if an existing cache is not found.

In a separate job, we can then combine all the logs from each runner and save it to a cache.

```yaml
steps:
  - name: "Restore chunk 0"
    uses: actions/cache/restore@v4
    with:
      key: runtime-log-runner-0
      path: tmp/parallel_runtime_logs

  - name: "Restore chunk 1"
    uses: actions/cache/restore@v4
    with:
      key: runtime-log-runner-1
      path: tmp/parallel_runtime_logs
```
As we require all chunk to be restored in the same, we need to manually repeat the restore step for each chunk.

```yaml
  - name: "Combine chunks"
    run: |
      cat tmp/parallel_runtime_logs/* > tmp/parallel_runtime_rspec.log
      cat tmp/parallel_runtime_rspec.log
```

After combining the logs, we can save it to a cache similarly to how we did for each runner.

```yaml
  - name: "Clear previous combined log"
    run: |
      gh cache delete runtime-logs-all
    continue-on-error: true
  - name: "RSpec runtime log cache: save combined log"
    uses: actions/cache/save@v4
    with:
      key: runtime-logs-all
      path: tmp/parallel_runtime_rspec.log
```

Finally we need to add a step to restore the combined log in our actual test job. Add this step before the test step.

```yaml
name: "RSpec runtime log cache: restore combined log"
  uses: actions/cache/restore@v4
  with:
    key: runtime-logs-all
    path: tmp/parallel_runtime_rspec.log
```

With this setup, you should be able to see your test runtimes evenly distributed across runners after the first run.

Also, notice that our cache keys are not unique which opens the door to a lot of race condition issues in a real project where there are multiple branches running CI at the same. Therefore, it is recommended to only run the cache saving step when running on the main branch, and also prevents too much writing to the cache. This can be done by adding a condition to the step.

```yaml
if: github.ref == 'refs/heads/main'
```

As all branches can access caches created by the main branch, so this allows any PR branch to also benefit from having even runtimes across runners.

## Conclusion

With this setup, you should now see your Ruby tests running in parallel across multiple runners with even runtimes. If you had particulary uneven runtimes before, this could lead to a significant speedup in your CI. Furthermore, it is easiliy scalable by simply adding more runners to the matrix.