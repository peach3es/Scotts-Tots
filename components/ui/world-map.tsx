"use client";

import { useRef } from "react";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import DottedMap from "dotted-map";
import { motion } from "motion/react";
import { useTheme } from "next-themes";
import Image from "next/image";

import { circuits } from "../../data/circuit"; // our mapping from circuit names to data
import Track2D from "../RaceTrack/track2D";

interface MapProps {
  dots?: Array<{
    start: { lat: number; lng: number; label?: string; id?: string };
    end: { lat: number; lng: number; label?: string; id?: string };
  }>;
  lineColor?: string;
}

export default function WorldMap({
  dots = [],
  lineColor = "#f98282",
}: MapProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const map = new DottedMap({ height: 100, grid: "diagonal" });
  const { theme } = useTheme();

  const svgMap = map.getSVG({
    radius: 0.25,
    color: theme === "dark" ? "#FFFFFF40" : "#00000040",
    shape: "circle",
    backgroundColor: theme === "dark" ? "black" : "white",
  });

  const projectPoint = (lat: number, lng: number) => {
    const x = (lng + 180) * (800 / 360) - 5;
    const y = (90 - lat) * (400 / 180) + 30;
    return { x, y };
  };

  const createCurvedPath = (
    start: { x: number; y: number },
    end: { x: number; y: number }
  ) => {
    const midX = (start.x + end.x) / 2;
    const midY = Math.min(start.y, end.y) - 50;
    return `M ${start.x} ${start.y} Q ${midX} ${midY} ${end.x} ${end.y}`;
  };

  return (
    <div className="relative aspect-[2/1] w-full rounded-lg bg-white font-sans dark:bg-black">
      <Image
        src={`data:image/svg+xml;utf8,${encodeURIComponent(svgMap)}`}
        className="pointer-events-none h-full w-full select-none [mask-image:linear-gradient(to_bottom,transparent,white_10%,white_90%,transparent)]"
        alt="world map"
        height="495"
        width="1056"
        draggable={false}
      />
      <svg
        ref={svgRef}
        viewBox="0 0 800 400"
        className="absolute inset-0 h-full w-full select-none"
      >
        {dots.map((dot, i) => {
          const startPoint = projectPoint(dot.start.lat, dot.start.lng);
          const endPoint = projectPoint(dot.end.lat, dot.end.lng);
          return (
            <Dialog key={`dialog-${i}`}>
              <DialogTrigger asChild>
                <g className="z-20 cursor-pointer" key={`points-group-${i}`}>
                  <g key={`start-${i}`}>
                    <circle
                      cx={startPoint.x}
                      cy={startPoint.y}
                      r="3"
                      fill={lineColor}
                    />
                    <circle
                      cx={startPoint.x}
                      cy={startPoint.y}
                      r="2"
                      fill={lineColor}
                      opacity="0.5"
                    >
                      <animate
                        attributeName="r"
                        from="2"
                        to="8"
                        dur="1.5s"
                        begin="0s"
                        repeatCount="indefinite"
                      />
                      <animate
                        attributeName="opacity"
                        from="0.5"
                        to="0"
                        dur="1.5s"
                        begin="0s"
                        repeatCount="indefinite"
                      />
                    </circle>
                  </g>
                </g>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{dot.start.label}</DialogTitle>
                  <DialogDescription>
                    {/* Look up the circuit data by dot.start.label and pass it to Track2D */}
                    {dot.start.id && circuits[dot.start.id] ? (
                      <Track2D circuit={circuits[dot.start.id]} />
                    ) : (
                      <p>No circuit data found.</p>
                    )}
                  </DialogDescription>
                </DialogHeader>
                <DialogClose />
              </DialogContent>
            </Dialog>
          );
        })}
      </svg>
    </div>
  );
}
