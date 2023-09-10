import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import styled from "@emotion/styled";
import { io } from "socket.io-client";
import { useParams } from "react-router-dom";

const Component = styled.div`
  background: #f5f5f5;
`;

// quill editor options

const toolbarOptions = [
  ["bold", "italic", "underline", "strike"], // toggled buttons
  ["blockquote", "code-block"],
  ["image", "video"], // Add the 'image' option

  [{ header: 1 }, { header: 2 }], // custom button values
  [{ list: "ordered" }, { list: "bullet" }],
  [{ script: "sub" }, { script: "super" }], // superscript/subscript
  [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
  [{ direction: "rtl" }], // text direction

  [{ size: ["small", false, "large", "huge"] }], // custom dropdown
  [{ header: [1, 2, 3, 4, 5, 6, false] }],

  [{ color: [] }, { background: [] }], // dropdown with defaults from theme
  [{ font: [] }],
  [{ align: [] }],

  ["clean"], // remove formatting button
];

const Editor = () => {
  const [socket, setSocket] = useState();
  const [quill, setquill] = useState();
  const { id } = useParams();
  useEffect(() => {
    const quillServer = new Quill("#container", {
      theme: "snow",
      modules: { toolbar: toolbarOptions },
    });
    quillServer.disable(); //if you try to write something in  editor, it will not write
    quillServer.setText("Loading the documents..."); //by default it will set the text as given(Loading the documents...) in editor
    setquill(quillServer);
  }, []);

  useEffect(() => {
    const socketServer = io("https://google-docs-clone-epv4.onrender.com"); //  Settig up  connection to the server
    setSocket(socketServer); //store socketServer in state variable

    return () => {
      socketServer.disconnect(); // Cleanup function: Disconnect the socket server when the page is no longer in use.
    };
  }, []);
  //   sending data to the server
  useEffect(() => {
    if (socket === null || quill === null) return;

    const handleChange = (delta, oldData, source) => {
      if (source !== "user") return;
      socket && socket.emit("send-Changes", delta);
    };

    quill && quill.on("text-change", handleChange);

    return () => {
      quill && quill.off("text-change", handleChange);
    };
  }, [quill, socket]);

  //   listening or receiving  data from the server
  useEffect(() => {
    if (socket === null || quill === null) return;

    // func for handling changes n every keystroke
    const handleChange = (delta) => {
      quill.updateContents(delta);
    };

    //  listening or receiving data from the server
    socket && socket.on("received-changes", handleChange);

    //    cleanup function
    return () => {
      socket && socket.off("received-changes", handleChange);
    };
  }, [quill, socket]);

  useEffect(() => {
    if (quill === null || socket === null) return;

    socket &&
      socket.once("load-document", (document) => {
        quill && quill.setContents(document);
        quill && quill.enable();
      });

    socket && socket.emit("get-document", id);
    console.log("Client: get-document event emitted");
  }, [quill, socket, id]);

  // save the Documents
  useEffect(() => {
    if (socket === null || quill === null) return;
    const interval = setInterval(() => {
      socket && socket.emit("save-document", quill.getContents());
    }, 2000);

    return () => {
      clearInterval(interval);
    };
  }, [quill, socket]);

  return (
    <>
      <Component>
        <Box id="container" className="container">
          quill text{" "}
        </Box>
      </Component>
    </>
  );
};

export default Editor;
