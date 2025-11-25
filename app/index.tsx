import Launch from "@/components/screens/launch/launch";
import Home from "@/components/screens/main/home";
import { useLaunchStore } from "@/store/use-launch.store";
import SignIn from "./sign-in/page";




export default function Index() {

const { index } = useLaunchStore();

  return (
    <>
    {index === 0 && <Launch />}
    {index === 1 && <SignIn />}
    {index === 2 && <Home/>}
    </>
  );
}
