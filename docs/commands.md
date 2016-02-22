# Commands

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Available commands](#available-commands)
  - [Create a new Fractal project](#create-a-new-fractal-project)
  - [Start the preview UI server](#start-the-preview-ui-server)
  - [Build a static version of the preview UI](#build-a-static-version-of-the-preview-ui)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

The standard way to interact with Fractal is via the command line. Commands take the following format:

```shell
fractal <command> [args] [opts]
```

**Project-level** commands must be run from within the root directory of your project, and are only available to projects that have a `fractal.js` file already present. And example of a project-level command would be the `start` command that starts up a local web server.

**Global** commands can be run from anywhere *outside of a project folder* and do not require the presence of a `fractal.js` settings file. An example of a global command is the `new` command which helps you quickly create a new Fractal project file structure.

Running the command `fractal` with no further arguments will show some information about Fractal and a list of currently available commands that can be run.

## Available commands

The default installation of Fractal provides two *project-level* commands - `start` and `build`, plus a *global* `new` command.

### Create a new Fractal project

If you want to start a new Fractal project you can use the `new` command to set up the basic file structure (including creating a basic `fractal.js` project settings file) for you. The command looks like this:

```shell
fractal new <directory-name>
```

The `directory-name` argument will determine the name of the directory to create. It can be a relative path name, too - for instance `example/my-new-project`.

> This command is a global command and so is only available outside of existing projects.

### Start the preview UI server

The `start` command starts a web server to provide a nice visual way to browse the patterns in your component library. You can start the server from the CLI using the command:

```shell
fractal start
```

### Build a static version of the preview UI

If you want to export a static HTML version of the web preview interface, you can use the build command as follows:

```shell
fractal build
```

This will export a static version of the web UI into a directory in the root of your project.






