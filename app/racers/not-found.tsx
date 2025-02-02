import Link from "next/link";

export default function NotFoundPage() {
  return (
    <div className="text-darkRed flex h-screen flex-col place-content-center items-center gap-4">
      <div className="m-4 text-xl sm:text-3xl">
        404 | This page could not be found.
      </div>
      <Link href={"/"} className="hover:underline">
        Return
      </Link>
    </div>
  );
}
