import Image from "next/image";
import SignInViewPage from "./(auth)/_components/_signin-view";

export default function Home() {
  return (
    <div>
      {/* <h1 className="text-3xl font-bold underline">Welcome to User Dashboard</h1> */}
      <SignInViewPage />
    </div>
  );
}
