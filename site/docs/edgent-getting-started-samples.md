---
title: Getting started with Apache Edgent Samples
---

Getting started with the Edgent samples is a great way to start using Edgent and
jump-start your Edgent application development.

Be sure to see _Additional Resources_ below for more great info!

# Quickstart

Convenience binaries (jars) for the Edgent runtime releases are distributed
to the ASF Nexus Repository and the Maven Central Repository.  You don't have
to manually download the Edgent jars and there is no need to download the 
Edgent runtime sources and build them unless you want to.

By default the samples depend on Java8.  Download and install Java8 if needed.

## Download the Edgent Samples

Get the Edgent Samples either by cloning or downloading the [Edgent Samples GitHub repository](https://github.com/apache/incubator-edgent-samples):

```sh
git clone https://github.com/apache/incubator-edgent-samples
cd incubator-edgent-samples
git checkout develop
```
or to download:

  + Open the _Clone or download_ pulldown at the [Edgent Samples GitHub repository](https://github.com/apache/incubator-edgent-samples)
  + Click on _Download ZIP_
  + Unpack the downloaded ZIP

```sh
    unzip incubator-edgent-samples-develop.zip
```

## Build the Samples

```sh
cd <the cloned or unpacked downloaded samples folder>
./mvnw clean package  # build for Java8
```

## Run the HelloEdgent sample

```sh
cd topology
./run-sample.sh HelloEdgent   # prints a hello message and terminates
  Hello
  Edgent!
  ...
```

# Additional Resources

See [The Power of Edgent](power-of-edgent) to help you quickly start to get a sense of Edgent's capabilities.
See the [Getting Started Guide](edgent-getting-started) for a tutorial.

Much more information about the samples is available in the README.md at the [Edgent Samples GitHub repository](https://github.com/apache/incubator-edgent-samples), including:

  + application development and packaging
  + application template project
  + list of samples
  + using an IDE
