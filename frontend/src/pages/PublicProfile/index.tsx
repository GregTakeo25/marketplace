import { Navigate, useParams } from "react-router-dom";
import { Toaster } from "src/components/Toaster";
import Tooltip from "src/components/Tooltip";
import Header from "./Header";
import Footer from "./Footer";
import Profile from "./Profile";
import useUserProfile from "src/hooks/useContributorProfilePanel/ContributorProfileSidePanel/useUserProfile";
import { RoutePaths } from "src/App";

const PublicProfilePage = () => {
  const { userLogin } = useParams();
  const { data: userProfile, loading } = useUserProfile({ githubUserLogin: userLogin });

  return loading ? (
    <></>
  ) : userProfile && userLogin ? (
    <>
      <div className="lg:h-screen lg:w-screen bg-public-profile">
        <div className="h-full flex flex-col justify-between md:px-4 md:container mx-auto lg:max-5xl xl:max-6xl 2xl:max-w-7xl">
          <Header userLogin={userLogin} />
          <Profile userProfile={userProfile} />
          <Footer />
        </div>
      </div>
      <Toaster />
      <Tooltip />
    </>
  ) : (
    <Navigate to={RoutePaths.Home} />
  );
};

export default PublicProfilePage;