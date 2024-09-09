/**
 * Defines the available attributes for a toast.
 */
export type Toast = {
    id: string;
    content: string | JSX.Element;
    timeout?: number;
}