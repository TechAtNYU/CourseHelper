import { ClerkProvider, useAuth } from "@clerk/chrome-extension";
import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";

const PUBLISHABLE_KEY = process.env
  .PLASMO_PUBLIC_CLERK_PUBLISHABLE_KEY as string;
const EXTENSION_URL = chrome.runtime.getURL(".");

const convex = new ConvexReactClient(
  process.env.PLASMO_PUBLIC_CONVEX_URL as string,
);

const ConvexWithClerkProvider = ({ children }) => {
  return (
    <ClerkProvider
      publishableKey={PUBLISHABLE_KEY}
      afterSignOutUrl={`${EXTENSION_URL}/popup.html`}
      signInFallbackRedirectUrl={`${EXTENSION_URL}/popup.html`}
      signUpFallbackRedirectUrl={`${EXTENSION_URL}/popup.html`}
    >
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        {children}
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
};

export default ConvexWithClerkProvider;
