
import React from 'react';
import { cn } from '@/lib/utils'; // Assuming cn exists, if not I'll just use template literals or classNames. But standard shadcn/modern next setups usually have it. I'll check first or just use template literals to be safe. Actually, I haven't seen lib/utils checked yet. I'll use standard className prop.

interface MirsLogoProps extends React.SVGProps<SVGSVGElement> {
    className?: string;
}

export default function MirsLogo({ className, ...props }: MirsLogoProps) {
    return (
        <svg
            version="1.0"
            xmlns="http://www.w3.org/2000/svg"
            width="175.000000pt"
            height="171.000000pt"
            viewBox="0 0 175.000000 171.000000"
            preserveAspectRatio="xMidYMid meet"
            className={className}
            {...props}
        >
            <g transform="translate(0.000000,171.000000) scale(0.100000,-0.100000)" fill="currentColor" stroke="none">
                <path d="M576 1569 l-26 -20 0 -180 0 -179 -187 0 c-152 -1 -192 -4 -208 -16
-19 -14 -20 -28 -23 -260 -3 -210 -1 -249 13 -270 15 -24 16 -24 210 -24 l195
0 0 -198 c0 -163 3 -201 16 -220 15 -22 19 -22 248 -22 213 0 234 2 249 18 14
15 17 40 17 138 l-1 119 -74 77 -74 78 -66 0 c-75 0 -119 15 -155 54 -20 22
-25 39 -28 94 -3 78 8 106 57 139 28 19 47 23 115 23 l81 0 72 72 73 72 0 248
c0 244 0 247 -22 262 -19 13 -59 16 -239 16 -204 0 -218 -1 -243 -21z" />
                <path d="M1343 1281 c-43 -27 -56 -55 -51 -112 l5 -47 -151 -151 -151 -151
-91 0 c-79 0 -93 -3 -109 -20 -15 -16 -17 -26 -9 -47 11 -33 36 -41 129 -42
l71 -1 149 -162 150 -163 1 -53 c1 -46 5 -58 33 -85 27 -28 38 -32 82 -32 45
0 54 4 80 33 34 37 40 102 13 140 -23 33 -72 55 -109 49 -30 -5 -38 2 -149
124 l-117 129 130 0 c120 0 131 -2 141 -20 13 -25 61 -50 95 -50 96 0 151 119
88 190 -51 57 -156 48 -185 -15 -11 -25 -11 -25 -167 -25 l-156 0 150 150
c127 127 154 150 180 150 82 0 139 73 116 149 -20 69 -106 101 -168 62z" />
            </g>
        </svg>
    );
}
