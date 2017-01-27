---
title: Streaming concepts
---

An Edgent application is most useful when processing some sort of data. This page is intended to help you understand stream processing concepts by visually demonstrating some of the operations that can be invoked on a stream, along with code snippets. For example,

* [filter]({{ site.docsurl }}/org/apache/{{ site.data.project.unix_name }}/topology/TStream.html#filter-org.apache.{{ site.data.project.unix_name }}.function.Predicate-)
* [split]({{ site.docsurl }}/org/apache/{{ site.data.project.unix_name }}/topology/TStream.html#split-int-org.apache.{{ site.data.project.unix_name }}.function.ToIntFunction-)
* [union]({{ site.docsurl }}/org/apache/{{ site.data.project.unix_name }}/topology/TStream.html#union-org.apache.{{ site.data.project.unix_name }}.topology.TStream-)
* [partitioned window]({{ site.docsurl }}/org/apache/{{ site.data.project.unix_name }}/topology/TStream.html#last-long-java.util.concurrent.TimeUnit-org.apache.{{ site.data.project.unix_name }}.function.Function-)
* [continuous aggregation]({{ site.docsurl }}/org/apache/{{ site.data.project.unix_name }}/topology/TWindow.html#aggregate-org.apache.{{ site.data.project.unix_name }}.function.BiFunction-)
* [batch]({{ site.docsurl }}/org/apache/{{ site.data.project.unix_name }}/topology/TWindow.html#batch-org.apache.{{ site.data.project.unix_name }}.function.BiFunction-)

## Filter

<div id="filter-demo"></div>

<style>
    div#filter-demo {
        font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
    }
</style>
<script src="https://d3js.org/d3.v3.min.js"></script>
<script>
    var filterSvgContainer = d3.select("#filter-demo").append("svg")
        .attr("width", 550)
        .attr("height", 200);

    var filter = filterSvgContainer.append("circle")
        .attr("cx", 300)
        .attr("cy", 115)
        .attr("r", 50)
        .style("fill", "#286DA8");

    var filterTxt = filterSvgContainer.append("svg:text")
        .attr("x", 275)
        .attr("y", 105)
        .attr("dx", 25)
        .attr("dy", "1.0em")
        .attr("text-anchor", "middle")
        .text(function(datum) { return "≥ 5"; })
        .attr("fill", "white");

    function newIncomingFilterTuple() {
        var newFilterTuple = filterSvgContainer.append("rect")
            .attr("x", 30)
            .attr("y", 100)
            .attr("width", 30)
            .attr("height", 30)
            .style("fill", "#CD5360");

        var filterTv = Math.floor(Math.random() * 10);
        var newFilterTxt = filterSvgContainer.append("svg:text")
            .attr("x", 30)
            .attr("y", 100)
            .attr("dx", 15.5)
            .attr("dy", 20)
            .attr("text-anchor", "middle")
            .text(function(datum) { return filterTv; })
            .attr("fill", "white");

        newFilterTxt.tv = filterTv;

        newFilterTuple.transition().ease("linear").attr("x", 250).duration(6000).delay(100).remove();
        newFilterTxt.transition().ease("linear").attr("x", 250).duration(6000).delay(100).remove().each('end',function(){ if (newFilterTxt.tv >= 5) { filteredTuple(newFilterTxt.tv); }});

        setTimeout(function() { newIncomingFilterTuple();} ,  1200 + (Math.random() * 1000));
    }

    function filteredTuple(tv) {
        var filterTuple = filterSvgContainer.append("rect")
            .attr("x", 318)
            .attr("y", 100)
            .attr("width", 30)
            .attr("height", 30)
            .style("fill", "#57BC90");

        var filterTxt = filterSvgContainer.append("svg:text")
            .attr("x", 318)
            .attr("y", 100)
            .attr("dx", 15.5)
            .attr("dy", 20)
            .attr("text-anchor", "middle")
            .text(function(datum) { return tv; })
            .attr("fill", "white");

        filterTxt.tv = tv;

        filterTuple.transition().ease("linear").attr("x", 520).duration(5500).delay(100).remove();
        filterTxt.transition().ease("linear").attr("x", 520).duration(5500).delay(100).remove();
    }

    newIncomingFilterTuple();
</script>

### Edgent code

```java
TStream<Integer> filtered = stream.filter(t -> t >= 5);
```

### Explanation

**Input stream**: Tuples, such as sensor readings, are continually produced and represented as a red stream on the left.

**Filtered stream**: A filter operation of `t >= 5` is applied, resulting in a green output stream on the right that contains tuples with values greater than or equal to five.

---

## Split

<div id="split-demo"></div>

<style>
    div#split-demo {
        font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
    }
</style>
<script>
    var splitSvgContainer = d3.select("#split-demo").append("svg")
        .attr("width", 700)
        .attr("height", 200);

    var split = splitSvgContainer.append("rect")
        .attr("x", 250)
        .attr("y", 65)
        .attr("width", 100)
        .attr("height", 100)
        .style("fill", "#286DA8");

    var splitTxt = splitSvgContainer.append("svg:text")
        .attr("x", 275)
        .attr("y", 105)
        .attr("dx", 25)
        .attr("dy", "1.0em")
        .attr("text-anchor", "middle")
        .text(function(datum) { return "getVal( )"; })
        .attr("fill", "white");

    var evenTxtMsg = splitSvgContainer.append("svg:text")
        .attr("x", 375)
        .attr("y", 50)
        .attr("dx", 25)
        .attr("dy", "1.0em")
        .attr("text-anchor", "middle")
        .text(function(datum) { return "EVEN"; })
        .attr("fill", "#57BC90");

    var oddTxtMsg = splitSvgContainer.append("svg:text")
        .attr("x", 375)
        .attr("y", 165)
        .attr("dx", 25)
        .attr("dy", "1.0em")
        .attr("text-anchor", "middle")
        .text(function(datum) { return "ODD"; })
        .attr("fill", "#8066B3");

    function newIncomingSplitTuple() {
        var newSplitTuple = splitSvgContainer.append("rect")
            .attr("x", 30)
            .attr("y", 100)
            .attr("width", 30)
            .attr("height", 30)
            .style("fill", "#CD5360");

        var splitTv = Math.floor(Math.random() * 10);
        var newSplitTxt = splitSvgContainer.append("svg:text")
            .attr("x", 30)
            .attr("y", 100)
            .attr("dx", 15.5)
            .attr("dy", 20)
            .attr("text-anchor", "middle")
            .text(function(datum) { return splitTv; })
            .attr("fill", "white");

        newSplitTxt.tv = splitTv;

        newSplitTuple.transition().ease("linear").attr("x", 225).duration(6000).delay(100).remove();
        newSplitTxt.transition().ease("linear").attr("x", 225).duration(6000).delay(100).remove().each('end',function(){ if (newSplitTxt.tv % 2 == 0) { splittedEvenTuple(newSplitTxt.tv); } else { splittedOddTuple(newSplitTxt.tv); } });

        setTimeout(function() { newIncomingSplitTuple();} ,  1200 + (Math.random() * 1000));
    }

    function splittedEvenTuple(tv) {
        var evenTuple = splitSvgContainer.append("rect")
            .attr("x", 425)
            .attr("y", 45)
            .attr("width", 30)
            .attr("height", 30)
            .style("fill", "#57BC90");

        var evenTxt = splitSvgContainer.append("svg:text")
            .attr("x", 425)
            .attr("y", 45)
            .attr("dx", 15.5)
            .attr("dy", 20)
            .attr("text-anchor", "middle")
            .text(function(datum) { return tv; })
            .attr("fill", "white");

        evenTxt.tv = tv;

        evenTuple.transition().ease("linear").attr("x", 670).duration(5500).delay(100).remove();
        evenTxt.transition().ease("linear").attr("x", 670).duration(5500).delay(100).remove();
    }

    function splittedOddTuple(tv) {
        var oddTuple = splitSvgContainer.append("rect")
            .attr("x", 425)
            .attr("y", 160)
            .attr("width", 30)
            .attr("height", 30)
            .style("fill", "#8066B3");

        var oddTxt = splitSvgContainer.append("svg:text")
            .attr("x", 425)
            .attr("y", 160)
            .attr("dx", 15.5)
            .attr("dy", 20)
            .attr("text-anchor", "middle")
            .text(function(datum) { return tv; })
            .attr("fill", "white");

        oddTxt.tv = tv;

        oddTuple.transition().ease("linear").attr("x", 670).duration(5500).delay(100).remove();
        oddTxt.transition().ease("linear").attr("x", 670).duration(5500).delay(100).remove();
    }

    newIncomingSplitTuple();
</script>

### Edgent code

```java
List<TStream<String>> streams = stream.split(2, tuple -> tuple.getVal());
```

### Explanation

**Input streams**: Tuples, such as sensor readings, are continually produced and represented as a red stream on the left.

**Split streams**: A split operation of `getVal()` is applied, resulting in two output streams on the right, one green and one purple. The green stream contains tuples with values that are even integers, while the purple stream contains tuples with values that are odd integers.

---

## Union

<div id="union-demo"></div>

<style>
    div#union-demo {
        font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
    }
</style>
<script>
    var unionSvgContainer = d3.select("#union-demo").append("svg")
        .attr("width", 700)
        .attr("height", 200);

    var union = unionSvgContainer.append("rect")
        .attr("x", 250)
        .attr("y", 25)
        .attr("width", 100)
        .attr("height", 150)
        .style("fill", "#286DA8");

    var unionTxt = unionSvgContainer.append("svg:text")
        .attr("x", 275)
        .attr("y", 88)
        .attr("dx", 25)
        .attr("dy", "1.0em")
        .attr("text-anchor", "middle")
        .text(function(datum) { return "Union"; })
        .attr("fill", "white");

    function newIncomingStream1Tuple() {
        var newstream1Tuple = unionSvgContainer.append("rect")
            .attr("x", 30)
            .attr("y", 35)
            .attr("width", 30)
            .attr("height", 30)
            .style("fill", "#CD5360");

        var stream1Tv = Math.floor(Math.random() * 10);
        var newStream1Txt = unionSvgContainer.append("svg:text")
            .attr("x", 30)
            .attr("y", 35)
            .attr("dx", 15.5)
            .attr("dy", 20)
            .attr("text-anchor", "middle")
            .text(function(datum) { return stream1Tv; })
            .attr("fill", "white");

        newStream1Txt.tv = stream1Tv;

        newstream1Tuple.transition().ease("linear").attr("x", 235).duration(6000).delay(100).remove();
        newStream1Txt.transition().ease("linear").attr("x", 235).duration(6000).delay(100).remove().each('end',function(){ unionedTuple(newStream1Txt.tv); });

        setTimeout(function() { newIncomingStream1Tuple(); } ,  1200 + (Math.random() * 2000));
    }

    function newIncomingStream2Tuple() {
        var newstream2Tuple = unionSvgContainer.append("rect")
            .attr("x", 30)
            .attr("y", 135)
            .attr("width", 30)
            .attr("height", 30)
            .style("fill", "#57BC90");

        var stream2Tv = Math.floor(Math.random() * 10);
        var newStream2Txt = unionSvgContainer.append("svg:text")
            .attr("x", 30)
            .attr("y", 135)
            .attr("dx", 15.5)
            .attr("dy", 20)
            .attr("text-anchor", "middle")
            .text(function(datum) { return stream2Tv; })
            .attr("fill", "white");

        newStream2Txt.tv = stream2Tv;

        newstream2Tuple.transition().ease("linear").attr("x", 235).duration(6000).delay(100).remove();
        newStream2Txt.transition().ease("linear").attr("x", 235).duration(6000).delay(100).remove().each('end',function(){ unionedTuple(newStream2Txt.tv); });

        setTimeout(function() { newIncomingStream2Tuple(); } ,  2000 + (Math.random() * 2000));
    }

    function unionedTuple(tv) {
        var unionTuple = unionSvgContainer.append("rect")
            .attr("x", 328)
            .attr("y", 85)
            .attr("width", 30)
            .attr("height", 30)
            .style("fill", "#8066B3");

        var unionTxt = unionSvgContainer.append("svg:text")
            .attr("x", 328)
            .attr("y", 85)
            .attr("dx", 15.5)
            .attr("dy", 20)
            .attr("text-anchor", "middle")
            .text(function(datum) { return tv; })
            .attr("fill", "white");

        unionTxt.tv = tv;

        unionTuple.transition().ease("linear").attr("x", 670).duration(5500).delay(100).remove();
        unionTxt.transition().ease("linear").attr("x", 670).duration(5500).delay(100).remove();
    }

    newIncomingStream1Tuple();
    setTimeout(function() { newIncomingStream2Tuple(); }, 1000);
</script>

### Edgent code

```java
TStream<String> stream = stream1.union(stream2);
```

### Explanation

**Input streams**: Tuples, such as sensor readings, are continually produced on two different streams, represented as a red stream and a green stream on the left.

**Unioned stream**: A union operation is applied, resulting in a single purple output stream on the right. The stream contains tuples from both input streams.

---

## Window (last 5 seconds)

<div id="window-demo"></div>

<style>
    div#window-demo {
        font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
    }
</style>
<script>
    var xt = 250;
    var xs = 30;

    var windowSvgContainer = d3.select("#window-demo").append("svg")
        .attr("width", 840)
        .attr("height", 200);

    var streamWindow = windowSvgContainer.append("rect")
        .attr("x", 300)
        .attr("y", 75)
        .attr("width", 370/2+45)
        .attr("height", 80)
        .style("stroke", "#286DA8")
        .style("fill", "none")
        .style("stroke-width", "3px");

    function newIncomingWindowTuple() {
        var newWindowTuple = windowSvgContainer.append("rect")
            .attr("x", xs)
            .attr("y", 100)
            .attr("width", 30)
            .attr("height", 30)
            .style("fill", "#CD5360");

        var windowTv = Math.floor(Math.random() * 10);
        var newWindowTxt = windowSvgContainer.append("svg:text")
            .attr("x", xs)
            .attr("y", 100)
            .attr("dx", 15.5)
            .attr("dy", 20)
            .attr("text-anchor", "middle")
            .text(function(datum) { return windowTv; })
            .attr("fill", "white");

        newWindowTxt.tv = windowTv;

        newWindowTuple.transition().ease("linear").attr("x", xs + xt).duration(6000).delay(100).remove();
        newWindowTxt.transition().ease("linear").attr("x", xs + xt).duration(6000).delay(100).remove().each('end',function(){ windowedTuple(newWindowTxt.tv); });

        setTimeout(function() { newIncomingWindowTuple();} ,  1200 + (Math.random() * 1000));
    }

    var wxs = 310;

    function windowedTuple(tv) {
        var windowTuple = windowSvgContainer.append("rect")
            .attr("x", wxs)
            .attr("y", 100)
            .attr("width", 30)
            .attr("height", 30)
            .style("fill", "#57BC90");

        var windowTxt = windowSvgContainer.append("svg:text")
            .attr("x", wxs)
            .attr("y", 100)
            .attr("dx", 15.5)
            .attr("dy", 20)
            .attr("text-anchor", "middle")
            .text(function(datum) { return tv; })
            .attr("fill", "white");

        windowTxt.tv = tv;

        windowTuple.transition().ease("linear").attr("x", wxs + (370/2)).duration(5000).delay(100).remove();
        windowTxt.transition().ease("linear").attr("x", wxs + (370/2)).duration(5000).delay(100).remove();
    }

    newIncomingWindowTuple();
</script>

### Edgent code

```java
TWindow<Integer> window = stream.last(5, TimeUnit.SECONDS, tuple -> 0);
```

### Explanation

**Input stream**: Tuples, such as sensor readings, are continually produced and represented as a red stream on the left.

**Window**: A window declaration of the last five seconds of tuples results in the window outlined in blue containing green tuples. A tuple is inserted into the window when it appears on the stream and is evicted five seconds later, since it will have been in the window for five seconds at that point.

---

## Continuous aggregate (max, last 5 seconds)

<div id="agg-demo"></div>

<style>
    div#agg-demo {
        font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
    }
</style>
<script>
    var xt = 250;
    var xs = 30;

    var aggSvgContainer = d3.select("div#agg-demo").append("svg")
        .attr("width", 800)
        .attr("height", 200);

    var aggWindow = aggSvgContainer.append("rect")
        .attr("x", 300)
        .attr("y", 75)
        .attr("width", 370/2+45)
        .attr("height", 80)
        .style("stroke", "#286DA8")
        .style("fill", "none")
        .style("stroke-width", "3px");

    var MaxTxt = aggSvgContainer.append("svg:text")
        .attr("x", 480)
        .attr("y", 165)
        .attr("dx", 25)
        .attr("dy", "1.0em")
        .attr("text-anchor", "middle")
        .text(function(datum) { return "MAX"; })
        .attr("fill", "#8066B3");

    function newIncomingAggTuple() {
        var newAggTuple = aggSvgContainer.append("rect")
            .attr("x", xs)
            .attr("y", 100)
            .attr("width", 30)
            .attr("height", 30)
            .style("fill", "#CD5360");

        var aggTv = Math.floor(Math.random() * 10);
        var newAggTxt = aggSvgContainer.append("svg:text")
            .attr("x", xs)
            .attr("y", 100)
            .attr("dx", 15.5)
            .attr("dy", 20)
            .attr("text-anchor", "middle")
            .text(function(datum) { return aggTv; })
            .attr("fill", "white");

        newAggTxt.tv = aggTv;

        newAggTuple.transition().ease("linear").attr("x", xs + xt).duration(6000).delay(100).remove();
        newAggTxt.transition().ease("linear").attr("x", xs + xt).duration(6000).delay(100).remove().each('end',function() { windowedAggTuple(newAggTxt.tv); });

        setTimeout(function() { newIncomingAggTuple();} ,  1200 + (Math.random() * 1000));
    }

    var aggWin = [];

    function addToAggWindow(v) {
        aggWin.push(v);
        aggregate();
    }

    function evictFromAggWindow() {
        aggWin.shift();
        aggregate();
    }

    var wxs = 310;

    function windowedAggTuple(tv) {
        addToAggWindow(tv);

        var windowAggTuple = aggSvgContainer.append("rect")
            .attr("x", wxs)
            .attr("y", 100)
            .attr("width", 30)
            .attr("height", 30)
            .style("fill", "#57BC90");

        var windowAggTxt = aggSvgContainer.append("svg:text")
            .attr("x", wxs)
            .attr("y", 100)
            .attr("dx", 15.5)
            .attr("dy", 20)
            .attr("text-anchor", "middle")
            .text(function(datum) { return tv; })
            .attr("fill", "white");

        windowAggTxt.tv = tv;

        windowAggTuple.transition().ease("linear").attr("x", wxs + (370/2)).duration(5000).delay(100).remove();
        windowAggTxt.transition().ease("linear").attr("x", wxs + (370/2)).duration(5000).delay(100).remove().each('end', function() {evictFromAggWindow()});
    }

    function aggregate() {
        var maxW = Math.max.apply(Math, aggWin);

        var aggTuple = aggSvgContainer.append("rect")
            .attr("x", 530)
            .attr("y", 160)
            .attr("width", 30)
            .attr("height", 30)
            .style("fill", "#8066B3");

        var txtMax = aggSvgContainer.append("svg:text")
            .attr("x", 530)
            .attr("y", 160)
            .attr("dx", 15.5)
            .attr("dy", 20)
            .attr("text-anchor", "middle")
            .text(function(datum) { return maxW; })
            .attr("fill", "white");

        aggTuple.transition().ease("linear").attr("x", 770).duration(5000).delay(100).remove();
        txtMax.transition().ease("linear").attr("x", 770).duration(5000).delay(100).remove();
    }

    newIncomingAggTuple();
</script>

### Edgent code

```java
TWindow<Integer> window = stream.last(5, TimeUnit.SECONDS, tuple -> 0);
TStream<Integer> max = window.aggregate((tuples, key) -> {
    return Collections.max(tuples);
});
```

### Explanation

**Input stream**: Tuples, such as sensor readings, are continually produced and represented as a red stream on the left.

**Window**: A window declaration of the last five seconds of tuples results in the window outlined in blue containing green tuples. A tuple is inserted into the window when it appears on the stream and is evicted five seconds later, since it will have been in the window for five seconds at that point.

**Aggregation**: The window is *continuously* aggregated to find the maximum value in the window. *Continuously aggregated* means that every time the window contents changes, the aggregate is calculated and a tuple is produced on the purple output stream. The window changes every time a tuple is inserted or evicted, where time-based window insertions and evictions are independent events.

---

## Batch (size, last 5 seconds)

<div id="batch-demo"></div>

<style>
    div#agg-demo {
        font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
    }
</style>
<script>
    var xt = 250;
    var xs = 30;

    var batchSvgContainer = d3.select("div#batch-demo").append("svg")
        .attr("width", 800)
        .attr("height", 200);

    var batchWindow = batchSvgContainer.append("rect")
        .attr("x", 300)
        .attr("y", 75)
        .attr("width", 370/2+45)
        .attr("height", 80)
        .style("stroke", "#286DA8")
        .style("fill", "none")
        .style("stroke-width", "3px");

    var SizeTxt = batchSvgContainer.append("svg:text")
        .attr("x", 480)
        .attr("y", 165)
        .attr("dx", 25)
        .attr("dy", "1.0em")
        .attr("text-anchor", "middle")
        .text(function(datum) { return "SIZE"; })
        .attr("fill", "#8066B3");

    function newIncomingBatchTuple() {
        var newBatchTuple = batchSvgContainer.append("rect")
            .attr("x", xs)
            .attr("y", 100)
            .attr("width", 30)
            .attr("height", 30)
            .style("fill", "#CD5360");

        var batchTv = Math.floor(Math.random() * 10);
        var newBatchTxt = batchSvgContainer.append("svg:text")
            .attr("x", xs)
            .attr("y", 100)
            .attr("dx", 15.5)
            .attr("dy", 20)
            .attr("text-anchor", "middle")
            .text(function(datum) { return batchTv; })
            .attr("fill", "white");

        newBatchTxt.tv = batchTv;

        newBatchTuple.transition().ease("linear").attr("x", xs + xt).duration(6000).delay(100).remove();
        newBatchTxt.transition().ease("linear").attr("x", xs + xt).duration(6000).delay(100).remove().each('end',function() { windowedBatchTuple(newBatchTxt.tv); });

        setTimeout(function() { newIncomingBatchTuple();} ,  1200 + (Math.random() * 1000));
    }

    var batchWin = [];

    // timer
    var initialStart = 0;
    var timer = 0;
    function run() {
        timer++;
        if (timer == 5) {
            console.log("5 seconds elapsed");
            timer = 0;
            batch();
        }
    }

    function addToBatchWindow(v) {
        batchWin.push(v);

        if (initialStart == 0) {
            initialStart = 1;
            setInterval(run, 1000);
        }
    }

    function evictFromBatchWindow() {
        batchWin.shift();
    }

    var wxs = 310;

    function windowedBatchTuple(tv) {
        addToBatchWindow(tv);

        var windowBatchTuple = batchSvgContainer.append("rect")
            .attr("x", wxs)
            .attr("y", 100)
            .attr("width", 30)
            .attr("height", 30)
            .style("fill", "#57BC90");

        var windowBatchTxt = batchSvgContainer.append("svg:text")
            .attr("x", wxs)
            .attr("y", 100)
            .attr("dx", 15.5)
            .attr("dy", 20)
            .attr("text-anchor", "middle")
            .text(function(datum) { return tv; })
            .attr("fill", "white");

        windowBatchTxt.tv = tv;

        windowBatchTuple.transition().ease("linear").attr("x", wxs + (370/2)).duration(5000).delay(100).remove();
        windowBatchTxt.transition().ease("linear").attr("x", wxs + (370/2)).duration(5000).delay(100).remove().each('end', function() {evictFromBatchWindow()});
    }

    function batch() {
        var sizeW = batchWin.length;
        console.log("window size: " + sizeW);
        var sizeTuple = batchSvgContainer.append("rect")
            .attr("x", 530)
            .attr("y", 160)
            .attr("width", 30)
            .attr("height", 30)
            .style("fill", "#8066B3");

        var txtSize = batchSvgContainer.append("svg:text")
            .attr("x", 530)
            .attr("y", 160)
            .attr("dx", 15.5)
            .attr("dy", 20)
            .attr("text-anchor", "middle")
            .text(function(datum) { return sizeW; })
            .attr("fill", "white");

        sizeTuple.transition().ease("linear").attr("x", 770).duration(5000).delay(100).remove();
        txtSize.transition().ease("linear").attr("x", 770).duration(5000).delay(100).remove();
    }

    newIncomingBatchTuple();
</script>

### Edgent code

```java
TWindow<Integer> window = stream.last(5, TimeUnit.SECONDS, tuple -> 0);
TStream<Integer> size = window.batch((tuples, key) -> {
    return tuples.size();
});
```

### Explanation

**Input stream**: Tuples, such as sensor readings, are continually produced and represented as a red stream on the left.

**Window**: A window declaration of the last five seconds of tuples results in the window outlined in blue containing green tuples. A tuple is inserted into the window when it appears on the stream and is evicted five seconds later, since it will have been in the window for five seconds at that point.

**Batch**: The window is batched to find the number of tuples in the window. A *batch* means that every 5 seconds, the size of the window is calculated and a tuple is produced on the purple output stream.
