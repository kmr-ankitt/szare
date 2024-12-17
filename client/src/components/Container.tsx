import Directories from "./Directories";

export default function Container() {
  return (
    <div className=" flex justify-center items-center w-full">
      <div className="h-[100%] bg-[#0a2567] w-10/12 rounded-md sm:w-8/12 md:w-8/12 lg:w-8/12 xl:w-8/12">
        <Directories />
      </div>
    </div>
  );
}
