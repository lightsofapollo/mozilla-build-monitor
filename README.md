# mozilla-build-monitor

Watches mozilla's pulse for incoming build status messages and (soon)
uploads the complete builds to s3.

## Deployment

This project is automatically deployed (from travis-ci) whenever code is
landed in master and tests pass (as of writing there are no tests so
push = deploy)

## Usage

See:

```sh
./bin/buildmonitor --help
```
