import { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

export default function EditPost() {
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [file, setFile] = useState(null);
  const [redirect, setRedirect] = useState(false);
  
  const modules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
      ],
      ["link", "image"],
      ["clean"],
    ],
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
  ];

  useEffect(() => {
    async function fetchPost() {
      const response = await fetch("http://localhost:4000/post/" + id);
      const postInfo = await response.json();
      setTitle(postInfo.title);
      setContent(postInfo.content);
      setSummary(postInfo.summary);
    }
    fetchPost();
  }, [id]);

  async function updatePost(ev) {
    ev.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("summary", summary);
    formData.append("content", content);
    formData.set("id",id);
    if (file) {
      formData.append("file", file);
    }
    
    const response = await fetch(`http://localhost:4000/post/${id}`, {
      method: "PUT",
      body: formData,
      credentials:'include',
    });
    
    if (response.ok) {
      setRedirect(true);
    }
  }

  if (redirect) {
    return <Navigate to={"/post/"+id} />;
  }

  return (
    <form onSubmit={updatePost}>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(ev) => setTitle(ev.target.value)}
      />
      <input
        type="text"
        placeholder="Summary"
        value={summary}
        onChange={(ev) => setSummary(ev.target.value)}
      />
      <input type="file" onChange={(ev) => setFile(ev.target.files[0])} />
      <ReactQuill
        value={content}
        modules={modules}
        formats={formats}
        onChange={(newVal) => setContent(newVal)}
      />
      <button style={{ marginTop: "5px" }}>Update Post</button>
    </form>
  );
}
