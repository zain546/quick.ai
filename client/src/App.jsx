import React, { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import {
  Home,
  Layout,
  Dashboard,
  WriteArticle,
  BlogTitles,
  RemoveObject,
  GenerateImages,
  RemoveBackground,
  ReviewResume,
  Community,
} from "./pages";
import { useAuth } from "@clerk/clerk-react";

const App = () => {
  const { getToken } = useAuth();
  useEffect(() => {
    getToken().then((token) => {
      console.log('token', token);
    });
  }, []);

  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/ai" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="write-article" element={<WriteArticle />} />
          <Route path="blog-titles" element={<BlogTitles />} />
          <Route path="remove-object" element={<RemoveObject />} />
          <Route path="generate-images" element={<GenerateImages />} />
          <Route path="remove-background" element={<RemoveBackground />} />
          <Route path="review-resume" element={<ReviewResume />} />
          <Route path="community" element={<Community />} />
        </Route>
      </Routes>
    </div>
  );
};

export default App;
