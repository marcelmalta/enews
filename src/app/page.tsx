import HomeClient from "./HomeClient";

type PageProps = {
  searchParams?: { v?: string };
};

export default function Page({ searchParams }: PageProps) {
  const v = typeof searchParams?.v === "string" ? searchParams.v : null;
  return <HomeClient initialVideoId={v} />;
}
