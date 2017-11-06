---
title: The Power of Apache Edgent
---

Edgent is designed to accellerate your development of event driven flow-graph
style analytic applications running on edge devices.  This is achieved by
Edgent's combination of API, connectors, basic analytics, utilities, and openness!

Let's have some fun with a shallow but broad glimpse into what you
can do in a few of lines of code... an introduction to Edgent's capabilities via
a series of terse code fragments.

See the [Getting Started Guide](edgent-getting-started) for a step by step introduction,
and information about full samples and recipies.

Let's start with a complete application that periodically samples a sensor
and publishes its values to an Enterprise IoT Hub in less than 10 lines of code

```java
public class ImpressiveEdgentExample {
  public static void main(String[] args) {
    DirectProvider provider = new DirectProvider();
    Topology top = provider.newTopology();

    IotDevice iotConnector = IotpDevice.quickstart(top, "edgent-intro-device-2");
    // open https://quickstart.internetofthings.ibmcloud.com/#/device/edgent-intro-device-2

    // ingest -> transform -> publish
    TStream<Double> readings = top.poll(new SimulatedTemperatureSensor(), 1, TimeUnit.SECONDS);
    TStream<JsonObject> events = readings.map(JsonFunctions.valueOfNumber("temp"));
    iotConnector.events(events, "readingEvents", QoS.FIRE_AND_FORGET);

    provider.submit(top);
  }
}
```

Ok, that was 11 lines and it omitted the imports, but there are only 7 lines in main()!

That leveraged the [IotpDevice]({{ site.docsurl }}/index.html?org/apache/{{ site.data.project.unix_name }}/connectors/iotp/IotpDevice.html)
connector to the 
IBM Watson IoT Platform and the platform's Quickstart feature. 
The value of its Quickstart feature is no account or device 
preregistration and the ability to open a browser to see the
data being published.  Great to quickly get started.

Hopefully that had enough of a wow factor to encourage you
to keep reading!

### Connectors, Ingest and Sink

Edgent Applications need to create streams of data from external entities,
termed ingest, and sink streams of data to external entities.  
There are primitives for those operations and a collection of
connectors to common external entities.

Connectors are just code the make it easier to for an Edgent application
to integrate with an external entity.  They use Edgent ingest primitives
like (`Topology.poll()`, `Topology.events()`, etc), and `TStream.sink()`
like any other Edgent code.  But more Connectors contributions are welcome!

OK... fewer words, more code!

You've already seen publishing using the `IotpDevice` connector.

Want to receive [IotDevice]({{ site.docsurl }}/index.html?org/apache/{{ site.data.project.unix_name }}/connectors/iot/IotDevice.html) device commands? Simple!

```java
    TStream<JsonObject> cmds = iotConnector.commands();
    cmds.sink(cmd -> System.out.println("I should handle received cmd: "+cmd));

    or
    TStream<JsonObject> xzyCmds = iotConnector.command("xyzCmds");
```

There's an [IotGateway]({{ site.docsurl }}/index.html?org/apache/{{ site.data.project.unix_name }}/connectors/iot/IotGateway.html) device model too.

Don't want no stinkin `IotDevice` model and just
want to pub/sub to an MQTT server?  No worries! Use the [MqttStreams]({{ site.docsurl }}/index.html?org/apache/{{ site.data.project.unix_name }}/connectors/mqtt/MqttStreams.html) connector

```java
    //IotDevice iotConnector = IotpDevice.quickstart(top, "edgent-intro-device-2");
    MqttStreams iotConnector = new MqttStreams(top, "ssl://myMqttServer:8883", "my-device-client-id");

    ...

    //iotConnector.events(events, "readingEvents", QoS.FIRE_AND_FORGET);
    iotConnector.publish(events, "readingEvents", QoS.FIRE_AND_FORGET, false);

    TStream<JsonObject> xyzTopicMsgs = iotConnector.subscribe("xyzTopic");
```

Want to connect to Kafka?  Use the [KafkaProducer]({{ site.docsurl }}/index.html?org/apache/{{ site.data.project.unix_name }}/connectors/kafka/KafkaProducer.html) and [KafkaConsumer]({{ site.docsurl }}/index.html?org/apache/{{ site.data.project.unix_name }}/connectors/kafka/KafkaConsumer.html) connectors with similar ease.

There's a [JdbcStreams]({{ site.docsurl }}/index.html?org/apache/{{ site.data.project.unix_name }}/connectors/jdbc/JdbcStreams.html) connector too.

Want to sink a `TStream` to rolling text files?  Use the [FileStreams]({{ site.docsurl }}/index.html?org/apache/{{ site.data.project.unix_name }}/connectors/file/FileStreams.html) connector.

```java
    new File("/tmp/MY-DEMO-FILES").mkdir();
    FileStreams.textFileWriter(events.asString(), () -> "/tmp/MY-DEMO-FILES/READINGS");

    // tail -f /tmp/MY-DEMO-FILES/.READINGS
```

Or watch for, ingest and process text files?  [Csv]({{ site.docsurl }}/index.html?org/apache/{{ site.data.project.unix_name }}/connectors/csv/Csv.html) can be useful if your input lines of comma separated values

```java
   String watchedDir = "/some/directory/path";
   List<String> csvFieldNames = ...
   TStream<String> pathnames = FileStreams.directoryWatcher(top, () -> watchedDir, null);
   TStream<String> lines = FileStreams.textFileReader(pathnames);
   TStream<JsonObject> parsedLines = lines.map(line -> Csv.toJson(Csv.parseCsv(line), csvFieldNames));
```

Want to sink to a command's stdin?  Use the [CommandStreams]({{ site.docsurl }}/index.html?org/apache/{{ site.data.project.unix_name }}/connectors/command/CommandStreams.html) connector

```java
    TStream<MyEvent> events = ...
    ProcessBuilder cmd = new ProcessBuilder("cat").redirectOutput(new File("/dev/stdout"));
    CommandStreams.sink(events.asString(), cmd);
```

Or ingest a command's stdout/err?

```java
    ProcessBuilder cmd = new ProcessBuilder("date", "-R");
    TStream<List<String>> readings = CommandStreams.periodicSource(top, cmd, 1, TimeUnit.SECONDS);

    TStream<JsonObject> events =
        readings
          .flatMap(list -> list)
          .map(JsonFunctions.valueOfString("date"));
    
    // also note TStream support for a fluent programming style
    // and use of TStream.flatmap() to transform in input list to
    // an output list and then add each output list item as a separate
    // tuple to the output stream
```


Want to sink to a log via slf4j or another logging system?  Just do it!

```java
    import org.slf4j.Logger;
    import org.slf4j.LoggerFactory;
    private static final Logger logger = LoggerFactory.getLogger(MyClass.class);

    readings.sync(reading -> logger.info("reading: {}", reading));
```

### More on Ingest

You've seen how to periodically poll a function to get a some data.  
That's just one of the methods defined in [Topology]({{ site.docsurl }}/index.html?org/apache/{{ site.data.project.unix_name }}/topology/Topology.html) for ingesting data - for creating source streams.

Also note that the tuples (a.k.a. events, data, objects) in a [TStream]({{ site.docsurl }}/index.html?org/apache/{{ site.data.project.unix_name }}/topology/TStream.html) can be any type. There's no special Edgent tuple type hierarchy.

Want readings from multiple sensors in a single stream tuple?

```java
    SimulatedTemperatureSensor tempSensor = new SimulatedTemperatureSensor();
    SimpleSimulatedSensor pressureSensor = new SimpleSimulatedSensor();
    
    TStream<JsonObject> events = top.poll( () -> {
          JsonObject jo = new JsonObject();
          jo.addProperty("temp", tempSensor.get());
          jo.addProperty("pressure", pressureSensor.get());
          return jo;
        }, 1, TimeUnit.SECONDS);
```

Want to use define a class or use an existing one for a tuple?

```java
    public class SensorReading {
        double temp;
        double pressure;
        public SensorReading(double temp, double pressure) {
            this.temp = temp;
            this.pressure = pressure;
        }
    }

    SimulatedTemperatureSensor tempSensor = new SimulatedTemperatureSensor();
    SimpleSimulatedSensor pressureSensor = new SimpleSimulatedSensor();
    
    TStream<SensorReading> readings = top.poll(
        () -> new Reading(tempSensor.get(), pressureSensor.get()),
        1, TimeUnit.SECONDS);
```

#### Simulated Sensors

Edgent provides some simple simulated sensors that can be helpful to get going.
You've already seen `SimulatedTemperatureSensor` and
`SimpleSimulatedSensor` - included in the Edgent Samples source release bundle.
There are a couple of more in the same Java package.

#### Sensor library

Wondering if Edgent has a sensor library?  It does not
because there seems to be little value in supplying one.

Using Edgent's stream ingest primitives (e.g., `Topology.poll(), Topology.events()`,
etc) it's trivial for you to call the sensor's APIs to get 
readings and compose them into a stream data object of your
choosing to be added a `TStream`.

### Filtering

Let's get back to our original `ImpressiveEdgentExample`
and explore making it smarter - push more analytics out
to the edge!

Want to only publish readings with values less than 5 and more than 30?

```java
    // add this after the poll()
    readings = readings.filter(tuple -> tuple < 5d || tuple > 30d);
```

Your filter predicate function can do what ever it needs to do!

Or use the [Range]({{ site.docsurl }}/index.html?org/apache/{{ site.data.project.unix_name }}/analytics/sensors/Range.html) utility

```java
    Range<Double> range = Ranges.open(5, 30);
    readings = readings.filter(reading -> !range.test(reading));
```

That alone isn't a very compelling use of Range but consider
a larger context.
A Range has a simple String representation (e.g., the above is `"(5d,30d)"`)
so that value could be read from an application configuration file
on startup, or received from a device command to create a
dynamically configurable application.

[Filters.deadband]({{ site.docsurl }}/index.html?org/apache/{{ site.data.project.unix_name }}/analytics/sensors/Filters.html)
offers a more sophisticated filter.
There's a nice graphic depection of the filter behavior in the method's javadoc.

```java
    Range<Double> range = Ranges.open(5, 30);
    readings = Filters.deadband(readings, reading -> reading, range);
```

There's also a [Filters.deadtime]({{ site.docsurl }}/index.html?org/apache/{{ site.data.project.unix_name }}/analytics/sensors/Filters.html) filter can can come in handy.

### Split

Want to split a TStream into multiple TStreams - e.g., to handle
different categories of tuples differently?  `TStream.split()`
is essentially an efficient group of multiple filters.

```java
    List<TStream<Double>> twoStreams = readings.split(2, d -> range.test(d) ? 0 : 1);
    TStream<Double> inRange = twoStreams.get(0);
    TStream<Double> outOfRange = twoStreams.get(1);
```

Your split function can yield as many output streams as you need.
There's also a form of `split()` that works with `Enum` identifiers.

### Transforms

Want to convert a value that's in Centigrade to Farenheit?

```java
    readings = readings.map(reading -> (reading * 1.8) + 32);
```

Your map function can do what ever it needs to do!
E.g., a tuple could be a video image frame and the map
function could generate face detection events.

We've already seen converting a numeric value to a JsonObject using [JsonFunctions]({{ site.docsurl }}/index.html?org/apache/{{ site.data.project.unix_name }}/topology/json/JsonFunctions.html)

```java
    TStream<JsonObject> events = readings.map(JsonFunctions.valueOfNumber("temp"));
```

What about scoring against a model?  Edgent doesn't have
anything special for that at least at this time.  
But it's easy to integrate the use of some scoring model
system into an Edgent application.  
Imagine a package defined something like:

```java
    public class Model {
      // load model from a File
      public Model(File f) { ... };
      // score String s against the model
      // return a confidence score between 0.0 and 1.0
      public Double score(String s);
    }
```

An Edgent application might use such a model in this manner

```java
    final Model model = new Model(...);

    TStream<String> events = ...
    TStream<JsonObject> scoredEvents = events.map(event -> {
        Double score = model.score(event);
        JsonObject jo = new JsonObject();
        jo.addProperty("event", event);
        jo.addProperty("score", score);
        return jo;
        };
    TStream<JsonObject> interestingEvents = 
        scoredEvents.filter(jo -> jo.getAsJsonPrimitive.getAsDouble("score") > 0.75);
```

OK, maybe that one was a bit too large a code fragment for this introduction.

### Windowing and aggregation

Want to do signal smoothing - create a continuously aggregated average over the last 10 readings?
Each time a tuple is added to the window a new aggregated value computed and is added to the output stream.

```java
    TWindow<Double,Integer> window = readings.last(10, Functions.unpartitioned());
    TStream<Double> readings = window.aggregate((List<Double> list, Integer partition) -> {
          double avg = 0.0;
          for (Double d : list) avg += d;
          if (list.size() > 0) avg /= list.size();
          return avg;
        });
```


Want a window over the last 10 seconds instead?

```java
    // TWindow<Double,Integer> window = readings.last(10, Functions.unpartitioned());
    TWindow<Double,Integer> window = readings.last(10, TimeUnit.SECONDS, Functions.unpartitioned());
    ...
```

Or want to do data reduction - reduce the readings to one average value every window batch?
Once the window is full, the batch of tuples is aggregated, the result is added to the output
stream and the window is cleared.  The next aggregation isn't generated until the window
is full again.

```java
    TStream<Double> readings = window.batch((List<Double> list, Integer partition) -> {
          double avg = 0.0;
          for (Double d : list) avg += d;
          if (list.size() > 0) avg /= list.size();
          return avg;
        });
```

Or use [Aggregations]({{ site.docsurl }}/index.html?org/apache/{{ site.data.project.unix_name }}/analytics/math3/Aggregations.html) for simple statistics

```java
    TStream<Double> readings = window.batch((List<Double> list, Integer partition) ->
          Aggregations.aggregate(list, Statistics2.MEAN));
```

Want to compute several basic statistics and a regression for an aggregation? Use [AggregationsN]({{ site.docsurl }}/index.html?org/apache/{{ site.data.project.unix_name }}/analytics/math3/AggregationsN.html)

```java
    TWindow<Double,Integer> window = readings.last(10, Functions.unpartitioned());
    TStream<ResultMap> aggResults = window.batch((List<Double> list, Integer partition) -> 
                       AggregationsN(list, Statistic2.MIN, Statistic2.MAX,
                                     Statistic2.SUM, Statistic2.STDDEV,
                                     Statistic2.COUNT, Regression2.SLOPE));
    TStream<JsonObject> joAggResults = aggResults(ResultMap.toJsonObject()); // optional
```

There's also support for multi-variable aggregations - independent statistic
aggregations for multi variables in a list of tuples.  e.g., temperatures and
pressures variables in each tuple.

If the objects in the window are a JsonObject, [JsonAnalytics]({{ site.docsurl }}/index.html?org/apache/{{ site.data.project.unix_name }}/analytics/math3/json/JsonAnalytics.html) can be handy.

### Misc

Want to run an expensive computation on multiple tuples in parallel?  
Easy with [PlumbingStreams.parallel()]({{ site.docsurl }}/index.html?org/apache/{{ site.data.project.unix_name }}/topology/plumbing/PlumbingStreams.html)!

```java
    TStream<SensorReading> readings = ...
    // 3 parallel channels - i.e., can process 3 tuples simultaneously on separate theads
    TStream<MyData> analyzed = PlumbingStreams.parallel(readings,
                   3, PlumbingStreams.roundRobinSplitter(),
                   (input, channel, output) ->
                     input.map(reading -> myExpensiveComputation(reading)));
```

See [PlumbingStreams.parallelBalanced]({{ site.docsurl }}/index.html?org/apache/{{ site.data.project.unix_name }}/topology/plumbing/PlumbingStreams.html) for a load balanced form that will assigns
a tuple to any idle channel.

There are a variety of useful features in [PlumbingStreams]({{ site.docsurl }}/index.html?org/apache/{{ site.data.project.unix_name }}/topology/plumbing/PlumbingStreams.html).

### Wrap up

We touched on a lot, but not all, of Edgent.
Hopefully you're convinced that the combination of Edgent's API, connectors, etc are powerful and easy to use.

See the full [Edgent APIs Javadoc]({{ site.docsurl }})
and [Getting Started Guide](edgent-getting-started) for more information including pointers to more introductory
material and samples and recipies.
