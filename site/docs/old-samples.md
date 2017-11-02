---
title: Sample programs
---

This information applies to Edgent releases prior to 1.2.0. See [Getting started guide](edgent-getting-started) for current releases.

The [Getting started guide](edgent-getting-started) includes a step-by-step walkthrough of a simple Edgent application.

Edgent also includes a number of sample Java applications that demonstrate different ways that you can use and implement Edgent.

If you are using a released version of Edgent, the samples are already compiled and ready to use. If you downloaded the source or the Git project, the samples are built when you build Edgent.

## Resources

The samples are currently available only for Java 8 environments. To use the samples, you'll need the resources in the following subdirectories of the Edgent package.:

* The `java8/samples` directory contains the Java code for the samples
* The `java8/scripts` directory contains the shell scripts that you need to run the samples

If you use any of the samples in your own applications, ensure that you include the related Edgent JAR files in your `classpath`.

## Recommended samples

In addition to the sample application in the [Getting started guide](edgent-getting-started), the following samples can help you start developing with Edgent:

* **HelloEdgent**
  - This simple program demonstrates the basic mechanics of declaring and executing a topology
* **PeriodicSource**
  - This simple program demonstrates how to periodically poll a source for data to create a source stream
* **SimpleFilterTransform**
  - This simple program demonstrates a simple analytics pipeline: `source -> filter -> transform -> sink`
* **SensorAnalytics**
  - This more complex program demonstrates multiple facets of an Edgent application, including:
      * Configuration control
      * Reading data from a device with multiple sensors
      * Running common analytic algorithms
      * Publishing results to MQTT server
      * Receiving commands
      * Logging results locally
      * Conditional stream tracing
* **IBM Watson IoT Platform**
  - Samples that demonstrate how to use IBM Watson IoT Platform as the IoT scale message hub between Edgent and back-end analytic systems:
      * [Sample using the no-registration Quickstart service](quickstart)

Additional samples are documented in the [Edgent Overview]({{ site.docsurl }}/overview-summary.html#overview.description) section of the Javadoc.
