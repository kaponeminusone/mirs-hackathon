"use client";

import React from 'react';
import {
    LineChart,
    Line,
    AreaChart,
    Area,
    ResponsiveContainer
} from 'recharts';

export function HeartRateChart({ data }: { data: any[] }) {
    return (
        <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
                <Line
                    type="monotone"
                    dataKey="hr"
                    stroke="#f87171"
                    strokeWidth={2}
                    dot={false}
                    isAnimationActive={true}
                />
            </LineChart>
        </ResponsiveContainer>
    );
}

export function BloodPressureChart({ data }: { data: any[] }) {
    return (
        <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
                <Area
                    type="monotone"
                    dataKey="bp"
                    stroke="#60a5fa"
                    fill="#60a5fa"
                    fillOpacity={0.2}
                    strokeWidth={2}
                    isAnimationActive={true}
                />
            </AreaChart>
        </ResponsiveContainer>
    );
}
