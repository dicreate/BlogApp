import { BrowserRouter, Routes, Route } from "react-router-dom"
import { About, Dashboard, Home, Projects, SignIn, SignUp, CreatePost, UpdatePost, PostPage } from "./pages"
import { Header, Footer, PrivateRoute, OnlyAdminRoute } from "./components"
function App() {

  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
        <Route element={<OnlyAdminRoute />}>
          <Route path="/create-post" element={<CreatePost />} />
        </Route>
        <Route element={<OnlyAdminRoute />}>
          <Route path="/update-post/:postId" element={<UpdatePost />} />
        </Route>
        <Route path="/projects" element={<Projects />} />
        <Route path="/post/:postSlug" element={<PostPage />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  )
}

export default App
