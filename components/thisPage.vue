<template>
  <p
    class="about"
    :style="{
      '--page-link-light': props.color.light,
      '--page-link-dark': props.color.dark,
    }"
  >
    <NuxtLink to="/"
      ><small>Home /</small><span><slot /></span
    ></NuxtLink>
  </p>
</template>

<script setup>
const props = defineProps({
  page: String,
  color: {
    type: Object,
    default: () => ({
      light: "#000000",
      dark: "#ffffff",
    }),
  },
});
</script>

<style lang="scss" scoped>
a {
  color: var(--page-link-light);
  text-decoration: none;
  &:visited {
    color: var(--page-link-light);
  }
}

.dark-mode a {
  &,
  &:visited {
    color: var(--page-link-dark);
  }
}
.about {
  padding-top: 12px;
  padding-bottom: 12px;
  font-size: x-large;
  text-transform: uppercase;
  position: relative;
  display: inline-block;
  span {
    transition:
      opacity 0.3s ease,
      color 0.3s ease,
      transform 0.3s ease;
  }
  &:hover {
    a,
    span {
      color: #38e7cd;
    }
  }
  &::after {
    content: "→";
    position: absolute;
    right: -20px;
    top: 50%;
    transform: translateY(-50%) translateX(-5px);
    opacity: 0;
    color: rgb(215 215 215);
    transition:
      opacity 0.3s ease,
      color 0.3s ease,
      transform 0.3s ease;
  }
  small {
    transition:
      opacity 0.3s ease,
      color 0.3s ease,
      transform 0.3s ease;
    color: #000;
  }

  &:hover::after {
    opacity: 1;
    transform: translateY(-50%) translateX(0);
  }

  small {
    color: #a2a2a2;
    font-size: initial;
    padding-right: 10px;
  }
}
</style>
