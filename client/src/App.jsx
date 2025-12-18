
import './App.css'
import {Route, Routes} from "react-router-dom"
import Home from "./pages/Home"
import Dashboard from "./pages/Dashboard"
import Layout from "./pages/Layout"
import WriteArticle from  './pages/WriteArticle'
import BlogTitles from "./pages/BlogTitles"
import GenrateImages from './pages/GenrateImages'
import RemoveBackground from "./pages/RemoveBackground"
import RemoveObject from "./pages/RemoveObject"
import ReviewResume from "./pages/ReviewResume"
import Community from "./pages/Community"
import Signup from './pages/Signup'
import Signin from './pages/Signin'
import {Toaster} from "react-hot-toast"
import About from './pages/About'

function App() {

  return (
    <>
    <div>
      <Toaster/>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='ai' element={<Layout/>}>
        <Route index element={<Dashboard/>}/>
        <Route path='write-article' element={<WriteArticle/>}/>
        <Route path='blog-titles' element={<BlogTitles/>}/>
        <Route path='generate-images' element={<GenrateImages/>}/>
        <Route path='remove-background' element={<RemoveBackground/>}/>
        <Route path='remove-object' element={<RemoveObject/>}/>
        <Route path='review-resume' element={<ReviewResume/>}/>
        <Route path='community' element={<Community/>}/>

        </Route>
        <Route path='/sign-up' element={<Signup/>}/>
        <Route path='/sign-in' element={<Signin/>}/>
        <Route path='/about' element={<About/>}/>
      </Routes>
    </div>
    </>
  )
}

export default App
