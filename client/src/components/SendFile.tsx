"use client";


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
    <div className=" flex justify-center items-center w-full">
      <form onSubmit={handleSubmit} className="flex-col flex justify-center ">
        <input type="file" name="file" className="rounded-lg" />
        <button type="submit" className="bg-lemon text-darkblue rounded-lg">
          Send
        </button>
      </form>
    </div>
  );
}
