import Container from "@/components/Container";

export default function Home() {
  return (
    <div className="h-screen w-full bg-darkblue">
      <div className="h-[25%]">
        <h1 className="text-6xl text-center pt-16 font-extrabold text-lemon">
          s<span className="text-zinc-200">z</span>are
        </h1>
        <h2 className="text-xl text-zinc-200 text-center">file sharing</h2>
      </div>
      <Container />
    </div>
  );
}
