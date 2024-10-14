# CHANGELOG.md

## v2.0.0-beta.18 (14-10-2024)

**Fixed:**
- Excluded comments from theme css files parsing
- Fixed an issue where icon was not rendered correctly in footer

## v2.0.0-beta.17 (13-10-2024)

**Fixed:**
- Fixed improper parsing of css files in themes
- Fixed toast animation not working

**Added:**
- Updated button with svgs from: https://fonts.google.com/
- Added disabled icon support for all buttons (now possible to have different icons for enabled/disabled state)
- Added svg component support for button icons (conveniently use the `fill` attribute to recolor icons!)
- Added a new `sendIconDisabledStyle`
- Loading of chat history no longer locks the text area
- Standardized keyframe naming conventions

## v2.0.0-beta.16 (08-10-2024)

**Fixed:**
- Fixed an issue where themes may not load properly
- Buttons now properly inherit base styles even in different states (e.g. disabled, hovered)

## v2.0.0-beta.15 (06-10-2024)

**Fixed:**
- Fixed an issue where having `settings.chatHistory.autoLoad: true` will cause the chat history to disappear
- Fixed an issue where loading of chat history may cause previously disabled text area to become enabled
- Renamed `id` inside `event.detail` to `botId` for better clarity

**Added:**
- Added a new `rcb-pre-load-chatbot` event
- Added a new `rcb-post-load-chatbot` event
- Added a new `useBotId` hook

## v2.0.0-beta.14 (03-10-2024)

**Fixed:**
- Fixed an issue where having multiple chatbots can cause styling conflicts with themes
- Fixed an issue where `removeMessage` was not working due to outdated messages state
- Fixed an issue where `defaultToggledOn` property for `voice` did not properly register voice inputs
- Fixed an issue where setting`defaultOpen` to `true` for `chatWindow` does not make it open by default
- Fixed an issue where toggling open the chat window does not emit its associated event
- Fixed a rare issue where spamming messages too fast can cause autoscroll to bottom to not work properly
- Fixed notification badge style to prevent it from becoming oval-shaped
- Fixed an issue with the library packaging process, reduces overall size by nearly 60%!
- Renamed `useToast` hook to `useToasts` for consistency

**Added:**
- Added proper support for React 19!
- Added a new `ariaLabel` section to improve accessibility support
- Added a new `useChatHistory` hook that provides 3 new actions (`showChatHistory`, `getHistoryMessages` and `setHistoryMessages`)
- Added a new `sendButtonDisabledStyle` (send button is now properly disabled when textarea is disabled as well)
- Improved localised styling of chatbots to reduce conflicts with host websites (and with other chatbots)

**Note:**
This update brings about a couple of fantastic improvements - drastically reduced library size (by nearly 60%), React 19 support, improved localised styles and better accessibility support!

## v2.0.0-beta.13 (26-09-2024)

**Fixed:**
- Fixed an issue where the toggle voice event was not properly triggered

**Added:**
- Improved support for ssr (users now no longer need to rely on dynamic imports as a workaround)

## v2.0.0-beta.12 (20-09-2024)

**Fixed:**
- Fixed an issue where toasts do not obey max limit
- Fixed an issue where toasts are not positioned properly
- Fixed an issue where notification sound does not play correctly in `useNotifications`

## v2.0.0-beta.11 (20-09-2024)

**Added:**
- Added a new `useFlow` hook that grants access to retrieving and restarting the conversation flows
- The `hasFlowStarted` boolean which was previously found in `useFirstInteraction` has been moved to `useFlow` for better consistency

**Fixed:**
- Fixed an issue where states were not updated in conversation flow

**Note:**

There have been confusions surrounding the use of `ChatBotProvider` such as what props it should be given if used. To reduce the mental load on developers, all props are now centralized to **only** `ChatBot`, regardless of whether you are using `ChatBotProvider` or not. There is **no functionality change**, but developers can now just remember that `ChatBot` is what accepts all props so if you're currently passing props to `ChatBotProvider`, move them all to `ChatBot` instead.

## v2.0.0-beta.10 (18-09-2024)

**Fixed:**
- Fixed an issue where chatbot view on mobile devices may not resize correctly
- Fixed an issue where uuids are not generated properly for non-https environments

## v2.0.0-beta.9 (16-09-2024)

**Breaking Changes (Advanced Users):**
- If you are manually manipulating the `messages` array via advanced messages, note that the message elements now enforce that the following fields must be present (more details [**here**](https://react-chatbotify.com/docs/introduction/migration_v2#message-attributes-expanded-and-required)):
  - id
  - sender
  - content
  - type
  - timestamp
- If you are currently using any of the advanced features (e.g. `SettingsContext`, `StylesContext`, `MessagesContext` or `PathsContext`), note that these have been removed in favor of a single provider (`ChatBotProvider`). The `advance` configuration section has also been removed from `settings` as the entire concept of advanced features is being dropped (more details [**here**](https://react-chatbotify.com/docs/introduction/migration_v2#advance-section-removed)).

**Breaking Changes (All Users):**
- The `isOpen` variable in `settings` which tracked the open/close state of the chatbot window has been removed, in favor of `useChatWindow` hook. More details [**here**](https://react-chatbotify.com/docs/introduction/migration_v2#removed-isopen-from-botoptions).
- Last beta release, a new `params.injectToast` was added. This has been renamed to `params.showToast` to avoid conceptual similarities with messages.

**Fixed:**
- Fixed an issue where `params.setTextAreaValue` may not respect the character limit of the text area (if set).

**Added:**
- A new **id** prop has been added to uniquely identify a bot (relevant for firing events when there are multiple chatbots).
- A new **plugins** prop is now available. However, there are no plugins released yet - they will come in October. More details [**here**](https://react-chatbotify.com/docs/concepts/plugins).
- A new **hooks** feature is now available, granting extreme flexibility in interacting with the chatbot from **your own components**. This is achieved by nesting your components within a single `<ChatBotProvider/>`. More details [**here**](https://react-chatbotify.com/docs/api/hooks).
- A new **events** feature is now available, allowing you to listen for chatbot events and run your own application logic. Events are an opt-in feature so you'll need to enable them in `settings`. More details [**here**](https://react-chatbotify.com/docs/api/events).
- A message id (string) is now returned for `injectMessage` and `streamMessage` which identifies the message the content is sent in (returns null if sending of message was prevented in event listeners).
- A toast id (string) is now returned for `showToast` which identifies the toast the content is sent in (returns null if sending of toast was prevented in event listeners).
- The `transition` attribute now accepts a `number` as well (defaults interruptable to `false`).

**Note:**
This beta release includes large scale changes in order to deliver on the events/plugins feature. Pending major bugs or implementation issues, this will be the last round of introducing massive changes as we strive towards a stable version for v2. Note that given the scale of these changes, there are minor breaking changes (in addition to the initial beta release), which largely affects advanced users. For users updating from the older beta versions, I've put together the sections to catch up on for addressing breaking changes:
- [**Removed isOpen from BotOptions (Settings)**](https://react-chatbotify.com/docs/introduction/migration_v2#removed-isopen-from-botoptions)
- [**Advance Section Removed**](https://react-chatbotify.com/docs/introduction/migration_v2#advance-section-removed)
- [**Message Attributes Expanded and Required**](https://react-chatbotify.com/docs/introduction/migration_v2#message-attributes-expanded-and-required)
If you're updating to this version from v1, then you should still refer to the migration guide which has also already been updated with all the latest information.

## v2.0.0-beta.8 (06-09-2024)

**Fixed:**
- Fixed an issue where bot typing indicator is not shown when `params.goToPath` is used

**Added:**
- A new `params.setTextAreaValue` has been added for users to directly set the text area value
- A new `params.injectToast` has been added for users to show toasts within the chatbot
- A new `toast` section has been added to `settings` which contains 3 properties (`maxCount`, `forbidOnMax` and `dismissOnClick`) along with 3 new additions to `styles` (`toastPromptContainerStyle`, `toastPromptStyle`, `toastPromptHoveredStyle`)
- The `checkboxes` block attribute now accepts an **array** of strings as well, and will populate `items` property with it (all other values defaulted)
- The `checkboxes` block attribute has 2 new properties `sendOutput` and `reusable`, which determines whether the selected checkboxes should be sent in chat and whether the checkboxes can be reused
- The `options` block attribute now accepts an **object** as well, accepting 3 properties which are `items`, `sendOutput` and `reusable` (current array input still works)

**Note:**
This update adds on to and expands the `checkboxes` and `options` block attributes. There are **no breaking changes** but if users are keen to leverage on the new features, do refer to the [**attributes documentation**](https://react-chatbotify.com/docs/api/attributes). In addition, **2 new parameters** (`params.setTextAreaValue` and `params.injectToast`) have also been added which greatly enhances the capabilities of the chatbot and sets the groundwork for the impending events/plugins update. Details of their usage can be found in [**params documentation**](https://react-chatbotify.com/docs/api/params).

## v2.0.0-beta.7 (01-09-2024)

**Added:**
- Added `rcbTypingIndicatorContainerStyle` and `rcbTypingIndicatorDotStyle` for ease of styling typing indicator

## v2.0.0-beta.6 (24-08-2024)

**Fixed:**
- Fixed an issue where chat icon will not fit in the button correctly
- Fixed an issue where `baseUrl` was wrongly named `base_url`

**Added:**
- Added caching of themes locally to improve performance
- Added optional `cacheDuration` field when specifying themes which specifies in seconds the duration to cache the theme for (defaults to 30 days)

## v2.0.0-beta.5 (15-08-2024)

**Fixed:**
- Fixed an issue where cursor disabled icon was not showing up on mac devices

**Added:**
- Added a bunch of new style props for **buttons** and **icons** to improve convenience in styling:
```
// new button styles
audioButtonStyle?: React.CSSProperties;
audioButtonDisabledStyle?: React.CSSProperties;
closeChatButtonStyle?: React.CSSProperties;
emojiButtonStyle?: React.CSSProperties;
emojiButtonDisabledStyle?: React.CSSProperties;
fileAttachmentButtonStyle?: React.CSSProperties;
fileAttachmentButtonDisabledStyle?: React.CSSProperties;
notificationButtonStyle?: React.CSSProperties;
notificationButtonDisabledStyle?: React.CSSProperties;
voiceButtonStyle?: React.CSSProperties;
voiceButtonDisabledStyle?: React.CSSProperties;

// new icon styles
chatIconStyle?: React.CSSProperties;
audioIconStyle?: React.CSSProperties;
audioIconDisabledStyle?: React.CSSProperties;
closeChatIconStyle?: React.CSSProperties;
emojiIconStyle?: React.CSSProperties;
emojiIconDisabledStyle?: React.CSSProperties;
fileAttachmentIconStyle?: React.CSSProperties;
fileAttachmentIconDisabledStyle?: React.CSSProperties;
notificationIconStyle?: React.CSSProperties;
notificationIconDisabledStyle?: React.CSSProperties;
voiceIconStyle?: React.CSSProperties;
voiceIconDisabledStyle?: React.CSSProperties;
sendIconStyle?: React.CSSProperties;
```

**Note:**
There were minor shifting of a few classes to better separate buttons and icons. This should not be an issue for the vast majority of users, but if you've done very specific changes to button/icon styles by targeting the CSS classes, it is advisable to visually check the appearance of said buttons/icons.

## v2.0.0-beta.4 (02-08-2024)

**Fixed:**
- Fixed an issue where disabling `chatInput` globally cannot be overriden by block-level `chatDisabled` attribute

## v2.0.0-beta.3 (28-07-2024)

**Fixed:**
- Fixed an issue where themes will override the current `isOpen` value in `settings`, causing it to open/close unexpectedly

## v2.0.0-beta.2 (25-07-2024)

**Fixed:**
- Fixed an issue where theme conflicts are not properly resolved
- Fixed an issue where invalid sections are not caught in themes
- Fixed an issue where sensitive inputs permanently mask the remaining conversations
- Fixed an issue where chatbot loses focus in text area when transitioning from a previously disabled state

## v2.0.0-beta.1 (24-07-2024)

**Note:**
v2.0.0-beta.1 is a major release with **breaking changes**. All details are available in the [**migration guide**](https://react-chatbotify.com/docs/introduction/migration_v2). 

## v1.7.0 (10-06-2024)

**Added:**
- Added a new `language` property to the `voice` section for managing voice input language
- Added a new `flowStartTrigger` property to the `theme` section for managing when flow starts

**Fixed:**
- Fixed an issue where embedded chatbot notifications are played while chatbot is visible

**Note:**

This release has a minor breaking change for developers who are using advance custom paths. If you are currently initializing paths with `["start"]`, note that specifying the `start` block is no longer needed. This means you can simply use `[]` as shown in the updated custom paths example [here](https://react-chatbotify.com/docs/examples/custom_paths).

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
- Added a new `sensitiveInput` configuration section to cater for sensitive information (refer to [API documentation](https://react-chatbotify.com/docs/api/bot_options#sensitiveinput))
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

This update contains significant additions but they have been documented on the [API documentation](https://react-chatbotify.com/docs/api/bot_options#sensitiveinput) and you will also find new live examples for [Sensitive Input](https://react-chatbotify.com/docs/examples/sensitive_input) and [Markup Message](https://react-chatbotify.com/docs/examples/markup_message). This will be one of the last few (if not the last) release before v2.0.0 arrives. Feel free to join [discord](https://discord.gg/6R4DK4G5Zh) to stay up to date!

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
- A new `chatWindow` section has been added into the [**Configurations**](https://react-chatbotify.com/docs/introduction/bot_options#configurations) category with the following default values:
  ```
  chatWindow: {
    showScrollbar: false,
    autoJumpToBottom: false,
    showMessagePrompt: true,
    messagePromptText: "New Messages ↓",
    messagePromptOffset: 30,
  }
  ```
  Explanations for what each property does can be found on the [**documentation website**](https://react-chatbotify.com/docs/introduction/bot_options#configurations).

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
- The `isUser` field within [`Message`](https://react-chatbotify.com/docs/introduction/conversations#message) component has been replaced with `sender`.
- Both `params.injectMessage` and newly added `params.streamMessage` are now **async** functions (previously, `params.injectMessage` was **non-async**)

**Miscellaneous:**
- Internally, logic for chat history, notifications and a few other minor areas have been updated to support stream messages

**Note:**

The [documentation website](https://react-chatbotify.com/docs/introduction/bot_options/) has been updated to reflect all the latest information. A possible "breaking" change would be `params.injectMessage` which is now **async**. Depending on your existing usage, there might not be a need to make any changes. However, if you are using multiple `params.injectMessage` in quick succession, this could mean multiple messages are being sent at once without the use of **await**.

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

The above additions have been updated on the [documentation website](https://react-chatbotify.com/docs/introduction/bot_options/) for reference.

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