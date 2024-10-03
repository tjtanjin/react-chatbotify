<p align="center">
  <img width="200px" src="https://raw.githubusercontent.com/tjtanjin/react-chatbotify/main/assets/logo.png" />
  <h1 align="center">React ChatBotify</h1>
</p>

## Table of Contents
* [Introduction](#introduction)
* [Navigating this Developer Guide](#navigating-this-developer-guide)
* [Setup](#setup)
* [Project Structure](#project-structure)
* [Design](#design)
* [Code Documentation](#code-documentation)
* [Testing](#testing)
* [Pull Requests](#pull-requests)
* [Final Notes](#final-notes)

<div style="page-break-after: always;"></div>

## Introduction

For an introduction to the library itself, please refer to the project [*README*](https://github.com/tjtanjin/react-chatbotify/blob/main/README.md). This developer guide assumes its readers to have at least a **basic understanding** of [React](https://react.dev/) Applications. Otherwise, it is highly recommended for readers to refer to proper tutorial contents for the basics of React prior to developing the application. It is also worth noting that a major aspect of this guide is to cover **important design considerations** for the project. The designs are not perfect and you are encouraged to **think and explore possible improvements** for the library.

This guide **will not** dive into every single project detail because that is not sustainable in the long run. For simpler implementations that are not covered in this guide, you will find the code comments in the files themselves to be useful.

## Navigating this Developer Guide

Before diving into the rest of the contents in our developer guide, the following are a few important syntaxes to take note of to facilitate your reading:

| Syntax              | Description                                    |
| ------------------- | ---------------------------------------------- |
| `Markdown`          | Commands (e.g. `npm install`)                  |
| *Italics*           | Files/Folders (e.g. *services*, *components*)  |
| **Bold**            | Keywords (e.g. **important consideration**)    |

<div  style="page-break-after: always;"></div>

## Setup

Setting up the project is relatively simple. Before you begin, ensure that you have **at least NodeJS 16.x** installed.
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

Go ahead and start making code changes to the project (hot module reloading is enabled). You may also find instructions for [**testing**](https://github.com/tjtanjin/react-chatbotify/blob/main/docs/DeveloperGuide.md#testing) and [**opening pull requests**](https://github.com/tjtanjin/react-chatbotify/blob/main/docs/DeveloperGuide.md#pull-requests) relevant if you're looking to contribute back to the project!

## Project Structure

### Overview

At a high level overview, the entire project can be (broadly speaking) broken down into **8 different sections** which are as follows:

- *assets*
- *components*
- *constants*
- *context*
- *hooks*
- *services*
- *types*
- *utils*

Each section and its relevant files are seated in its own folder so it's relatively straightforward when looking at the project structure. Below, we will take a deeper look at the details for individual sections.

### Assets

As its name suggest, the *assets* folder contains **media content** (such as **images** and **sound**) that are used by the chatbot. These are centrally imported and loaded within the *constants/DefaultSettings.tsx* file during chatbot initialisation. Images are all provided in **SVG** formats, and there is only a single **.wav** file for notification sound.

### Components

While users of this library may perceive the chatbot as one entire component, it is actually made up of **many smaller components**. A quick glance at the *components* folder will give you an idea of how many parts are actually being put together.

At the high level, there are the more obvious components such as the *ChatBotHeader*, *ChatBotBody* and *ChatBotFooter*. However, you may notice that even something seemingly minor such as the *LoadingSpinner* is also its own component. In fact, if you dive into some of them, they actually have their own subcomponents as well (e.g. *Buttons/AudioButton*, *ChatBotBody/UserOptions*).

In general, each component should try to adhere to the Single Responsibility Principle (i.e. it should only handle a single piece of functionality). This is a good rule of thumb, but it also depends on  **how complex the functionality** for a part is. If you're creating a new component **and have the intention to contribute back to the upstream repository**, it probably means you're creating a new functionality and you're encouraged to [**discuss with the team**](https://discord.gg/6R4DK4G5Zh).

### Context

The chatbot uses a total of **8 contexts** for managing global information:

- BotRefsContext
- BotStatesContext
- ChatBotContext
- MessagesContext
- PathsContext
- SettingsContext
- StylesContext
- ToastsContext

In particular, the *ChatBotContext* is also exported and exposed to users of the library for **advanced use cases** where they can directly interact with the chatbot from their own external components. All other contexts are **completely** transparent to users, and they do not even need to be aware of their existence.

For developing the library however, it is important to know what each of these context are responsible for.

#### BotRefsContext

The *BotRefsContext* is used to globally **track references** across the chatbot. This includes things like **inputRef** (which tracks the text area) and **botIdRef** which tracks the id of the chatbot. References tracked here are typically used across several chatbot components.

#### BotStatesContext

The *BotStatesContext* is used to globally **track states** across the chatbot. This includes things like **audioToggledOn** and **isChatWindowOpen** which represents the various states of the chatbot. States tracked here are typically used across several chatbot components. Performance wise, `useCallback` and `useMemo` are used to prevent unnecessary re-renders.

#### ChatBotContext

The *ChatBotContext* exports a *ChatBotProvider* that can be imported by users of the library. It is the top-level component of the *ChatBot* and is what exposes the [**hooks**](#hooks) functionality for **advanced users**. Note that explicitly importing and using this is optional, and that if users just import *ChatBot* directly, this provider is automatically created by the library.

#### MessagesContext

The *MessagesContext* is used to manage all chat messages within the chatbot. Strictly speaking, the handling of messages can just be treated as a state within *BotStatesContext*. The decision to keep *MessagesContext* separate is intentional because messages are a core part of chatbot conversations and is key for the chatbot to even function.

#### PathsContext

The *PathsContext* is used to manage all paths logic within the chatbot. Similar to *MessagesContext*, it is handled separately as paths/blocks are also a core part of ensuring the flow of chatbot conversations.

#### SettingsContext

The *SettingsContext* is used to manage all settings within the chatbot. If no settings are provided by the user, it uses the values found in *constants/DefaultSettings.tsx*. Otherwise, it will parse and combine the settings provided by the users with the default settings to determine the final settings used in the chatbot.

#### StylesContext

The *StylesContext* is used to manage all styles within the chatbot. These styles are relevant for *components* and if no styles are provided by the user, it takes its styles from *.css* files and inline. You may notice that there is an empty *constants/DefaultStyles.tsx* file, which is currently a placeholder that **may be removed in future**.

#### ToastsContext

The *ToastsContext* is used to manage toasts within the chatbot. Unlike the other context, toasts are not a feature used by default. That said, this is a very new context, and it is likely to be relevant for (**plugins**)[#plugins]. Its use cases will continue to be explored and solidified down the road.

### Hooks

There are 2 types of hooks within the chatbot. Those found within the *hooks/internal* folder are considered **internal hooks**. Those found directly within *hooks* are as you can guess, considered **external hooks**. There is a 1-1 pairing between hooks (i.e. **each internal hook has a matching external hook**). The differences between the two are described below.

#### Internal Hooks

Internal hooks are **imported and used within various parts of the library**. They contain logic needed to facilitate functionalities **across the chatbot**.

#### External Hooks

External hooks **do not contain logic** and simply acts as a filtering layer for what can be exposed externally to users of the library. If you look at the external hooks, they simply selectively import functionalities from the internal hooks to be exposed.

### Services

Files within the *services* folder deal with the logic pertaining to **specific features** of the chatbot (e.g. *AudioService*, *VoiceService*). You can infer from the file names what each file is responsible for processing. A vast majority of the processing logic concerns the [**attributes**](https://react-chatbotify.com/docs/introduction/conversations#attributes) within a [**block**](https://react-chatbotify.com/docs/introduction/conversations#block).

**Note:** Services and hooks both deal with logic, but they are **fundamentally different**. Services deal with the **logic of the feature itself**. For example, the *AudioService* contains logic for the reading of chat messages while the *VoiceService* contains logic for detecting user microphone input. On the other hand, hooks contain common functionalities shared across the chatbot that **cannot stand as a feature itself**. For example, the *useAudioInternal* and *useVoiceInternal* hooks contain logic for toggling the audio/voice (toggling audio/voice is a functionality, but by itself is not a feature as that does nothing without the service).

### Types

The *types* folder contains type definitions that are required for **typescript projects**. Typescript support is covered [here](https://react-chatbotify.com/docs/introduction/typescript). Note that there are numerous types defined and that with the **exception** of types found within *types/internal*, all other type definitions are exported for users developing with typescript.

### Utils

The *utils* folder contain small miscellaneous functionalities that are not features themselves (and hence not in *services*), That said, these functionalities are still needed sparingly across the chatbot. Bluntly put, there is no good place to put them and there's a possibility that the *utils* folder becomes a dumping ground for "things that don't belong". In general, you are **discouraged** from putting things here but hey, if you really can't find a good fit elsewhere, why not :P

## Design

### Overview

React ChatBotify started out as a small chatbot library but has since evolved to become much more **performant, flexible and extensible**. Along the way, its designs have been **constantly evolving and improving**. To date, it supports a significant amount of features and naturally, there are numerous design considerations that have gone into it.

This is a key section of the developer guide that provides insights into some of the decisions taken and is extremely important for understanding if you're looking to develop for the chatbot. Specific implementation details that are interesting to note will also be included here. So strap in and read on!

### Conversations

At the heart of the chatbot experience are [**conversations**](https://react-chatbotify.com/docs/concepts/conversations). One of the first few considerations that came to mind was how to allow users to **customize conversations** for the chatbot. In a couple of my previous projects, I have made use of [Tidio](https://www.tidio.com/) and [React Simple Chatbot](https://github.com/LucasBassetti/react-simple-chatbot) which are both successful in their own ways. With that in mind, the idea was to learn what was done well in these solutions, and then strive to make further improvements.

In React ChatBotify, [**conversations**](https://react-chatbotify.com/docs/concepts/conversations) is a concept covered extensively in the [**documentation website**](https://react-chatbotify.com). It is a concept that users of the library should be aware of as they work **with the library in their projects**, and more so for developers wishing to work **on the library itself**. I'll spare the details here as you can find concepts neatly explained [**here**](https://react-chatbotify.com/docs/concepts/conversations).

### Settings & Styles

Conversations makeup the contents of the chatbot, but users also need to be provided with an easy and straightforward way to customize their chatbots. In **v1** of the chatbot, an **options** prop was added which allowed users to specify configurations such as whether they wanted audio feature, voice feature, hide the chatbot header etc. The prop also allowed users to specify a whole range of styles for various chatbot components.

This was sustainable initially when the number of features were small, but eventually proved unscalable as the chatbot grew. In **v2**, the **options** prop was broken up into **settings** and **styles** prop. The **settings** prop managed configurations pertaining to functionalities while the **styles** prop was strictly for customizing appearance. As with [conversations](#conversations), more information about [**Settings**](https://react-chatbotify.com/docs/concepts/settings) and [**Styles**](https://react-chatbotify.com/docs/concepts/styles) are available on the documentation website as these are concepts that users of the library should be aware of as well.

### Custom Events

Prior to events, there were **very limited ways** to run application logic depending on actions taken by the chatbot. One possible way was through the [**advanced section**](https://react-chatbotify.com/legacy/v1/docs/api/bot_options#advance) in **v1**. Even then, the advanced section was ugly to setup and lacked a great deal of customizations.

Hence in **v2**, custom events was added as a feature which enabled developers to build event-driven interactions. For example, one may listen on the `RcbPostMessageInjectEvent` to log messages for analytics, or they can rely on the `RcbUserSubmitInputEvent` to validate and block user input. Such an event system promotes loose coupling between the chatbot's internal logic and external systems, making integrations with APIs or analytics services possible and straightforward.

### Custom Hooks

The addition of custom hooks came alongside [custom events](#custom-events). While events provided information on when the chatbot took certain actions, hooks provided the means for interacting with the chatbot from external components. Oftentimes, events and hooks are used together. In fact, this would be true for most [plugins](#plugins) that rely on events to listen on chatbot actions and then use hooks in response.

It is worth noting that there are both internal and external hooks. Why the distinction? While internal hooks are useful for sharing common logic across the chatbot, not all functionalities should be exposed externally. Rather, a selected set of functionalities should be exposed for users of the library. To limit the sort of functionalities we can expose, external hooks are used as a **filtering layer**. Note that the usage of hooks by users can be considered an **advanced feature** of the chatbot which is unlikely to be relevant for typical use cases.

### Themes

Themes is a **new concept** introduced in **v2 of the chatbot**. Strictly speaking, there's a fair bit of design considerations that went into it as well. I contemplated including this inside the previous section on [**Design**](#design), but figured themes is a huge feature/concept by itself given that it relies on a separate [**themes repository**](https://github.com/tjtanjin/react-chatbotify-themes).

With that said, I won't be diving into too much details here as I've written a separate article previously on the solutioning for themes. You can find that article [**here**](https://medium.com/@tjtanjin/behind-the-scenes-solutioning-for-react-chatbotifys-themes-a59576043d4a) if you are keen or give the [**themes concept**](https://react-chatbotify.com/docs/concepts/themes) a read as well.

### Plugins

Similar to [**Themes**](#themes), Plugins is a **new concept** introduced in **v2 of the chatbot** with a significant amount of design considerations that went into it. That said, the documentation for Plugins **has not been released** and so, standards and instructions for usage/creation of plugins have not been published. This is a current work-in-progress, with the first version of documentation and official plugins slated for release end October/early November 2024. Note that even though the documentation is not ready, the chatbot is already technically capable of supporting plugins!

Once plugins are publicly available, a separate article will be written to share on the solutioning and linked here and when it is published. Currently, the [**plugins concept**](https://react-chatbotify.com/docs/concepts/plugins) is also briefly written on the documentation website.

### Mobile Support

When designing the library, significant amounts of effort also went into mobile support. This is because different mobile devices (Android, iOS) and different browsers (Safari, Chrome) can have different behaviors. In particular, managing the dimensions of the chatbot was a huge challenge.

For a start, the ideal behavior for a chatbot on mobile is for it to take up the full screen when opened. This first step is typically easy to achieve, but the trouble comes once users keyboard shows up on the screen. On different devices/browsers, keyboards are handled differently and this can cause the chatbot to be resized in various manners including moving the chatbot out of view and having the chatbot hidden behind the keyboard.

The current working solution involves using a combination of listeners to handle resize events. These can be found in the `useBotEffectsInternal` hook and comments are specially written for logic handling mobile devices.

### Notification Sound

Notification sound is nothing special, but I thought it interesting to include here because I actually tried a few solutions before settling for one that worked. I wrote a short article about it [**here**](https://medium.com/@tjtanjin/mobile-web-audio-removing-media-controls-from-notifications-tray-fa08facd7016).

## Code Documentation

Code documentation is **strongly encouraged** to ensure that the codebase is kept easily maintainable. As a rule of thumb, **all components/context/hooks/services** should have a description of what it does at the top of the file where it is declared.

Functions can be without documentation if they are **small, self explanatory and easy to understand** by just looking at the code alone. For larger functions with more logic, it is still **encouraged to write code comments**. In general, the following structure is adopted for writing comments:

```
/**
 * Handles processing of message in current block.
 * 
 * @param block current block being processed
 * @param params params that can be used/passed into attributes
 */
```

The above shows an example of a function processing the messages attribute within a block. Note that it begins with a brief description of what the function does followed by highlighting its 2 parameters and what they are used for.

Finally, any leftover tasks or areas in the code to be revisited should be flagged with a **todo comment** like the one below:

```
// todo: tj to optimize the calculation code here
```

That way, we can identify what are the tasks to finish up here and optionally, state who will be responsible for it.

## Testing

Having robust tests reduces the incidences of introducing bugs alongside code changes. It also gives more confidence to the quality of the library when publishing a new release. With that said, there are a total of 3 different types of tests done for the library:

- Unit Test (`npm run unit:test`)
- Integration Test (`npm run int:test`)
- Compatibility Test (currently only runs on CI/CD pipeline, can explore having it done locally with docker)

### Unit Test

Unit tests are done via [**Jest**](https://jestjs.io/), and you will find *jest.config.js*, *setup.jest.js* and the *\__tests__* folder to be relevant. Unfortunately, unit testing for the library has only been recently setup (not great, I know ;-;), and there's still a lot of ground to be covered. As of updating this guide, only a small handful of *hooks* are being tested but they serve as good references. If you're looking for **good-first-issues**, consider adding unit tests!

### Integration Test

Integration tests are done via [**cypress**](https://www.cypress.io/), and you will find *cypress.config.js* and the *cypress* folder to be relevant. Currently, integration testing uses the default chatbot flow and settings for development that can be found within *App.tsx*. A series of automated actions are carried out and its results are verified by test cases. In future, it would be great to include a variety of flows/settings as testing against different setups will make the integration tests more comprehensive. For debugging purposes, you may also find it useful to run the test with `npm run int:test:open`.

### Compatibility Test

Compatibility tests are currently **only** done via the [**CI/CD pipeline**](https://github.com/tjtanjin/react-chatbotify/actions). It basically does the following steps:

1) Packages the library
2) Sets up a basic project in **React 16, 17, 18 and 19**
3) Installs the chatbot library
4) Verifies that it is compatible by running the same suite of integration test on the basic project

In future, it is possible to explore running compatibility tests locally as well with docker.

Finally, if you would like to, you can then also build the library with `npm run build` or package the library with `npm pack`.

## Pull Requests

If you are satisfied with your changes and would like to **contribute back to the project** (which we strongly encourage you to!), feel free to open a pull request to the master branch.

A pull request template has been setup to assist you in the process. Note that if your pull request involves **significant changes** (e.g. new feature), you should [**reach out and discuss with the team**](https://discord.gg/6R4DK4G5Zh) beforehand.

## Final Notes

The designs in this project are not perfect. We encourage experienced developers to help seek out areas for **improvements** in the application! We value your input and welcome contributions to enhance the chatbot. Happy coding!