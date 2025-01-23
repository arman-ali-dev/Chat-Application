import { Aside } from "../components/Aside";
import { ChatWindow } from "../components/ChatWindow";
import { Header } from "../components/Header";
import useGetAllUsers from "../hooks/useGetAllUsers";
import useGetAllLatestMessages from "../hooks/useGetAllLatestMessages";

const Home = () => {
  useGetAllUsers();
  useGetAllLatestMessages();

  return (
    <>
      <Header />
      <div className="lg:flex justify-between p-3">
        <Aside />
        <ChatWindow />
      </div>
    </>
  );
};

export default Home;
