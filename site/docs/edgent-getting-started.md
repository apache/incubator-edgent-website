---
title: Getting started with Apache Edgent
---

## What is Apache Edgent?

Edgent is an open source programming model and runtime for edge devices that enables you to analyze streaming data on your edge devices. When you analyze on the edge, you can:

* Reduce the amount of data that you transmit to your analytics server
* Reduce the amount of data that you store

Edgent accellerates your development of applications to push data analytics and machine learning to *edge devices*. (Edge devices include things like routers, gateways, machines, equipment, sensors, appliances, or vehicles that are connected to a network.) Edgent applications process data locally&mdash;such as, in a car, on an Android phone, or on a Raspberry Pi&mdash;before it sends data over a network.

For example, if your device takes temperature readings from a sensor 1,000 times per second, it is more efficient to process the data locally and send only interesting or unexpected results over the network.

Releases of Edgent prior to 1.2.0 distributed Edgent and the samples differently than today.  See [Old Getting Started](old-edgent-getting-started) if you are trying to use an older version.

There's a lot of information available to get started with Edgent and no "best order" for navigating it.  See the navigation sidebar on the left hand side of this page.  In particular it is recommended that you review and visit the various items under _Get Started_.

If you want to get a developent environment setup quickly see the [Quickstart with Edgent Samples](edgent-getting-started-samples) item. 

The _Edgent Cookbook_ topic includes many well documented recipies that are good for learning and jump-starting the development of your application.

The rest of this page is an introduction to Edgent using a simple simulated Temperature Sensor application.


## Apache Edgent and streaming analytics

The fundamental building block of an Edgent application is a **stream**: a continuous sequence of tuples (messages, events, sensor readings, and so on).

The Edgent API provides the ability to process or analyze each tuple as it appears on a stream, resulting in a derived stream.

Source streams are streams that originate data for analysis, such as readings from a device's temperature sensor.

Streams are terminated using sink functions that can perform local device control or send information to external services such as centralized analytic systems through a message hub.

Edgent's primary API is functional where streams are sourced, transformed, analyzed or sinked though functions, typically represented as Java8 lambda expressions, such as `reading -> reading < 50 || reading > 80` to filter temperature readings in Fahrenheit.

A **topology** is a graph of streams and their processing transformations. A **provider** is a factory for creating and executing topologies.

Basic Edgent Applications follow a common structure:

  1. Get a provider
  2. Create the topology and compose its processing graph
  3. Submit the topology for execution

More sophisticated applications may consist of multiple topologies that may be dynamically created and started and stopped using commands from external  applications.

## Temperature Sensor Application

If you're new to Edgent or to writing streaming applications, the best way to get started is to write a simple program.

First we'll go over the details of the application, then we'll run it.

Let's create a simple Temperature Sensor Application. The application takes temperature readings from a sensor 1,000 times per second. Instead of reporting each reading, it is more efficient to process the data locally and send only interesting or unexpected results over the network.

To simulate this, let's define a (simulated) TempSensor class:

```java
import java.util.Random;

import org.apache.edgent.function.Supplier;

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

Every time `TempSensor.get()` is called, it returns a new temperature reading.

Our application composes a topology that creates a continuous stream of temperature readings and processes this stream by filtering the data and printing the results. Let's define a TempSensorApplication class for the application:

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

Let's review each line.

### Specifying a provider

Your first step when you write an Edgent application is to create a _Provider_.  In this case we're using a [`DirectProvider`]({{ site.docsurl }}/index.html?org/apache/{{ site.data.project.unix_name }}/providers/direct/DirectProvider.html):

```java
DirectProvider dp = new DirectProvider();
```

A `Provider` is an object that contains information on how and where your Edgent application will run. A `DirectProvider` is a type of Provider that runs your application directly within the current virtual machine when its [`submit()`]({{ site.docsurl }}/org/apache/{{ site.data.project.unix_name }}/providers/direct/DirectProvider.html#submit-org.apache.{{ site.data.project.unix_name }}.topology.Topology-) method is called.

The [`IotProvider`]({{ site.docsurl }}/index.html?org/apache/{{ site.data.project.unix_name }}/providers/iot/IotProvider.html) is an alternative that offers very useful and powerful capabilities.

### Creating a topology

The Provider is used to create a [`Topology`]({{ site.docsurl }}/index.html?org/apache/{{ site.data.project.unix_name }}/topology/Topology.html) instance:

```java
Topology topology = dp.newTopology();
```

In Edgent, `Topology` is a container that describes the structure of your processing graph:

* Where the streams in the application come from
* How the data in the stream is modified

Our application then composes the topology's progessing graph.

### Creating a source `TStream`

In the `TempSensorApplication` class above, we have exactly one data source: the `TempSensor` object. We define the source stream by calling [`topology.poll()`]({{ site.docsurl }}/org/apache/{{ site.data.project.unix_name }}/topology/Topology.html#poll-org.apache.{{ site.data.project.unix_name }}.function.Supplier-long-java.util.concurrent.TimeUnit-), which takes both a [`Supplier`]({{ site.docsurl }}/index.html?org/apache/{{ site.data.project.unix_name }}/function/Supplier.html) function and a time parameter to indicate how frequently readings should be taken. In our case, we read from the sensor every millisecond:

```java
TStream<Double> tempReadings = topology.poll(sensor, 1, TimeUnit.MILLISECONDS);
```

Calling `topology.poll()` to define a source stream creates a `TStream<Double>` instance (because `TempSensor.get()` returns a `Double`), which represents the series of readings taken from the temperature sensor.

A streaming application can run indefinitely, so the [`TStream`]({{ site.docsurl }}/index.html?org/apache/{{ site.data.project.unix_name }}/topology/TStream.html) might see an arbitrarily large number of readings pass through it. Because a `TStream` represents the flow of your data, it supports a number of operations which allow you to modify your data.

### Filtering a `TStream`

In our example, we want to filter the stream of temperature readings, and remove any "uninteresting" or expected readings&mdash;specifically readings which are above 50 degrees and below 80 degrees. To do this, we call the `TStream`'s [`filter`]({{ site.docsurl }}/org/apache/{{ site.data.project.unix_name }}/topology/TStream.html#filter-org.apache.{{ site.data.project.unix_name }}.function.Predicate-) method and pass in a function that returns *true* if the data is interesting and *false* if the data is uninteresting:

```java
TStream<Double> filteredReadings = tempReadings.filter(reading -> reading < 50 || reading > 80);
```

As you can see, the function that is passed to `filter` operates on each tuple individually. Unlike data streaming frameworks like [Apache Spark](https://spark.apache.org/), which operate on a collection of data in batch mode, Edgent achieves low latency processing by manipulating each piece of data as soon as it becomes available. Filtering a `TStream` produces another `TStream` that contains only the filtered tuples; in this case, the `filteredReadings` stream.

### Printing to output

When our application detects interesting data (data outside of the expected parameters), we want to print results. You can do this by calling the [`TStream.print()`]({{ site.docsurl }}/org/apache/{{ site.data.project.unix_name }}/topology/TStream.html#print--) method, which prints using  `.toString()` on each tuple that passes through the stream:

```java
filteredReadings.print();
```

Unlike `TStream.filter()`, `TStream.print()` does not produce another `TStream`. This is because `TStream.print()` is a **sink**, which represents the terminus of a stream.

A real application typically publishes results to an MQTT server, IoT Hub, Kafka cluster, file, JDBC connection, or other external system. Edgent comes easy to use connectors for these. See the _connectors_ samples, [Edgent Javadoc]({{ site.docsurl }}), and _Edgent Cookbook_ for more information.

You can define your own sink by invoking [`TStream.sink()`]({{ site.docsurl }}/org/apache/{{ site.data.project.unix_name }}/topology/TStream.html#sink-org.apache.{{ site.data.project.unix_name }}.function.Consumer-) and passing in your own function.

### Submitting your topology

Now that your topology / processing graph has been completely declared, the final step is to run it.

`DirectProvider` contains a `submit()` method, which runs a topology directly within the current virtual machine:

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


### Building and Running

Its easiest to use the Edgent Samples Source release to get started.

If you just want to see this application in action, it's one of the provided samples!

Go to [Getting Started with Samples](edgent-getting-started-samples) to get and build the samples.

Then you can run this application from the command line:

```sh
cd <the-unpacked-samples-root-folder>
cd topology; ./run-sample.sh TempSensorApplication
  46.59272336309031
  46.681544551652934
  ...
^C to terminate it
```

If you setup an Eclipse workspace with the samples, you can run the application from Eclipse:

1. From the Eclipse *Navigate* menu, select *Open Type*
   + enter type type name `TempSensorApplication` and click *OK*
2. right click on the `TempSensorApplication` class name and from the context menu
   + click on *Run As*, then *Java application*.  
   `TempSensorApplication` runs and prints to the Console view.
   Click on the `terminate` control in the Console view to stop the application.


### Creating your own project

In this flow we'll take you though creating a new project for this application.
Its easiest to use the `template` project in the Edgent Samples to get started.

Go to [Getting Started with Samples](edgent-getting-started-samples) and follow the steps to

  * do the general samples setup
  * clone the `template` project to use for this application

Then create the `TempSensor.java` and `TempSensorApplication.java` files in the project, copying in the above code.

To build and run from the command line, see the new project's README.md (copied in from the template).
In the project's folder (adjust the package name below if appropriate)

```sh
./mvnw clean package
./app-run.sh --main com.mycompany.app.TempSensorApplication
  46.59272336309031
  46.681544551652934
  ...
^C to terminate it
```

If you setup the cloned template in an Eclipse workspace:

1. From the Eclipse *Navigate* menu, select *Open Type*
   + enter type type name `TempSensorApplication` and click *OK*
2. right click on the `TempSensorApplication` class name and from the context menu
   + click on *Run As*, then *Java application*.  
   `TempSensorApplication` runs and prints to the Console view.
   Click on the `terminate` control in the Console view to stop the application.

## Next Steps

This introduction demonstrates a small piece of Edgent's functionality. Edgent supports more complicated topologies, such as topologies that require merging and splitting data streams, or perform operations which aggregate the last *N* seconds of data (for example, calculating a moving average). Typically your application will want to publish to an IoT hub and be controlled by applications in a data center.

There are many more useful resources under the _Get Started_ and _Edgent Cookbook_ topics in the navigation sidebar on the left hand side of this page.
