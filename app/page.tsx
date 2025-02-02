import WorldMap from "@/components/ui/world-map";
import axios from "axios";
import Image from "next/image";

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
  start: { lat: number; lng: number; label?: string; id?: string };
  end: { lat: number; lng: number; label?: string; id?: string };
}

async function getCircuits(): Promise<Dot[]> {
  const response = await axios.get(
    "https://api.jolpi.ca/ergast/f1/2024/circuits/"
  );
  const circuits: Circuit[] = response.data.MRData.CircuitTable.Circuits;
  return circuits.map((circuit) => {
    const lat = Number(circuit.Location.lat);
    const lng = Number(circuit.Location.long);
    return {
      start: { lat, lng, label: circuit.circuitName, id: circuit.circuitId },
      end: { lat, lng, label: circuit.circuitName, id: circuit.circuitId },
    };
  });
}

export default async function Home() {
  const dots = await getCircuits();
  return (
    <div className="flex min-h-screen flex-col items-center justify-items-center px-8">
      <WorldMap dots={dots} />
      {/* <Container>
      </Container> */}
      <footer className="row-start-3 flex flex-wrap items-center justify-center gap-6">
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
