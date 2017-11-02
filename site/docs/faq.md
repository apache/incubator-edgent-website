---
title: FAQ
---

## What is Apache Edgent?

Edgent provides APIs and a lightweight runtime enabling you to easily create event-driven applications to analyze streaming data at the edge.

## What do you mean by the edge?

The edge includes devices, gateways, equipment, vehicles, systems, appliances and sensors of all kinds as part of the Internet of Things.

It's easy for for Edgent applications to connect to other entities such as an enterprise IoT hub.

While Edgent's design center is executing on constrained edge devices, Edgent applications can run on any system meeting minimal requirements such as a Java runtime.

## How are applications developed?

Applications are developed using a functional flow API to define operations on data streams that are executed as a flow graph in a lightweight embeddable runtime. Edgent provides capabilities like windowing, aggregation and connectors with an extensible model for the community to expand its capabilities.

You can develop Edgent applications using an IDE of your choice. 

Generally, mechanisms for deploying an Edgent Application to a device are beyond the scope of Edgent; they are often device specific or may be defined by an enterprise IoT system.  To deploy an Edgent application to a device like a Raspberry Pi, you could just FTP the application to the device and modify the device to start the application upon startup or on command.   See [Edgent Application Development](application-development).

## What environments does Apache Edgent support?

Currently, Edgent provides APIs and runtime for Java and Android. Support for additional languages, such as Python, is likely as more developers get involved. Please consider joining the Edgent open source development community to accelerate the contributions of additional APIs.

## What type of analytics can be done with Apache Edgent?

The core Edgent APIs makes it easy to incorporate any analytics you want into the stream processing graph. Its trivial to create windows and trigger aggregation functions you supply. It's trivial to specify whatever filtering and transformation functions you want to supply. The functions you supply can use existing libraries.

Edgent comes with some initial analytics for aggregation and filtering that you may find useful. It uses Apache Common Math to provide simple analytics aimed at device sensors. In the future, Edgent will include more analytics, either exposing more functionality from Apache Common Math, other libraries or hand-coded analytics.

## What connectors does Apache Edgent support?

Edgent provides easy to use connectors for MQTT, HTTP, JDBC, File, Apache Kafka and IBM Watson IoT Platform. Edgent is extensible; you can create connectors.

## What centralized streaming analytic systems does Apache Edgent support?

Edgent applications can publish and subscribe to message systems like MQTT or Kafka, or IoT Hubs like IBM Watson IoT Platform.  Centralized streaming analytic systems can do likewise to then consume Edgent application events and data, as well as control an Edgent application.  The centralized streaming analytic system could be Apache Spark, Apache Storm, Flink and samza, IBM Streams (on-premises or IBM Streaming Analytics on Bluemix), or any custom application of your choice.

## Why do I need Apache Edgent on the edge, rather than my streaming analytic system?

Edgent is designed for the edge. It has a small footprint, suitable for running on constrained devices. Edgent applications can analyze data on the edge and to only send to the centralized system if there is a need, reducing communication costs.

## Why do I need Apache Edgent, rather than coding the complete application myself?

Edgent is designed to accellerate your development of edge analytic applications - to make you more productive! Edgent provides a simple yet powerful consistent data model (streams and windows) and provides useful functionality, such as aggregations, joins, and numerous connectors. Using Edgent lets you to take advantage of this functionality, allowing you to focus on your application needs.  For example, you can create an Edgent application that periodically samples a sensor and publishes values to an MQTT server in about 10 lines of code!

## Where can I download Apache Edgent?

Releases include Edgent samples source code and Edgent API and runtime source code.  Convenience binaries are released to Maven Central.  The source code is also available on GitHub.  The [downloads]({{ site.data.project.download }}) page has all of the details.

## How do I get started?

Getting started is simple. See [Quickstart with Edgent Samples](edgent-getting-started-samples) to jump right in or see the [Getting Started Guide](edgent-getting-started) if you prefer a bit of an introduction and tutorial first.

## How can I get involved?

We would love to have your help! Visit [Get Involved](community) to learn more about how to get involved.

## How can I contribute code?

Just submit a [pull request]({{ site.data.project.source_repository_mirror }}/pulls) and wait for a committer to review. For more information, visit our [committer page](committers) and read [DEVELOPMENT.md]({{ site.data.project.source_repository_mirror }}/blob/master/DEVELOPMENT.md) at the top of the code tree.

## Can I become a committer?

Read about Edgent committers and how to become a committer [here](committers).

## Can I take a copy of the code and fork it for my own use?

Yes. Edgent is available under the Apache 2.0 license which allows you to fork the code. We hope you will contribute your changes back to the Edgent community.

## How do I suggest new features?

Click [Issues](https://issues.apache.org/jira/browse/{{ site.data.project.jira }}) to submit requests for new features. You may browse or query the Issues database to see what other members of the Edgent community have already requested.

## How do I submit bug reports?

Click [Issues](https://issues.apache.org/jira/browse/{{ site.data.project.jira }}) to submit a bug report.

## How do I ask questions about Apache Edgent?

Use the [dev list](mailto:{{ site.data.project.dev_list }}) to submit questions to the Edgent community.

## Why is Apache Edgent open source?

With the growth of the Internet of Things there is a need to execute analytics at the edge. Edgent was developed to address requirements for analytics at the edge for IoT use cases that were not addressed by central analytic solutions. These capabilities will be useful to many organizations and that the diverse nature of edge devices and use cases is best addressed by an open community. Our goal is to develop a vibrant community of developers and users to expand the capabilities and real-world use of Edgent by companies and individuals to enable edge analytics and further innovation for the IoT space.

## I see references to "Quarks." How does it relate to Apache Edgent?

Up until July 2016, Edgent was known as Quarks. Quarks was renamed due to the name not being unique enough.
