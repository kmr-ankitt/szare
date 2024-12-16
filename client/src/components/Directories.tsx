"use client";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Directories() {
  const [file, setFile] = useState<{ files: string[]; folders: string[] }>({
    files: [],
    folders: [],
  });
  const [currentPage, setCurrentPage] = useState(1);
  const filesPerPage = 12;
  const [ip, setIp] = useState<string>("");

  useEffect(() => {
    const hostname = document.location.hostname;
    setIp(hostname);

    fetch(`http://${hostname}:8000`)
      .then((res) => res.json())
      .then((data) => {
        const { files, folders } = data;
        setFile({ files: files, folders: folders });
      });
  }, []);

  const indexOfLastFile = currentPage * filesPerPage;
  const indexOfFirstFile = indexOfLastFile - filesPerPage;
  const filesPlusFolders = file.folders.concat(file.files);

  const sendPostRequest = (name: string) => {
    fetch(`http://${ip}:8000/api/download/?file=${name}`, {
      method: "POST",
    }).catch((error) => console.error(error));
  };

  const downloadFile = (index: number) => {
    const fileName = filesPlusFolders[index];
    fetch(`http://${ip}:8000/api/download/?file=${fileName}`, {
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
        a.download = fileName;
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
      {filesPlusFolders.map((name, index) => (
        <div
          key={index}
          className="grid grid-cols-6 border-b-2 gap-2 border-b-lemon p-2 text-lemon"
        >
          <div className="col-span-1">{indexOfFirstFile + index + 1}.</div>

          <div
            className="col-span-4 flex items-center gap-2 cursor-pointer"
            onClick={() => sendPostRequest(name)}
          >
            {index > file.folders.length - 1 ? (
              <Image
                src="file.svg"
                className="mb-[.3rem]"
                height={25}
                width={25}
                alt="file-icon"
              />
            ) : (
              <Image
                src="folder.svg"
                className="mb-[.3rem]"
                height={25}
                width={25}
                alt="folder-icon"
              />
            )}
            {name}
          </div>
          {index >= file.folders.length && (
            <div className="col-span-1">
              <button onClick={() => downloadFile(indexOfFirstFile + index)}>
                <Image
                  src="download.svg"
                  className="mt-[.2rem]"
                  height={25}
                  width={25}
                  alt="folder-icon"
                />
              </button>
            </div>
          )}
        </div>
      ))}
      {file.files.length > filesPerPage && (
        <div className="flex justify-center mt-4 text-darkblue font-bold">
          {Array.from(
            { length: Math.ceil(file.files.length / filesPerPage) },
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
