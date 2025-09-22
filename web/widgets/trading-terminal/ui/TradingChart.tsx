import { getPairKlines } from "@/entities/pair/api/klinesApi";
import {
  createChart,
  IChartApi,
  UTCTimestamp,
  CandlestickSeries,
} from "lightweight-charts";
import { useEffect, useRef, useState } from "react";

interface TradingChartProps {
  pair: string;
  interval: string;
}

export const TradingChart: React.FC<TradingChartProps> = ({
  pair,
  interval,
}) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  // Упрощаем типизацию для совместимости
  const seriesRef = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Эффект №1: Инициализация графика
  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      layout: { background: { color: "transparent" }, textColor: "#d1d5db" },
      grid: {
        vertLines: { color: "#374151" },
        horzLines: { color: "#374151" },
      },
      width: chartContainerRef.current.clientWidth,
      height: 300,
    });

    // Правильный синтаксис для версии 5.0.8 - используем готовую константу
    const candlestickSeries = chart.addSeries(CandlestickSeries, {
      upColor: "#22c55e",
      downColor: "#ef4444",
      borderDownColor: "#ef4444",
      borderUpColor: "#22c55e",
      wickDownColor: "#ef4444",
      wickUpColor: "#22c55e",
    });

    chartRef.current = chart;
    seriesRef.current = candlestickSeries;

    const handleResize = () => {
      if (chartRef.current && chartContainerRef.current) {
        chartRef.current.applyOptions({
          width: chartContainerRef.current.clientWidth,
        });
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (chartRef.current) {
        chartRef.current.remove();
      }
    };
  }, []);

  // Эффект №2: Загрузка данных
  useEffect(() => {
    const fetchData = async () => {
      if (!seriesRef.current) return;

      setIsLoading(true);
      setError(null);

      try {
        const data = await getPairKlines(pair, interval, 150);

        // Приводим данные к правильному типу
        const typedData = data.map((item) => ({
          ...item,
          time: item.time as UTCTimestamp,
        }));

        seriesRef.current.setData(typedData);
      } catch (e) {
        setError("Не удалось загрузить данные графика.");
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [pair, interval]);

  // JSX рендеринг
  return (
    <div className="relative p-2 h-[316px]">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-zinc-950/70 z-10">
          Загрузка...
        </div>
      )}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center text-red-500 bg-zinc-950/70 z-10">
          {error}
        </div>
      )}
      <div ref={chartContainerRef} />
    </div>
  );
};
