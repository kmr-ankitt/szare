import Container from "@/components/Container";

export default function Home() {
  return (
    <div className="h-full w-full bg-darkblue sm:flex sm:flex-col sm:justify-center sm:items-center sm:gap-20"> 
      <div className="pb-5">
        <h1 className="text-6xl sm:text-8xl text-center pt-5 font-extrabold text-lemon">
          s<span className="text-zinc-200">z</span>are
        </h1>
        <h2 className="text-xl sm:text-2xl text-zinc-200 text-center">file sharing</h2>
      </div>
      <Container />
    </div>
  );
}
