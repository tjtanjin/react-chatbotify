# CHANGELOG.md

## v1.7.0 (10-06-2024)

**Added:**
- Added a new `language` property to the `voice` section for managing voice input language
- Added a new `flowStartTrigger` property to the `theme` section for managing when flow starts

**Fixed:**
- Fixed an issue where embedded chatbot notifications are played while chatbot is visible

**Note:**

This release has a minor breaking change for developers who are using advance custom paths. If you are currently initializing paths with `["start"]`, note that specifying the `start` block is no longer needed. This means you can simply use `[]` as shown in the updated custom paths example [here](https://react-chatbotify.tjtanjin.com/docs/examples/custom_paths).

## v1.6.3 (05-06-2024)

**Fixed:**
- Fixed a rare issue where streaming of messages can sometimes cause `undefined` to appear

## v1.6.2 (25-05-2024)

**Added:**
- Added a new `allowNewline` property to the `chatInput` section which determines if user input can contain newline (`\n`)
- The notifications feature is now properly supported for embedded chatbots and will chime only if the chatbot is scrolled out of view

**Fixed:**
- Fixed an issue where voice detection may not be properly disabled while the chatbot is still streaming messages
- Fixed an issue where **shift + enter** submits user input instead of attempting to add newline
- Fixed an issue where newline is automatically converted to whitespace in user and bot bubbles

## v1.6.1 (19-05-2024)

**Added:**
- Added a new `showCount` property to the `notification` section which allows showing/hiding of unread message count on the top right corner of chatbot button

**Fixed:**
- Improved performance for streaming messages
- Fixed an issue where streaming messages while `dangerouslySetInnerHtml` is set to `true` will pause briefly on encountering html tags
- Fixed an issue where notification sound may occasionally chime when chatbot is embedded
- Fixed an issue where textarea styles may be inconsistent when disabled/focused
- Fixed an issue where the bot may crash on rare occasions when users spam the voice button
- Fixed an issue where embedded chatbot will force input focus on new messages even when scrolled out of page view

## v1.6.0 (11-05-2024)

**Added:**
- Added a new `sensitiveInput` configuration section to cater for sensitive information (refer to [API documentation](https://react-chatbotify.tjtanjin.com/docs/api/bot_options#sensitiveinput))
- Added a new `autoLoad` property to the `chatHistory` section which allows chat history messages to be automatically loaded on start
- Added a new `dangerouslySetInnerHtml` property to both `userBubble` and `botBubble` which allows setting of raw HTML content (use with caution)

**Fixed:**
- Fixed several type definitions within the library itself
- Fixed an issue where the load chat history button can appear distorted if given a long text string
- Fixed an issue where some chat history messages may not be saved when using real-time stream
- Fixed an issue where chat input textarea may resize when focused on some occasions
- Fixed selection of emoji causing textarea to lose focus
- Improved performance for saving chat history
- Further reduced assets file size

**Note:**

This update contains significant additions but they have been documented on the [API documentation](https://react-chatbotify.tjtanjin.com/docs/api/bot_options#sensitiveinput) and you will also find new live examples for [Sensitive Input](https://react-chatbotify.tjtanjin.com/docs/examples/sensitive_input) and [Markup Message](https://react-chatbotify.tjtanjin.com/docs/examples/markup_message). This will be one of the last few (if not the last) release before v2.0.0 arrives. Feel free to join [discord](https://discord.gg/6R4DK4G5Zh) to stay up to date!

## v1.5.2 (08-04-2024)

**Added:**
- Added 2 new style props for `chatInputAreaFocusedStyle` and `chatInputAreaDisabledStyle`

**Fixed:**
- Fixed a few instances where chat history options/checkboxes are not rendered correctly
- Reduced notification sound file size

## v1.5.1 (30-03-2024)

**Fixed:**
- Fixed an issue where library css file is not injected for commonjs users
- Fixed an issue where tooltip mode may not be respected
- Fixed an issue where option boxes do not stretch on much larger chatbot window width
- Fixed an issue where overflowing text are not hidden for checkboxes/option boxes
- Fixed an issue where if `header` section is used, then `showAvatar` is a required property
- Fixed usage of oversized images (improves default chatbot load time!)

## v1.5.0 (29-03-2024)

**Added:**
- Added a new `animate` option to both `userBubble` and `botBubble` to easily toggle animations on and off for them

**Fixed:**
- Fixed an issue where empty chat bubbles from stream messages are being saved to chat history

**Miscellaneous:**
- As of this version (**1.5.0**), it is no longer necessary to import `react-chatbotify.css` file in your projects (injected implicitly). Keeping the import statement will not cause any issues currently but this will be a **breaking change** in version **2.0.0**. It is recommended to remove the import statement as soon as possible and the documentation website has also been updated to reflect this change.

## v1.4.0 (22-03-2024)

**Added:**
- A new `chatWindow` section has been added into the [**Configurations**](https://react-chatbotify.tjtanjin.com/docs/introduction/bot_options#configurations) category with the following default values:
  ```
  chatWindow: {
    showScrollbar: false,
    autoJumpToBottom: false,
    showMessagePrompt: true,
    messagePromptText: "New Messages ↓",
    messagePromptOffset: 30,
  }
  ```
  Explanations for what each property does can be found on the [**documentation website**](https://react-chatbotify.tjtanjin.com/docs/introduction/bot_options#configurations).

**Fixed:**
- Fixed an occasional issue where stream messages do not autoscroll when user is at the bottom of the chat
- Fixed an issue where users can interrupt the `start` block if it is streaming
- Fixed a bug where users can pinch-zoom the chat window on mobile devices to cause it to be distorted
- Fixed a rare bug where the chat window could be scrolled out of view
- Fixed a longstanding issue where playing notification sounds on mobile devices causes media controls to appear in notifications tray

**Note:**

Initially planned for only bug fixes, I eventually added a whole new `chatWindow` section simply because I felt there were many small areas that could use enhancements (hiding the scrollbar, showing new message prompts instead of forcing users to the bottom etc). This led to **version 1.4.0** which was entirely focused on cleaning up the imperfections from the several changes that have been made in the last few releases.

## v1.3.2 (16-03-2024)

**Fixed:**
- Fixed an issue where chat window auto-scrolling does not work for streamed messages
- Fixed an issue where loading chat history caused current scroll position to shift
- Fixed an issue where extremely long words get abruptly cut-off at the tail end of the message bubble

## v1.3.1 (13-03-2024)

**Added:**
- Added `simStream` and `streamSpeed` options for `userBubble` to be consistent with `botBubble`

**Fixed:**
- Fixed an issue where users can quickly click on **options** or **checkboxes** in rapid succession resulting in multiple inputs
- Fixed an issue where simulating stream messages would ignore the `blockSpam` option

## v1.3.0 (12-03-2024)

**Added:**
- Added `simStream` and `streamSpeed` options within `botBubble` to simulate streaming of messages
- Added `params.streamMessage` parameter that allows real-time streaming of messages (great for integration with LLMs)

**Modified:**
- The `isUser` field within [`Message`](https://react-chatbotify.tjtanjin.com/docs/introduction/conversations#message) component has been replaced with `sender`.
- Both `params.injectMessage` and newly added `params.streamMessage` are now **async** functions (previously, `params.injectMessage` was **non-async**)

**Miscellaneous:**
- Internally, logic for chat history, notifications and a few other minor areas have been updated to support stream messages

**Note:**

The [documentation website](https://react-chatbotify.tjtanjin.com/docs/introduction/bot_options/) has been updated to reflect all the latest information. A possible "breaking" change would be `params.injectMessage` which is now **async**. Depending on your existing usage, there might not be a need to make any changes. However, if you are using multiple `params.injectMessage` in quick succession, this could mean multiple messages are being sent at once without the use of **await**.

## v1.2.0 (12-02-2024)

**Fixed:**
- Fixed chatbot window resizing on mobile devices (previously window is out of view on some devices/browsers)
- Fixed chatbot window orientation (previously chatbot would not re-orientate on phone rotation)

**Note:**

The above fixes are important for users who wish to properly support the chatbot on mobile devices. While there has been significantly more mobile view tests done for these fixes, it is near-impossible to exhaustively run through all devices/browsers. Should anyone still encounter issues with mobile view, please do not hesitate to [reach out](https://discord.com/invite/X8VSdZvBQY).

## v1.1.0 (28-01-2024)

**Added:**
- Added support for enforcing & showing character count/limit via the following options:
  - `chatInput.showCharacterCount`: false
  - `chatInput.characterLimit`: -1
- Added support for styling the above character limit display via the following styles:
  - `characterLimitStyle`
  - `characterLimitReachedStyle`

**Note:**

The above additions have been updated on the [documentation website](https://react-chatbotify.tjtanjin.com/docs/introduction/bot_options/) for reference.

## v1.0.6 (10-09-2023)

**Fixed:**
- Fixed async file uploads

**Miscellaneous:**
- Disabled speech recognition on unsupported browsers (e.g. Opera)

## v1.0.5 (31-08-2023)

**Fixed:**
- Fixed missing support for user defined async functions (important fix if you wish to make use of API calls and wait for completion)

## v1.0.4 (13-08-2023)

**Fixed:**
- Fixed module export (imports by consumers should work properly for both cjs and mjs)

## v1.0.3 (05-08-2023)

**Added:**
- Added `desktopEnabled` and `mobileEnabled` options under the `theme` section to allow developers to control chatbot visibility based on platform

**Fixed:**
- Fixed a bug with distorted layout for embedded chat windows on mobile

## v1.0.2 (03-08-2023)

**Fixed:**
- Fixed missing export in _package.json_

## v1.0.1 (03-08-2023)

**Miscellaneous:**
- Cleanup _dist_ folder (halved the build size)
- Cleanup unused exports
- Cleanup documentation and configurations

## v1.0.0 (02-08-2023)

**Added:**
- Initial Release