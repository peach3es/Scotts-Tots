import Image from "next/image";
import WorldMap from "@/components/ui/world-map";
import axios from "axios";

interface Circuit {
  circuitId: string;
  circuitName: string;
  Location: {
    lat: string;
    long: string;
    locality: string;
    country: string;
  };
}

interface Dot {
  start: { lat: number; lng: number; label?: string };
  end: { lat: number; lng: number; label?: string };
}

async function getCircuits(): Promise<Dot[]> {
  const response = await axios.get("https://api.jolpi.ca/ergast/f1/2024/circuits/");
  const circuits: Circuit[] = response.data.MRData.CircuitTable.Circuits;
  return circuits.map((circuit) => {
    const lat = Number(circuit.Location.lat);
    const lng = Number(circuit.Location.long);
    return {
      start: { lat, lng, label: circuit.circuitName },
      end: { lat, lng, label: circuit.circuitName },
    };
  });
}

export default async function Home() {

  const dots = await getCircuits();
  return (
    <div className="flex flex-col items-center justify-items-center min-h-screen px-8 ">
        <WorldMap dots={dots}/>
      {/* <Container>
      </Container> */}
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
          >
          <Image
            aria-hidden
            src="https://nextjs.org/icons/file.svg"
            alt="File icon"
            width={16}
            height={16}
            />
          Learn
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
          >
          <Image
            aria-hidden
            src="https://nextjs.org/icons/window.svg"
            alt="Window icon"
            width={16}
            height={16}
            />
          Examples
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
          >
          <Image
            aria-hidden
            src="https://nextjs.org/icons/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
            />
          Go to nextjs.org →
        </a>
      </footer>
    </div>
  );
}
