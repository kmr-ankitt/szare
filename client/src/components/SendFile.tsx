"use client";

import { Button } from "./ui/button";
import { Input } from "./ui/input";

export default function SendFile() {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const ip = document.location.hostname;

    const formData = new FormData(e.currentTarget);
    try {
      await axios.post(`http://${ip}:8000/api/send`, formData);
      toast({ title: "File sent successfully" });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className=" flex justify-center items-center py-10 w-full">
      <div className="h-[100%] w-10/12 rounded-md sm:w-8/12 md:w-8/12 lg:w-8/12 xl:w-8/12">
        <form onSubmit={handleSubmit} className="flex-col flex justify-center gap-2 ">
          <Input type="file" name="file" className="bg-zinc-200 text-zinc-900" />
          <Button type="submit" className="bg-lemon text-darkblue uppercase ">
            Send
          </Button>
        </form>
      </div>
    </div>
  );
}
