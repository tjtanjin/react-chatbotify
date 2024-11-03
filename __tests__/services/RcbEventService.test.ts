import { emitRcbEvent } from '../../src/services/RcbEventService';
import { EventDetail } from '../../src/types/internal/events/EventDetail';
import { RcbBaseEvent } from '../../src/types/internal/events/RcbBaseEvent';
import { RcbEvent } from '../../src/constants/RcbEvent';

describe('emitRcbEvent', () => {
    // Variable to hold the dispatched event in tests
    let dispatchedEvent: RcbBaseEvent | null;

    // Reset the dispatched event and mock dispatchEvent before each test
    beforeEach(() => {
        dispatchedEvent = null;

        window.dispatchEvent = jest.fn((event) => {
            dispatchedEvent = event as RcbBaseEvent; 
            return true; 
        });
    });

    // Clear all mocks after each test to prevent interference between tests
    afterEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    // Test for emitting a cancellable event
    it('should emit a cancellable event and return the event', async () => {
        const eventName = RcbEvent.TOGGLE_AUDIO;
        const eventDetail: EventDetail = { 
            botId: 'testBotId', 
            currPath: 'testCurrentPath', 
            prevPath: 'testPreviousPath' 
        };
        const data = { someData: 'testData' };

        // Call emitRcbEvent and capture the result
        const result = await emitRcbEvent(eventName, eventDetail, data);

        // Verify that the event was dispatched correctly
        if (dispatchedEvent) {
            expect(dispatchedEvent.type).toBe(eventName);
            expect(dispatchedEvent.detail).toEqual(eventDetail);
            expect(dispatchedEvent.cancelable).toBe(true);
            expect((dispatchedEvent as RcbBaseEvent).data).toEqual(data);
            expect(result).toBe(dispatchedEvent);
        } else {
            fail('No event was dispatched');
        }
    });

    // Test for emitting a non-cancellable event
    it('should emit a non-cancellable event and return the event', async () => {
        const eventName = RcbEvent.POST_INJECT_MESSAGE;
        const eventDetail: EventDetail = { 
            botId: 'testBotId', 
            currPath: 'testCurrentPath', 
            prevPath: 'testPreviousPath' 
        };
        const data = { someData: 'testData' };

        const result = await emitRcbEvent(eventName, eventDetail, data);

        // Verify that the event was dispatched as non-cancellable
        if (dispatchedEvent) {
            expect(dispatchedEvent.type).toBe(eventName);
            expect(dispatchedEvent.detail).toEqual(eventDetail);
            expect(dispatchedEvent.cancelable).toBe(false);
            expect((dispatchedEvent as RcbBaseEvent).data).toEqual(data);
            expect(result).toBe(dispatchedEvent);
        } else {
            fail('No event was dispatched');
        }
    });

    // Test for handling an event with empty data
    it('should handle an event with empty data', async () => {
        const eventName = RcbEvent.TOGGLE_VOICE;
        const eventDetail: EventDetail = { 
            botId: 'testBotId', 
            currPath: 'testCurrentPath', 
            prevPath: 'testPreviousPath' 
        };

        const result = await emitRcbEvent(eventName, eventDetail, {});

        // Verify the event was dispatched with empty data
        if (dispatchedEvent) {
            expect(dispatchedEvent.type).toBe(eventName);
            expect(dispatchedEvent.detail).toEqual(eventDetail);
            expect((dispatchedEvent as RcbBaseEvent).data).toEqual({});
            expect(result).toBe(dispatchedEvent);
        } else {
            fail('No event was dispatched');
        }
    });

    // Test for handling an event with no detail and empty data
    it('should handle an event with no detail and data', async () => {
        const eventName = RcbEvent.CHANGE_PATH;

        const result = await emitRcbEvent(eventName, { 
            botId: null, 
            currPath: null, 
            prevPath: null 
        }, {});

        // Verify the event was dispatched with null details and empty data
        if (dispatchedEvent) {
            expect(dispatchedEvent.type).toBe(eventName);
            expect(dispatchedEvent.detail).toEqual({ 
                botId: null, 
                currPath: null, 
                prevPath: null 
            });
            expect((dispatchedEvent as RcbBaseEvent).data).toEqual({});
            expect(result).toBe(dispatchedEvent);
        } else {
            fail('No event was dispatched');
        }
    });
});
