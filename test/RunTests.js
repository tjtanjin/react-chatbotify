// load config
import config from "./config.js";
const TEST_URL = config.TEST_URL;
const WAIT_DURATION = config.WAIT_DURATION;
const HEADLESS = config.HEADLESS;

// initialisations
import webdriver from "selenium-webdriver";
import { Options } from "selenium-webdriver/chrome.js";
import { promisify } from "util";
import path from "path";
const sleep = promisify(setTimeout);
const { Builder, By, Key, until } = webdriver;
const options = new Options();
if (HEADLESS) {
    options.headless();
}
options.addArguments("start-maximized");
const driver = new Builder()
  .forBrowser("chrome")
  .setChromeOptions(options)
  .build();
const errors = [];
let numCases = 0;

// execution and test cases below
// test cases are executed in order and are based on the default flow in App.tsx
// before running tests, ensure the app is running in the background
const run = async() => {
    await driver.get(TEST_URL);
    await executeTest(openChatWindow);
    await executeTest(sendName);
    await executeTest(disabledChatInput);
    await executeTest(clickOption);
    await executeTest(sendWrongMathAnswer);
    await executeTest(sendCorrectMathAnswer);
    await executeTest(sendColor);
    await executeTest(selectInsufficientCheckboxes);
    await executeTest(selectTooManyCheckboxes);
    await executeTest(selectCorrectCheckboxes);
    await executeTest(sendWrongHeightAnswer);
    await executeTest(sendCorrectHeightAnswer);
    await executeTest(clickHint);
    await executeTest(sendEmojiColorGuess);
    await executeTest(sendColorGuess);
    await executeTest(reopenChatWindow);
    await executeTest(sendFood);
    await executeTest(sendImage);
    await executeTest(sendGoodbye);
    await executeTest(toggleNotifications);
    await executeTest(toggleAudio);
    await executeTest(toggleVoice);
    await executeTest(viewHistory);
    showTestSummary();
    await driver.quit();
};

const executeTest = async (testCase) => {
    numCases++;
    try {
        await testCase();
    } catch (err) {
        errors.push({case: testCase.name, error: err.message});
    }
}

const openChatWindow = async () => {
    const buttonElement = await driver.findElement(By.className("rcb-toggle-button"));
    await driver.wait(until.elementIsVisible(buttonElement), WAIT_DURATION);
    await buttonElement.click();
    const hideElement = await driver.findElement(By.className("rcb-window-open"));
    await driver.wait(until.elementIsVisible(hideElement), WAIT_DURATION);
}

const sendName = async () => {
    const textAreaElement = await driver.findElement(By.className("rcb-chat-input-textarea"));
    await driver.wait(until.elementIsVisible(textAreaElement), WAIT_DURATION);
    await textAreaElement.sendKeys("Tan Jin", Key.RETURN);
    const expectedText = "Hey Tan Jin!";
    await sleep(WAIT_DURATION);
    const replyElements = await driver.findElements(By.className("rcb-bot-message"));
    const isTextPresent = (await replyElements[1].getText()).includes(expectedText);

    if (!isTextPresent) {
        throw new Error(`Unable to receive expected bot reply ${expectedText}`);
    }
}

const disabledChatInput = async () => {
    const textAreaElement = await driver.findElement(By.className("rcb-chat-input-textarea"));
    await textAreaElement.sendKeys("Should not be able to type.");
    const textAreaValue = await textAreaElement.getAttribute("value");
    if (textAreaValue !== "") {
        throw new Error(`Unexpected value in text area: ${textAreaValue}`);
    }
}

const clickOption = async () => {
    const optionElements = await driver.findElements(By.className("rcb-options"));
    await sleep(WAIT_DURATION);
    await optionElements[1].click();
    const expectedText = "I see you're a teen.";
    await sleep(WAIT_DURATION);
    const replyElements = await driver.findElements(By.className("rcb-bot-message"));
    const isTextPresent = (await replyElements[2].getText()).includes(expectedText);

    if (!isTextPresent) {
        throw new Error(`Unable to receive expected bot reply ${expectedText}`);
    }
}

const sendWrongMathAnswer = async () => {
    const textAreaElement = await driver.findElement(By.className("rcb-chat-input-textarea"));
    await driver.wait(until.elementIsVisible(textAreaElement), WAIT_DURATION);
    await textAreaElement.sendKeys("3", Key.RETURN);
    const expectedText = "Your answer is incorrect, try again!";
    await sleep(WAIT_DURATION);
    const replyElements = await driver.findElements(By.className("rcb-bot-message"));
    const isTextPresent = await replyElements[3].getText() === expectedText;

    if (!isTextPresent) {
        throw new Error(`Unable to receive expected bot reply ${expectedText}`);
    }
}

const sendCorrectMathAnswer = async () => {
    const textAreaElement = await driver.findElement(By.className("rcb-chat-input-textarea"));
    await driver.wait(until.elementIsVisible(textAreaElement), WAIT_DURATION);
    await textAreaElement.sendKeys("2", Key.RETURN);
    const expectedText = "Great Job! What is your favourite color?";
    await sleep(WAIT_DURATION);
    const replyElements = await driver.findElements(By.className("rcb-bot-message"));
    const isTextPresent = await replyElements[4].getText() === expectedText;

    if (!isTextPresent) {
        throw new Error(`Unable to receive expected bot reply ${expectedText}`);
    }
}

const sendColor = async () => {
    const textAreaElement = await driver.findElement(By.className("rcb-chat-input-textarea"));
    await driver.wait(until.elementIsVisible(textAreaElement), WAIT_DURATION);
    await textAreaElement.sendKeys("red", Key.RETURN);
    const expectedText = "Interesting! Pick any 2 pets below.";
    await sleep(WAIT_DURATION);
    const replyElements = await driver.findElements(By.className("rcb-bot-message"));
    const isTextPresent = await replyElements[5].getText() === expectedText;

    if (!isTextPresent) {
        throw new Error(`Unable to receive expected bot reply ${expectedText}`);
    }
}

const selectInsufficientCheckboxes = async () => {
    const checkboxElements = await driver.findElements(By.className("rcb-checkbox-row-container"));
    await sleep(WAIT_DURATION);
    await checkboxElements[1].click();
    const nextButtonElement = await driver.findElement(By.className("rcb-checkbox-next-button"));
    await driver.wait(until.elementIsVisible(nextButtonElement), WAIT_DURATION);
    if (await nextButtonElement.isEnabled()) {
        throw new Error("Minimum checkbox selection failed: Expected 2 but only 1 provided.");
    }
}

const selectTooManyCheckboxes = async () => {
    const checkboxElements = await driver.findElements(By.className("rcb-checkbox-row-container"));
    await checkboxElements[0].click();
    await checkboxElements[2].click();
    const markElements = await driver.findElements(By.className("rcb-checkbox-mark"));
    await sleep(WAIT_DURATION);
    if (await markElements[2].getCssValue("color") !== "rgba(0, 0, 0, 0)") {
        throw new Error("Maximum checkbox selection failed: Expected 2 but 3 provided");
    }
}

const selectCorrectCheckboxes = async () => {
    const nextButtonElement = await driver.findElement(By.className("rcb-checkbox-next-button"));
    await driver.wait(until.elementIsVisible(nextButtonElement), WAIT_DURATION);
    await nextButtonElement.click();
    await sleep(WAIT_DURATION);
    await driver.switchTo().alert().accept();
    const expectedText = "What is your height (cm)?";
    await sleep(WAIT_DURATION);
    const replyElements = await driver.findElements(By.className("rcb-bot-message"));
    const isTextPresent = await replyElements[6].getText() === expectedText;
    
    if (!isTextPresent) {
        throw new Error(`Unable to receive expected bot reply ${expectedText}`);
    }
}

const sendWrongHeightAnswer = async () => {
    const textAreaElement = await driver.findElement(By.className("rcb-chat-input-textarea"));
    await driver.wait(until.elementIsVisible(textAreaElement), WAIT_DURATION);
    await textAreaElement.sendKeys("abc", Key.RETURN);
    const expectedText = "Height needs to be a number!";
    await sleep(WAIT_DURATION);
    const replyElements = await driver.findElements(By.className("rcb-bot-message"));
    const isTextPresent = await replyElements[7].getText() === expectedText;

    if (!isTextPresent) {
        throw new Error(`Unable to receive expected bot reply ${expectedText}`);
    }
}

const sendCorrectHeightAnswer = async () => {
    const textAreaElement = await driver.findElement(By.className("rcb-chat-input-textarea"));
    await driver.wait(until.elementIsVisible(textAreaElement), WAIT_DURATION);
    await textAreaElement.sendKeys("178.9", Key.RETURN);
    const expectedText = "What's my favourite color?";
    await sleep(WAIT_DURATION);
    const replyElements = await driver.findElements(By.className("rcb-bot-message"));
    const isTextPresent = (await replyElements[8].getText()).includes(expectedText);

    if (!isTextPresent) {
        throw new Error(`Unable to receive expected bot reply ${expectedText}`);
    }
}

const clickHint = async () => {
    const hintElement = await driver.findElement(By.className("secret-fav-color"));
    await driver.wait(until.elementIsVisible(hintElement), WAIT_DURATION);
    await hintElement.click();
    await driver.switchTo().alert().accept();
}

const sendEmojiColorGuess = async () => {
    const emojiPickerElement = await driver.findElement(By.className("rcb-emoji-button-enabled"));
    await driver.wait(until.elementIsVisible(emojiPickerElement), WAIT_DURATION);
    emojiPickerElement.click();
    await sleep(WAIT_DURATION);
    const emojiElements = await driver.findElements(By.className("rcb-emoji"));
    emojiElements[0].click();
    const sendElement = await driver.findElement(By.className("rcb-send-button"));
    sendElement.click();
    const expectedText = "Your answer is incorrect, try again!";
    await sleep(WAIT_DURATION);
    const replyElements = await driver.findElements(By.className("rcb-bot-message"));
    const isTextPresent = await replyElements[9].getText() === expectedText;

    if (!isTextPresent) {
        throw new Error(`Unable to receive expected bot reply ${expectedText}`);
    }
}

const sendColorGuess = async () => {
    const textAreaElement = await driver.findElement(By.className("rcb-chat-input-textarea"));
    await driver.wait(until.elementIsVisible(textAreaElement), WAIT_DURATION);
    await textAreaElement.sendKeys("black", Key.RETURN);
    await sleep(WAIT_DURATION);
    const showElement = await driver.findElement(By.className("rcb-window-close"));
    await driver.wait(until.elementIsVisible(showElement), WAIT_DURATION);
}

const reopenChatWindow = async () => {
    const buttonElement = await driver.findElement(By.className("rcb-toggle-button"));
    await buttonElement.click();
    const hideElement = await driver.findElement(By.className("rcb-window-open"));
    await driver.wait(until.elementIsVisible(hideElement), WAIT_DURATION);
    const expectedText = "I went into hiding but you found me!";
    await sleep(WAIT_DURATION);
    const replyElements = await driver.findElements(By.className("rcb-bot-message"));
    const isTextPresent = (await replyElements[10].getText()).includes(expectedText);

    if (!isTextPresent) {
        throw new Error(`Unable to receive expected bot reply ${expectedText}`);
    }
}

const sendFood = async () => {
    const textAreaElement = await driver.findElement(By.className("rcb-chat-input-textarea"));
    await driver.wait(until.elementIsVisible(textAreaElement), WAIT_DURATION);
    await textAreaElement.sendKeys("pasta", Key.RETURN);
    const expectedText = "pasta? Interesting.";
    await sleep(WAIT_DURATION);
    const replyElements = await driver.findElements(By.className("rcb-bot-message"));
    const isTextPresent = (await replyElements[11].getText()).includes(expectedText);

    if (!isTextPresent) {
        throw new Error(`Unable to receive expected bot reply ${expectedText}`);
    }
}

const sendImage = async () => {
    const attachElement = await driver.findElement(By.className("rcb-attach-input"));
    const filePath = path.resolve("./test/assets/logo.png");
    attachElement.sendKeys(filePath);
    const expectedText = "Thank you for sharing! See you again!";
    await sleep(WAIT_DURATION);
    const replyElements = await driver.findElements(By.className("rcb-bot-message"));
    const isTextPresent = (await replyElements[12].getText()).includes(expectedText);

    if (!isTextPresent) {
        throw new Error(`Unable to receive expected bot reply ${expectedText}`);
    }
}

const sendGoodbye = async () => {
    const textAreaElement = await driver.findElement(By.className("rcb-chat-input-textarea"));
    await driver.wait(until.elementIsVisible(textAreaElement), WAIT_DURATION);
    await textAreaElement.sendKeys("Goodbye!", Key.RETURN);
    const expectedText = "You have reached the end of the conversation!";
    await sleep(WAIT_DURATION);
    const replyElements = await driver.findElements(By.className("rcb-bot-message"));
    const isTextPresent = await replyElements[13].getText() === expectedText;

    if (!isTextPresent) {
        throw new Error(`Unable to receive expected bot reply ${expectedText}`);
    }
}

const toggleNotifications = async () => {
    const notificationOnElement = await driver.findElement(By.className("rcb-notification-icon-on"));
    notificationOnElement.click();
    await sleep(WAIT_DURATION);
    const notificationOffElement = await driver.findElement(By.className("rcb-notification-icon-off"));
    await driver.wait(until.elementIsVisible(notificationOffElement), WAIT_DURATION);
}

const toggleAudio = async () => {
    const audioOffElement = await driver.findElement(By.className("rcb-audio-icon-off"));
    audioOffElement.click();
    await sleep(WAIT_DURATION);
    const audioOnElement = await driver.findElement(By.className("rcb-audio-icon-on"));
    await driver.wait(until.elementIsVisible(audioOnElement), WAIT_DURATION);
}

const toggleVoice = async () => {
    const voiceOffElement = await driver.findElement(By.className("rcb-voice-button-disabled"));
    voiceOffElement.click();
    await sleep(WAIT_DURATION);
    const voiceOnElement = await driver.findElement(By.className("rcb-voice-button-enabled"));
    await driver.wait(until.elementIsVisible(voiceOnElement), WAIT_DURATION);
}

const viewHistory = async () => {
    await driver.navigate().refresh();
    await sleep(WAIT_DURATION);
    const buttonElement = await driver.findElement(By.className("rcb-toggle-button"));
    await buttonElement.click();
    const hideElement = await driver.findElement(By.className("rcb-window-open"));
    await driver.wait(until.elementIsVisible(hideElement), WAIT_DURATION);
    const viewHistoryElement = await driver.findElement(By.className("rcb-view-history-button"));
    await driver.wait(until.elementIsVisible(viewHistoryElement), WAIT_DURATION);
    await viewHistoryElement.click();
    await sleep(WAIT_DURATION);
    const replyElements = await driver.findElements(By.className("rcb-bot-message"));
    const expectedReplyCount = 14;
    if (replyElements.length != expectedReplyCount) {
        throw new Error(`Load history failed: Expected ${expectedReplyCount} ` +
            `bot messages but received ${replyElements.length}`);
    }

    const expectedSendCount = 13;
    const sendElements = await driver.findElements(By.className("rcb-user-message"));
    if (sendElements.length != expectedSendCount) {
        throw new Error(`Load history failed: Expected ${expectedSendCount} ` +
            `user messages but received ${sendElements.length}`);
    }
}

const showTestSummary = () => {
    console.log(errors);
    console.log(`Total Test Cases: ${numCases}`);
    console.log(`Total Passed: ${numCases - errors.length}`);
    console.log(`Total Failed: ${errors.length}`);
    const outcome = errors.length === 0 ? "PASSED" : "FAILED";
    console.log(`Outcome: ${outcome}`)
    if (outcome === "FAILED") {
        process.exit(1);
    }
}

run();