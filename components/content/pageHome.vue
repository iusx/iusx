<template>
  <main>
    <div class="data" ref="force"></div>
    <div class="nav">
      <div class="title">
        <div class="title-text">
          <an-title
            title="Computer networking, 
 <br />Security, and Design Enthusiast."
          />
        </div>
        <div class="link">
          <span v-for="item in links" :key="item.href">
            <a :href="item.href">{{ item.name }}</a>
            {{ item.separator }}
          </span>
        </div>
      </div>
      <div class="copyright">
        <div class="copy-link">
          <a href="/about">about</a>
          <a href="/link">Friendly link</a>
          <a href="/rss.xml">Rss</a>
          <a href="/sitemap.xml">Sitemap</a>
        </div>
        <p class="copy-link">
          <a href="https://github.com/iusx">Github</a>
          <a href="https://be.net/1ui">Be</a>
          <a href="https://steamcommunity.com/profiles/76561199761586064/"
            >Steam</a
          >
          <a href="https://hackerone.com/iepn"
            >hackerone</a
          >
        </p>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import * as d3 from "d3";

const colorMode = useColorMode();

const links = ref([
  { name: "Security", href: "/sec", separator: " + " },
  { name: "Design", href: "/des", separator: " ÷ " },
  { name: "Plan", href: "/plan", separator: " + " },
  { name: "Learn", href: "/book" },
]);

const force = ref(null);

let simulation = null;
let addTimer = null;
let focusTimer = null;
let zoomBehavior = null;

onMounted(() => {
  const width = 1600;
  const height = 1600;

  const svg = d3
    .select(force.value)
    .append("svg")
    .attr("width", "100%")
    .attr("height", "100%")
    .attr("viewBox", `0 0 ${width} ${height}`)
    .style("display", "block");

  const nodes = [];
  const d3Links = [];

  const START = 1;
  const TARGET = 20;
  const STEP_MS = 1500;

  for (let i = 1; i <= START; i++) {
    nodes.push({
      id: i,
      x: Math.random() * 900,
      y: Math.random() * 900,
    });
  }

  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      d3Links.push({ source: nodes[i].id, target: nodes[j].id });
    }
  }

  const zoomRoot = svg.append("g").attr("class", "zoom-root");
  const gLinks = zoomRoot.append("g").attr("class", "links");
  const gNodes = zoomRoot.append("g").attr("class", "nodes");

  gLinks
    .selectAll("line")
    .data(d3Links, (d) => `${d.source}-${d.target}`)
    .enter()
    .append("line")
    .attr("class", "link")
    .attr("stroke", "#00FFF6")
    .attr("stroke-width", 1);

  gNodes
    .selectAll("circle")
    .data(nodes, (d) => d.id)
    .enter()
    .append("circle")
    .attr("class", "node")
    .attr("r", 5)
    .attr("fill", "#38E7CD");

  const linkForce = d3
    .forceLink(d3Links)
    .id((d) => d.id)
    .distance(4000);

  simulation = d3
    .forceSimulation(nodes)
    .force("charge", d3.forceManyBody().strength(6200))
    .force("link", linkForce)
    .force("center", d3.forceCenter(width / 2, height / 2))
    .on("tick", ticked);

  simulation.alphaDecay(0).restart();
  simulation.alphaMin(0.0101).restart();

  zoomBehavior = d3
    .zoom()
    .scaleExtent([0.3, 4])
    .filter(() => false)
    .on("zoom", (event) => {
      zoomRoot.attr("transform", event.transform);
    });

  svg.call(zoomBehavior);

  function ticked() {
    gLinks
      .selectAll("line")
      .attr("x1", (d) => d.source.x)
      .attr("y1", (d) => d.source.y)
      .attr("x2", (d) => d.target.x)
      .attr("y2", (d) => d.target.y);

    gNodes
      .selectAll("circle")
      .attr("cx", (d) => d.x)
      .attr("cy", (d) => d.y);
  }

  function refreshSelections() {
    gLinks
      .selectAll("line")
      .data(d3Links, (d) => `${d.source}-${d.target}`)
      .join(
        (enter) =>
          enter
            .append("line")
            .attr("class", "link")
            .attr("stroke", "#CCCCCC")
            .attr("stroke-width", 1),
        (update) => update,
        (exit) => exit.remove(),
      );

    gNodes
      .selectAll("circle")
      .data(nodes, (d) => d.id)
      .join(
        (enter) =>
          enter
            .append("circle")
            .attr("class", "node")
            .attr("r", 0)
            .attr("fill", "#38E7CD")
            .transition()
            .duration(400)
            .attr("r", 5),
        (update) => update,
        (exit) => exit.remove(),
      );
  }

  function computeTransformForNode(targetNode, desiredScale = 2) {
    const cx = width / 2;
    const cy = height / 2;
    const tx = cx - targetNode.x * desiredScale;
    const ty = cy - targetNode.y * desiredScale;
    return d3.zoomIdentity.translate(tx, ty).scale(desiredScale);
  }

  function startFocusLoopOnId(targetId) {
    if (focusTimer) return;
    let zoomed = false;
    const DURATION = 3200;
    const INTERVAL = DURATION + 700;

    focusTimer = setInterval(() => {
      const targetNode = nodes.find((n) => n.id === targetId);
      if (!targetNode) return;
      const targetTransform = computeTransformForNode(targetNode, 2.0);
      const toTransform = zoomed ? d3.zoomIdentity : targetTransform;

      svg
        .transition()
        .duration(DURATION)
        .ease(d3.easeCubicInOut)
        .call(zoomBehavior.transform, toTransform);

      zoomed = !zoomed;
    }, INTERVAL);
  }

  function stopFocusLoop() {
    if (focusTimer) {
      clearInterval(focusTimer);
      focusTimer = null;
      svg
        .transition()
        .duration(1000)
        .call(zoomBehavior.transform, d3.zoomIdentity);
    }
  }

  function addOneNode() {
    const id = nodes.length + 1;
    if (id > TARGET) return;

    const newNode = {
      id,
      x: Math.random() * 900,
      y: Math.random() * 900,
    };
    nodes.push(newNode);

    for (let j = 0; j < nodes.length - 1; j++) {
      d3Links.push({ source: newNode.id, target: nodes[j].id });
    }

    simulation.nodes(nodes);
    linkForce.links(d3Links);

    refreshSelections();
    simulation.alpha(0.9).restart();

    if (id === 3) {
      setTimeout(() => {
        startFocusLoopOnId(3);
      }, 400);
    }
  }

  addTimer = setInterval(() => {
    if (nodes.length >= TARGET) {
      clearInterval(addTimer);
      addTimer = null;
      return;
    }
    addOneNode();
  }, STEP_MS);
});

onUnmounted(() => {
  if (addTimer) {
    clearInterval(addTimer);
    addTimer = null;
  }
  if (focusTimer) {
    clearInterval(focusTimer);
    focusTimer = null;
  }
  if (simulation) simulation.stop();
  if (force.value) {
    d3.select(force.value).selectAll("*").remove();
  }
});
</script>

<style lang="scss" scoped>
@import url("https://fonts.googleapis.com/css2?family=Source+Code+Pro:ital,wght@0,200..900;1,200..900&display=swap");

.data {
  position: absolute;
  inset: 0;
  z-index: 0;
  display: block;

  max-height: 100vh;
  max-width: 100vw;
  overflow: hidden;
}

.data svg {
  width: 100%;
  height: 100%;
  display: block;
}

.nav {
  margin-left: 5vw;
  z-index: 10;
  font-family: "Source Code Pro", monospace;

  .title {
    line-height: 3;
    transform: translateY(35vh);

    .title-text {
      display: block;
      cursor: pointer;
      color: #d6d6d6;
      font-size: 30px;
      font-weight: 300;
      line-height: initial;
      padding: 0;
      margin: 0;

      @media (max-width: 600px) {
        font-size: 19px;
      }

      @media (max-width: 400px) {
        font-size: 14px;
      }
    }
  }

  .link {
    padding: 0;
    margin: 0;
    text-transform: capitalize;
    color: #b7b7b7;
    margin-top: 1vh;
    line-height: 1.3;
    font-size: 16px;
    margin-left: 2.5vh;

    a {
      text-decoration: none;
      color: #b7b7b7;
      padding-left: 3px;
      padding-right: 3px;
      transition: color 0.3s ease;

      @media (max-width: 400px) {
        font-size: 11px;
      }
      &:hover {
        color: #1c0000;
        text-transform: none;
        text-decoration: none;
      }

      .dark-mode &:hover {
        color: #757575;
      }
    }
  }
}

.copyright {
  position: absolute;
  bottom: 10px;
  color: #a1a1a1;
  font-size: 13px;
  line-height: 1;
  text-transform: uppercase;
  z-index: 10;

  @media (max-width: 400px) {
    font-size: 11px;
  }
  .copy-link {
    a {
      text-decoration: none;
      color: #b7b7b7;
      padding-right: 10px;
      transition: color 0.3s ease;

      &:hover {
        color: #1c0000;
        text-transform: none;
        text-decoration: none;
      }

      .dark-mode &:hover {
        color: #757575;
      }
    }
  }
}

.dark-mode main {
  background: rgb(0, 0, 0);

  .data {
    opacity: 0.4 !important;
  }
}
</style>
