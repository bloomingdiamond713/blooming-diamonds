import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Rectangle,
} from "recharts";

const BarChartComponent = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        width={500}
        height={300}
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <XAxis dataKey="monthName" />
        <YAxis />
        <Tooltip cursor={{ fill: "transparent" }} />
        <Bar
          dataKey="totalSales"
          name="Total Sales"
          fill="#eebfab"
          activeBar={<Rectangle fill="#95523d" />}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default BarChartComponent;
