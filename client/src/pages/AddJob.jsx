import React, { useState, useRef, useEffect ,useContext} from "react";
import Quill from "quill";
import { JobCategories, JobLocations } from "../assets/assets";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";



const AddJob = () => {
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("Bangalore");
  const [category, setCategory] = useState("Programming");
  const [level, setLevel] = useState("Beginner Level");
  const [salary, setSalary] = useState(0);
  const editorRef = useRef(null);
  const quillRef = useRef(null);
  const {backendUrl,companyToken} = useContext(AppContext);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try{
      const description = quillRef.current.root.innerHTML;
      const {data}=await axios.post(`${backendUrl}/api/company/post-job`,{
        title,
        description,
        location,
        category,
        level,
        salary
      },{headers:{token:companyToken}});

      if(data.success){
        toast.success(data.message);
        setTitle("");
        setSalary(0);
        quillRef.current.root.innerHTML="";
      }
      else{
        toast.error(data.message);
      }

    }
    catch(error){
      console.error(error);
      alert(error.message);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (!quillRef.current && editorRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: "snow",
        modules: {
          toolbar: [
            [{ header: [1, 2, false] }],
            ["bold", "italic", "underline"],
            ["image", "code-block"],
            ["clean"],
          ],
        },
        placeholder: "Type here...",
      });
    }
  }, []);

  return (
    <form onSubmit={onSubmitHandler} className="container p-4 flex flex-col w-full items-start gap-3">
      <div className="w-full">
      <label className="mb-2 block">Job Title</label>
      <input
        className="w-full max-w-lg px-3 py-2 border-2 border-gray-300 rounded"
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Type here"
        required
      />
    </div>
      <div className="w-full max-w-lg">
        <p className="my-2">Job Description</p>
        <div>
          <div ref={editorRef} className="border h-96"></div>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row gap-2 w-full sm:gap-8">
        <div>
          <p className="mb-2">Job Category</p>
          <select
            className="w-full px-3 py-2 border-2 border-gray-300 rounded"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            {JobCategories.map((category, index) => (
              <option key={index} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
        <div>
          <p className="mb-2">Job Location</p>
          <select
            className="w-full px-3 py-2 border-2 border-gray-300 rounded"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          >
            {JobLocations.map((location, index) => (
              <option key={index} value={location}>
                {location}
              </option>
            ))}
          </select>
        </div>
        <div>
          <p className="mb-2">Job Level</p>
          <select
            className="w-full px-3 py-2 border-2 border-gray-300 rounded"
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            required
          >
            <option value="Beginner level">Beginner level</option>
            <option value="Intermediate level">Intermediate level</option>
            <option value="Senior level">Senior level</option>
          </select>
        </div>
      </div>
      <div>
        <p>Job Salary</p>
        <input
          min={0}
          className="w-full px-3 py-2 border-2 border-gray-300 rounded sm:w-[120px]"
          type="Number"
          placeholder="2500"
          onChange={(e) => setSalary(e.target.value)}
            value={salary}
        />
      </div>
      <button className="w-28 p-3 mt-4 bg-black text-white rounded">ADD</button>
    </form>
  );
};

export default AddJob;
