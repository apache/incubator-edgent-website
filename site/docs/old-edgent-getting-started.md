---
title: Getting started with Apache Edgent pre-1.2.0
---

This information applies to Edgent releases prior to 1.2.0.  See [Getting Started](edgent-getting-started) for current releases.

## What is Apache Edgent?

Edgent is an open source programming model and runtime for edge devices that enables you to analyze streaming data on your edge devices. When you analyze on the edge, you can:

* Reduce the amount of data that you transmit to your analytics server
* Reduce the amount of data that you store

For more information, see the [Edgent overview](home).

### Apache Edgent and streaming analytics

The fundamental building block of an Edgent application is a **stream**: a continuous sequence of tuples (messages, events, sensor readings, and so on).

The Edgent API provides the ability to process or analyze each tuple as it appears on a stream, resulting in a derived stream.

Source streams are streams that originate data for analysis, such as readings from a device's temperature sensor.

Streams are terminated using sink functions that can perform local device control or send information to centralized analytic systems through a message hub.

Edgent's primary API is functional where streams are sourced, transformed, analyzed or sinked though functions, typically represented as lambda expressions, such as `reading -> reading < 50 || reading > 80` to filter temperature readings in Fahrenheit.

### Samples

See [samples](old-samples) for information about samples that come with Edgent.

### Downloading Apache Edgent

To use Edgent, you need the Edgent JAR files, which you may obtain by completing the following steps.

1. Locate the Edgent release you would like to use on the [downloads page]({{ site.data.project.download }})
2. In the Bundles column for the desired release:
    * Click on the _Binary_ link if you simply want to use Edgent. This is the easiest method is to get up and running as it contains a pre-built version of Edgent.
    * Click on the _Source_ link if you would like access to the Edgent source files. If you choose this method, you must manually build Edgent yourself.
3. Download the .tgz file from one of the mirror sites
4. Unpack the downloaded file: `tar zxvf apache-edgent-X.X.X-incubating-XXX.tgz`
5. Obtain the JARs
    * If you are using a binary bundle, then the Java 8 JARs are located in `edgent-X.X.X/java8`
    * If you are using a source bundle, build the source code:
        1. Install [Gradle](https://gradle.org/) if it is not yet installed
        2. Navigate to the unpacked directory: `cd edgent-X.X.X-src`
        3. Run `gradle` to initialize the Gradle wrapper
        4. Build the code and Javadoc: `./gradlew assemble`
        5. The Java 8 JARs are located in `edgent-X.X.X-src/build/distributions/java8`

### Setting up your environment

Ensure that you are running a supported environment. For more information, see the [Edgent overview](home). This guide assumes you're running Java 8. The Edgent Java 8 JAR files are located in either the `edgent-X.X.X/java8` or `edgent-X.X.X-src/build/distributions/java8` directory, depending on whether you downloaded a binary or source bundle.

1. Create a new Java project in Eclipse, and specify Java 8 as the execution environment JRE:

    <img src="images/New_Java_Project.jpg">


2. Include one or more Edgent JARs in your project's build path depending on what features your application uses:
    1. Include one or more of the topology providers:
        * `java8/lib/edgent.providers.development.jar` (if using the [DevelopmentProvider]({{ site.docsurl }}/org/apache/{{ site.data.project.unix_name }}/providers/development/DevelopmentProvider.html))
        * `java8/lib/edgent.providers.direct.jar`(if using the [DirectProvider]({{ site.docsurl }}/org/apache/{{ site.data.project.unix_name }}/providers/direct/DirectProvider.html))
        * `java8/lib/edgent.providers.iot.jar` (if using the [IotProvider]({{ site.docsurl }}/org/apache/{{ site.data.project.unix_name }}/providers/iot/IotProvider.html))
    2. Include the JARs for any Edgent connectors or analytic features you use in `java8/connectors` and `java8/analytics`, respectively
    3. Include the JARs for any Edgent utility features you use:
        * `java8/utils/metrics/lib/edgent.utils.metrics.jar` (for the [org.apache.edgent.metrics]({{ site.docsurl }}/org/apache/{{ site.data.project.unix_name }}/metrics/package-summary.html) package)
        * `java8/utils/streamscope/lib/edgent.utils.streamscope.jar` (for the [org.apache.edgent.streamscope]({{ site.docsurl }}/org/apache/{{ site.data.project.unix_name }}/streamscope/package-summary.html) package)
    4. Include the JAR for the [java.util.logging](https://docs.oracle.com/javase/8/docs/api/java/util/logging/package-summary.html) framework for [SLF4J](https://www.slf4j.org/): `java8/ext/slf4j-jdk14-X.X.X.jar`

    <img src="images/Build_Path_JARs.jpg">

Your environment is set up! You can start writing your first Edgent application.

## Creating a simple application

If you're new to Edgent or to writing streaming applications, the best way to get started is to write a simple program.

Edgent is a framework that pushes data analytics and machine learning to *edge devices*. (Edge devices include things like routers, gateways, machines, equipment, sensors, appliances, or vehicles that are connected to a network.) Edgent enables you to process data locally&mdash;such as, in a car engine, on an Android phone, or on a Raspberry Pi&mdash;before you send data over a network.

For example, if your device takes temperature readings from a sensor 1,000 times per second, it is more efficient to process the data locally and send only interesting or unexpected results over the network. To simulate this, let's define a (simulated) TempSensor class:

```java
import java.util.Random;

import org.apache.edgent.function.Supplier;

/**
 * Every time get() is called, TempSensor generates a temperature reading.
 */
public class TempSensor implements Supplier<Double> {
    double currentTemp = 65.0;
    Random rand;

    TempSensor(){
        rand = new Random();
    }

    @Override
    public Double get() {
        // Change the current temperature some random amount
        double newTemp = rand.nextGaussian() + currentTemp;
        currentTemp = newTemp;
        return currentTemp;
    }
}
```

Every time you call `TempSensor.get()`, it returns a new temperature reading. The continuous temperature readings are a stream of data that an Edgent application can process.

Our sample Edgent application processes this stream by filtering the data and printing the results. Let's define a TempSensorApplication class for the application:

```java
import java.util.concurrent.TimeUnit;

import org.apache.edgent.providers.direct.DirectProvider;
import org.apache.edgent.topology.TStream;
import org.apache.edgent.topology.Topology;

public class TempSensorApplication {
    public static void main(String[] args) throws Exception {
        TempSensor sensor = new TempSensor();
        DirectProvider dp = new DirectProvider();
        Topology topology = dp.newTopology();
        TStream<Double> tempReadings = topology.poll(sensor, 1, TimeUnit.MILLISECONDS);
        TStream<Double> filteredReadings = tempReadings.filter(reading -> reading < 50 || reading > 80);

        filteredReadings.print();
        dp.submit(topology);
    }
}
```

To understand how the application processes the stream, let's review each line.

### Specifying a provider

Your first step when you write an Edgent application is to create a [`DirectProvider`]({{ site.docsurl }}/index.html?org/apache/{{ site.data.project.unix_name }}/providers/direct/DirectProvider.html):

```java
DirectProvider dp = new DirectProvider();
```

A `Provider` is an object that contains information on how and where your Edgent application will run. A `DirectProvider` is a type of Provider that runs your application directly within the current virtual machine when its [`submit()`]({{ site.docsurl }}/org/apache/{{ site.data.project.unix_name }}/providers/direct/DirectProvider.html#submit-org.apache.{{ site.data.project.unix_name }}.topology.Topology-) method is called.

### Creating a topology

Additionally, a Provider is used to create a [`Topology`]({{ site.docsurl }}/index.html?org/apache/{{ site.data.project.unix_name }}/topology/Topology.html) instance:

```java
Topology topology = dp.newTopology();
```

In Edgent, `Topology` is a container that describes the structure of your application:

* Where the streams in the application come from
* How the data in the stream is modified

In the TempSensorApplication class above, we have exactly one data source: the `TempSensor` object. We define the source stream by calling [`topology.poll()`]({{ site.docsurl }}/org/apache/{{ site.data.project.unix_name }}/topology/Topology.html#poll-org.apache.{{ site.data.project.unix_name }}.function.Supplier-long-java.util.concurrent.TimeUnit-), which takes both a [`Supplier`]({{ site.docsurl }}/index.html?org/apache/{{ site.data.project.unix_name }}/function/Supplier.html) function and a time parameter to indicate how frequently readings should be taken. In our case, we read from the sensor every millisecond:

```java
TStream<Double> tempReadings = topology.poll(sensor, 1, TimeUnit.MILLISECONDS);
```

### Defining the `TStream` object

Calling `topology.poll()` to define a source stream creates a `TStream<Double>` instance, which represents the series of readings taken from the temperature sensor.

A streaming application can run indefinitely, so the [`TStream`]({{ site.docsurl }}/index.html?org/apache/{{ site.data.project.unix_name }}/topology/TStream.html) might see an arbitrarily large number of readings pass through it. Because a `TStream` represents the flow of your data, it supports a number of operations which allow you to modify your data.

### Filtering a `TStream`

In our example, we want to filter the stream of temperature readings, and remove any "uninteresting" or expected readings&mdash;specifically readings which are above 50 degrees and below 80 degrees. To do this, we call the `TStream`'s [`filter`]({{ site.docsurl }}/org/apache/{{ site.data.project.unix_name }}/topology/TStream.html#filter-org.apache.{{ site.data.project.unix_name }}.function.Predicate-) method and pass in a function that returns *true* if the data is interesting and *false* if the data is uninteresting:

```java
TStream<Double> filteredReadings = tempReadings.filter(reading -> reading < 50 || reading > 80);
```

As you can see, the function that is passed to `filter` operates on each tuple individually. Unlike data streaming frameworks like [Apache Spark](https://spark.apache.org/), which operate on a collection of data in batch mode, Edgent achieves low latency processing by manipulating each piece of data as soon as it becomes available. Filtering a `TStream` produces another `TStream` that contains only the filtered tuples; for example, the `filteredReadings` stream.

### Printing to output

When our application detects interesting data (data outside of the expected parameters), we want to print results. You can do this by calling the [`TStream.print()`]({{ site.docsurl }}/org/apache/{{ site.data.project.unix_name }}/topology/TStream.html#print--) method, which prints using  `.toString()` on each tuple that passes through the stream:

```java
filteredReadings.print();
```

Unlike `TStream.filter()`, `TStream.print()` does not produce another `TStream`. This is because `TStream.print()` is a **sink**, which represents the terminus of a stream.

In addition to `TStream.print()` there are other sink operations that send tuples to an MQTT server, JDBC connection, file, or Kafka cluster. Additionally, you can define your own sink by invoking [`TStream.sink()`]({{ site.docsurl }}/org/apache/{{ site.data.project.unix_name }}/topology/TStream.html#sink-org.apache.{{ site.data.project.unix_name }}.function.Consumer-) and passing in your own function.

### Submitting your application

Now that your application has been completely declared, the final step is to run your application.

`DirectProvider` contains a `submit()` method, which runs your application directly within the current virtual machine:

```java
dp.submit(topology);
```

After you run your program, you should see output containing only "interesting" data coming from your sensor:

```
49.904032311772596
47.97837504039084
46.59272336309031
46.681544551652934
47.400819234155236
...
```

As you can see, all temperatures are outside the 50-80 degree range. In terms of a real-world application, this would prevent a device from sending superfluous data over a network, thereby reducing communication costs.

## Further examples

This example demonstrates a small piece of Edgent's functionality. Edgent supports more complicated topologies, such as topologies that require merging and splitting data streams, or perform operations which aggregate the last *N* seconds of data (for example, calculating a moving average).

For more complex examples, see:

* [Edgent sample programs](old-samples)
* [Stream processing concepts](streaming-concepts)
* [Common Edgent operations](common-edgent-operations)
