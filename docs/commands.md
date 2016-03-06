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

Fractal offers two ways to run commands. You can either run commands in a traditional format, or you can take advantage of Fractal's [interactive CLI](#the-fractal-interactive-cli) which offers a lot of usability and speed advantages.

### Standard format commands

The standard way to run a command takes the format:

```shell
fractal <command-name> [args] [opts]
```

When running commands in this format, the command will run and then immediately exit (unless it is watching or running a server in the background).

Commands in this format are useful for when you want to use them in NPM scripts as part of other build tasks, for example.

### The Fractal interactive CLI :sparkles:

As well as exposing 'traditional' terminal commands, Fractal also provides an *interactive CLI* for you to work with on your projects. This greatly speeds up running commands on your project and allows you to do things like start a servers and then still be able to run subsequent commands in the same CLI window.

You launch the interactive CLI by running the `fractal` command in your terminal. This will drop you into interactive mode, and you should see an info box appear in your terminal, with a prompt beneath it.

You can tell when you are in interactive mode because your prompt will look like this:

```bash
fractal ➤
```

You can now enter commands to interact with your fractal project. **The commands are identical to the standard-format commands, except that you no longer need to prefix them with `fractal`.**

#### Interactive CLI tips:

* You can use the `help` command at any point to show all the available commands.
* To **exit** the interactive CLI and go back into your 'regular' terminal, use the `exit` command.
* Global (as opposed to project-level) commands cannot be run from within the interactive CLI.

## Default project commands

The default installation of Fractal provides a number of *project-level* commands.

### Start the web UI server

The `start` command starts a web server to provide a nice visual way to browse the patterns in your component library. See the [web UI documentation](/docs/web/overview.md) for more details and options.

### Stop all running servers

The `stop` command stops any servers that are currently running.

### Build a static version of the web UI

The `build` command will export a static HTML version of the web UI into a directory in the root of your project. See the [web UI documentation](/docs/web/overview.md) for more details and options.

### Show available commands

> *Only available inside the interactive CLI.*

The `help` command will list all available commands, including any custom commands you have added.

### Exit the interactive CLI

> *Only available inside the interactive CLI.*

Use the `exit` command to end your Fractal session and go back into 'regular' terminal mode.

## Default global commands

The default installation of Fractal provides one **global** command. Note that global commands *cannot* be run from inside of the interactive CLI or within an existing Fractal project.

### Create a new Fractal project

If you want to start a new Fractal project you can use the `fractal new` command to set up the basic file structure (including creating a basic `fractal.js` project settings file) for you. The command looks like this:

```shell
fractal new <directory-name>
```
The `directory-name` argument will determine the name of the directory to create. It can be a relative path name, too - for instance `example/my-new-project`.
