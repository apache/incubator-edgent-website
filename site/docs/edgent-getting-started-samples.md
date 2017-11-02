---
title: Getting started with Apache Edgent Samples
---

Getting started with the Edgent samples is a great way to start using Edgent and
jump-start your application development.

Essentially, you download the samples source release, then easily build and
run them from either the command line or from an IDE.

Then, see the Additional Resources section at the end of this page!

If you want more of an introduction to Edgent and tutorial first, see the [Getting Started Guide](edgent-getting-started).


Convenience binaries (jars) for the Edgent runtime releases are distributed to the ASF Nexus Repository and the Maven Central Repository. There is no need to download the Edgent runtime sources and build them unless you want to. You don't have to manually download the Edgent jars either.

By default the samples depend on Java8.  Download and install Java8 if you need to.

## Download the Edgent Samples

1. Locate the Edgent samples release you would like to use at [downloads]({{ site.data.project.download }})
2. In the Bundles column for the desired release:
    * Click on the _Samples_ link
3. Download the .tar.gz or zip file from one of the mirror sites
4. Unpack the downloaded file using the appropriate one of:
    * `tar zxvf apache-edgent-X.X.X-incubating-samples-source-release.tar.gz`
    * `unzip apache-edgent-X.X.X-incubating-samples-source-release.zip`

## Quickstart: Build and run samples from the command line

You must have Java 8 installed on your system. Maven will be automatically
downloaded and installed by the maven wrapper `mvnw`.

In the unpacked samples folder...

Build the samples for Java 8

```sh
./mvnw clean package
```

Run the HelloEdgent sample

```sh
cd topology
./run-sample.sh HelloEdgent   # prints a hello message and terminates
  Hello
  Edgent!
  ...
```

### Cloning the template

For your application project, you can clone the template project.
In the unpacked samples folder

```sh
cp -R template ~/myApp
```

Verify the setup

```sh
cd ~/myApp
./mvnw clean package
./app-run.sh  # prints a hello message
```
See `README.md` in the new project folder for more information.


## Quickstart: Build and run samples from an IDE

Here we'll use Eclipse for the development environment.  Another popular choice is the maven-integrated IntelliJ IDE.

See [eclipse.org](https://www.eclipse.org) if you need to download Eclipse.
It's easiest if you choose a package that includes the Maven integration.
Otherwise, update your Eclipse installation with the
[Eclipse Maven Integration](https://projects.eclipse.org/projects/technology.m2e).

This remainder of this getting started information assumes a basic understanding of Eclipse.

Note: Specifics may change depending on your version of Eclipse or the 
Eclipse Maven plugin.

Import the samples into your Eclipse workspace:

  1. From the Eclipse *File* menu, select *Import...*
  2. From the *Maven* folder, select *Existing Maven Projects* and click *Next*
    + browse to the unpacked samples folder
      and select it.  A hierarchy of samples projects / pom.xml files will be
      listed and all selected. 
    + verify the *Add project(s) to working set* checkbox is checked
    + click *Finish*.  Eclipse starts the import process and builds the workspace.

Top-level artifacts such as the `README.md` file are available under the
`edgent-samples` project.

Once the samples have been imported you can run them from
Eclipse in the usual manner. E.g.,

1. From the Eclipse *Navigate* menu, select *Open Type*
   + enter type type name `HelloEdgent` and click *OK*
2. right click on the `HelloEdgent` class name and from the context menu
   + click on *Run As*, then *Java application*.  
   `HelloEdgent` runs and prints to the Console view.


### Cloning the template

To clone the template project for your application project:

1. Recursively copy the template folder into a new folder from the command line, e.g.,
   from the unpacked samples folder
   + cp -R template ~/myApp
2. Import the new project into your Eclipse workspace
  1. from the Eclipse *File* menu, select *Import...*
  2. from the *Maven* folder, select *Existing Maven Projects* and click *Next*
  + browse to the new folder and select it.  The project's pom.xml file will be
    listed and selected. 
  + click *Finish*.  Eclipse starts the import process and builds the workspace.
    Note, the new imported project's name will be `my-app`.
    This can be renamed later.

Verify you can run the imported template app:

1. From the Eclipse *Navigate* menu, select *Open Type*
   + enter type type name `TemplateApp` and click *OK*
2. right click on the `TemplateApp` class name and from the context menu
   + click on *Run As*, then *Java application*.  
  `TemplateApp` runs and prints to the Console view.

You can then start adding your application's java code.

Review the `README.md` file in the newly imported project's folder.

The project's `pom.xml` file is heavily commented to ease
specifying dependencies to various Edgent jars.
Open it and select the `pom.xml` tab in the Maven POM Editor to view
the comments.  If needed, change the `edgent.runtime.version`
property to the desired Edgent version. When needed, adjust
the Edgent jar dependencies.

Optionally, rename the Java class, Java package,
project's folder, and change maven project information.

1. In the Eclipse Project Explorer, open the `my-app` project,
   then the `src/main/java` folder, then the `com.mycompany.app` package.
   Right click on `TemplateApp.java` and select *Refactor* and *Rename...*
   + enter the new name for the Java file
2. Right click on the `com.mycompany.app` package and select *Refactor* and *Rename...*
   + enter the new name for the package
3. Right click on the `my-app` project select *Refactor* and *Rename...*
   + enter the new project name
4. Right click on the renamed project and and select *Refactor* and *Rename Maven Artifact*
   + enter the new maven artifact coordinates information

## Additional Resources

You can continue to explore the samples. The README.md in the unpacked samples
folder summarize what is available, as well as more information about
building and running them. 

As noted above, the samples include a template project that
you can clone for your application. 

Some additional development tools are provided with the samples, in particular,
`get-edgent-jars.sh` and `package-app.sh`.
See [Edgent Application Development](application-development).

The [Getting Started Guide](edgent-getting-started) identifies other resources.
