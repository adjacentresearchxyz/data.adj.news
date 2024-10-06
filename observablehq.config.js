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
    }
  ],
  footer: ({title, data, path}) => `<div>
      <div>
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
  min-width: 500px;
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

@media (max-width: 500px) {
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

@media screen and (max-width: 500px) {
  .menu-icon {
    display: block;
    cursor: pointer;
  }
}

</style>`
};
