---
title: Sample Programs
---

# Sample Quarks programs
The [Getting Started](quarks-getting-started) guide includes a step-by-step walkthrough of a simple Quarks application.

Quarks also includes a number of sample Java applications that demonstrate different ways that you can use and implement Quarks.

If you are using a released version of Quarks, the samples are already compiled and ready to use. If you downloaded the source or the Git project, the samples are built when you build Quarks.

## Resources
The samples are currently available only for Java 8 environments. To use the samples, you'll need the resources in the following subdirectories of the Quarks package.:

* The `java8/samples` directory contains the Java code for the samples.

* The `java8/scripts` directory contains the shell scripts that you need to run the samples.

If you use any of the samples in your own applications, ensure that you include the related Quarks JAR files in your `classpath`.

## Recommended samples
In addition to the sample application in the [Getting Started](quarks-getting-started) guide, the following samples can help you start developing with Quarks:

* **HelloWorld**

  This simple program demonstrates the basic mechanics of declaring and executing a topology.

* **PeriodicSource**

  This simple program demonstrates how to periodically poll a source for data to create a source stream.

* **SimpleFilterTransform**

  This simple program demonstrates a simple analytics pipeline:
  source -> filter -> transform -> sink

* **SensorAnalytics**

  This more complex program demonstrates multiple facets of a Quarks application, including:

  * Configuration control
  * Reading data from a device with multiple sensors
  * Running common analytic algorithms
  * Publishing results to MQTT server
  * Receiving commands
  * Logging results locally
  * Conditional stream tracing

* **IBM Watson IoT Platform** 

   Samples that demonstrate how to use IBM Watson IoT Platform as the IoT scale message hub between Quarks and back-end analytic systems:
   
   * [Sample using the no-registration Quickstart service](quickstart)

Additional samples are documented in the [Quarks Overview](http://quarks-edge.github.io/quarks/docs/javadoc/overview-summary.html#overview.description) section of the Javadoc.
