# Commands

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [The Fractal interactive CLI](#the-fractal-interactive-cli)
- [Default project commands](#default-project-commands)
  - [Show available commands](#show-available-commands)
  - [Start the web UI server](#start-the-web-ui-server)
  - [Stop all running servers](#stop-all-running-servers)
  - [Build a static version of the web UI](#build-a-static-version-of-the-web-ui)
  - [Exit the interactive CLI](#exit-the-interactive-cli)
- [Default global commands](#default-global-commands)
  - [Create a new Fractal project](#create-a-new-fractal-project)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Overview

The standard way to interact with Fractal is via the command line, for example using an application such as Terminal.app if you are on an OS X machine.

**Project-level** commands must be run from within the root directory of your project, and are only available to projects that have a `fractal.js` file already present. An example of a project-level command would be the `fractal start` command that starts up a local web server.

**Global** commands can be run from anywhere *outside of a project folder* and do not require the presence of a `fractal.js` settings file. An example of a global command is the `fractal new <project-name>` command which helps you quickly create a new Fractal project file structure.

## Running commands

Fractal offers two ways to run commands. You can either run commands in a traditional format, or you can take advantage of Fractal's [interactive CLI](#the-fractal-interactive-cli) which offeres

The standard way to run a command takes the format:

```shell
fractal <command-name> [args] [opts]
```



### The Fractal interactive CLI

Rather than just exposing a bunch of regular terminal commands, Fractal provides an 'interactive CLI' for you to work with on your projects. You launch the interactive CLI by running the `fractal` command in your terminal. This will drop you into interactive mode, and you should see an info box appear in your terminal, with a prompt beneath it.

You can tell when you are in interactive mode because your prompt will look like this:

```bash
fractal ➤
```

You can now enter commands to interact with your fractal project. Use the `help` command at any point to show all the available commands.

To **exit** the interactive CLI and go back into your 'regular' terminal, use the `exit` command.

<!-- ### Using fractal commands in build scripts

If you want to use a Fractal command in your NPM scripts or  -->

## Default project commands

The default installation of Fractal provides a number of *project-level* commands.

> All project commands must be run inside the Fractal interactive CLI. Use the `fractal` command from within your project directory to enter interactive mode before running them.

### Show available commands

The `help` command will list all available commands, including any custom commands you have added.

### Start the web UI server

The `start` command starts a web server to provide a nice visual way to browse the patterns in your component library. See the [web UI documentation](/docs/web/overview.md) for more details and options.

### Stop all running servers

The `stop` command stops any servers that are currently running.

### Build a static version of the web UI

The `build` command will export a static HTML version of the web UI into a directory in the root of your project. See the [web UI documentation](/docs/web/overview.md) for more details and options.

### Exit the interactive CLI

Use the `exit` command to end your Fractal session and go back into 'regular' terminal mode.

## Default global commands

The default installation of Fractal provides one **global** command.

> Global commands *cannot* be run from inside of the interactive CLI or within an existing Fractal project.

### Create a new Fractal project

If you want to start a new Fractal project you can use the `fractal new` command to set up the basic file structure (including creating a basic `fractal.js` project settings file) for you. The command looks like this:

```shell
fractal new <directory-name>
```
The `directory-name` argument will determine the name of the directory to create. It can be a relative path name, too - for instance `example/my-new-project`.
