export default {
  root: "src",
  title: "Data by adj.news",
  theme: "near-midnight",
  pager: false,
  toc: true,
  pager: false,
  toc: true,
  pages: [
    {
      name: "Overview",
      open: true,
      path: "/",
    },
    {
      name: "Reporting",
      open: false,
      pages: [
        {name: "Kalshi Stats", path: "/reporting#kalshi-stats"},
        {name: "Active Markets", path: "/reporting#active-markets"},
        {name: "Finalized Markets", path: "/reporting#finalized-markets"},
        {name: "Trades", path: "/reporting#reported-trades"},
      ]
    }
  ],
  footer: ``,
  head: `
    <link rel="icon" href="https://pbs.twimg.com/profile_images/1668357289747554304/7NSJ60Fd_400x400.jpg" type="image/x-icon">
    ${`<script type="module" async src="https://events.observablehq.com/client.js?pageLoad"></script>`}
  `,
  header: `<style>

#observablehq-header a[href] {
  color: inherit;
}

#observablehq-header a[target="_blank"] {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  text-decoration: none;
}

#observablehq-header a[target="_blank"]:hover span {
  text-decoration: underline;
}

#observablehq-header a[target="_blank"]::after {
  content: "\\2197";
}

#observablehq-header a[target="_blank"]:not(:hover, :focus)::after {
  color: var(--theme-foreground-muted);
}P

@container not (min-width: 640px) {a
  .hide-if-small {
    display: none;
  }
}

.table-responsive {
  display: block;
  width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

.table-responsive > .card {
  min-width: 600px;
}

.dotted {
  border-bottom: 1px dotted var(--theme-foreground-muted);
  text-decoration: none;
}

</style>
<div style="display: flex; align-items: center; gap: 0.5rem; height: 2.2rem; margin: -1.5rem -2rem 2rem -2rem; padding: 0.5rem 2rem; border-bottom: solid 1px var(--theme-foreground-faintest); font: 500 16px var(--sans-serif);">
  <a href="https://adjacentresearch.xyz" target="_self" rel="" style="display: flex; align-items: center;">
    <svg version="1.0" xmlns="http://www.w3.org/2000/svg"
        width="50" height="50" viewBox="0 0 167.000000 167.000000"
        preserveAspectRatio="xMidYMid meet">
      
      <g transform="translate(0.000000,167.000000) scale(0.100000,-0.100000)"
      fill="#ffffff" stroke="none">
      <path d="M1469 1262 c-48 -39 -16 -122 48 -122 29 0 73 41 73 68 0 11 -9 31
      -21 46 -25 31 -66 35 -100 8z"/>
      <path d="M970 1125 c0 -122 -5 -140 -29 -111 -7 8 -32 19 -57 24 -139 30 -244
      -83 -244 -262 0 -133 48 -231 127 -257 53 -17 126 -7 167 25 l35 27 7 -26 c6
      -22 11 -25 55 -25 l49 0 0 355 c0 276 -3 356 -12 359 -7 3 -32 7 -55 10 l-43
      6 0 -125z m-67 -174 c14 -6 35 -20 46 -32 19 -20 21 -35 21 -135 0 -106 -1
      -114 -26 -143 -14 -17 -40 -35 -57 -39 -82 -22 -126 38 -127 171 0 88 15 134
      55 165 30 24 51 27 88 13z"/>
      <path d="M227 1183 c-7 -13 -207 -643 -207 -653 0 -6 27 -10 60 -10 38 0 60 4
      60 11 0 7 9 43 21 81 l20 69 117 -3 116 -3 22 -75 21 -75 62 -3 c61 -3 63 -2
      56 20 -14 46 -157 495 -181 571 l-26 77 -68 0 c-38 0 -71 -3 -73 -7z m113
      -249 c22 -76 40 -145 40 -151 0 -10 -24 -13 -85 -13 -53 0 -85 4 -85 10 0 18
      83 301 87 296 2 -2 22 -66 43 -142z"/>
      <path d="M1290 990 l0 -40 101 0 101 0 -4 -197 c-2 -166 -6 -203 -21 -230 -23
      -44 -78 -79 -158 -104 l-67 -20 9 -37 c5 -20 9 -40 9 -44 0 -11 119 21 176 48
      62 29 114 78 141 132 16 32 18 69 21 285 l3 247 -155 0 -156 0 0 -40z"/>
      </g>
    </svg>
  </a>
    <div style="display: flex; flex-grow: 1; justify-content: space-between; align-items: baseline;">
    <a href="" target="_self" rel="">
      
    </a>
    <span style="display: flex; align-items: baseline; gap: 0.5rem; font-size: 14px;">
      <a target="_blank" href="https://adjacentresearch.substack.com"><span>Research</span></a>
      <a target="_blank" href="https://x.com/0xperp"><span>Twitter</span></a>
    </span>
  </div>
</div>`
};
