export default {
  root: "src",
  title: "Adjacent Data",
  theme: "deep-space",
  pager: false,
  toc: false,
  sidebar: false,
  pages: [
    {
      name: "Overview",
      open: true,
      path: "/",
    },
    {
      name: "markets",
      path: "/markets",
    },
    {
      name: "Reporting",
      open: true,
      pages: [
        { name: "Kalshi Markets", path: "/platforms/kalshi/markets" },
        { name: "Kalshi Trades", path: "/platforms/kalshi/trades" },
      ]
    }
  ],
  footer: `<div>
      <div>
        <a target="_blank" href="/platforms/"><span>Platforms</span></a> /
        <a target="_blank" href="/reporting/"><span>Reporting</span></a> /
        <a target="_blank" href="https://api.data.adj.news"><span>API</span></a> /
        <a target="_blank" href="https://adj.news"><span>News</span></a> /
        <a target="_blank" href="https://adjacentresearch.substack.com"><span>Press</span></a>
      </div>
      <p>Updated every 1h. Last Updated at ${new Date().toLocaleString()} (UTC) by <a href="https://x.com/adjacent___" target="_blank">@adjacent___</a></p>
      <p>Disclaimer: This is not financial advice. This is a collection of data from various sources. Please do your own research before making any investment decisions.</p>
    </div>
  `,
  head: `
    <link rel="icon" href="https://pbs.twimg.com/profile_images/1668357289747554304/7NSJ60Fd_400x400.jpg" type="image/x-icon">
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-JM45G4SC33"></script>
    <script>
      !function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.async=!0,p.src=s.api_host+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString(1)+".people (stub)"},o="capture identify alias people.set people.set_once set_config register register_once unregister opt_out_capturing has_opted_out_capturing opt_in_capturing reset isFeatureEnabled onFeatureFlags getFeatureFlag getFeatureFlagPayload reloadFeatureFlags group updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures getActiveMatchingSurveys getSurveys getNextSurveyStep onSessionId".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);
      posthog.init('phc_s49LlRrPKqSVaHKwzWU0bykUQL9Bg9oV8jQLMM54NmK', {api_host: 'https://us.i.posthog.com', person_profiles: 'identified_only'})
    </script>
    <meta property="og:image" content="https://pbs.twimg.com/profile_images/1668357289747554304/7NSJ60Fd_400x400.jpg"/>
    <link rel="apple-touch-icon" href="https://pbs.twimg.com/profile_images/1668357289747554304/7NSJ60Fd_400x400.jpg">
    <meta name="apple-mobile-web-app-title" content="Adjacent">
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
  table-layout: fixed;
  width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

.table-responsive td {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  word-wrap: break-word;
}

.table-responsive > .card {
  min-width: 600px;
}

a:link.dotted,
a:visited.dotted {
  border-bottom: 1px dotted var(--theme-foreground-muted);
  text-decoration: none;
}

a:hover.dotted {
  border-bottom: 1.5px dotted var(--theme-foreground-muted);
  text-decoration: none;
}

a {
  color: var(--theme-foreground-alt);
  text-decoration: none;
}

a:link {
  color: var(--theme-foreground-alt);
  text-decoration: underline;
}

a:hover {
  color: var(--theme-foreground-alt);
  text-decoration: underline;
}

a:visited {
  color: var(--theme-foreground-alt);
}

.flex {
  display: flex; 
  align-items: baseline; 
  gap: 0.5rem; 
  ont-size: 14px;
}

#primaryCTA {
  width: 50%;
  margin-left: -2em;
}

@media only screen and (max-width: 876px) {
  #primaryCTA {
    height: 3em;
    width: 75%;
    margin-left: 1em;
    font-size: 0.6em;
  }
}

@media only screen and (max-width: 876px) {
  .header {
    font-size: 0.75em;
    margin-left: 0em;
  }

  .header svg {
    width: 2em;
    height: 2em;
  }

  .hide {
    display: none;
  }
}

.menu-btn {
  display: none;
}

.menu-icon {
  cursor: pointer;
}

.menu {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-right: 2rem;
  overflow-x: auto;
  white-space: nowrap;
  opacity: 1;
  z-index: 9999;
}

.nav-item {
  color: var(--theme-foreground);
  padding-left: 1em;
  padding: 1em;
}

@media (max-width: 600px) {
  .menu {
    display: none;
    position: absolute;
    right: 3em;
    background-color: #000;
    color: #fff;
    width: 70%;
    padding: 2em;
  }
  .menu-btn:checked ~ .menu {
    display: block;
  }
}

.menu-icon {
  grid-area: hamburger;
  cursor: pointer;
  display: none;
  justify-content: flex-end;
  align-items: baseline;
  padding: 30px 20px 30px 0;
  position: relative;
  user-select: none;
  visibility: visible;
}

@media screen and (max-width: 768px) {
  .menu-icon {
    display: block;
    cursor: pointer;
  }
}

</style>
<div style="display: flex; align-items: center; gap: 0.5rem; height: 2.2rem; margin: -1.5rem -2rem 2rem -2rem; padding: 0.5rem 2rem; border-bottom: solid 1px var(--theme-foreground-faintest); font: 500 16px var(--sans-serif);">
  <a href="/" target="_self" rel="" style="display: flex; align-items: center;" class="header">
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
    <div>
    </div>
    <div style="display: flex; flex-grow: 1; justify-content: flex-end; align-items: baseline;">
      <input class="menu-btn" type="checkbox" id="menu-btn" name="menu-btn" />
      <label class="menu-icon" for="menu-btn">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-menu"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
      </label>
      <nav class="menu">
        <a class="nav-item" href="https://data.adj.news/platforms/" style="text-decoration: none">Platforms</a>
        <a class="nav-item" href="https://data.adj.news/reporting/" style="text-decoration: none">Reporting</a>
        <a class="nav-item" href="https://api.data.adj.news" style="text-decoration: none">API</a>
        <a class="nav-item" href="https://adj.news" style="text-decoration: none">News</a>
        <a class="nav-item" href="https://press.adjacentresearch.xyz" style="text-decoration: none">Press</a>
      </nav>
    </div>
</div>`
};
