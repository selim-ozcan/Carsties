import { Button } from "flowbite-react";
import ButtonGroup from "flowbite-react/lib/esm/components/Button/ButtonGroup";
import React from "react";
import { useParamsStore } from "../hooks/useParamsStore";
import { AiOutlineClockCircle, AiOutlineSortAscending } from "react-icons/ai";
import { BsFillStopCircleFill, BsStopwatchFill } from "react-icons/bs";
import { GiFinishLine, GiFlame } from "react-icons/gi";

const pageSizeButtons = [4, 8, 12];
const orderButtons = [
  {
    label: "Alphabetical",
    icon: AiOutlineSortAscending,
    value: "make",
  },
  {
    label: "End date",
    icon: AiOutlineClockCircle,
    value: "endingSoon",
  },
  {
    label: "Recently added",
    icon: BsFillStopCircleFill,
    value: "new",
  },
];

const filterButtons = [
  {
    label: "Live Auctions",
    icon: GiFlame,
    value: "live",
  },
  {
    label: "Ending < 6 hours",
    icon: GiFinishLine,
    value: "endingSoon",
  },
  {
    label: "Completed",
    icon: BsStopwatchFill,
    value: "finished",
  },
];
export default function Filters() {
  const pageSize = useParamsStore((state) => state.pageSize);
  const setParams = useParamsStore((state) => state.setParams);
  const orderBy = useParamsStore((state) => state.orderBy);
  const filterBy = useParamsStore((state) => state.filterBy);

  return (
    <div className="flex justify-between items-center mb-4">
      <div>
        <span className="uppercase text-sm text-gray-500 mr-2">Filter by</span>
        <Button.Group>
          {filterButtons.map(({ label, icon: Icon, value }) => (
            <Button
              key={value}
              onClick={() => setParams({ filterBy: value })}
              color={`${filterBy === value ? "red" : "gray"}`}
            >
              <Icon className="mr-3 h-4 w-4" />
              {label}
            </Button>
          ))}
        </Button.Group>
      </div>
      <div>
        <span className="uppercase text-sm text-gray-500 mr-2">Order by</span>
        <Button.Group>
          {orderButtons.map(({ label, icon: Icon, value }) => (
            <Button
              key={value}
              onClick={() => setParams({ orderBy: value })}
              color={`${orderBy === value ? "red" : "gray"}`}
            >
              <Icon className="mr-3 h-4 w-4" />
              {label}
            </Button>
          ))}
        </Button.Group>
      </div>
      <div>
        <span className="uppercase text-sm text-gray-500 mr-2">Page Size</span>
        <ButtonGroup>
          {pageSizeButtons.map((value, i) => (
            <Button
              key={i}
              onClick={() => setParams({ pageSize: value })}
              //color={pageSize === value ? "failure" : "gray"}
              className={
                pageSize === value
                  ? "text-white bg-red-500 border border-transparent enabled:hover:bg-red-700 focus:ring-4 focus:ring-red-300 dark:bg-red-600 dark:enabled:hover:bg-red-700 dark:focus:ring-red-700"
                  : "text-gray-900 bg-white border border-gray-200 enabled:hover:bg-gray-100 enabled:hover:text-cyan-700 :ring-cyan-700 focus:text-cyan-700 dark:bg-transparent dark:text-gray-400 dark:border-gray-600 dark:enabled:hover:text-white dark:enabled:hover:bg-gray-700 focus:ring-2"
              }
            >
              {value}
            </Button>
          ))}
        </ButtonGroup>
      </div>
    </div>
  );
}
