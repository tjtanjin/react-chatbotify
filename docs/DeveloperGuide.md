<p align="center">
  <img width="200px" src="https://raw.githubusercontent.com/tjtanjin/react-chatbotify/main/src/assets/logo.png" />
  <h1 align="center">React ChatBotify</h1>
</p>

## Table of Contents
* [Introduction](#introduction)
* [Navigating this Developer Guide](#navigating-this-developer-guide)
* [Setup](#setup)
* [Design](#design)
* [Code Documentation](#code-documentation)
* [Testing](#testing)
* [Pull Requests](#pull-requests)
* [Final Notes](#final-notes)

<div style="page-break-after: always;"></div>

## Introduction

For an introduction to the library itself, please refer to the project [*README*](https://github.com/tjtanjin/react-chatbotify/blob/main/README.md). This developer guide assumes its readers to have at least a **basic understanding** of [React](https://react.dev/) Applications. Otherwise, it is highly recommended for readers to refer to proper tutorial contents for the basics of React prior to developing the application. It is also worth noting that this guide serves to cover **important design considerations** for the project. The designs are not perfect so you are welcome and encouraged to **think and explore possible improvements** for the application.

This guide **will not** dive into every single project detail because that is not sustainable in the long run. For simpler implementations that are not covered in this guide, you will find the code comments in the files themselves to be useful.

## Navigating this Developer Guide

Before diving into the rest of the contents in our developer guide, the following are a few important syntaxes to take note of to facilitate your reading:

| Syntax | Description |
| ------------------- | ---------------------------------------------- |
|`Markdown` | Commands (e.g. `npm install`) |
|*Italics* | Files/Folders (e.g. *services*, *components*)
|**Bold** | Keywords (e.g. **important consideration**) |

<div  style="page-break-after: always;"></div>

## Setup

Setting up the project is relatively simple. Before you begin, ensure that you have **at least NodeJS 16.x** installed (this project was first developed on v20.3.1).
1) Fork the [project repository](https://github.com/tjtanjin/react-chatbotify).
2) Clone the **forked project** into your desired directory with:
    ```
    git clone the-forked-project.git
    ```
3) Next, `cd` into the project and install dependencies with:
    ```
    npm install
    ```
4) Once installations are complete, you may launch the project with:
    ```
    npm run start
    ```

Note: You may find instructions for [testing](https://github.com/tjtanjin/react-chatbotify/blob/main/docs/DeveloperGuide.md#testing) and opening [pull requests](https://github.com/tjtanjin/react-chatbotify/blob/main/docs/DeveloperGuide.md#pull-requests) in their respective sections.

## Design

### Overview

At a high level overview, the entire project can be (broadly speaking) broken down into **5 different parts** which are as listed below:

- *assets*
- *components*
- *context*
- *services*
- *types*

Each part and its relevant files are seated in its own folder so it's relatively straightforward when looking at the project structure. More information on the individual parts are provided below.

### Assets

As its name suggest, the *assets* folder contains **media content** that are used by the chatbot - which includes **images** and **sound**. These are centrally imported and loaded within the *BotOptionsService* file during initialisation.

### Components

While end-users may perceive the entire chatbot as one entire component, it is actually made up of **many smaller components**. A quick glance at the *components* folder will give you an idea of how many parts are actually being put together.

Without boring you with the details, the more obvious components would be the *ChatBotHeader*, *ChatBotBody* and *ChatBotFooter*. However, you may notice that even something seemingly minor such as the *EmojiPicker* is also its own component. Depending on **how complex the functionality** for a part is, it may be created as a standalone component. On the other hand, simpler features such as the minimize/close chat button is not designed as a standalone component.

### Context

The chatbot uses **3 contexts** for managing global information as well as exposing advance functionalities to developers:

- BotOptionsContext
- MessagesContext
- PathsContext

As their names suggest, *BotOptionsContext* is used to manage bot options, *MessagesContext* handles chat messages while *PathsContext* deals with the paths for the chatbot. These context are also **exported for advanced users** to have even more granular control over the chatbot.

### Services

Files within the *services* folder deal with the **bulk of the logic** within the chatbot. You can infer from the file names what each file is responsible for processing. A vast majority of the processing logic concerns the [**attributes**](https://react-chatbotify.tjtanjin.com/docs/introduction/conversations#attributes) within a [**block**](https://react-chatbotify.tjtanjin.com/docs/introduction/conversations#block).

There are also a handful of initialisation logic for bot options, audio and voice services.

### Types

Lastly, the *types* folder contains type definitions that are required for **typescript projects**. Typescript support is covered [here](https://react-chatbotify.tjtanjin.com/docs/introduction/typescript).

## Code Documentation

Code documentation is strongly encouraged to ensure that the codebase can be easily maintainable. As a rule of thumb, **all components/services** should have a description of what it does at the top of the file where it is declared.

Functions can be without documentation if they are **small, self explanatory and easy to understand** by just looking at the code alone. For larger functions with more logic, it is still advisable to write code comments. In general, the following structure is adopted for writing comments:

```
/**
 * Handles processing of message in current block.
 * 
 * @param block current block being processed
 * @param params params that can be used/passed into attributes
 */
```

The above shows an example of a function processing the messages attribute within a block. Note that it begins with a brief description of what the function does followed by highlighting its 2 parameters and what they are used for.

Finally, any leftover tasks or areas in the code to be revisited should be flagged with a comment like the one below:

```
// todo: tj to optimize the calculation code here
```

That way, we can identify what are the tasks to finish up here and optionally, state who will be responsible for it.

## Testing

Testing in this project is done via the **selenium webdriver**. The default flow used in development within *App.tsx* is used to run the test cases against in an automated test.

In order to run the test, you will need to **download** the [chromedriver](https://chromedriver.chromium.org/downloads) matching your google chrome version and drop it within the *test* folder. Following which, execute `npm run test` to run the tests. Optionally, you may adjust configurations within *config.js* to aid in your debugging/testing.

Finally, if you would like to, you can then also build the library with `npm run build`.

## Pull Requests

If you are satisfied with your changes and would like to **contribute back to the project** (which we strongly encourage you to!), feel free to open a pull request to the master branch.

A pull request template has been setup to assist you in the process.

## Final Notes

The designs in this project are not perfect. We encourage experienced developers to help seek out areas for **improvements** in the application! We value your input and welcome contributions to enhance the chatbot. Happy coding!