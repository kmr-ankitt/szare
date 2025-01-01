"use client";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Directories() {
  const [file, setFile] = useState<{ files: string[]; folders: string[] }>({
    files: [],
    folders: [],
  });
  const [currentPage, setCurrentPage] = useState(1);
  const filesPerPage = 10;
  const [ip, setIp] = useState<string>("");

  const [downloadProgress, setDownloadProgress] = useState<{[key: string]: number}>({});
  const [activeDownloads, setActiveDownloads] = useState<{[key: string]: boolean}>({});
  const [downloadErrors, setDownloadErrors] = useState<{[key: string]: string}>({});
  const {toast} = useToast();

  const fetchFiles = () =>{
    const hostname = document.location.hostname;
    setIp(hostname);

    fetch(`http://${hostname}:3003`)
      .then((res) => res.json())
      .then((data) => {
        const { files, folders } = data;
        setFile({ files: files, folders: folders });
      });
    }
    
    useEffect(() => {
      fetchFiles();
    }, []);

  const indexOfLastFile = currentPage * filesPerPage;
  const indexOfFirstFile = indexOfLastFile - filesPerPage;
  const filesPlusFolders = file.folders.concat(file.files || [])
  const currentFilesPlusFolders = filesPlusFolders.slice(indexOfFirstFile, indexOfLastFile);
  currentFilesPlusFolders.sort((a, b) => {
    if (file.folders.includes(a) && !file.folders.includes(b)) {
      return -1;
    } else if (!file.folders.includes(a) && file.folders.includes(b)) {
      return 1;
    } else {
      return a.localeCompare(b);
    }
  })

  const downloadFile = async (name: string) => {
    try {
      setActiveDownloads(prev => ({...prev, [name]: true}));
      setDownloadErrors(prev => ({...prev, [name]: ''}));
      setDownloadProgress(prev => ({...prev, [name]: 0}));
  
      const response = await fetch(`http://${ip}:3003/api/download/?name=${name}`);
  
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      if (response.status === 205) {
        fetchFiles();
        return;
      }
  
      const reader = response.body?.getReader();
      const contentLength = +(response.headers.get('Content-Length') ?? 0);
  
      if (!reader) throw new Error('Failed to initialize stream reader');
  
      let receivedLength = 0;
      const chunks: Uint8Array[] = [];
  
      while(true) {
        const {done, value} = await reader.read();
        if (done) break;
        
        chunks.push(value);
        receivedLength += value.length;
        
        setDownloadProgress(prev => ({
          ...prev, 
          [name]: (receivedLength / contentLength) * 100
        }));
      }
      
      const blob = new Blob(chunks);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = name;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      toast({title: "Download complete"});
  
    } catch (error) {
      console.error(error);
      setDownloadErrors(prev => ({
        ...prev, 
        [name]: error instanceof Error ? error.message : 'Download failed'
      }));
      toast({title: "Download failed", variant: "destructive"});
    } finally {
      setActiveDownloads(prev => ({...prev, [name]: false}));
      setDownloadProgress(prev => ({...prev, [name]: 0}));
    }
  };

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="h-full p-10 flex flex-col gap-2">
      {currentFilesPlusFolders.map((name, index) => (
        <div
          key={index}
          className="grid grid-cols-6 border-b-2 gap-2 border-b-lemon p-2 text-lemon"
        >
          <div className="col-span-1 flex items-center">{indexOfFirstFile + index + 1}.</div>

          <div
            className="col-span-4 flex items-center gap-2 cursor-pointer"
            onClick={() => downloadFile(name)}
          >
            {!file.folders.includes(name) ? (
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
            <h1 className="overflow-auto">{name}</h1>
          </div>
          {!file.folders.includes(name) && (
            <div className="col-span-1 pl-1 flex items-center">
              <button 
                onClick={() => downloadFile(name)}
                disabled={activeDownloads[name]}
                className="relative flex items-center gap-2"
              >
                {activeDownloads[name] ? (
                  <>
                    <div className="w-6 h-6 border-2 border-lemon border-t-transparent rounded-full animate-spin" />
                    <span className="text-xs">
                      {Math.round(downloadProgress[name])}%
                    </span>
                  </>
                ) : (
                  <Image
                    src="download.svg"
                    className="mt-[.2rem]"
                    height={25}
                    width={25}
                    alt="download-icon"
                  />
                )}
              </button>
              {downloadErrors[name] && (
                <div className="text-red-500 text-xs mt-1">
                  {downloadErrors[name]}
                </div>
              )}
            </div>
          )}
        </div>
      ))}
      {filesPlusFolders.length > filesPerPage && (
        <div className="flex justify-center mt-4 text-darkblue font-bold">
          {(() => {
        const totalPages = Math.ceil(filesPlusFolders.length / filesPerPage);
        const maxVisible = 4; // Show maximum 4 page numbers at once
        let pages = [];

        if (totalPages <= maxVisible) {
          // Show all pages if total pages are less than maxVisible
          pages = Array.from({length: totalPages}, (_, i) => i + 1);
        } else {
          // Always show first page
          pages.push(1);
          
          if (currentPage > 2) {
            pages.push('...');
          }

          // Show current page and one page after (if not last page)
          if (currentPage !== 1 && currentPage !== totalPages) {
            pages.push(currentPage);
          }
          if (currentPage < totalPages - 1) {
            pages.push(currentPage + 1);
          }

          if (currentPage < totalPages - 1) {
            pages.push('...');
          }

          // Always show last page
          pages.push(totalPages);
        }

        return pages.map((page, index) => (
          page === '...' ? (
            <span key={`ellipsis-${index}`} className="px-4 py-2 mx-1 text-zinc-200">...</span>
          ) : (
            <button
          key={index}
          onClick={() => paginate(Number(page))}
          className={`px-4 py-2 mx-1 ${
            currentPage === page ? "bg-lemon" : "bg-gray-200"
          }`}
            >
          {page}
            </button>
          )
        ));
          })()}
        </div>
      )}
    </div>
  );
}
