"use client";
import { useEffect, useState } from "react";

export default function Directories() {
  const [files, setFiles] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const filesPerPage = 12;
  const [ip, setIp] = useState<string>("");

  useEffect(() => {
    // Access the document object inside useEffect to ensure it runs on the client side
    const hostname = document.location.hostname;
    setIp(hostname);

    fetch(`http://${hostname}:8000`)
      .then((res) => res.json())
      .then((data) => {
        setFiles(data);
      });
  }, []);

  const indexOfLastFile = currentPage * filesPerPage;
  const indexOfFirstFile = indexOfLastFile - filesPerPage;
  const currentFiles = files.slice(indexOfFirstFile, indexOfLastFile);

  const downloadFile = (index: number) => {
    fetch(`http://${ip}:8000/api/download/${index}`, {
      method: "POST",
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to download file");
        }
        return res.blob();
      })
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = files[index]; // Use the file name from the list
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
      })
      .catch((error) => console.error(error));
  };

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="h-full p-10 flex flex-col gap-2">
      {currentFiles.map((file, index) => (
        <div
          key={index}
          className="grid grid-cols-6 border-b-2 gap-2 border-b-lemon p-2 text-lemon"
        >
          <div className="col-span-1">{indexOfFirstFile + index + 1}.</div>
          <div className="col-span-4">{file}</div>
          <div className="col-span-1">
            <button onClick={() => downloadFile(indexOfFirstFile + index)}>
              <svg
                width="1.5rem"
                height="1.2rem"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M5.25589 16C3.8899 15.0291 3 13.4422 3 11.6493C3 9.20008 4.8 6.9375 7.5 6.5C8.34694 4.48637 10.3514 3 12.6893 3C15.684 3 18.1317 5.32251 18.3 8.25C19.8893 8.94488 21 10.6503 21 12.4969C21 14.0582 20.206 15.4339 19 16.2417M12 21V11M12 21L9 18M12 21L15 18"
                  stroke="#e6ff94"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>
      ))}
      {files.length > filesPerPage && (
        <div className="flex justify-center mt-4 text-darkblue font-bold">
          {Array.from(
            { length: Math.ceil(files.length / filesPerPage) },
            (_, i) => (
              <button
                key={i}
                onClick={() => paginate(i + 1)}
                className={`px-4 py-2 mx-1 ${
                  currentPage === i + 1 ? "bg-lemon" : "bg-gray-200"
                }`}
              >
                {i + 1}
              </button>
            )
          )}
        </div>
      )}
    </div>
  );
}