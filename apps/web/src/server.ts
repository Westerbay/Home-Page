import { paraglideMiddleware } from "@workspace/i18n/server"
import handler from "@tanstack/react-start/server-entry"

export default {
  fetch(request: Request): Promise<Response> {
    return paraglideMiddleware(request, () => handler.fetch(request))
  },
}
