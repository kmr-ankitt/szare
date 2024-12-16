"use client";
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
  // const currentFiles = file.files.slice(indexOfFirstFile, indexOfLastFile);
  const filesPlusFolders = file.folders.concat(file.files);
  console.log(filesPlusFolders);

  const downloadFile = (index: number) => {
    fetch(`http://${ip}:8000/api/download/?file=${filesPlusFolders[index]}`, {
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
        a.download = file.files[file.folders.length + index]; // Use the file name from the list
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
      {filesPlusFolders.map((file, index) => (
        <div
          key={index}
          className="grid grid-cols-6 border-b-2 gap-2 border-b-lemon p-2 text-lemon"
        >
          <div className="col-span-1">{indexOfFirstFile + index + 1}.</div>

          <div className="col-span-4 flex items-center gap-2">
            {" "}
            <svg
              className="folder-icon"
              version="1.1"
              id="Layer_1"
              height="1.5rem"
              width="1.5rem"
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
              viewBox="0 0 512 512"
              xmlSpace="preserve"
            >
              <path
                id="SVGCleanerId_0"
                style={{ fill: "#FFC36E" }}
                d="M183.295,123.586H55.05c-6.687,0-12.801-3.778-15.791-9.76l-12.776-25.55
  l12.776-25.55c2.99-5.982,9.103-9.76,15.791-9.76h128.246c6.687,0,12.801,3.778,15.791,9.76l12.775,25.55l-12.776,25.55
  C196.096,119.808,189.983,123.586,183.295,123.586z"
              />
              <g>
                <path
                  id="SVGCleanerId_0_1_"
                  style={{ fill: "#FFC36E" }}
                  d="M183.295,123.586H55.05c-6.687,0-12.801-3.778-15.791-9.76l-12.776-25.55
    l12.776-25.55c2.99-5.982,9.103-9.76,15.791-9.76h128.246c6.687,0,12.801,3.778,15.791,9.76l12.775,25.55l-12.776,25.55
    C196.096,119.808,189.983,123.586,183.295,123.586z"
                />
              </g>
              <path
                style={{ fill: "#EFF2FA" }}
                d="M485.517,70.621H26.483c-4.875,0-8.828,3.953-8.828,8.828v44.138h476.69V79.448
  C494.345,74.573,490.392,70.621,485.517,70.621z"
              />
              <rect
                x="17.655"
                y="105.931"
                style={{ fill: "#E1E6F2" }}
                width="476.69"
                height="17.655"
              />
              <path
                style={{ fill: "#FFD782" }}
                d="M494.345,88.276H217.318c-3.343,0-6.4,1.889-7.895,4.879l-10.336,20.671
  c-2.99,5.982-9.105,9.76-15.791,9.76H55.05c-6.687,0-12.801-3.778-15.791-9.76L28.922,93.155c-1.495-2.99-4.552-4.879-7.895-4.879
  h-3.372C7.904,88.276,0,96.18,0,105.931v335.448c0,9.751,7.904,17.655,17.655,17.655h476.69c9.751,0,17.655-7.904,17.655-17.655
  V105.931C512,96.18,504.096,88.276,494.345,88.276z"
              />
              <path
                style={{ fill: "#FFC36E" }}
                d="M485.517,441.379H26.483c-4.875,0-8.828-3.953-8.828-8.828l0,0c0-4.875,3.953-8.828,8.828-8.828
  h459.034c4.875,0,8.828,3.953,8.828,8.828l0,0C494.345,437.427,490.392,441.379,485.517,441.379z"
              />
              <path
                style={{ fill: "#EFF2FA" }}
                d="M326.621,220.69h132.414c4.875,0,8.828-3.953,8.828-8.828v-70.621c0-4.875-3.953-8.828-8.828-8.828
  H326.621c-4.875,0-8.828,3.953-8.828,8.828v70.621C317.793,216.737,321.746,220.69,326.621,220.69z"
              />
              <path
                style={{ fill: "#C7CFE2" }}
                d="M441.379,167.724h-97.103c-4.875,0-8.828-3.953-8.828-8.828l0,0c0-4.875,3.953-8.828,8.828-8.828
  h97.103c4.875,0,8.828,3.953,8.828,8.828l0,0C450.207,163.772,446.254,167.724,441.379,167.724z"
              />
              <path
                style={{ fill: "#D7DEED" }}
                d="M441.379,203.034h-97.103c-4.875,0-8.828-3.953-8.828-8.828l0,0c0-4.875,3.953-8.828,8.828-8.828
  h97.103c4.875,0,8.828,3.953,8.828,8.828l0,0C450.207,199.082,446.254,203.034,441.379,203.034z"
              />
            </svg>{" "}


            {file}
          </div>
          <div className="col-span-1">
            <button onClick={() => downloadFile(indexOfFirstFile + index)}>
              <svg
                width="1.5rem"
                height="1.2rem"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="upload-icon"
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
