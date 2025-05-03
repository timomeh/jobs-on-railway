import 'server-only'

import {
  createSafeActionClient,
  DEFAULT_SERVER_ERROR_MESSAGE,
} from 'next-safe-action'

/**
 * Used to create an error which can be safely passed to the UI.
 * Usage:
 * ```ts
 * actionClient.action(async () => {
 *   throw new ActionError('This message will be accessible in the UI as serverError')
 * })
 * ```
 */
export class ActionError extends Error {}

/**
 * Instance of next-safe-action. Used for safer server actions.
 * @see https://next-safe-action.dev/docs/getting-started#usage
 */
export const actionClient = createSafeActionClient({
  handleServerError(e, utils) {
    if (e instanceof ActionError) {
      return e.message
    }

    // For unexpected errors, do some debug logging and return the default message
    // to not leak any internals to the client
    const { clientInput, bindArgsClientInputs, metadata } = utils
    console.warn('Server action failed:', e, {
      clientInput,
      bindArgsClientInputs,
      metadata,
    })

    return DEFAULT_SERVER_ERROR_MESSAGE
  },
  defaultValidationErrorsShape: 'flattened',
})
