"use client";

import { Button } from "./ui/button";
import { Input } from "./ui/input";

export default function SendFile() {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    const ip = document.location.hostname;

    const formData = new FormData(e.currentTarget);
    try {
      const response = await fetch(`http://${ip}:8000/api/send`, {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      console.log(data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className=" flex justify-center items-center py-10">
      <div className="h-[100%] w-10/12 rounded-md ">
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
