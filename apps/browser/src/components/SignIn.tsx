const SignIn = () => {
  const handleSignIn = () => {
    chrome.tabs.create({
      url: `${process.env.PLASMO_PUBLIC_CLERK_SYNC_HOST}/signin`,
    });
  };
  return (
    <button type="button" onClick={handleSignIn}>
      Sign in
    </button>
  );
};

export default SignIn;
