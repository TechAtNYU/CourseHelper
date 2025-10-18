import { SignInButton, UserButton } from "@clerk/chrome-extension";
import { Authenticated, Unauthenticated } from "convex/react";
import ConvexWithClerkProvider from "~components/ConvexWithClerkProvider";

import "~style.css";

function IndexPopup() {
  return (
    <ConvexWithClerkProvider>
      <div className="plasmo-flex plasmo-items-center plasmo-justify-center plasmo-h-16 plasmo-w-40">
        <Unauthenticated>
          <SignInButton mode="modal" />
        </Unauthenticated>
        <Authenticated>
          <UserButton />
        </Authenticated>
      </div>
    </ConvexWithClerkProvider>
  );
}

export default IndexPopup;
