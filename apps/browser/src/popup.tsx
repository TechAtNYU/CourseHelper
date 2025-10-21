import { Authenticated, Unauthenticated } from "convex/react";
import ConvexWithClerkProvider from "~components/ConvexWithClerkProvider";
import SignIn from "~components/SignIn";

import "~style.css";

function IndexPopup() {
  return (
    <ConvexWithClerkProvider>
      <div className="plasmo-flex plasmo-items-center plasmo-justify-center plasmo-h-16 plasmo-w-40">
        <Unauthenticated>
          <SignIn />
        </Unauthenticated>
        <Authenticated>
          <p>test</p>
        </Authenticated>
      </div>
    </ConvexWithClerkProvider>
  );
}

export default IndexPopup;
