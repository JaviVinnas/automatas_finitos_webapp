<script lang="ts">
  import {
    Header,
    HeaderNav,
    HeaderNavItem,
    SkipToContent,
    Content,
    Grid,
    Row,
    Column,
  } from "carbon-components-svelte";
  import AnalisisLexico from './pages/AnalisisLexico.svelte'
  import AnalisisSintactico from './pages/AnalisisSintactico.svelte'
  let isSideNavOpen = false;
  let page: "lexico" | "sintactico" = "lexico";
</script>

<svelte:head>
  <link
    rel="stylesheet"
    href="https://unpkg.com/carbon-components-svelte@0.42.2/css/all.css"
  />
</svelte:head>

<Header
  company="Javi Viñas"
  platformName="Compiladores utils"
  bind:isSideNavOpen
>
  <div slot="skip-to-content">
    <SkipToContent />
  </div>

  <HeaderNav>
    <HeaderNavItem on:focus={() => (page = "lexico")} text="Análisis léxico" />
    <HeaderNavItem
      on:focus={() => (page = "sintactico")}
      text="Análisis sintáctico"
    />
  </HeaderNav>
</Header>

{#if page === "lexico"}
<AnalisisLexico />
{:else}
<AnalisisSintactico />
{/if}
