import { MusicPlayer } from "./music-player";

type Props = {
  searchParams: Promise<{
    genre?: string;
  }>;
};

export default async function HomePage({ searchParams }: Props) {
  const params = await searchParams;

  return <MusicPlayer activeGenre={params.genre ?? "All"} />;
}
