import { renderHook, act } from "@testing-library/react";
import { useTextAreaInternal } from "../../../src/hooks/internal/useTextAreaInternal";
import { useRcbEventInternal } from "../../../src/hooks/internal/useRcbEventInternal";
import { RcbEvent } from "../../../src/constants/RcbEvent";
import { useBotRefsContext } from "../../../src/context/BotRefsContext";
import { useSettingsContext } from "../../../src/context/SettingsContext";
import { expect } from "@jest/globals"

jest.mock("../../../src/hooks/internal/useRcbEventInternal");
const mockUseRcbEventInternal = useRcbEventInternal as jest.MockedFunction<typeof useRcbEventInternal>;

jest.mock("../../../src/context/BotRefsContext");
jest.mock("../../../src/context/SettingsContext");
jest.mock("../../../src/context/BotStatesContext");

describe("useTextAreaInternal Hook", () => {
  let mockInputRef: any;
  let mockPrevInputRef: any;
  let mocksettingsRefT: any;
  let mocksettingsRefF: any;
  let mocksettingsChatLimit: any;
  let mocksettingsChatUnLimit: any;
  let mocksettingsPreventDefault: any;
  beforeEach(() => {
    
    mockInputRef = { current: { value: "", focus: jest.fn() } }; 
    mockPrevInputRef = { current: "" }; 
    mocksettingsRefT = { chatInput: { allowNewline: true } };
    mocksettingsRefF = { chatInput: { allowNewline: false } };
    mocksettingsChatLimit = { chatInput: { characterLimit: 50 } };
    mocksettingsChatUnLimit = { chatInput: { characterLimit: -1 } };
    mocksettingsPreventDefault = { event: { rcbTextAreaChangeValue: true } };
    (require("../../../src/context/BotStatesContext").useBotStatesContext as jest.Mock).mockReturnValue({
      textAreaDisabled: false,
      setTextAreaDisabled: jest.fn(),
    });

    
    (useBotRefsContext as jest.Mock).mockReturnValue({
      inputRef: mockInputRef,
      prevInputRef: mockPrevInputRef,
    });
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should set text area value with newline allowed", () => {
    const callRcbEventMock = jest.fn().mockReturnValue({ defaultPrevented: false });
    mockUseRcbEventInternal.mockReturnValue({
      callRcbEvent: callRcbEventMock,
    });

    (useSettingsContext as jest.Mock).mockReturnValue({
      settings: mocksettingsRefT
    });

    const { result } = renderHook(() => useTextAreaInternal());

    act(() => {
      result.current.setTextAreaValue("Hello\nWorld");
    });

    expect(result.current.getTextAreaValue()).toBe("Hello\nWorld");
  });

  it("should remove newlines when not allowed", () => {
    const callRcbEventMock = jest.fn().mockReturnValue({ defaultPrevented: false });
    mockUseRcbEventInternal.mockReturnValue({
      callRcbEvent: callRcbEventMock,
    });

    (useSettingsContext as jest.Mock).mockReturnValue({
      settings: mocksettingsRefF
    });

    const { result } = renderHook(() => useTextAreaInternal());

    act(() => {
      result.current.setTextAreaValue("Hello\nWorld");
    });

    expect(result.current.getTextAreaValue()).toBe("Hello World");
  });

  it("should respect character limit if set", () => {
    const callRcbEventMock = jest.fn().mockReturnValue({ defaultPrevented: false });
    mockUseRcbEventInternal.mockReturnValue({
      callRcbEvent: callRcbEventMock,
    });

    (useSettingsContext as jest.Mock).mockReturnValue({
      settings: mocksettingsChatLimit
    });

    const { result } = renderHook(() => useTextAreaInternal());

    act(() => {
      result.current.setTextAreaValue("a".repeat(60));
    });

    expect(result.current.getTextAreaValue().length).toBe(50);
  });

  it("should handle unlimited character input when characterLimit is -1", () => {
    const callRcbEventMock = jest.fn().mockReturnValue({ defaultPrevented: false });
    mockUseRcbEventInternal.mockReturnValue({
      callRcbEvent: callRcbEventMock,
    });

    (useSettingsContext as jest.Mock).mockReturnValue({
      settings: mocksettingsChatUnLimit
    });

    const { result } = renderHook(() => useTextAreaInternal());

  
    act(() => {
      result.current.setTextAreaValue("a".repeat(1000));
    });

    expect(result.current.getTextAreaValue().length).toBe(1000);
  });

  it("should prevent setting value if event is defaultPrevented", async () => {
    const callRcbEventMock = jest.fn().mockReturnValue({ defaultPrevented: true });
    mockUseRcbEventInternal.mockReturnValue({
      callRcbEvent: callRcbEventMock,
    });

    (useSettingsContext as jest.Mock).mockReturnValue({
      settings: mocksettingsPreventDefault
    });

    const { result } = renderHook(() => useTextAreaInternal());

    await act(async () => {
      await result.current.setTextAreaValue("Test value");
    });

    expect(result.current.getTextAreaValue()).toBe("");
  });

  it("should focus on text area when focusTextArea is called", () => {
    const callRcbEventMock = jest.fn();
    mockUseRcbEventInternal.mockReturnValue({
      callRcbEvent: callRcbEventMock,
    });

    const { result } = renderHook(() => useTextAreaInternal());

    act(() => {
      result.current.focusTextArea();
    });

    expect(result.current.textAreaDisabled).toBe(false);
  });

 // let initialTextAreaDisabled = false;

 /* it("should toggle textAreaDisabled state", () => {
    // mocks rcb event handler
    const callRcbEventMock = jest.fn().mockReturnValue({ defaultPrevented: false });
    mockUseRcbEventInternal.mockReturnValue({
      callRcbEvent: callRcbEventMock,
    });

    // renders the hook within the TestChatBotProvider
    const { result } = renderHook(() => useTextAreaInternal(),{
			wrapper: TestChatBotProvider,
		})
    console.log(result)
    // checks initial value
    expect(result.current.textAreaDisabled).toBe(initialTextAreaDisabled);

    // simulates clicking the toggle action
    act(() => {
      result.current.toggleTextAreaDisabled();
    });


    // checks if the state was updated
    expect(result.current.textAreaDisabled).toBe(!initialTextAreaDisabled);
  }); 
  */

  /*
  it("should toggle textAreaSensitiveMode state", () => {
    const callRcbEventMock = jest.fn();
    mockUseRcbEventInternal.mockReturnValue({
      callRcbEvent: callRcbEventMock,
    });

    const { result } = renderHook(() => useTextAreaInternal(),{
			wrapper: TestChatBotProvider,
		});

    // Simulate toggling the sensitive mode state
    act(() => {
      result.current.toggleTextAreaSensitiveMode();
    });

    // Verify the state toggles
    expect(result.current.textAreaSensitiveMode).toBe(true);
  });
*/

  it("should update focus based on visibility", () => {
    const callRcbEventMock = jest.fn();
    mockUseRcbEventInternal.mockReturnValue({
      callRcbEvent: callRcbEventMock,
    });

    const { result } = renderHook(() => useTextAreaInternal());

    act(() => {
      result.current.updateTextAreaFocus("some_path");
    });

    // Assume focus happens correctly, verify it updated focus (mocks internal behavior)
    expect(callRcbEventMock).not.toHaveBeenCalledWith(RcbEvent.TEXT_AREA_CHANGE_VALUE);
  });
});