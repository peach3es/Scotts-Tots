"use client";

import { useEffect, useRef, useState } from "react";

import { Container } from "@/components/Container";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Group } from "@visx/group";
import { scaleLinear } from "@visx/scale";
import { Bar } from "@visx/shape";

interface Stint {
  driver_number: number;
  lap_start: number;
  lap_end: number;
  compound: string;
}

const compoundColors: Record<string, string> = {
  SOFT: "#ff2d55",
  MEDIUM: "#ffcc00",
  HARD: "#ffffff",
  INTERMEDIATE: "#4cd964",
  WET: "#0091ea",
};

const grandPrixMap: Record<string, number> = {
  Bahrain: 9472,
  "Saudi Arabia": 9480,
  Australia: 9488,
  Japan: 9496,
  China: 9673,
  Miami: 9507,
  Imola: 9515,
  Monaco: 9523,
  Canada: 9531,
  Spain: 9539,
  Austria: 9550,
  Britain: 9558,
  Hungary: 9566,
  Belgium: 9574,
  Netherlands: 9582,
  Monza: 9590,
  Azerbaijan: 9598,
  Singapore: 9606,
  Austin: 9617,
  Mexico: 9625,
  Brazil: 9636,
  "Las Vegas": 9644,
  Qatar: 9655,
  "Abu Dhabi": 9662,
};

export default function Tyre() {
  const [grandPrix, setGrandPrix] = useState("");
  const [stints, setStints] = useState<Stint[]>([]);
  const [drivers, setDrivers] = useState<number[]>([]);
  const [totalLaps, setTotalLaps] = useState<number>(0);
  const [isClient, setIsClient] = useState(false);
  const [chartWidth, setChartWidth] = useState(600);

  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    setIsClient(true);

    const updateSize = () => {
      if (svgRef.current) {
        setChartWidth(svgRef.current.clientWidth);
      }
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  const fetchStints = async () => {
    if (!grandPrix) return;

    const lowerCaseGrandPrix = grandPrix.trim().toLowerCase();
    const sessionKey =
      grandPrixMap[
        Object.keys(grandPrixMap).find(
          (key) => key.toLowerCase() === lowerCaseGrandPrix
        ) || ""
      ];

    if (!sessionKey) {
      console.error("Invalid Grand Prix name");
      return;
    }

    const res = await fetch(
      `https://api.openf1.org/v1/stints?session_key=${sessionKey}`
    );
    const data = await res.json();

    setStints(data);
    const uniqueDrivers = [
      ...new Set<number>(data.map((stint: Stint) => stint.driver_number)),
    ];
    setDrivers(uniqueDrivers);

    const calculatedTotalLaps = Math.max(
      ...data.map((stint: Stint) => stint.lap_end)
    );
    setTotalLaps(calculatedTotalLaps);
  };

  const xScale = scaleLinear({
    domain: [1, totalLaps || 1],
    range: [0, chartWidth - 50], // Adjust dynamically
  });

  const tickCount = Math.min(totalLaps, 10);
  const tickStep = totalLaps > 0 ? Math.ceil(totalLaps / tickCount) : 1;
  const ticks =
    totalLaps > 0
      ? Array.from({ length: tickCount + 1 }, (_, i) => i * tickStep + 1)
      : [];

  if (!isClient) return null;

  return (
    <Container className="min-h-screen py-16">
      <Card className="mt-10 w-full p-4 shadow-lg">
        <CardContent className="w-full">
          <h2 className="mb-4 text-center text-xl font-bold">
            F1 Tire Stint Visualization - 2024 Season
          </h2>

          <div className="mb-4 flex flex-col gap-2 sm:flex-row">
            <Input
              type="text"
              placeholder="Enter Grand Prix Name"
              value={grandPrix}
              onChange={(e) => setGrandPrix(e.target.value)}
              className="flex-1"
            />
            <Button onClick={fetchStints}>Fetch Data</Button>
          </div>

          <svg ref={svgRef} width="100%" height={drivers.length * 40 + 100}>
            {drivers.map((driver, rowIndex) => (
              <Group key={driver} top={rowIndex * 40 + 70}>
                {stints
                  .filter((stint) => stint.driver_number === driver)
                  .map((stint, index) => (
                    <Bar
                      key={index}
                      x={xScale(stint.lap_start)}
                      y={10}
                      width={xScale(stint.lap_end) - xScale(stint.lap_start)}
                      height={30}
                      fill={compoundColors[stint.compound] || "#888"}
                      stroke="#000"
                    />
                  ))}
                <text
                  x={5}
                  y={30}
                  fontSize={12}
                  fill="black"
                >{`#${driver}`}</text>
              </Group>
            ))}

            <g transform={`translate(0, ${drivers.length * 40 + 80})`}>
              <line x1={0} x2={chartWidth - 50} y1={0} y2={0} stroke="#000" />
              {ticks.map((tick) => (
                <g key={tick} transform={`translate(${xScale(tick)}, 0)`}>
                  <line y1={0} y2={5} stroke="#000" />
                  <text
                    x={0}
                    y={20}
                    fontSize={12}
                    fill="black"
                    textAnchor="middle"
                  >
                    {tick}
                  </text>
                </g>
              ))}
            </g>
          </svg>

          <div className="mt-4 flex flex-col items-start">
            <h3 className="mb-2 font-bold">Tire Compound Legend:</h3>
            {Object.entries(compoundColors).map(([compound, color]) => (
              <div key={compound} className="mb-1 flex items-center">
                <div
                  style={{
                    width: 20,
                    height: 20,
                    backgroundColor: color,
                    marginRight: 8,
                    border: "1px solid black",
                  }}
                />
                <span>{compound}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </Container>
  );
}
