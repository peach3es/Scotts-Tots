import Link from "next/link";

import { Container } from "./Container";
import { buttonVariants } from "./ui/button";

export default function Header() {
  return (
    <div className="absolute left-0 top-0 z-20 flex min-h-16 w-full flex-row items-center bg-brand-500">
      <Container>
        <div className="flex flex-row justify-between">
          <Link className={buttonVariants({ variant: "brand" })} href={"/"}>
            Tracks
          </Link>
          <Link
            className={buttonVariants({ variant: "brand" })}
            href={"/racers"}
          >
            Racers
          </Link>
          <Link className={buttonVariants({ variant: "brand" })} href={"/"}>
            Pit Stops
          </Link>
        </div>
      </Container>
    </div>
  );
}
