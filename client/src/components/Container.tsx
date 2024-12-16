import Directories from "./Directories";

export default function Container() {
  return (
    <div className=" flex justify-center items-center w-full">
      <div className="h-[100%] bg-[#0a2567] w-10/12 rounded-md">
        <Directories />
      </div>
    </div>
  );
}
